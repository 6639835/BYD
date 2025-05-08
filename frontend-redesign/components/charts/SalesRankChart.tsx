'use client';

import { useMemo } from 'react';
import { useSales } from '@/contexts/SalesContext';
import { createGradient } from '@/utils/helpers';
import BaseChart from './BaseChart';

export default function SalesRankChart() {
  const { currentData } = useSales();
  
  const chartOptions = useMemo(() => {
    const { models, sales } = currentData;
    
    // Sort data by sales in descending order
    const sortedData = models.map((model, index) => ({
      name: model,
      value: sales[index],
    })).sort((a, b) => b.value - a.value);
    
    const xAxisData = sortedData.map(item => item.name);
    const seriesData = sortedData.map(item => item.value);
    
    return {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: 30,
          margin: 15,
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name: '销量（辆）',
        nameTextStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: [0, 30, 0, 0],
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
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const model = xAxisData[dataIndex];
          const value = seriesData[dataIndex];
          return `${model}<br/>销量: ${value.toLocaleString()} 辆`;
        },
      },
      series: [
        {
          type: 'bar',
          data: seriesData,
          barWidth: '50%',
          itemStyle: {
            color: (params: any) => {
              const colorStops = [
                [0, '#00e676'],
                [0.3, '#00a854'],
                [0.6, '#1976d2'],
                [1, '#63a4ff'],
              ];
              
              // Calculate color index based on rank
              const normalizedIndex = params.dataIndex / (xAxisData.length - 1);
              const colors = colorStops[Math.floor(normalizedIndex * (colorStops.length - 1))];
              
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: colors[1], // 0% position color
                  },
                  {
                    offset: 1,
                    color: colors[0], // 100% position color
                  },
                ],
              };
            },
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 168, 84, 0.5)',
            },
          },
          label: {
            show: true,
            position: 'top',
            color: 'rgba(255, 255, 255, 0.9)',
            formatter: (params: any) => {
              return params.value >= 10000 ? `${(params.value / 10000).toFixed(1)}万` : params.value;
            },
          },
        },
      ],
    };
  }, [currentData]);

  return (
    <div className="h-full">
      <BaseChart options={chartOptions} className="h-[400px]" />
    </div>
  );
} 