'use client';

import DataTable from '../detail/DataTable';

export default function DetailSection() {
  return (
    <section id="detail-section" className="section py-20 relative">
      <div className="container">
        <h2 className="section-title">详细数据展示</h2>
        
        <div className="max-w-6xl mx-auto">
          <DataTable />
        </div>
      </div>
    </section>
  );
} 