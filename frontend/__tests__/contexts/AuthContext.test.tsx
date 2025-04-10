import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
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

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout, register, error } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      {user && (
        <div data-testid="user-info">
          {user.username} - {user.role}
        </div>
      )}
      {error && <div data-testid="error">{error}</div>}
      <button 
        data-testid="login-button" 
        onClick={() => login('testuser', 'password')}
      >
        Login
      </button>
      <button 
        data-testid="register-button" 
        onClick={() => register('newuser', 'password', 'user')}
      >
        Register
      </button>
      <button 
        data-testid="logout-button" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'mock-token',
        user: { id: 1, username: 'testuser', role: 'user' },
      }),
    });
  });
  
  it('should provide authentication context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });
  
  it('should handle login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ username: 'testuser', password: 'password' }),
        })
      );
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ id: 1, username: 'testuser', role: 'user' })
      );
      
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - user');
    });
  });
  
  it('should handle login failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });
  });
  
  it('should handle registration successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByTestId('register-button'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ username: 'newuser', password: 'password', role: 'user' }),
        })
      );
      
      // After successful registration, login is called
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.any(Object)
      );
      
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });
  
  it('should handle logout', async () => {
    // Setup authenticated state
    localStorageMock.setItem('token', 'mock-token');
    localStorageMock.setItem('user', JSON.stringify({ id: 1, username: 'testuser', role: 'user' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Verify authenticated state
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    
    // Logout
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // Verify logged out state
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });
  
  it('should initialize from localStorage', () => {
    // Setup authenticated state in localStorage
    localStorageMock.setItem('token', 'mock-token');
    localStorageMock.setItem('user', JSON.stringify({ id: 1, username: 'testuser', role: 'user' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Verify authenticated state is loaded from localStorage
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - user');
  });
});
