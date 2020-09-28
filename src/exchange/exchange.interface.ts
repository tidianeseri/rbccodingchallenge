interface Exchange {
  stock: string;
  quarter: number;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  percent_change_price: number;
  percent_change_volume_over_last_wk?: number;
  previous_weeks_volume?: number;
  next_weeks_open: number;
  next_weeks_close: number;
  percent_change_next_weeks_price: number;
  days_to_next_dividend: number;
  percent_return_next_dividend: number;
}

export default Exchange;
