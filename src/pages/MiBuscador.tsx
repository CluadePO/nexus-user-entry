import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  GitCompare, 
  Eye, 
  BookOpen, 
  Clock, 
  MapPin, 
  Building2, 
  DollarSign,
  TrendingUp,
  Award,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Home,
  X,
  Heart,
  FileText,
  Users,
  ArrowRight,
  Upload,
  Shield,
  Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { ChileRegionsMap } from '@/components/dashboard/ChileRegionsMap';
import { OTECBuscadorDashboard } from '@/components/dashboard/OTECBuscadorDashboard';
import { useAuth } from '@/context/AuthContext';

interface Course {
  id: string;
  name: string;
  type: 'Sence' | 'No Sence';
  modality: 'Presencial' | 'Distancia' | 'E-learning';
  provider: string;
  price: number;
  hours: number;
  rating: number;
  participants: number;
  category: string;
  area: string;
  region: string;
  imageUrl: string;
  isFavorite: boolean;
}

const courseImages = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop',
];

const areas = [
  'Tecnología',
  'Habilidades Blandas',
  'Seguridad',
  'Marketing',
  'Gestión',
  'Idiomas',
  'Finanzas',
  'Servicio',
  'Recursos Humanos',
  'Logística',
];

const regiones = [
  'Metropolitana',
  'Valparaíso',
  'Biobío',
  'Araucanía',
  'O\'Higgins',
  'Maule',
  'Los Lagos',
  'Antofagasta',
  'Coquimbo',
  'Atacama',
  'Tarapacá',
  'Arica y Parinacota',
  'Los Ríos',
  'Aysén',
  'Magallanes',
  'Ñuble',
];

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Excel Avanzado para Análisis de Datos',
    type: 'Sence',
    modality: 'E-learning',
    provider: 'Instituto de Capacitación Profesional',
    price: 180000,
    hours: 40,
    rating: 4.8,
    participants: 1250,
    category: 'Tecnología',
    area: 'Tecnología',
    region: 'Metropolitana',
    imageUrl: courseImages[0],
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Liderazgo y Gestión de Equipos',
    type: 'Sence',
    modality: 'Presencial',
    provider: 'Escuela de Negocios Sur',
    price: 350000,
    hours: 24,
    rating: 4.9,
    participants: 890,
    category: 'Habilidades Blandas',
    area: 'Habilidades Blandas',
    region: 'Valparaíso',
    imageUrl: courseImages[1],
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Seguridad Industrial y Prevención de Riesgos',
    type: 'Sence',
    modality: 'Presencial',
    provider: 'Centro de Formación Técnica',
    price: 280000,
    hours: 32,
    rating: 4.7,
    participants: 2100,
    category: 'Seguridad',
    area: 'Seguridad',
    region: 'Biobío',
    imageUrl: courseImages[2],
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Marketing Digital y Redes Sociales',
    type: 'No Sence',
    modality: 'E-learning',
    provider: 'Digital Academy Chile',
    price: 150000,
    hours: 20,
    rating: 4.6,
    participants: 3200,
    category: 'Marketing',
    area: 'Marketing',
    region: 'Metropolitana',
    imageUrl: courseImages[3],
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Gestión de Proyectos con Metodologías Ágiles',
    type: 'Sence',
    modality: 'Distancia',
    provider: 'Universidad Corporativa',
    price: 420000,
    hours: 48,
    rating: 4.8,
    participants: 756,
    category: 'Gestión',
    area: 'Gestión',
    region: 'Metropolitana',
    imageUrl: courseImages[4],
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Inglés Técnico para Profesionales',
    type: 'Sence',
    modality: 'E-learning',
    provider: 'Language Training Center',
    price: 220000,
    hours: 60,
    rating: 4.5,
    participants: 1890,
    category: 'Idiomas',
    area: 'Idiomas',
    region: 'Antofagasta',
    imageUrl: courseImages[5],
    isFavorite: false,
  },
  {
    id: '7',
    name: 'Contabilidad y Finanzas Básicas',
    type: 'Sence',
    modality: 'Presencial',
    provider: 'Instituto Financiero Nacional',
    price: 290000,
    hours: 36,
    rating: 4.7,
    participants: 1120,
    category: 'Finanzas',
    area: 'Finanzas',
    region: 'O\'Higgins',
    imageUrl: courseImages[6],
    isFavorite: false,
  },
  {
    id: '8',
    name: 'Atención al Cliente y Servicio de Excelencia',
    type: 'No Sence',
    modality: 'Distancia',
    provider: 'Service Excellence Academy',
    price: 120000,
    hours: 16,
    rating: 4.4,
    participants: 4500,
    category: 'Servicio',
    area: 'Servicio',
    region: 'Los Lagos',
    imageUrl: courseImages[7],
    isFavorite: false,
  },
];

const MiBuscador: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [modalityFilter, setModalityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // Check if user is OTEC or OTEC_REPRESENTANTE
  const isOTECUser = user?.role === 'OTEC' || user?.role === 'OTEC_REPRESENTANTE';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleFavorite = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, isFavorite: !course.isFavorite }
        : course
    ));
  };

  const toggleCompare = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : prev.length < 3 
          ? [...prev, courseId]
          : prev
    );
  };

  const clearAdvancedFilters = () => {
    setAreaFilter('all');
    setRegionFilter('all');
  };

  const activeAdvancedFilters = (areaFilter !== 'all' ? 1 : 0) + (regionFilter !== 'all' ? 1 : 0);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModality = modalityFilter === 'all' || course.modality === modalityFilter;
    const matchesType = typeFilter === 'all' || course.type === typeFilter;
    const matchesArea = areaFilter === 'all' || course.area === areaFilter;
    const matchesRegion = regionFilter === 'all' || course.region === regionFilter;
    return matchesSearch && matchesModality && matchesType && matchesArea && matchesRegion;
  });

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'Presencial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Distancia': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'E-learning': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Sence' 
      ? 'bg-primary/10 text-primary border-primary/30' 
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Inicio
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="#">Formación</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Mi Buscador</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Buscador</h1>
          <p className="text-muted-foreground">Encuentra el curso perfecto para tu equipo</p>
        </div>
      </div>

      <Tabs defaultValue="buscador" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="buscador">Buscador de Cursos</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          {isOTECUser ? (
            <OTECBuscadorDashboard />
          ) : (
            <>
              {/* Welcome Header */}
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  ¡Bienvenido de vuelta! 👋
                </h2>
                <p className="text-muted-foreground">
                  Continúa explorando los mejores cursos para tu equipo.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Búsquedas realizadas</p>
                        <p className="text-3xl font-bold mt-1">24</p>
                        <p className="text-xs text-emerald-600 mt-1">+12% esta semana</p>
                      </div>
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <Search className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-rose-500">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Cursos favoritos</p>
                        <p className="text-3xl font-bold mt-1">{courses.filter(c => c.isFavorite).length}</p>
                        <p className="text-xs text-muted-foreground mt-1">3 nuevos este mes</p>
                      </div>
                      <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                        <Heart className="h-6 w-6 text-rose-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-emerald-600">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Cotizaciones enviadas</p>
                        <p className="text-3xl font-bold mt-1">5</p>
                        <p className="text-xs text-muted-foreground mt-1">2 pendientes</p>
                      </div>
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-violet-500">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Cursos comparados</p>
                        <p className="text-3xl font-bold mt-1">12</p>
                        <p className="text-xs text-muted-foreground mt-1">Última comparación hace 2 días</p>
                      </div>
                      <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                        <Users className="h-6 w-6 text-violet-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map & Categories Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Chile Map - Tendencias por Región */}
                <div className="lg:col-span-5">
                  <ChileRegionsMap />
                </div>

                {/* Activity & Categories Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Popular Categories */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Star className="h-4 w-4 text-amber-500" />
                        Categorías populares
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                              <Users className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="font-medium text-sm">Liderazgo</span>
                          </div>
                          <span className="text-sm text-muted-foreground">245</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              <FileText className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium text-sm">Excel y Office</span>
                          </div>
                          <span className="text-sm text-muted-foreground">189</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                              <Shield className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium text-sm">Seguridad Laboral</span>
                          </div>
                          <span className="text-sm text-muted-foreground">156</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                              <Megaphone className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="font-medium text-sm">Marketing Digital</span>
                          </div>
                          <span className="text-sm text-muted-foreground">134</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Actividad reciente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mt-0.5">
                            <Search className="h-3 w-3 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">Buscaste 'Liderazgo y gestión'</p>
                            <p className="text-xs text-emerald-600">Hace 2 horas</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full mt-0.5">
                            <Heart className="h-3 w-3 text-rose-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">Agregaste 'Excel Avanzado' a favoritos</p>
                            <p className="text-xs text-emerald-600">Hace 1 día</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mt-0.5">
                            <FileText className="h-3 w-3 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">Enviaste cotización a OTEC</p>
                            <p className="text-xs text-emerald-600">Hace 3 días</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full mt-0.5">
                            <GitCompare className="h-3 w-3 text-violet-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">Comparación de 3 cursos</p>
                            <p className="text-xs text-muted-foreground">Hace 5 días</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recommended Courses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Cursos recomendados para ti
                  </h3>
                  <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Ver todos <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {courses.slice(0, 3).map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-32 bg-muted flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                      <CardContent className="p-4">
                        <Badge className={getTypeColor(course.type)} variant="outline">
                          {course.type}
                        </Badge>
                        <h4 className="font-semibold text-sm line-clamp-1 mt-2">{course.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{course.provider}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-medium">{course.rating}</span>
                          </div>
                          <span className="font-bold text-sm">{formatPrice(course.price)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="buscador" className="mt-6 space-y-6">
          {/* Hero Section - Selling Courses */}
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    🎓 Descubre el Curso Perfecto para tu Equipo
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Accede a más de <span className="font-bold text-primary">5,000 cursos certificados</span> de 
                    los mejores proveedores del país. Encuentra capacitaciones con financiamiento SENCE, 
                    compara opciones y toma decisiones informadas para potenciar el talento de tu organización.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Cursos Certificados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span>+200 Proveedores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span>Financiamiento SENCE</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="p-6 bg-background rounded-xl shadow-lg">
                    <BookOpen className="h-24 w-24 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Bar */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, proveedor o categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px] h-12">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Sence">Sence</SelectItem>
                      <SelectItem value="No Sence">No Sence</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={modalityFilter} onValueChange={setModalityFilter}>
                    <SelectTrigger className="w-[160px] h-12">
                      <SelectValue placeholder="Modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Distancia">Distancia</SelectItem>
                      <SelectItem value="E-learning">E-learning</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* More Filters Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="h-12 relative">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Más filtros
                        {activeAdvancedFilters > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {activeAdvancedFilters}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Filter className="h-5 w-5" />
                          Filtros Avanzados
                        </SheetTitle>
                        <SheetDescription>
                          Refina tu búsqueda con filtros adicionales
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-6 py-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Área de Curso</Label>
                          <Select value={areaFilter} onValueChange={setAreaFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar área" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas las áreas</SelectItem>
                              {areas.map(area => (
                                <SelectItem key={area} value={area}>{area}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Región</Label>
                          <Select value={regionFilter} onValueChange={setRegionFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar región" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas las regiones</SelectItem>
                              {regiones.map(region => (
                                <SelectItem key={region} value={region}>{region}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="pt-4 space-y-3">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={clearAdvancedFilters}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Limpiar filtros
                          </Button>
                          <SheetClose asChild>
                            <Button className="w-full">
                              Aplicar filtros
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters Display */}
          {(areaFilter !== 'all' || regionFilter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {areaFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Área: {areaFilter}
                  <button onClick={() => setAreaFilter('all')} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {regionFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {regionFilter}
                  <button onClick={() => setRegionFilter('all')} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Compare Banner */}
          {selectedCourses.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GitCompare className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">
                      {selectedCourses.length} curso{selectedCourses.length > 1 ? 's' : ''} seleccionado{selectedCourses.length > 1 ? 's' : ''} para comparar
                    </span>
                    <span className="text-sm text-muted-foreground">(máximo 3)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCourses([])}>
                      Limpiar
                    </Button>
                    <Button size="sm" disabled={selectedCourses.length < 2}>
                      <GitCompare className="h-4 w-4 mr-2" />
                      Comparar cursos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">{filteredCourses.length}</span> cursos
            </p>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevancia</SelectItem>
                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                <SelectItem value="rating">Mejor valorados</SelectItem>
                <SelectItem value="hours">Duración</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
                {/* Course Image */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => toggleFavorite(course.id)}
                      className={`p-2 rounded-full transition-colors shadow-md ${
                        course.isFavorite 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-background/80 hover:bg-yellow-50 text-muted-foreground hover:text-yellow-600'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${course.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    <Badge className={getTypeColor(course.type)} variant="outline">
                      {course.type}
                    </Badge>
                    <Badge className={getModalityColor(course.modality)} variant="secondary">
                      {course.modality}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Course Name */}
                  <h3 className="font-semibold text-foreground line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>

                  {/* Provider */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{course.provider}</span>
                  </div>

                  {/* Region */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{course.region}</span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.hours} horas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Valor</p>
                        <p className="text-lg font-bold text-primary">{formatPrice(course.price)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver curso
                    </Button>
                    <Button 
                      variant={selectedCourses.includes(course.id) ? "secondary" : "outline"} 
                      size="sm"
                      onClick={() => toggleCompare(course.id)}
                      className={selectedCourses.includes(course.id) ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}
                    >
                      <GitCompare className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Compare checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      id={`compare-${course.id}`}
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => toggleCompare(course.id)}
                    />
                    <label 
                      htmlFor={`compare-${course.id}`}
                      className="text-xs text-muted-foreground cursor-pointer"
                    >
                      Agregar a comparación
                    </label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron cursos</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar los filtros o buscar con otros términos
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MiBuscador;
