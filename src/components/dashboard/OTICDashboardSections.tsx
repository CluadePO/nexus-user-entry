import React, { useState } from 'react';
import { Card, Progress, Table, Tag, Input, Select, Button, Tabs, Tooltip } from 'antd';
import { 
  FileText, 
  Send, 
  CheckCircle, 
  Play, 
  Receipt, 
  Calculator,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Building2,
  Search,
  Eye,
  Clock,
  FileWarning,
  DollarSign,
  FileX,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  ArrowDown,
  ArrowRight,
  Minus,
  Plus
} from 'lucide-react';

// Types
interface CourseStage {
  name: string;
  icon: React.ReactNode;
  total: number;
  normal: number;
  medio: number;
  critico: number;
}

interface RecentCourse {
  id: string;
  name: string;
  client: string;
  date: string;
  stage: string;
  status: 'normal' | 'medio' | 'critico';
}

interface AccountStatus {
  holding: string;
  companies: {
    name: string;
    balance: number;
    trend: number;
    invoiced: number;
    pending: number;
  }[];
}

interface PendingCourse {
  id: string;
  name: string;
  client: string;
  issue: string;
  daysDelayed: number;
  amount?: number;
}

// Mock Data
const courseStages: CourseStage[] = [
  { name: 'Borradores', icon: <FileText className="w-5 h-5" />, total: 45, normal: 32, medio: 8, critico: 5 },
  { name: 'Por comunicar', icon: <Send className="w-5 h-5" />, total: 28, normal: 20, medio: 5, critico: 3 },
  { name: 'Inscrito', icon: <CheckCircle className="w-5 h-5" />, total: 156, normal: 140, medio: 12, critico: 4 },
  { name: 'En ejecución', icon: <Play className="w-5 h-5" />, total: 89, normal: 75, medio: 10, critico: 4 },
  { name: 'Por emisión OC', icon: <Receipt className="w-5 h-5" />, total: 34, normal: 20, medio: 9, critico: 5 },
  { name: 'Por liquidar', icon: <Calculator className="w-5 h-5" />, total: 67, normal: 45, medio: 15, critico: 7 },
];

const recentCourses: RecentCourse[] = [
  { id: '1', name: 'Excel Avanzado', client: 'Empresa ABC Ltda.', date: '2026-01-14', stage: 'Inscrito', status: 'normal' },
  { id: '2', name: 'Liderazgo y Gestión', client: 'Holding XYZ S.A.', date: '2026-01-13', stage: 'En ejecución', status: 'medio' },
  { id: '3', name: 'Seguridad Industrial', client: 'Minera del Norte', date: '2026-01-12', stage: 'Inscrito', status: 'normal' },
  { id: '4', name: 'Atención al Cliente', client: 'Retail Plus', date: '2026-01-11', stage: 'Por comunicar', status: 'critico' },
  { id: '5', name: 'Python para Negocios', client: 'Tech Solutions', date: '2026-01-10', stage: 'Borrador', status: 'normal' },
];

const companyAccounts = [
  { id: '1', name: 'Empresa ABC Ltda.', rut: '76.123.456-7', balance: 15000000, trend: 5.2, invoiced: 8500000, pending: 2300000, coursesActive: 12 },
  { id: '2', name: 'Holding XYZ S.A.', rut: '76.234.567-8', balance: 22000000, trend: 8.5, invoiced: 12000000, pending: 3500000, coursesActive: 18 },
  { id: '3', name: 'Minera del Norte', rut: '76.345.678-9', balance: 8900000, trend: -2.1, invoiced: 4200000, pending: 1800000, coursesActive: 7 },
  { id: '4', name: 'Retail Plus', rut: '76.456.789-0', balance: 5600000, trend: 1.2, invoiced: 3100000, pending: 800000, coursesActive: 5 },
  { id: '5', name: 'Tech Solutions', rut: '76.567.890-1', balance: 12500000, trend: 12.3, invoiced: 7800000, pending: 1200000, coursesActive: 9 },
  { id: '6', name: 'Constructora Sur', rut: '76.678.901-2', balance: 18700000, trend: -0.8, invoiced: 9500000, pending: 4100000, coursesActive: 14 },
];

const pendingOCCourses: PendingCourse[] = [
  { id: '1', name: 'Gestión de Proyectos', client: 'Constructora Norte', issue: 'Documentos incompletos', daysDelayed: 5, amount: 1200000 },
  { id: '2', name: 'Normativa Laboral', client: 'RRHH Solutions', issue: 'Pendiente aprobación', daysDelayed: 3, amount: 850000 },
  { id: '3', name: 'Excel Intermedio', client: 'Banco del Pacífico', issue: 'Revisión de costos', daysDelayed: 7, amount: 650000 },
];

const missingRequirementsCourses: PendingCourse[] = [
  { id: '1', name: 'Soldadura Industrial', client: 'Metalúrgica Central', issue: 'Certificado instructor', daysDelayed: 4 },
  { id: '2', name: 'Manejo Defensivo', client: 'Transportes Express', issue: 'Licencia conducir', daysDelayed: 2 },
];

const precontractPendingDocs: PendingCourse[] = [
  { id: '1', name: 'Contabilidad Básica', client: 'Pyme Asociados', issue: 'Contrato firmado', daysDelayed: 6 },
  { id: '2', name: 'Marketing Digital', client: 'Agencia Creativa', issue: 'Anexo técnico', daysDelayed: 3 },
];

const senceDifferenceCourses: PendingCourse[] = [
  { id: '1', name: 'Inglés Empresarial', client: 'Exportadora del Valle', issue: 'Diferencia $45.000', daysDelayed: 8, amount: 45000 },
  { id: '2', name: 'SAP Básico', client: 'Industria Tech', issue: 'Diferencia $120.000', daysDelayed: 5, amount: 120000 },
];

const criticalLiquidationCourses: PendingCourse[] = [
  { id: '1', name: 'Prevención de Riesgos', client: 'Minera del Centro', issue: 'Vence en 3 días', daysDelayed: 12, amount: 2500000 },
  { id: '2', name: 'Operación Grúa', client: 'Puerto Central', issue: 'Vence en 5 días', daysDelayed: 10, amount: 1800000 },
];

const mdaRectificationCourses: PendingCourse[] = [
  { id: '1', name: 'Electricidad Industrial', client: 'Energía Verde', issue: 'MDA rechazado', daysDelayed: 4 },
  { id: '2', name: 'Mecánica Automotriz', client: 'Automotora Sur', issue: 'MDA observado', daysDelayed: 2 },
];

const allCourses = [
  { id: '1', name: 'Excel Avanzado', client: 'Empresa ABC', otec: 'Capacita Chile', stage: 'Inscrito', status: 'normal', date: '2026-01-14', amount: 850000 },
  { id: '2', name: 'Liderazgo', client: 'Holding XYZ', otec: 'FormaPro', stage: 'En ejecución', status: 'medio', date: '2026-01-13', amount: 1200000 },
  { id: '3', name: 'Seguridad Industrial', client: 'Minera Norte', otec: 'SafetyFirst', stage: 'Inscrito', status: 'normal', date: '2026-01-12', amount: 950000 },
  { id: '4', name: 'Python Básico', client: 'Tech Solutions', otec: 'CodeAcademy', stage: 'Borrador', status: 'normal', date: '2026-01-11', amount: 750000 },
  { id: '5', name: 'Atención Cliente', client: 'Retail Plus', otec: 'ServicePro', stage: 'Por comunicar', status: 'critico', date: '2026-01-10', amount: 680000 },
  { id: '6', name: 'Gestión Proyectos', client: 'Constructora Sur', otec: 'PMI Chile', stage: 'Por emisión OC', status: 'medio', date: '2026-01-09', amount: 1500000 },
  { id: '7', name: 'Normativa Laboral', client: 'RRHH Corp', otec: 'LegalTrain', stage: 'Por liquidar', status: 'normal', date: '2026-01-08', amount: 620000 },
  { id: '8', name: 'Marketing Digital', client: 'Agencia Creativa', otec: 'DigitalPro', stage: 'En ejecución', status: 'normal', date: '2026-01-07', amount: 890000 },
  { id: '9', name: 'Contabilidad', client: 'Finanzas Corp', otec: 'ContaFácil', stage: 'Inscrito', status: 'normal', date: '2026-01-06', amount: 720000 },
  { id: '10', name: 'Inglés Negocios', client: 'Export Chile', otec: 'EnglishPro', stage: 'En ejecución', status: 'medio', date: '2026-01-05', amount: 980000 },
];

// Helper Components
const StatusBadge: React.FC<{ status: 'normal' | 'medio' | 'critico' }> = ({ status }) => {
  const config = {
    normal: { color: 'success', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Normal' },
    medio: { color: 'warning', icon: <AlertTriangle className="w-3 h-3" />, label: 'Medio' },
    critico: { color: 'error', icon: <AlertCircle className="w-3 h-3" />, label: 'Crítico' },
  };
  const { color, icon, label } = config[status];
  return (
    <Tag color={color} className="flex items-center gap-1 m-0">
      {icon} {label}
    </Tag>
  );
};

const StageBadge: React.FC<{ stage: string }> = ({ stage }) => {
  const colorMap: Record<string, string> = {
    'Borrador': 'default',
    'Por comunicar': 'processing',
    'Inscrito': 'cyan',
    'En ejecución': 'blue',
    'Por emisión OC': 'orange',
    'Por liquidar': 'purple',
  };
  return <Tag color={colorMap[stage] || 'default'}>{stage}</Tag>;
};

// Mock data for filtered courses by stage and status
const stageCoursesData: Record<string, { normal: any[]; medio: any[]; critico: any[] }> = {
  'Borradores': {
    normal: [
      { id: 'b1', name: 'Python Básico', client: 'Tech Solutions', otec: 'CodeAcademy', date: '2026-01-11', amount: 750000 },
      { id: 'b2', name: 'Excel Intermedio', client: 'Finanzas Corp', otec: 'OfficePro', date: '2026-01-10', amount: 520000 },
    ],
    medio: [
      { id: 'b3', name: 'SAP Fundamentos', client: 'Industria Tech', otec: 'SAPTraining', date: '2026-01-09', amount: 1200000 },
    ],
    critico: [
      { id: 'b4', name: 'Seguridad TI', client: 'Banco Central', otec: 'CyberSec', date: '2026-01-08', amount: 980000 },
    ],
  },
  'Por comunicar': {
    normal: [
      { id: 'c1', name: 'Atención al Cliente', client: 'Retail Plus', otec: 'ServicePro', date: '2026-01-10', amount: 680000 },
      { id: 'c2', name: 'Ventas B2B', client: 'Comercial Norte', otec: 'SalesMaster', date: '2026-01-09', amount: 720000 },
    ],
    medio: [
      { id: 'c3', name: 'Negociación', client: 'Import Export SA', otec: 'NegoPro', date: '2026-01-08', amount: 850000 },
    ],
    critico: [
      { id: 'c4', name: 'Comunicación Efectiva', client: 'Medios Chile', otec: 'ComSkills', date: '2026-01-07', amount: 620000 },
    ],
  },
  'Inscrito': {
    normal: [
      { id: 'i1', name: 'Excel Avanzado', client: 'Empresa ABC', otec: 'Capacita Chile', date: '2026-01-14', amount: 850000 },
      { id: 'i2', name: 'Seguridad Industrial', client: 'Minera Norte', otec: 'SafetyFirst', date: '2026-01-12', amount: 950000 },
      { id: 'i3', name: 'Contabilidad', client: 'Finanzas Corp', otec: 'ContaFácil', date: '2026-01-06', amount: 720000 },
    ],
    medio: [
      { id: 'i4', name: 'Liderazgo Básico', client: 'Grupo Sur', otec: 'LeaderPro', date: '2026-01-05', amount: 680000 },
    ],
    critico: [
      { id: 'i5', name: 'Primeros Auxilios', client: 'Hospital Central', otec: 'MediTrain', date: '2026-01-04', amount: 450000 },
    ],
  },
  'En ejecución': {
    normal: [
      { id: 'e1', name: 'Marketing Digital', client: 'Agencia Creativa', otec: 'DigitalPro', date: '2026-01-07', amount: 890000 },
      { id: 'e2', name: 'Gestión RRHH', client: 'Consultora HR', otec: 'HRMaster', date: '2026-01-06', amount: 780000 },
    ],
    medio: [
      { id: 'e3', name: 'Liderazgo', client: 'Holding XYZ', otec: 'FormaPro', date: '2026-01-13', amount: 1200000 },
      { id: 'e4', name: 'Inglés Negocios', client: 'Export Chile', otec: 'EnglishPro', date: '2026-01-05', amount: 980000 },
    ],
    critico: [
      { id: 'e5', name: 'Normativa Ambiental', client: 'Minera Sur', otec: 'EcoTrain', date: '2026-01-03', amount: 1100000 },
    ],
  },
  'Por emisión OC': {
    normal: [
      { id: 'o1', name: 'Control Calidad', client: 'Manufactura SA', otec: 'QualityPro', date: '2026-01-08', amount: 670000 },
    ],
    medio: [
      { id: 'o2', name: 'Gestión Proyectos', client: 'Constructora Sur', otec: 'PMI Chile', date: '2026-01-09', amount: 1500000 },
      { id: 'o3', name: 'Logística', client: 'Transportes Express', otec: 'LogisTrain', date: '2026-01-07', amount: 820000 },
    ],
    critico: [
      { id: 'o4', name: 'Auditoría Interna', client: 'Banco Pacífico', otec: 'AuditPro', date: '2026-01-06', amount: 1350000 },
    ],
  },
  'Por liquidar': {
    normal: [
      { id: 'l1', name: 'Normativa Laboral', client: 'RRHH Corp', otec: 'LegalTrain', date: '2026-01-08', amount: 620000 },
      { id: 'l2', name: 'Prevención Riesgos', client: 'Industria Norte', otec: 'SafetyPro', date: '2026-01-07', amount: 780000 },
    ],
    medio: [
      { id: 'l3', name: 'Soldadura Avanzada', client: 'Metalúrgica Central', otec: 'WeldMaster', date: '2026-01-06', amount: 950000 },
    ],
    critico: [
      { id: 'l4', name: 'Operación Grúa', client: 'Puerto Central', otec: 'HeavyLift', date: '2026-01-05', amount: 1800000 },
      { id: 'l5', name: 'Manejo Sustancias', client: 'Química Sur', otec: 'ChemSafe', date: '2026-01-04', amount: 1100000 },
    ],
  },
};

// Section Components
const CourseStagesSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<{ stage: string; status: 'normal' | 'medio' | 'critico' } | null>(null);
  
  const totalCourses = courseStages.reduce((acc, stage) => acc + stage.total, 0);
  const totalNormal = courseStages.reduce((acc, stage) => acc + stage.normal, 0);
  const totalMedio = courseStages.reduce((acc, stage) => acc + stage.medio, 0);
  const totalCritico = courseStages.reduce((acc, stage) => acc + stage.critico, 0);

  const handleBarClick = (stageName: string, status: 'normal' | 'medio' | 'critico') => {
    if (selectedFilter?.stage === stageName && selectedFilter?.status === status) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter({ stage: stageName, status });
    }
  };

  const getFilteredCourses = () => {
    if (!selectedFilter) return [];
    const stageData = stageCoursesData[selectedFilter.stage];
    if (!stageData) return [];
    return stageData[selectedFilter.status] || [];
  };

  const filteredCourses = getFilteredCourses();

  const detailColumns = [
    { title: 'Curso', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
    { title: 'Cliente', dataIndex: 'client', key: 'client' },
    { title: 'OTEC', dataIndex: 'otec', key: 'otec' },
    { title: 'Fecha', dataIndex: 'date', key: 'date' },
    { 
      title: 'Monto', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (amount: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
    },
    { 
      title: '', 
      key: 'action', 
      render: () => (
        <Button type="primary" size="small" icon={<Eye className="w-4 h-4" />}>
          Detalle
        </Button>
      )
    },
  ];

  const statusLabels = {
    normal: { label: 'Normal', color: 'text-green-600', bg: 'bg-green-500' },
    medio: { label: 'Medio', color: 'text-amber-600', bg: 'bg-amber-500' },
    critico: { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-500' },
  };

  return (
    <Card 
      title={
        <div className="flex items-center justify-between w-full">
          <span>Estado de Cursos por Etapa</span>
          <div className="flex items-center gap-4 text-sm font-normal">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Normal: {totalNormal}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              Medio: {totalMedio}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Crítico: {totalCritico}
            </span>
          </div>
        </div>
      } 
      className="shadow-sm"
    >
      {/* Pipeline visual */}
      <div className="flex items-stretch gap-1 mb-6">
        {courseStages.map((stage, index) => (
          <div 
            key={stage.name}
            className="flex-1 relative group"
          >
            {/* Stage card */}
            <div className={`bg-gradient-to-b from-muted/50 to-muted/30 rounded-lg p-4 border transition-all h-full ${
              selectedFilter?.stage === stage.name 
                ? 'border-primary shadow-md ring-2 ring-primary/20' 
                : 'border-muted hover:border-primary/30 hover:shadow-md'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  {stage.icon}
                </div>
              </div>
              <h4 className="text-center font-medium text-sm mb-2 text-foreground">{stage.name}</h4>
              
              {/* Total */}
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-primary">{stage.total}</span>
                <span className="text-xs text-muted-foreground block mt-1">cursos</span>
              </div>

              {/* Status breakdown - stacked bars with tooltips and click */}
              <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                <Tooltip title={`Normal: ${stage.normal} cursos - Clic para ver detalle`} placement="top">
                  <div 
                    className={`bg-green-500 h-full transition-all cursor-pointer ${
                      selectedFilter?.stage === stage.name && selectedFilter?.status === 'normal'
                        ? 'ring-2 ring-green-700 ring-offset-1'
                        : 'hover:opacity-80'
                    }`}
                    style={{ width: `${(stage.normal / stage.total) * 100}%` }}
                    onClick={() => handleBarClick(stage.name, 'normal')}
                  />
                </Tooltip>
                <Tooltip title={`Medio: ${stage.medio} cursos - Clic para ver detalle`} placement="top">
                  <div 
                    className={`bg-amber-500 h-full transition-all cursor-pointer ${
                      selectedFilter?.stage === stage.name && selectedFilter?.status === 'medio'
                        ? 'ring-2 ring-amber-700 ring-offset-1'
                        : 'hover:opacity-80'
                    }`}
                    style={{ width: `${(stage.medio / stage.total) * 100}%` }}
                    onClick={() => handleBarClick(stage.name, 'medio')}
                  />
                </Tooltip>
                <Tooltip title={`Crítico: ${stage.critico} cursos - Clic para ver detalle`} placement="top">
                  <div 
                    className={`bg-red-500 h-full transition-all cursor-pointer ${
                      selectedFilter?.stage === stage.name && selectedFilter?.status === 'critico'
                        ? 'ring-2 ring-red-700 ring-offset-1'
                        : 'hover:opacity-80'
                    }`}
                    style={{ width: `${(stage.critico / stage.total) * 100}%` }}
                    onClick={() => handleBarClick(stage.name, 'critico')}
                  />
                </Tooltip>
              </div>
            </div>

            {/* Arrow connector */}
            {index < courseStages.length - 1 && (
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 text-muted-foreground/40">
                <svg width="12" height="24" viewBox="0 0 12 24" fill="currentColor">
                  <path d="M0 0 L12 12 L0 24 Z" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dynamic detail grid */}
      {selectedFilter && (
        <div className="mb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-muted/30 rounded-lg p-4 border border-muted">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${statusLabels[selectedFilter.status].bg}`}></span>
                <h4 className="font-semibold">
                  {selectedFilter.stage} - <span className={statusLabels[selectedFilter.status].color}>{statusLabels[selectedFilter.status].label}</span>
                </h4>
                <Tag color={selectedFilter.status === 'normal' ? 'success' : selectedFilter.status === 'medio' ? 'warning' : 'error'}>
                  {filteredCourses.length} cursos
                </Tag>
              </div>
              <Button 
                type="text" 
                size="small" 
                onClick={() => setSelectedFilter(null)}
                icon={<AlertCircle className="w-4 h-4 rotate-45" />}
              >
                Cerrar
              </Button>
            </div>
            <Table 
              dataSource={filteredCourses}
              columns={detailColumns}
              pagination={false}
              size="small"
              rowKey="id"
              locale={{ emptyText: 'No hay cursos en esta categoría' }}
            />
          </div>
        </div>
      )}

      {/* Summary row */}
      <div className="bg-muted/20 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-2xl font-bold">{totalCourses}</span>
            <span className="text-muted-foreground ml-2">cursos en total</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-green-600">{Math.round((totalNormal / totalCourses) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Sin alertas</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-amber-600">{Math.round((totalMedio / totalCourses) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Atención media</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600">{Math.round((totalCritico / totalCourses) * 100)}%</div>
            <div className="text-xs text-muted-foreground">Requieren acción</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const RecentCoursesSection: React.FC = () => {
  const columns = [
    { title: 'Curso', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
    { title: 'Cliente', dataIndex: 'client', key: 'client', render: (text: string) => (
      <span className="flex items-center gap-1"><Building2 className="w-4 h-4 text-muted-foreground" /> {text}</span>
    )},
    { title: 'Fecha', dataIndex: 'date', key: 'date' },
    { title: 'Etapa', dataIndex: 'stage', key: 'stage', render: (stage: string) => <StageBadge stage={stage} /> },
    { title: 'Estado', dataIndex: 'status', key: 'status', render: (status: 'normal' | 'medio' | 'critico') => <StatusBadge status={status} /> },
    { 
      title: 'Acción', 
      key: 'action', 
      render: () => (
        <Button type="link" size="small" icon={<Eye className="w-4 h-4" />}>
          Ver detalle
        </Button>
      )
    },
  ];

  return (
    <Card title="Últimos Cursos Inscritos" className="shadow-sm">
      <Table 
        dataSource={recentCourses} 
        columns={columns} 
        pagination={false}
        size="small"
        rowKey="id"
      />
    </Card>
  );
};

// Financial summary data
const financialSummary = {
  aporteAno: 85000000,
  saldoDisponible: 42500000,
  excedentesAnoAnterior: 12300000,
  saldoActualExcedentes: 8700000,
  usado: 42500000,
  comprometido: 15800000,
};

const AccountStatusSection: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return formatCurrency(value);
  };

  const filteredCompanies = companyAccounts.filter(company =>
    company.name.toLowerCase().includes(searchText.toLowerCase()) ||
    company.rut.includes(searchText)
  );

  // Calculate percentages for the waterfall chart
  const totalFranquicia = financialSummary.aporteAno + financialSummary.excedentesAnoAnterior;
  const usadoPct = (financialSummary.usado / totalFranquicia) * 100;
  const comprometidoPct = (financialSummary.comprometido / totalFranquicia) * 100;
  const disponiblePct = (financialSummary.saldoDisponible / totalFranquicia) * 100;
  const excedentesRestantesPct = (financialSummary.saldoActualExcedentes / totalFranquicia) * 100;

  const columns = [
    { 
      title: 'Empresa', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text: string, record: any) => (
        <div>
          <span className="font-medium flex items-center gap-1">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            {text}
          </span>
          <span className="text-xs text-muted-foreground">{record.rut}</span>
        </div>
      )
    },
    { 
      title: 'Saldo', 
      dataIndex: 'balance', 
      key: 'balance',
      render: (value: number) => <span className="font-semibold">{formatCurrency(value)}</span>
    },
    { 
      title: 'Facturado', 
      dataIndex: 'invoiced', 
      key: 'invoiced',
      render: (value: number) => <span className="font-semibold text-green-600">{formatCurrency(value)}</span>
    },
    { 
      title: 'Pendiente', 
      dataIndex: 'pending', 
      key: 'pending',
      render: (value: number) => <span className="font-semibold text-amber-600">{formatCurrency(value)}</span>
    },
    { 
      title: 'Cursos Activos', 
      dataIndex: 'coursesActive', 
      key: 'coursesActive',
      render: (value: number) => <Tag color="blue">{value} cursos</Tag>
    },
    { 
      title: 'Tendencia', 
      dataIndex: 'trend', 
      key: 'trend',
      render: (trend: number) => (
        <span className={`flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )
    },
    { 
      title: '', 
      key: 'action', 
      render: () => (
        <Button type="primary" size="small" icon={<Eye className="w-4 h-4" />}>
          Detalle
        </Button>
      )
    },
  ];

  return (
    <Card title="Estado Cuenta Corriente por Empresa" className="shadow-sm">
      {/* Financial Indicators Section */}
      <div className="mb-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Aporte del Año</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrencyShort(financialSummary.aporteAno)}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Franquicia tributaria 2026</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">Saldo Disponible</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrencyShort(financialSummary.saldoDisponible)}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{((financialSummary.saldoDisponible / financialSummary.aporteAno) * 100).toFixed(1)}% del aporte</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">Excedentes Año Anterior</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatCurrencyShort(financialSummary.excedentesAnoAnterior)}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Acumulado 2025</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">Saldo Actual Excedentes</span>
            </div>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{formatCurrencyShort(financialSummary.saldoActualExcedentes)}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{((financialSummary.saldoActualExcedentes / financialSummary.excedentesAnoAnterior) * 100).toFixed(1)}% restante</p>
          </div>
        </div>
      </div>
      {/* Company Table */}
      <div className="border-t pt-6">
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          Detalle por Empresa
        </h4>
        <div className="mb-4">
          <Input
            placeholder="Buscar por empresa o RUT..."
            prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-72"
          />
        </div>
        <Table 
          dataSource={filteredCompanies}
          columns={columns}
          pagination={{ pageSize: 5 }}
          size="small"
          rowKey="id"
        />
      </div>
    </Card>
  );
};

const CourseSearchGrid: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const columns = [
    { title: 'Curso', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
    { title: 'Cliente', dataIndex: 'client', key: 'client' },
    { title: 'OTEC', dataIndex: 'otec', key: 'otec' },
    { title: 'Etapa', dataIndex: 'stage', key: 'stage', render: (stage: string) => <StageBadge stage={stage} /> },
    { title: 'Estado', dataIndex: 'status', key: 'status', render: (status: 'normal' | 'medio' | 'critico') => <StatusBadge status={status} /> },
    { title: 'Fecha', dataIndex: 'date', key: 'date' },
    { 
      title: 'Monto', 
      dataIndex: 'amount', 
      key: 'amount',
      render: (amount: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
    },
    { 
      title: '', 
      key: 'action', 
      render: () => (
        <Button type="primary" size="small" icon={<Eye className="w-4 h-4" />}>
          Detalle
        </Button>
      )
    },
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          course.client.toLowerCase().includes(searchText.toLowerCase()) ||
                          course.otec.toLowerCase().includes(searchText.toLowerCase());
    const matchesStage = !stageFilter || course.stage === stageFilter;
    const matchesStatus = !statusFilter || course.status === statusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  return (
    <Card title="Búsqueda de Cursos" className="shadow-sm">
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Buscar por curso, cliente u OTEC..."
          prefix={<Search className="w-4 h-4 text-muted-foreground" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />
        <Select
          placeholder="Filtrar por etapa"
          allowClear
          value={stageFilter || undefined}
          onChange={(value) => setStageFilter(value || '')}
          className="w-48"
          options={[
            { value: 'Borrador', label: 'Borrador' },
            { value: 'Por comunicar', label: 'Por comunicar' },
            { value: 'Inscrito', label: 'Inscrito' },
            { value: 'En ejecución', label: 'En ejecución' },
            { value: 'Por emisión OC', label: 'Por emisión OC' },
            { value: 'Por liquidar', label: 'Por liquidar' },
          ]}
        />
        <Select
          placeholder="Filtrar por estado"
          allowClear
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value || '')}
          className="w-40"
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'medio', label: 'Medio' },
            { value: 'critico', label: 'Crítico' },
          ]}
        />
      </div>
      <Table 
        dataSource={filteredCourses} 
        columns={columns} 
        pagination={{ pageSize: 10 }}
        size="small"
        rowKey="id"
      />
    </Card>
  );
};

const PendingCoursesSection: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  courses: PendingCourse[];
  iconColor: string;
}> = ({ title, icon, courses, iconColor }) => {
  const columns = [
    { title: 'Curso', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
    { title: 'Cliente', dataIndex: 'client', key: 'client' },
    { title: 'Problema', dataIndex: 'issue', key: 'issue', render: (text: string) => <Tag color="warning">{text}</Tag> },
    { 
      title: 'Días', 
      dataIndex: 'daysDelayed', 
      key: 'daysDelayed',
      render: (days: number) => (
        <span className={`flex items-center gap-1 ${days > 5 ? 'text-red-600' : 'text-amber-600'}`}>
          <Clock className="w-4 h-4" /> {days} días
        </span>
      )
    },
    { 
      title: '', 
      key: 'action', 
      render: () => (
        <Button type="link" size="small" icon={<Eye className="w-4 h-4" />}>
          Ver
        </Button>
      )
    },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <span className={iconColor}>{icon}</span>
          <span>{title}</span>
          <Tag color="error">{courses.length}</Tag>
        </div>
      } 
      className="shadow-sm"
      size="small"
    >
      <Table 
        dataSource={courses} 
        columns={columns} 
        pagination={false}
        size="small"
        rowKey="id"
      />
    </Card>
  );
};

// Main Component
export const OTICDashboardSections: React.FC = () => {
  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <Receipt className="w-4 h-4" /> Pendiente OC
          <Tag color="error">{pendingOCCourses.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos Pendientes por Emitir OC"
          icon={<Receipt className="w-5 h-5" />}
          courses={pendingOCCourses}
          iconColor="text-orange-500"
        />
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <FileWarning className="w-4 h-4" /> Requisitos
          <Tag color="warning">{missingRequirementsCourses.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con Requisitos Faltantes"
          icon={<FileWarning className="w-5 h-5" />}
          courses={missingRequirementsCourses}
          iconColor="text-amber-500"
        />
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <FileX className="w-4 h-4" /> Precontratos
          <Tag color="warning">{precontractPendingDocs.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Precontratos con Documentos Pendientes"
          icon={<FileX className="w-5 h-5" />}
          courses={precontractPendingDocs}
          iconColor="text-yellow-500"
        />
      ),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Diferencia SENCE
          <Tag color="error">{senceDifferenceCourses.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con Diferencia en Montos SENCE"
          icon={<DollarSign className="w-5 h-5" />}
          courses={senceDifferenceCourses}
          iconColor="text-red-500"
        />
      ),
    },
    {
      key: '5',
      label: (
        <span className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Críticos Liquidar
          <Tag color="error">{criticalLiquidationCourses.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos Críticos por Liquidar"
          icon={<AlertCircle className="w-5 h-5" />}
          courses={criticalLiquidationCourses}
          iconColor="text-red-600"
        />
      ),
    },
    {
      key: '6',
      label: (
        <span className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> MDA Pendiente
          <Tag color="warning">{mdaRectificationCourses.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con MDA Rectificación Pendiente"
          icon={<RotateCcw className="w-5 h-5" />}
          courses={mdaRectificationCourses}
          iconColor="text-purple-500"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Course Stages with Status */}
      <CourseStagesSection />

      {/* Account Status by Holding */}
      <AccountStatusSection />

      {/* Course Search Grid */}
      <CourseSearchGrid />

      {/* Pending Issues Tabs */}
      <Card title="Gestión de Pendientes" className="shadow-sm">
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};
