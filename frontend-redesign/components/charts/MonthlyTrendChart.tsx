'use client';

import { useMemo } from 'react';
import { useSales } from '@/contexts/SalesContext';
import BaseChart from './BaseChart';

export default function MonthlyTrendChart() {
  const { currentData, currentPeriod } = useSales();
  
  const chartOptions = useMemo(() => {
    const { monthlyTrend, models } = currentData;
    
    // Get months, ordered by period
    const months = Object.keys(monthlyTrend);
    
    // Get top 5 models
    const topModels = models.slice(0, 5);
    
    // Create series data for each model
    const series = topModels.map((model, modelIndex) => {
      // Get monthly data for this model
      const data = months.map(month => monthlyTrend[month][modelIndex]);
      
      return {
        name: model,
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series',
        },
        lineStyle: {
          width: 3,
        },
        showSymbol: false,
        data: data,
      };
    });
    
    return {
      title: {
        text: `${currentPeriod} 月度销量趋势 (前5车型)`,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: 14,
          fontWeight: 'normal',
        },
        left: 'center',
        top: 0,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: topModels,
        bottom: 0,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
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
      yAxis: {
        type: 'value',
        name: '销量（辆）',
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
          formatter: (value: number) => {
            return value >= 10000 ? `${value / 10000}万` : value;
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
      series: series,
    };
  }, [currentData, currentPeriod]);

  return (
    <div className="h-full">
      <BaseChart options={chartOptions} className="h-[320px]" />
    </div>
  );
} 