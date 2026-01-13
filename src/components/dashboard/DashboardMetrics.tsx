import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { dashboardMetricsByRole } from '@/config/menuConfig';
import { DynamicIcon } from '@/components/icons/DynamicIcon';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from 'antd';

interface MetricGroup {
  title: string;
  metricIds: string[];
}

const getMetricGroupsForRole = (role: string): MetricGroup[] => {
  switch (role) {
    case 'OTEC':
    case 'OTEC_REPRESENTANTE':
      return [];
    case 'OTEC_REPRESENTANTE':
      return [];
    case 'EMPRESA':
      return [
        { title: 'Cursos', metricIds: ['1', '2', '3', '4'] },
        { title: 'Trabajadores', metricIds: ['5', '6', '7'] },
        { title: 'Financiero', metricIds: ['8', '9', '10', '11', '12'] },
      ];
    case 'EMPRESA_REPRESENTANTE':
      return [
        { title: 'Resumen General', metricIds: ['1', '2', '3', '4'] },
      ];
    case 'OTIC':
      return [
        { title: 'Gestión', metricIds: ['1', '2', '3'] },
        { title: 'Financiero', metricIds: ['4', '5', '6'] },
      ];
    default:
      return [];
  }
};

export const DashboardMetrics: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const allMetrics = dashboardMetricsByRole[user.role] || [];
  const metricGroups = getMetricGroupsForRole(user.role);

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
        return 'bg-card border-border';
    }
  };

  return (
    <div className="space-y-6">
      {metricGroups.map((group) => {
        const groupMetrics = allMetrics.filter(m => group.metricIds.includes(m.id));
        
        return (
          <Card 
            key={group.title}
            title={<span className="text-foreground font-semibold">{group.title}</span>}
            className="shadow-sm border-border"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {groupMetrics.map((metric) => (
                <div 
                  key={metric.id} 
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${getChangeBgColor(metric.changeType)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {metric.icon && (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <DynamicIcon 
                            name={metric.icon} 
                            className="w-5 h-5 text-primary" 
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
          </Card>
        );
      })}
    </div>
  );
};
