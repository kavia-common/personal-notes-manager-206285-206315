import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app main layout with notes list and editor', () => {
  render(<App />);
  // Check for header/title and main components
  expect(screen.getByText(/personal notes/i)).toBeInTheDocument();
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByLabelText(/notes list/i)).toBeInTheDocument();
  // at startup, editor should prompt for selection
  expect(screen.getByText(/select a note/i)).toBeInTheDocument();
});
