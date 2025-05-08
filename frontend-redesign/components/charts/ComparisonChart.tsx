'use client';

import { useMemo } from 'react';
import { useSales } from '@/contexts/SalesContext';
import BaseChart from './BaseChart';
import { getChartColors } from '@/utils/helpers';

export default function ComparisonChart() {
  const { currentData, compareModels, currentPeriod } = useSales();
  
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
        { left: '5%', right: '55%', bottom: '5%', top: '5%', containLabel: true },
        { left: '55%', right: '5%', bottom: '5%', top: '5%', containLabel: true },
      ],
      
      // Tooltips
      tooltip: {
        trigger: 'item',
      },
      
      // Legend
      legend: {
        data: comparisonData.map(m => m?.name || ''),
        bottom: 10,
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

  return (
    <div className="card">
      <div className="card-title">
        <span>车型对比分析</span>
      </div>
      <div className="h-full">
        <BaseChart options={chartOptions} className="h-[500px]" />
      </div>
    </div>
  );
} 