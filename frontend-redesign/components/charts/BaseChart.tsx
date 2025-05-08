'use client';

import { useEffect, useRef, useState } from 'react';
import { getChartColors } from '@/utils/helpers';
import { motion } from 'framer-motion';
import type * as echarts from 'echarts';

interface BaseChartProps {
  options: any;
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
  onChartReady?: (chart: echarts.ECharts) => void;
  delay?: number;
}

export default function BaseChart({ 
  options, 
  style, 
  className = '', 
  loading = false,
  onChartReady,
  delay = 0
}: BaseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Dynamic import to avoid SSR issues
    const initChart = async () => {
      try {
        const echarts = await import('echarts');
        
        if (!chartRef.current) return;
        
        // Initialize chart if not initialized
        if (!chart) {
          const newChart = echarts.init(chartRef.current);
          setChart(newChart);
          
          // Set options immediately
          if (options) {
            const themePalette = getChartColors();
            const updatedOptions = {
              ...options,
              color: themePalette,
              backgroundColor: 'transparent',
              textStyle: {
                fontFamily: 'Noto Sans SC, SF Pro Display, sans-serif',
                color: 'rgba(255, 255, 255, 0.8)',
              },
              tooltip: {
                ...options.tooltip,
                backgroundColor: 'rgba(26, 32, 53, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 13,
                },
                extraCssText: 'backdrop-filter: blur(8px); border-radius: 10px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); padding: 10px 14px; border: 1px solid rgba(255, 255, 255, 0.05);',
              },
              animation: true,
              animationDuration: 1000,
              animationEasing: 'cubicOut',
              grid: {
                ...(options.grid || {}),
                borderColor: 'rgba(255, 255, 255, 0.05)',
              },
            };
            
            newChart.setOption(updatedOptions, true);
          }
          
          if (onChartReady) onChartReady(newChart);
          
          // Handle resize
          const handleResize = () => {
            newChart.resize();
          };
          window.addEventListener('resize', handleResize);
          
          // Clean up
          return () => {
            window.removeEventListener('resize', handleResize);
            newChart.dispose();
          };
        }
      } catch (error) {
        console.error('Failed to load ECharts', error);
      }
    };

    // Initialize immediately
    initChart();
  }, [isClient, onChartReady, options]);

  // Update options when they change
  useEffect(() => {
    if (chart && options) {
      // Apply theme colors
      const themePalette = getChartColors();
      const updatedOptions = {
        ...options,
        color: themePalette,
        // Set default bg transparent
        backgroundColor: 'transparent',
        // Common styling
        textStyle: {
          fontFamily: 'Noto Sans SC, SF Pro Display, sans-serif',
          color: 'rgba(255, 255, 255, 0.8)',
        },
        // Nicer tooltips
        tooltip: {
          ...options.tooltip,
          backgroundColor: 'rgba(26, 32, 53, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 13,
          },
          extraCssText: 'backdrop-filter: blur(8px); border-radius: 10px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); padding: 10px 14px; border: 1px solid rgba(255, 255, 255, 0.05);',
        },
        // Global animations
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        // Enhanced grid styling
        grid: {
          ...(options.grid || {}),
          borderColor: 'rgba(255, 255, 255, 0.05)',
        },
      };
      
      chart.setOption(updatedOptions, true);
    }
  }, [chart, options]);

  // Handle loading state
  useEffect(() => {
    if (!chart) return;
    
    if (loading) {
      chart.showLoading({
        text: '加载中...',
        color: '#00a854',
        textColor: 'rgba(255, 255, 255, 0.8)',
        maskColor: 'rgba(26, 32, 53, 0.5)',
        zlevel: 0,
        fontSize: 14,
        showSpinner: true,
        spinnerRadius: 10,
        lineWidth: 3,
      });
    } else {
      chart.hideLoading();
    }
  }, [chart, loading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full"
    >
      <div
        ref={chartRef}
        className={`chart w-full h-full min-h-[300px] ${className}`}
        style={style}
      />
    </motion.div>
  );
} 