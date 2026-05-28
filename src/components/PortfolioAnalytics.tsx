import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { PortfolioItem, StockPriceMap } from "../types";
import { CHART_COLORS, PRESET_INFO } from "../constants";
import { PieChart as PieIcon, BarChart3, AlertCircle } from "lucide-react";

interface PortfolioAnalyticsProps {
  portfolio: PortfolioItem[];
  stockPrices: StockPriceMap;
}

export default function PortfolioAnalytics({ portfolio, stockPrices }: PortfolioAnalyticsProps) {
  if (portfolio.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-full flex flex-col items-center justify-center text-center py-16">
        <div className="mb-3 text-slate-300">
          <AlertCircle size={32} />
        </div>
        <p className="text-slate-400 text-xs">No holdings found to chart. Register assets to visualize allocations.</p>
      </div>
    );
  }

  // Calculate allocation dataset
  const chartData = portfolio.map((item, idx) => {
    const price = stockPrices[item.symbol] || 0;
    const value = price * item.quantity;
    return {
      name: item.symbol,
      value: parseFloat(value.toFixed(2)),
      sharePrice: price,
      quantity: item.quantity,
      color: PRESET_INFO[item.symbol]?.color || CHART_COLORS[idx % CHART_COLORS.length],
    };
  });

  // Unique key-value mapping for the price lookups of tracked items
  const barChartData = portfolio.map((item, idx) => {
    const price = stockPrices[item.symbol] || 0;
    return {
      symbol: item.symbol,
      price: price,
      color: PRESET_INFO[item.symbol]?.color || CHART_COLORS[idx % CHART_COLORS.length],
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Allocation breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <PieIcon size={18} />
          </div>
          <h3 className="font-sans font-bold text-base text-slate-800">Portfolio Distribution</h3>
        </div>

        <div className="w-full h-64 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Value"]}
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-2 gap-2 mt-2 max-h-24 overflow-y-auto pt-2 border-t border-slate-50 pr-1">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-bold text-slate-700 font-mono">{item.name}:</span>
              <span className="text-slate-500 font-mono">${item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Prices Bar Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <BarChart3 size={18} />
          </div>
          <h3 className="font-sans font-bold text-base text-slate-800">Sourced Price Comparison</h3>
        </div>

        <div className="w-full h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="symbol" tickLine={false} style={{ fontSize: "11px", fontFamily: "monospace" }} />
              <YAxis tickLine={false} style={{ fontSize: "11px", fontFamily: "monospace" }} />
              <Tooltip
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Price"]}
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              />
              <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-400 italic">Current unit ticker value in USD</span>
        </div>
      </div>
    </div>
  );
}
