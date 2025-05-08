'use client';

import KpiSection from '../dashboard/KpiSection';
import ChartsSection from '../dashboard/ChartsSection';

export default function DashboardSection() {
  return (
    <section id="dashboard" className="section py-20">
      <div className="container">
        <h2 className="section-title">销量数据分析</h2>
        
        {/* KPI Cards */}
        <KpiSection />
        
        {/* Charts */}
        <ChartsSection />
      </div>
    </section>
  );
} 