'use client';

import { useSales } from '@/contexts/SalesContext';

export default function ModelSelector() {
  const { currentData, compareModels, setCompareModels } = useSales();
  const { models } = currentData;
  
  const handleModelChange = (index: number, value: string) => {
    const newModels = [...compareModels];
    newModels[index] = value;
    setCompareModels(newModels);
  };
  
  return (
    <div className="card mb-8">
      <div className="card-title mb-6">
        <span>选择对比车型</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex flex-col">
            <label className="text-white/70 mb-2 text-sm">
              车型 {index + 1}:
            </label>
            <select
              value={compareModels[index] || ''}
              onChange={(e) => handleModelChange(index, e.target.value)}
              className="bg-dark-surface/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
} 