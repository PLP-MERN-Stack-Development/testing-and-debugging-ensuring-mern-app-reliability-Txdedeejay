/**
 * Validate bug data
 * @param {Object} bugData - Bug data to validate
 * @throws {Error} If validation fails
 * @returns {Object} Validated bug data
 */
const validateBugData = (bugData) => {
  const errors = [];

  if (!bugData.title || bugData.title.trim() === '') {
    errors.push('Title is required');
  } else if (bugData.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  } else if (bugData.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (!bugData.description || bugData.description.trim() === '') {
    errors.push('Description is required');
  } else if (bugData.description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (bugData.severity && !['low', 'medium', 'high', 'critical'].includes(bugData.severity)) {
    errors.push('Invalid severity level');
  }

  if (bugData.status && !['open', 'in-progress', 'resolved'].includes(bugData.status)) {
    errors.push('Invalid status');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return {
    title: bugData.title.trim(),
    description: bugData.description.trim(),
    severity: bugData.severity || 'medium',
    status: bugData.status || 'open',
    assignee: bugData.assignee || null,
    createdBy: bugData.createdBy
  };
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validateBugData,
  validateEmail
};