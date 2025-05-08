'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { allPeriodsData } from '../data/salesData';
import { Period, SalesData, ModelData } from '../types';

interface SalesContextProps {
  currentPeriod: Period;
  setCurrentPeriod: (period: Period) => void;
  currentData: SalesData;
  totalSales: number;
  hybridPercent: number;
  modelData: ModelData[];
  pageIndex: number;
  setPageIndex: (index: number) => void;
  itemsPerPage: number;
  totalPages: number;
  filterType: string;
  setFilterType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredData: ModelData[];
  topHotModel: string;
  compareModels: string[];
  setCompareModels: (models: string[]) => void;
}

const SalesContext = createContext<SalesContextProps | undefined>(undefined);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [currentPeriod, setCurrentPeriod] = useState<Period>('2024-Q1');
  const [pageIndex, setPageIndex] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareModels, setCompareModels] = useState<string[]>(['秦PLUS DM-i', '宋PLUS DM-i']);
  
  const itemsPerPage = 8;
  const currentData = allPeriodsData[currentPeriod];
  
  // Calculate total sales
  const totalSales = Object.values(currentData.types).reduce((sum, val) => sum + val, 0);
  
  // Calculate hybrid percent
  const hybridPercent = Math.round((currentData.types['DM-i混动'] / totalSales) * 100);
  
  // Find top hot model
  const topHotModel = currentData.models[0];
  
  // Create model data array
  const modelData: ModelData[] = currentData.models.map((model, index) => ({
    name: model,
    sales: currentData.sales[index],
    type: currentData.modelTypes[model],
    yearOnYear: currentData.yearOnYear[model],
    monthOnMonth: currentData.monthOnMonth[model],
  }));
  
  // Filter data based on search and filter
  const filteredData = modelData.filter(model => {
    const matchesSearch = searchQuery === '' || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      model.type === filterType;
    
    return matchesSearch && matchesFilter;
  });
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const value = {
    currentPeriod,
    setCurrentPeriod,
    currentData,
    totalSales,
    hybridPercent,
    modelData,
    pageIndex,
    setPageIndex,
    itemsPerPage,
    totalPages,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    filteredData,
    topHotModel,
    compareModels,
    setCompareModels,
  };
  
  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
} 