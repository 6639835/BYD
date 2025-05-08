'use client';

import Image from 'next/image';
import { scrollToSection } from '@/utils/helpers';

export default function HeroSection() {
  return (
    <section id="hero-section" className="section hero-section flex items-center justify-center min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-radial from-dark-surface/50 to-dark pointer-events-none"></div>
      
      <div className="container">
        <header className="text-center max-w-4xl mx-auto">
          <div className="mb-6 w-24 h-24 mx-auto relative">
            <Image
              src="/byd-logo.png"
              alt="BYD Logo"
              fill
              className="object-contain filter drop-shadow-glow transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            比亚迪汽车<br />2024年销量排行榜
          </h1>
          
          <div className="subtitle text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
            引领新能源汽车革命，打造绿色交通未来
          </div>
        </header>
        
        <div className="mt-16">
          <PeriodSelector />
        </div>
        
        <div 
          className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer hover:translate-y-1 transition-transform duration-300"
          onClick={() => scrollToSection('#dashboard')}
          aria-label="向下滚动到销量数据部分"
        >
          <span className="text-sm text-white/60 uppercase tracking-wider mb-3 relative before:content-[''] before:absolute before:top-1/2 before:w-8 before:h-px before:bg-white/20 before:right-full before:-mr-3 after:content-[''] after:absolute after:top-1/2 after:w-8 after:h-px after:bg-white/20 after:left-full after:-ml-3">
            向下探索
          </span>
          <div className="w-5 h-5 border-r-2 border-b-2 border-white/60 transform rotate-45 animate-scroll-down"></div>
        </div>
      </div>
    </section>
  );
}

// Import at the top to avoid circular dependencies
import PeriodSelector from '../PeriodSelector';