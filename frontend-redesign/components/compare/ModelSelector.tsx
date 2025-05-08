'use client';

import { useSales } from '@/contexts/SalesContext';
import { useEffect } from 'react';

export default function ModelSelector() {
  const { currentData, compareModels, setCompareModels } = useSales();
  const { models } = currentData;
  
  const handleModelChange = (index: number, value: string) => {
    const newModels = [...compareModels];
    newModels[index] = value;
    setCompareModels(newModels);
  };
  
  // Ensure we have valid models selected on initial load or when currentData changes
  useEffect(() => {
    let needsUpdate = false;
    const newModels = [...compareModels];
    
    // Check if we need to initialize or update any models
    for (let i = 0; i < 3; i++) {
      const model = compareModels[i];
      
      // If model is not defined or not in the current model list, update it
      if (!model || !models.includes(model)) {
        needsUpdate = true;
        // Select a model that is not already selected, or default to the first available
        const availableModels = models.filter(m => !compareModels.includes(m));
        newModels[i] = availableModels[i] || models[i] || models[0];
      }
    }
    
    if (needsUpdate) {
      setCompareModels(newModels);
    }
  }, [models, compareModels, setCompareModels]);
  
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
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 5L6 8L9 5' stroke='rgba(255,255,255,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                paddingRight: '2.5rem',
                appearance: 'none'
              }}
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