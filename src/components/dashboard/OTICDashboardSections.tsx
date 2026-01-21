import React, { useState, useMemo } from 'react';
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
import { useOTICFilter } from '@/context/OTICFilterContext';

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
  holdingId: string;
  companyId: string;
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
  holdingId: string;
  companyId: string;
}

// Mock Data with holdingId and companyId
const courseStagesBase = [
  { name: 'Borradores', icon: <FileText className="w-5 h-5" /> },
  { name: 'Por comunicar', icon: <Send className="w-5 h-5" /> },
  { name: 'Inscrito', icon: <CheckCircle className="w-5 h-5" /> },
  { name: 'En ejecución', icon: <Play className="w-5 h-5" /> },
  { name: 'Por emisión OC', icon: <Receipt className="w-5 h-5" /> },
  { name: 'Por liquidar', icon: <Calculator className="w-5 h-5" /> },
];

// Data per company for course stages
const courseStagesByCompany: Record<string, { total: number; normal: number; medio: number; critico: number }[]> = {
  'c1': [
    { total: 15, normal: 12, medio: 2, critico: 1 },
    { total: 8, normal: 6, medio: 1, critico: 1 },
    { total: 45, normal: 40, medio: 4, critico: 1 },
    { total: 25, normal: 20, medio: 3, critico: 2 },
    { total: 10, normal: 6, medio: 3, critico: 1 },
    { total: 18, normal: 12, medio: 4, critico: 2 },
  ],
  'c2': [
    { total: 8, normal: 6, medio: 1, critico: 1 },
    { total: 5, normal: 4, medio: 1, critico: 0 },
    { total: 30, normal: 27, medio: 2, critico: 1 },
    { total: 15, normal: 12, medio: 2, critico: 1 },
    { total: 6, normal: 4, medio: 1, critico: 1 },
    { total: 12, normal: 8, medio: 3, critico: 1 },
  ],
  'c3': [
    { total: 10, normal: 7, medio: 2, critico: 1 },
    { total: 6, normal: 4, medio: 1, critico: 1 },
    { total: 35, normal: 30, medio: 3, critico: 2 },
    { total: 20, normal: 17, medio: 2, critico: 1 },
    { total: 8, normal: 5, medio: 2, critico: 1 },
    { total: 15, normal: 10, medio: 4, critico: 1 },
  ],
  'c4': [
    { total: 12, normal: 9, medio: 2, critico: 1 },
    { total: 7, normal: 5, medio: 1, critico: 1 },
    { total: 40, normal: 36, medio: 3, critico: 1 },
    { total: 22, normal: 18, medio: 3, critico: 1 },
    { total: 9, normal: 5, medio: 3, critico: 1 },
    { total: 16, normal: 11, medio: 3, critico: 2 },
  ],
  'c5': [
    { total: 5, normal: 4, medio: 1, critico: 0 },
    { total: 3, normal: 2, medio: 1, critico: 0 },
    { total: 20, normal: 18, medio: 1, critico: 1 },
    { total: 10, normal: 8, medio: 1, critico: 1 },
    { total: 4, normal: 2, medio: 1, critico: 1 },
    { total: 8, normal: 5, medio: 2, critico: 1 },
  ],
  'c6': [
    { total: 7, normal: 5, medio: 1, critico: 1 },
    { total: 4, normal: 3, medio: 1, critico: 0 },
    { total: 25, normal: 22, medio: 2, critico: 1 },
    { total: 12, normal: 10, medio: 1, critico: 1 },
    { total: 5, normal: 3, medio: 1, critico: 1 },
    { total: 10, normal: 7, medio: 2, critico: 1 },
  ],
  'c7': [
    { total: 18, normal: 14, medio: 3, critico: 1 },
    { total: 10, normal: 7, medio: 2, critico: 1 },
    { total: 50, normal: 45, medio: 3, critico: 2 },
    { total: 28, normal: 23, medio: 4, critico: 1 },
    { total: 12, normal: 7, medio: 3, critico: 2 },
    { total: 22, normal: 15, medio: 5, critico: 2 },
  ],
  'c8': [
    { total: 14, normal: 10, medio: 3, critico: 1 },
    { total: 8, normal: 6, medio: 1, critico: 1 },
    { total: 42, normal: 38, medio: 3, critico: 1 },
    { total: 24, normal: 20, medio: 3, critico: 1 },
    { total: 10, normal: 6, medio: 3, critico: 1 },
    { total: 18, normal: 12, medio: 4, critico: 2 },
  ],
  'c9': [
    { total: 6, normal: 4, medio: 1, critico: 1 },
    { total: 4, normal: 3, medio: 1, critico: 0 },
    { total: 22, normal: 20, medio: 1, critico: 1 },
    { total: 11, normal: 9, medio: 1, critico: 1 },
    { total: 5, normal: 3, medio: 1, critico: 1 },
    { total: 9, normal: 6, medio: 2, critico: 1 },
  ],
};

const holdingToCompanies: Record<string, string[]> = {
  'h1': ['c1', 'c2', 'c3'],
  'h2': ['c4', 'c5', 'c6'],
  'h3': ['c7', 'c8', 'c9'],
};

const recentCourses: RecentCourse[] = [
  { id: '1', name: 'Excel Avanzado', client: 'Empresa ABC Ltda.', date: '2026-01-14', stage: 'Inscrito', status: 'normal', holdingId: 'h1', companyId: 'c1' },
  { id: '2', name: 'Liderazgo y Gestión', client: 'Industria Tech S.A.', date: '2026-01-13', stage: 'En ejecución', status: 'medio', holdingId: 'h1', companyId: 'c2' },
  { id: '3', name: 'Seguridad Industrial', client: 'Minera del Norte', date: '2026-01-12', stage: 'Inscrito', status: 'normal', holdingId: 'h3', companyId: 'c7' },
  { id: '4', name: 'Atención al Cliente', client: 'Retail Plus', date: '2026-01-11', stage: 'Por comunicar', status: 'critico', holdingId: 'h2', companyId: 'c4' },
  { id: '5', name: 'Python para Negocios', client: 'Comercial Express', date: '2026-01-10', stage: 'Borrador', status: 'normal', holdingId: 'h2', companyId: 'c5' },
];

const companyAccounts = [
  { id: 'c1', name: 'Empresa ABC Ltda.', rut: '76.123.456-7', balance: 15000000, trend: 5.2, invoiced: 8500000, pending: 2300000, coursesActive: 12, holdingId: 'h1' },
  { id: 'c2', name: 'Industria Tech S.A.', rut: '76.123.457-5', balance: 22000000, trend: 8.5, invoiced: 12000000, pending: 3500000, coursesActive: 18, holdingId: 'h1' },
  { id: 'c3', name: 'Manufactura Norte', rut: '76.123.458-3', balance: 8900000, trend: -2.1, invoiced: 4200000, pending: 1800000, coursesActive: 7, holdingId: 'h1' },
  { id: 'c4', name: 'Retail Plus', rut: '76.456.789-0', balance: 5600000, trend: 1.2, invoiced: 3100000, pending: 800000, coursesActive: 5, holdingId: 'h2' },
  { id: 'c5', name: 'Comercial Express', rut: '76.456.790-4', balance: 12500000, trend: 12.3, invoiced: 7800000, pending: 1200000, coursesActive: 9, holdingId: 'h2' },
  { id: 'c6', name: 'Distribuidora Sur', rut: '76.456.791-2', balance: 18700000, trend: -0.8, invoiced: 9500000, pending: 4100000, coursesActive: 14, holdingId: 'h2' },
  { id: 'c7', name: 'Minera del Norte', rut: '76.345.678-9', balance: 25000000, trend: 6.5, invoiced: 15000000, pending: 5000000, coursesActive: 20, holdingId: 'h3' },
  { id: 'c8', name: 'Minera del Centro', rut: '76.345.679-7', balance: 30000000, trend: 4.2, invoiced: 18000000, pending: 6000000, coursesActive: 25, holdingId: 'h3' },
  { id: 'c9', name: 'Exploraciones Mineras', rut: '76.345.680-0', balance: 12000000, trend: 3.1, invoiced: 7000000, pending: 2500000, coursesActive: 10, holdingId: 'h3' },
];

const pendingOCCourses: PendingCourse[] = [
  { id: '1', name: 'Gestión de Proyectos', client: 'Empresa ABC Ltda.', issue: 'Documentos incompletos', daysDelayed: 5, amount: 1200000, holdingId: 'h1', companyId: 'c1' },
  { id: '2', name: 'Normativa Laboral', client: 'Retail Plus', issue: 'Pendiente aprobación', daysDelayed: 3, amount: 850000, holdingId: 'h2', companyId: 'c4' },
  { id: '3', name: 'Excel Intermedio', client: 'Minera del Norte', issue: 'Revisión de costos', daysDelayed: 7, amount: 650000, holdingId: 'h3', companyId: 'c7' },
];

const missingRequirementsCourses: PendingCourse[] = [
  { id: '1', name: 'Soldadura Industrial', client: 'Manufactura Norte', issue: 'Certificado instructor', daysDelayed: 4, holdingId: 'h1', companyId: 'c3' },
  { id: '2', name: 'Manejo Defensivo', client: 'Comercial Express', issue: 'Licencia conducir', daysDelayed: 2, holdingId: 'h2', companyId: 'c5' },
];

const precontractPendingDocs: PendingCourse[] = [
  { id: '1', name: 'Contabilidad Básica', client: 'Distribuidora Sur', issue: 'Contrato firmado', daysDelayed: 6, holdingId: 'h2', companyId: 'c6' },
  { id: '2', name: 'Marketing Digital', client: 'Industria Tech S.A.', issue: 'Anexo técnico', daysDelayed: 3, holdingId: 'h1', companyId: 'c2' },
];

const senceDifferenceCourses: PendingCourse[] = [
  { id: '1', name: 'Inglés Empresarial', client: 'Minera del Centro', issue: 'Diferencia $45.000', daysDelayed: 8, amount: 45000, holdingId: 'h3', companyId: 'c8' },
  { id: '2', name: 'SAP Básico', client: 'Industria Tech S.A.', issue: 'Diferencia $120.000', daysDelayed: 5, amount: 120000, holdingId: 'h1', companyId: 'c2' },
];

const criticalLiquidationCourses: PendingCourse[] = [
  { id: '1', name: 'Prevención de Riesgos', client: 'Minera del Centro', issue: 'Vence en 3 días', daysDelayed: 12, amount: 2500000, holdingId: 'h3', companyId: 'c8' },
  { id: '2', name: 'Operación Grúa', client: 'Exploraciones Mineras', issue: 'Vence en 5 días', daysDelayed: 10, amount: 1800000, holdingId: 'h3', companyId: 'c9' },
];

const mdaRectificationCourses: PendingCourse[] = [
  { id: '1', name: 'Electricidad Industrial', client: 'Empresa ABC Ltda.', issue: 'MDA rechazado', daysDelayed: 4, holdingId: 'h1', companyId: 'c1' },
  { id: '2', name: 'Mecánica Automotriz', client: 'Retail Plus', issue: 'MDA observado', daysDelayed: 2, holdingId: 'h2', companyId: 'c4' },
];

const allCourses = [
  { id: '1', name: 'Excel Avanzado', client: 'Empresa ABC', otec: 'Capacita Chile', stage: 'Inscrito', status: 'normal', date: '2026-01-14', amount: 850000, holdingId: 'h1', companyId: 'c1' },
  { id: '2', name: 'Liderazgo', client: 'Industria Tech', otec: 'FormaPro', stage: 'En ejecución', status: 'medio', date: '2026-01-13', amount: 1200000, holdingId: 'h1', companyId: 'c2' },
  { id: '3', name: 'Seguridad Industrial', client: 'Minera Norte', otec: 'SafetyFirst', stage: 'Inscrito', status: 'normal', date: '2026-01-12', amount: 950000, holdingId: 'h3', companyId: 'c7' },
  { id: '4', name: 'Python Básico', client: 'Comercial Express', otec: 'CodeAcademy', stage: 'Borrador', status: 'normal', date: '2026-01-11', amount: 750000, holdingId: 'h2', companyId: 'c5' },
  { id: '5', name: 'Atención Cliente', client: 'Retail Plus', otec: 'ServicePro', stage: 'Por comunicar', status: 'critico', date: '2026-01-10', amount: 680000, holdingId: 'h2', companyId: 'c4' },
  { id: '6', name: 'Gestión Proyectos', client: 'Distribuidora Sur', otec: 'PMI Chile', stage: 'Por emisión OC', status: 'medio', date: '2026-01-09', amount: 1500000, holdingId: 'h2', companyId: 'c6' },
  { id: '7', name: 'Normativa Laboral', client: 'Manufactura Norte', otec: 'LegalTrain', stage: 'Por liquidar', status: 'normal', date: '2026-01-08', amount: 620000, holdingId: 'h1', companyId: 'c3' },
  { id: '8', name: 'Marketing Digital', client: 'Industria Tech', otec: 'DigitalPro', stage: 'En ejecución', status: 'normal', date: '2026-01-07', amount: 890000, holdingId: 'h1', companyId: 'c2' },
  { id: '9', name: 'Contabilidad', client: 'Minera Centro', otec: 'ContaFácil', stage: 'Inscrito', status: 'normal', date: '2026-01-06', amount: 720000, holdingId: 'h3', companyId: 'c8' },
  { id: '10', name: 'Inglés Negocios', client: 'Exploraciones Mineras', otec: 'EnglishPro', stage: 'En ejecución', status: 'medio', date: '2026-01-05', amount: 980000, holdingId: 'h3', companyId: 'c9' },
];

// Helper function to filter data by holding/company
const filterByHoldingCompany = <T extends { holdingId: string; companyId: string }>(
  data: T[],
  selectedHoldingId: string | null,
  selectedCompanyId: string | null
): T[] => {
  if (selectedCompanyId) {
    return data.filter(item => item.companyId === selectedCompanyId);
  }
  if (selectedHoldingId) {
    return data.filter(item => item.holdingId === selectedHoldingId);
  }
  return data;
};

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

// Section Components - CourseStagesSection is exported for use in other modules
export const CourseStagesSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<{ stage: string; status: 'normal' | 'medio' | 'critico' } | null>(null);
  const { selectedHoldingId, selectedCompanyId } = useOTICFilter();
  
  // Calculate course stages based on filter
  const courseStages = useMemo(() => {
    let companyIds: string[] = [];
    
    if (selectedCompanyId) {
      companyIds = [selectedCompanyId];
    } else if (selectedHoldingId) {
      companyIds = holdingToCompanies[selectedHoldingId] || [];
    } else {
      companyIds = Object.values(holdingToCompanies).flat();
    }

    return courseStagesBase.map((stage, stageIndex) => {
      const totals = companyIds.reduce(
        (acc, companyId) => {
          const companyData = courseStagesByCompany[companyId]?.[stageIndex];
          if (companyData) {
            acc.total += companyData.total;
            acc.normal += companyData.normal;
            acc.medio += companyData.medio;
            acc.critico += companyData.critico;
          }
          return acc;
        },
        { total: 0, normal: 0, medio: 0, critico: 0 }
      );
      
      return {
        ...stage,
        ...totals,
      };
    });
  }, [selectedHoldingId, selectedCompanyId]);

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
              {stage.total > 0 && (
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
              )}
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
            <div className="text-xl font-semibold text-green-600">{totalCourses > 0 ? Math.round((totalNormal / totalCourses) * 100) : 0}%</div>
            <div className="text-xs text-muted-foreground">Sin alertas</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-amber-600">{totalCourses > 0 ? Math.round((totalMedio / totalCourses) * 100) : 0}%</div>
            <div className="text-xs text-muted-foreground">Atención media</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600">{totalCourses > 0 ? Math.round((totalCritico / totalCourses) * 100) : 0}%</div>
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

// Financial summary data per company
const financialSummaryByCompany: Record<string, typeof financialSummaryBase> = {
  'c1': { aporteAno: 15000000, saldoDisponible: 7500000, excedentesAnoAnterior: 2000000, saldoActualExcedentes: 1400000 },
  'c2': { aporteAno: 22000000, saldoDisponible: 11000000, excedentesAnoAnterior: 3500000, saldoActualExcedentes: 2450000 },
  'c3': { aporteAno: 8900000, saldoDisponible: 4450000, excedentesAnoAnterior: 1200000, saldoActualExcedentes: 840000 },
  'c4': { aporteAno: 5600000, saldoDisponible: 2800000, excedentesAnoAnterior: 800000, saldoActualExcedentes: 560000 },
  'c5': { aporteAno: 12500000, saldoDisponible: 6250000, excedentesAnoAnterior: 1800000, saldoActualExcedentes: 1260000 },
  'c6': { aporteAno: 18700000, saldoDisponible: 9350000, excedentesAnoAnterior: 2700000, saldoActualExcedentes: 1890000 },
  'c7': { aporteAno: 25000000, saldoDisponible: 12500000, excedentesAnoAnterior: 4000000, saldoActualExcedentes: 2800000 },
  'c8': { aporteAno: 30000000, saldoDisponible: 15000000, excedentesAnoAnterior: 5000000, saldoActualExcedentes: 3500000 },
  'c9': { aporteAno: 12000000, saldoDisponible: 6000000, excedentesAnoAnterior: 1600000, saldoActualExcedentes: 1120000 },
};

const financialSummaryBase = {
  aporteAno: 85000000,
  saldoDisponible: 42500000,
  excedentesAnoAnterior: 12300000,
  saldoActualExcedentes: 8700000,
};

const AccountStatusSection: React.FC = () => {
  const { selectedHoldingId, selectedCompanyId } = useOTICFilter();
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return formatCurrency(value);
  };

  // Calculate financial summary based on filter
  const financialSummary = useMemo(() => {
    let companyIds: string[] = [];
    
    if (selectedCompanyId) {
      companyIds = [selectedCompanyId];
    } else if (selectedHoldingId) {
      companyIds = holdingToCompanies[selectedHoldingId] || [];
    } else {
      companyIds = Object.keys(financialSummaryByCompany);
    }

    return companyIds.reduce(
      (acc, companyId) => {
        const data = financialSummaryByCompany[companyId];
        if (data) {
          acc.aporteAno += data.aporteAno;
          acc.saldoDisponible += data.saldoDisponible;
          acc.excedentesAnoAnterior += data.excedentesAnoAnterior;
          acc.saldoActualExcedentes += data.saldoActualExcedentes;
        }
        return acc;
      },
      { aporteAno: 0, saldoDisponible: 0, excedentesAnoAnterior: 0, saldoActualExcedentes: 0 }
    );
  }, [selectedHoldingId, selectedCompanyId]);

  return (
    <Card title="Estado Cuenta Corriente" className="shadow-sm">
      {/* Financial Indicators Section */}
      <div className="mb-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{financialSummary.aporteAno > 0 ? ((financialSummary.saldoDisponible / financialSummary.aporteAno) * 100).toFixed(1) : 0}% del aporte</p>
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
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{financialSummary.excedentesAnoAnterior > 0 ? ((financialSummary.saldoActualExcedentes / financialSummary.excedentesAnoAnterior) * 100).toFixed(1) : 0}% restante</p>
          </div>
        </div>

      </div>
    </Card>
  );
};

type SearchType = 'idSence' | 'idInscripcion' | 'codigoSence' | 'solicitudCompra' | 'ordenCompra' | 'nombreCurso';

export const CourseSearchGrid: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('idSence');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [tipoCursoFilter, setTipoCursoFilter] = useState<string | null>(null);
  const [modalidadFilter, setModalidadFilter] = useState<string | null>(null);
  const { selectedHoldingId, selectedCompanyId } = useOTICFilter();

  const columns = [
    { title: 'ID Sence', dataIndex: 'idSence', key: 'idSence', width: 130, render: (text: string) => <span className="font-mono text-xs">{text}</span> },
    { title: 'Curso', dataIndex: 'name', key: 'name', render: (text: string) => <span className="font-medium">{text}</span> },
    { title: 'Solicitud de Compra', dataIndex: 'solicitudCompra', key: 'solicitudCompra', width: 140, render: (text: string) => <span className="font-mono text-xs">{text}</span> },
    { title: 'Orden de Compra', dataIndex: 'ordenCompra', key: 'ordenCompra', width: 130, render: (text: string) => <span className="font-mono text-xs">{text}</span> },
    { 
      title: 'Tipo de Curso', 
      dataIndex: 'tipoCurso', 
      key: 'tipoCurso',
      width: 120,
      render: (tipo: string) => {
        const colorMap: Record<string, string> = {
          'Franquicia': 'blue',
          'Costo Empresa': 'green',
          'Curso Interno': 'purple',
          'Cursos Comex': 'orange',
        };
        return <Tag color={colorMap[tipo] || 'default'}>{tipo}</Tag>;
      }
    },
    { 
      title: 'Modalidad', 
      dataIndex: 'modalidad', 
      key: 'modalidad',
      width: 100,
      render: (mod: string) => {
        const colorMap: Record<string, string> = {
          'Presencial': 'cyan',
          'E-learning': 'magenta',
          'Distancia': 'gold',
        };
        return <Tag color={colorMap[mod] || 'default'}>{mod}</Tag>;
      }
    },
    { title: 'Cliente', dataIndex: 'client', key: 'client' },
    { title: 'OTEC', dataIndex: 'otec', key: 'otec' },
    { title: 'Etapa', dataIndex: 'stage', key: 'stage', render: (stage: string) => <StageBadge stage={stage} /> },
    { title: 'Estado', dataIndex: 'status', key: 'status', render: (status: 'normal' | 'medio' | 'critico') => <StatusBadge status={status} /> },
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

  // Filter courses by holding/company first, then add IDs
  const filteredBaseCourses = useMemo(() => {
    return filterByHoldingCompany(allCourses, selectedHoldingId, selectedCompanyId);
  }, [selectedHoldingId, selectedCompanyId]);

  const tiposCurso = ['Franquicia', 'Costo Empresa', 'Curso Interno', 'Cursos Comex'];
  const modalidades = ['Presencial', 'E-learning', 'Distancia'];

  const coursesWithIds = filteredBaseCourses.map((course, index) => ({
    ...course,
    idSence: `SENCE-${2024}${String(index + 1).padStart(5, '0')}`,
    idInscripcion: `INS-${String(index + 1).padStart(6, '0')}`,
    codigoSence: `CS-${1000 + index}`,
    solicitudCompra: `SC-${2024}-${String(index + 100).padStart(4, '0')}`,
    ordenCompra: `OC-${String(index + 500).padStart(5, '0')}`,
    tipoCurso: tiposCurso[index % tiposCurso.length],
    modalidad: modalidades[index % modalidades.length],
  }));

  const handleSearch = () => {
    if (!searchValue.trim() && !tipoCursoFilter && !modalidadFilter) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    let filtered = coursesWithIds;

    // Apply text search
    if (searchValue.trim()) {
      const value = searchValue.toLowerCase();
      filtered = filtered.filter(course => {
        switch (searchType) {
          case 'idSence':
            return course.idSence.toLowerCase().includes(value);
          case 'idInscripcion':
            return course.idInscripcion.toLowerCase().includes(value);
          case 'codigoSence':
            return course.codigoSence.toLowerCase().includes(value);
          case 'solicitudCompra':
            return course.solicitudCompra.toLowerCase().includes(value);
          case 'ordenCompra':
            return course.ordenCompra.toLowerCase().includes(value);
          case 'nombreCurso':
            return course.name.toLowerCase().includes(value);
          default:
            return false;
        }
      });
    }

    // Apply filters
    if (tipoCursoFilter) {
      filtered = filtered.filter(course => course.tipoCurso === tipoCursoFilter);
    }
    if (modalidadFilter) {
      filtered = filtered.filter(course => course.modalidad === modalidadFilter);
    }

    setSearchResults(filtered);
    setHasSearched(true);
  };

  const handleClear = () => {
    setSearchValue('');
    setTipoCursoFilter(null);
    setModalidadFilter(null);
    setSearchResults([]);
    setHasSearched(false);
  };

  const searchTypeLabels: Record<SearchType, string> = {
    idSence: 'ID Sence',
    idInscripcion: 'ID de Inscripción',
    codigoSence: 'Código Sence',
    solicitudCompra: 'Solicitud de Compra',
    ordenCompra: 'Orden de Compra',
    nombreCurso: 'Nombre del Curso',
  };

  const hasActiveFilters = tipoCursoFilter || modalidadFilter;

  return (
    <Card title="Búsqueda de Cursos" className="shadow-sm">
      {/* Search and Filters - Unified Row */}
      <div className="flex flex-wrap gap-4 mb-4 p-3 bg-muted/30 rounded-lg border items-end">
        {/* Search section */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Buscar por</span>
          <Select
            value={searchType}
            onChange={(value) => {
              setSearchType(value);
              setHasSearched(false);
              setSearchResults([]);
            }}
            className="w-52"
            options={[
              { value: 'idSence', label: 'ID Sence' },
              { value: 'idInscripcion', label: 'ID de Inscripción' },
              { value: 'codigoSence', label: 'Código Sence' },
              { value: 'solicitudCompra', label: 'Solicitud de Compra' },
              { value: 'ordenCompra', label: 'Orden de Compra' },
              { value: 'nombreCurso', label: 'Nombre del Curso' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 max-w-md">
          <span className="text-xs text-muted-foreground">Valor a buscar</span>
          <Input
            placeholder={`Ingrese ${searchTypeLabels[searchType]}...`}
            prefix={<Search className="w-4 h-4 text-muted-foreground" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            className="w-full"
        />
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border hidden sm:block" />

        {/* Filters section */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Tipo de Curso</span>
          <Select
            value={tipoCursoFilter}
            onChange={(value) => setTipoCursoFilter(value)}
            className="w-40"
            allowClear
            placeholder="Todos"
            options={[
              { value: 'Franquicia', label: 'Franquicia' },
              { value: 'Costo Empresa', label: 'Costo Empresa' },
              { value: 'Curso Interno', label: 'Curso Interno' },
              { value: 'Cursos Comex', label: 'Cursos Comex' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Modalidad</span>
          <Select
            value={modalidadFilter}
            onChange={(value) => setModalidadFilter(value)}
            className="w-36"
            allowClear
            placeholder="Todas"
            options={[
              { value: 'Presencial', label: 'Presencial' },
              { value: 'E-learning', label: 'E-learning' },
              { value: 'Distancia', label: 'Distancia' },
            ]}
          />
        </div>

        {/* Action buttons */}
        <Button type="primary" icon={<Search className="w-4 h-4" />} onClick={handleSearch}>
          Buscar
        </Button>
        {(hasSearched || hasActiveFilters) && (
          <Button onClick={handleClear} icon={<RotateCcw className="w-4 h-4" />}>
            Limpiar
          </Button>
        )}
      </div>

      {/* Active filters tags */}
      {hasActiveFilters && (
        <div className="flex gap-2 items-center text-xs text-muted-foreground mb-4">
          <span>Filtros activos:</span>
          {tipoCursoFilter && <Tag color="blue" closable onClose={() => setTipoCursoFilter(null)}>{tipoCursoFilter}</Tag>}
          {modalidadFilter && <Tag color="cyan" closable onClose={() => setModalidadFilter(null)}>{modalidadFilter}</Tag>}
        </div>
      )}

      {hasSearched && (
        <div className="border-t pt-4">
          {searchResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  Se encontraron <span className="font-semibold text-foreground">{searchResults.length}</span> resultado(s)
                </span>
              </div>
              <Table 
                dataSource={searchResults} 
                columns={columns} 
                pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `Total: ${total} cursos` }}
                size="small"
                rowKey="id"
                scroll={{ x: 1200 }}
              />
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No se encontraron resultados para "{searchValue}"</p>
              <p className="text-sm">Intente con otro {searchTypeLabels[searchType]} o ajuste los filtros</p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-8 text-muted-foreground border-t">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Ingrese un valor y presione "Buscar" para ver resultados</p>
          <p className="text-xs mt-1">También puede aplicar filtros de Tipo de Curso y Modalidad</p>
        </div>
      )}
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
          <Tag color="error">{courses.length} cursos</Tag>
        </div>
      } 
      className="shadow-sm"
      size="small"
    >
      <Table 
        dataSource={courses} 
        columns={columns} 
        pagination={{ 
          pageSize: 5, 
          showSizeChanger: true, 
          showTotal: (total) => `Total: ${total} cursos`,
          size: 'small'
        }}
        size="small"
        rowKey="id"
      />
    </Card>
  );
};

// Main Component
export const OTICDashboardSections: React.FC = () => {
  const { selectedHoldingId, selectedCompanyId } = useOTICFilter();

  // Filter all pending courses based on selection
  const filteredPendingOC = useMemo(() => 
    filterByHoldingCompany(pendingOCCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredMissingReq = useMemo(() => 
    filterByHoldingCompany(missingRequirementsCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredPrecontract = useMemo(() => 
    filterByHoldingCompany(precontractPendingDocs, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredSenceDiff = useMemo(() => 
    filterByHoldingCompany(senceDifferenceCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredCriticalLiq = useMemo(() => 
    filterByHoldingCompany(criticalLiquidationCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredMdaRect = useMemo(() => 
    filterByHoldingCompany(mdaRectificationCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <Receipt className="w-4 h-4" /> Pendiente OC
          <Tag color="error">{filteredPendingOC.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos Pendientes por Emitir OC"
          icon={<Receipt className="w-5 h-5" />}
          courses={filteredPendingOC}
          iconColor="text-orange-500"
        />
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <FileWarning className="w-4 h-4" /> Requisitos
          <Tag color="warning">{filteredMissingReq.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con Requisitos Faltantes"
          icon={<FileWarning className="w-5 h-5" />}
          courses={filteredMissingReq}
          iconColor="text-amber-500"
        />
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <FileX className="w-4 h-4" /> Precontratos
          <Tag color="warning">{filteredPrecontract.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Precontratos con Documentos Pendientes"
          icon={<FileX className="w-5 h-5" />}
          courses={filteredPrecontract}
          iconColor="text-yellow-500"
        />
      ),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Diferencia SENCE
          <Tag color="error">{filteredSenceDiff.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con Diferencia en Montos SENCE"
          icon={<DollarSign className="w-5 h-5" />}
          courses={filteredSenceDiff}
          iconColor="text-red-500"
        />
      ),
    },
    {
      key: '5',
      label: (
        <span className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Críticos Liquidar
          <Tag color="error">{filteredCriticalLiq.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos Críticos por Liquidar"
          icon={<AlertCircle className="w-5 h-5" />}
          courses={filteredCriticalLiq}
          iconColor="text-red-600"
        />
      ),
    },
    {
      key: '6',
      label: (
        <span className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> MDA Pendiente
          <Tag color="warning">{filteredMdaRect.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con MDA Rectificación Pendiente"
          icon={<RotateCcw className="w-5 h-5" />}
          courses={filteredMdaRect}
          iconColor="text-purple-500"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Course Stages, Search, and Pending sections moved to Cursos y Servicios > Resumen */}

      {/* Account Status by Holding */}
      <AccountStatusSection />
    </div>
  );
};

// Export pending management tabs builder for reuse (OTIC role)
export const usePendingManagementTabs = () => {
  const { selectedHoldingId, selectedCompanyId } = useOTICFilter();

  const filteredPendingOC = useMemo(() => 
    filterByHoldingCompany(pendingOCCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredMissingReq = useMemo(() => 
    filterByHoldingCompany(missingRequirementsCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredPrecontract = useMemo(() => 
    filterByHoldingCompany(precontractPendingDocs, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredSenceDiff = useMemo(() => 
    filterByHoldingCompany(senceDifferenceCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredCriticalLiq = useMemo(() => 
    filterByHoldingCompany(criticalLiquidationCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );
  const filteredMdaRect = useMemo(() => 
    filterByHoldingCompany(mdaRectificationCourses, selectedHoldingId, selectedCompanyId), 
    [selectedHoldingId, selectedCompanyId]
  );

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <Receipt className="w-4 h-4" /> Pendiente OC
          <Tag color="error">{filteredPendingOC.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos Pendientes por Emitir OC"
          icon={<Receipt className="w-5 h-5" />}
          courses={filteredPendingOC}
          iconColor="text-orange-500"
        />
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <FileWarning className="w-4 h-4" /> Requisitos
          <Tag color="warning">{filteredMissingReq.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con Requisitos Faltantes"
          icon={<FileWarning className="w-5 h-5" />}
          courses={filteredMissingReq}
          iconColor="text-amber-500"
        />
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <FileX className="w-4 h-4" /> Precontratos
          <Tag color="warning">{filteredPrecontract.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Precontratos con Documentos Pendientes"
          icon={<FileX className="w-5 h-5" />}
          courses={filteredPrecontract}
          iconColor="text-yellow-500"
        />
      ),
    },
    {
      key: '4',
      label: (
        <span className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Diferencia SENCE
          <Tag color="error">{filteredSenceDiff.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con Diferencia en Montos SENCE"
          icon={<DollarSign className="w-5 h-5" />}
          courses={filteredSenceDiff}
          iconColor="text-red-500"
        />
      ),
    },
    {
      key: '5',
      label: (
        <span className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Críticos Liquidar
          <Tag color="error">{filteredCriticalLiq.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos Críticos por Liquidar"
          icon={<AlertCircle className="w-5 h-5" />}
          courses={filteredCriticalLiq}
          iconColor="text-red-600"
        />
      ),
    },
    {
      key: '6',
      label: (
        <span className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> MDA Pendiente
          <Tag color="warning">{filteredMdaRect.length}</Tag>
        </span>
      ),
      children: (
        <PendingCoursesSection
          title="Cursos con MDA Rectificación Pendiente"
          icon={<RotateCcw className="w-5 h-5" />}
          courses={filteredMdaRect}
          iconColor="text-purple-500"
        />
      ),
    },
  ];

  return tabItems;
};

// Mock data for EMPRESA pending documentation courses
const empresaPendingDocsCourses = [
  { id: '1', senceId: 'SC-2024-001234', name: 'Excel Avanzado', modality: 'Presencial', sc: 'SC-001', contractType: 'Precontrato', docType: 'DJP', docStatus: 'Pendiente de Carga' },
  { id: '2', senceId: 'SC-2024-001235', name: 'Liderazgo y Gestión', modality: 'E-learning', sc: 'SC-002', contractType: 'Postcontrato', docType: 'Contrato de Capacitación', docStatus: 'Pendiente de Carga' },
  { id: '3', senceId: 'NS-2024-000456', name: 'Seguridad Industrial', modality: 'Distancia', sc: 'SC-003', contractType: 'Precontrato', docType: 'DJP', docStatus: 'Pendiente de Carga' },
  { id: '4', senceId: 'SC-2024-001236', name: 'Python para Negocios', modality: 'Presencial', sc: 'SC-004', contractType: 'Postcontrato', docType: 'Contrato de Capacitación', docStatus: 'Pendiente de Carga' },
  { id: '5', senceId: 'SC-2024-001237', name: 'Atención al Cliente', modality: 'E-learning', sc: 'SC-005', contractType: 'Precontrato', docType: 'DJP', docStatus: 'Pendiente de Carga' },
];

const empresaPendingContributionCourses = [
  { id: '1', senceId: 'SC-2024-001238', name: 'Marketing Digital', sc: 'SC-006', currentAccount: 'Cuenta al Año', courseValue: 450000 },
  { id: '2', senceId: 'SC-2024-001239', name: 'Gestión de Proyectos', sc: 'SC-007', currentAccount: 'Excedente', courseValue: 780000 },
  { id: '3', senceId: 'NS-2024-000789', name: 'Inglés Empresarial', sc: 'SC-008', currentAccount: 'Cuenta Mixta', courseValue: 320000 },
  { id: '4', senceId: 'SC-2024-001240', name: 'Comunicación Efectiva', sc: 'SC-009', currentAccount: 'Reparto Año', courseValue: 550000 },
  { id: '5', senceId: 'SC-2024-001241', name: 'Trabajo en Equipo', sc: 'SC-010', currentAccount: 'Reparto Excedente', courseValue: 420000 },
];

// EMPRESA pending documentation table component
const EmpresaPendingDocsTable: React.FC = () => {
  const columns = [
    {
      title: 'ID Sence',
      dataIndex: 'senceId',
      key: 'senceId',
      width: 140,
    },
    {
      title: 'Curso',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo de Modalidad',
      dataIndex: 'modality',
      key: 'modality',
      width: 120,
      render: (modality: string) => {
        const colorMap: Record<string, string> = {
          'Presencial': 'blue',
          'E-learning': 'cyan',
          'Distancia': 'purple',
        };
        return <Tag color={colorMap[modality] || 'default'}>{modality}</Tag>;
      },
    },
    {
      title: 'SC',
      dataIndex: 'sc',
      key: 'sc',
      width: 100,
    },
    {
      title: 'Tipo de Contrato',
      dataIndex: 'contractType',
      key: 'contractType',
      width: 130,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          'Precontrato': 'orange',
          'Postcontrato': 'green',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: 'Tipo de Documento',
      dataIndex: 'docType',
      key: 'docType',
      width: 180,
      render: (docType: string) => {
        const colorMap: Record<string, string> = {
          'DJP': 'geekblue',
          'Contrato de Capacitación': 'volcano',
        };
        return <Tag color={colorMap[docType] || 'default'}>{docType}</Tag>;
      },
    },
    {
      title: 'Estado del Documento',
      dataIndex: 'docStatus',
      key: 'docStatus',
      width: 160,
      render: (status: string) => (
        <Tag color="warning">{status}</Tag>
      ),
    },
    {
      title: 'Acción',
      key: 'action',
      width: 140,
      render: () => (
        <Button type="primary" size="small" icon={<FileText className="w-3 h-3" />}>
          Subir Documento
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={empresaPendingDocsCourses}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={{ pageSize: 10, showSizeChanger: true }}
    />
  );
};

// EMPRESA pending contribution table component
const EmpresaPendingContributionTable: React.FC = () => {
  const columns = [
    {
      title: 'ID Sence',
      dataIndex: 'senceId',
      key: 'senceId',
      width: 140,
    },
    {
      title: 'Curso',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SC',
      dataIndex: 'sc',
      key: 'sc',
      width: 100,
    },
    {
      title: 'Cuenta Actual',
      dataIndex: 'currentAccount',
      key: 'currentAccount',
      width: 150,
      render: (account: string) => {
        const colorMap: Record<string, string> = {
          'Cuenta al Año': 'blue',
          'Excedente': 'green',
          'Cuenta Mixta': 'purple',
          'Reparto Año': 'orange',
          'Reparto Excedente': 'cyan',
        };
        return <Tag color={colorMap[account] || 'default'}>{account}</Tag>;
      },
    },
    {
      title: 'Valor del Curso',
      dataIndex: 'courseValue',
      key: 'courseValue',
      width: 140,
      render: (amount: number) => (
        <span className="font-medium text-orange-600">
          ${amount.toLocaleString('es-CL')}
        </span>
      ),
    },
    {
      title: 'Acción',
      key: 'action',
      width: 200,
      render: () => (
        <Button type="primary" size="small" icon={<DollarSign className="w-3 h-3" />}>
          Cambiar Cuenta de Financiamiento
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={empresaPendingContributionCourses}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={{ pageSize: 10, showSizeChanger: true }}
    />
  );
};

// Export EMPRESA pending management tabs builder
export const useEmpresaPendingManagementTabs = () => {
  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <FileWarning className="w-4 h-4" /> Cursos con Documentación Pendiente
          <Tag color="warning">{empresaPendingDocsCourses.length}</Tag>
        </span>
      ),
      children: <EmpresaPendingDocsTable />,
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Cursos con Aporte Pendiente
          <Tag color="error">{empresaPendingContributionCourses.length}</Tag>
        </span>
      ),
      children: <EmpresaPendingContributionTable />,
    },
  ];

  return tabItems;
};
