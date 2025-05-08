'use client';

import { useMemo, useEffect, useState } from 'react';
import { useSales } from '@/contexts/SalesContext';
import BaseChart from './BaseChart';
import { getChartColors } from '@/utils/helpers';

export default function ComparisonChart() {
  const { currentData, compareModels, currentPeriod } = useSales();
  const [refreshKey, setRefreshKey] = useState(0);

  // Re-render the chart when compareModels changes
  useEffect(() => {
    // Add a small delay to ensure data is ready
    const timer = setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [compareModels, currentPeriod]);
  
  const chartOptions = useMemo(() => {
    const { models, sales, monthlyTrend } = currentData;
    
    // Get data for comparison models
    const comparisonData = compareModels.map(model => {
      if (!model) return null;
      
      const modelIndex = models.indexOf(model);
      if (modelIndex === -1) return null;
      
      // Get model sales
      const modelSales = sales[modelIndex];
      
      // Get monthly data
      const monthlyData = Object.entries(monthlyTrend).map(([month, values]) => ({
        month,
        value: values[modelIndex],
      }));
      
      return {
        name: model,
        totalSales: modelSales,
        monthlyData,
      };
    }).filter(Boolean);
    
    // Extract months from trend data
    const months = Object.keys(monthlyTrend);
    
    // Create radar chart data
    const radarIndicator = [
      { name: '总销量', max: Math.max(...sales) * 1.2 },
      { name: '月均增长', max: 30 },
      { name: '同比表现', max: 100 },
      { name: '市场份额', max: 30 },
      { name: '增长潜力', max: 100 },
    ];
    
    // Create fake radar data based on real sales data
    const radarData = comparisonData.map(model => {
      if (!model) return { value: [0, 0, 0, 0, 0], name: '' };
      
      const totalScore = model.totalSales / Math.max(...sales) * 100;
      const monthlyGrowth = Math.random() * 20 + 5; // random growth between 5-25%
      const yearOverYear = Math.random() * 40 + 60; // random YoY performance between 60-100
      const marketShare = (model.totalSales / sales.reduce((a, b) => a + b, 0)) * 100;
      const growthPotential = Math.random() * 40 + 60; // random potential between 60-100
      
      return {
        value: [
          model.totalSales,
          monthlyGrowth,
          yearOverYear,
          marketShare,
          growthPotential,
        ],
        name: model.name,
      };
    });
    
    // Create bar chart options for monthly comparison
    const barSeries = comparisonData.map(model => {
      if (!model) return null;
      
      return {
        name: model.name,
        type: 'bar',
        data: model.monthlyData.map(m => m.value),
        emphasis: {
          focus: 'series',
        },
      };
    }).filter(Boolean);
    
    return {
      // Basic grid layout with two charts
      grid: [
        { left: '5%', right: '55%', bottom: '15%', top: '5%', containLabel: true },
        { left: '55%', right: '5%', bottom: '15%', top: '5%', containLabel: true },
      ],
      
      // Tooltips
      tooltip: {
        trigger: 'item',
      },
      
      // Legend
      legend: {
        data: comparisonData.map(m => m?.name || ''),
        bottom: 0,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      
      // Radar chart
      radar: {
        indicator: radarIndicator,
        center: ['25%', '50%'],
        radius: '70%',
        splitNumber: 5,
        axisName: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.05)'],
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      
      // Bar chart x-axis
      xAxis: [
        {
          gridIndex: 1,
          type: 'category',
          data: months,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      ],
      
      // Bar chart y-axis
      yAxis: [
        {
          gridIndex: 1,
          type: 'value',
          name: '销量（辆）',
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            formatter: (value: number) => {
              return value >= 10000 ? `${value / 10000}万` : value;
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
      ],
      
      // Series for both charts
      series: [
        {
          type: 'radar',
          data: radarData,
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            lineStyle: {
              width: 4,
            },
          },
          areaStyle: {
            opacity: 0.1,
          },
        },
        ...barSeries.map((series, index) => ({
          ...series,
          xAxisIndex: 1,
          yAxisIndex: 1,
        })),
      ],
    };
  }, [currentData, compareModels, currentPeriod]);

  // Add refresh button
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-title">
        <span className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M21 3v5h-5M3 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 6.3A10 10 0 114.3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          车型对比分析
        </span>
        <button 
          className="flex items-center gap-1 text-sm bg-white/5 hover:bg-white/10 py-1 px-3 rounded-full transition-colors" 
          onClick={handleRefresh}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 16H2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          刷新
        </button>
      </div>
      <div className="w-full h-[550px]">
        <BaseChart key={`comparison-chart-${refreshKey}`} options={chartOptions} className="h-[550px]" />
      </div>
    </div>
  );
} 