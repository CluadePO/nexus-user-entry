import React from 'react';
import { Card, Button, Tag } from 'antd';
import { 
  BookOpen, 
  ExternalLink,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
  Target,
  Search,
  TrendingUp,
  Star,
  FileText,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CourseItem {
  id: string;
  name: string;
  otec: string;
  participants: number;
  startDate: string;
  status: 'inscrito' | 'en_ejecucion' | 'por_iniciar';
  statusColor: string;
}

interface RecommendedCourse {
  id: string;
  name: string;
  source: 'dnc' | 'recomendacion' | 'buscador';
  rating: number;
  participants: number;
  relevance: number;
  otec: string;
}

export const EmpresaHighlightMetrics: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  // Últimos cursos inscritos
  const ultimosCursos: CourseItem[] = [
    { id: '1', name: 'Excel Avanzado para Análisis de Datos', otec: 'Capacitaciones Pro', participants: 15, startDate: '15 Ene 2026', status: 'inscrito', statusColor: '#4A90A4' },
    { id: '2', name: 'Liderazgo y Gestión de Equipos', otec: 'Formación Empresarial', participants: 12, startDate: '18 Ene 2026', status: 'por_iniciar', statusColor: '#F5A623' },
    { id: '3', name: 'Prevención de Riesgos Laborales', otec: 'Seguridad Integral', participants: 20, startDate: '10 Ene 2026', status: 'en_ejecucion', statusColor: '#65BFB1' },
    { id: '4', name: 'Atención al Cliente de Excelencia', otec: 'Servicio Plus', participants: 8, startDate: '22 Ene 2026', status: 'inscrito', statusColor: '#4A90A4' },
    { id: '5', name: 'Trabajo en Equipo y Comunicación', otec: 'Desarrollo Humano', participants: 18, startDate: '25 Ene 2026', status: 'inscrito', statusColor: '#4A90A4' },
  ];

  // Cursos recomendados (DNC + Recomendaciones + Buscador)
  const cursosRecomendados: RecommendedCourse[] = [
    { id: 'r1', name: 'Gestión del Tiempo y Productividad', source: 'dnc', rating: 4.8, participants: 245, relevance: 95, otec: 'Productividad Total' },
    { id: 'r2', name: 'Transformación Digital para Empresas', source: 'recomendacion', rating: 4.9, participants: 180, relevance: 92, otec: 'Digital Skills' },
    { id: 'r3', name: 'Comunicación Efectiva en el Trabajo', source: 'dnc', rating: 4.7, participants: 320, relevance: 88, otec: 'Comunicación Pro' },
    { id: 'r4', name: 'Excel para Finanzas', source: 'buscador', rating: 4.9, participants: 450, relevance: 85, otec: 'Tech Training' },
    { id: 'r5', name: 'Negociación y Resolución de Conflictos', source: 'recomendacion', rating: 4.6, participants: 156, relevance: 82, otec: 'Desarrollo Empresarial' },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'inscrito': return 'Inscrito';
      case 'en_ejecucion': return 'En Ejecución';
      case 'por_iniciar': return 'Por Iniciar';
      default: return status;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'dnc': return <Target className="w-3 h-3" />;
      case 'recomendacion': return <Sparkles className="w-3 h-3" />;
      case 'buscador': return <Search className="w-3 h-3" />;
      default: return null;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'dnc': return 'DNC';
      case 'recomendacion': return 'IA Recomienda';
      case 'buscador': return 'Top Buscador';
      default: return source;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'dnc': return '#9B59B6';
      case 'recomendacion': return '#65BFB1';
      case 'buscador': return '#4A90A4';
      default: return '#8B9DC3';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Últimos Cursos Inscritos */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-foreground font-semibold">Últimos Cursos Inscritos</span>
                <p className="text-xs text-muted-foreground font-normal">Inscripciones recientes</p>
              </div>
            </div>
            <Button type="link" className="text-primary flex items-center gap-1 p-0">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {ultimosCursos.map((curso) => (
            <div 
              key={curso.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">{curso.name}</h4>
                  <Tag 
                    className="text-[10px] border-0 m-0"
                    style={{ backgroundColor: `${curso.statusColor}20`, color: curso.statusColor }}
                  >
                    {getStatusLabel(curso.status)}
                  </Tag>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{curso.otec}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {curso.participants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {curso.startDate}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Cursos Recomendados - Conectado con Plan de Capacitación */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9B59B6] to-[#9B59B6]/70 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-foreground font-semibold">Cursos Recomendados</span>
                <p className="text-xs text-muted-foreground font-normal">Basado en DNC y Plan de Capacitación</p>
              </div>
            </div>
            <Button type="link" className="text-primary flex items-center gap-1 p-0">
              Explorar más <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {/* Leyenda de fuentes */}
          <div className="flex items-center gap-3 pb-2 mb-2 border-b border-border/50">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <div className="w-4 h-4 rounded bg-[#9B59B6]/20 flex items-center justify-center">
                <Target className="w-2.5 h-2.5 text-[#9B59B6]" />
              </div>
              <span>DNC</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <div className="w-4 h-4 rounded bg-[#65BFB1]/20 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-[#65BFB1]" />
              </div>
              <span>IA Recomienda</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <div className="w-4 h-4 rounded bg-[#4A90A4]/20 flex items-center justify-center">
                <Search className="w-2.5 h-2.5 text-[#4A90A4]" />
              </div>
              <span>Top Buscador</span>
            </div>
          </div>

          {cursosRecomendados.map((curso) => (
            <div 
              key={curso.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${getSourceColor(curso.source)}20`, color: getSourceColor(curso.source) }}
                  >
                    {getSourceIcon(curso.source)}
                  </div>
                  <h4 className="text-sm font-medium text-foreground truncate">{curso.name}</h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground ml-7">
                  <span className="truncate">{curso.otec}</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {curso.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {curso.participants}
                  </span>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {curso.relevance}% match
                  </span>
                </div>
              </div>
              <Button 
                type="primary" 
                size="small"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-xs h-7"
              >
                Agregar
              </Button>
            </div>
          ))}

          {/* CTA para Plan de Capacitación */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/10 to-[#9B59B6]/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Actualiza tu Plan de Capacitación</p>
                  <p className="text-xs text-muted-foreground">Incluye estos cursos basados en tu DNC</p>
                </div>
              </div>
              <Button type="primary" size="small" className="bg-primary hover:bg-primary/90">
                Ir al Plan
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};