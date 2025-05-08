'use client';

import { useState, useEffect, useRef } from 'react';
import { formatNumber } from '@/utils/helpers';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface KpiCardProps {
  title: string;
  value: number | string;
  change?: string;
  isPositive?: boolean;
  delay?: number;
  icon?: React.ReactNode;
}

export default function KpiCard({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  delay = 0,
  icon
}: KpiCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isNumber = typeof value === 'number';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Format value if it's a number
  const formattedValue = isNumber ? formatNumber(value) : value;
  
  // Add percentage sign if needed
  const displayValue = isNumber && title.includes('百分') 
    ? `${formattedValue}%` 
    : formattedValue;

  // Generate random light positions for the glass effect
  const lightPosition = {
    x: Math.random() * 100,
    y: Math.random() * 100
  };

  return (
    <motion.div 
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div 
        className="kpi-card group"
      >
        {/* Glass reflection effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,0.15), transparent 60%)`,
          }}
        />
        
        <div className="flex justify-between items-start mb-2">
          <div className="kpi-title text-white/60 text-sm uppercase tracking-wider">{title}</div>
          {icon && <div className="text-primary-light">{icon}</div>}
        </div>
        
        <div className="kpi-value text-3xl sm:text-4xl font-bold mb-2">
          {isNumber ? (
            <CountUp
              end={isNumber ? (value as number) : 0}
              formattingFn={num => {
                const formatted = formatNumber(num);
                return title.includes('百分') ? `${formatted}%` : formatted;
              }}
              duration={2}
              separator=","
              delay={delay + 0.2}
            />
          ) : (
            displayValue
          )}
        </div>
        
        {change && (
          <div className={`kpi-change text-sm flex items-center gap-1 ${isPositive ? 'text-success' : 'text-error'}`}>
            <span className={`flex items-center justify-center w-5 h-5 rounded-full ${isPositive ? 'bg-success/20' : 'bg-error/20'}`}>
              {isPositive ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19V5M12 5l7 7M12 5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            {change}
          </div>
        )}
        
        {/* Bottom indicator bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </div>
    </motion.div>
  );
} 