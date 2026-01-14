import React, { useState } from 'react';
import { Card } from 'antd';
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PlanMetric {
  label: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  color: string;
}

interface CourseMonth {
  month: string;
  shortMonth: string;
  courses: number;
  participants: number;
  isCurrentMonth?: boolean;
}

export const EmpresaPlanCapacitacion: React.FC = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // January = 0
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  const planMetrics: PlanMetric[] = [
    {
      label: 'Dotación Empresa',
      value: 450,
      subtext: 'Colaboradores activos',
      icon: <Users className="w-5 h-5" />,
      color: '#65BFB1'
    },
    {
      label: 'Cursos Planificados',
      value: 36,
      subtext: 'Para el año 2026',
      icon: <BookOpen className="w-5 h-5" />,
      color: '#4A90A4'
    },
    {
      label: 'Participantes/Curso',
      value: 15,
      subtext: 'Promedio estimado',
      icon: <UserCheck className="w-5 h-5" />,
      color: '#F5A623'
    },
    {
      label: 'Meta de Cobertura',
      value: '85%',
      subtext: 'Del personal capacitado',
      icon: <Target className="w-5 h-5" />,
      color: '#9B59B6'
    }
  ];

  const monthsData: CourseMonth[] = [
    { month: 'Enero', shortMonth: 'Ene', courses: 4, participants: 60, isCurrentMonth: true },
    { month: 'Febrero', shortMonth: 'Feb', courses: 3, participants: 45 },
    { month: 'Marzo', shortMonth: 'Mar', courses: 5, participants: 75 },
    { month: 'Abril', shortMonth: 'Abr', courses: 2, participants: 30 },
    { month: 'Mayo', shortMonth: 'May', courses: 4, participants: 60 },
    { month: 'Junio', shortMonth: 'Jun', courses: 3, participants: 45 },
    { month: 'Julio', shortMonth: 'Jul', courses: 2, participants: 30 },
    { month: 'Agosto', shortMonth: 'Ago', courses: 4, participants: 60 },
    { month: 'Septiembre', shortMonth: 'Sep', courses: 3, participants: 45 },
    { month: 'Octubre', shortMonth: 'Oct', courses: 3, participants: 45 },
    { month: 'Noviembre', shortMonth: 'Nov', courses: 2, participants: 30 },
    { month: 'Diciembre', shortMonth: 'Dic', courses: 1, participants: 15 }
  ];

  const maxCourses = Math.max(...monthsData.map(m => m.courses));

  const getBarHeight = (courses: number) => {
    return (courses / maxCourses) * 100;
  };

  const getBarColor = (courses: number, isCurrentMonth?: boolean) => {
    if (isCurrentMonth) return '#65BFB1';
    if (courses >= 4) return '#4A90A4';
    if (courses >= 3) return '#F5A623';
    return '#8B9DC3';
  };

  return (
    <Card 
      className="shadow-sm border-0 bg-card h-full"
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-foreground font-semibold">Plan de Capacitación 2026</span>
            <p className="text-xs text-muted-foreground font-normal">Planificación anual de cursos</p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {planMetrics.map((metric) => (
            <div 
              key={metric.label}
              className="relative overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.02] cursor-pointer group"
              style={{ 
                background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}05 100%)`,
                borderLeft: `3px solid ${metric.color}`
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{metric.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{metric.subtext}</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: metric.color, color: 'white' }}
                >
                  {metric.icon}
                </div>
              </div>
              {/* Decorative element */}
              <div 
                className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10"
                style={{ backgroundColor: metric.color }}
              />
            </div>
          ))}
        </div>

        {/* Visual Calendar - Bar Chart Style */}
        <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Distribución Mensual</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                className="w-6 h-6 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-xs text-muted-foreground px-2">2026</span>
              <button 
                className="w-6 h-6 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-1 h-32 mb-2">
            {monthsData.map((month, index) => (
              <div 
                key={month.month}
                className="flex-1 flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedMonth(index)}
              >
                <div className="relative w-full flex justify-center mb-1">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                    <p className="text-xs font-semibold text-foreground">{month.month}</p>
                    <p className="text-[10px] text-muted-foreground">{month.courses} cursos</p>
                    <p className="text-[10px] text-muted-foreground">{month.participants} participantes</p>
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className={`w-full max-w-6 rounded-t-md transition-all duration-300 ${
                      selectedMonth === index ? 'ring-2 ring-primary ring-offset-1' : ''
                    }`}
                    style={{ 
                      height: `${getBarHeight(month.courses)}%`,
                      minHeight: '8px',
                      backgroundColor: getBarColor(month.courses, month.isCurrentMonth)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Month Labels */}
          <div className="flex justify-between gap-1">
            {monthsData.map((month, index) => (
              <div 
                key={month.month} 
                className={`flex-1 text-center text-[9px] font-medium transition-colors ${
                  selectedMonth === index 
                    ? 'text-primary' 
                    : month.isCurrentMonth 
                      ? 'text-primary/70' 
                      : 'text-muted-foreground'
                }`}
              >
                {month.shortMonth}
              </div>
            ))}
          </div>

          {/* Selected Month Details */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {monthsData[selectedMonth].month} 2026
                </p>
                <p className="text-xs text-muted-foreground">Detalle del mes seleccionado</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">{monthsData[selectedMonth].courses}</p>
                  <p className="text-[10px] text-muted-foreground">Cursos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{monthsData[selectedMonth].participants}</p>
                  <p className="text-[10px] text-muted-foreground">Participantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#65BFB1]" />
            <span>Mes actual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#4A90A4]" />
            <span>Alta actividad</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
            <span>Media</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#8B9DC3]" />
            <span>Baja</span>
          </div>
        </div>
      </div>
    </Card>
  );
};