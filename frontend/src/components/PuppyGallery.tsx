"use client";

import React, { useState, useEffect, useRef } from 'react';

// Puppy image data with the same images from the reference project
const puppyImages = [
  {
    src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800",
    alt: "Adorable puppy looking up",
    caption: "Waiting for treats"
  },
  {
    src: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?q=80&w=800",
    alt: "Puppy with a blue collar",
    caption: "Fresh from grooming"
  },
  {
    src: "https://images.unsplash.com/photo-1608096299210-db7e38487075?q=80&w=800",
    alt: "Puppy with bow tie",
    caption: "Ready for the party"
  },
  {
    src: "https://images.unsplash.com/photo-1546975490-e8b92a360b24?q=80&w=800",
    alt: "Golden retriever puppy",
    caption: "Just bathed"
  },
  {
    src: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?q=80&w=800",
    alt: "Puppy in a spa towel",
    caption: "Spa day relaxation"
  },
  {
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800",
    alt: "Two dogs running",
    caption: "Best friends forever"
  },
  {
    src: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=800",
    alt: "Puppy with a bowtie",
    caption: "Looking dapper"
  }
];

interface PuppyGalleryProps {
  className?: string;
}

const PuppyGallery: React.FC<PuppyGalleryProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? puppyImages.length - 1 : prevIndex - 1
    );
    scrollToCurrentSlide();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === puppyImages.length - 1 ? 0 : prevIndex + 1
    );
    scrollToCurrentSlide();
  };

  const scrollToCurrentSlide = () => {
    if (carouselRef.current) {
      const scrollAmount = currentIndex * (carouselRef.current.scrollWidth / puppyImages.length);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`${className} w-full`}>
      <div className="carousel-container relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-6 snap-x scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {puppyImages.map((image, index) => (
            <div
              key={index}
              className={`snap-center shrink-0 first:pl-4 last:pr-4 transition-all duration-300 ${index === currentIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}`}
            >
              <div className="w-80 md:w-96 overflow-hidden rounded-lg bg-white border shadow-md">
                <div className="relative h-64 w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-all hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-4 text-center text-base text-gray-700 font-medium">
                  {image.caption}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4 z-10">
          <button
            onClick={handlePrev}
            className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 focus:outline-none hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 focus:outline-none hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-4">
          {puppyImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
                scrollToCurrentSlide();
              }}
              className={`h-2 w-2 mx-1 rounded-full transition-all ${index === currentIndex ? 'bg-purple-600 w-4' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PuppyGallery;
