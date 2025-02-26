import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: typeof LucideIcon;
  title: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  subtext,
  trend,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-200 rounded-lg">
          <Icon className="h-6 w-6 text-zinc-50" />
        </div>
        <div>
          <h3 className="text-gray-600 text-sm">{title}</h3>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">{value}</p>
            {trend && (
              <span
                className={`text-sm ${
                  trend.isPositive ? 'text-grey-500' : 'text-red-500'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;