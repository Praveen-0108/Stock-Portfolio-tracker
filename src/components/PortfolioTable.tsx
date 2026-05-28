import { useState } from "react";
import { Trash2, Edit3, Check, X, Tag, ShoppingBag, Plus, Minus } from "lucide-react";
import { PortfolioItem, StockPriceMap } from "../types";
import { PRESET_INFO } from "../constants";

interface PortfolioTableProps {
  portfolio: PortfolioItem[];
  stockPrices: StockPriceMap;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onDeleteItem: (id: string) => void;
  totalValue: number;
}

export default function PortfolioTable({
  portfolio,
  stockPrices,
  onUpdateQuantity,
  onDeleteItem,
  totalValue,
}: PortfolioTableProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedQty, setEditedQty] = useState<string>("");

  const handleStartEdit = (item: PortfolioItem) => {
    setEditingItemId(item.id);
    setEditedQty(String(item.quantity));
  };

  const handleSaveEdit = (id: string) => {
    const parseFloatVal = parseFloat(editedQty);
    if (isNaN(parseFloatVal) || parseFloatVal <= 0) {
      return;
    }
    onUpdateQuantity(id, parseFloatVal);
    setEditingItemId(null);
  };

  const incrementQty = (item: PortfolioItem) => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const decrementQty = (item: PortfolioItem) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onDeleteItem(item.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Table Header Section */}
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-sans font-bold text-lg text-slate-800 flex items-center gap-2">
          <span>Active Holdings</span>
          <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
            {portfolio.length} Unique
          </span>
        </h3>
        <span className="text-slate-400 text-xs font-mono">Real-time valuation based on lookup dictionary</span>
      </div>

      {portfolio.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="stroke-[1.5]" />
          </div>
          <h4 className="font-semibold text-slate-700 mb-1">Portfolio is currently empty</h4>
          <p className="text-slate-400 text-xs max-w-sm mx-auto mb-5 leading-normal">
            Input stock tickers, price definitions, and quantities using the form or click "Load Demo" to initialize default holdings.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Asset Symbol</th>
                <th className="py-3 px-4">Market Price</th>
                <th className="py-3 px-4">Quantity held</th>
                <th className="py-3 px-4 text-right">Investment subtotal</th>
                <th className="py-3 px-4 text-right">Allocation weight</th>
                <th className="py-3 px-6 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {portfolio.map((item) => {
                const price = stockPrices[item.symbol] || 0;
                const subtotal = price * item.quantity;
                const allocation = totalValue > 0 ? (subtotal / totalValue) * 100 : 0;
                const info = PRESET_INFO[item.symbol];
                const isEditing = editingItemId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                    {/* Symbol info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs select-none shrink-0"
                          style={{
                            backgroundColor: info?.color || "#64748b",
                          }}
                        >
                          {item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 font-mono text-sm block tracking-wide">
                            {item.symbol}
                          </span>
                          <span className="text-slate-400 text-xs truncate max-w-[140px] block">
                            {info?.name || "Sourced Asset"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price display */}
                    <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                      ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Quantity controls */}
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            id={`input-qty-edit-${item.id}`}
                            type="number"
                            step="any"
                            min="0.0001"
                            value={editedQty}
                            onChange={(e) => setEditedQty(e.target.value)}
                            className="w-20 px-2 py-1 text-xs font-semibold font-mono bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
                          />
                          <button
                            id={`btn-save-qty-${item.id}`}
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Save changes"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            id={`btn-cancel-qty-${item.id}`}
                            onClick={() => setEditingItemId(null)}
                            className="p-1 bg-slate-50 text-slate-400 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Minus action */}
                          <button
                            id={`btn-minus-qty-${item.id}`}
                            onClick={() => decrementQty(item)}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Decrement 1 share"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-semibold text-slate-800 font-mono text-xs select-none">
                            {item.quantity.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                          </span>
                          {/* Plus action */}
                          <button
                            id={`btn-plus-qty-${item.id}`}
                            onClick={() => incrementQty(item)}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Increment 1 share"
                          >
                            <Plus size={13} />
                          </button>
                          {/* Precise edit trigger */}
                          <button
                            id={`btn-edit-qty-trigger-${item.id}`}
                            onClick={() => handleStartEdit(item)}
                            className="p-1 text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Enter exact quantity"
                          >
                            <Edit3 size={11} />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Investment Subtotal */}
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-800">
                      ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Allocation weight progress bar */}
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="font-mono font-semibold text-xs text-slate-700">
                          {allocation.toFixed(1)}%
                        </span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${Math.min(allocation, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Trash Settings */}
                    <td className="py-4 px-6 text-right">
                      <button
                        id={`btn-delete-holding-${item.id}`}
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Remove holding from list"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer totals */}
            <tfoot>
              <tr className="bg-slate-50/40 border-t border-slate-100 font-bold text-slate-800">
                <td className="py-4 px-6 uppercase text-xs text-slate-400 tracking-wider">Total Value</td>
                <td className="py-4 px-4"></td>
                <td className="py-4 px-4 font-mono text-xs text-slate-500">
                  {portfolio
                    .reduce((sum, item) => sum + item.quantity, 0)
                    .toLocaleString("en-US", { maximumFractionDigits: 4 })}{" "}
                  shares
                </td>
                <td className="py-4 px-4 text-right font-mono text-lg text-blue-600">
                  ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-4 px-4 text-right font-mono text-xs text-slate-500">100.0%</td>
                <td className="py-4 px-6"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
