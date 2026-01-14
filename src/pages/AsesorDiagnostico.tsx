import React, { useState } from 'react';
import { Card, Button, Radio, Progress, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Sparkles,
  Route,
  RefreshCw
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
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface Question {
  id: number;
  text: string;
  helpText: string;
  options: { value: number; label: string }[];
}

interface DiagnosticResult {
  toolId: string;
  toolName: string;
  toolIcon: React.ReactNode;
  toolColor: string;
  toolBgColor: string;
  toolUrl: string;
  maturityLevel: number;
  strengths: string[];
  opportunities: string[];
  dimensionScores: { dimension: string; score: number; fullMark: number }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: '¿Qué tan claros y priorizados están tus objetivos estratégicos de capacitación?',
    helpText: 'Mide si tu organización tiene metas de capacitación definidas (qué lograr, para quién y con qué resultado esperado).',
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
    helpText: 'Evalúa si ya sabes en qué habilidades enfocarte (por rol, área o proceso) para orientar la búsqueda o el plan.',
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
    helpText: 'Define la urgencia. A menor plazo, más sentido tiene ir directo a cursos; a mayor plazo, conviene estructurar diagnóstico/plan.',
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
    helpText: 'Mide si tu organización puede levantar necesidades, coordinar cursos, gestionar proveedores y evaluar resultados.',
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
    helpText: 'Define si buscas solo herramientas, una guía para ordenar decisiones o una consultoría con acompañamiento completo.',
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
    helpText: 'Identifica tu nivel de madurez: si ya existe práctica instalada o si estás partiendo desde cero.',
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
    helpText: 'Evalúa si tienes información para justificar prioridades (datos) o si estás decidiendo por percepción.',
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
    helpText: 'Mide si la formación impulsa metas del negocio (productividad, calidad, ventas, seguridad, transformación, etc.) o es reactiva.',
    options: [
      { value: 1, label: 'Sin conexión con estrategia' },
      { value: 2, label: 'Conexión ocasional y no planificada' },
      { value: 3, label: 'Alineación parcial en algunas áreas' },
      { value: 4, label: 'Totalmente integrada con objetivos del negocio' }
    ]
  }
];

const toolsData = {
  buscador: {
    id: 'buscador',
    name: 'Mi Buscador',
    icon: <Search className="w-8 h-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    url: '/asesor/buscador',
    description: 'Tu perfil indica alta claridad, autonomía y urgencia. Puedes buscar directamente los cursos que necesitas.'
  },
  recomendador: {
    id: 'recomendador',
    name: 'Mi Recomendador',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    url: '/asesor/recomendador',
    description: 'Tienes claridad media y algo de experiencia. Te beneficiarás de recomendaciones basadas en datos.'
  },
  dnc: {
    id: 'dnc',
    name: 'Mi DNC',
    icon: <Target className="w-8 h-8" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    url: '/asesor/dnc',
    description: 'Necesitas conocer mejor las brechas de tu equipo. Un diagnóstico participativo te ayudará.'
  },
  ruta: {
    id: 'ruta',
    name: 'Impulsa Talento',
    icon: <Route className="w-8 h-8" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    url: '/asesor/ruta',
    description: 'Tu organización necesita acompañamiento estratégico para estructurar la capacitación desde cero.'
  }
};

const calculateResult = (answers: Record<number, number>): DiagnosticResult => {
  // Calculate variables from answers
  const clarity = (answers[1] + answers[2]) / 2;
  const timeline = answers[3];
  const resources = answers[4];
  const support = answers[5];
  const experience = answers[6];
  const competencyKnowledge = answers[7];
  const alignment = answers[8];

  // Determine recommended tool using decision tree
  let recommendedTool: keyof typeof toolsData;

  // Rule 1: Mi Buscador (autonomous and urgent profile)
  if (clarity >= 3.5 && timeline >= 3 && support >= 3 && experience >= 3) {
    recommendedTool = 'buscador';
  }
  // Rule 2: Impulsa Talento (immature strategic profile)
  else if ((clarity <= 2 || alignment <= 2) && resources <= 2 && support <= 2) {
    recommendedTool = 'ruta';
  }
  // Rule 3: DNC (diagnostic needed)
  else if (competencyKnowledge <= 2 && resources >= 2 && timeline <= 3) {
    recommendedTool = 'dnc';
  }
  // Rule 4: Mi Recomendador (intermediate profile)
  else if (clarity >= 2 && clarity < 3.5 && experience >= 2) {
    recommendedTool = 'recomendador';
  }
  // Fallback by total score
  else {
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
    if (total >= 24) recommendedTool = 'buscador';
    else if (total >= 18) recommendedTool = 'recomendador';
    else if (total >= 12) recommendedTool = 'dnc';
    else recommendedTool = 'ruta';
  }

  // Calculate maturity level (percentage)
  const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
  const maxScore = 32; // 8 questions × 4 max
  const maturityLevel = Math.round((total / maxScore) * 100);

  // Determine strengths (dimensions >= 3)
  const strengths: string[] = [];
  if (clarity >= 3) strengths.push('Tienes claridad sobre tus objetivos y áreas de capacitación');
  if (resources >= 3) strengths.push('Cuentas con recursos internos para gestionar la formación');
  if (experience >= 3) strengths.push('Tu organización tiene experiencia activa en capacitación');
  if (competencyKnowledge >= 3) strengths.push('Conoces las brechas de competencias de tus equipos');
  if (alignment >= 3) strengths.push('La capacitación está alineada con la estrategia del negocio');
  if (timeline >= 3) strengths.push('Tienes claridad sobre los plazos de implementación');

  // Determine opportunities (dimensions < 3)
  const opportunities: string[] = [];
  if (clarity < 3) opportunities.push('Definir y priorizar objetivos estratégicos de capacitación');
  if (resources < 3) opportunities.push('Fortalecer los recursos internos para gestión de formación');
  if (experience < 3) opportunities.push('Establecer una práctica regular de capacitación');
  if (competencyKnowledge < 3) opportunities.push('Realizar un diagnóstico de brechas de competencias');
  if (alignment < 3) opportunities.push('Conectar la capacitación con objetivos del negocio');
  if (support < 3) opportunities.push('Desarrollar mayor autonomía en gestión de capacitación');

  // Dimension scores for radar chart
  const dimensionScores = [
    { dimension: 'Claridad', score: clarity, fullMark: 4 },
    { dimension: 'Urgencia', score: timeline, fullMark: 4 },
    { dimension: 'Recursos', score: resources, fullMark: 4 },
    { dimension: 'Autonomía', score: support, fullMark: 4 },
    { dimension: 'Experiencia', score: experience, fullMark: 4 },
    { dimension: 'Conocimiento', score: competencyKnowledge, fullMark: 4 },
    { dimension: 'Alineación', score: alignment, fullMark: 4 }
  ];

  const tool = toolsData[recommendedTool];

  return {
    toolId: tool.id,
    toolName: tool.name,
    toolIcon: tool.icon,
    toolColor: tool.color,
    toolBgColor: tool.bgColor,
    toolUrl: tool.url,
    maturityLevel,
    strengths: strengths.slice(0, 4),
    opportunities: opportunities.slice(0, 4),
    dimensionScores
  };
};

const AsesorDiagnostico: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const handleStartDiagnostic = () => {
    setCurrentStep('questions');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate and show results
      const diagnosticResult = calculateResult(answers);
      setResult(diagnosticResult);
      setCurrentStep('result');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleGoToTool = () => {
    if (result) {
      navigate(result.toolUrl);
    }
  };

  const handleExploreTools = () => {
    navigate('/asesor/herramientas');
  };

  const handleNewDiagnostic = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  // Intro screen
  if (currentStep === 'intro') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Diagnóstico de Capacitación</h1>
          <p className="text-muted-foreground max-w-3xl">
            Este diagnóstico evaluará tu nivel de madurez en gestión de capacitación y te recomendará 
            la herramienta más adecuada para comenzar tu proceso de formación estratégica.
          </p>
        </div>

        <Card className="border-0 shadow-sm max-w-2xl mx-auto">
          <div className="text-center space-y-6 py-8">
            <div className="p-6 bg-primary/10 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <ClipboardCheck className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">¿Listo para comenzar?</h2>
              <p className="text-muted-foreground">
                El diagnóstico consta de 8 preguntas y toma aproximadamente 5 minutos.
                Al finalizar, recibirás un análisis personalizado con recomendaciones.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">Preguntas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">Minutos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1</div>
                <div className="text-sm text-muted-foreground">Recomendación</div>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleStartDiagnostic}
              style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Iniciar Diagnóstico
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Questions screen
  if (currentStep === 'questions') {
    const question = questions[currentQuestion];
    const currentAnswer = answers[question.id];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Diagnóstico de Capacitación</h1>
          <div className="flex items-center gap-4 mt-4">
            <Progress 
              percent={progressPercent} 
              showInfo={false}
              strokeColor="#65BFB1"
              trailColor="#e5e7eb"
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
          </div>
        </div>

        <Card className="border-0 shadow-sm max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                <span className="text-xl font-bold text-primary">{currentQuestion + 1}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">{question.text}</h2>
                <p className="text-sm text-muted-foreground">{question.helpText}</p>
              </div>
            </div>

            <Radio.Group 
              onChange={(e) => handleAnswer(e.target.value)} 
              value={currentAnswer}
              className="w-full"
            >
              <Space direction="vertical" className="w-full" size="middle">
                {question.options.map((option) => (
                  <Radio 
                    key={option.value} 
                    value={option.value}
                    className="w-full p-4 border rounded-lg hover:border-primary transition-colors"
                    style={{
                      borderColor: currentAnswer === option.value ? '#65BFB1' : undefined,
                      backgroundColor: currentAnswer === option.value ? 'rgba(101, 191, 177, 0.05)' : undefined
                    }}
                  >
                    <span className="text-foreground">{option.label}</span>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

            <div className="flex justify-between pt-4 border-t">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Anterior
              </Button>
              <Button
                type="primary"
                onClick={handleNext}
                disabled={!currentAnswer}
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {currentQuestion === questions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Results screen
  if (currentStep === 'result' && result) {
    const barData = result.dimensionScores.map(d => ({
      name: d.dimension,
      score: d.score,
      max: d.fullMark
    }));

    const getBarColor = (score: number) => {
      if (score >= 3) return '#65BFB1';
      if (score >= 2) return '#F59E0B';
      return '#EF4444';
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Resultado del Diagnóstico</h1>
          <p className="text-muted-foreground">
            Basado en tus respuestas, hemos analizado tu nivel de madurez en gestión de capacitación.
          </p>
        </div>

        {/* Maturity Level Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm lg:col-span-1">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-foreground">Nivel de Madurez</h3>
              <div className="relative w-32 h-32 mx-auto">
                <Progress
                  type="circle"
                  percent={result.maturityLevel}
                  strokeColor="#65BFB1"
                  trailColor="#e5e7eb"
                  strokeWidth={8}
                  format={(percent) => (
                    <span className="text-2xl font-bold text-foreground">{percent}%</span>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {result.maturityLevel >= 75 ? 'Madurez Alta' :
                 result.maturityLevel >= 50 ? 'Madurez Media' :
                 result.maturityLevel >= 25 ? 'Madurez Básica' : 'Madurez Inicial'}
              </p>
            </div>
          </Card>

          {/* Radar Chart */}
          <Card className="border-0 shadow-sm lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Perfil de Dimensiones</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={result.dimensionScores}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 4]} 
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#65BFB1"
                  fill="#65BFB1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bar Chart */}
        <Card className="border-0 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Detalle por Dimensión</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 4]} tick={{ fill: '#6b7280' }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={100}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} / 4`, 'Puntaje']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Strengths and Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-foreground">Tus Fortalezas</h3>
            </div>
            <ul className="space-y-3">
              {result.strengths.length > 0 ? (
                result.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">
                  El diagnóstico identificó varias áreas de oportunidad para desarrollar.
                </li>
              )}
            </ul>
          </Card>

          <Card className="border-0 shadow-sm border-l-4 border-l-amber-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-foreground">Oportunidades de Mejora</h3>
            </div>
            <ul className="space-y-3">
              {result.opportunities.length > 0 ? (
                result.opportunities.map((opportunity, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{opportunity}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">
                  ¡Excelente! No se identificaron áreas críticas de mejora.
                </li>
              )}
            </ul>
          </Card>
        </div>

        {/* Recommended Tool */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`p-6 ${result.toolBgColor} rounded-xl flex-shrink-0`}>
              <div className={result.toolColor}>{result.toolIcon}</div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-1">Herramienta Recomendada</p>
              <h3 className="text-xl font-bold text-foreground mb-2">{result.toolName}</h3>
              <p className="text-muted-foreground">
                {toolsData[result.toolId as keyof typeof toolsData].description}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                type="primary"
                size="large"
                onClick={handleGoToTool}
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Ir a {result.toolName}
              </Button>
              <Button
                size="large"
                onClick={handleExploreTools}
              >
                Explorar Herramientas
              </Button>
            </div>
          </div>
        </Card>

        {/* New Diagnostic Button */}
        <div className="text-center">
          <Button
            onClick={handleNewDiagnostic}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Realizar Nuevo Diagnóstico
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default AsesorDiagnostico;
