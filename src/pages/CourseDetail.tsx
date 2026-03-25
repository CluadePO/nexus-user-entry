import React, { useState, useCallback } from 'react';
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
  Award,
  Download
} from 'lucide-react';
import QuoteRequestModal from '@/components/buscador/QuoteRequestModal';
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

// Franchise Calculator Component - Floating Sidebar Style
interface FranchiseCalculatorProps {
  effectiveValuePerParticipant: number;
  maxImputableValue: number;
  formatPrice: (price: number) => string;
  tierParticipants: Record<number, number>;
  onTierParticipantsChange: (tierParticipants: Record<number, number>) => void;
  onQuoteRequest: () => void;
}

const FranchiseCalculator: React.FC<FranchiseCalculatorProps> = ({
  effectiveValuePerParticipant,
  maxImputableValue,
  formatPrice,
  tierParticipants,
  onTierParticipantsChange,
  onQuoteRequest,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const coverageOptions = [
    { percentage: 15, label: '15%', color: 'blue' },
    { percentage: 50, label: '50%', color: 'amber' },
    { percentage: 100, label: '100%', color: 'emerald' },
  ];

  const baseValuePerParticipant = Math.min(effectiveValuePerParticipant, maxImputableValue);

  const totalParticipants = Object.values(tierParticipants).reduce((a, b) => a + b, 0);
  const totalEffectiveValue = effectiveValuePerParticipant * totalParticipants;

  const calculateCoverage = (percentage: number) => {
    const coveragePerParticipant = (baseValuePerParticipant * percentage) / 100;
    return coveragePerParticipant * tierParticipants[percentage];
  };

  const totalFranchiseValue = coverageOptions.reduce((sum, opt) => sum + calculateCoverage(opt.percentage), 0);
  const totalCompanyCost = totalEffectiveValue - totalFranchiseValue;

  const handleTierParticipantsChange = (percentage: number, value: number) => {
    onTierParticipantsChange({ ...tierParticipants, [percentage]: Math.max(0, value) });
  };

  return (
    <>
      {/* Collapsed Tab - Always visible */}
      <div 
        className={`fixed right-0 bottom-24 z-40 transition-all duration-300 ${
          isExpanded ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="flex flex-col items-center gap-2 bg-primary text-primary-foreground px-3 py-4 rounded-l-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Calculator className="h-5 w-5" />
          <span 
            className="text-xs font-medium whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            Calcula tu Franquicia
          </span>
        </button>
      </div>

      {/* Expanded Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 ${
          isExpanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Overlay */}
        {isExpanded && (
          <div 
            className="fixed inset-0 bg-black/30 -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
        
        <div className="h-full w-80 bg-background border-l shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Calcula tu Franquicia</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calculator Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
            {/* Coverage Options with per-tier participants */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Ingresa participantes por tramo</p>
              <div className="space-y-3">
                {coverageOptions.map((option) => {
                  const coverage = calculateCoverage(option.percentage);
                  const colorClasses = option.color === 'emerald'
                    ? { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' }
                    : option.color === 'amber'
                      ? { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' }
                      : { dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' };
                  return (
                    <div
                      key={option.percentage}
                      className={`p-3 rounded-lg border ${colorClasses.bg} space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colorClasses.dot}`} />
                          <span className="text-sm font-semibold">Tramo {option.label}</span>
                        </div>
                        <span className={`font-bold text-sm ${colorClasses.text}`}>
                          {formatPrice(coverage)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleTierParticipantsChange(option.percentage, tierParticipants[option.percentage] - 1)}
                        >
                          -
                        </Button>
                        <input
                          type="number"
                          min="0"
                          value={tierParticipants[option.percentage]}
                          onChange={(e) => handleTierParticipantsChange(option.percentage, parseInt(e.target.value) || 0)}
                          className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleTierParticipantsChange(option.percentage, tierParticipants[option.percentage] + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Total Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total participantes</span>
                <span className="font-medium">{totalParticipants}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor efectivo total</span>
                <span className="font-medium">{formatPrice(totalEffectiveValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total franquicia</span>
                <span className="font-medium text-primary">{formatPrice(totalFranchiseValue)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-foreground">Costo empresa</span>
                <span className="text-destructive">{formatPrice(Math.max(0, totalCompanyCost))}</span>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="text-xs text-muted-foreground">
                El cálculo se basa en el menor valor entre el valor efectivo por participante ({formatPrice(effectiveValuePerParticipant)}) y el valor máximo imputable ({formatPrice(maxImputableValue)}).
              </p>
            </div>

            {/* Quote Button */}
            {totalParticipants > 0 && (
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => {
                  setIsExpanded(false);
                  onQuoteRequest();
                }}
              >
                <FileText className="h-4 w-4" />
                Cotizar con {totalParticipants} participante{totalParticipants > 1 ? 's' : ''}
              </Button>
            )}

            {/* Footer inside scroll area */}
            <div className="pt-4 mt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Simulador de franquicia SENCE
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [tierParticipants, setTierParticipants] = useState<Record<number, number>>({
    15: 0,
    50: 0,
    100: 0,
  });

  const course = mockCourseDetails[courseId as keyof typeof mockCourseDetails] || { ...defaultCourse, id: courseId };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const generateBrochure = useCallback(async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Header bar
    doc.setFillColor(30, 64, 175); // primary blue
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(course.name, margin, 18, { maxWidth: contentWidth });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(course.provider.name, margin, 32);

    y = 50;
    doc.setTextColor(60, 60, 60);

    // Badge line
    doc.setFontSize(10);
    doc.setFillColor(230, 240, 255);
    doc.roundedRect(margin, y, 30, 7, 2, 2, 'F');
    doc.setTextColor(30, 64, 175);
    doc.text(course.type, margin + 4, y + 5);
    doc.roundedRect(margin + 35, y, 30, 7, 2, 2, 'F');
    doc.text(course.modality, margin + 39, y + 5);
    y += 15;

    // Section helper
    const addSection = (title: string, yPos: number) => {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text(title, margin, yPos);
      doc.setDrawColor(30, 64, 175);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + 2, margin + contentWidth, yPos + 2);
      return yPos + 8;
    };

    // Course Info
    y = addSection('Información del Curso', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    const info = [
      ['Código SENCE', course.senceCode],
      ['Horas', `${course.hours} horas`],
      ['Área', course.area],
      ['Especialidad', course.specialty],
      ['Modalidad', course.modality],
      ['Ubicación', course.location],
    ];
    info.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 35, y);
      y += 6;
    });
    y += 4;

    // Objective
    y = addSection('Objetivo', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const objLines = doc.splitTextToSize(course.objective, contentWidth);
    doc.text(objLines, margin, y);
    y += objLines.length * 5 + 6;

    // Target Audience
    y = addSection('Dirigido a', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const targetLines = doc.splitTextToSize(course.targetAudience, contentWidth);
    doc.text(targetLines, margin, y);
    y += targetLines.length * 5 + 6;

    // Description
    y = addSection('Descripción', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(course.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 6;

    // Learnings
    if (y > 240) { doc.addPage(); y = 20; }
    y = addSection('Lo que aprenderás', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    course.learnings.forEach((item) => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`•  ${item}`, margin + 2, y);
      y += 6;
    });
    y += 4;

    // Pricing
    if (y > 240) { doc.addPage(); y = 20; }
    y = addSection('Valores', y);
    doc.setFontSize(10);

    const prices = [
      ['Valor del curso', formatPrice(course.price)],
      ['Valor efectivo por participante', formatPrice(course.effectiveValuePerParticipant)],
      ['Valor máximo imputable', formatPrice(course.maxImputableValue)],
    ];
    prices.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(label, margin, y);
      doc.setFont('helvetica', 'bold');
      doc.text(value, margin + contentWidth, y, { align: 'right' });
      y += 7;
    });

    // Footer
    const footerY = 285;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 5, margin + contentWidth, footerY - 5);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Documento generado automáticamente. Los valores son informativos y pueden variar.', margin, footerY);
    doc.text(new Date().toLocaleDateString('es-CL'), margin + contentWidth, footerY, { align: 'right' });

    doc.save(`Brochure_${course.name.replace(/\s+/g, '_').substring(0, 30)}.pdf`);
  }, [course, formatPrice]);

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'Presencial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Distancia': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'E-learning': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-8 pr-14">
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

      <div className="space-y-6">
        {/* Main Content */}
        <div className="space-y-6">
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

              {/* Quote Button */}
              <div className="mt-6">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={() => setQuoteModalOpen(true)}
                >
                  <FileText className="h-5 w-5" />
                  Cotizar el curso
                </Button>
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
      </div>

      {/* Floating Franchise Calculator */}
      <FranchiseCalculator 
        effectiveValuePerParticipant={course.effectiveValuePerParticipant}
        maxImputableValue={course.maxImputableValue}
        formatPrice={formatPrice}
        tierParticipants={tierParticipants}
        onTierParticipantsChange={setTierParticipants}
        onQuoteRequest={() => setQuoteModalOpen(true)}
      />

      {/* Quote Request Modal */}
      <QuoteRequestModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        courseInfo={{
          name: course.name,
          provider: course.provider.name,
          senceCode: course.senceCode,
          area: course.area,
          modality: course.modality,
          hours: course.hours,
          specialty: course.specialty,
          effectiveValuePerParticipant: course.effectiveValuePerParticipant,
          maxImputableValue: course.maxImputableValue,
        }}
        formatPrice={formatPrice}
        initialTierParticipants={tierParticipants}
      />
    </div>
  );
};

export default CourseDetail;
