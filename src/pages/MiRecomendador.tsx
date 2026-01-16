import React, { useState } from 'react';
import { Card, Steps, Button, Form, Input, Select, Table, Checkbox, Tag, message, InputNumber, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  User, 
  GraduationCap, 
  CheckCircle,
  Plus,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Clock,
  Calendar,
  Monitor,
  BookOpen,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const { Option } = Select;

// Mock data for dropdowns
const rubros = [
  'Agricultura y Ganadería',
  'Minería',
  'Industria Manufacturera',
  'Construcción',
  'Comercio',
  'Transporte y Almacenamiento',
  'Hotelería y Turismo',
  'Tecnología e Informática',
  'Servicios Financieros',
  'Salud',
  'Educación',
  'Servicios Profesionales'
];

const areasCapacitacion = [
  'Administración y Negocios',
  'Comercio y Marketing',
  'Tecnología y Computación',
  'Recursos Humanos',
  'Salud y Seguridad Ocupacional',
  'Idiomas',
  'Habilidades Blandas',
  'Gestión de Proyectos',
  'Finanzas y Contabilidad',
  'Logística y Supply Chain'
];

const tematicas: Record<string, string[]> = {
  'Administración y Negocios': ['Gestión Empresarial', 'Liderazgo', 'Planificación Estratégica'],
  'Comercio y Marketing': ['Marketing Digital', 'Ventas', 'Atención al Cliente'],
  'Tecnología y Computación': ['Programación', 'Excel Avanzado', 'Ciberseguridad'],
  'Recursos Humanos': ['Gestión del Talento', 'Clima Laboral', 'Selección de Personal'],
  'Salud y Seguridad Ocupacional': ['Prevención de Riesgos', 'Primeros Auxilios', 'Ergonomía'],
  'Idiomas': ['Inglés Empresarial', 'Portugués Básico', 'Comunicación Escrita'],
  'Habilidades Blandas': ['Trabajo en Equipo', 'Comunicación Efectiva', 'Resolución de Conflictos'],
  'Gestión de Proyectos': ['Metodologías Ágiles', 'PMI/PMP', 'Gestión del Cambio'],
  'Finanzas y Contabilidad': ['Análisis Financiero', 'Contabilidad Básica', 'Presupuestos'],
  'Logística y Supply Chain': ['Gestión de Inventarios', 'Cadena de Suministro', 'Distribución']
};

const modalidades = ['Presencial', 'E-Learning', 'Blended'];

const regiones = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  'O\'Higgins',
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes'
];

// Mock course results
const mockCourseResults = [
  {
    id: 1,
    especialidad: 'Administración',
    nombreCurso: 'Gestión Empresarial y Liderazgo',
    modalidad: 'Presencial',
    region: 'Metropolitana',
    horas: 40,
    codigoCurso: 'SENCE-2024-001',
    objetivo: 'Desarrollar competencias de gestión empresarial y liderazgo efectivo para la toma de decisiones estratégicas.'
  },
  {
    id: 2,
    especialidad: 'Tecnología',
    nombreCurso: 'Excel Avanzado para Análisis de Datos',
    modalidad: 'E-Learning',
    region: 'Nacional',
    horas: 24,
    codigoCurso: 'SENCE-2024-002',
    objetivo: 'Dominar herramientas avanzadas de Excel para el análisis y visualización de datos empresariales.'
  },
  {
    id: 3,
    especialidad: 'Habilidades Blandas',
    nombreCurso: 'Comunicación Efectiva en el Trabajo',
    modalidad: 'Blended',
    region: 'Valparaíso',
    horas: 16,
    codigoCurso: 'SENCE-2024-003',
    objetivo: 'Fortalecer las habilidades de comunicación oral y escrita en contextos laborales.'
  },
  {
    id: 4,
    especialidad: 'Seguridad',
    nombreCurso: 'Prevención de Riesgos Laborales',
    modalidad: 'Presencial',
    region: 'Biobío',
    horas: 32,
    codigoCurso: 'SENCE-2024-004',
    objetivo: 'Identificar y prevenir riesgos laborales aplicando normativas de seguridad vigentes.'
  },
  {
    id: 5,
    especialidad: 'Marketing',
    nombreCurso: 'Marketing Digital y Redes Sociales',
    modalidad: 'E-Learning',
    region: 'Nacional',
    horas: 20,
    codigoCurso: 'SENCE-2024-005',
    objetivo: 'Diseñar e implementar estrategias de marketing digital efectivas en plataformas sociales.'
  }
];

interface AreaCapacitacion {
  id: string;
  area: string;
  tematica1: string;
  tematica2: string;
  tematica3: string;
  modalidad: string;
  region: string;
}

interface ContactInfo {
  nombreEmpresa: string;
  rutEmpresa: string;
  rubro: string;
  nombreSolicitante: string;
  cargo: string;
  email: string;
  telefono: string;
}

interface CourseResult {
  id: number;
  especialidad: string;
  nombreCurso: string;
  modalidad: string;
  region: string;
  horas: number;
  codigoCurso: string;
  objetivo: string;
}

interface CourseProposal {
  courseId: number;
  tramo15: number;
  tramo50: number;
  tramo100: number;
  periodos: { fechaDesde: string | null; fechaHasta: string | null }[];
  valorImputable: number;
  diferencia: number;
  expanded: boolean;
  calculated: boolean;
  monthlyData: { month: string; anoActual: number; anoProximo: number }[];
}

const MiRecomendador: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [contactForm] = Form.useForm();
  
  // Form states
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    nombreEmpresa: 'Empresa Ejemplo S.A.',
    rutEmpresa: '76.123.456-7',
    rubro: '',
    nombreSolicitante: '',
    cargo: '',
    email: '',
    telefono: ''
  });
  
  const [areasCapacitar, setAreasCapacitar] = useState<AreaCapacitacion[]>([
    {
      id: '1',
      area: '',
      tematica1: '',
      tematica2: '',
      tematica3: '',
      modalidad: '',
      region: ''
    }
  ]);
  
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [showProposal, setShowProposal] = useState(false);
  const [courseProposals, setCourseProposals] = useState<CourseProposal[]>([]);

  const steps = [
    { title: 'Contacto', icon: <User className="w-4 h-4" /> },
    { title: 'Cursos', icon: <GraduationCap className="w-4 h-4" /> },
    { title: 'Confirmación', icon: <CheckCircle className="w-4 h-4" /> },
    { title: 'Resultados', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { title: 'Propuesta', icon: <Calculator className="w-4 h-4" /> }
  ];

  const handleAddArea = () => {
    setAreasCapacitar([
      ...areasCapacitar,
      {
        id: Date.now().toString(),
        area: '',
        tematica1: '',
        tematica2: '',
        tematica3: '',
        modalidad: '',
        region: ''
      }
    ]);
  };

  const handleRemoveArea = (id: string) => {
    if (areasCapacitar.length > 1) {
      setAreasCapacitar(areasCapacitar.filter(a => a.id !== id));
    }
  };

  const handleAreaChange = (id: string, field: keyof AreaCapacitacion, value: string) => {
    setAreasCapacitar(areasCapacitar.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        const values = await contactForm.validateFields();
        setContactInfo({ ...contactInfo, ...values });
        setCurrentStep(currentStep + 1);
      } catch {
        message.error('Por favor complete todos los campos requeridos');
      }
    } else if (currentStep === 1) {
      const isValid = areasCapacitar.every(a => a.area && a.tematica1 && a.modalidad && a.region);
      if (!isValid) {
        message.error('Por favor complete al menos el área, una temática, modalidad y región');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleDownloadExcel = () => {
    message.success('Descargando archivo Excel...');
    // In production, this would generate and download an actual Excel file
  };

  const handleValidarCotizacion = () => {
    if (selectedCourses.length === 0) {
      message.warning('Por favor seleccione al menos un curso');
      return;
    }
    // Initialize course proposals for selected courses
    const proposals = selectedCourses.map(courseId => ({
      courseId,
      tramo15: 0,
      tramo50: 0,
      tramo100: 0,
      periodos: [{ fechaDesde: null, fechaHasta: null }],
      valorImputable: 0,
      diferencia: 0,
      expanded: false,
      calculated: false,
      monthlyData: []
    }));
    setCourseProposals(proposals);
    setCurrentStep(4); // Go to Propuesta step
  };

  const handleUpdateProposal = (courseId: number, field: keyof CourseProposal, value: any) => {
    setCourseProposals(prev => prev.map(p => 
      p.courseId === courseId ? { ...p, [field]: value } : p
    ));
  };

  const handleAddPeriodo = (courseId: number) => {
    setCourseProposals(prev => prev.map(p => 
      p.courseId === courseId 
        ? { ...p, periodos: [...p.periodos, { fechaDesde: null, fechaHasta: null }] }
        : p
    ));
  };

  const handleRemovePeriodo = (courseId: number, index: number) => {
    setCourseProposals(prev => prev.map(p => 
      p.courseId === courseId 
        ? { ...p, periodos: p.periodos.filter((_, i) => i !== index) }
        : p
    ));
  };

  const handleCalculate = (courseId: number) => {
    const proposal = courseProposals.find(p => p.courseId === courseId);
    const course = mockCourseResults.find(c => c.id === courseId);
    if (proposal && course) {
      // Mock calculation
      const totalParticipants = proposal.tramo15 + proposal.tramo50 + proposal.tramo100;
      const valorBase = 50000; // Mock base value per hour
      const valorImputable = valorBase * course.horas;
      const diferencia = totalParticipants > 0 ? valorImputable * 0.15 : 0;
      
      // Generate monthly data based on selected dates
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const monthlyData = months.map((month, idx) => {
        // Check if any periodo falls in this month
        let anoActual = 0;
        let anoProximo = 0;
        
        proposal.periodos.forEach(periodo => {
          if (periodo.fechaDesde) {
            const startMonth = new Date(periodo.fechaDesde).getMonth();
            const endMonth = periodo.fechaHasta ? new Date(periodo.fechaHasta).getMonth() : startMonth;
            const startYear = new Date(periodo.fechaDesde).getFullYear();
            const currentYear = new Date().getFullYear();
            
            if (idx >= startMonth && idx <= endMonth) {
              if (startYear === currentYear) {
                anoActual = 100;
              } else {
                anoProximo = 100;
              }
            }
          }
        });
        
        return { month, anoActual, anoProximo };
      });
      
      handleUpdateProposal(courseId, 'valorImputable', valorImputable);
      handleUpdateProposal(courseId, 'diferencia', diferencia);
      handleUpdateProposal(courseId, 'calculated', true);
      handleUpdateProposal(courseId, 'monthlyData', monthlyData);
      message.success('Cálculo realizado correctamente');
    }
  };

  const toggleProposalExpanded = (courseId: number) => {
    setCourseProposals(prev => prev.map(p => 
      p.courseId === courseId ? { ...p, expanded: !p.expanded } : p
    ));
  };

  const handleVolverAlInicio = () => {
    setCurrentStep(0);
    setSelectedCourses([]);
    setCourseProposals([]);
  };

  const toggleRowExpanded = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const courseColumns: ColumnsType<CourseResult> = [
    {
      title: '',
      key: 'select',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedCourses.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCourses([...selectedCourses, record.id]);
            } else {
              setSelectedCourses(selectedCourses.filter(id => id !== record.id));
            }
          }}
        />
      )
    },
    {
      title: 'Especialidad',
      dataIndex: 'especialidad',
      key: 'especialidad',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Nombre del Curso',
      dataIndex: 'nombreCurso',
      key: 'nombreCurso',
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Modalidad',
      dataIndex: 'modalidad',
      key: 'modalidad',
      render: (text) => (
        <Tag color={text === 'Presencial' ? 'green' : text === 'E-Learning' ? 'purple' : 'orange'}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Región',
      dataIndex: 'region',
      key: 'region'
    },
    {
      title: 'Horas',
      dataIndex: 'horas',
      key: 'horas',
      render: (text) => <span className="font-semibold">{text}h</span>
    },
    {
      title: 'Código',
      dataIndex: 'codigoCurso',
      key: 'codigoCurso',
      render: (text) => <span className="font-mono text-xs">{text}</span>
    },
    {
      title: 'Objetivo',
      key: 'objetivo',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          onClick={() => toggleRowExpanded(record.id)}
          icon={expandedRows.includes(record.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        >
          {expandedRows.includes(record.id) ? 'Ocultar' : 'Ver'}
        </Button>
      )
    }
  ];

  const renderContactStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Información de Contacto</h3>
          <p className="text-muted-foreground text-sm">Complete los datos de su empresa y persona de contacto</p>
        </div>
      </div>

      <Form form={contactForm} layout="vertical" initialValues={contactInfo}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Nombre Empresa" name="nombreEmpresa">
            <Input disabled value={contactInfo.nombreEmpresa} className="bg-muted" />
          </Form.Item>
          <Form.Item label="RUT Empresa" name="rutEmpresa">
            <Input disabled value={contactInfo.rutEmpresa} className="bg-muted" />
          </Form.Item>
          <Form.Item 
            label="Rubro" 
            name="rubro"
            rules={[{ required: true, message: 'Seleccione un rubro' }]}
          >
            <Select placeholder="Seleccione el rubro de la empresa">
              {rubros.map(r => (
                <Option key={r} value={r}>{r}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item 
            label="Nombre del Solicitante" 
            name="nombreSolicitante"
            rules={[{ required: true, message: 'Ingrese el nombre' }]}
          >
            <Input placeholder="Nombre completo" />
          </Form.Item>
          <Form.Item 
            label="Cargo" 
            name="cargo"
            rules={[{ required: true, message: 'Ingrese el cargo' }]}
          >
            <Input placeholder="Cargo en la empresa" />
          </Form.Item>
          <Form.Item 
            label="Email" 
            name="email"
            rules={[
              { required: true, message: 'Ingrese el email' },
              { type: 'email', message: 'Ingrese un email válido' }
            ]}
          >
            <Input placeholder="correo@empresa.cl" />
          </Form.Item>
          <Form.Item 
            label="Teléfono" 
            name="telefono"
            rules={[{ required: true, message: 'Ingrese el teléfono' }]}
          >
            <Input placeholder="+56 9 1234 5678" />
          </Form.Item>
        </div>
      </Form>
    </div>
  );

  const renderCoursesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 rounded-lg">
          <GraduationCap className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Información de los Cursos</h3>
          <p className="text-muted-foreground text-sm">Seleccione las áreas y temáticas de capacitación</p>
        </div>
      </div>

      {areasCapacitar.map((area, index) => (
        <Card key={area.id} className="border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h4 className="font-medium text-foreground">Área de Capacitación #{index + 1}</h4>
              {index === 0 && (
                <Button 
                  type="primary"
                  size="small"
                  icon={<Plus className="w-3 h-3" />}
                  onClick={handleAddArea}
                  style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
                >
                  Agregar Área
                </Button>
              )}
            </div>
            {areasCapacitar.length > 1 && (
              <Button 
                type="text" 
                danger 
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => handleRemoveArea(area.id)}
              >
                Eliminar
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Área a Capacitar *</label>
              <Select
                className="w-full md:w-1/2"
                placeholder="Seleccione área"
                value={area.area || undefined}
                onChange={(value) => handleAreaChange(area.id, 'area', value)}
              >
                {areasCapacitacion.map(a => (
                  <Option key={a} value={a}>{a}</Option>
                ))}
              </Select>
            </div>

            {/* Temáticas con dropdown cascada */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Temática a desarrollar 1 *</label>
                <Select
                  className="w-full"
                  placeholder="Seleccionar"
                  value={area.tematica1 ? `${area.tematica1}${area.modalidad ? ' / ' + area.modalidad : ''}${area.region ? ' / ' + area.region : ''}` : undefined}
                  disabled={!area.area}
                  dropdownRender={() => (
                    <div className="flex bg-white border rounded-lg shadow-lg">
                      {/* Columna Temática */}
                      <div className="flex-1 border-r max-h-64 overflow-y-auto">
                        {(tematicas[area.area] || []).map(t => (
                          <div
                            key={t}
                            className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${area.tematica1 === t ? 'bg-[#65BFB1]/10 text-[#65BFB1] font-medium' : ''}`}
                            onClick={() => handleAreaChange(area.id, 'tematica1', t)}
                          >
                            <span>{t}</span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          </div>
                        ))}
                      </div>
                      {/* Columna Modalidad */}
                      <div className="flex-1 border-r max-h-64 overflow-y-auto">
                        {modalidades.map(m => (
                          <div
                            key={m}
                            className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${area.modalidad === m ? 'bg-[#65BFB1]/10 text-[#65BFB1] font-medium' : ''}`}
                            onClick={() => handleAreaChange(area.id, 'modalidad', m)}
                          >
                            <span>{m}</span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          </div>
                        ))}
                      </div>
                      {/* Columna Región */}
                      <div className="flex-1 max-h-64 overflow-y-auto">
                        {regiones.map(r => (
                          <div
                            key={r}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${area.region === r ? 'bg-[#65BFB1]/10 text-[#65BFB1] font-medium' : ''}`}
                            onClick={() => handleAreaChange(area.id, 'region', r)}
                          >
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                >
                  <Option value="placeholder">Seleccionar</Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temática a desarrollar 2 (Opcional)</label>
                <Select
                  className="w-full"
                  placeholder="Seleccionar"
                  value={area.tematica2 || undefined}
                  onChange={(value) => handleAreaChange(area.id, 'tematica2', value)}
                  disabled={!area.area}
                >
                  {(tematicas[area.area] || []).map(t => (
                    <Option key={t} value={t}>{t}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temática a desarrollar 3 (Opcional)</label>
                <Select
                  className="w-full"
                  placeholder="Seleccionar"
                  value={area.tematica3 || undefined}
                  onChange={(value) => handleAreaChange(area.id, 'tematica3', value)}
                  disabled={!area.area}
                >
                  {(tematicas[area.area] || []).map(t => (
                    <Option key={t} value={t}>{t}</Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-50 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Confirmación de Consulta</h3>
          <p className="text-muted-foreground text-sm">Revise la información antes de continuar</p>
        </div>
      </div>

      {/* Contact Info Summary */}
      <Card className="border shadow-sm">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Información de Contacto
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Empresa</p>
            <p className="font-medium">{contactInfo.nombreEmpresa}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">RUT</p>
            <p className="font-medium">{contactInfo.rutEmpresa}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rubro</p>
            <p className="font-medium">{contactInfo.rubro || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Solicitante</p>
            <p className="font-medium">{contactInfo.nombreSolicitante || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cargo</p>
            <p className="font-medium">{contactInfo.cargo || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{contactInfo.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-medium">{contactInfo.telefono || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Areas Summary */}
      <Card className="border shadow-sm">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Áreas a Capacitar
        </h4>
        <div className="space-y-4">
          {areasCapacitar.filter(a => a.area).map((area, index) => (
            <div key={area.id} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Tag color="blue">Área #{index + 1}</Tag>
                <span className="font-medium">{area.area}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Temáticas</p>
                  <p className="font-medium">
                    {[area.tematica1, area.tematica2, area.tematica3].filter(Boolean).join(', ') || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Modalidad</p>
                  <p className="font-medium">{area.modalidad || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Región</p>
                  <p className="font-medium">{area.region || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Resultado de la Búsqueda</h3>
            <p className="text-muted-foreground text-sm">
              {mockCourseResults.length} cursos encontrados según sus criterios
            </p>
          </div>
        </div>
        <Button 
          icon={<Download className="w-4 h-4" />}
          onClick={handleDownloadExcel}
        >
          Descargar Excel
        </Button>
      </div>

      <Card className="border shadow-sm">
        <Table
          columns={courseColumns}
          dataSource={mockCourseResults}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          expandable={{
            expandedRowKeys: expandedRows,
            expandedRowRender: (record) => (
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Objetivo del Curso:</p>
                <p className="text-muted-foreground">{record.objetivo}</p>
              </div>
            ),
            showExpandColumn: false
          }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Selection Summary */}
      {selectedCourses.length > 0 && (
        <Card className="border shadow-sm bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Resumen de Selección</h4>
              <p className="text-muted-foreground text-sm">
                Has seleccionado {selectedCourses.length} curso{selectedCourses.length > 1 ? 's' : ''} para cotizar
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCourses.map(id => {
                  const course = mockCourseResults.find(c => c.id === id);
                  return course ? (
                    <Tag key={id} color="blue" className="text-xs">
                      {course.nombreCurso}
                    </Tag>
                  ) : null;
                })}
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleValidarCotizacion}
              style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
            >
              Validar Cotización
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  const renderProposalStep = () => {
    const selectedCoursesData = mockCourseResults.filter(c => selectedCourses.includes(c.id));
    
    // Calculate modality distribution
    const modalityCount = selectedCoursesData.reduce((acc, course) => {
      acc[course.modalidad] = (acc[course.modalidad] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const modalityData = Object.entries(modalityCount).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / selectedCoursesData.length) * 100)
    }));

    // Calculate specialty distribution
    const specialtyCount = selectedCoursesData.reduce((acc, course) => {
      acc[course.especialidad] = (acc[course.especialidad] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const specialtyData = Object.entries(specialtyCount).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / selectedCoursesData.length) * 100)
    }));

    const COLORS = ['#65BFB1', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    // Calculate consolidated monthly data from all calculated courses
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const calculatedProposals = courseProposals.filter(p => p.calculated);
    
    const consolidatedMonthlyData = months.map((month, idx) => {
      let anoActual = 0;
      let anoProximo = 0;
      
      calculatedProposals.forEach(proposal => {
        if (proposal.monthlyData[idx]) {
          if (proposal.monthlyData[idx].anoActual > 0) anoActual += 1;
          if (proposal.monthlyData[idx].anoProximo > 0) anoProximo += 1;
        }
      });
      
      // Convert to percentage based on total calculated courses
      const totalCalculated = calculatedProposals.length || 1;
      return {
        month,
        anoActual: Math.round((anoActual / totalCalculated) * 100),
        anoProximo: Math.round((anoProximo / totalCalculated) * 100)
      };
    });
    
    const hasCalculatedCourses = calculatedProposals.length > 0;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recomendación - Propuesta de capacitación</h2>
            <p className="text-muted-foreground text-sm">
              Valoriza y programa los cursos seleccionados, de acuerdo a los participantes por tramo y fechas en que desees ejecutar la capacitación.
            </p>
          </div>
          <Button
            onClick={handleVolverAlInicio}
            className="border-[#65BFB1] text-[#65BFB1]"
          >
            Volver al inicio
          </Button>
        </div>

        {/* Summary Cards */}
        <Card className="border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cursos */}
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-[#1e4a5a]">{selectedCourses.length}</div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#65BFB1]" />
                <span className="text-sm text-muted-foreground">Cursos<br/>seleccionados</span>
              </div>
            </div>

            {/* Modalidad */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Modalidad</h4>
              <div className="flex items-center gap-4">
                <div className="space-y-1 text-sm">
                  {modalityData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span>{item.name}: {item.percentage}%</span>
                    </div>
                  ))}
                  {modalityData.length === 0 && (
                    <>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400" /><span>Presencial: 0%</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span>E-learning: 0%</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span>A Distancia: 0%</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Especialidades */}
            <div>
              <h4 className="font-medium text-foreground mb-2">Especialidades de capacitación</h4>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={specialtyData.length > 0 ? specialtyData : [{ name: 'Sin datos', value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={35}
                        dataKey="value"
                      >
                        {(specialtyData.length > 0 ? specialtyData : [{ name: 'Sin datos', value: 1 }]).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 text-sm">
                  {specialtyData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span>{item.name}: {item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Meses para capacitar - Consolidated Chart */}
        {hasCalculatedCourses && (
          <Card className="border shadow-sm">
            <h4 className="font-medium text-[#1e4a5a] mb-4">Meses para capacitar</h4>
            <div className="flex justify-end mb-2">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1e4a5a]" />
                  <span>Año actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#65BFB1]" />
                  <span>Año próximo</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consolidatedMonthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Bar dataKey="anoActual" fill="#1e4a5a" name="Año actual" />
                  <Bar dataKey="anoProximo" fill="#65BFB1" name="Año próximo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Listado de capacitaciones */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Listado de capacitaciones</h3>
          
          {courseProposals.map((proposal) => {
            const course = mockCourseResults.find(c => c.id === proposal.courseId);
            if (!course) return null;

            return (
              <Card key={proposal.courseId} className="border shadow-sm mb-4">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded">
                      <BookOpen className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{course.nombreCurso}</h4>
                      <p className="text-sm text-[#65BFB1]">{course.especialidad.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm space-y-1">
                    <div className="flex items-center gap-2 justify-end text-muted-foreground">
                      <Monitor className="w-4 h-4" />
                      <span>{course.codigoCurso}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{course.horas} horas</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Vigencia del curso</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end text-muted-foreground">
                      <Monitor className="w-4 h-4" />
                      <span>{course.modalidad}</span>
                    </div>
                  </div>
                </div>

                {/* Tramos y Fechas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                  {/* Cantidad de personas por tramo */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Cantidad de personas por tramo</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Tramo 15%</label>
                        <InputNumber
                          className="w-full"
                          min={0}
                          value={proposal.tramo15}
                          onChange={(value) => handleUpdateProposal(proposal.courseId, 'tramo15', value || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Tramo 50%</label>
                        <InputNumber
                          className="w-full"
                          min={0}
                          value={proposal.tramo50}
                          onChange={(value) => handleUpdateProposal(proposal.courseId, 'tramo50', value || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Tramo 100%</label>
                        <InputNumber
                          className="w-full"
                          min={0}
                          value={proposal.tramo100}
                          onChange={(value) => handleUpdateProposal(proposal.courseId, 'tramo100', value || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fecha referencial */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Fecha referencial de capacitación</label>
                    {proposal.periodos.map((periodo, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <div className="flex-1">
                          <label className="block text-xs text-muted-foreground mb-1">Fecha desde</label>
                          <DatePicker
                            className="w-full"
                            placeholder="Seleccionar"
                            onChange={(date) => {
                              const newPeriodos = [...proposal.periodos];
                              newPeriodos[idx] = { ...newPeriodos[idx], fechaDesde: date?.format('YYYY-MM-DD') || null };
                              handleUpdateProposal(proposal.courseId, 'periodos', newPeriodos);
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-muted-foreground mb-1">Fecha hasta</label>
                          <DatePicker
                            className="w-full"
                            placeholder="Seleccionar"
                            onChange={(date) => {
                              const newPeriodos = [...proposal.periodos];
                              newPeriodos[idx] = { ...newPeriodos[idx], fechaHasta: date?.format('YYYY-MM-DD') || null };
                              handleUpdateProposal(proposal.courseId, 'periodos', newPeriodos);
                            }}
                          />
                        </div>
                        {proposal.periodos.length > 1 && (
                          <Button
                            type="text"
                            danger
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleRemovePeriodo(proposal.courseId, idx)}
                            className="mt-5"
                          />
                        )}
                      </div>
                    ))}
                    <Button
                      type="link"
                      onClick={() => handleAddPeriodo(proposal.courseId)}
                      className="text-[#65BFB1] p-0"
                    >
                      Agregar otro período
                    </Button>
                  </div>
                </div>

                {/* Calcular Button */}
                <div className="flex justify-start mb-4">
                  <Button
                    onClick={() => handleCalculate(proposal.courseId)}
                    className="bg-gray-100 text-gray-600 border-gray-200"
                  >
                    Calcular
                  </Button>
                </div>

                {/* Footer con valores */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    type="link"
                    onClick={() => toggleProposalExpanded(proposal.courseId)}
                    className="text-[#65BFB1] p-0 flex items-center gap-1"
                  >
                    Configurar curso {proposal.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  <div className="flex items-center gap-8 text-sm">
                    <span>Valor Imputable por participante: <strong>${proposal.valorImputable.toLocaleString('es-CL')}</strong></span>
                    <span>Diferencia a pagar fuera de cobertura franquicia: <strong>${proposal.diferencia.toLocaleString('es-CL')}</strong></span>
                  </div>
                </div>

                {/* Expanded Config */}
                {proposal.expanded && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Configuración adicional del curso (pendiente de implementar)</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <Button
            onClick={() => setCurrentStep(3)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Volver
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => message.success('Propuesta confirmada exitosamente')}
            style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
          >
            Confirmar Propuesta
          </Button>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderContactStep();
      case 1:
        return renderCoursesStep();
      case 2:
        return renderConfirmationStep();
      case 3:
        return renderResultsStep();
      case 4:
        return renderProposalStep();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          type="text" 
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={() => navigate('/asesor')}
          className="flex items-center"
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Recomendador</h1>
          <p className="text-muted-foreground">Sistema de recomendación de cursos de capacitación</p>
        </div>
      </div>

      {/* Steps */}
      <Card className="border-0 shadow-sm">
        <Steps
          current={currentStep}
          items={steps.map(s => ({ title: s.title, icon: s.icon }))}
          className="mb-8"
        />
        
        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {currentStep < 4 && (
          <div className="flex justify-between pt-6 border-t mt-6">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
            {currentStep < 3 && (
              <Button
                type="primary"
                onClick={handleNext}
                style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Siguiente
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MiRecomendador;
