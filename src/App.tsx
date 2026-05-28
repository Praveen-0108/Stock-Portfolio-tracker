import { useState, useEffect } from "react";
import { DollarSign, Layers, Hash, Award, RefreshCw } from "lucide-react";
import { PortfolioItem, StockPriceMap } from "./types";
import { DEFAULT_STOCK_PRICES, PRESET_INFO } from "./constants";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import StockForm from "./components/StockForm";
import PortfolioTable from "./components/PortfolioTable";
import DictionaryCard from "./components/DictionaryCard";
import PortfolioAnalytics from "./components/PortfolioAnalytics";

export default function App() {
  // Initialize from LocalStorage or defaults
  const [stockPrices, setStockPrices] = useState<StockPriceMap>(() => {
    const saved = localStorage.getItem("stock_portfolio_price_dictionary");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved price dictionary", err);
      }
    }
    return { ...DEFAULT_STOCK_PRICES };
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem("stock_portfolio_holdings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved portfolio holdings", err);
      }
    }
    return [];
  });

  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem("stock_portfolio_price_dictionary", JSON.stringify(stockPrices));
  }, [stockPrices]);

  useEffect(() => {
    localStorage.setItem("stock_portfolio_holdings", JSON.stringify(portfolio));
  }, [portfolio]);

  // Flash visual notification utility
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  };

  // Add / Update Stock
  const handleAddStock = (symbol: string, quantity: number, customPrice?: number) => {
    const cleanSymbol = symbol.toUpperCase().trim();

    // If a custom price was defined, save it to our central price dictionary first
    if (customPrice !== undefined && customPrice > 0) {
      setStockPrices((prev) => ({
        ...prev,
        [cleanSymbol]: customPrice,
      }));
    }

    setPortfolio((prev) => {
      const matchIndex = prev.findIndex((item) => item.symbol === cleanSymbol);
      if (matchIndex > -1) {
        // Increment quantity in existing holding
        const updated = [...prev];
        const prevQty = updated[matchIndex].quantity;
        updated[matchIndex] = {
          ...updated[matchIndex],
          quantity: prevQty + quantity,
        };
        showToast(`Added ${quantity} additional shares of ${cleanSymbol}`);
        return updated;
      } else {
        // Add new asset record
        showToast(`Successfully registered ${quantity} shares of ${cleanSymbol} to portfolio`);
        return [
          ...prev,
          {
            id: `holding-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            symbol: cleanSymbol,
            quantity,
          },
        ];
      }
    });
  };

  // Update Shares count directly
  const handleUpdateQuantity = (id: string, newQty: number) => {
    setPortfolio((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          showToast(`Adjusted shares of ${item.symbol} to ${newQty}`);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Delete holding entirely
  const handleDeleteItem = (id: string) => {
    const target = portfolio.find((item) => item.id === id);
    if (target) {
      setPortfolio((prev) => prev.filter((item) => item.id !== id));
      showToast(`Removed all shares of ${target.symbol} from portfolio`, "info");
    }
  };

  // Update individual ticker price inside dictionary
  const handleUpdatePrice = (symbol: string, newPrice: number) => {
    setStockPrices((prev) => ({
      ...prev,
      [symbol]: newPrice,
    }));
    showToast(`Price for ticker ${symbol} revised to $${newPrice.toFixed(2)}`);
  };

  // Reset prices back to baseline
  const handleResetPrices = () => {
    setStockPrices({ ...DEFAULT_STOCK_PRICES });
    showToast("Restored central dictionary price markers to setup defaults.", "info");
  };

  // Clear holdings
  const handleResetPortfolio = () => {
    setPortfolio([]);
    showToast("Cleared active user asset holdings", "info");
  };

  // Load Demo data
  const handleLoadDemo = () => {
    const demoHoldings: PortfolioItem[] = [
      { id: "holding-demo-1", symbol: "AAPL", quantity: 15 },
      { id: "holding-demo-2", symbol: "TSLA", quantity: 8 },
      { id: "holding-demo-3", symbol: "MSFT", quantity: 6 },
      { id: "holding-demo-4", symbol: "NVDA", quantity: 24 },
      { id: "holding-demo-5", symbol: "GOOGL", quantity: 12 },
    ];
    setPortfolio(demoHoldings);
    showToast("Loaded demo assets. Visualize splits instantly in chart widgets.");
  };

  // Calculations
  const totalValue = portfolio.reduce((sum, item) => {
    const price = stockPrices[item.symbol] || 0;
    return sum + price * item.quantity;
  }, 0);

  const totalShares = portfolio.reduce((sum, item) => sum + item.quantity, 0);

  const uniqueAssets = portfolio.length;

  // Largest asset holding check
  let maxHoldingSymbol = "N/A";
  let maxHoldingValue = 0;
  portfolio.forEach((item) => {
    const sharePrice = stockPrices[item.symbol] || 0;
    const holdValue = sharePrice * item.quantity;
    if (holdValue > maxHoldingValue) {
      maxHoldingValue = holdValue;
      maxHoldingSymbol = item.symbol;
    }
  });

  // Export CSV
  const handleExportCSV = () => {
    if (portfolio.length === 0) return;

    let csvContent = "Symbol,Asset Name,Market Price (USD),Units Held,Investment Subtotal (USD),Allocation Weight (%)\r\n";

    portfolio.forEach((item) => {
      const price = stockPrices[item.symbol] || 0;
      const subtotal = price * item.quantity;
      const weight = totalValue > 0 ? ((subtotal / totalValue) * 100).toFixed(2) : "0.00";
      const name = PRESET_INFO[item.symbol]?.name || "Sourced Asset";

      csvContent += `"${item.symbol}","${name.replace(/"/g, '""')}",${price},${item.quantity},${subtotal.toFixed(2)},${weight}\r\n`;
    });

    csvContent += `\r\n"TOTALS","",,${totalShares},${totalValue.toFixed(2)},100.00\r\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `portfolio_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Tabular CSV report download started.", "success");
  };

  // Export TXT
  const handleExportTXT = () => {
    if (portfolio.length === 0) return;

    const separator = "==========================================================================";
    const divider = "--------------------------------------------------------------------------";

    let textContent = `${separator}\n`;
    textContent += "                     STOCK PORTFOLIO VALUATION REPORT\n";
    textContent += `${separator}\n`;
    textContent += `Generated on  : ${new Date().toUTCString()}\n`;
    textContent += `Account Owner : Workspace User\n\n`;

    textContent += `PORTFOLIO HEALTH STATISTICS:\n`;
    textContent += `${divider}\n`;
    textContent += `Total Investment Valuation : $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    textContent += `Unique Tracked Assets      : ${uniqueAssets} stocks\n`;
    textContent += `Aggregated Stock Quantity  : ${totalShares.toLocaleString("en-US", { maximumFractionDigits: 4 })} units\n`;
    textContent += `Leading Portfolio Asset    : ${maxHoldingSymbol} ($${maxHoldingValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n\n`;

    textContent += `HOLDINGS ALLOCATION MATRIX:\n`;
    textContent += `${separator}\n`;
    textContent += `${"Symbol".padEnd(10)} | ${"Market Price".padEnd(14)} | ${"Units Held".padEnd(12)} | ${"Holding Subtotal".padEnd(16)} | ${"Weight".padEnd(8)}\n`;
    textContent += `${separator}\n`;

    portfolio.forEach((item) => {
      const price = stockPrices[item.symbol] || 0;
      const subtotal = price * item.quantity;
      const weight = totalValue > 0 ? ((subtotal / totalValue) * 100).toFixed(1) + "%" : "0.0%";

      const formattedSymbol = item.symbol.padEnd(10);
      const formattedPrice = `$${price.toFixed(2)}`.padEnd(14);
      const formattedQuantity = item.quantity.toLocaleString("en-US", { maximumFractionDigits: 4 }).padEnd(12);
      const formattedSubtotal = `$${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`.padEnd(16);
      const formattedWeight = weight.padEnd(8);

      textContent += `${formattedSymbol} | ${formattedPrice} | ${formattedQuantity} | ${formattedSubtotal} | ${formattedWeight}\n`;
    });

    textContent += `${separator}\n`;
    textContent += `${"AGGREGATES".padEnd(10)} | ${"".padEnd(14)} | ${totalShares.toLocaleString("en-US", { maximumFractionDigits: 4 }).padEnd(12)} | $${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).padEnd(16)} | 100.0%\n`;
    textContent += `${separator}\n`;
    textContent += `\n* Pricing details referenced dynamically from custom dictionary parameters.\n`;
    textContent += `Report compiled. End of document.\n`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `portfolio_valuation_${new Date().toISOString().split("T")[0]}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Styled TXT report download initiated.", "success");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-12 antialiased">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-500">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border ${
              notification.type === "success"
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-blue-600 text-white border-blue-500"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Modern Static Navigation */}
      <Header
        onExportCSV={handleExportCSV}
        onExportTXT={handleExportTXT}
        onReset={handleResetPortfolio}
        onLoadDemo={handleLoadDemo}
        hasItems={portfolio.length > 0}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6 flex-1">
        {/* Metric Cards Grid Container */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            id="metric-total-value"
            title="Total Investment"
            value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Calculated portfolio balance"
            icon={<DollarSign size={20} className="text-emerald-500" />}
            iconBg="bg-emerald-50"
          />

          <MetricCard
            id="metric-assets-count"
            title="Tracked Assets"
            value={uniqueAssets}
            subtitle="Unique custom stock entries"
            icon={<Layers size={20} className="text-blue-500" />}
            iconBg="bg-blue-50"
          />

          <MetricCard
            id="metric-shares-count"
            title="Aggregated Units"
            value={totalShares.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            subtitle="Total share holdings"
            icon={<Hash size={20} className="text-amber-500" />}
            iconBg="bg-amber-50"
          />

          <MetricCard
            id="metric-premier-asset"
            title="Primal Asset"
            value={maxHoldingSymbol}
            subtitle={maxHoldingValue > 0 ? `$${maxHoldingValue.toLocaleString("en-US", { maximumFractionDigits: 0 })} value` : "No holdings recorded"}
            icon={<Award size={20} className="text-indigo-500" />}
            iconBg="bg-indigo-50"
          />
        </section>

        {/* Dashboard Master Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <StockForm stockPrices={stockPrices} onAddStock={handleAddStock} />
            <DictionaryCard
              stockPrices={stockPrices}
              onUpdatePrice={handleUpdatePrice}
              onResetPrices={handleResetPrices}
            />
          </div>

          {/* Table & Chart Presentation */}
          <div className="lg:col-span-2 space-y-6">
            <PortfolioTable
              portfolio={portfolio}
              stockPrices={stockPrices}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteItem={handleDeleteItem}
              totalValue={totalValue}
            />

            <PortfolioAnalytics portfolio={portfolio} stockPrices={stockPrices} />
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="mt-16 text-center text-slate-400 text-xs">
        <p>© 2026 Stock Portfolio Tracker. Pragmatic offline key-value state persistence.</p>
      </footer>
    </div>
  );
}
