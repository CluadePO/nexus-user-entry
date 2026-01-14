import React, { useState } from 'react';
import { Modal, Button, Progress, Radio, Space } from 'antd';
import { 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  Search,
  Sparkles,
  Route,
  Lightbulb
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
import { useNavigate } from 'react-router-dom';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  text: string;
  description: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: '¿Qué tan claros y priorizados están tus objetivos estratégicos de capacitación?',
    description: 'Mide si tu organización tiene metas de capacitación definidas (qué lograr, para quién y con qué resultado esperado).'
  },
  {
    id: 2,
    text: '¿Tienes identificadas las áreas, temáticas o competencias que necesitas desarrollar?',
    description: 'Evalúa si ya sabes en qué habilidades enfocarte (por rol, área o proceso) para orientar la búsqueda o el plan.'
  },
  {
    id: 3,
    text: '¿En qué plazo necesitas implementar acciones de capacitación?',
    description: 'Define la urgencia. A menor plazo, más sentido tiene ir directo a cursos; a mayor plazo, conviene estructurar diagnóstico/plan.'
  },
  {
    id: 4,
    text: '¿Qué capacidad interna tienes para gestionar y hacer seguimiento a la capacitación?',
    description: 'Mide si tu organización puede levantar necesidades, coordinar cursos, gestionar proveedores y evaluar resultados.'
  },
  {
    id: 5,
    text: '¿Qué nivel de acompañamiento necesitas durante el proceso?',
    description: 'Define si buscas solo herramientas, una guía para ordenar decisiones o una consultoría con acompañamiento completo.'
  },
  {
    id: 6,
    text: 'En el último año, ¿qué tan activa ha sido tu gestión de capacitaciones?',
    description: 'Identifica tu nivel de madurez: si ya existe práctica instalada o si estás partiendo desde cero.'
  },
  {
    id: 7,
    text: '¿Qué tan bien conoces las brechas de competencias de tus equipos?',
    description: 'Evalúa si tienes información para justificar prioridades (datos) o si estás decidiendo por percepción.'
  },
  {
    id: 8,
    text: '¿Qué tan alineada está la capacitación con los objetivos estratégicos de la empresa?',
    description: 'Mide si la formación impulsa metas del negocio (productividad, calidad, ventas, seguridad, transformación, etc.) o es reactiva.'
  }
];

const answerOptions = [
  { value: 1, label: 'Muy bajo / inexistente' },
  { value: 2, label: 'Bajo / incipiente' },
  { value: 3, label: 'Medio / aceptable' },
  { value: 4, label: 'Alto / maduro' }
];

type DiagnosticStep = 'intro' | 'questions' | 'results';

interface ToolRecommendation {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  url: string;
}

const toolsData: Record<string, ToolRecommendation> = {
  buscador: {
    id: 'buscador',
    name: 'Mi Buscador',
    shortName: 'Marketplace de Cursos',
    icon: <Search className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Ideal para empresas que ya saben qué curso necesitan y quieren encontrar rápidamente un proveedor.',
    url: '/asesor/buscador'
  },
  recomendador: {
    id: 'recomendador',
    name: 'Mi Recomendador',
    shortName: 'Recomendaciones Personalizadas',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Perfecto para empresas que conocen sus áreas de interés pero necesitan orientación basada en datos.',
    url: '/asesor/recomendador'
  },
  dnc: {
    id: 'dnc',
    name: 'Mi DNC',
    shortName: 'Detección de Necesidades',
    icon: <Target className="w-6 h-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Ideal para empresas que quieren construir un plan basado en las necesidades reales de sus equipos.',
    url: '/asesor/dnc'
  },
  ruta: {
    id: 'ruta',
    name: 'Mi Ruta',
    shortName: 'Consultoría Estratégica',
    icon: <Route className="w-6 h-6" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Para empresas que requieren un socio estratégico para transformar su inversión en capacitación.',
    url: '/asesor/ruta'
  }
};

const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<DiagnosticStep>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<{
    recommendation: string;
    maturityScore: number;
    strengths: string[];
    opportunities: string[];
    dimensions: { name: string; value: number; fullMark: number }[];
  } | null>(null);

  const handleClose = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    onClose();
  };

  const handleStartDiagnostic = () => {
    setStep('questions');
  };

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion + 1]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    // Calculate dimensions
    const clarity = (answers[1] + answers[2]) / 2;
    const timeline = answers[3];
    const resources = answers[4];
    const support = answers[5];
    const experience = answers[6];
    const competencyKnowledge = answers[7];
    const alignment = answers[8];

    // Calculate maturity score (average of all dimensions, weighted)
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maturityScore = Math.round((totalScore / 32) * 100);

    // Determine strengths
    const strengths: string[] = [];
    if (clarity >= 3) strengths.push('Tienes claridad sobre tus objetivos estratégicos de capacitación');
    if (resources >= 3) strengths.push('Cuentas con capacidad interna para gestionar la capacitación');
    if (experience >= 3) strengths.push('Tu organización tiene experiencia en gestión de capacitaciones');
    if (competencyKnowledge >= 3) strengths.push('Conoces las brechas de competencias de tus equipos');
    if (alignment >= 3) strengths.push('La capacitación está alineada con los objetivos del negocio');
    if (timeline >= 3) strengths.push('Tienes claridad sobre los plazos de implementación');

    // Determine opportunities
    const opportunities: string[] = [];
    if (clarity < 3) opportunities.push('Definir y priorizar objetivos estratégicos de capacitación');
    if (resources < 3) opportunities.push('Fortalecer los recursos internos para gestión de capacitación');
    if (experience < 3) opportunities.push('Desarrollar prácticas de gestión de capacitación');
    if (competencyKnowledge < 3) opportunities.push('Levantar información sobre brechas de competencias');
    if (alignment < 3) opportunities.push('Alinear la capacitación con objetivos estratégicos del negocio');
    if (support < 3) opportunities.push('Considerar apoyo externo para el proceso de capacitación');

    // Determine recommendation based on decision tree
    let recommendation: string;

    // Rule 1 - Mi Buscador (autonomous and urgent profile)
    if (clarity >= 3.5 && timeline >= 3 && support >= 3 && experience >= 3) {
      recommendation = 'buscador';
    }
    // Rule 2 - Mi Ruta (immature strategic profile)
    else if ((clarity <= 2 || alignment <= 2) && resources <= 2 && support <= 2) {
      recommendation = 'ruta';
    }
    // Rule 3 - DNC (needs diagnosis)
    else if (competencyKnowledge <= 2 && resources >= 2 && timeline <= 3) {
      recommendation = 'dnc';
    }
    // Rule 4 - Mi Recomendador (intermediate profile)
    else if (clarity >= 2 && clarity < 3.5 && experience >= 2) {
      recommendation = 'recomendador';
    }
    // Fallback by total score
    else {
      if (totalScore >= 24) recommendation = 'buscador';
      else if (totalScore >= 18) recommendation = 'recomendador';
      else if (totalScore >= 12) recommendation = 'dnc';
      else recommendation = 'ruta';
    }

    // Create dimensions for radar chart
    const dimensions = [
      { name: 'Claridad', value: clarity, fullMark: 4 },
      { name: 'Urgencia', value: timeline, fullMark: 4 },
      { name: 'Recursos', value: resources, fullMark: 4 },
      { name: 'Acompañamiento', value: 5 - support, fullMark: 4 }, // Inverted: less support needed = more autonomous
      { name: 'Experiencia', value: experience, fullMark: 4 },
      { name: 'Conocimiento', value: competencyKnowledge, fullMark: 4 },
      { name: 'Alineación', value: alignment, fullMark: 4 }
    ];

    setResults({
      recommendation,
      maturityScore,
      strengths: strengths.slice(0, 4),
      opportunities: opportunities.slice(0, 4),
      dimensions
    });

    setStep('results');
  };

  const handleGoToTool = () => {
    if (results) {
      navigate(toolsData[results.recommendation].url);
      handleClose();
    }
  };

  const handleExploreTools = () => {
    navigate('/asesor/herramientas');
    handleClose();
  };

  const renderIntro = () => (
    <div className="space-y-6 text-center py-4">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Target className="w-8 h-8 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground mb-3">Diagnóstico de Capacitación</h2>
        <p className="text-muted-foreground leading-relaxed">
          Descubre qué tan alineados están tus objetivos estratégicos con tus necesidades de 
          capacitación y encuentra la herramienta perfecta para ti.
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">8</span>
          </div>
          <p className="text-sm text-foreground">Preguntas rápidas sobre tu situación actual</p>
        </div>
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm text-foreground">Recomendación personalizada basada en tus respuestas</p>
        </div>
      </div>
      <Button
        type="primary"
        size="large"
        onClick={handleStartDiagnostic}
        style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
        icon={<ArrowRight className="w-4 h-4" />}
        className="w-full"
      >
        Comenzar diagnóstico
      </Button>
    </div>
  );

  const renderQuestions = () => {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentAnswer = answers[currentQuestion + 1];

    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress percent={progress} showInfo={false} strokeColor="#65BFB1" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{question.text}</h3>
          <p className="text-sm text-muted-foreground">{question.description}</p>
        </div>

        <Radio.Group
          onChange={(e) => handleAnswer(e.target.value)}
          value={currentAnswer}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {answerOptions.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                className="w-full p-3 border rounded-lg hover:border-primary transition-colors"
                style={{
                  backgroundColor: currentAnswer === option.value ? 'rgba(101, 191, 177, 0.1)' : 'transparent',
                  borderColor: currentAnswer === option.value ? '#65BFB1' : undefined
                }}
              >
                <span className="text-foreground">{option.label}</span>
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
            size="large"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Anterior
          </Button>
          <Button
            type="primary"
            onClick={handleNext}
            disabled={!currentAnswer}
            className="flex-1"
            size="large"
            style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {currentQuestion === questions.length - 1 ? 'Ver resultados' : 'Siguiente'}
          </Button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    const recommendedTool = toolsData[results.recommendation];
    const barData = results.dimensions.map(d => ({
      name: d.name,
      value: d.value,
      fill: d.value >= 3 ? '#65BFB1' : d.value >= 2 ? '#F59E0B' : '#EF4444'
    }));

    return (
      <div className="space-y-6">
        {/* Maturity Score */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Tu Nivel de Madurez</h3>
          <div className="relative inline-flex items-center justify-center">
            <Progress
              type="circle"
              percent={results.maturityScore}
              size={120}
              strokeColor="#65BFB1"
              format={(percent) => (
                <span className="text-2xl font-bold text-foreground">{percent}%</span>
              )}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Radar Chart */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 text-center">Perfil de Madurez</h4>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={results.dimensions}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Nivel"
                  dataKey="value"
                  stroke="#65BFB1"
                  fill="#65BFB1"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 text-center">Dimensiones</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-800">Tus Fortalezas</h4>
            </div>
            <ul className="space-y-2">
              {results.strengths.length > 0 ? (
                results.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-emerald-700 flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-emerald-700">Continúa desarrollando tus capacidades</li>
              )}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-orange-800">Oportunidades de Mejora</h4>
            </div>
            <ul className="space-y-2">
              {results.opportunities.length > 0 ? (
                results.opportunities.map((opportunity, idx) => (
                  <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{opportunity}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-orange-700">¡Excelente nivel de madurez!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Recommendation */}
        <div className="border-2 border-primary rounded-xl p-5">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-primary">Herramienta Recomendada</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`p-4 ${recommendedTool.bgColor} rounded-xl shrink-0`}>
              <div className={recommendedTool.color}>{recommendedTool.icon}</div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{recommendedTool.name}</h3>
              <p className="text-sm text-muted-foreground">{recommendedTool.shortName}</p>
              <p className="text-sm text-muted-foreground mt-1">{recommendedTool.description}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleExploreTools}
            className="flex-1"
            size="large"
          >
            Explorar Herramientas
          </Button>
          <Button
            type="primary"
            onClick={handleGoToTool}
            className="flex-1"
            size="large"
            style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Ir a {recommendedTool.name}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={step === 'results' ? 700 : 500}
      centered
      destroyOnClose
    >
      {step === 'intro' && renderIntro()}
      {step === 'questions' && renderQuestions()}
      {step === 'results' && renderResults()}
    </Modal>
  );
};

export default DiagnosticModal;
