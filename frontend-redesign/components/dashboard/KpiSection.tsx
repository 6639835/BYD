'use client';

import KpiCard from './KpiCard';
import { useSales } from '@/contexts/SalesContext';

export default function KpiSection() {
  const { totalSales, hybridPercent, topHotModel } = useSales();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
      <KpiCard
        title="总销量"
        value={totalSales}
        change="↑ 13.4% 同比"
        isPositive={true}
        delay={0}
      />
      
      <KpiCard
        title="热销车型"
        value={topHotModel}
        change="108,000 辆"
        isPositive={true}
        delay={0.2}
      />
      
      <KpiCard
        title="DM-i车型占比"
        value={hybridPercent}
        change="↑ 4.2% 环比"
        isPositive={true}
        delay={0.4}
      />
      
      <KpiCard
        title="市场份额"
        value={26.8}
        change="↑ 3.5% 同比"
        isPositive={true}
        delay={0.6}
      />
    </div>
  );
} 