import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  MapPin,
  Clock,
  BookOpen,
  DollarSign,
  Target,
  Users,
  CheckCircle,
  FileText,
  Calculator,
  Tag,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Home,
  Star,
  Share2,
  Heart,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Mock course data (in real app would come from API)
const mockCourseDetails = {
  '1': {
    id: '1',
    name: 'Excel Avanzado para Análisis de Datos',
    type: 'Sence',
    modality: 'E-learning',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    rating: 4.8,
    participants: 1250,
    // Contact Info
    provider: {
      name: 'Instituto de Capacitación Profesional',
      rut: '76.123.456-7',
      website: 'www.institutocapacitacion.cl',
      phone: '+56 2 2345 6789',
    },
    // Course Info
    senceCode: '1237890123',
    hours: 40,
    area: 'Tecnología',
    specialty: 'Análisis de Datos y Business Intelligence',
    location: 'Online - Todo Chile',
    price: 180000,
    effectiveValuePerParticipant: 150000,
    maxImputableValue: 160000,
    // Course Content
    objective: 'Desarrollar habilidades avanzadas en Excel para el análisis y visualización de datos empresariales, permitiendo la toma de decisiones basada en información.',
    targetAudience: 'Profesionales de áreas administrativas, analistas de datos, contadores, ingenieros comerciales y todo profesional que requiera manejar grandes volúmenes de datos.',
    requirements: 'Conocimientos básicos de Excel (manejo de fórmulas, tablas y gráficos). Computador con Microsoft Excel 2016 o superior.',
    description: 'Este curso intensivo de Excel Avanzado está diseñado para llevar tus habilidades de análisis de datos al siguiente nivel. Aprenderás a utilizar funciones avanzadas, tablas dinámicas, Power Query, y técnicas de visualización profesional que te permitirán transformar datos en insights accionables para tu organización.',
    learnings: [
      'Dominar fórmulas y funciones avanzadas de Excel',
      'Crear y gestionar tablas dinámicas complejas',
      'Utilizar Power Query para transformación de datos',
      'Diseñar dashboards interactivos profesionales',
      'Automatizar tareas con macros básicas',
      'Aplicar técnicas de análisis estadístico',
      'Conectar múltiples fuentes de datos',
      'Generar reportes ejecutivos automatizados',
    ],
    relatedTopics: ['Power BI', 'Python para Análisis', 'SQL Básico', 'Visualización de Datos', 'Business Intelligence'],
  },
  '2': {
    id: '2',
    name: 'Liderazgo y Gestión de Equipos',
    type: 'Sence',
    modality: 'Presencial',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    rating: 4.9,
    participants: 890,
    provider: {
      name: 'Escuela de Negocios Sur',
      rut: '77.234.567-8',
      website: 'www.escuelanegocios.cl',
      phone: '+56 2 3456 7890',
    },
    senceCode: '1237890124',
    hours: 24,
    area: 'Habilidades Blandas',
    specialty: 'Liderazgo Organizacional',
    location: 'Valparaíso, Chile',
    price: 350000,
    effectiveValuePerParticipant: 300000,
    maxImputableValue: 320000,
    objective: 'Desarrollar competencias de liderazgo efectivo para la gestión y motivación de equipos de trabajo de alto rendimiento.',
    targetAudience: 'Gerentes, jefaturas, supervisores y profesionales con personal a cargo que busquen potenciar sus habilidades de liderazgo.',
    requirements: 'Experiencia mínima de 1 año en cargos con personal a cargo. Disposición para trabajo en equipo y dinámicas grupales.',
    description: 'Programa integral de desarrollo de liderazgo que combina teoría y práctica para formar líderes capaces de inspirar, motivar y guiar equipos hacia el logro de objetivos organizacionales.',
    learnings: [
      'Identificar y desarrollar tu estilo de liderazgo',
      'Técnicas de comunicación efectiva',
      'Gestión de conflictos y negociación',
      'Motivación y engagement de equipos',
      'Delegación efectiva de tareas',
      'Feedback constructivo y coaching',
    ],
    relatedTopics: ['Coaching Ejecutivo', 'Comunicación Efectiva', 'Gestión del Cambio', 'Inteligencia Emocional'],
  },
  '3': {
    id: '3',
    name: 'Seguridad Industrial y Prevención de Riesgos',
    type: 'Sence',
    modality: 'Presencial',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    rating: 4.7,
    participants: 2100,
    provider: {
      name: 'Centro de Formación Técnica',
      rut: '78.345.678-9',
      website: 'www.cftecnico.cl',
      phone: '+56 41 234 5678',
    },
    senceCode: '1237890125',
    hours: 32,
    area: 'Seguridad',
    specialty: 'Prevención de Riesgos Laborales',
    location: 'Concepción, Biobío',
    price: 280000,
    effectiveValuePerParticipant: 240000,
    maxImputableValue: 260000,
    objective: 'Formar profesionales capaces de identificar, evaluar y controlar los riesgos laborales en entornos industriales.',
    targetAudience: 'Trabajadores de industrias, supervisores de seguridad, prevencionistas de riesgos y profesionales del área.',
    requirements: 'Educación media completa. Experiencia laboral en ambiente industrial deseable pero no excluyente.',
    description: 'Curso completo de seguridad industrial que abarca normativa legal, identificación de peligros, evaluación de riesgos y medidas de control preventivas.',
    learnings: [
      'Normativa legal de seguridad en Chile',
      'Identificación de peligros y riesgos',
      'Uso correcto de EPP',
      'Planes de emergencia y evacuación',
      'Investigación de accidentes',
      'Ergonomía en el trabajo',
    ],
    relatedTopics: ['Primeros Auxilios', 'Manejo de Emergencias', 'Ergonomía Laboral', 'Higiene Industrial'],
  },
};

// Default course for IDs not in mock data
const defaultCourse = {
  id: 'default',
  name: 'Curso de Capacitación',
  type: 'Sence',
  modality: 'E-learning',
  imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
  rating: 4.5,
  participants: 500,
  provider: {
    name: 'Proveedor de Capacitación',
    rut: '76.000.000-0',
    website: 'www.proveedor.cl',
    phone: '+56 2 0000 0000',
  },
  senceCode: '1230000000',
  hours: 30,
  area: 'General',
  specialty: 'Capacitación Profesional',
  location: 'Santiago, Chile',
  price: 200000,
  effectiveValuePerParticipant: 180000,
  maxImputableValue: 190000,
  objective: 'Desarrollar competencias profesionales en el área de especialización del curso.',
  targetAudience: 'Profesionales y trabajadores que busquen mejorar sus competencias laborales.',
  requirements: 'Educación media completa y motivación por aprender.',
  description: 'Curso diseñado para desarrollar habilidades y competencias profesionales de alta demanda en el mercado laboral.',
  learnings: [
    'Conocimientos teóricos fundamentales',
    'Aplicación práctica de conceptos',
    'Desarrollo de habilidades específicas',
    'Trabajo en equipo y colaboración',
  ],
  relatedTopics: ['Desarrollo Profesional', 'Habilidades Técnicas', 'Competencias Laborales'],
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = mockCourseDetails[courseId as keyof typeof mockCourseDetails] || { ...defaultCourse, id: courseId };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'Presencial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Distancia': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'E-learning': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-8">
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
              <Link to="/formacion/buscador">Mi Buscador</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Detalle del Curso</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver al buscador
      </Button>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={course.imageUrl}
          alt={course.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={`${course.type === 'Sence' ? 'bg-primary/90 text-white' : 'bg-orange-500 text-white'}`}>
              {course.type}
            </Badge>
            <Badge className={getModalityColor(course.modality)}>
              {course.modality}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            {course.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-5 w-5" />
              <span>{course.participants.toLocaleString()} participantes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>{course.hours} horas</span>
            </div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white/90 hover:bg-white">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nombre del Proveedor</p>
                <p className="font-medium">{course.provider.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">RUT del Proveedor</p>
                <p className="font-medium">{course.provider.rut}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sitio Web</p>
                <a 
                  href={`https://${course.provider.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  {course.provider.website}
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {course.provider.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Información del Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nombre del curso</p>
                  <p className="font-medium">{course.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Modalidad del curso</p>
                  <Badge className={getModalityColor(course.modality)} variant="secondary">
                    {course.modality}
                  </Badge>
                </div>
                {course.type === 'Sence' && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Código SENCE</p>
                    <p className="font-medium font-mono bg-muted px-2 py-1 rounded inline-block">
                      {course.senceCode}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Horas</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {course.hours} horas
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Área</p>
                  <p className="font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {course.area}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Especialidad</p>
                  <p className="font-medium flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {course.specialty}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Lugar de ejecución</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {course.location}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Pricing Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Valor del curso</p>
                  <p className="text-xl font-bold text-foreground">{formatPrice(course.price)}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Valor efectivo por participante</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(course.effectiveValuePerParticipant)}</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Valor máximo imputable</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{formatPrice(course.maxImputableValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Contenido del Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Objetivo */}
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  Objetivo
                </h4>
                <p className="text-muted-foreground leading-relaxed">{course.objective}</p>
              </div>

              <Separator />

              {/* Dirigido a */}
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  Dirigido a
                </h4>
                <p className="text-muted-foreground leading-relaxed">{course.targetAudience}</p>
              </div>

              <Separator />

              {/* Requisitos */}
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Requisitos
                </h4>
                <p className="text-muted-foreground leading-relaxed">{course.requirements}</p>
              </div>

              <Separator />

              {/* Descripción */}
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Descripción
                </h4>
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              </div>

              <Separator />

              {/* Lo que aprenderás */}
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  Lo que aprenderás
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.learnings.map((learning, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{learning}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Ver temas relacionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.relatedTopics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-4"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Sticky Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Price Card */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor del curso</p>
                  <p className="text-3xl font-bold text-primary">{formatPrice(course.price)}</p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor efectivo/participante</span>
                    <span className="font-medium text-primary">{formatPrice(course.effectiveValuePerParticipant)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor máximo imputable</span>
                    <span className="font-medium text-emerald-600">{formatPrice(course.maxImputableValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full gap-2" size="lg">
                  <FileText className="h-5 w-5" />
                  Cotizar el curso
                </Button>
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <Calculator className="h-5 w-5" />
                  Calcula tu Franquicia
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
