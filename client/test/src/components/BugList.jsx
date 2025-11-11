import React from 'react';

const BugList = ({ bugs, onDelete, onStatusChange, isLoading = false }) => {
  if (isLoading) {
    return <div className="loading">Loading bugs...</div>;
  }

  if (!bugs || bugs.length === 0) {
    return <div className="empty-state">No bugs reported yet. Great job!</div>;
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#ffc107',
      medium: '#ff9800',
      high: '#ff5722',
      critical: '#f44336'
    };
    return colors[severity] || '#2196f3';
  };

  return (
    <div className="bug-list">
      {bugs.map(bug => (
        <div key={bug._id} className="bug-card" data-testid={`bug-card-${bug._id}`}>
          <div className="bug-header">
            <h3>{bug.title}</h3>
            <span
              className="severity-badge"
              style={{ backgroundColor: getSeverityColor(bug.severity) }}
            >
              {bug.severity.toUpperCase()}
            </span>
          </div>

          <p className="bug-description">{bug.description}</p>

          <div className="bug-meta">
            <span>Status: <strong>{bug.status}</strong></span>
            <span>Reported by: <strong>{bug.createdBy}</strong></span>
            {bug.createdAt && <span>Date: {new Date(bug.createdAt).toLocaleDateString()}</span>}
          </div>

          <div className="bug-actions">
            <select
              value={bug.status}
              onChange={(e) => onStatusChange(bug._id, e.target.value)}
              className="status-select"
              aria-label={`Update status for ${bug.title}`}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <button
              onClick={() => onDelete(bug._id)}
              className="delete-btn"
              aria-label={`Delete bug ${bug.title}`}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BugList;