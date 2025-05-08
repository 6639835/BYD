export interface SalesData {
  models: string[];
  sales: number[];
  monthlyTrend: {
    [month: string]: number[];
  };
  types: {
    [type: string]: number;
  };
  modelTypes: {
    [model: string]: string;
  };
  yearOnYear: {
    [model: string]: string;
  };
  monthOnMonth: {
    [model: string]: string;
  };
}

export interface AllPeriodsData {
  [period: string]: SalesData;
}

export interface ModelData {
  name: string;
  sales: number;
  type: string;
  yearOnYear: string;
  monthOnMonth: string;
}

export type Period = '2024-Q1' | '2023-Q4' | '2023-Q3' | '2023-Q2'; 