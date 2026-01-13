import React from 'react';
import { Card } from 'antd';
import { BookOpen, CheckCircle, Archive, Users, Award, AlertCircle, Clock, TrendingUp, TrendingDown, Star, Trophy, Medal } from 'lucide-react';
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

interface RankingCourse {
  position: number;
  name: string;
  value: string | number;
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
      icon: <BookOpen className="w-5 h-5" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)',
      subtext: '+12% este mes',
      trend: 'up'
    },
    { 
      label: 'Cursos Ejecutados', 
      value: 156, 
      icon: <CheckCircle className="w-5 h-5" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)'
    },
    { 
      label: 'Cursos Cerrados', 
      value: 89, 
      icon: <Archive className="w-5 h-5" />, 
      color: '#8B9DC3',
      bgColor: 'rgba(139, 157, 195, 0.1)'
    },
    { 
      label: 'Cursos con Observaciones SENCE', 
      value: '8%', 
      icon: <AlertCircle className="w-5 h-5" />, 
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      subtext: 'Requiere atención',
      trend: 'down'
    },
  ];

  const participantesMetrics: HighlightMetric[] = [
    { 
      label: 'Participantes Inscritos', 
      value: '1,240', 
      icon: <Users className="w-5 h-5" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)'
    },
    { 
      label: 'Participantes Certificados', 
      value: '1,089', 
      icon: <Award className="w-5 h-5" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)',
      subtext: '87.8% de conversión',
      trend: 'up'
    },
    { 
      label: 'Promedio Días Comunicación', 
      value: '3.2 días', 
      icon: <Clock className="w-5 h-5" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)'
    },
  ];

  const topRatedCourses: RankingCourse[] = [
    { position: 1, name: 'Excel Avanzado', value: '4.9', subtext: '156 evaluaciones' },
    { position: 2, name: 'Liderazgo Efectivo', value: '4.8', subtext: '98 evaluaciones' },
    { position: 3, name: 'Gestión de Proyectos', value: '4.7', subtext: '124 evaluaciones' },
    { position: 4, name: 'Comunicación Asertiva', value: '4.6', subtext: '87 evaluaciones' },
    { position: 5, name: 'Trabajo en Equipo', value: '4.5', subtext: '112 evaluaciones' },
  ];

  const mostEnrolledCourses: RankingCourse[] = [
    { position: 1, name: 'Excel Básico e Intermedio', value: '342', subtext: 'inscritos' },
    { position: 2, name: 'Prevención de Riesgos', value: '289', subtext: 'inscritos' },
    { position: 3, name: 'Atención al Cliente', value: '256', subtext: 'inscritos' },
    { position: 4, name: 'Excel Avanzado', value: '198', subtext: 'inscritos' },
    { position: 5, name: 'Primeros Auxilios', value: '187', subtext: 'inscritos' },
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{position}</span>;
    }
  };

  const RankingItem = ({ course, showStars = false }: { course: RankingCourse; showStars?: boolean }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        {getPositionIcon(course.position)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{course.name}</p>
        <p className="text-xs text-muted-foreground">{course.subtext}</p>
      </div>
      <div className="flex items-center gap-1">
        {showStars && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
        <span className={`font-bold ${showStars ? 'text-yellow-600' : 'text-primary'}`}>
          {course.value}
        </span>
      </div>
    </div>
  );

  const MetricCard = ({ metric }: { metric: HighlightMetric }) => (
    <div 
      className="rounded-xl p-4 transition-all hover:scale-105 hover:shadow-md cursor-pointer animate-fade-in"
      style={{ backgroundColor: metric.bgColor }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: metric.color, color: 'white' }}
        >
          {metric.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium truncate">{metric.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-2xl font-bold" style={{ color: metric.color }}>
              {metric.value}
            </p>
            {metric.trend && (
              metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )
            )}
          </div>
          {metric.subtext && (
            <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cursos y Participantes en paralelo */}
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
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Participantes</span>
            </div>
          }
        >
          <div className="space-y-3">
            {participantesMetrics.map((metric, index) => (
              <div key={metric.label} style={{ animationDelay: `${index * 100}ms` }}>
                <MetricCard metric={metric} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rankings en paralelo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Courses */}
        <Card 
          className="shadow-sm border-0 bg-card"
          title={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
              <span className="text-foreground font-semibold">Cursos Mejor Valorados</span>
            </div>
          }
          styles={{ body: { padding: '12px 16px' } }}
        >
          <div className="space-y-1">
            {topRatedCourses.map((course) => (
              <RankingItem key={course.position} course={course} showStars />
            ))}
          </div>
        </Card>

        {/* Most Enrolled Courses */}
        <Card 
          className="shadow-sm border-0 bg-card"
          title={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Cursos Más Inscritos del Año</span>
            </div>
          }
          styles={{ body: { padding: '12px 16px' } }}
        >
          <div className="space-y-1">
            {mostEnrolledCourses.map((course) => (
              <RankingItem key={course.position} course={course} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
