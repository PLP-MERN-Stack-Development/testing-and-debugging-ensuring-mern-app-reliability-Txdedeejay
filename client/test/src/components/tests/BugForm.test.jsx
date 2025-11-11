import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import BugForm from '../BugForm';

describe('BugForm Component', () => {
  test('renders all form fields', () => {
    render(<BugForm onSubmit={() => {}} />);

    expect(screen.getByLabelText(/bug title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/severity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /report bug/i })).toBeInTheDocument();
  });

  test('calls onSubmit with form data on valid submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BugForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/bug title/i), 'Login Button Issue');
    await user.type(screen.getByLabelText(/description/i), 'The login button does not respond to clicks');
    await user.selectOptions(screen.getByLabelText(/severity/i), 'high');
    await user.type(screen.getByLabelText(/your name/i), 'John Doe');
    await user.click(screen.getByRole('button', { name: /report bug/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Login Button Issue',
      description: 'The login button does not respond to clicks',
      severity: 'high',
      createdBy: 'John Doe'
    });
  });

  test('displays validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={() => {}} />);

    await user.click(screen.getByRole('button', { name: /report bug/i }));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Your name is required')).toBeInTheDocument();
  });

  test('displays error for title too short', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText(/bug title/i), 'Bug');
    await user.type(screen.getByLabelText(/description/i), 'This is a valid description for the form');
    await user.type(screen.getByLabelText(/your name/i), 'John');
    await user.click(screen.getByRole('button', { name: /report bug/i }));

    expect(screen.getByText(/title must be at least 5 characters/i)).toBeInTheDocument();
  });

  test('displays error for description too short', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText(/bug title/i), 'Valid Title');
    await user.type(screen.getByLabelText(/description/i), 'Short');
    await user.type(screen.getByLabelText(/your name/i), 'John');
    await user.click(screen.getByRole('button', { name: /report bug/i }));

    expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
  });

  test('clears errors when user types in field', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={() => {}} />);

    await user.click(screen.getByRole('button', { name: /report bug/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/bug title/i), 'Valid Title Here');
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });

  test('disables button when loading', () => {
    render(<BugForm onSubmit={() => {}} isLoading={true} />);

    const button = screen.getByRole('button', { name: /submitting/i });
    expect(button).toBeDisabled();
  });

  test('clears form after successful submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BugForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/bug title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const nameInput = screen.getByLabelText(/your name/i);

    await user.type(titleInput, 'Valid Bug Title');
    await user.type(descriptionInput, 'This is a valid description for testing');
    await user.type(nameInput, 'Jane Doe');
    await user.click(screen.getByRole('button', { name: /report bug/i }));

    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
    expect(nameInput).toHaveValue('');
  });
});