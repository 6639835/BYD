/**
 * Format a number with thousands separators
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a percentage value
 */
export function formatPercent(percent: string): string {
  if (percent === '新上市') return percent;
  return percent.startsWith('+') ? percent : percent;
}

/**
 * Get color based on trend direction
 */
export function getTrendColor(trend: string): string {
  if (trend === '新上市') return 'text-accent';
  return trend.startsWith('+') ? 'text-success' : 'text-error';
}

/**
 * Get ECharts color scheme
 */
export function getChartColors(): string[] {
  return [
    '#00a854', '#1976d2', '#ff4081', '#ffd54f', 
    '#00bcd4', '#673ab7', '#ff9800', '#607d8b', 
    '#9c27b0', '#795548'
  ];
}

/**
 * Create a gradient for charts
 */
export function createGradient(color1: string, color2: string): any {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: color1
      },
      {
        offset: 1,
        color: color2
      }
    ]
  };
}

/**
 * Export data for tables
 */
export function exportTableData(data: any[], format: string): void {
  // This would be implemented with a library for real exports
  console.log(`Exporting data in ${format} format`, data);
  alert(`数据已导出为 ${format} 格式（模拟）`);
}

/**
 * Handle scrolling to specific sections
 */
export function scrollToSection(selector: string): void {
  const section = document.querySelector(selector);
  if (section) {
    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY,
      behavior: 'smooth'
    });
  }
}

/**
 * Check if an element is in viewport 
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
} 