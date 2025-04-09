import React from 'react';
import { render, screen } from '@testing-library/react';
import Search from '@/app/search/page';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] }),
  })
) as jest.Mock;

describe('Search', () => {
  it('renders the search page title', () => {
    render(<Search />);
    expect(screen.getByText('Search Waiting List History')).toBeInTheDocument();
  });

  it('renders the search form', () => {
    render(<Search />);
    expect(screen.getByPlaceholderText('Search by puppy name, owner name, or service')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
});
