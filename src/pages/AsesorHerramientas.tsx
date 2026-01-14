import React from 'react';
import { Card, Typography, Button, Tag, Row, Col, Alert } from 'antd';
import { 
  Search, 
  Compass, 
  ClipboardList, 
  Route, 
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  complexity: 'Básico' | 'Intermedio' | 'Avanzado' | 'Estratégico';
  complexityColor: string;
  features: string[];
  idealFor: string;
  path: string;
}

const tools: Tool[] = [
  {
    id: 'buscador',
    name: 'Mi Buscador',
    icon: <Search className="w-8 h-8" />,
    description: 'Encuentra cursos y programas de capacitación de forma rápida y directa. Ideal cuando ya sabes lo que necesitas.',
    complexity: 'Básico',
    complexityColor: 'green',
    features: [
      'Búsqueda por palabras clave',
      'Filtros por área y modalidad',
      'Resultados inmediatos',
      'Comparación de opciones'
    ],
    idealFor: 'Organizaciones con claridad en sus necesidades y urgencia de implementación.',
    path: '/asesor/herramientas/buscador'
  },
  {
    id: 'recomendador',
    name: 'Mi Recomendador',
    icon: <Compass className="w-8 h-8" />,
    description: 'Recibe sugerencias personalizadas basadas en tu contexto organizacional y objetivos de desarrollo.',
    complexity: 'Intermedio',
    complexityColor: 'blue',
    features: [
      'Recomendaciones por perfil',
      'Sugerencias basadas en industria',
      'Priorización automática',
      'Rutas de aprendizaje sugeridas'
    ],
    idealFor: 'Quienes tienen una idea general pero necesitan orientación para elegir correctamente.',
    path: '/asesor/herramientas/recomendador'
  },
  {
    id: 'dnc',
    name: 'Mi DNC',
    icon: <ClipboardList className="w-8 h-8" />,
    description: 'Diagnóstico de Necesidades de Capacitación completo para identificar brechas de competencias en tu equipo.',
    complexity: 'Avanzado',
    complexityColor: 'orange',
    features: [
      'Levantamiento estructurado',
      'Análisis de brechas',
      'Mapeo de competencias',
      'Reportes detallados'
    ],
    idealFor: 'Organizaciones que necesitan levantar información antes de planificar capacitaciones.',
    path: '/asesor/herramientas/dnc'
  },
  {
    id: 'ruta',
    name: 'Mi Ruta',
    icon: <Route className="w-8 h-8" />,
    description: 'Consultoría estratégica completa con acompañamiento experto para transformar tu gestión de capacitación.',
    complexity: 'Estratégico',
    complexityColor: 'purple',
    features: [
      'Acompañamiento personalizado',
      'Plan estratégico integral',
      'Seguimiento continuo',
      'Métricas de impacto'
    ],
    idealFor: 'Organizaciones que requieren una transformación profunda en su gestión de talento.',
    path: '/asesor/herramientas/ruta'
  }
];

const tips = [
  {
    condition: 'Sabes exactamente qué curso necesitas',
    recommendation: 'Mi Buscador',
    icon: <Search className="w-4 h-4" />
  },
  {
    condition: 'Tienes una idea general pero necesitas orientación',
    recommendation: 'Mi Recomendador',
    icon: <Compass className="w-4 h-4" />
  },
  {
    condition: 'No sabes qué competencias desarrollar primero',
    recommendation: 'Mi DNC',
    icon: <ClipboardList className="w-4 h-4" />
  },
  {
    condition: 'Necesitas transformar tu gestión de capacitación',
    recommendation: 'Mi Ruta',
    icon: <Route className="w-4 h-4" />
  }
];

const AsesorHerramientas: React.FC = () => {
  const navigate = useNavigate();

  const getComplexityColor = (complexity: string) => {
    const colors: Record<string, string> = {
      'Básico': 'green',
      'Intermedio': 'blue',
      'Avanzado': 'orange',
      'Estratégico': 'purple'
    };
    return colors[complexity] || 'default';
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <Title level={2} className="!mb-2">
          Herramientas de Capacitación
        </Title>
        <Paragraph className="text-lg text-gray-600">
          Explora nuestro conjunto de herramientas diseñadas para acompañarte en cada etapa 
          de tu gestión de capacitación. Desde búsquedas rápidas hasta consultoría estratégica, 
          encuentra la solución que mejor se adapte a tu nivel de madurez y necesidades.
        </Paragraph>
      </div>

      {/* Tools Grid */}
      <Row gutter={[24, 24]}>
        {tools.map((tool) => (
          <Col xs={24} sm={12} lg={6} key={tool.id}>
            <Card
              hoverable
              className="h-full flex flex-col"
              styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%' } }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                  >
                    <span style={{ color: 'hsl(var(--primary))' }}>
                      {tool.icon}
                    </span>
                  </div>
                  <Tag color={getComplexityColor(tool.complexity)}>
                    {tool.complexity}
                  </Tag>
                </div>

                {/* Content */}
                <Title level={4} className="!mb-2">{tool.name}</Title>
                <Paragraph className="text-gray-600 flex-grow">
                  {tool.description}
                </Paragraph>

                {/* Features */}
                <div className="mb-4">
                  <Text strong className="text-sm block mb-2">Características:</Text>
                  <ul className="space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal For */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Text className="text-xs text-gray-500 block mb-1">Ideal para:</Text>
                  <Text className="text-sm">{tool.idealFor}</Text>
                </div>

                {/* Action Button */}
                <Button 
                  type="primary" 
                  block
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate(tool.path)}
                  className="mt-auto"
                >
                  Explorar {tool.name}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tips Section */}
      <Card className="mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <Lightbulb className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <Title level={4} className="!mb-0">¿Qué herramienta elegir?</Title>
            </div>
            
            <Paragraph className="text-gray-600 mb-4">
              Cada herramienta está diseñada para un nivel de madurez y necesidad específica. 
              Aquí te dejamos una guía rápida para orientarte:
            </Paragraph>

            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span style={{ color: 'hsl(var(--primary))' }}>
                    {tip.icon}
                  </span>
                  <div className="flex-1">
                    <Text className="text-sm">
                      Si <strong>{tip.condition.toLowerCase()}</strong>, te recomendamos{' '}
                      <Text strong style={{ color: 'hsl(var(--primary))' }}>
                        {tip.recommendation}
                      </Text>
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-80 flex flex-col justify-center">
            <Alert
              message="¿No estás seguro?"
              description="Realiza nuestro diagnóstico de capacitación para recibir una recomendación personalizada basada en tu nivel de madurez organizacional."
              type="info"
              showIcon
              className="mb-4"
            />
            <Button 
              type="primary" 
              size="large"
              block
              onClick={() => navigate('/asesor/diagnostico')}
            >
              Ir al Diagnóstico de Capacitación
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AsesorHerramientas;
