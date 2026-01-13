import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardMetricsByRole } from '@/config/menuConfig';
import { DynamicIcon } from '@/components/icons/DynamicIcon';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const DashboardMetrics: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const metrics = dashboardMetricsByRole[user.role] || [];

  const getChangeIcon = (changeType?: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getChangeBgColor = (changeType?: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      case 'neutral':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return '';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id} 
            className={`stat-card ${getChangeBgColor(metric.changeType)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="stat-card-label">{metric.label}</p>
                <p className="stat-card-value mt-1">{metric.value}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {metric.icon && (
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <DynamicIcon 
                      name={metric.icon} 
                      className="w-5 h-5 text-muted-foreground" 
                    />
                  </div>
                )}
                {metric.changeType && (
                  <div className="flex items-center gap-1">
                    {getChangeIcon(metric.changeType)}
                    {metric.change !== undefined && (
                      <span className={`text-xs font-medium ${
                        metric.changeType === 'positive' ? 'text-green-600' :
                        metric.changeType === 'negative' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {typeof metric.change === 'number' && metric.change > 0 ? '+' : ''}
                        {metric.change}
                        {typeof metric.change === 'number' ? '%' : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
