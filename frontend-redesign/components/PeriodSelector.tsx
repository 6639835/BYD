'use client';

import { useSales } from '@/contexts/SalesContext';
import { Period } from '@/types';
import { KeyboardEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const periods: { id: Period; label: string }[] = [
  { id: '2024-Q1', label: '2024年Q1' },
  { id: '2023-Q4', label: '2023年Q4' },
  { id: '2023-Q3', label: '2023年Q3' },
  { id: '2023-Q2', label: '2023年Q2' },
];

export default function PeriodSelector() {
  const { currentPeriod, setCurrentPeriod } = useSales();
  const [hovered, setHovered] = useState<Period | null>(null);

  return (
    <motion.div 
      className="period-selector bg-card/70 backdrop-blur-xl rounded-2xl p-4 max-w-xl mx-auto mb-12 border border-border shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
      <div className="selector-label text-center text-white/70 mb-4 font-medium">选择数据周期:</div>
      <div 
        className="selector-options flex flex-wrap justify-center gap-3 relative z-10" 
        role="radiogroup" 
        aria-label="数据周期选择"
      >
        {periods.map((period) => (
          <motion.div
            key={period.id}
            className={`period-option relative px-5 py-2 rounded-xl cursor-pointer
                       ${currentPeriod === period.id ? 'text-white font-medium' : 'text-white/70'} 
                       transition-colors duration-300`}
            role="radio"
            aria-checked={currentPeriod === period.id}
            tabIndex={0}
            onClick={() => setCurrentPeriod(period.id)}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setCurrentPeriod(period.id);
              }
            }}
            onMouseEnter={() => setHovered(period.id)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {period.label}
            
            {/* Background highlight for selected or hovered item */}
            {(currentPeriod === period.id || hovered === period.id) && (
              <motion.div 
                className={`absolute inset-0 rounded-xl -z-10 ${
                  currentPeriod === period.id 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 shadow-glow'
                    : 'bg-white/5'
                }`}
                layoutId="periodHighlight"
                initial={false}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
            
            {/* Animated indicator line for selected item */}
            {currentPeriod === period.id && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-light to-secondary rounded-full"
                initial={{ width: 0, left: '50%' }}
                animate={{ width: '100%', left: '0%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 