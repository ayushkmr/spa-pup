import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '@/app/signup/page';
import { AuthProvider } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

describe('SignupPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock successful registration
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/auth/register')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 1, username: 'newuser', role: 'user' }),
        });
      }

      // Mock successful login after registration
      return Promise.resolve({
        ok: true,
        json: async () => ({
          access_token: 'mock-token',
          user: { id: 1, username: 'newuser', role: 'user' },
        }),
      });
    });
  });

  it('should render signup form', () => {
    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );

    expect(screen.getByText('Puppy Spa')).toBeInTheDocument();
    expect(screen.getByText('Create a new receptionist account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ username: 'newuser', password: 'password123', role: 'user' }),
        })
      );

      // After successful registration, login is called
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.any(Object)
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ id: 1, username: 'newuser', role: 'user' })
      );

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should handle form validation', async () => {
    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );

    // Get form elements
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign up' });

    // Test empty username validation
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Verify form was not submitted (fetch not called)
    expect(global.fetch).not.toHaveBeenCalled();

    // Test empty password validation
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    // Verify form was not submitted (fetch not called)
    expect(global.fetch).not.toHaveBeenCalled();

    // Test short password validation
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'pass' } });
    fireEvent.click(submitButton);

    // Verify form was not submitted (fetch not called)
    expect(global.fetch).not.toHaveBeenCalled();

    // Test password mismatch validation
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    // Verify form was not submitted (fetch not called)
    expect(global.fetch).not.toHaveBeenCalled();

    // Test valid form submission
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Verify form was submitted (fetch called)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.any(Object)
      );
    });
  });

  it('should display error message on registration failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Username already exists' }),
    });

    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => {
      expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });

  it('should redirect to home if already authenticated', async () => {
    // Setup authenticated state in localStorage
    localStorageMock.setItem('token', 'mock-token');
    localStorageMock.setItem('user', JSON.stringify({ id: 1, username: 'testuser', role: 'user' }));

    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
