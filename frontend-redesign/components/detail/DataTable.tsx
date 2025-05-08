'use client';

import { useSales } from '@/contexts/SalesContext';
import { formatNumber, getTrendColor, exportTableData } from '@/utils/helpers';
import { useState, useEffect } from 'react';

export default function DataTable() {
  const { 
    filteredData, 
    pageIndex, 
    setPageIndex, 
    itemsPerPage, 
    totalPages,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType
  } = useSales();
  
  // Calculate pagination
  const startIndex = pageIndex * itemsPerPage;
  const displayData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle page change
  const changePage = (direction: number) => {
    const newPage = pageIndex + direction;
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
    }
  };
  
  // Reset page index when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [filterType, searchQuery, setPageIndex]);
  
  return (
    <div className="card">
      <div className="card-title">
        <span>车型销量详细数据</span>
        <div className="flex space-x-2">
          <button 
            className="flex items-center gap-1 text-sm bg-white/5 hover:bg-white/10 py-1 px-3 rounded-full transition-colors"
            onClick={() => exportTableData(filteredData, 'excel')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 17l2-3m2-3l-2 3-2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Excel导出
          </button>
          <button 
            className="flex items-center gap-1 text-sm bg-white/5 hover:bg-white/10 py-1 px-3 rounded-full transition-colors"
            onClick={() => exportTableData(filteredData, 'pdf')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 9h1m5 0h-1m-2 0h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            PDF导出
          </button>
        </div>
      </div>
      
      <div className="data-table-container p-1">
        <div className="data-filters flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            className="search-input flex-1 bg-dark-surface/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            placeholder="搜索车型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select bg-dark-surface/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">所有类型</option>
            <option value="DM-i混动">DM-i混动</option>
            <option value="EV纯电">EV纯电</option>
            <option value="燃油车">燃油车</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table w-full border-collapse">
            <thead>
              <tr className="bg-dark-surface/50 text-white/70">
                <th className="py-3 px-4 text-left">排名</th>
                <th className="py-3 px-4 text-left">车型</th>
                <th className="py-3 px-4 text-left">类型</th>
                <th className="py-3 px-4 text-right">销量</th>
                <th className="py-3 px-4 text-right">同比</th>
                <th className="py-3 px-4 text-right">环比</th>
              </tr>
            </thead>
            <tbody>
              {displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <tr 
                    key={item.name} 
                    className="border-b border-border/30 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">{startIndex + index + 1}</td>
                    <td className="py-4 px-4 font-medium text-white">{item.name}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                        item.type === 'DM-i混动' ? 'bg-primary/20 text-primary-light' :
                        item.type === 'EV纯电' ? 'bg-secondary/20 text-secondary-light' :
                        'bg-white/10 text-white/80'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">{formatNumber(item.sales)}</td>
                    <td className={`py-4 px-4 text-right ${getTrendColor(item.yearOnYear)}`}>
                      {item.yearOnYear}
                    </td>
                    <td className={`py-4 px-4 text-right ${getTrendColor(item.monthOnMonth)}`}>
                      {item.monthOnMonth}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/50">
                    没有匹配的数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="pagination flex justify-between items-center mt-6">
          <div className="text-sm text-white/50">
            共 {filteredData.length} 条数据，当前显示 {Math.min(startIndex + 1, filteredData.length)}-{Math.min(startIndex + itemsPerPage, filteredData.length)} 条
          </div>
          <div className="flex gap-2">
            <button
              className={`pagination-btn px-4 py-2 rounded-lg border border-border bg-dark-surface/50 ${pageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
              onClick={() => changePage(-1)}
              disabled={pageIndex === 0}
            >
              上一页
            </button>
            <span className="flex items-center justify-center px-4 bg-dark-surface/70 rounded-lg border border-border">
              {pageIndex + 1} / {totalPages || 1}
            </span>
            <button
              className={`pagination-btn px-4 py-2 rounded-lg border border-border bg-dark-surface/50 ${pageIndex >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
              onClick={() => changePage(1)}
              disabled={pageIndex >= totalPages - 1}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 