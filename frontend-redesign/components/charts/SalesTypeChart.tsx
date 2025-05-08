'use client';

import { useMemo } from 'react';
import { useSales } from '@/contexts/SalesContext';
import BaseChart from './BaseChart';

export default function SalesTypeChart() {
  const { currentData } = useSales();
  
  const chartOptions = useMemo(() => {
    const { types } = currentData;
    
    const data = Object.entries(types).map(([name, value]) => ({
      name,
      value,
    }));
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        itemGap: 15,
      },
      series: [
        {
          name: '销量类型',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: 'rgba(10, 18, 41, 0.6)',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };
  }, [currentData]);

  return (
    <div className="h-full">
      <BaseChart options={chartOptions} className="h-[320px]" />
    </div>
  );
} 