import React, { useState } from 'react';
import { Card, Progress, Modal, Button } from 'antd';
import { 
  Search, 
  Sparkles, 
  Target, 
  Route, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Tool {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  complexity: 'transversal' | 'básica' | 'media' | 'alta';
  description: string;
  characteristics: string[];
  idealFor: string;
  url: string;
}

const tools: Tool[] = [
  {
    id: 'buscador',
    name: 'Mi Buscador',
    shortName: 'Marketplace de Cursos',
    icon: <Search className="w-8 h-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    complexity: 'transversal',
    description: 'Mi Buscador es un Marketplace de cursos donde los clientes y proveedores pueden buscar una amplia gama de capacitaciones, tanto SENCE como no SENCE, con el fin de solicitar una cotización o ponerse en contacto con el OTEC con la finalidad de inscribir un curso.',
    characteristics: [
      'Búsqueda de cursos SENCE y no SENCE',
      'Solicitud de cotizaciones directas',
      'Contacto inmediato con OTECs',
      'Comparación de opciones y proveedores',
      'Filtros avanzados por área, modalidad y franquicia'
    ],
    idealFor: 'Empresas que ya saben qué curso necesitan y quieren encontrar rápidamente un proveedor para cotizar e inscribir.',
    url: '/asesor/buscador'
  },
  {
    id: 'recomendador',
    name: 'Mi Recomendador',
    shortName: 'Recomendaciones Personalizadas',
    icon: <Sparkles className="w-8 h-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    complexity: 'básica',
    description: 'Es un sistema de recomendación de cursos de capacitación basado en los intereses del usuario y respaldado por datos del SENCE sobre cursos vigentes y capacitaciones ejecutadas en los últimos tres años. Utiliza un algoritmo que considera variables como el rubro de la empresa, cursos realizados por empresas similares e interacciones de otros usuarios, para entregar opciones de capacitación personalizadas, con su respectiva calendarización y valorización.',
    characteristics: [
      'Algoritmo basado en datos SENCE de 3 años',
      'Recomendaciones según rubro de empresa',
      'Análisis de cursos de empresas similares',
      'Calendarización de capacitaciones',
      'Valorización de opciones recomendadas',
      'Plan de capacitación personalizado'
    ],
    idealFor: 'Empresas que conocen sus áreas de interés pero necesitan orientación experta basada en datos para elegir los mejores cursos.',
    url: '/asesor/recomendador'
  },
  {
    id: 'dnc',
    name: 'Mi DNC',
    shortName: 'Detección de Necesidades',
    icon: <Target className="w-8 h-8" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    complexity: 'media',
    description: 'Proceso donde puedes iniciar un proceso de detección de necesidades de capacitación, revisar los resultados y obtener un plan de capacitación completo basado en las necesidades reales levantadas desde jefaturas y trabajadores de tu organización.',
    characteristics: [
      'Proceso de diagnóstico autogestionado',
      'Consulta a jefaturas y trabajadores',
      'Levantamiento de brechas de competencias',
      'Revisión detallada de resultados',
      'Plan de capacitación completo',
      'Priorización basada en datos internos'
    ],
    idealFor: 'Empresas que quieren construir un plan de capacitación participativo basado en las necesidades reales de sus equipos.',
    url: '/asesor/dnc'
  },
  {
    id: 'ruta',
    name: 'Mi Ruta',
    shortName: 'Consultoría Estratégica',
    icon: <Route className="w-8 h-8" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    complexity: 'alta',
    description: 'Servicio de consultoría dirigido a empresas que buscan alinear sus planes de formación con sus objetivos estratégicos. Ayuda a que la inversión en capacitación genere impacto real en los resultados del negocio, a través de una metodología propia y niveles progresivos de intervención.',
    characteristics: [
      'Consultoría especializada en formación',
      'Alineación con objetivos estratégicos',
      'Metodología propia de intervención',
      'Niveles progresivos de acompañamiento',
      'Medición de impacto en resultados',
      'Diseño de estrategia anual de capacitación'
    ],
    idealFor: 'Empresas que requieren un socio estratégico para transformar su inversión en capacitación en resultados de negocio medibles.',
    url: '/asesor/ruta'
  }
];

const getComplexityBadge = (complexity: Tool['complexity']) => {
  const styles = {
    transversal: 'bg-blue-100 text-blue-700',
    básica: 'bg-green-100 text-green-700',
    media: 'bg-yellow-100 text-yellow-700',
    alta: 'bg-red-100 text-red-700'
  };
  const labels = {
    transversal: 'Transversal',
    básica: 'Complejidad Básica',
    media: 'Complejidad Media',
    alta: 'Complejidad Alta'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[complexity]}`}>
      {labels[complexity]}
    </span>
  );
};

// Mock data for dashboard metrics
const mockMetrics = {
  diagnosticsCompleted: 12,
  maturityLevel: 68,
  improvementAreas: 5,
  improvementDetails: [
    'Liderazgo y Gestión',
    'Habilidades Técnicas',
    'Comunicación Efectiva',
    'Trabajo en Equipo',
    'Innovación Digital'
  ]
};

const AsesorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleGoToTool = () => {
    if (selectedTool) {
      navigate(selectedTool.url);
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Rol Asesor</h1>
            <p className="text-muted-foreground max-w-3xl">
              El Rol Asesor te acompaña en el proceso de identificar, planificar y ejecutar capacitaciones 
              estratégicas para tu organización. Accede a herramientas especializadas que van desde la 
              búsqueda de cursos hasta la consultoría integral de formación.
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/asesor/diagnostico')}
            style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
            icon={<Target className="w-4 h-4" />}
            className="shrink-0"
          >
            Iniciar Nuevo Diagnóstico
          </Button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Diagnósticos Realizados */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Diagnósticos Realizados</p>
              <p className="text-2xl font-bold text-foreground">{mockMetrics.diagnosticsCompleted}</p>
            </div>
          </div>
        </Card>


        {/* Nivel de Madurez */}
        <Card className="border-0 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Nivel de Madurez</p>
                <p className="text-2xl font-bold text-foreground">{mockMetrics.maturityLevel}%</p>
              </div>
            </div>
            <Progress 
              percent={mockMetrics.maturityLevel} 
              showInfo={false}
              strokeColor="#65BFB1"
              trailColor="#e5e7eb"
            />
          </div>
        </Card>

        {/* Áreas de Mejora */}
        <Card className="border-0 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Áreas de Mejora</p>
              <p className="text-2xl font-bold text-foreground">{mockMetrics.improvementAreas}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {mockMetrics.improvementDetails.slice(0, 2).map((area, idx) => (
                  <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    {area}
                  </span>
                ))}
                {mockMetrics.improvementDetails.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{mockMetrics.improvementDetails.length - 2} más
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tools Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Herramientas Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleToolClick(tool)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 ${tool.bgColor} rounded-xl`}>
                  <div className={tool.color}>{tool.icon}</div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.shortName}</p>
                </div>
                {getComplexityBadge(tool.complexity)}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tool Detail Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        closeIcon={<X className="w-5 h-5" />}
        centered
      >
        {selectedTool && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className={`p-4 ${selectedTool.bgColor} rounded-xl`}>
                <div className={selectedTool.color}>{selectedTool.icon}</div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedTool.name}</h2>
                <p className="text-muted-foreground">{selectedTool.shortName}</p>
                <div className="mt-2">{getComplexityBadge(selectedTool.complexity)}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-foreground leading-relaxed">{selectedTool.description}</p>
            </div>

            {/* Characteristics */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Características Principales</h3>
              <ul className="space-y-2">
                {selectedTool.characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ideal For */}
            <div className="bg-primary/5 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Ideal para</h3>
              <p className="text-muted-foreground">{selectedTool.idealFor}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={handleCloseModal}
                className="flex-1"
                size="large"
              >
                Cerrar
              </Button>
              <Button
                type="primary"
                onClick={handleGoToTool}
                className="flex-1"
                size="large"
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Ir a la Herramienta
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AsesorDashboard;
