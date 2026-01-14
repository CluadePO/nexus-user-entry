import React, { useState } from 'react';
import { Card, Button, Progress, Modal, Radio, Space, Badge, Tag } from 'antd';
import { 
  Search, 
  Sparkles, 
  Target, 
  Route, 
  ClipboardCheck,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  MessageCircle,
  Info
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

// Types
interface Tool {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  url: string;
}

interface Question {
  id: number;
  text: string;
  helpText: string;
  options: { value: number; label: string }[];
}

interface DiagnosticResult {
  recommendedTool: string;
  maturityLevel: number;
  maturityLabel: string;
  strengths: string[];
  opportunities: string[];
  situationSummary: string;
  radarData: { dimension: string; value: number; fullMark: number }[];
  barData: { name: string; score: number; color: string }[];
}

// Tools data
const tools: Tool[] = [
  {
    id: 'buscador',
    name: 'Mi Buscador',
    shortName: 'Marketplace de Cursos',
    icon: <Search className="w-8 h-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Busca cursos SENCE y no SENCE, solicita cotizaciones y contacta proveedores directamente.',
    url: '/asesor/buscador'
  },
  {
    id: 'recomendador',
    name: 'Mi Recomendador',
    shortName: 'Recomendaciones Personalizadas',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Recibe recomendaciones personalizadas basadas en datos SENCE y el perfil de tu empresa.',
    url: '/asesor/recomendador'
  },
  {
    id: 'dnc',
    name: 'Mi DNC',
    shortName: 'Detección de Necesidades',
    icon: <Target className="w-8 h-8" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Inicia un proceso de detección de necesidades y obtén un plan de capacitación completo.',
    url: '/asesor/dnc'
  },
  {
    id: 'ruta',
    name: 'Mi Ruta',
    shortName: 'Consultoría Estratégica',
    icon: <Route className="w-8 h-8" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Consultoría especializada para alinear capacitación con objetivos estratégicos.',
    url: '/asesor/ruta'
  }
];

const toolsData: Record<string, { name: string; icon: React.ReactNode; color: string; bgColor: string; url: string; description: string }> = {
  buscador: {
    name: 'Mi Buscador',
    icon: <Search className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    url: '/asesor/buscador',
    description: 'Marketplace de cursos para buscar, cotizar e inscribir capacitaciones SENCE y no SENCE.'
  },
  recomendador: {
    name: 'Mi Recomendador',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    url: '/asesor/recomendador',
    description: 'Sistema de recomendaciones personalizadas basado en datos SENCE y perfil de empresa.'
  },
  dnc: {
    name: 'Mi DNC',
    icon: <Target className="w-6 h-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    url: '/asesor/dnc',
    description: 'Proceso de detección de necesidades con plan de capacitación basado en datos internos.'
  },
  ruta: {
    name: 'Mi Ruta',
    icon: <Route className="w-6 h-6" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    url: '/asesor/ruta',
    description: 'Consultoría estratégica para maximizar el impacto de tu inversión en capacitación.'
  }
};

// Questions
const questions: Question[] = [
  {
    id: 1,
    text: '¿Qué tan claros y priorizados están tus objetivos estratégicos de capacitación?',
    helpText: 'Mide si tu organización tiene metas de capacitación definidas.',
    options: [
      { value: 1, label: 'No tenemos objetivos definidos' },
      { value: 2, label: 'Tenemos ideas generales pero sin priorización' },
      { value: 3, label: 'Objetivos claros pero no formalizados' },
      { value: 4, label: 'Objetivos claros, priorizados y documentados' }
    ]
  },
  {
    id: 2,
    text: '¿Tienes identificadas las áreas, temáticas o competencias que necesitas desarrollar?',
    helpText: 'Evalúa si ya sabes en qué habilidades enfocarte.',
    options: [
      { value: 1, label: 'No tenemos claridad' },
      { value: 2, label: 'Tenemos ideas pero sin detalle' },
      { value: 3, label: 'Identificadas por área pero no por competencia' },
      { value: 4, label: 'Competencias mapeadas por rol y área' }
    ]
  },
  {
    id: 3,
    text: '¿En qué plazo necesitas implementar acciones de capacitación?',
    helpText: 'Define la urgencia de tus necesidades de capacitación.',
    options: [
      { value: 1, label: 'Sin urgencia definida' },
      { value: 2, label: 'Dentro de 6 meses o más' },
      { value: 3, label: 'Dentro de 3 meses' },
      { value: 4, label: 'Lo antes posible (menos de 1 mes)' }
    ]
  },
  {
    id: 4,
    text: '¿Qué capacidad interna tienes para gestionar y hacer seguimiento a la capacitación?',
    helpText: 'Mide si tu organización puede gestionar el proceso.',
    options: [
      { value: 1, label: 'Sin recursos dedicados' },
      { value: 2, label: 'Recursos limitados sin experiencia' },
      { value: 3, label: 'Equipo con experiencia básica' },
      { value: 4, label: 'Equipo especializado y con procesos establecidos' }
    ]
  },
  {
    id: 5,
    text: '¿Qué nivel de acompañamiento necesitas durante el proceso?',
    helpText: 'Define el nivel de apoyo que requieres.',
    options: [
      { value: 1, label: 'Necesito acompañamiento completo' },
      { value: 2, label: 'Necesito guía y orientación frecuente' },
      { value: 3, label: 'Puedo avanzar con apoyo puntual' },
      { value: 4, label: 'Puedo gestionar de forma autónoma' }
    ]
  },
  {
    id: 6,
    text: 'En el último año, ¿qué tan activa ha sido tu gestión de capacitaciones?',
    helpText: 'Identifica tu nivel de madurez actual.',
    options: [
      { value: 1, label: 'Sin actividad de capacitación' },
      { value: 2, label: 'Algunas capacitaciones puntuales' },
      { value: 3, label: 'Capacitaciones regulares sin plan estructurado' },
      { value: 4, label: 'Plan anual con ejecución y seguimiento' }
    ]
  },
  {
    id: 7,
    text: '¿Qué tan bien conoces las brechas de competencias de tus equipos?',
    helpText: 'Evalúa si tienes información para justificar prioridades.',
    options: [
      { value: 1, label: 'No tenemos información de brechas' },
      { value: 2, label: 'Solo percepción sin datos' },
      { value: 3, label: 'Información parcial por algunas áreas' },
      { value: 4, label: 'Diagnóstico completo con datos actualizados' }
    ]
  },
  {
    id: 8,
    text: '¿Qué tan alineada está la capacitación con los objetivos estratégicos de la empresa?',
    helpText: 'Mide si la formación impulsa metas del negocio.',
    options: [
      { value: 1, label: 'Sin conexión con estrategia' },
      { value: 2, label: 'Conexión ocasional y no planificada' },
      { value: 3, label: 'Alineación parcial en algunas áreas' },
      { value: 4, label: 'Totalmente integrada con objetivos del negocio' }
    ]
  }
];

// Calculate result function
const calculateResult = (answers: Record<number, number>): DiagnosticResult => {
  const clarity = (answers[1] + answers[2]) / 2;
  const timeline = answers[3];
  const resources = answers[4];
  const support = answers[5];
  const experience = answers[6];
  const competencyKnowledge = answers[7];
  const alignment = answers[8];

  // Determine recommended tool using decision tree
  let recommendedTool = 'recomendador';

  if (clarity >= 3.5 && timeline >= 3 && support >= 3 && experience >= 3) {
    recommendedTool = 'buscador';
  } else if ((clarity <= 2 || alignment <= 2) && resources <= 2 && support <= 2) {
    recommendedTool = 'ruta';
  } else if (competencyKnowledge <= 2 && resources >= 2 && timeline <= 3) {
    recommendedTool = 'dnc';
  } else if (clarity >= 2 && clarity < 3.5 && experience >= 2) {
    recommendedTool = 'recomendador';
  } else {
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
    if (total >= 24) recommendedTool = 'buscador';
    else if (total >= 18) recommendedTool = 'recomendador';
    else if (total >= 12) recommendedTool = 'dnc';
    else recommendedTool = 'ruta';
  }

  // Calculate maturity level
  const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 32;
  const maturityLevel = Math.round((total / maxScore) * 100);

  let maturityLabel = '';
  if (maturityLevel >= 75) maturityLabel = 'Madurez Alta';
  else if (maturityLevel >= 50) maturityLabel = 'Madurez Media';
  else if (maturityLevel >= 25) maturityLabel = 'Madurez Baja';
  else maturityLabel = 'En Desarrollo';

  // Generate situation summary
  let situationSummary = '';
  if (maturityLevel >= 75) {
    situationSummary = 'Tu organización cuenta con una gestión de capacitación madura y estructurada. Tienes claridad en tus objetivos, recursos dedicados y experiencia en la ejecución de planes de formación.';
  } else if (maturityLevel >= 50) {
    situationSummary = 'Tu organización tiene una base sólida en gestión de capacitación, pero existen oportunidades para mejorar la estructura y alineación estratégica de tus planes de formación.';
  } else if (maturityLevel >= 25) {
    situationSummary = 'Tu organización está en proceso de desarrollo de sus capacidades de gestión de capacitación. Es importante fortalecer la estructura y los procesos para maximizar el impacto.';
  } else {
    situationSummary = 'Tu organización está en etapa inicial de gestión de capacitación. Recomendamos comenzar con un acompañamiento especializado para construir las bases de un plan efectivo.';
  }

  // Calculate strengths
  const strengths: string[] = [];
  if (clarity >= 3) strengths.push('Claridad en objetivos de capacitación');
  if (resources >= 3) strengths.push('Capacidad interna para gestionar capacitación');
  if (experience >= 3) strengths.push('Experiencia previa en gestión de capacitaciones');
  if (competencyKnowledge >= 3) strengths.push('Conocimiento de brechas de competencias');
  if (alignment >= 3) strengths.push('Alineación con objetivos estratégicos');
  if (timeline >= 3) strengths.push('Sentido de urgencia claro');

  // Calculate opportunities
  const opportunities: string[] = [];
  if (clarity < 3) opportunities.push('Definir y priorizar objetivos de capacitación');
  if (resources < 3) opportunities.push('Fortalecer recursos internos de gestión');
  if (experience < 3) opportunities.push('Desarrollar experiencia en gestión de capacitación');
  if (competencyKnowledge < 3) opportunities.push('Levantar información de brechas de competencias');
  if (alignment < 3) opportunities.push('Alinear capacitación con estrategia empresarial');
  if (support < 3) opportunities.push('Considerar apoyo externo especializado');

  // Radar data
  const radarData = [
    { dimension: 'Claridad', value: clarity, fullMark: 4 },
    { dimension: 'Urgencia', value: timeline, fullMark: 4 },
    { dimension: 'Recursos', value: resources, fullMark: 4 },
    { dimension: 'Autonomía', value: support, fullMark: 4 },
    { dimension: 'Experiencia', value: experience, fullMark: 4 },
    { dimension: 'Conocimiento', value: competencyKnowledge, fullMark: 4 },
    { dimension: 'Alineación', value: alignment, fullMark: 4 }
  ];

  // Bar data
  const getBarColor = (score: number) => {
    if (score >= 3.5) return '#22c55e';
    if (score >= 2.5) return '#65BFB1';
    if (score >= 1.5) return '#f59e0b';
    return '#ef4444';
  };

  const barData = [
    { name: 'Claridad', score: clarity, color: getBarColor(clarity) },
    { name: 'Urgencia', score: timeline, color: getBarColor(timeline) },
    { name: 'Recursos', score: resources, color: getBarColor(resources) },
    { name: 'Autonomía', score: support, color: getBarColor(support) },
    { name: 'Experiencia', score: experience, color: getBarColor(experience) },
    { name: 'Conocimiento', score: competencyKnowledge, color: getBarColor(competencyKnowledge) },
    { name: 'Alineación', score: alignment, color: getBarColor(alignment) }
  ];

  return {
    recommendedTool,
    maturityLevel,
    maturityLabel,
    strengths: strengths.slice(0, 4),
    opportunities: opportunities.slice(0, 4),
    situationSummary,
    radarData,
    barData
  };
};

// Mock metrics
const mockMetrics = {
  diagnosticsCompleted: 3,
  maturityLevel: 68,
  opportunitiesIdentified: 5
};

const AsesorDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'intro' | 'questions' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [showResultInDashboard, setShowResultInDashboard] = useState(false);

  const handleStartDiagnostic = () => {
    setIsModalOpen(true);
    setModalStep('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const handleBeginQuestions = () => {
    setModalStep('questions');
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const calculatedResult = calculateResult(answers);
      setResult(calculatedResult);
      setModalStep('result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleCloseModal = () => {
    if (result) {
      setShowResultInDashboard(true);
    }
    setIsModalOpen(false);
  };

  const handleRestart = () => {
    setModalStep('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const handleGoToTool = (url: string) => {
    window.location.href = url;
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCurrentAnswered = answers[currentQ?.id] !== undefined;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Rol Asesor</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu madurez de capacitación y accede a herramientas especializadas.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<ClipboardCheck className="w-5 h-5" />}
          onClick={handleStartDiagnostic}
          className="flex items-center gap-2"
          style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
        >
          Iniciar Nuevo Diagnóstico
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Diagnósticos Realizados</p>
              <p className="text-2xl font-bold text-gray-900">{mockMetrics.diagnosticsCompleted}</p>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nivel de Madurez</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">{mockMetrics.maturityLevel}%</p>
                <Tag color="green">Media-Alta</Tag>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Oportunidades Identificadas</p>
              <p className="text-2xl font-bold text-gray-900">{mockMetrics.opportunitiesIdentified}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Tools Section */}
      <Card title={
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <span>Herramientas Disponibles</span>
        </div>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              hoverable
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => handleGoToTool(tool.url)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-4 rounded-full ${tool.bgColor}`}>
                  <div className={tool.color}>{tool.icon}</div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{tool.shortName}</p>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                <Button type="link" className="flex items-center gap-1 p-0">
                  Explorar <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Result in Dashboard Section */}
      {showResultInDashboard && result && (
        <Card 
          title={
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Resultado de tu Último Diagnóstico</span>
            </div>
          }
          extra={
            <Button type="primary" onClick={handleStartDiagnostic} style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}>
              Realizar Nuevo Diagnóstico
            </Button>
          }
        >
          <div className="space-y-6">
            {/* Situation Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> Resumen de Situación
              </h4>
              <p className="text-gray-600">{result.situationSummary}</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="text-sm text-gray-500">Nivel de Madurez:</span>
                <Progress 
                  percent={result.maturityLevel} 
                  size="small" 
                  strokeColor="#65BFB1"
                  className="flex-1 max-w-xs"
                />
                <Tag color={result.maturityLevel >= 50 ? 'green' : 'orange'}>{result.maturityLabel}</Tag>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Fortalezas Identificadas
                </h4>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                  {result.strengths.length === 0 && (
                    <li className="text-sm text-emerald-600">Realiza el diagnóstico para identificar tus fortalezas.</li>
                  )}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Oportunidades de Mejora
                </h4>
                <ul className="space-y-2">
                  {result.opportunities.map((opportunity, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-orange-700">
                      <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {opportunity}
                    </li>
                  ))}
                  {result.opportunities.length === 0 && (
                    <li className="text-sm text-orange-600">¡Excelente! No se identificaron oportunidades de mejora urgentes.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Recommended Tool */}
            <div className="border-2 border-primary rounded-lg p-4" style={{ borderColor: '#65BFB1' }}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: '#65BFB1' }} /> Herramienta Recomendada
              </h4>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${toolsData[result.recommendedTool].bgColor}`}>
                  <div className={toolsData[result.recommendedTool].color}>
                    {toolsData[result.recommendedTool].icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{toolsData[result.recommendedTool].name}</h5>
                  <p className="text-sm text-gray-600">{toolsData[result.recommendedTool].description}</p>
                </div>
                <Button 
                  type="primary" 
                  onClick={() => handleGoToTool(toolsData[result.recommendedTool].url)}
                  style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
                >
                  Ir a {toolsData[result.recommendedTool].name}
                </Button>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">Perfil de Dimensiones</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={result.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fontSize: 10 }} />
                    <Radar name="Puntaje" dataKey="value" stroke="#65BFB1" fill="#65BFB1" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">Detalle por Dimensión</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={result.barData} layout="vertical">
                    <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {result.barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
              <Button 
                type="primary"
                icon={<MessageCircle className="w-4 h-4" />}
                size="large"
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
              >
                Solicitar Consultoría Especializada
              </Button>
              <Button 
                icon={<RotateCcw className="w-4 h-4" />}
                size="large"
                onClick={handleStartDiagnostic}
              >
                Realizar Nuevo Diagnóstico
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Diagnostic Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={modalStep === 'result' ? 900 : 700}
        centered
        destroyOnClose
      >
        {/* Intro Step */}
        {modalStep === 'intro' && (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(101, 191, 177, 0.1)' }}>
              <ClipboardCheck className="w-8 h-8" style={{ color: '#65BFB1' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Diagnóstico de Capacitación</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Descubre qué tan alineados están tus objetivos estratégicos con tus necesidades de capacitación y encuentra la herramienta perfecta para ti.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#65BFB1' }}>8</p>
                  <p className="text-gray-500">Preguntas</p>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#65BFB1' }}>5 min</p>
                  <p className="text-gray-500">Aprox.</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Al finalizar recibirás una <strong>recomendación personalizada</strong> de la herramienta ideal para tu situación.
            </p>
            <Button 
              type="primary" 
              size="large"
              onClick={handleBeginQuestions}
              style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
            >
              Comenzar Diagnóstico
            </Button>
          </div>
        )}

        {/* Questions Step */}
        {modalStep === 'questions' && currentQ && (
          <div className="py-4">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Pregunta {currentQuestion + 1} de {questions.length}</span>
                <span className="text-sm font-medium" style={{ color: '#65BFB1' }}>{Math.round(progress)}%</span>
              </div>
              <Progress percent={progress} showInfo={false} strokeColor="#65BFB1" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentQ.text}</h3>
            <p className="text-sm text-gray-500 mb-6">{currentQ.helpText}</p>

            <Radio.Group 
              value={answers[currentQ.id]} 
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                {currentQ.options.map((option) => (
                  <Radio 
                    key={option.value} 
                    value={option.value}
                    className="w-full p-3 border rounded-lg hover:border-primary transition-colors"
                    style={{ display: 'flex' }}
                  >
                    {option.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

            <div className="flex justify-between mt-8">
              <Button 
                onClick={handlePrevious} 
                disabled={currentQuestion === 0}
              >
                Anterior
              </Button>
              <Button 
                type="primary"
                onClick={handleNext}
                disabled={!isCurrentAnswered}
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
              >
                {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
              </Button>
            </div>
          </div>
        )}

        {/* Result Step */}
        {modalStep === 'result' && result && (
          <div className="py-4 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Resultados de tu Diagnóstico</h2>
              <div className="flex items-center justify-center gap-2">
                <Progress 
                  type="circle" 
                  percent={result.maturityLevel} 
                  size={80}
                  strokeColor="#65BFB1"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{result.maturityLabel}</p>
                  <p className="text-sm text-gray-500">Nivel de Madurez</p>
                </div>
              </div>
            </div>

            {/* Situation Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> Resumen de Situación
              </h4>
              <p className="text-gray-600 text-sm">{result.situationSummary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Fortalezas Identificadas
                </h4>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                  {result.strengths.length === 0 && (
                    <li className="text-sm text-emerald-600">Aún no se identifican fortalezas destacadas.</li>
                  )}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Oportunidades de Mejora
                </h4>
                <ul className="space-y-2">
                  {result.opportunities.map((opportunity, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-orange-700">
                      <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {opportunity}
                    </li>
                  ))}
                  {result.opportunities.length === 0 && (
                    <li className="text-sm text-orange-600">¡Excelente! No hay oportunidades urgentes.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Recommended Tool */}
            <div className="border-2 rounded-lg p-4" style={{ borderColor: '#65BFB1' }}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: '#65BFB1' }} /> Herramienta Recomendada
              </h4>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${toolsData[result.recommendedTool].bgColor}`}>
                  <div className={toolsData[result.recommendedTool].color}>
                    {toolsData[result.recommendedTool].icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{toolsData[result.recommendedTool].name}</h5>
                  <p className="text-sm text-gray-600">{toolsData[result.recommendedTool].description}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
              <Button 
                type="primary"
                icon={<ArrowRight className="w-4 h-4" />}
                size="large"
                onClick={() => {
                  handleCloseModal();
                  handleGoToTool(toolsData[result.recommendedTool].url);
                }}
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
              >
                Ir a {toolsData[result.recommendedTool].name}
              </Button>
              <Button 
                type="primary"
                icon={<MessageCircle className="w-4 h-4" />}
                size="large"
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
              >
                Solicitar Consultoría Especializada
              </Button>
              <Button 
                icon={<RotateCcw className="w-4 h-4" />}
                size="large"
                onClick={handleRestart}
              >
                Volver a Empezar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AsesorDashboard;
