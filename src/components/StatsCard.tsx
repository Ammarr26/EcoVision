
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ title, value, subtitle, icon, trend, className }: StatsCardProps) => {
  return (
    <Card className={cn("p-6 bg-white/50 backdrop-blur-sm border border-border/50 animate-fade-in", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">{title}</p>
          <h3 className="text-2xl font-semibold mt-2">{value}</h3>
          {subtitle && <p className="text-sm text-secondary mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      {trend && (
        <div className={cn(
          "mt-4 text-sm flex items-center gap-1",
          trend.positive ? "text-success" : "text-destructive"
        )}>
          <span>{trend.positive ? "↑" : "↓"}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-secondary ml-1">vs last month</span>
        </div>
      )}
    </Card>
  );
};
