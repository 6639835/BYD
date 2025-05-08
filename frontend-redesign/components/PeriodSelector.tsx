'use client';

import { useSales } from '@/contexts/SalesContext';
import { Period } from '@/types';
import { KeyboardEvent } from 'react';

const periods: { id: Period; label: string }[] = [
  { id: '2024-Q1', label: '2024年Q1' },
  { id: '2023-Q4', label: '2023年Q4' },
  { id: '2023-Q3', label: '2023年Q3' },
  { id: '2023-Q2', label: '2023年Q2' },
];

export default function PeriodSelector() {
  const { currentPeriod, setCurrentPeriod } = useSales();

  return (
    <div className="period-selector bg-dark-surface/70 backdrop-blur-lg rounded-2xl p-4 max-w-xl mx-auto mb-12">
      <div className="selector-label text-center text-white/70 mb-2">选择数据周期:</div>
      <div className="selector-options flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="数据周期选择">
        {periods.map((period) => (
          <div
            key={period.id}
            className={`period-option relative ${currentPeriod === period.id ? 'active' : ''} 
                       transition-all duration-300 hover:scale-105 active:scale-95`}
            role="radio"
            aria-checked={currentPeriod === period.id}
            tabIndex={0}
            onClick={() => setCurrentPeriod(period.id)}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setCurrentPeriod(period.id);
              }
            }}
          >
            {period.label}
            {currentPeriod === period.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 