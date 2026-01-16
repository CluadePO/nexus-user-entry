import React, { useState } from 'react';
import { Card, Steps, Button, Form, Input, Select, Table, Checkbox, Tag, message } from 'antd';
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
  FileSpreadsheet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  const steps = [
    { title: 'Contacto', icon: <User className="w-4 h-4" /> },
    { title: 'Cursos', icon: <GraduationCap className="w-4 h-4" /> },
    { title: 'Confirmación', icon: <CheckCircle className="w-4 h-4" /> },
    { title: 'Resultados', icon: <FileSpreadsheet className="w-4 h-4" /> }
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
    message.success('Cotización validada correctamente');
    // Navigate or trigger next action
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-lg">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Información de los Cursos</h3>
            <p className="text-muted-foreground text-sm">Seleccione las áreas y temáticas de capacitación</p>
          </div>
        </div>
        <Button 
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAddArea}
          style={{ backgroundColor: '#65BFB1', borderColor: '#65BFB1' }}
        >
          Agregar Área
        </Button>
      </div>

      {areasCapacitar.map((area, index) => (
        <Card key={area.id} className="border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Área de Capacitación #{index + 1}</h4>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Área a Capacitar *</label>
              <Select
                className="w-full"
                placeholder="Seleccione área"
                value={area.area || undefined}
                onChange={(value) => handleAreaChange(area.id, 'area', value)}
              >
                {areasCapacitacion.map(a => (
                  <Option key={a} value={a}>{a}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Temática 1 *</label>
              <Select
                className="w-full"
                placeholder="Seleccione temática"
                value={area.tematica1 || undefined}
                onChange={(value) => handleAreaChange(area.id, 'tematica1', value)}
                disabled={!area.area}
              >
                {(tematicas[area.area] || []).map(t => (
                  <Option key={t} value={t}>{t}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Temática 2</label>
              <Select
                className="w-full"
                placeholder="Seleccione temática"
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
              <label className="block text-sm font-medium mb-2">Temática 3</label>
              <Select
                className="w-full"
                placeholder="Seleccione temática"
                value={area.tematica3 || undefined}
                onChange={(value) => handleAreaChange(area.id, 'tematica3', value)}
                disabled={!area.area}
              >
                {(tematicas[area.area] || []).map(t => (
                  <Option key={t} value={t}>{t}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Modalidad *</label>
              <Select
                className="w-full"
                placeholder="Seleccione modalidad"
                value={area.modalidad || undefined}
                onChange={(value) => handleAreaChange(area.id, 'modalidad', value)}
              >
                {modalidades.map(m => (
                  <Option key={m} value={m}>{m}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Región *</label>
              <Select
                className="w-full"
                placeholder="Seleccione región"
                value={area.region || undefined}
                onChange={(value) => handleAreaChange(area.id, 'region', value)}
              >
                {regiones.map(r => (
                  <Option key={r} value={r}>{r}</Option>
                ))}
              </Select>
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

        {/* Navigation Buttons */}
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
              {currentStep === 2 ? 'Buscar Cursos' : 'Siguiente'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MiRecomendador;
