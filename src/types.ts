export interface StockPriceMap {
  [symbol: string]: number;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  quantity: number;
}

export interface StockPriceHistory {
  [symbol: string]: number[];
}
