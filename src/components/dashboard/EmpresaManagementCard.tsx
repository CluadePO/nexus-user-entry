import React from 'react';
import { Card, Button } from 'antd';
import { 
  FileEdit, 
  Send, 
  UserCheck, 
  Play, 
  FileOutput, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Wallet, 
  Lock, 
  CreditCard, 
  PiggyBank, 
  TrendingDown,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface EmpresaStatus {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface UpcomingCourse {
  id: string;
  name: string;
  startDate: string;
  daysRemaining: number;
}

interface FinancieroItem {
  key: string;
  indicador: string;
  valor: string | number;
  numericValue: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}

// Resumen Financiero Component - with Pie Charts
export const EmpresaResumenFinanciero: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  const financieroData: FinancieroItem[] = [
    { 
      key: '1', 
      indicador: 'Inversión Mensual', 
      valor: '$12.5M', 
      numericValue: 12.5,
      icon: <TrendingUp className="w-5 h-5" />,
      trend: 'up',
      trendValue: '+15%',
      color: '#65BFB1'
    },
    { 
      key: '2', 
      indicador: 'Franquicia Disponible', 
      valor: '$45M', 
      numericValue: 45,
      icon: <Wallet className="w-5 h-5" />,
      color: '#4A90A4'
    },
    { 
      key: '3', 
      indicador: 'Monto Comprometido', 
      valor: '$28M', 
      numericValue: 28,
      icon: <Lock className="w-5 h-5" />,
      trend: 'up',
      trendValue: '+$5M',
      color: '#F5A623'
    },
    { 
      key: '4', 
      indicador: 'Monto Utilizado', 
      valor: '$18M', 
      numericValue: 18,
      icon: <CreditCard className="w-5 h-5" />,
      color: '#8B9DC3'
    },
    { 
      key: '5', 
      indicador: 'Saldo Disponible', 
      valor: '$17M', 
      numericValue: 17,
      icon: <PiggyBank className="w-5 h-5" />,
      trend: 'up',
      trendValue: '+$2M',
      color: '#65BFB1'
    },
  ];

  return (
    <Card 
      className="shadow-sm border-0 bg-card"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <span className="text-foreground font-semibold">Resumen Financiero</span>
        </div>
      }
    >
      <div className="grid grid-cols-5 gap-4">
        {financieroData.map((item) => {
          const pieData = [
            { name: item.indicador, value: item.numericValue },
            { name: 'Resto', value: 50 - item.numericValue }
          ];
          const percentage = Math.round((item.numericValue / 50) * 100);

          return (
            <div 
              key={item.key}
              className="flex flex-col items-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="relative w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill={item.color} />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`$${value}M`, '']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold" style={{ color: item.color }}>{percentage}%</span>
                </div>
              </div>
              
              <div className="text-center mt-2">
                <p className="text-lg font-bold text-foreground">{item.valor}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">{item.indicador}</p>
                {item.trend && (
                  <div className={`flex items-center justify-center gap-0.5 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.trendValue}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Etapa de Cursos Component
export const EmpresaEtapaCursos: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  const empresaStatuses: EmpresaStatus[] = [
    { 
      label: 'Borradores', 
      value: 3, 
      icon: <FileEdit className="w-5 h-5" />, 
      color: '#8B9DC3',
      bgColor: 'rgba(139, 157, 195, 0.1)'
    },
    { 
      label: 'Por Comunicar', 
      value: 5, 
      icon: <Send className="w-5 h-5" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)'
    },
    { 
      label: 'Inscritos', 
      value: 12, 
      icon: <UserCheck className="w-5 h-5" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)'
    },
    { 
      label: 'En Ejecución', 
      value: 8, 
      icon: <Play className="w-5 h-5" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)'
    },
    { 
      label: 'Por Emisión OC', 
      value: 4, 
      icon: <FileOutput className="w-5 h-5" />, 
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)'
    },
  ];

  const isRepresentante = user.role === 'EMPRESA_REPRESENTANTE';

  return (
    <Card className="shadow-sm border-0 bg-card">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Etapa de los Cursos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isRepresentante 
                ? 'Resumen general de capacitaciones' 
                : 'Estado actual de tus cursos'}
            </p>
          </div>
          <Button type="link" className="text-primary flex items-center gap-1 p-0">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Cards - 5 columns */}
        <div className="grid grid-cols-5 gap-2">
          {empresaStatuses.map((status) => (
            <div 
              key={status.label}
              className="rounded-xl p-3 text-center transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: status.bgColor }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: status.color, color: 'white' }}
              >
                {status.icon}
              </div>
              <p className="text-xl font-bold" style={{ color: status.color }}>
                {status.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">{status.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Próximos Cursos Component
export const EmpresaProximosCursos: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  const upcomingCourses: UpcomingCourse[] = [
    { id: '1', name: 'Excel Avanzado', startDate: '15 Ene', daysRemaining: 2 },
    { id: '2', name: 'Liderazgo y Gestión', startDate: '18 Ene', daysRemaining: 5 },
    { id: '3', name: 'Prevención de Riesgos', startDate: '20 Ene', daysRemaining: 7 },
    { id: '4', name: 'Atención al Cliente', startDate: '22 Ene', daysRemaining: 9 },
    { id: '5', name: 'Trabajo en Equipo', startDate: '25 Ene', daysRemaining: 12 },
  ];

  return (
    <Card className="shadow-sm border-0 bg-card h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-foreground">Próximos Cursos</p>
          <p className="text-xs text-muted-foreground">Cursos por iniciar</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{upcomingCourses.length}</p>
        </div>
      </div>
      
      {/* Lista de próximos cursos */}
      <div className="space-y-2 border-t border-primary/10 pt-3">
        {upcomingCourses.map((course) => (
          <div 
            key={course.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`w-2 h-2 rounded-full ${course.daysRemaining <= 3 ? 'bg-red-500' : course.daysRemaining <= 7 ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="text-sm font-medium text-foreground truncate">{course.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{course.startDate}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${course.daysRemaining <= 3 ? 'bg-red-100 text-red-700' : course.daysRemaining <= 7 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {course.daysRemaining}d
              </span>
              <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Legacy export for backwards compatibility
export const EmpresaManagementCard = EmpresaResumenFinanciero;