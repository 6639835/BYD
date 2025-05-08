'use client';

import ModelSelector from '../compare/ModelSelector';
import ComparisonChart from '../charts/ComparisonChart';

export default function CompareSection() {
  return (
    <section id="compare-section" className="section py-20 relative">
      <div className="container">
        <h2 className="section-title">车型对比分析</h2>
        
        <div className="max-w-6xl mx-auto">
          <ModelSelector />
          <ComparisonChart />
        </div>
      </div>
    </section>
  );
} 