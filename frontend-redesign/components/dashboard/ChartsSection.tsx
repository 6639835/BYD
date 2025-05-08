'use client';

import { useState, useRef } from 'react';
import SalesRankChart from '../charts/SalesRankChart';
import SalesTypeChart from '../charts/SalesTypeChart';
import MonthlyTrendChart from '../charts/MonthlyTrendChart';

export default function ChartsSection() {
  // Handle chart refresh actions
  const [refreshKey, setRefreshKey] = useState(0);
  const currentChart = useRef<string>('');
  
  const handleRefresh = (chartId: string) => {
    currentChart.current = chartId;
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card">
        <div className="card-title">
          <span>车型销量排行 TOP 10</span>
          <button 
            className="flex items-center gap-1 text-sm bg-white/5 hover:bg-white/10 py-1 px-3 rounded-full transition-colors" 
            onClick={() => handleRefresh('sales-rank')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 16H2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            刷新
          </button>
        </div>
        <SalesRankChart key={`sales-rank-${refreshKey}`} />
      </div>
      
      <div className="lg:col-span-1 grid grid-rows-2 gap-6">
        <div className="card">
          <div className="card-title">
            <span>销量类型分布</span>
            <button 
              className="flex items-center gap-1 text-sm bg-white/5 hover:bg-white/10 py-1 px-3 rounded-full transition-colors" 
              onClick={() => handleRefresh('sales-type')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 16H2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              刷新
            </button>
          </div>
          <SalesTypeChart key={`sales-type-${refreshKey}`} />
        </div>
        
        <div className="card">
          <div className="card-title">
            <span>月度销量趋势</span>
            <button 
              className="flex items-center gap-1 text-sm bg-white/5 hover:bg-white/10 py-1 px-3 rounded-full transition-colors" 
              onClick={() => handleRefresh('monthly-trend')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 16H2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              刷新
            </button>
          </div>
          <MonthlyTrendChart key={`monthly-trend-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
} 