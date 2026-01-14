import React, { useState } from 'react';
import { Card, Progress, Table, Tag, Input, Select, Button, Tabs } from 'antd';
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
  Briefcase
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

const accountStatuses: AccountStatus[] = [
  {
    holding: 'Holding Empresarial S.A.',
    companies: [
      { name: 'Empresa Filial 1', balance: 15000000, trend: 5.2, invoiced: 8500000, pending: 2300000 },
      { name: 'Empresa Filial 2', balance: 8900000, trend: -2.1, invoiced: 4200000, pending: 1800000 },
    ]
  },
  {
    holding: 'Grupo Industrial del Sur',
    companies: [
      { name: 'Industria Sur Ltda.', balance: 22000000, trend: 8.5, invoiced: 12000000, pending: 3500000 },
      { name: 'Logística Sur S.A.', balance: 5600000, trend: 1.2, invoiced: 3100000, pending: 800000 },
    ]
  }
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

// Section Components
const CourseStagesSection: React.FC = () => {
  return (
    <Card title="Estado de Cursos por Etapa" className="shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {courseStages.map((stage) => (
          <div 
            key={stage.name} 
            className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {stage.icon}
              </div>
              <span className="font-medium text-sm">{stage.name}</span>
            </div>
            <div className="text-2xl font-bold mb-3">{stage.total}</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-3 h-3" /> Normal
                </span>
                <span className="font-medium">{stage.normal}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-3 h-3" /> Medio
                </span>
                <span className="font-medium">{stage.medio}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-3 h-3" /> Crítico
                </span>
                <span className="font-medium">{stage.critico}</span>
              </div>
            </div>
          </div>
        ))}
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

const AccountStatusSection: React.FC = () => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

  return (
    <Card title="Estado Cuenta Corriente por Holding y Empresa" className="shadow-sm">
      <div className="space-y-6">
        {accountStatuses.map((holding, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-lg">{holding.holding}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {holding.companies.map((company, cIdx) => (
                <div key={cIdx} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {company.name}
                    </span>
                    <span className={`flex items-center gap-1 text-sm ${company.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {company.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {company.trend > 0 ? '+' : ''}{company.trend}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Saldo</span>
                      <span className="font-semibold">{formatCurrency(company.balance)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Facturado</span>
                      <span className="font-semibold text-green-600">{formatCurrency(company.invoiced)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Pendiente</span>
                      <span className="font-semibold text-amber-600">{formatCurrency(company.pending)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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

      {/* Recent Courses */}
      <RecentCoursesSection />

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
