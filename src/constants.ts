import { StockPriceMap } from "./types";

export const DEFAULT_STOCK_PRICES: StockPriceMap = {
  AAPL: 180,
  TSLA: 250,
  MSFT: 420,
  GOOGL: 175,
  AMZN: 185,
  NVDA: 130,
  META: 480,
  NFLX: 630,
};

export const PRESET_INFO: { [symbol: string]: { name: string; color: string } } = {
  AAPL: { name: "Apple Inc.", color: "#313131" },
  TSLA: { name: "Tesla Inc.", color: "#E82127" },
  MSFT: { name: "Microsoft Corp.", color: "#00A4EF" },
  GOOGL: { name: "Alphabet Inc.", color: "#4285F4" },
  AMZN: { name: "Amazon.com Inc.", color: "#FF9900" },
  NVDA: { name: "NVIDIA Corp.", color: "#76B900" },
  META: { name: "Meta Platforms Inc.", color: "#0668E1" },
  NFLX: { name: "Netflix Inc.", color: "#E50914" },
};

export const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#34d399", // emerald-400
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
  "#ef4444", // red-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#6366f1", // indigo-500
];
