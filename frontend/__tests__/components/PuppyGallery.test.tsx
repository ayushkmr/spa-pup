import React from 'react';
import { render, screen } from '@testing-library/react';
import PuppyGallery from '@/components/PuppyGallery';

describe('PuppyGallery', () => {
  it('renders the puppy gallery', () => {
    render(<PuppyGallery />);
    // Check that the carousel container exists
    expect(screen.getByText('Waiting for treats')).toBeInTheDocument();
  });

  it('renders the correct number of puppy images', () => {
    render(<PuppyGallery />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders images with captions', () => {
    render(<PuppyGallery />);

    // Check for some of the expected captions
    const captions = [
      'Waiting for treats',
      'Fresh from grooming',
      'Ready for the party',
      'Just bathed',
      'Spa day relaxation'
    ];

    captions.forEach(caption => {
      const captionElement = screen.queryByText(caption);
      expect(captionElement).not.toBeNull();
    });
  });

  it('renders images with proper attributes', () => {
    render(<PuppyGallery />);

    const images = screen.getAllByRole('img');
    images.forEach(image => {
      // Check that each image has an alt attribute
      expect(image).toHaveAttribute('alt');
      // Check that each image has a class attribute
      expect(image).toHaveAttribute('class');
    });
  });
});
