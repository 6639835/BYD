'use client';

import Image from 'next/image';
import { scrollToSection } from '@/utils/helpers';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <section id="hero-section" className="section hero-section flex items-center justify-center min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-dark-surface/50 to-dark pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-80 h-80 bg-primary/20 rounded-full filter blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-60 h-60 bg-secondary/20 rounded-full filter blur-[60px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container">
        <motion.header 
          ref={ref}
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: inView ? 1 : 0,
            y: inView ? 0 : 30,
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="mb-6 w-24 h-24 mx-auto relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Image
              src="/byd-logo.png"
              alt="BYD Logo"
              fill
              className="object-contain filter drop-shadow-glow transition-transform duration-500 hover:scale-105"
              priority
            />
            <div className="absolute -inset-4 bg-primary/10 rounded-full animate-ping-slow opacity-75"></div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold leading-tight mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <span className="relative">
              比亚迪汽车
              <span className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl rounded-lg -z-10"></span>
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-secondary">
              2024年销量排行榜
            </span>
          </motion.h1>
          
          <motion.div 
            className="subtitle text-xl md:text-2xl text-white/70 max-w-3xl mx-auto relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            引领新能源汽车革命，打造绿色交通未来
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary-light/50 to-transparent rounded-full"></div>
          </motion.div>
          
          <motion.div
            className="flex justify-center mt-12 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => scrollToSection('#dashboard')}
            >
              查看数据
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="btn btn-ghost"
              onClick={() => scrollToSection('#compare-section')}
            >
              车型对比分析
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6l4 4-4 4M8 18l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
        </motion.header>
        
        <div className="mt-16">
          <PeriodSelector />
        </div>
        
        <motion.div 
          className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer hover:translate-y-1 transition-transform duration-300"
          onClick={() => scrollToSection('#dashboard')}
          aria-label="向下滚动到销量数据部分"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 0, 5, 5] }}
          transition={{ 
            opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
        >
          <span className="text-sm text-white/60 uppercase tracking-wider mb-3 relative before:content-[''] before:absolute before:top-1/2 before:w-8 before:h-px before:bg-white/20 before:right-full before:-mr-3 after:content-[''] after:absolute after:top-1/2 after:w-8 after:h-px after:bg-white/20 after:left-full after:-ml-3">
            向下探索
          </span>
          <div className="w-5 h-5 border-r-2 border-b-2 border-white/60 transform rotate-45 animate-scroll-down"></div>
        </motion.div>
      </div>
    </section>
  );
}

// Import at the top to avoid circular dependencies
import PeriodSelector from '../PeriodSelector';