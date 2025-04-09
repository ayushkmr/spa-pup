"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// This is a workaround for react-beautiful-dnd not supporting React 19 yet
// It ensures that the DnD components are only rendered on the client side
const DndProviderWithNoSSR = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Apply the patch for react-beautiful-dnd to work with React 19
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.React = React;
    }
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shifts
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
};

// Export a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(DndProviderWithNoSSR), {
  ssr: false,
});
