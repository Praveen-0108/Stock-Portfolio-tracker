import React, { useState, useEffect } from "react";
import { PlusCircle, Info, Hash, DollarSign } from "lucide-react";
import { StockPriceMap } from "../types";
import { PRESET_INFO } from "../constants";

interface StockFormProps {
  stockPrices: StockPriceMap;
  onAddStock: (symbol: string, quantity: number, customPrice?: number) => void;
}

export default function StockForm({ stockPrices, onAddStock }: StockFormProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [customSymbol, setCustomSymbol] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [validationError, setValidationError] = useState("");

  const presetSymbols = Object.keys(stockPrices).filter(
    (key) => PRESET_INFO[key] !== undefined
  );

  // Auto-fill price in helper display when preset is picked
  const activePresetPrice = stockPrices[selectedSymbol] || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Read the symbol to submit
    const finalSymbol = (isCustom ? customSymbol : selectedSymbol).trim().toUpperCase();
    if (!finalSymbol) {
      setValidationError("Please enter or select a valid stock symbol.");
      return;
    }

    if (finalSymbol.length > 10) {
      setValidationError("Stock symbol must be 10 characters or less.");
      return;
    }

    // Read the quantity
    const finalQuantity = Number(quantity);
    if (!quantity || isNaN(finalQuantity) || finalQuantity <= 0) {
      setValidationError("Please enter a valid quantity greater than 0.");
      return;
    }

    // Read the custom price if it's customized/added
    let finalPrice: number | undefined = undefined;
    if (isCustom || !stockPrices[finalSymbol]) {
      const priceNum = Number(customPrice);
      if (!customPrice || isNaN(priceNum) || priceNum <= 0) {
        setValidationError("Please enter a valid stock price greater than $0.");
        return;
      }
      finalPrice = priceNum;
    }

    onAddStock(finalSymbol, finalQuantity, finalPrice);

    // Reset some inputs
    setQuantity("");
    if (isCustom) {
      setCustomSymbol("");
      setCustomPrice("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          <PlusCircle size={18} />
        </div>
        <h3 className="font-sans font-bold text-lg text-slate-800">Add to Portfolio</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Custom vs Preset */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            id="toggle-preset-selector"
            type="button"
            onClick={() => {
              setIsCustom(false);
              setValidationError("");
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              !isCustom
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Popular Presets
          </button>
          <button
            id="toggle-custom-selector"
            type="button"
            onClick={() => {
              setIsCustom(true);
              setValidationError("");
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isCustom
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Custom Symbol
          </button>
        </div>

        {/* Stock Selection Field */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Stock Symbol
          </label>
          {isCustom ? (
            <div className="relative">
              <input
                id="input-custom-symbol"
                type="text"
                placeholder="e.g. BTC, NVDA, COIN"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 hover:border-slate-300 focus:bg-white text-slate-800 font-bold font-mono uppercase rounded-xl transition-all outline-none"
              />
            </div>
          ) : (
            <select
              id="select-preset-symbol"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 hover:border-slate-300 focus:bg-white text-slate-800 font-bold rounded-xl transition-all outline-none cursor-pointer"
            >
              {presetSymbols.map((sym) => (
                <option key={sym} value={sym}>
                  {sym} - {PRESET_INFO[sym]?.name || "Stock"} (${stockPrices[sym]})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Quantity and Price Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quantity Field */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Quantity / Shares
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400">
                <Hash size={16} />
              </span>
              <input
                id="input-quantity"
                type="number"
                step="any"
                min="0.0001"
                placeholder="e.g. 10"
                value={quantity === "" ? "" : quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === "" ? "" : parseFloat(val));
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 hover:border-slate-300 focus:bg-white text-slate-800 font-medium font-mono rounded-xl transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Current Share Price Field (only shown if custom/new, or editable default for custom) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Share Price
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400">
                <DollarSign size={16} />
              </span>
              <input
                id="input-price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder={isCustom ? "e.g. 150.00" : String(activePresetPrice)}
                disabled={!isCustom}
                value={isCustom ? customPrice : activePresetPrice}
                onChange={(e) => {
                  if (isCustom) {
                    const val = e.target.value;
                    setCustomPrice(val === "" ? "" : parseFloat(val));
                  }
                }}
                className={`w-full pl-9 pr-4 py-2.5 border rounded-xl transition-all outline-none font-mono font-medium ${
                  isCustom
                    ? "bg-slate-50 border border-slate-200 focus:border-blue-500 hover:border-slate-300 focus:bg-white text-slate-800"
                    : "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              />
            </div>
            {!isCustom && (
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Info size={10} />
                <span>Preset price from dictionary selected.</span>
              </p>
            )}
          </div>
        </div>

        {validationError && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-medium">
            {validationError}
          </div>
        )}

        {/* Submit */}
        <button
          id="btn-add-stock-submit"
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Add Action Asset</span>
        </button>
      </form>
    </div>
  );
}
