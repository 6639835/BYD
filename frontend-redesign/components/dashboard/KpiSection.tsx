'use client';

import KpiCard from './KpiCard';
import { useSales } from '@/contexts/SalesContext';
import { motion } from 'framer-motion';

export default function KpiSection() {
  const { totalSales, hybridPercent, topHotModel } = useSales();

  // SVG icons for KPI cards
  const totalSalesIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 18v-6M8.5 18v-4M15.5 18v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const hotModelIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const hybridIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10h-7.5M6 6v12M18 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10.5 10a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const marketShareIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8V5l3 3-3 3V8zM8 16v3l-3-3 3-3v3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 3h-7M3 21h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 3l-3 7M3 21l3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 10c-4.4 0-8 3.6-8 8M6 14c4.4 0 8-3.6 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <KpiCard
        title="总销量"
        value={totalSales}
        change="↑ 13.4% 同比"
        isPositive={true}
        delay={0}
        icon={totalSalesIcon}
      />
      
      <KpiCard
        title="热销车型"
        value={topHotModel}
        change="108,000 辆"
        isPositive={true}
        delay={0.1}
        icon={hotModelIcon}
      />
      
      <KpiCard
        title="DM-i车型占比"
        value={hybridPercent}
        change="↑ 4.2% 环比"
        isPositive={true}
        delay={0.2}
        icon={hybridIcon}
      />
      
      <KpiCard
        title="市场份额"
        value={26.8}
        change="↑ 3.5% 同比"
        isPositive={true}
        delay={0.3}
        icon={marketShareIcon}
      />
    </motion.div>
  );
} 