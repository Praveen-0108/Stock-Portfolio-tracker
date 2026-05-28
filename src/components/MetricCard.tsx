import { ReactNode } from "react";

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBg: string;
}

export default function MetricCard({ id, title, value, subtitle, icon, iconBg }: MetricCardProps) {
  return (
    <div
      id={id}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-start justify-between hover:border-slate-200 transition-all group"
    >
      <div className="space-y-2">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{title}</span>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {value}
          </h3>
          {subtitle && (
            <p className="text-slate-400 text-xs flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className={`p-3 rounded-xl ${iconBg} transition-transform group-hover:scale-105`}>
        {icon}
      </div>
    </div>
  );
}
