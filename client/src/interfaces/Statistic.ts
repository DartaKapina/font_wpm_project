export interface Statistic {
  label?: string;
  color: string;
  width?: number | null;
  height?: number | null;
}

export interface CounterStatisticProps extends Statistic {
  value: number;
  unit: string;
}

export interface GraphStatisticProps extends Statistic {
  data: { time: number; value: number }[];
  expected_value: number;
  time_limit: number;
}
