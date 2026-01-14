import React from 'react';
import { Card, Button } from 'antd';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  FileEdit,
  Send,
  UserCheck,
  Play,
  FileOutput,
  ArrowRight,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface StatusMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: 'up' | 'down';
}

export const EmpresaHighlightMetrics: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  // Etapa de los Cursos (pipeline stages)
  const etapasCursos: StatusMetric[] = [
    { label: 'Borradores', value: 3, icon: <FileEdit className="w-4 h-4" />, color: '#8B9DC3', bgColor: 'rgba(139, 157, 195, 0.1)' },
    { label: 'Por Comunicar', value: 5, icon: <Send className="w-4 h-4" />, color: '#F5A623', bgColor: 'rgba(245, 166, 35, 0.1)' },
    { label: 'Inscritos', value: 12, icon: <UserCheck className="w-4 h-4" />, color: '#4A90A4', bgColor: 'rgba(74, 144, 164, 0.1)' },
    { label: 'En Ejecución', value: 8, icon: <Play className="w-4 h-4" />, color: '#65BFB1', bgColor: 'rgba(101, 191, 177, 0.1)' },
    { label: 'Por Emisión OC', value: 4, icon: <FileOutput className="w-4 h-4" />, color: '#E74C3C', bgColor: 'rgba(231, 76, 60, 0.1)' },
  ];

  // Estado de los cursos (same visual style as etapas)
  const estadoCursos: StatusMetric[] = [
    { label: 'Normal', value: 28, icon: <CheckCircle className="w-4 h-4" />, color: '#65BFB1', bgColor: 'rgba(101, 191, 177, 0.1)' },
    { label: 'Críticos', value: 3, icon: <AlertCircle className="w-4 h-4" />, color: '#E74C3C', bgColor: 'rgba(231, 76, 60, 0.1)', trend: 'down' },
    { label: 'Medio', value: 5, icon: <AlertTriangle className="w-4 h-4" />, color: '#F5A623', bgColor: 'rgba(245, 166, 35, 0.1)' },
  ];

  const isRepresentante = user.role === 'EMPRESA_REPRESENTANTE';

  const StatusCard = ({ metric, showConnector = false }: { metric: StatusMetric; showConnector?: boolean }) => (
    <div 
      className="relative rounded-xl p-3 text-center transition-all hover:scale-[1.03] cursor-pointer group"
      style={{ backgroundColor: metric.bgColor }}
    >
      {showConnector && (
        <div className="absolute top-1/2 -right-1 w-2 h-0.5 bg-border z-10" />
      )}
      <div 
        className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110"
        style={{ backgroundColor: metric.color, color: 'white' }}
      >
        {metric.icon}
      </div>
      <div className="flex items-center justify-center gap-1">
        <p className="text-xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
        {metric.trend && (
          metric.trend === 'up' ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )
        )}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{metric.label}</p>
    </div>
  );

  return (
    <Card 
      className="shadow-sm border-0 bg-card"
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-foreground font-semibold">Gestión de Cursos</span>
              <p className="text-xs text-muted-foreground font-normal">
                {isRepresentante ? 'Vista consolidada de capacitaciones' : 'Resumen de tu gestión'}
              </p>
            </div>
          </div>
          <Button type="link" className="text-primary flex items-center gap-1 p-0">
            Ver detalle <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Etapa de los Cursos */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Etapa de los Cursos</h4>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {etapasCursos.map((stage, index) => (
              <StatusCard 
                key={stage.label} 
                metric={stage} 
                showConnector={index < etapasCursos.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Estado de los Cursos - Same visual style */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Estado de los Cursos</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {estadoCursos.map((status) => (
              <StatusCard key={status.label} metric={status} />
            ))}
          </div>
        </div>

        {/* Summary footer */}
        <div className="flex items-center justify-center pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span><strong className="text-foreground">32</strong> cursos totales</span>
            <span className="text-border">•</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#65BFB1]" />
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
                <span>Medio</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#E74C3C]" />
                <span>Crítico</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};