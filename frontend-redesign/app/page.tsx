'use client';

import { useState, useEffect } from 'react';
import ParticlesBackground from '@/components/ui/ParticlesBackground';
import NavigationDots from '@/components/ui/NavigationDots';
import PageLoader from '@/components/ui/PageLoader';
import HeroSection from '@/components/sections/HeroSection';
import DashboardSection from '@/components/sections/DashboardSection';
import DetailSection from '@/components/sections/DetailSection';
import CompareSection from '@/components/sections/CompareSection';
import Footer from '@/components/Footer';
import { SalesProvider } from '@/contexts/SalesContext';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Ensure components only render on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SalesProvider>
      <main className="min-h-screen relative">
        {/* Background */}
        <ParticlesBackground />
        
        {/* Page Loader */}
        <PageLoader />
        
        {/* Navigation Dots */}
        <NavigationDots />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Dashboard Section */}
        <DashboardSection />
        
        {/* Detail Section */}
        <DetailSection />
        
        {/* Compare Section */}
        <CompareSection />
        
        {/* Footer */}
        <Footer />
      </main>
    </SalesProvider>
  );
} 