import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import BugList from '../BugList';

describe('BugList Component', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Login button not working',
      description: 'The login button on the homepage does not respond to clicks',
      severity: 'high',
      status: 'open',
      createdBy: 'user@example.com',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      _id: '2',
      title: 'Search feature slow',
      description: 'The search feature takes too long to return results',
      severity: 'medium',
      status: 'in-progress',
      createdBy: 'developer@example.com',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ];

  test('renders bug list with all bugs', () => {
    render(<BugList bugs={mockBugs} onDelete={() => {}} onStatusChange={() => {}} />);

    expect(screen.getByText('Login button not working')).toBeInTheDocument();
    expect(screen.getByText('Search feature slow')).toBeInTheDocument();
  });

  test('displays empty state when no bugs exist', () => {
    render(<BugList bugs={[]} onDelete={() => {}} onStatusChange={() => {}} />);

    expect(screen.getByText(/no bugs reported yet/i)).toBeInTheDocument();
  });

  test('displays loading state', () => {
    render(<BugList bugs={mockBugs} onDelete={() => {}} onStatusChange={() => {}} isLoading={true} />);

    expect(screen.getByText(/loading bugs/i)).toBeInTheDocument();
    expect(screen.queryByText('Login button not working')).not.toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    render(<BugList bugs={mockBugs} onDelete={handleDelete} onStatusChange={() => {}} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  test('calls onStatusChange when status is updated', async () => {
    const user = userEvent.setup();
    const handleStatusChange = vi.fn();
    render(<BugList bugs={mockBugs} onDelete={() => {}} onStatusChange={handleStatusChange} />);

    const statusSelects = screen.getAllByRole('combobox');
    await user.selectOptions(statusSelects[0], 'resolved');

    expect(handleStatusChange).toHaveBeenCalledWith('1', 'resolved');
  });

  test('displays bug severity with correct styling', () => {
    render(<BugList bugs={mockBugs} onDelete={() => {}} onStatusChange={() => {}} />);

    const severityBadges = screen.getAllByText(/HIGH|MEDIUM/);
    expect(severityBadges.length).toBeGreaterThan(0);
  });

  test('displays bug metadata correctly', () => {
    render(<BugList bugs={mockBugs} onDelete={() => {}} onStatusChange={() => {}} />);

    expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/developer@example.com/)).toBeInTheDocument();
  });
});