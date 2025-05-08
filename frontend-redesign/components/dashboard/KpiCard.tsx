'use client';

import { useState, useEffect, useRef } from 'react';
import { formatNumber } from '@/utils/helpers';

interface KpiCardProps {
  title: string;
  value: number | string;
  change?: string;
  isPositive?: boolean;
  delay?: number;
}

export default function KpiCard({ title, value, change, isPositive = true, delay = 0 }: KpiCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
  const formattedValue = typeof value === 'number' ? formatNumber(value) : value;
  
  // Add percentage sign if needed
  const displayValue = typeof value === 'number' && title.includes('百分') 
    ? `${formattedValue}%` 
    : formattedValue;

  return (
    <div 
      ref={cardRef}
      className={`kpi-card bg-card border border-border rounded-2xl p-6 flex flex-col transition-all
                hover:shadow-glow hover:border-primary/30 hover:translate-y-[-5px]
                ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="kpi-title text-white/60 text-sm uppercase tracking-wider mb-3">{title}</div>
      <div className="kpi-value text-3xl sm:text-4xl font-bold mb-2">{displayValue}</div>
      {change && (
        <div className={`kpi-change text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
          {change}
        </div>
      )}
    </div>
  );
} 