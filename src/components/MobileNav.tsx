"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  logout?: () => void;
}

export default function MobileNav({ isOpen, onClose, isAuthenticated = false, logout }: MobileNavProps) {
  const pathname = usePathname();
  
  // Close the menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Close the menu when changing routes
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Close the menu when clicking a link
  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    if (logout) {
      logout();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Menu panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <div className="flex items-center">
            <span className="text-3xl mr-2">🐶</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Puppy Spa
            </span>
          </div>
          <button 
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-6 px-4 pb-6 flex-1 overflow-y-auto">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={handleLinkClick}
              className={`px-3 py-3 rounded-md text-base font-medium ${
                pathname === '/' 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Today's Queue
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  href="/add-puppy"
                  onClick={handleLinkClick}
                  className={`px-3 py-3 rounded-md text-base font-medium ${
                    pathname === '/add-puppy' 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Add Puppy
                </Link>
                <Link
                  href="/add-entry"
                  onClick={handleLinkClick}
                  className={`px-3 py-3 rounded-md text-base font-medium ${
                    pathname === '/add-entry' 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Add to Queue
                </Link>
                <Link
                  href="/history"
                  onClick={handleLinkClick}
                  className={`px-3 py-3 rounded-md text-base font-medium ${
                    pathname === '/history' 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  History
                </Link>
                <Link
                  href="/search"
                  onClick={handleLinkClick}
                  className={`px-3 py-3 rounded-md text-base font-medium ${
                    pathname === '/search' 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Search
                </Link>
                <Link
                  href="/statistics"
                  onClick={handleLinkClick}
                  className={`px-3 py-3 rounded-md text-base font-medium ${
                    pathname === '/statistics' 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Statistics
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full px-3 py-3 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="mt-4 block text-center px-3 py-3 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
        
        <div className="px-4 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            "Dogs leave paw prints on our hearts." 🐾
          </p>
        </div>
      </div>
    </div>
  );
}
