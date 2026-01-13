import React from 'react';
import { Card } from 'antd';
import { BookOpen, CheckCircle, Archive, Users, Award, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HighlightMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtext?: string;
}

export const OTECHighlightMetrics: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'OTEC' && user.role !== 'OTEC_REPRESENTANTE')) {
    return null;
  }

  const cursosMetrics: HighlightMetric[] = [
    { 
      label: 'Cursos Activos', 
      value: 24, 
      icon: <BookOpen className="w-6 h-6" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)',
      subtext: '+12% este mes'
    },
    { 
      label: 'Ejecutados', 
      value: 156, 
      icon: <CheckCircle className="w-6 h-6" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)'
    },
    { 
      label: 'Cerrados', 
      value: 89, 
      icon: <Archive className="w-6 h-6" />, 
      color: '#8B9DC3',
      bgColor: 'rgba(139, 157, 195, 0.1)'
    },
    { 
      label: 'Con Observaciones', 
      value: '8%', 
      icon: <AlertCircle className="w-6 h-6" />, 
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      subtext: 'Requiere atención'
    },
  ];

  const participantesMetrics: HighlightMetric[] = [
    { 
      label: 'Inscritos', 
      value: '1,240', 
      icon: <Users className="w-6 h-6" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)'
    },
    { 
      label: 'Certificados', 
      value: '1,089', 
      icon: <Award className="w-6 h-6" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)',
      subtext: '87.8% de conversión'
    },
    { 
      label: 'Promedio Días Comunicación', 
      value: '3.2', 
      icon: <Clock className="w-6 h-6" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)',
      subtext: 'días'
    },
  ];

  const MetricCard = ({ metric }: { metric: HighlightMetric }) => (
    <div 
      className="rounded-xl p-4 transition-all hover:scale-105 hover:shadow-md cursor-pointer"
      style={{ backgroundColor: metric.bgColor }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: metric.color, color: 'white' }}
        >
          {metric.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium truncate">{metric.label}</p>
          <p className="text-2xl font-bold mt-0.5" style={{ color: metric.color }}>
            {metric.value}
          </p>
          {metric.subtext && (
            <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cursos Section */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-semibold">Cursos</span>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          {cursosMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </Card>

      {/* Participantes Section */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-semibold">Participantes</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3">
          {participantesMetrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </Card>
    </div>
  );
};
