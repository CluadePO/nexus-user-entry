import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';

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

// Franchise Calculator Component
interface FranchiseCalculatorProps {
  effectiveValuePerParticipant: number;
  maxImputableValue: number;
  formatPrice: (price: number) => string;
}

const FranchiseCalculator: React.FC<FranchiseCalculatorProps> = ({
  effectiveValuePerParticipant,
  maxImputableValue,
  formatPrice,
}) => {
  const [participants, setParticipants] = useState<number>(1);

  const coverageOptions = [
    { percentage: 15, label: '15%' },
    { percentage: 50, label: '50%' },
    { percentage: 100, label: '100%' },
  ];

  // Calculate values based on the minimum between effective value and max imputable value
  const baseValuePerParticipant = Math.min(effectiveValuePerParticipant, maxImputableValue);
  const totalEffectiveValue = effectiveValuePerParticipant * participants;

  const calculateCoverage = (percentage: number) => {
    const coveragePerParticipant = (baseValuePerParticipant * percentage) / 100;
    return coveragePerParticipant * participants;
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setParticipants(Math.max(0, value));
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Calcula tu Franquicia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Participants Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Número de participantes
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setParticipants(Math.max(0, participants - 1))}
            >
              -
            </Button>
            <input
              type="number"
              min="0"
              value={participants}
              onChange={handleParticipantsChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setParticipants(participants + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <Separator />

        {/* Coverage Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Cobertura de Franquicia</p>
          <div className="space-y-2">
            {coverageOptions.map((option) => {
              const coverage = calculateCoverage(option.percentage);
              return (
                <div
                  key={option.percentage}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      option.percentage === 100 
                        ? 'bg-emerald-500' 
                        : option.percentage === 50 
                          ? 'bg-amber-500' 
                          : 'bg-blue-500'
                    }`} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <span className={`font-bold ${
                    option.percentage === 100 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : option.percentage === 50 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {formatPrice(coverage)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Total Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor efectivo total</span>
            <span className="font-medium">{formatPrice(totalEffectiveValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base cálculo franquicia</span>
            <span className="font-medium text-primary">{formatPrice(baseValuePerParticipant * participants)}</span>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3 bg-primary/5 rounded-lg">
          <p className="text-xs text-muted-foreground">
            El cálculo se basa en el menor valor entre el valor efectivo por participante ({formatPrice(effectiveValuePerParticipant)}) y el valor máximo imputable ({formatPrice(maxImputableValue)}).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Quote Modal Component
interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  providerName: string;
  courseType: string;
  courseModality: string;
  courseHours: number;
  courseArea: string;
  coursePrice: number;
  formatPrice: (price: number) => string;
}

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  courseName,
  providerName,
  courseType,
  courseModality,
  courseHours,
  courseArea,
  coursePrice,
  formatPrice,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    participantes: 1,
    mensaje: '',
  });

  const participantOptions = [1, 2, 3, 4, 5, 6, 7, '8+'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solicitud enviada",
      description: "El proveedor se pondrá en contacto contigo pronto.",
    });
    onClose();
    setFormData({
      nombre: '',
      email: '',
      empresa: '',
      participantes: 1,
      mensaje: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Solicitud de Cotización</DialogTitle>
        </DialogHeader>

        {/* Course Summary */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Resumen del curso
          </h3>
          <div className="space-y-2">
            <p className="font-medium text-foreground">{courseName}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{providerName}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{courseHours} horas</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>{courseArea}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{courseModality}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-primary/10">
              <div className="flex gap-2">
                <Badge variant="outline" className={courseType === 'Sence' ? 'border-primary/50 text-primary' : 'border-orange-400 text-orange-600'}>
                  {courseType}
                </Badge>
                <Badge variant="secondary">{courseModality}</Badge>
              </div>
              <p className="font-bold text-primary text-lg">{formatPrice(coursePrice)}</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <p className="text-sm text-muted-foreground">Ingresa tus datos</p>
          
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-sm font-medium">
              <span className="text-destructive">*</span> Nombre
            </Label>
            <div className="relative">
              <Input
                id="nombre"
                placeholder="Escribe aquí"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value.slice(0, 50) })}
                maxLength={50}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {formData.nombre.length} / 50
              </span>
            </div>
          </div>

          {/* Correo electrónico */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              <span className="text-destructive">*</span> Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Escribe aquí"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Nombre de la empresa */}
          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-sm font-medium">
              <span className="text-destructive">*</span> Nombre de la empresa
            </Label>
            <div className="relative">
              <Input
                id="empresa"
                placeholder="Escribe aquí"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value.slice(0, 50) })}
                maxLength={50}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {formData.empresa.length} / 50
              </span>
            </div>
          </div>

          {/* Número de participantes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              <span className="text-destructive">*</span> Número de participantes
            </Label>
            <div className="flex flex-wrap gap-2">
              {participantOptions.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={formData.participantes === option ? "default" : "outline"}
                  size="sm"
                  className="min-w-[40px]"
                  onClick={() => setFormData({ ...formData, participantes: option as number })}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <Label htmlFor="mensaje" className="text-sm font-medium">
              <span className="text-destructive">*</span> Mensaje
            </Label>
            <div className="relative">
              <Textarea
                id="mensaje"
                placeholder="Escribe aquí..."
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value.slice(0, 500) })}
                maxLength={500}
                rows={4}
                required
                className="resize-none"
              />
              <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                {formData.mensaje.length} / 500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full gap-2" size="lg">
            Contactar Proveedor
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

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

              <Separator className="my-6" />

              {/* Quote Button */}
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={() => setIsQuoteModalOpen(true)}
              >
                <FileText className="h-5 w-5" />
                Cotizar el curso
              </Button>
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


            {/* Franchise Calculator Section */}
            <FranchiseCalculator 
              effectiveValuePerParticipant={course.effectiveValuePerParticipant}
              maxImputableValue={course.maxImputableValue}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        courseName={course.name}
        providerName={course.provider.name}
        courseType={course.type}
        courseModality={course.modality}
        courseHours={course.hours}
        courseArea={course.area}
        coursePrice={course.price}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default CourseDetail;
