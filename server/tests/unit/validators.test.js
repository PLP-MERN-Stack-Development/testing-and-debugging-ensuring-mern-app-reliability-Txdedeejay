const { validateBugData, validateEmail } = require('../../utils/validators');

describe('Bug Validators Unit Tests', () => {
  describe('validateBugData', () => {
    test('should validate correct bug data', () => {
      const validBug = {
        title: 'Login button not working',
        description: 'The login button on the homepage does not respond to clicks',
        severity: 'high',
        status: 'open',
        createdBy: 'user@example.com'
      };

      const result = validateBugData(validBug);
      expect(result).toEqual(validBug);
    });

    test('should throw error for missing title', () => {
      const invalidBug = {
        description: 'A valid description here',
        createdBy: 'user@example.com'
      };

      expect(() => validateBugData(invalidBug)).toThrow('Title is required');
    });

    test('should throw error for title too short', () => {
      const invalidBug = {
        title: 'Bug',
        description: 'A valid description here',
        createdBy: 'user@example.com'
      };

      expect(() => validateBugData(invalidBug)).toThrow('Title must be at least 5 characters');
    });

    test('should throw error for title too long', () => {
      const invalidBug = {
        title: 'a'.repeat(101),
        description: 'A valid description here',
        createdBy: 'user@example.com'
      };

      expect(() => validateBugData(invalidBug)).toThrow('Title cannot exceed 100 characters');
    });

    test('should throw error for invalid severity', () => {
      const invalidBug = {
        title: 'Valid Title',
        description: 'A valid description here',
        severity: 'invalid-severity',
        createdBy: 'user@example.com'
      };

      expect(() => validateBugData(invalidBug)).toThrow('Invalid severity level');
    });

    test('should trim whitespace from title and description', () => {
      const bugData = {
        title: '  Login Issue  ',
        description: '  Button does not work properly  ',
        createdBy: 'user@example.com'
      };

      const result = validateBugData(bugData);
      expect(result.title).toBe('Login Issue');
      expect(result.description).toBe('Button does not work properly');
    });

    test('should set default values for severity and status', () => {
      const bugData = {
        title: 'Valid Title Here',
        description: 'A valid description here',
        createdBy: 'user@example.com'
      };

      const result = validateBugData(bugData);
      expect(result.severity).toBe('medium');
      expect(result.status).toBe('open');
    });
  });

  describe('validateEmail', () => {
    test('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });
});