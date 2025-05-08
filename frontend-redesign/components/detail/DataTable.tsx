'use client';

import { useSales } from '@/contexts/SalesContext';
import { formatNumber, getTrendColor, exportTableData } from '@/utils/helpers';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // States for hover effects
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="card-title justify-between items-center">
        <span className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M3 10h18M3 14h18M3 18h18M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          车型销量详细数据
        </span>
        <div className="flex space-x-2">
          <motion.button 
            className="flex items-center gap-1 text-sm bg-dark-surface/70 backdrop-blur-sm hover:bg-white/10 py-1.5 px-4 rounded-full transition-colors border border-border"
            onClick={() => exportTableData(filteredData, 'excel')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 17l2-3m2-3l-2 3-2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ml-1">Excel导出</span>
          </motion.button>
          <motion.button 
            className="flex items-center gap-1 text-sm bg-dark-surface/70 backdrop-blur-sm hover:bg-white/10 py-1.5 px-4 rounded-full transition-colors border border-border"
            onClick={() => exportTableData(filteredData, 'pdf')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 9h1m5 0h-1m-2 0h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="ml-1">PDF导出</span>
          </motion.button>
        </div>
      </div>
      
      <div className="data-table-container p-1">
        <div className="data-filters flex flex-col sm:flex-row gap-4 mb-6">
          <div className="search-container relative flex-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input w-full bg-dark-surface/70 border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              placeholder="搜索车型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="filter-select bg-dark-surface/70 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors appearance-none min-w-[160px]"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 5L6 8L9 5' stroke='rgba(255,255,255,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              paddingRight: '2.5rem'
            }}
          >
            <option value="all">所有类型</option>
            <option value="DM-i混动">DM-i混动</option>
            <option value="EV纯电">EV纯电</option>
            <option value="燃油车">燃油车</option>
          </select>
        </div>
        
        <div className="overflow-x-auto rounded-xl">
          <table className="data-table w-full border-collapse">
            <thead>
              <tr className="bg-dark-surface/70 backdrop-blur-sm">
                <th className="py-3.5 px-4 text-left font-medium text-white/70 border-b border-border">排名</th>
                <th className="py-3.5 px-4 text-left font-medium text-white/70 border-b border-border">车型</th>
                <th className="py-3.5 px-4 text-left font-medium text-white/70 border-b border-border">类型</th>
                <th className="py-3.5 px-4 text-right font-medium text-white/70 border-b border-border">销量</th>
                <th className="py-3.5 px-4 text-right font-medium text-white/70 border-b border-border">同比</th>
                <th className="py-3.5 px-4 text-right font-medium text-white/70 border-b border-border">环比</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {displayData.length > 0 ? (
                  displayData.map((item, index) => (
                    <motion.tr 
                      key={item.name} 
                      className="border-b border-border/30 transition-colors relative"
                      initial={{ opacity: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}
                      animate={{ 
                        opacity: 1, 
                        backgroundColor: hoveredRow === index ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0)'
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {startIndex + index < 3 ? (
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-2 text-sm font-medium
                              ${startIndex + index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                                startIndex + index === 1 ? 'bg-gray-400/20 text-gray-300' : 
                                'bg-amber-700/20 text-amber-600'}
                            `}>
                              {startIndex + index + 1}
                            </div>
                          ) : (
                            startIndex + index + 1
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-white">{item.name}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
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
                      
                      {/* Highlight effect on hover */}
                      {hoveredRow === index && (
                        <motion.div 
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                          layoutId="tableRowHighlight" 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className="py-16 text-center text-white/50">
                      <div className="flex flex-col items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/30 mb-3">
                          <path d="M10 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M21 12c-2.4 4.2-5.7 6-9 6-3.4 0-6.6-1.8-9-6 2.4-4.2 5.7-6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M17 18l5-5m0 0l-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        没有匹配的数据
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        <div className="pagination flex justify-between items-center mt-6">
          <div className="text-sm text-white/50">
            共 {filteredData.length} 条数据，当前显示 {Math.min(startIndex + 1, filteredData.length)}-{Math.min(startIndex + itemsPerPage, filteredData.length)} 条
          </div>
          <div className="flex gap-2">
            <motion.button
              className={`pagination-btn px-4 py-2 rounded-lg border border-border bg-dark-surface/50 flex items-center gap-1 ${pageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
              onClick={() => changePage(-1)}
              disabled={pageIndex === 0}
              whileHover={pageIndex > 0 ? { scale: 1.03 } : {}}
              whileTap={pageIndex > 0 ? { scale: 0.97 } : {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              上一页
            </motion.button>
            <span className="flex items-center justify-center min-w-[80px] px-4 bg-dark-surface/70 rounded-lg border border-border backdrop-blur-sm">
              {pageIndex + 1} / {totalPages || 1}
            </span>
            <motion.button
              className={`pagination-btn px-4 py-2 rounded-lg border border-border bg-dark-surface/50 flex items-center gap-1 ${pageIndex >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
              onClick={() => changePage(1)}
              disabled={pageIndex >= totalPages - 1}
              whileHover={pageIndex < totalPages - 1 ? { scale: 1.03 } : {}}
              whileTap={pageIndex < totalPages - 1 ? { scale: 0.97 } : {}}
            >
              下一页
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 