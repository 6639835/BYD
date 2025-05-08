'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-dark
                transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!isLoading}
    >
      <div className="flex flex-col items-center">
        <div className="mb-6 w-24 h-24 relative">
          <Image
            src="/byd-logo.png"
            alt="BYD Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-primary border-r-primary-light border-b-secondary border-l-secondary-light rounded-full animate-spin"></div>
        </div>
        <div className="mt-4 text-white/80 text-lg">加载中...</div>
      </div>
    </div>
  );
} 