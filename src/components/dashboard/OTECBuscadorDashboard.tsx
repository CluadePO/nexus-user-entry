import React from 'react';
import { 
  Eye, 
  Star, 
  TrendingUp, 
  FileText, 
  Search,
  Clock,
  AlertTriangle,
  ArrowRight,
  Users,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock data for OTEC dashboard
const mostVisitedCourses = [
  { id: 1, name: 'Excel Avanzado para Análisis de Datos', visits: 1250, trend: '+15%' },
  { id: 2, name: 'Liderazgo y Gestión de Equipos', visits: 890, trend: '+8%' },
  { id: 3, name: 'Seguridad Industrial y Prevención', visits: 756, trend: '+5%' },
  { id: 4, name: 'Marketing Digital Avanzado', visits: 654, trend: '+12%' },
];

const bestRatedCourses = [
  { id: 1, name: 'Gestión de Proyectos Ágiles', rating: 4.9, reviews: 234 },
  { id: 2, name: 'Liderazgo Transformacional', rating: 4.8, reviews: 189 },
  { id: 3, name: 'Excel para Finanzas', rating: 4.8, reviews: 156 },
  { id: 4, name: 'Comunicación Efectiva', rating: 4.7, reviews: 142 },
];

const pendingQuotes = [
  { id: 1, company: 'Empresa ABC S.A.', course: 'Excel Avanzado', date: 'Hace 2 horas', participants: 15 },
  { id: 2, company: 'Minera del Norte', course: 'Seguridad Industrial', date: 'Hace 5 horas', participants: 25 },
  { id: 3, company: 'Retail Chile Ltda.', course: 'Servicio al Cliente', date: 'Hace 1 día', participants: 12 },
];

const usersAlsoInterested = [
  { id: 1, category: 'Habilidades Blandas', searches: 1250 },
  { id: 2, category: 'Tecnología', searches: 980 },
  { id: 3, category: 'Seguridad Laboral', searches: 756 },
  { id: 4, category: 'Gestión de Proyectos', searches: 623 },
];

const expiringCourses = [
  { id: 1, name: 'Primeros Auxilios Básicos', code: 'SENCE-2024-001', expiresIn: 15 },
  { id: 2, name: 'Manejo Defensivo', code: 'SENCE-2024-023', expiresIn: 22 },
  { id: 3, name: 'Trabajo en Altura', code: 'SENCE-2024-045', expiresIn: 30 },
];

export const OTECBuscadorDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          Panel de tu OTEC en el Marketplace 📊
        </h2>
        <p className="text-muted-foreground">
          Monitorea el rendimiento de tus cursos en el buscador
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Apareciste en N búsquedas */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Apareciste en búsquedas</p>
                <p className="text-3xl font-bold mt-1">2,847</p>
                <p className="text-xs text-emerald-600 mt-1">+18% vs mes anterior</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasa de conversión */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Conversión</p>
                <p className="text-3xl font-bold mt-1">12.4%</p>
                <p className="text-xs text-emerald-600 mt-1">+2.1% vs mes anterior</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <Progress value={12.4} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">De visita a cotización</p>
            </div>
          </CardContent>
        </Card>

        {/* Cotizaciones pendientes */}
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cotizaciones Pendientes</p>
                <p className="text-3xl font-bold mt-1">{pendingQuotes.length}</p>
                <p className="text-xs text-amber-600 mt-1">Requieren respuesta</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tus cursos más visitados */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4 text-primary" />
                Tus cursos más visitados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mostVisitedCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{course.name}</p>
                        <p className="text-xs text-muted-foreground">{course.visits.toLocaleString()} visitas</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20">
                      {course.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tus cursos mejor valorados */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4 text-amber-500" />
                Tus cursos mejor valorados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bestRatedCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{course.name}</p>
                        <p className="text-xs text-muted-foreground">{course.reviews} reseñas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-sm">{course.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Los usuarios también se interesan en */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-violet-500" />
                Los usuarios también se interesan en
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Categorías populares que buscan usuarios interesados en tus cursos</p>
              <div className="grid grid-cols-2 gap-3">
                {usersAlsoInterested.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="font-medium text-sm">{item.category}</span>
                    <span className="text-xs text-muted-foreground">{item.searches.toLocaleString()} búsquedas</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Solicitudes de cotización pendientes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-amber-500" />
                  Cotizaciones pendientes
                </CardTitle>
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  Ver todas <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingQuotes.map((quote) => (
                  <div key={quote.id} className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{quote.company}</p>
                        <p className="text-xs text-muted-foreground">{quote.course}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {quote.participants} participantes
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{quote.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cursos por vencer (Sence) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                Cursos por vencer (Sence)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/10">
                    <div>
                      <p className="font-medium text-sm">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.code}</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {course.expiresIn} días
                    </Badge>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-primary hover:underline flex items-center justify-center gap-1">
                Renovar códigos SENCE <ArrowRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
