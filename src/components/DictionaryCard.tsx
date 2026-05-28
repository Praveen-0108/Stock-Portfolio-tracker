import { useState } from "react";
import { Edit2, Check, X, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { StockPriceMap } from "../types";
import { PRESET_INFO } from "../constants";

interface DictionaryCardProps {
  stockPrices: StockPriceMap;
  onUpdatePrice: (symbol: string, newPrice: number) => void;
  onResetPrices: () => void;
}

export default function DictionaryCard({ stockPrices, onUpdatePrice, onResetPrices }: DictionaryCardProps) {
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const handleStartEdit = (symbol: string, currentPrice: number) => {
    setEditingSymbol(symbol);
    setEditPriceValue(String(currentPrice));
    setErrorText("");
  };

  const handleSaveEdit = (symbol: string) => {
    const parsed = parseFloat(editPriceValue);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorText("Price must be a positive number.");
      return;
    }
    onUpdatePrice(symbol, parsed);
    setEditingSymbol(null);
    setErrorText("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen size={18} />
          </div>
          <h3 className="font-sans font-bold text-lg text-slate-800">Dynamic Dictionary</h3>
        </div>
        <button
          id="btn-reset-dictionary-prices"
          onClick={onResetPrices}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
          title="Reset dictionary prices back to defaults"
        >
          <RefreshCw size={12} />
          <span>Reset Prices</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        This is the central dictionary linking stocks to prices. Modifying these values dynamically updates all holdings in real time.
      </p>

      {errorText && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1.5">
          <AlertCircle size={14} />
          <span>{errorText}</span>
        </div>
      )}

      {/* Dictionary List */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[350px] space-y-2 divide-y divide-slate-50">
        {Object.entries(stockPrices).map(([symbol, price]) => {
          const info = PRESET_INFO[symbol];
          const isEditing = editingSymbol === symbol;

          return (
            <div
              key={symbol}
              className="flex items-center justify-between pt-2.5 first:pt-0"
            >
              {/* Left Side Info */}
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-7 rounded-sm"
                  style={{ backgroundColor: info?.color || "#64748b" }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm text-slate-800">{symbol}</span>
                    {info && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded">
                        Preset
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px] truncate block max-w-[150px]">
                    {info?.name || "Custom Asset"}
                  </span>
                </div>
              </div>

              {/* Right Side Editing & Prices */}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 font-mono text-xs">$</span>
                    <input
                      id={`input-dict-price-${symbol}`}
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editPriceValue}
                      onChange={(e) => setEditPriceValue(e.target.value)}
                      className="w-18 px-1.5 py-0.5 font-mono text-xs bg-slate-50 border border-slate-300 rounded font-semibold focus:bg-white outline-none"
                    />
                    <button
                      id={`btn-save-dict-price-${symbol}`}
                      onClick={() => handleSaveEdit(symbol)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      id={`btn-cancel-dict-price-${symbol}`}
                      onClick={() => setEditingSymbol(null)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-semibold text-xs text-slate-700">
                      ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <button
                      id={`btn-edit-dict-price-${symbol}`}
                      onClick={() => handleStartEdit(symbol, price)}
                      className="p-1 text-slate-400 hover:text-blue-500 hover:bg-slate-50 rounded transition-all cursor-pointer"
                      title="Edit Price"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
