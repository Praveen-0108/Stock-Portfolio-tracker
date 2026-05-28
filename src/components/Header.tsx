import { TrendingUp, FileText, Download, RotateCcw, Sparkles } from "lucide-react";

interface HeaderProps {
  onExportCSV: () => void;
  onExportTXT: () => void;
  onReset: () => void;
  onLoadDemo: () => void;
  hasItems: boolean;
}

export default function Header({ onExportCSV, onExportTXT, onReset, onLoadDemo, hasItems }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-100 py-5 px-6 sm:px-8 mb-8 sticky top-0 z-10 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo/Title Area */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <TrendingUp size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-2xl tracking-tight text-slate-800 flex items-center gap-2">
              Stock Portfolio Tracker
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your stock holdings and calculate real-time portfolio analytics.
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-2 md:self-center">
          <button
            id="btn-load-demo"
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Pre-populate with sample stocks to explore features"
          >
            <Sparkles size={16} className="text-blue-500" />
            <span>Load Demo</span>
          </button>

          {hasItems && (
            <>
              <button
                id="btn-export-csv"
                onClick={onExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Download report as tabular CSV file"
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>

              <button
                id="btn-export-txt"
                onClick={onExportTXT}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 active:bg-black text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
                title="Download report as text document"
              >
                <FileText size={16} />
                <span>Export TXT</span>
              </button>

              <button
                id="btn-reset-portfolio"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 text-sm font-medium rounded-xl border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                title="Clear all portfolio holdings"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
