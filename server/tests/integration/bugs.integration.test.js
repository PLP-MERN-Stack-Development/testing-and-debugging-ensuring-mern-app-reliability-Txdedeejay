const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Bug = require('../../models/Bug');

describe('Bug API Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.DATABASE_URL);
    }
  });

  afterEach(async () => {
    // Clean up test data
    await Bug.deleteMany({});
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('POST /api/bugs', () => {
    test('should create a new bug with valid data', async () => {
      const bugData = {
        title: 'Login button not responding',
        description: 'The login button on the homepage does not respond to user clicks',
        severity: 'high',
        createdBy: 'user@example.com'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe(bugData.title);
    });

    test('should reject bug with missing title', async () => {
      const bugData = {
        description: 'A valid description here',
        createdBy: 'user@example.com'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should reject bug with short description', async () => {
      const bugData = {
        title: 'Valid Title',
        description: 'Short',
        createdBy: 'user@example.com'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(bugData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/bugs', () => {
    test('should return all bugs', async () => {
      const bugsData = [
        {
          title: 'First Bug Title Here',
          description: 'This is a valid description for the first bug',
          createdBy: 'user@example.com'
        },
        {
          title: 'Second Bug Title Here',
          description: 'This is a valid description for the second bug',
          createdBy: 'user@example.com'
        }
      ];

      await Bug.insertMany(bugsData);

      const response = await request(app).get('/api/bugs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    test('should return empty array when no bugs exist', async () => {
      const response = await request(app).get('/api/bugs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/bugs/:id', () => {
    test('should return a bug by ID', async () => {
      const bugData = {
        title: 'Bug Title Here',
        description: 'This is a valid description for testing the get by id endpoint',
        createdBy: 'user@example.com'
      };

      const bug = await Bug.create(bugData);

      const response = await request(app).get(`/api/bugs/${bug._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(bug._id.toString());
    });

    test('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/bugs/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    test('should update a bug', async () => {
      const bugData = {
        title: 'Original Bug Title',
        description: 'This is the original description for the bug being updated',
        status: 'open',
        createdBy: 'user@example.com'
      };

      const bug = await Bug.create(bugData);

      const updateData = {
        title: 'Updated Bug Title',
        description: 'This is the updated description for the bug',
        status: 'in-progress'
      };

      const response = await request(app)
        .put(`/api/bugs/${bug._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe('in-progress');
    });

    test('should return 404 when updating non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send({
          title: 'Updated Title Here',
          description: 'This is an updated description for a bug'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    test('should delete a bug', async () => {
      const bugData = {
        title: 'Bug To Delete Here',
        description: 'This is a description for the bug that will be deleted',
        createdBy: 'user@example.com'
      };

      const bug = await Bug.create(bugData);

      const response = await request(app).delete(`/api/bugs/${bug._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });

    test('should return 404 when deleting non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app).delete(`/api/bugs/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});