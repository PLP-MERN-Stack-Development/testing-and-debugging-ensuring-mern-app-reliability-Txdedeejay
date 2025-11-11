const User = require('../../models/User');

describe('User Model', () => {
  test('should create a user with valid data', () => {
    const userData = { email: 'test@example.com', password: 'pw123' };
    const user = new User(userData);
    
    expect(user.email).toBe('test@example.com');
  });

  test('should validate email format', () => {
    const user = new User({ email: 'invalid-email', password: 'pw123' });
    expect(() => user.validate()).toThrow();
  });
});