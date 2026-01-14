import React from 'react';
import { Card } from 'antd';
import { BookOpen, Users, UserPlus, TrendingUp, TrendingDown, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HighlightMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtext?: string;
  trend?: 'up' | 'down';
}

export const EmpresaHighlightMetrics: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  const cursosMetrics: HighlightMetric[] = [
    { 
      label: 'Normal', 
      value: 28, 
      icon: <CheckCircle className="w-5 h-5" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)',
      subtext: 'Sin observaciones'
    },
    { 
      label: 'Críticos', 
      value: 3, 
      icon: <AlertCircle className="w-5 h-5" />, 
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      subtext: 'Requiere atención',
      trend: 'down'
    },
    { 
      label: 'Medio', 
      value: 5, 
      icon: <AlertTriangle className="w-5 h-5" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)',
      subtext: 'En seguimiento'
    },
  ];

  const participantesMetrics: HighlightMetric[] = [
    { 
      label: 'Normal', 
      value: 156, 
      icon: <CheckCircle className="w-5 h-5" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)',
      subtext: 'Participantes activos'
    },
    { 
      label: 'Críticos', 
      value: 8, 
      icon: <AlertCircle className="w-5 h-5" />, 
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      subtext: 'Requiere atención',
      trend: 'down'
    },
    { 
      label: 'Medio', 
      value: 12, 
      icon: <AlertTriangle className="w-5 h-5" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)',
      subtext: 'En seguimiento'
    },
  ];

  const MetricCard = ({ metric }: { metric: HighlightMetric }) => (
    <div 
      className="rounded-xl p-3 transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer animate-fade-in"
      style={{ backgroundColor: metric.bgColor }}
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: metric.color, color: 'white' }}
        >
          {metric.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium truncate">{metric.label}</p>
          <div className="flex items-center gap-1">
            <p className="text-lg font-bold" style={{ color: metric.color }}>
              {metric.value}
            </p>
            {metric.trend && (
              metric.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Estado actual de los Cursos Section */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-foreground font-semibold text-sm">Estado actual de los Cursos</span>
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          {cursosMetrics.map((metric, index) => (
            <div key={metric.label} style={{ animationDelay: `${index * 100}ms` }}>
              <MetricCard metric={metric} />
            </div>
          ))}
        </div>
      </Card>

      {/* Participantes Section */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-foreground font-semibold text-sm">Participantes</span>
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          {participantesMetrics.map((metric, index) => (
            <div key={metric.label} style={{ animationDelay: `${index * 100}ms` }}>
              <MetricCard metric={metric} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};