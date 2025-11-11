import React, { useState } from 'react';

const BugForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    createdBy: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = 'Your name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        createdBy: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bug-form">
      <div className="form-group">
        <label htmlFor="title">Bug Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief description of the bug"
          className={errors.title ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the bug"
          className={errors.description ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="severity">Severity Level</label>
        <select
          id="severity"
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="createdBy">Your Name *</label>
        <input
          id="createdBy"
          type="text"
          name="createdBy"
          value={formData.createdBy}
          onChange={handleChange}
          placeholder="Your name"
          className={errors.createdBy ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.createdBy && <span className="error-message">{errors.createdBy}</span>}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Report Bug'}
      </button>
    </form>
  );
};

export default BugForm;