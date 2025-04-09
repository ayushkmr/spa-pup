import React from 'react';
import { render, screen } from '@testing-library/react';
import Statistics from '@/app/statistics/page';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] }),
  })
) as jest.Mock;

describe('Statistics', () => {
  it('renders the statistics page loading state', () => {
    const { container } = render(<Statistics />);

    // Check that the loading spinner exists
    const loadingSpinner = container.querySelector('.animate-spin');
    expect(loadingSpinner).toBeTruthy();
  });
});
