import React, { useEffect, useMemo, useState } from 'react';
import { Button, Tabs, Select, Input, Table, Tooltip, Popconfirm, Pagination, Modal, message, DatePicker, Segmented } from 'antd';
import {
  Plus,
  ClipboardText,
  Note,
  UserPlus,
  Buildings,
  MagnifyingGlass,
  Trash,
  Warning,
  FileCsv,
  FileXls,
  FilePdf,
  Eye,
  Star,
  GearSix,
  PaperPlaneTilt,
  CheckCircle,
  Columns,
  BookOpen,
  WifiHigh,
  Users,
  FloppyDisk,
  CheckSquare,
  UserMinus,
  ProhibitInset,
  UserFocus,
  UserCircle,
  EnvelopeSimple,
  PencilSimple,
  Info,
} from '@phosphor-icons/react';
import { Switch, Checkbox } from 'antd';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useOTICFilter } from '@/context/OTICFilterContext';
import { EncuestaEmailContent } from '@/components/encuestas/EncuestaEmailContent';

interface EvalRow {
  inscripcion: number;
  sc: number | null;
  sencenet: number | null;
  curso: string;
  encuesta: string;
  tipologia: 'Satisfacción' | 'Transferencia';
  tipoCarga: 'On-line' | 'Presencial';
  participantes: number;
  contestadas: number;
}

// Datasets keyed by navbar company id (c1..c9)
const DATA_BY_COMPANY: Record<string, EvalRow[]> = {
  c1: [
    { inscripcion: 999425, sc: null, sencenet: null, curso: 'PRIMEROS AUXILIOS PSICOLÓGICOS', encuesta: 'Encuesta de Satisfacción Presencial, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1002086, sc: null, sencenet: null, curso: 'PRIMEROS AUXILIOS PSICOLÓGICOS', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1053537, sc: null, sencenet: null, curso: 'INDUCCIÓN ONLINE A NUEVOS DOCENTES INACAP', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1312841, sc: 6126028, sencenet: null, curso: 'TECNICAS DE FORMACION SCRUM PRODUCT OWNER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 6, contestadas: 0 },
    { inscripcion: 1313657, sc: 6126666, sencenet: null, curso: 'TÉCNICAS DE FORMACIÓN DE SCRUM MASTER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 12, contestadas: 0 },
    { inscripcion: 1313660, sc: 6126668, sencenet: null, curso: 'TÉCNICAS DE FORMACIÓN DE SCRUM MASTER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 11, contestadas: 0 },
    { inscripcion: 1314255, sc: 6126745, sencenet: null, curso: 'TÉCNICAS DE FORMACIÓN DE SCRUM MASTER', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 0 },
    { inscripcion: 1315174, sc: 6128556, sencenet: null, curso: 'GESTIÓN DEL CAMBIO ORGANIZACIONAL', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 5, contestadas: 0 },
    { inscripcion: 1351083, sc: 6141927, sencenet: null, curso: 'TÉCNICAS DEL ACCOUNTABILITY PARA PLANIFICAR LA GESTIÓN LABORAL', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 9, contestadas: 1 },
    { inscripcion: 1362961, sc: 6153142, sencenet: null, curso: 'APLICACIÓN DE TECNICAS DE COMUNICACION', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 15, contestadas: 0 },
    { inscripcion: 1397770, sc: null, sencenet: null, curso: 'CONOCIENDO INACAP: NUESTRA INSTITUCIÓN', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 465, contestadas: 1 },
    { inscripcion: 1397794, sc: null, sencenet: null, curso: 'CONOCIENDO INACAP: MODELO EDUCATIVO', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 210, contestadas: 2 },
    { inscripcion: 1397797, sc: null, sencenet: null, curso: 'CONOCIENDO INACAP: FOCO EN EL ESTUDIANTE', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 503, contestadas: 7 },
    { inscripcion: 1397920, sc: 6276769, sencenet: null, curso: 'CLAVES DE TRABAJO EN EQUIPOS DE ALTO DESEMPEÑO', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 1, contestadas: 1 },
    { inscripcion: 1397927, sc: 6294577, sencenet: null, curso: 'TÉCNICAS DE COACHING', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 1, contestadas: 1 },
  ],
  c2: [
    { inscripcion: 1401234, sc: 6300001, sencenet: null, curso: 'LIDERAZGO Y GESTIÓN DE EQUIPOS', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 20, contestadas: 15 },
    { inscripcion: 1401235, sc: 6300002, sencenet: null, curso: 'COMUNICACIÓN EFECTIVA EN EL TRABAJO', encuesta: 'Encuesta de Transferencia, INACAP', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 18, contestadas: 10 },
    { inscripcion: 1401236, sc: null, sencenet: null, curso: 'GESTIÓN DEL TIEMPO', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 30, contestadas: 25 },
    { inscripcion: 1401237, sc: 6300004, sencenet: null, curso: 'TRABAJO EN EQUIPO', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 12, contestadas: 0 },
    { inscripcion: 1401238, sc: null, sencenet: null, curso: 'RESOLUCIÓN DE CONFLICTOS', encuesta: 'Encuesta de Transferencia, INACAP', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 8, contestadas: 4 },
  ],
  c3: [
    { inscripcion: 1501001, sc: null, sencenet: null, curso: 'FUNDAMENTOS DE PROGRAMACIÓN', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 45, contestadas: 40 },
    { inscripcion: 1501002, sc: 6400001, sencenet: null, curso: 'BASE DE DATOS RELACIONALES', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 32, contestadas: 16 },
    { inscripcion: 1501003, sc: null, sencenet: null, curso: 'DESARROLLO WEB FRONTEND', encuesta: 'Encuesta de Transferencia, INACAP', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 28, contestadas: 0 },
    { inscripcion: 1501004, sc: 6400003, sencenet: null, curso: 'SEGURIDAD INFORMÁTICA BÁSICA', encuesta: 'Encuesta de Satisfacción Asincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 15, contestadas: 3 },
    { inscripcion: 1501005, sc: null, sencenet: null, curso: 'INTRODUCCIÓN A LA INTELIGENCIA ARTIFICIAL', encuesta: 'Encuesta de Satisfacción Sincrónica, INACAP', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 50, contestadas: 48 },
  ],
  c4: [
    { inscripcion: 2001001, sc: 7100001, sencenet: null, curso: 'SEGURIDAD INDUSTRIAL BÁSICA', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 25, contestadas: 20 },
    { inscripcion: 2001002, sc: null, sencenet: null, curso: 'MANEJO DE MAQUINARIA PESADA', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 10, contestadas: 5 },
    { inscripcion: 2001003, sc: 7100003, sencenet: null, curso: 'PRIMEROS AUXILIOS INDUSTRIAL', encuesta: 'Encuesta de Satisfacción Asincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 40, contestadas: 0 },
    { inscripcion: 2001004, sc: null, sencenet: null, curso: 'TRABAJO EN ALTURA', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 15, contestadas: 8 },
    { inscripcion: 2001005, sc: 7100005, sencenet: null, curso: 'GESTIÓN AMBIENTAL BÁSICA', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 20, contestadas: 18 },
  ],
  c5: [
    { inscripcion: 2101001, sc: null, sencenet: null, curso: 'BUENAS PRÁCTICAS DE MANUFACTURA', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 30, contestadas: 28 },
    { inscripcion: 2101002, sc: 7200002, sencenet: null, curso: 'CONTROL DE CALIDAD EN PROCESOS', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 12, contestadas: 6 },
    { inscripcion: 2101003, sc: null, sencenet: null, curso: 'SEGURIDAD ALIMENTARIA', encuesta: 'Encuesta de Satisfacción Asincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 22, contestadas: 0 },
    { inscripcion: 2101004, sc: 7200004, sencenet: null, curso: 'HIGIENE INDUSTRIAL', encuesta: 'Encuesta de Satisfacción Sincrónica, IANSA', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 18, contestadas: 9 },
    { inscripcion: 2101005, sc: null, sencenet: null, curso: 'MANEJO DE RESIDUOS INDUSTRIALES', encuesta: 'Encuesta de Transferencia, IANSA', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 8, contestadas: 7 },
  ],
  c7: [
    { inscripcion: 3001001, sc: 8100001, sencenet: null, curso: 'SEGURIDAD EN OBRAS DE CONSTRUCCIÓN', encuesta: 'Encuesta de Satisfacción Sincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 35, contestadas: 30 },
    { inscripcion: 3001002, sc: null, sencenet: null, curso: 'LECTURA DE PLANOS', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 15, contestadas: 0 },
    { inscripcion: 3001003, sc: 8100003, sencenet: null, curso: 'PREVENCIÓN DE RIESGOS EN FAENA', encuesta: 'Encuesta de Satisfacción Asincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 28, contestadas: 14 },
    { inscripcion: 3001004, sc: null, sencenet: null, curso: 'USO DE EPP', encuesta: 'Encuesta de Satisfacción Sincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 40, contestadas: 38 },
    { inscripcion: 3001005, sc: 8100005, sencenet: null, curso: 'GESTIÓN DE OBRAS', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 10, contestadas: 5 },
  ],
  c8: [
    { inscripcion: 3101001, sc: null, sencenet: null, curso: 'INSTALACIONES ELÉCTRICAS BÁSICAS', encuesta: 'Encuesta de Satisfacción Asincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 20, contestadas: 20 },
    { inscripcion: 3101002, sc: 8200002, sencenet: null, curso: 'SOLDADURA BÁSICA', encuesta: 'Encuesta de Satisfacción Sincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'Presencial', participantes: 12, contestadas: 0 },
    { inscripcion: 3101003, sc: null, sencenet: null, curso: 'ALBAÑILERÍA BÁSICA', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'Presencial', participantes: 8, contestadas: 4 },
    { inscripcion: 3101004, sc: 8200004, sencenet: null, curso: 'GASFITERÍA BÁSICA', encuesta: 'Encuesta de Satisfacción Asincrónica, C. Norte', tipologia: 'Satisfacción', tipoCarga: 'On-line', participantes: 16, contestadas: 8 },
    { inscripcion: 3101005, sc: null, sencenet: null, curso: 'PINTURA Y REVESTIMIENTOS', encuesta: 'Encuesta de Transferencia, C. Norte', tipologia: 'Transferencia', tipoCarga: 'On-line', participantes: 6, contestadas: 3 },
  ],
};

type TipoFilter = 'all' | 'Satisfacción' | 'Transferencia';

const getPctColor = (pct: number) => {
  if (pct === 0) return '#EF4444';
  if (pct <= 50) return '#F59E0B';
  if (pct <= 99) return '#3B82F6';
  return '#10B981';
};

const slug = (s: string) =>
  (s || 'todos')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const todayStr = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
};

const ProgressCell: React.FC<{ contestadas: number; participantes: number }> = ({ contestadas, participantes }) => {
  const pct = participantes === 0 ? null : Math.round((contestadas / participantes) * 100);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    setAnimPct(0);
    const t = window.setTimeout(() => setAnimPct(pct ?? 0), 50);
    return () => window.clearTimeout(t);
  }, [pct]);

  if (pct === null) {
    return <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>—</span>;
  }
  const color = getPctColor(pct);
  return (
    <Tooltip title={`${contestadas} de ${participantes} participantes han respondido (${pct}%)`}>
      <div className="flex flex-col items-center gap-1">
        <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color }}>{pct}%</span>
        <div style={{ width: 80, height: 6, background: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              width: `${animPct}%`,
              height: '100%',
              background: color,
              borderRadius: 999,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>
    </Tooltip>
  );
};

// ============================================================
// Administrar Encuestas Tab
// ============================================================
type EncuestaTipo = 'Satisfacción' | 'Transferencia';
interface EncuestaRow {
  id: number;
  nombre: string;
  origen: string;
  cliente: string;
  tipo: EncuestaTipo;
  version: number;
  vigente: 'Si' | 'No';
}

const ENCUESTAS_BY_COMPANY: Record<string, EncuestaRow[]> = {
  // INACAP + Corporación Instituto Profesional INACAP
  c1: [
    { id: 1015, nombre: 'Encuesta de Satisfacción, CAPACITA (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 1028, nombre: 'Encuesta de Satisfacción, INACAP (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 1052, nombre: 'Encuesta de Satisfacción, INACAP III Relatores (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 1053, nombre: 'Encuesta de Satisfacción, INACAP IV Relatores (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 1054, nombre: 'Encuesta de Satisfacción, INACAP II Relatores (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 1093, nombre: 'Encuesta de Satisfacción, WTCS (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 3731, nombre: 'Encuesta de transferencia al puesto de trabajo, INACAP (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Transferencia', version: 1, vigente: 'No' },
    { id: 3848, nombre: 'Encuesta de Satisfacción Presencial, INACAP (ver.2)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 2, vigente: 'No' },
    { id: 3853, nombre: 'Encuesta de Satisfacción Sincrónica, INACAP (ver.2)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 2, vigente: 'No' },
    { id: 4303, nombre: 'Encuesta de Satisfacción Sincrónica, INACAP (ver.6)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 6, vigente: 'No' },
    { id: 4484, nombre: 'Encuesta de Transferencia Estándar v2.0 (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Transferencia', version: 1, vigente: 'Si' },
    { id: 4728, nombre: 'Encuesta de Satisfacción Estándar v2.0 (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'Si' },
  ],
  // INACAP + Instituto Nacional de Capacitación Profesional
  c2: [
    { id: 2001, nombre: 'Encuesta de Satisfacción Básica INACAP (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 2002, nombre: 'Encuesta de Transferencia INACAP Estándar (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Transferencia', version: 1, vigente: 'No' },
    { id: 2003, nombre: 'Encuesta de Satisfacción Presencial INACAP (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 2004, nombre: 'Encuesta de Satisfacción Presencial INACAP (ver.2)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 2, vigente: 'No' },
    { id: 2005, nombre: 'Encuesta de Satisfacción On-line INACAP (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 2006, nombre: 'Encuesta de Satisfacción On-line INACAP (ver.2)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 2, vigente: 'Si' },
    { id: 2007, nombre: 'Encuesta de Transferencia Jefaturas INACAP (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Transferencia', version: 1, vigente: 'Si' },
  ],
  // INACAP + Universidad Tecnológica de Chile INACAP
  c3: [
    { id: 3001, nombre: 'Encuesta de Satisfacción UTEM (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 3002, nombre: 'Encuesta de Satisfacción UTEM (ver.2)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 2, vigente: 'No' },
    { id: 3003, nombre: 'Encuesta de Satisfacción UTEM (ver.3)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 3, vigente: 'No' },
    { id: 3004, nombre: 'Encuesta de Transferencia UTEM (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Transferencia', version: 1, vigente: 'No' },
    { id: 3005, nombre: 'Encuesta de Transferencia UTEM (ver.2)', origen: 'Holding', cliente: 'INACAP', tipo: 'Transferencia', version: 2, vigente: 'No' },
    { id: 3006, nombre: 'Encuesta de Satisfacción Sincrónica UTEM (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'Si' },
    { id: 3007, nombre: 'Encuesta de Transferencia Estándar UTEM (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Transferencia', version: 1, vigente: 'Si' },
    { id: 3008, nombre: 'Encuesta de Satisfacción Asincrónica UTEM (ver.1)', origen: 'Holding', cliente: 'INACAP', tipo: 'Satisfacción', version: 1, vigente: 'No' },
  ],
  // IANSA + IANSA S.A.
  c4: [
    { id: 5001, nombre: 'Encuesta de Satisfacción IANSA Operaciones (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 5002, nombre: 'Encuesta de Satisfacción IANSA Operaciones (ver.2)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Satisfacción', version: 2, vigente: 'No' },
    { id: 5003, nombre: 'Encuesta de Transferencia IANSA Industrial (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Transferencia', version: 1, vigente: 'No' },
    { id: 5004, nombre: 'Encuesta de Satisfacción Presencial IANSA (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Satisfacción', version: 1, vigente: 'Si' },
    { id: 5005, nombre: 'Encuesta de Transferencia Estándar IANSA (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Transferencia', version: 1, vigente: 'Si' },
  ],
  // IANSA + IANSA Procesados Ltda.
  c5: [
    { id: 6001, nombre: 'Encuesta de Satisfacción IANSA Procesados (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 6002, nombre: 'Encuesta de Transferencia IANSA Procesados (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Transferencia', version: 1, vigente: 'No' },
    { id: 6003, nombre: 'Encuesta de Satisfacción Calidad IANSA (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 6004, nombre: 'Encuesta de Satisfacción Calidad IANSA (ver.2)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Satisfacción', version: 2, vigente: 'Si' },
    { id: 6005, nombre: 'Encuesta de Transferencia Jefaturas IANSA (ver.1)', origen: 'Empresa', cliente: 'IANSA', tipo: 'Transferencia', version: 1, vigente: 'Si' },
  ],
  // Constructora Norte + Constructora Norte S.A.
  c7: [
    { id: 7001, nombre: 'Encuesta de Satisfacción C.Norte Obras (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 7002, nombre: 'Encuesta de Satisfacción C.Norte Obras (ver.2)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Satisfacción', version: 2, vigente: 'No' },
    { id: 7003, nombre: 'Encuesta de Transferencia C.Norte Faena (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Transferencia', version: 1, vigente: 'No' },
    { id: 7004, nombre: 'Encuesta de Satisfacción Seguridad C.Norte (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 7005, nombre: 'Encuesta de Satisfacción Seguridad C.Norte (ver.2)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Satisfacción', version: 2, vigente: 'Si' },
    { id: 7006, nombre: 'Encuesta de Transferencia Estándar C.Norte (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Transferencia', version: 1, vigente: 'Si' },
  ],
  // Constructora Norte + Constructora Norte Filial Ltda.
  c8: [
    { id: 8001, nombre: 'Encuesta de Satisfacción C.Norte Filial (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 8002, nombre: 'Encuesta de Transferencia C.Norte Filial (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Transferencia', version: 1, vigente: 'No' },
    { id: 8003, nombre: 'Encuesta de Satisfacción Presencial Filial (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Satisfacción', version: 1, vigente: 'No' },
    { id: 8004, nombre: 'Encuesta de Satisfacción On-line Filial (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Satisfacción', version: 1, vigente: 'Si' },
    { id: 8005, nombre: 'Encuesta de Transferencia Jefaturas Filial (ver.1)', origen: 'Empresa', cliente: 'C. Norte', tipo: 'Transferencia', version: 1, vigente: 'Si' },
  ],
};

// Group key (everything before the "(ver.X)") to find max version per group
const groupKeyOf = (n: string) => n.replace(/\s*\(ver\.\d+\)\s*$/i, '').trim().toLowerCase();

const TEAL = '#65BFB1';

export const PreviewModal: React.FC<{ open: boolean; onClose: () => void; encuesta: EncuestaRow | null }> = ({ open, onClose, encuesta }) => {
  if (!encuesta) return null;
  const scaleHeader = (
    <div className="flex gap-2 items-center" style={{ fontFamily: 'Poppins', fontSize: 11, color: '#6B7280' }}>
      {['1', '2', '3', '4', '5', 'NA'].map((n) => (
        <span key={n} style={{ width: 22, textAlign: 'center' }}>{n}</span>
      ))}
    </div>
  );
  const renderQuestion = (q: string) => (
    <div key={q} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] gap-4">
      <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#374151', flex: 1 }}>{q}</span>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: 22, height: 22, border: '1px solid #D1D5DB', borderRadius: 3, background: '#FFFFFF' }} />
        ))}
      </div>
    </div>
  );
  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="close" onClick={onClose} block>
          Cerrar
        </Button>,
      ]}
      title={
        <span className="flex items-center gap-2" style={{ fontFamily: 'Poppins' }}>
          <Eye size={18} color={TEAL} weight="regular" />
          Previsualización — {encuesta.nombre}
        </span>
      }
    >
      <div style={{ fontFamily: 'Poppins' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 80, height: 32, background: '#F3F4F6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#9CA3AF' }}>OTIC</div>
        </div>
        <h2 style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{encuesta.nombre}</h2>
        <div className="space-y-2 mb-4">
          {['Nombre:', 'Nombre del Curso:', 'Relator:'].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ fontSize: 12, color: '#6B7280', minWidth: 130 }}>{label}</span>
              <div style={{ flex: 1, borderBottom: '1px solid #D1D5DB', height: 18 }} />
            </div>
          ))}
        </div>
        <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151', marginBottom: 20 }}>
          El objetivo de esta evaluación es comprobar si se ha producido algún cambio o mejora en el desempeño de la persona trabajadora a partir de la capacitación realizada.
        </p>

        {/* Sección 1 */}
        <div className="mb-6">
          <div className="flex items-center justify-between pb-2 mb-2" style={{ borderBottom: `2px solid ${TEAL}` }}>
            <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: TEAL, textTransform: 'uppercase' }}>
              APLICACIÓN DE CONOCIMIENTOS
            </span>
            {scaleHeader}
          </div>
          {[
            'Los aprendizajes obtenidos son utilizados en el trabajo diario',
            'La persona trabajadora demuestra mayor comprensión de sus funciones',
            'Los conocimientos adquiridos tienen aplicación a corto y mediano plazo',
            'La persona trabajadora se muestra más segura en el desempeño de sus labores',
          ].map(renderQuestion)}
        </div>

        {/* Sección 2 */}
        <div className="mb-4">
          <div className="flex items-center justify-between pb-2 mb-2" style={{ borderBottom: `2px solid ${TEAL}` }}>
            <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: TEAL, textTransform: 'uppercase' }}>
              DESARROLLO DE HABILIDADES
            </span>
            {scaleHeader}
          </div>
          {[
            'Las habilidades adquiridas han sido aplicadas de manera efectiva',
            'Se observa una mejora en el desempeño relacionado con la capacitación',
            'La persona trabajadora considera nuevas formas o estrategias de trabajo',
          ].map(renderQuestion)}
        </div>

        <p style={{ fontFamily: 'Poppins', fontSize: 11, color: '#9CA3AF', fontStyle: 'italic', marginTop: 16 }}>
          * Esta es una previsualización de referencia. El formulario real puede contener más secciones y preguntas según la versión seleccionada.
        </p>
      </div>
    </Modal>
  );
};

const AdministrarEncuestasTab: React.FC = () => {
  const { selectedCompany, selectedCompanyId } = useOTICFilter();
  const clienteName = selectedCompany
    ? (selectedCompany.name.includes('|') ? selectedCompany.name.split('|').pop()!.trim() : selectedCompany.name)
    : '';
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'all' | EncuestaTipo>('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [previewRow, setPreviewRow] = useState<EncuestaRow | null>(null);

  const dataset = useMemo<EncuestaRow[]>(
    () => (selectedCompanyId ? (ENCUESTAS_BY_COMPANY[selectedCompanyId] || []) : []),
    [selectedCompanyId]
  );

  // Compute max version per group
  const maxVersionByGroup = useMemo(() => {
    const m = new Map<string, number>();
    dataset.forEach((r) => {
      const k = groupKeyOf(r.nombre);
      m.set(k, Math.max(m.get(k) ?? 0, r.version));
    });
    return m;
  }, [dataset]);

  const searched = useMemo(() => {
    if (!search.trim()) return dataset;
    const q = search.toLowerCase();
    return dataset.filter((r) =>
      [r.nombre, r.tipo, r.cliente].some((v) => v.toLowerCase().includes(q))
    );
  }, [dataset, search]);


  const counts = useMemo(() => ({
    all: searched.length,
    Satisfacción: searched.filter((r) => r.tipo === 'Satisfacción').length,
    Transferencia: searched.filter((r) => r.tipo === 'Transferencia').length,
  }), [searched]);

  const filtered = useMemo(() => {
    if (tipoFilter === 'all') return searched;
    return searched.filter((r) => r.tipo === tipoFilter);
  }, [searched, tipoFilter]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const todayStrLocal = () => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  };

  const exportRows = filtered.map((r) => ({
    ID: r.id,
    'Nombre Encuesta': r.nombre,
    Origen: r.origen,
    Cliente: r.cliente,
    'Tipo Encuesta': r.tipo,
    Versión: r.version,
    Estado: r.vigente === 'Si' ? 'Vigente' : 'No vigente',
  }));

  const exportDisabled = filtered.length === 0;
  const fileBaseName = `encuestas_${todayStrLocal()}`;

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCSV = () => {
    if (exportDisabled) return;
    const headers = Object.keys(exportRows[0]);
    const sep = ';';
    const escape = (v: any) => {
      const s = String(v ?? '');
      if (s.includes(sep) || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const lines = [headers.join(sep), ...exportRows.map((r) => headers.map((h) => escape((r as any)[h])).join(sep))];
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${fileBaseName}.csv`);
  };

  const handleExcel = () => {
    if (exportDisabled) return;
    message.info({ content: 'Generando Excel...', style: { fontFamily: 'Poppins, sans-serif' } });
    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Encuestas');
      XLSX.writeFile(wb, `${fileBaseName}.xlsx`);
    }, 1000);
  };

  const handlePDF = () => {
    if (exportDisabled) return;
    message.info({ content: 'Generando PDF...', style: { fontFamily: 'Poppins, sans-serif' } });
    setTimeout(() => {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(14);
      doc.text('Administrar Encuestas', 14, 14);
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date().toLocaleString('es-CL')}    Total: ${exportRows.length}`, 14, 21);
      const headers = Object.keys(exportRows[0]);
      autoTable(doc, {
        head: [headers],
        body: exportRows.map((r) => headers.map((h) => String((r as any)[h] ?? ''))),
        startY: 26,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [101, 191, 177] },
      });
      doc.save(`${fileBaseName}.pdf`);
    }, 1500);
  };

  const renderPill = (key: 'all' | EncuestaTipo, label: string, count: number) => {
    const active = tipoFilter === key;
    let activeStyle: React.CSSProperties = {};
    if (active) {
      if (key === 'all') activeStyle = { background: '#111827', color: '#FFFFFF', borderColor: '#111827' };
      else if (key === 'Satisfacción') activeStyle = { background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' };
      else activeStyle = { background: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' };
    }
    return (
      <button
        key={key}
        onClick={() => { setTipoFilter(key); setPage(1); }}
        className="transition-colors"
        style={{
          fontFamily: 'Poppins', fontSize: 13, fontWeight: 500,
          padding: '4px 16px', borderRadius: 999,
          border: '1px solid #E5E7EB', background: '#F3F4F6', color: '#6B7280',
          cursor: 'pointer', ...activeStyle,
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#E5E7EB'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = '#F3F4F6'; }}
      >
        {label} ({count})
      </button>
    );
  };

  const exportBtnStyle: React.CSSProperties = {
    background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151',
    fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, borderRadius: 6,
    padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: 6,
    cursor: exportDisabled ? 'not-allowed' : 'pointer', opacity: exportDisabled ? 0.5 : 1,
  };

  const ExportBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <Tooltip title={exportDisabled ? 'Aplica filtros para exportar' : `Exportar ${label}`}>
      <button type="button" disabled={exportDisabled} onClick={onClick} style={exportBtnStyle}
        onMouseEnter={(e) => { if (!exportDisabled) { e.currentTarget.style.background = '#F9FAFB'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
      >{icon}{label}</button>
    </Tooltip>
  );

  const nowrap = (t: string) => <span style={{ whiteSpace: 'nowrap' }}>{t}</span>;

  const columns = [
    {
      title: nowrap('ID'), dataIndex: 'id', width: 70,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</span>,
    },
    {
      title: nowrap('Nombre Encuesta'), dataIndex: 'nombre', minWidth: 200, ellipsis: true,
      render: (v: string) => (
        <Tooltip title={v}>
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: nowrap('Origen'), dataIndex: 'origen', width: 90,
      render: (v: string) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v}</span>,
    },
    {
      title: nowrap('Cliente'), dataIndex: 'cliente', width: 220,
      render: () => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>{clienteName || '—'}</span>,
    },
    {
      title: nowrap('Tipo Encuesta'), dataIndex: 'tipo', width: 140,
      render: (v: EncuestaTipo) => {
        const styles = v === 'Satisfacción' ? { background: '#EFF6FF', color: '#1D4ED8' } : { background: '#F0FDF4', color: '#15803D' };
        return (
          <span style={{ ...styles, fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap', display: 'inline-block' }}>
            {v}
          </span>
        );
      },
    },
    {
      title: nowrap('Versión'), dataIndex: 'version', width: 90, align: 'center' as const,
      render: (v: number, row: EncuestaRow) => {
        const isMax = maxVersionByGroup.get(groupKeyOf(row.nombre)) === v;
        if (isMax) {
          return (
            <Tooltip title="Versión más reciente">
              <span style={{
                background: '#F0FDF9', color: TEAL,
                borderRadius: 999, padding: '2px 8px',
                fontFamily: 'Poppins', fontSize: 12, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Star size={12} weight="fill" color={TEAL} /> {v}
              </span>
            </Tooltip>
          );
        }
        return <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v}</span>;
      },
    },
    {
      title: nowrap('Estado'), dataIndex: 'vigente', width: 120,
      render: (v: 'Si' | 'No') => {
        const vigente = v === 'Si';
        const styles = vigente
          ? { background: '#D1FAE5', color: '#065F46', dot: '#10B981' }
          : { background: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' };
        return (
          <span style={{
            background: styles.background, color: styles.color,
            fontFamily: 'Poppins', fontSize: 12, fontWeight: 500,
            padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: styles.dot, display: 'inline-block' }} />
            {vigente ? 'Vigente' : 'No vigente'}
          </span>
        );
      },
    },
    {
      title: nowrap('Acción'), width: 80, align: 'center' as const,
      render: (_: any, row: EncuestaRow) => {
        const enabled = row.vigente === 'Si';
        return (
          <Tooltip title={enabled ? 'Ver previsualización' : 'Solo disponible para encuestas vigentes'}>
            <button
              onClick={() => { if (enabled) setPreviewRow(row); }}
              style={{
                background: 'transparent', border: 'none',
                cursor: enabled ? 'pointer' : 'not-allowed',
                padding: 4,
              }}
            >
              <Eye size={18} color={enabled ? TEAL : '#D1D5DB'} weight="regular" />
            </button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>
          Administrar Encuestas
        </h2>
        <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
          Consulta y previsualiza las encuestas disponibles según su estado de vigencia
        </p>
      </div>

      {/* Pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {renderPill('all', 'Todas', counts.all)}
        {renderPill('Satisfacción', 'Satisfacción', counts.Satisfacción)}
        {renderPill('Transferencia', 'Transferencia', counts.Transferencia)}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
          {filtered.length} encuestas encontradas
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            placeholder="Buscar por nombre, tipo o cliente..."
            prefix={<MagnifyingGlass size={14} color="#9CA3AF" />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: 260, fontFamily: 'Poppins' }}
            allowClear
          />
          <div className="flex items-center gap-2">
            <ExportBtn icon={<FileCsv size={16} />} label="CSV" onClick={handleCSV} />
            <ExportBtn icon={<FileXls size={16} />} label="Excel" onClick={handleExcel} />
            <ExportBtn icon={<FilePdf size={16} />} label="PDF" onClick={handlePDF} />
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>Mostrar</span>
            <Select
              value={pageSize}
              onChange={(v) => { setPageSize(v); setPage(1); }}
              style={{ width: 80 }}
              options={[
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
        <Table
          rowKey="id"
          dataSource={paged}
          columns={columns as any}
          pagination={false}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center py-12">
                <MagnifyingGlass size={48} color="#D1D5DB" weight="regular" />
                <p className="mt-3 mb-1" style={{ fontFamily: 'Poppins', fontSize: 14, color: '#6B7280' }}>
                  No se encontraron encuestas
                </p>
                <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>
                  Intenta con otro término de búsqueda
                </p>
              </div>
            ),
          }}
        />
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
            Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filtered.length)} de {filtered.length} encuestas
          </span>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filtered.length}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}

      <PreviewModal open={!!previewRow} onClose={() => setPreviewRow(null)} encuesta={previewRow} />
    </div>
  );
};

// ============================================================
// ASIGNAR ENCUESTAS TAB
// ============================================================
interface AsignarCursoRow {
  inscripcion: number;
  sc: number | null;
  sencenet: number | null;
  inicio: string;
  termino: string;
  curso: string;
  tipo: 'Sence' | 'Curso Interno';
  modalidad: 'E-Learning' | 'Presencial';
  participantes: number;
  satisfaccion: 'sin_asignar' | 'asignada';
  transferencia: 'sin_asignar' | 'asignada';
}

const ASIGNAR_DATA: AsignarCursoRow[] = [
  { inscripcion: 2095229, sc: 2081283, sencenet: 6751930, inicio: '06/01/26', termino: '14/02/26', curso: 'HERRAMIENTAS ESENCIALES DEL STORYTELLING PARA LA CONSTRUCCIÓN DE HISTORIAS CORPORATIVAS EFECTIVAS', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2118699, sc: null, sencenet: 6720127, inicio: '31/03/26', termino: '26/05/26', curso: 'GESTIÓN DE LA INTELIGENCIA EMOCIONAL PARA EL LIDERAZGO DE EQUIPOS', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'asignada', transferencia: 'sin_asignar' },
  { inscripcion: 2118700, sc: null, sencenet: 6720128, inicio: '26/05/26', termino: '21/07/26', curso: 'HERRAMIENTAS DE GESTIÓN PARA LA DIRECCIÓN DE ORGANIZACIONES', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2118703, sc: null, sencenet: 6720129, inicio: '28/07/26', termino: '29/09/26', curso: 'HERRAMIENTAS PARA EL EJERCICIO DEL LIDERAZGO EN LAS ORGANIZACIONES', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2126744, sc: null, sencenet: 6732975, inicio: '31/03/26', termino: '26/05/26', curso: 'Gestión socio-ambiental: casos de empresa', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'asignada', transferencia: 'asignada' },
  { inscripcion: 2126747, sc: null, sencenet: 6732976, inicio: '26/05/26', termino: '28/07/26', curso: 'Sostenibilidad Socio-Ambiental: desafíos para la empresa', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2126757, sc: null, sencenet: 6732977, inicio: '28/07/26', termino: '29/09/26', curso: 'Técnicas para la gestión ambiental', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2143994, sc: null, sencenet: 6752071, inicio: '05/01/26', termino: '13/02/26', curso: 'Aplicación De Técnicas De Comunicación Efectiva', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2144001, sc: null, sencenet: 6752074, inicio: '05/01/26', termino: '30/01/26', curso: 'Excel Básico: planillas inteligentes para el trabajo diario', tipo: 'Sence', modalidad: 'E-Learning', participantes: 2, satisfaccion: 'asignada', transferencia: 'sin_asignar' },
  { inscripcion: 2174396, sc: null, sencenet: null, inicio: '05/03/26', termino: '05/03/26', curso: 'Capacitación Teórica práctica sobre uso de extintores', tipo: 'Curso Interno', modalidad: 'Presencial', participantes: 9, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2177407, sc: null, sencenet: null, inicio: '05/03/26', termino: '05/03/26', curso: 'Capacitación Teórica práctica sobre uso de extintores', tipo: 'Curso Interno', modalidad: 'Presencial', participantes: 9, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2177416, sc: null, sencenet: null, inicio: '05/03/26', termino: '05/03/26', curso: 'Capacitación Teórica práctica sobre uso de extintores', tipo: 'Curso Interno', modalidad: 'E-Learning', participantes: 9, satisfaccion: 'asignada', transferencia: 'asignada' },
];


type AsignKind = 'Satisfacción' | 'Transferencia';

export const ENCUESTA_INFO: Record<AsignKind, { nombre: string; id: number }> = {
  'Satisfacción': { nombre: 'Encuesta de Satisfacción Estándar v2.0', id: 4728 },
  'Transferencia': { nombre: 'Encuesta de Transferencia Estándar v2.0', id: 4484 },
};

const RESEND_PENDIENTES: { rut: string; nombre: string; correo: string; estado: 'Pendiente' }[] = [
  { rut: '12095229-K', nombre: 'Paula Orellana Marín', correo: 'paula@empresa.cl', estado: 'Pendiente' },
  { rut: '17654321-8', nombre: 'Diego Pérez Vega', correo: 'diego@empresa.cl', estado: 'Pendiente' },
];
const RESEND_TOTAL = 3;
const RESEND_RESPONDIDOS = 1;

interface AsignFormState {
  relator: string;
  fecha: any;
  participantesCount: number;
}

const AsignarModal: React.FC<{
  open: boolean;
  kind: AsignKind | null;
  row: AsignarCursoRow | null;
  form: AsignFormState;
  sinCorreo: number;
  totalParticipantes: number;
  onChange: (patch: Partial<AsignFormState>) => void;
  onClose: () => void;
  onSave: () => void;
  onOpenParticipants: () => void;
  onPreviewEmail: () => void;
}> = ({ open, kind, row, form, sinCorreo, totalParticipantes, onChange, onClose, onSave, onOpenParticipants, onPreviewEmail }) => {
  const [errRelator, setErrRelator] = useState(false);
  const [errFecha, setErrFecha] = useState(false);

  useEffect(() => { if (open) { setErrRelator(false); setErrFecha(false); } }, [open]);

  if (!kind || !row) return null;
  const info = ENCUESTA_INFO[kind];
  const isSatis = kind === 'Satisfacción';
  const badgeBg = isSatis ? '#EFF6FF' : '#F0FDF4';
  const badgeColor = isSatis ? '#1D4ED8' : '#15803D';

  const handleSave = () => {
    const eR = !form.relator.trim();
    const eF = !form.fecha;
    setErrRelator(eR); setErrFecha(eF);
    if (eR || eF) return;
    if (sinCorreo > 0) return;
    onSave();
  };

  const saveDisabled = sinCorreo > 0;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={580}
      footer={null}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24, fontFamily: 'Poppins' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ClipboardText size={20} color={TEAL} weight="regular" />
            <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Asignar Encuesta</span>
          </span>
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 999,
            background: badgeBg, color: badgeColor, fontFamily: 'Poppins', fontSize: 12, fontWeight: 500,
          }}>{kind}</span>
        </div>
      }
    >
      <div style={{ fontFamily: 'Poppins' }}>
        <div style={{ background: '#F0FDF9', border: '1px solid #99F6E4', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12 }}>
          <BookOpen size={20} color={TEAL} weight="regular" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>N° Inscripción: {row.inscripcion}</span>
            <span style={{ fontSize: 13, color: '#374151', wordBreak: 'break-word' }}>Curso: {row.curso}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Encuesta</label>
            <Input disabled value={`${info.nombre} (ID ${info.id})`} style={{ background: '#F9FAFB', fontFamily: 'Poppins' }} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6,
              background: '#F0FDF9', color: TEAL, borderRadius: 999, padding: '2px 10px', fontSize: 11, fontFamily: 'Poppins',
            }}>
              <Star size={12} weight="fill" />
              Estándar vigente
            </span>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Relator *</label>
            <Input
              value={form.relator}
              onChange={(e) => { onChange({ relator: e.target.value }); if (e.target.value.trim()) setErrRelator(false); }}
              placeholder="Ingresa el nombre del relator"
              status={errRelator ? 'error' : undefined}
              style={{ fontFamily: 'Poppins' }}
            />
            {errRelator && <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>El relator es obligatorio</div>}
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Fecha de Evaluación *</label>
            <DatePicker
              value={form.fecha}
              onChange={(v) => { onChange({ fecha: v }); if (v) setErrFecha(false); }}
              format="DD-MM-YYYY"
              placeholder="Selecciona una fecha"
              style={{ width: '100%' }}
              status={errFecha ? 'error' : undefined}
            />
            {errFecha && <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>La fecha de evaluación es obligatoria</div>}
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Tipo de Carga</label>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#F0FDF9', color: TEAL, borderRadius: 8, padding: '8px 12px',
              fontSize: 13, fontWeight: 500, fontFamily: 'Poppins',
            }}>
              <WifiHigh size={16} weight="regular" />
              On-line
            </span>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
              El tipo de carga siempre es On-line para este tipo de encuesta.
            </div>
          </div>

          <div>
            <Button
              block
              onClick={onOpenParticipants}
              style={{ borderColor: TEAL, color: TEAL, background: '#FFFFFF', fontFamily: 'Poppins', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              icon={<Users size={16} weight="regular" />}
            >
              <span>Gestionar Participantes</span>
              {form.participantesCount > 0 && (
                <span style={{ background: TEAL, color: '#FFFFFF', borderRadius: 999, padding: '0 8px', fontSize: 11, fontWeight: 600, marginLeft: 4 }}>
                  {form.participantesCount} participantes
                </span>
              )}
            </Button>
            {sinCorreo > 0 && (
              <div style={{
                marginTop: 12,
                background: '#FEF3C7',
                borderLeft: '4px solid #D97706',
                borderRadius: 8,
                padding: '12px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Warning size={18} color="#D97706" weight="regular" />
                  <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#D97706' }}>
                    Participantes sin correo
                  </span>
                </div>
                <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#92400E', marginTop: 6 }}>
                  {sinCorreo} de {totalParticipantes} participantes no tienen correo asignado. Todos los participantes visibles deben tener correo para poder guardar la asignación.
                </div>
                <button
                  onClick={onOpenParticipants}
                  style={{
                    marginTop: 10,
                    background: 'transparent',
                    border: '1px solid #FDE68A',
                    borderRadius: 6,
                    color: '#D97706',
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    fontWeight: 500,
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  Ir a gestionar participantes →
                </button>
              </div>
            )}
            {form.participantesCount === 0 && sinCorreo === 0 && (
              <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
                Agrega el correo de los participantes del curso
              </div>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', margin: '20px 0 16px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <Button onClick={onClose} style={{ fontFamily: 'Poppins' }}>Cancelar</Button>
          <Tooltip title={saveDisabled ? `${sinCorreo} participantes no tienen correo. Corrígelo antes de guardar.` : ''}>
            <Button
              type="primary"
              onClick={handleSave}
              disabled={saveDisabled}
              icon={<FloppyDisk size={16} weight="regular" />}
              style={{ background: saveDisabled ? undefined : TEAL, borderColor: saveDisabled ? undefined : TEAL, fontFamily: 'Poppins', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              Guardar Configuración
            </Button>
          </Tooltip>
        </div>
      </div>
    </Modal>
  );
};

// ============= PARTICIPANTES MODALS =============
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SatisParticipante {
  id: number;
  rut: string;
  nombre: string;
  correo: string;
  estado: 'activo' | 'eliminado' | 'anulado';
  selected: boolean;
}
const DEFAULT_SATIS: SatisParticipante[] = [
  { id: 1, rut: '15621841-3', nombre: 'Paula Orellana Marín', correo: '', estado: 'activo', selected: true },
  { id: 2, rut: '12345678-9', nombre: 'Carlos Muñoz Soto', correo: 'carlos.munoz@empresa.cl', estado: 'activo', selected: true },
  { id: 3, rut: '16789012-3', nombre: 'Ana Torres Vidal', correo: '', estado: 'activo', selected: true },
];

// Per-inscripcion participant seeds (names + emails) used to validate the
// "all participants must have email" rule for both Satisfacción and Transferencia.
const PARTICIPANTES_BASE: Record<number, { nombre: string; correo: string }[]> = {
  2095229: [{ nombre: 'Paula Orellana Marín', correo: '' }],
  2118699: [{ nombre: 'Paula Orellana Marín', correo: 'paula@empresa.cl' }],
  2118700: [{ nombre: 'Carlos Muñoz Soto', correo: '' }],
  2118703: [{ nombre: 'Ana Torres Vidal', correo: '' }],
  2126744: [
    { nombre: 'Paula Orellana Marín', correo: 'paula@empresa.cl' },
    { nombre: 'Carlos Muñoz Soto', correo: 'carlos@empresa.cl' },
    { nombre: 'Ana Torres Vidal', correo: 'ana@empresa.cl' },
  ],
  2126747: [{ nombre: 'Francisco Valenzuela Rojas', correo: '' }],
  2126757: [{ nombre: 'Roberto Silva Pinto', correo: '' }],
  2143994: [{ nombre: 'María José Contreras', correo: '' }],
  2144001: [
    { nombre: 'Diego Pérez Vega', correo: 'diego@empresa.cl' },
    { nombre: 'Valentina Rojas Castro', correo: '' },
  ],
  2174396: [
    { nombre: 'Juan Morales Fuentes', correo: '' },
    { nombre: 'María Contreras Pinto', correo: '' },
    { nombre: 'Carlos Muñoz Rojas', correo: '' },
    { nombre: 'Ana Torres Soto', correo: '' },
    { nombre: 'Pedro Vargas León', correo: '' },
    { nombre: 'Francisca Silva Araya', correo: '' },
    { nombre: 'Diego Pérez Vega', correo: '' },
    { nombre: 'Valentina Rojas Castro', correo: '' },
    { nombre: 'Rodrigo Díaz Meza', correo: '' },
  ],
  2177407: [
    { nombre: 'Juan Morales Fuentes', correo: 'juan@empresa.cl' },
    { nombre: 'María Contreras Pinto', correo: 'maria@empresa.cl' },
    { nombre: 'Carlos Muñoz Rojas', correo: 'carlos@empresa.cl' },
    { nombre: 'Ana Torres Soto', correo: 'ana@empresa.cl' },
    { nombre: 'Pedro Vargas León', correo: 'pedro@empresa.cl' },
    { nombre: 'Francisca Silva Araya', correo: '' },
    { nombre: 'Diego Pérez Vega', correo: '' },
    { nombre: 'Valentina Rojas Castro', correo: '' },
    { nombre: 'Rodrigo Díaz Meza', correo: '' },
  ],
  2177416: [
    { nombre: 'Juan Morales Fuentes', correo: 'juan@empresa.cl' },
    { nombre: 'María Contreras Pinto', correo: 'maria@empresa.cl' },
    { nombre: 'Carlos Muñoz Rojas', correo: 'carlos@empresa.cl' },
    { nombre: 'Ana Torres Soto', correo: 'ana@empresa.cl' },
    { nombre: 'Pedro Vargas León', correo: 'pedro@empresa.cl' },
    { nombre: 'Francisca Silva Araya', correo: 'francisca@empresa.cl' },
    { nombre: 'Diego Pérez Vega', correo: 'diego@empresa.cl' },
    { nombre: 'Valentina Rojas Castro', correo: 'valentina@empresa.cl' },
    { nombre: 'Rodrigo Díaz Meza', correo: 'rodrigo@empresa.cl' },
  ],
};

// Mixed dataset: activos + eliminados + anulados (used in Participantes modals)
const MIXED_PARTICIPANTES: { rut: string; nombre: string; correo: string; estado: 'activo' | 'eliminado' | 'anulado' }[] = [
  { rut: '12095229-K', nombre: 'Paula Orellana Marín', correo: 'paula@empresa.cl', estado: 'activo' },
  { rut: '12345678-9', nombre: 'Carlos Muñoz Soto', correo: 'carlos@empresa.cl', estado: 'activo' },
  { rut: '16789012-3', nombre: 'Ana Torres Vidal', correo: '', estado: 'eliminado' },
  { rut: '19876543-2', nombre: 'Roberto Silva Pinto', correo: '', estado: 'eliminado' },
  { rut: '14567890-1', nombre: 'María José Contreras', correo: '', estado: 'anulado' },
  { rut: '17654321-8', nombre: 'Diego Pérez Vega', correo: 'diego@empresa.cl', estado: 'activo' },
  { rut: '15432198-7', nombre: 'Valentina Rojas Castro', correo: '', estado: 'anulado' },
];

const buildSatisDefault = (_insc: number): SatisParticipante[] =>
  MIXED_PARTICIPANTES.map((p, i) => ({
    id: i + 1,
    rut: p.rut,
    nombre: p.nombre,
    correo: p.estado === 'activo' ? p.correo : '',
    estado: p.estado,
    selected: p.estado === 'activo',
  }));

const buildTransDefault = (_insc: number): TransParticipante[] =>
  MIXED_PARTICIPANTES.map((p, i) => ({
    id: i + 1,
    rut: p.rut,
    nombre: p.nombre,
    correoJefe: '',
    nombreJefe: '',
    correoEvaluador: '',
    nombreEvaluador: '',
    estado: p.estado,
    selected: p.estado === 'activo',
  }));

const EmailInput: React.FC<{ value: string; placeholder: string; onChange: (v: string) => void; disabled?: boolean; forceError?: boolean }> = ({ value, placeholder, onChange, disabled, forceError }) => {
  const [touched, setTouched] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const empty = !value.trim();
  const valid = !empty && EMAIL_RE.test(value.trim());
  const invalid = !empty && !valid;

  let borderColor = '#D8E6E2';
  let tooltip = '';
  if (forceError && empty) {
    borderColor = '#F0A945'; tooltip = 'Correo requerido para guardar';
  } else if (touched) {
    if (empty) { borderColor = '#F0A945'; tooltip = 'Correo pendiente de ingresar'; }
    else if (invalid) { borderColor = '#E55157'; tooltip = 'Formato de correo inválido. Ej: nombre@empresa.cl'; }
    else if (showCheck) { borderColor = '#97D972'; }
  }

  return (
    <Tooltip title={tooltip} open={(touched && tooltip) || (forceError && empty) ? undefined : false}>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <Input
          size="small"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setTouched(true);
            if (!empty && EMAIL_RE.test(value.trim())) {
              setShowCheck(true);
              setTimeout(() => setShowCheck(false), 1500);
            }
          }}
          style={{ width: '100%', borderColor, borderRadius: 10, fontFamily: 'Poppins', color: !empty && valid ? '#1D4D4A' : undefined }}
        />
        {showCheck && (
          <CheckCircle size={14} color="#97D972" weight="fill" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)' }} />
        )}
      </div>
    </Tooltip>
  );
};

const SatisfaccionParticipantesModal: React.FC<{
  open: boolean;
  row: AsignarCursoRow | null;
  initial: SatisParticipante[];
  initialExcluirEliminados?: boolean;
  initialExcluirAnulados?: boolean;
  onClose: () => void;
  onSave: (list: SatisParticipante[], excluirEliminados: boolean, excluirAnulados: boolean) => void;
}> = ({ open, row, initial, initialExcluirEliminados, initialExcluirAnulados, onClose, onSave }) => {
  const [list, setList] = useState<SatisParticipante[]>(initial);
  const [search, setSearch] = useState('');
  const [excluirEliminados, setExcluirEliminados] = useState(!!initialExcluirEliminados);
  const [excluirAnulados, setExcluirAnulados] = useState(!!initialExcluirAnulados);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (open) {
      setList(initial);
      setSearch('');
      setExcluirEliminados(!!initialExcluirEliminados);
      setExcluirAnulados(!!initialExcluirAnulados);
      setShowErrors(false);
    }
  }, [open, initial, initialExcluirEliminados, initialExcluirAnulados]);

  if (!row) return null;

  const update = (id: number, patch: Partial<SatisParticipante>) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const eliminados = list.filter((p) => p.estado === 'eliminado').length;
  const anulados = list.filter((p) => p.estado === 'anulado').length;
  const activos = list.filter((p) => p.estado === 'activo').length;
  const isVisible = (p: SatisParticipante) =>
    !(excluirEliminados && p.estado === 'eliminado') &&
    !(excluirAnulados && p.estado === 'anulado');
  const visible = list
    .filter(isVisible)
    .filter((p) =>
      !search.trim() || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.rut.toLowerCase().includes(search.toLowerCase())
    );
  const visibleAll = list.filter(isVisible);
  const pendientes = visibleAll.filter((p) => !p.correo.trim() || !EMAIL_RE.test(p.correo.trim())).length;

  const handleSave = () => {
    const missing = visibleAll.some((p) => !p.correo.trim());
    const invalid = visibleAll.some((p) => p.correo.trim() && !EMAIL_RE.test(p.correo.trim()));
    if (missing || invalid) {
      setShowErrors(true);
      toast.warning('Corrige los correos de todos los participantes visibles antes de guardar.');
      return;
    }
    onSave(list, excluirEliminados, excluirAnulados);
  };

  const estadoBadge = (estado: 'activo' | 'eliminado' | 'anulado') => {
    if (estado === 'eliminado') {
      return <span style={{ background: '#FFF1F0', color: '#E55157', borderRadius: 9999, padding: '2px 8px', fontFamily: 'Poppins', fontSize: 11, fontWeight: 500 }}>Eliminado</span>;
    }
    if (estado === 'anulado') {
      return <span style={{ background: '#FFFBE6', color: '#F0A945', borderRadius: 9999, padding: '2px 8px', fontFamily: 'Poppins', fontSize: 11, fontWeight: 500 }}>Anulado</span>;
    }
    return null;
  };

  const columns: any[] = [
    {
      title: '', dataIndex: 'selected', width: 50, align: 'center' as const,
      render: (v: boolean, r: SatisParticipante) => (
        <Checkbox checked={r.estado === 'activo' && v} disabled={r.estado !== 'activo'} onChange={(e) => update(r.id, { selected: e.target.checked })} />
      ),
    },
    {
      title: <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>RUT Participante</span>,
      dataIndex: 'rut', width: 120,
      render: (v: string) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span>,
    },
    {
      title: <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#1D4D4A', whiteSpace: 'nowrap' }}>Nombre Participante</span>,
      dataIndex: 'nombre',
      render: (v: string, r: SatisParticipante) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, color: '#1D4D4A' }}>{v}</span>
          {estadoBadge(r.estado)}
        </span>
      ),
    },
    {
      title: <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>Correo Participante</span>,
      dataIndex: 'correo', width: 240,
      render: (v: string, r: SatisParticipante) => (
        <div style={{ width: 220 }}>
          <EmailInput
            value={v}
            placeholder="correo@ejemplo.com"
            onChange={(nv) => update(r.id, { correo: nv })}
            forceError={showErrors}
          />
        </div>
      ),
    },
  ];

  const exclBtnStyle = (active: boolean) => active
    ? { background: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA', display: 'inline-flex', alignItems: 'center', gap: 6 } as const
    : { display: 'inline-flex', alignItems: 'center', gap: 6 } as const;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={720}
      footer={null}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins' }}>
          <Users size={20} color={TEAL} weight="regular" />
          <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Participantes — Satisfacción</span>
          <span style={{ background: '#EFF6FF', color: '#1D4ED8', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 500, marginLeft: 4 }}>Satisfacción</span>
        </div>
      }
    >
      <div style={{ fontFamily: 'Poppins' }}>
        <div style={{ background: '#F0FDF9', borderRadius: 8, padding: '10px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Curso: {row.curso}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Encuesta: Encuesta de Satisfacción Estándar v2.0</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button
              type="primary"
              icon={<CheckSquare size={14} weight="regular" />}
              onClick={() => setList((prev) => prev.map((p) => (p.estado === 'activo' ? { ...p, selected: true } : p)))}
              style={{ background: TEAL, borderColor: TEAL, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              Seleccionar Todos
            </Button>
            <Button
              icon={<UserMinus size={14} weight="regular" />}
              danger={!excluirEliminados}
              onClick={() => setExcluirEliminados((v) => !v)}
              style={exclBtnStyle(excluirEliminados)}
            >
              {excluirEliminados ? `Mostrando sin Eliminados (${eliminados})` : `Excluir Eliminados (0)`}
            </Button>
            <Button
              icon={<ProhibitInset size={14} weight="regular" />}
              danger={!excluirAnulados}
              onClick={() => setExcluirAnulados((v) => !v)}
              style={exclBtnStyle(excluirAnulados)}
            >
              {excluirAnulados ? `Mostrando sin Anulados (${anulados})` : `Excluir Anulados (0)`}
            </Button>
          </div>
          <Input
            prefix={<MagnifyingGlass size={14} color="#9CA3AF" weight="regular" />}
            placeholder="Filtrar por nombre o RUT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240, fontFamily: 'Poppins' }}
          />
        </div>

        <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
          Mostrando {visible.length} participantes ({activos} activos · {excluirEliminados ? 0 : eliminados} eliminados · {excluirAnulados ? 0 : anulados} anulados)
        </div>

        <Table
          columns={columns}
          dataSource={visible}
          rowKey="id"
          pagination={visible.length > 10 ? { pageSize: 10, size: 'small' } : false}
          onRow={(r: SatisParticipante) => ({
            style: r.estado === 'eliminado'
              ? { background: '#FEF2F2' }
              : r.estado === 'anulado'
                ? { background: '#FFF7ED' }
                : undefined,
          })}
        />

        {pendientes > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
            <Warning size={14} color="#F59E0B" weight="fill" />
            <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#D97706' }}>
              {pendientes} participantes sin correo ingresado
            </span>
          </div>
        )}

        <Button
          type="primary"
          block
          icon={<FloppyDisk size={16} weight="regular" />}
          onClick={handleSave}
          style={{ background: TEAL, borderColor: TEAL, marginTop: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          Guardar Participantes
        </Button>
      </div>
    </Modal>
  );
};

interface TransParticipante {
  id: number;
  rut: string;
  nombre: string;
  nombreJefe: string;
  correoJefe: string;
  nombreEvaluador: string;
  correoEvaluador: string;
  estado: 'activo' | 'eliminado' | 'anulado';
  selected: boolean;
}
const DEFAULT_TRANS: TransParticipante[] = [
  { id: 1, rut: '15775900-0', nombre: 'Francisco Valenzuela Rojas', nombreJefe: '', correoJefe: '', nombreEvaluador: '', correoEvaluador: '', estado: 'activo', selected: true },
  { id: 2, rut: '12345678-9', nombre: 'Carlos Muñoz Soto', nombreJefe: '', correoJefe: '', nombreEvaluador: '', correoEvaluador: '', estado: 'activo', selected: true },
  { id: 3, rut: '16789012-3', nombre: 'Ana Torres Vidal', nombreJefe: '', correoJefe: '', nombreEvaluador: '', correoEvaluador: '', estado: 'activo', selected: true },
  { id: 4, rut: '19876543-2', nombre: 'Roberto Silva Pinto', nombreJefe: '', correoJefe: '', nombreEvaluador: '', correoEvaluador: '', estado: 'eliminado', selected: true },
  { id: 5, rut: '14567890-1', nombre: 'María José Contreras', nombreJefe: '', correoJefe: '', nombreEvaluador: '', correoEvaluador: '', estado: 'anulado', selected: true },
  { id: 6, rut: '17654321-8', nombre: 'Diego Pérez Vega', nombreJefe: '', correoJefe: '', nombreEvaluador: '', correoEvaluador: '', estado: 'activo', selected: true },
  { id: 7, rut: '15432198-7', nombre: 'Valentina Rojas Castro', nombreJefe: '', correoJefe: '', nombreEvaluador: '', correoEvaluador: '', estado: 'anulado', selected: true },
];

const TransferenciaParticipantesModal: React.FC<{
  open: boolean;
  row: AsignarCursoRow | null;
  initial: TransParticipante[];
  initialEvaluador: boolean;
  initialExcluirEliminados?: boolean;
  initialExcluirAnulados?: boolean;
  onClose: () => void;
  onSave: (list: TransParticipante[], evaluador: boolean, excluirEliminados: boolean, excluirAnulados: boolean) => void;
}> = ({ open, row, initial, initialEvaluador, initialExcluirEliminados, initialExcluirAnulados, onClose, onSave }) => {
  const [list, setList] = useState<TransParticipante[]>(initial);
  const [evaluador, setEvaluador] = useState(initialEvaluador);
  const [search, setSearch] = useState('');
  const [excluirEliminados, setExcluirEliminados] = useState(!!initialExcluirEliminados);
  const [excluirAnulados, setExcluirAnulados] = useState(!!initialExcluirAnulados);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (open) {
      setList(initial);
      setEvaluador(initialEvaluador);
      setSearch('');
      setExcluirEliminados(!!initialExcluirEliminados);
      setExcluirAnulados(!!initialExcluirAnulados);
      setShowErrors(false);
    }
  }, [open, initial, initialEvaluador, initialExcluirEliminados, initialExcluirAnulados]);

  if (!row) return null;

  const update = (id: number, patch: Partial<TransParticipante>) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const eliminados = list.filter((p) => p.estado === 'eliminado').length;
  const anulados = list.filter((p) => p.estado === 'anulado').length;
  const activos = list.filter((p) => p.estado === 'activo').length;
  const isVisible = (p: TransParticipante) =>
    !(excluirEliminados && p.estado === 'eliminado') &&
    !(excluirAnulados && p.estado === 'anulado');
  const visible = list
    .filter(isVisible)
    .filter((p) =>
      !search.trim() || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.rut.toLowerCase().includes(search.toLowerCase())
    );
  const correoKey = evaluador ? 'correoEvaluador' : 'correoJefe';
  const nombreKey = evaluador ? 'nombreEvaluador' : 'nombreJefe';
  const visibleAll = list.filter(isVisible);
  const pendientes = visibleAll.filter((p) => !p[correoKey].trim() || !EMAIL_RE.test(p[correoKey].trim())).length;

  const handleSave = () => {
    const missing = visibleAll.some((p) => !p[correoKey].trim());
    const invalid = visibleAll.some((p) => p[correoKey].trim() && !EMAIL_RE.test(p[correoKey].trim()));
    if (missing || invalid) {
      setShowErrors(true);
      toast.warning('Corrige los correos de todos los participantes visibles antes de guardar.');
      return;
    }
    onSave(list, evaluador, excluirEliminados, excluirAnulados);
  };

  const showSearch = visible.length > 8 || search.trim().length > 0;

  const exclBtnStyle = (active: boolean) => active
    ? { background: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA', display: 'inline-flex', alignItems: 'center', gap: 6 } as const
    : { display: 'inline-flex', alignItems: 'center', gap: 6 } as const;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={580}
      footer={null}
      styles={{ body: { padding: 0 } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins' }}>
          <Users size={20} color={TEAL} weight="regular" />
          <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Participantes — Transferencia</span>
          <span style={{ background: '#F0FDF4', color: '#15803D', borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 500, marginLeft: 4 }}>Transferencia</span>
        </div>
      }
    >
      <div style={{ fontFamily: 'Poppins' }}>
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div style={{ background: '#F0FDF9', borderRadius: 8, padding: '10px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Curso: {row.curso}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Encuesta: Encuesta de Transferencia Estándar v2.0</div>
          </div>

          {/* Selector destinatario */}
          <div style={{ marginBottom: 12 }}>
            <Segmented
              block
              value={evaluador ? 'evaluador' : 'jefe'}
              onChange={(v) => setEvaluador(v === 'evaluador')}
              options={[
                {
                  value: 'jefe',
                  label: (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Poppins', fontSize: 13, fontWeight: !evaluador ? 600 : 500 }}>
                      <UserCircle size={16} weight="regular" />
                      Jefe
                    </span>
                  ),
                },
                {
                  value: 'evaluador',
                  label: (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Poppins', fontSize: 13, fontWeight: evaluador ? 600 : 500 }}>
                      <UserFocus size={16} weight="regular" />
                      Evaluador
                    </span>
                  ),
                },
              ]}
              style={{ background: '#F3F4F6' }}
              className="encuestas-segmented-teal"
            />
            <div style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: 12, color: '#6B7280', marginTop: 8 }}>
              {evaluador
                ? 'El correo se enviará al evaluador asignado al participante'
                : 'El correo se enviará al jefe directo del participante'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                type="primary"
                size="small"
                icon={<CheckSquare size={14} weight="regular" />}
                onClick={() => setList((prev) => prev.map((p) => (p.estado === 'activo' ? { ...p, selected: true } : p)))}
                style={{ background: TEAL, borderColor: TEAL, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                Seleccionar Todos
              </Button>
              <Button
                size="small"
                icon={<UserMinus size={14} weight="regular" />}
                danger={!excluirEliminados}
                onClick={() => setExcluirEliminados((v) => !v)}
                style={exclBtnStyle(excluirEliminados)}
              >
                {excluirEliminados ? `Mostrando sin Eliminados (${eliminados})` : `Excluir Eliminados (0)`}
              </Button>
              <Button
                size="small"
                icon={<ProhibitInset size={14} weight="regular" />}
                danger={!excluirAnulados}
                onClick={() => setExcluirAnulados((v) => !v)}
                style={exclBtnStyle(excluirAnulados)}
              >
                {excluirAnulados ? `Mostrando sin Anulados (${anulados})` : `Excluir Anulados (0)`}
              </Button>
            </div>
            <div style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B7280' }}>
              Mostrando {visible.length} participantes ({activos} activos · {excluirEliminados ? 0 : eliminados} eliminados · {excluirAnulados ? 0 : anulados} anulados)
            </div>
            {showSearch && (
              <Input
                prefix={<MagnifyingGlass size={14} color="#9CA3AF" weight="regular" />}
                placeholder="Filtrar por nombre o RUT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', fontFamily: 'Poppins' }}
              />
            )}
          </div>
        </div>

        <div style={{ maxHeight: 'calc(80vh - 320px)', overflowY: 'auto', overflowX: 'hidden', padding: '0 24px' }}>
          {visible.map((p) => {
            const isElim = p.estado === 'eliminado';
            const isAnul = p.estado === 'anulado';
            const isInactive = isElim || isAnul;
            const nombreVal = (p as any)[nombreKey] as string;
            const correoVal = (p as any)[correoKey] as string;
            const cardBg = isElim ? '#FEF2F2' : isAnul ? '#FFF7ED' : '#FFFFFF';
            return (
              <div
                key={p.id}
                style={{
                  background: cardBg,
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  padding: '14px 16px',
                  marginBottom: 10,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#99F6E4'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Checkbox
                    checked={p.estado === 'activo' ? p.selected : false}
                    disabled={isInactive}
                    onChange={(e) => update(p.id, { selected: e.target.checked })}
                  />
                  <span style={{
                    background: '#F3F4F6', color: '#374151', borderRadius: 6,
                    padding: '2px 8px', fontFamily: 'Poppins', fontSize: 12, fontWeight: 500,
                  }}>{p.rut}</span>
                  <span style={{
                    fontFamily: 'Poppins', fontSize: 14, fontWeight: 600,
                    color: '#111827',
                  }}>{p.nombre}</span>
                  {isElim && (
                    <span style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 999, padding: '2px 8px', fontFamily: 'Poppins', fontSize: 11, fontWeight: 500 }}>Eliminado</span>
                  )}
                  {isAnul && (
                    <span style={{ background: '#FED7AA', color: '#9A3412', borderRadius: 999, padding: '2px 8px', fontFamily: 'Poppins', fontSize: 11, fontWeight: 500 }}>Anulado</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>
                      {evaluador ? 'Nombre Evaluador' : 'Nombre Jefe'}
                    </div>
                    <Input
                      size="small"
                      value={nombreVal}
                      placeholder={evaluador ? 'Nombre del evaluador' : 'Nombre del jefe directo'}
                      onChange={(e) => update(p.id, { [nombreKey]: e.target.value } as any)}
                      style={{ width: '100%', fontFamily: 'Poppins' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Poppins', fontSize: 11, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>
                      {evaluador ? 'Correo Evaluador' : 'Correo Jefe'}
                    </div>
                    <EmailInput
                      value={correoVal}
                      placeholder={evaluador ? 'correo@evaluador.cl' : 'correo@jefe.cl'}
                      onChange={(nv) => update(p.id, { [correoKey]: nv } as any)}
                      forceError={showErrors}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {pendientes > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <Warning size={14} color="#F59E0B" weight="fill" />
              <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#D97706' }}>
                {pendientes} participantes sin correo de {evaluador ? 'evaluador' : 'jefe'} ingresado
              </span>
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', bottom: 0, background: '#ffffff', borderTop: '1px solid #E5E7EB', padding: '12px 24px' }}>
          <Button
            type="primary"
            block
            icon={<FloppyDisk size={16} weight="regular" />}
            onClick={handleSave}
            style={{ background: TEAL, borderColor: TEAL, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            Guardar Participantes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const AsignarEncuestasTab: React.FC = () => {
  const { selectedHoldingId, selectedCompanyId } = useOTICFilter();
  const currentMonthRange = (): [any, any] => [dayjs().startOf('month'), dayjs().endOf('month')];
  const [dates, setDates] = useState<any>(currentMonthRange());
  const [searched, setSearched] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  
  const [showTech, setShowTech] = useState(false);
  const [rows, setRows] = useState<AsignarCursoRow[]>(ASIGNAR_DATA);
  const [asignModal, setAsignModal] = useState<{ kind: AsignKind; row: AsignarCursoRow } | null>(null);
  const [previewModal, setPreviewModal] = useState<{ kind: AsignKind; row: AsignarCursoRow } | null>(null);
  const [emailPreviewModal, setEmailPreviewModal] = useState<{ kind: AsignKind; row: AsignarCursoRow } | null>(null);
  // Per-row asign form state, keyed by `${inscripcion}-${kind}`
  const [asignForms, setAsignForms] = useState<Record<string, AsignFormState>>({});
  // Per-row participants state
  const [satisParts, setSatisParts] = useState<Record<number, SatisParticipante[]>>({});
  const [transParts, setTransParts] = useState<Record<number, TransParticipante[]>>({});
  const [transEvaluador, setTransEvaluador] = useState<Record<number, boolean>>({});
  // Per-row exclusion state, keyed by `${inscripcion}-${kind}`
  const [exclusionState, setExclusionState] = useState<Record<string, { excluirEliminados: boolean; excluirAnulados: boolean }>>({});
  const [participantsModal, setParticipantsModal] = useState<{ kind: AsignKind; row: AsignarCursoRow } | null>(null);
  const [resendModal, setResendModal] = useState<{ kind: AsignKind; row: AsignarCursoRow } | null>(null);
  const [resendSelected, setResendSelected] = useState<string[]>([]);
  const [resendConfirmOpen, setResendConfirmOpen] = useState(false);
  const [resendEmails, setResendEmails] = useState<Record<string, string>>({});
  const [resendOriginalEmails, setResendOriginalEmails] = useState<Record<string, string>>({});
  const [resendEmailErrors, setResendEmailErrors] = useState<Record<string, 'empty' | 'invalid' | null>>({});
  const [resendEmailValid, setResendEmailValid] = useState<Record<string, boolean>>({});

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const validateResendEmail = (rut: string, value: string, flashGreen = false) => {
    const v = value.trim();
    let err: 'empty' | 'invalid' | null = null;
    if (!v) err = 'empty';
    else if (!isValidEmail(v)) err = 'invalid';
    setResendEmailErrors((p) => ({ ...p, [rut]: err }));
    if (!err && flashGreen) {
      setResendEmailValid((p) => ({ ...p, [rut]: true }));
      setTimeout(() => setResendEmailValid((p) => ({ ...p, [rut]: false })), 1500);
    }
    return err;
  };

  const formKey = (insc: number, kind: AsignKind) => `${insc}-${kind}`;
  const getForm = (insc: number, kind: AsignKind): AsignFormState =>
    asignForms[formKey(insc, kind)] ?? { relator: '', fecha: null, participantesCount: 0 };
  const patchForm = (insc: number, kind: AsignKind, patch: Partial<AsignFormState>) =>
    setAsignForms((prev) => ({ ...prev, [formKey(insc, kind)]: { ...getForm(insc, kind), ...patch } }));

  // Auto-load when both holding+company are selected
  useEffect(() => {
    setSearch('');
    setPage(1);
    setDateError(false);
    if (selectedHoldingId && selectedCompanyId) {
      setDates(currentMonthRange());
      setSearched(true);
    } else {
      setSearched(false);
    }
  }, [selectedHoldingId, selectedCompanyId]);

  const handleBuscar = () => {
    if (!dates || !dates[0] || !dates[1]) {
      setDateError(true);
      return;
    }
    setDateError(false);
    setSearched(true);
    setPage(1);
  };

  // Apply text search only (used for pill counts and final filter)
  const searched_rows = useMemo(() => {
    if (!searched) return [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.curso, String(r.inscripcion), String(r.sc ?? ''), String(r.sencenet ?? '')]
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [searched, search, rows]);

  const isAsignado = (r: AsignarCursoRow) => r.satisfaccion === 'asignada' && r.transferencia === 'asignada';
  const isSinAsignar = (r: AsignarCursoRow) => r.satisfaccion === 'sin_asignar' || r.transferencia === 'sin_asignar';

  const isSatSin = (r: AsignarCursoRow) => r.satisfaccion === 'sin_asignar';
  const isTransSin = (r: AsignarCursoRow) => r.transferencia === 'sin_asignar';

  const filtered = useMemo(() => searched_rows, [searched_rows]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleResend = (kind: AsignKind) => {
    message.success('Encuesta reenviada exitosamente');
  };

  const renderActionCell = (
    state: 'sin_asignar' | 'asignada',
    kind: AsignKind,
    row: AsignarCursoRow
  ) => {
    if (state === 'sin_asignar') {
      return (
        <Tooltip title="Sin asignar — clic para asignar">
          <button
            onClick={() => setAsignModal({ kind, row })}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: 4, borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <GearSix size={22} color="#9CA3AF" weight="regular" />
          </button>
        </Tooltip>
      );
    }
    return (
      <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <Tooltip title="Reenviar encuesta a participantes">
          <button
            onClick={() => {
              const pendientes = RESEND_PENDIENTES.map((p) => p.rut);
              const emails: Record<string, string> = {};
              RESEND_PENDIENTES.forEach((p) => { emails[p.rut] = p.correo; });
              setResendSelected(pendientes);
              setResendEmails(emails);
              setResendOriginalEmails({ ...emails });
              setResendEmailErrors({});
              setResendEmailValid({});
              setResendModal({ kind, row });
            }}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'inline-flex' }}
          >
            <PaperPlaneTilt size={22} color={TEAL} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip title="Ver previsualización">
          <button onClick={() => setPreviewModal({ kind, row })} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'inline-flex' }}>
            <Eye size={22} color={TEAL} weight="regular" />
          </button>
        </Tooltip>
      </div>
    );
  };

  const headerLabel = (text: string) => (
    <span style={{ whiteSpace: 'nowrap', fontFamily: 'Poppins', fontSize: 12, fontWeight: 600, color: '#374151' }}>{text}</span>
  );

  const allColumns: any[] = [
    {
      key: 'inscripcion',
      title: headerLabel('N° Inscripción'),
      dataIndex: 'inscripcion', width: 90,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</span>,
    },
    {
      key: 'sc',
      title: headerLabel('Código SC'),
      dataIndex: 'sc', width: 100,
      render: (v: number | null) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v ?? '—'}</span>,
    },
    {
      key: 'sencenet',
      title: headerLabel('Código Sencenet'),
      dataIndex: 'sencenet', width: 110,
      render: (v: number | null) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v ?? '—'}</span>,
    },
    {
      key: 'periodo',
      title: headerLabel('Período'),
      width: 140,
      onCell: () => ({ style: { whiteSpace: 'nowrap', overflow: 'visible' } as React.CSSProperties }),
      render: (_: unknown, row: AsignarCursoRow) => (
        <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>
          {row.inicio} → {row.termino}
        </span>
      ),
    },
    {
      key: 'curso',
      title: headerLabel('Curso'),
      dataIndex: 'curso',
      width: 220,
      render: (v: string) => (
        <Tooltip title={v}>
          <span
            style={{
              fontFamily: 'Poppins', fontSize: 13, color: '#374151', lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              overflow: 'hidden', wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: 220,
            }}
          >{v}</span>
        </Tooltip>
      ),
    },
    {
      key: 'tipo',
      title: headerLabel('Tipo'),
      dataIndex: 'tipo', width: 85, align: 'center' as const,
      render: (v: 'Sence' | 'Curso Interno') => {
        const sence = v === 'Sence';
        return (
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 999,
            background: sence ? '#EFF6FF' : '#F3F4F6',
            color: sence ? '#1D4ED8' : '#374151',
            fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
          }}>{v}</span>
        );
      },
    },
    {
      key: 'modalidad',
      title: headerLabel('Modalidad'),
      dataIndex: 'modalidad', width: 90, align: 'center' as const,
      render: (v: 'E-Learning' | 'Presencial') => {
        const elearn = v === 'E-Learning';
        return (
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 999,
            background: elearn ? '#F0FDF9' : '#F3F4F6',
            color: elearn ? TEAL : '#374151',
            fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
          }}>{v}</span>
        );
      },
    },
    {
      key: 'participantes',
      title: headerLabel('Participantes'),
      dataIndex: 'participantes', width: 75, align: 'center' as const,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</span>,
    },
    {
      key: 'satisfaccion',
      title: headerLabel('Satisfacción'),
      dataIndex: 'satisfaccion', width: 80, align: 'center' as const,
      render: (v: 'sin_asignar' | 'asignada', row: AsignarCursoRow) =>
        renderActionCell(v, 'Satisfacción', row),
    },
    {
      key: 'transferencia',
      title: headerLabel('Transferencia'),
      dataIndex: 'transferencia', width: 80, align: 'center' as const,
      render: (v: 'sin_asignar' | 'asignada', row: AsignarCursoRow) =>
        renderActionCell(v, 'Transferencia', row),
    },
  ];

  const columns = allColumns.filter((c) => showTech || (c.key !== 'sc' && c.key !== 'sencenet'));

  // Empty states based on filter selection
  if (!selectedHoldingId && !selectedCompanyId) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Asignar Encuestas</h2>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
            Gestiona la asignación de encuestas de satisfacción y transferencia por curso
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24">
          <UserPlus size={56} color="#D1D5DB" weight="regular" />
          <p className="mt-4 mb-1" style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 500, color: '#6B7280' }}>Selecciona un Holding y Empresa</p>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>Usa los filtros del menú superior para cargar los cursos disponibles.</p>
        </div>
      </div>
    );
  }

  if (selectedHoldingId && !selectedCompanyId) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Asignar Encuestas</h2>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
            Gestiona la asignación de encuestas de satisfacción y transferencia por curso
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-24">
          <Buildings size={56} color="#D1D5DB" weight="regular" />
          <p className="mt-4 mb-1" style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 500, color: '#6B7280' }}>Selecciona una Empresa</p>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>Elige una empresa del filtro superior para ver sus cursos.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Poppins', fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Asignar Encuestas</h2>
        <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
          Gestiona la asignación de encuestas de satisfacción y transferencia por curso
        </p>
      </div>

      {/* Selector de Período */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
        <div style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
          Selección de Período
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <DatePicker.RangePicker
              value={dates}
              onChange={(v) => { setDates(v); if (v && v[0] && v[1]) setDateError(false); }}
              format="DD-MM-YYYY"
              placeholder={['Fecha Inicio', 'Fecha Término']}
              style={{ width: 340 }}
            />
            {dateError && (
              <div style={{ color: '#DC2626', fontFamily: 'Poppins', fontSize: 12, marginTop: 6 }}>
                Debes seleccionar un período para buscar
              </div>
            )}
          </div>
          <Button
            type="primary"
            icon={<MagnifyingGlass size={16} weight="regular" />}
            onClick={handleBuscar}
            style={{ background: TEAL, borderColor: TEAL, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            Buscar
          </Button>
        </div>
      </div>

      {searched && (
        <>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
              {filtered.length} cursos encontrados
            </span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Input
                prefix={<MagnifyingGlass size={14} color="#9CA3AF" weight="regular" />}
                placeholder="Buscar curso..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ width: 240, fontFamily: 'Poppins' }}
              />
              <Button
                size="small"
                onClick={() => setShowTech((s) => !s)}
                icon={<Columns size={14} weight="regular" />}
                style={
                  showTech
                    ? { background: '#F0FDF9', borderColor: '#F0FDF9', color: TEAL, fontFamily: 'Poppins', display: 'inline-flex', alignItems: 'center', gap: 6 }
                    : { fontFamily: 'Poppins', display: 'inline-flex', alignItems: 'center', gap: 6 }
                }
              >
                Columnas técnicas
              </Button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>Mostrar</span>
                <Select
                  value={pageSize}
                  onChange={(v) => { setPageSize(v); setPage(1); }}
                  style={{ width: 80 }}
                  options={[{ value: 10, label: '10' }, { value: 25, label: '25' }, { value: 50, label: '50' }]}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
            <Table
              columns={columns}
              dataSource={paged}
              rowKey="inscripcion"
              pagination={false}
              tableLayout="fixed"
              onRow={(row: AsignarCursoRow) => {
                let borderColor = 'transparent';
                if (isAsignado(row)) borderColor = '#10B981';
                else if (row.satisfaccion === 'asignada' || row.transferencia === 'asignada') borderColor = '#F59E0B';
                return { style: { boxShadow: borderColor === 'transparent' ? 'none' : `inset 3px 0 0 0 ${borderColor}` } } as any;
              }}
              locale={{
                emptyText: (
                  <div className="flex flex-col items-center justify-center py-12">
                    <MagnifyingGlass size={48} color="#D1D5DB" weight="regular" />
                    <p className="mt-3 mb-1" style={{ fontFamily: 'Poppins', fontSize: 14, color: '#6B7280' }}>No se encontraron cursos</p>
                    <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>Intenta con otro término de búsqueda o ajusta el período seleccionado</p>
                  </div>
                ),
              }}
            />
          </div>

          {filtered.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
                Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filtered.length)} de {filtered.length} cursos
              </span>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={filtered.length}
                showSizeChanger={false}
                onChange={(p) => setPage(p)}
              />
            </div>
          )}
        </>
      )}

      {(() => {
        const insc = asignModal?.row.inscripcion;
        const kind = asignModal?.kind;
        let sinCorreo = 0;
        let total = 0;
        if (insc && kind) {
          const excl = exclusionState[`${insc}-${kind}`] ?? { excluirEliminados: false, excluirAnulados: false };
          if (kind === 'Satisfacción') {
            const list = satisParts[insc] ?? buildSatisDefault(insc);
            const visible = list.filter((p) =>
              !(excl.excluirEliminados && p.estado === 'eliminado') &&
              !(excl.excluirAnulados && p.estado === 'anulado')
            );
            total = visible.length;
            sinCorreo = visible.filter((p) => !p.correo.trim() || !EMAIL_RE.test(p.correo.trim())).length;
          } else {
            const list = transParts[insc] ?? buildTransDefault(insc);
            const evalKind = transEvaluador[insc] ?? false;
            const correoKey = evalKind ? 'correoEvaluador' : 'correoJefe';
            const visible = list.filter((p) =>
              !(excl.excluirEliminados && p.estado === 'eliminado') &&
              !(excl.excluirAnulados && p.estado === 'anulado')
            );
            total = visible.length;
            sinCorreo = visible.filter((p) => !p[correoKey].trim() || !EMAIL_RE.test(p[correoKey].trim())).length;
          }
        }
        return (
          <AsignarModal
            open={!!asignModal}
            kind={asignModal?.kind ?? null}
            row={asignModal?.row ?? null}
            form={asignModal ? getForm(asignModal.row.inscripcion, asignModal.kind) : { relator: '', fecha: null, participantesCount: 0 }}
            sinCorreo={sinCorreo}
            totalParticipantes={total}
            onChange={(patch) => { if (asignModal) patchForm(asignModal.row.inscripcion, asignModal.kind, patch); }}
            onClose={() => setAsignModal(null)}
            onOpenParticipants={() => {
              if (!asignModal) return;
              setParticipantsModal({ kind: asignModal.kind, row: asignModal.row });
              setAsignModal(null);
            }}
            onPreviewEmail={() => {
              if (!asignModal) return;
              setEmailPreviewModal({ kind: asignModal.kind, row: asignModal.row });
            }}
            onSave={() => {
              if (!asignModal) return;
              const { kind, row } = asignModal;
              setRows((prev) => prev.map((r) =>
                r.inscripcion === row.inscripcion
                  ? { ...r, [kind === 'Satisfacción' ? 'satisfaccion' : 'transferencia']: 'asignada' as const }
                  : r
              ));
              // Compute participants with email registered
              let withEmail = 0;
              if (kind === 'Satisfacción') {
                const list = satisParts[row.inscripcion] ?? buildSatisDefault(row.inscripcion);
                const excl = exclusionState[`${row.inscripcion}-Satisfacción`] ?? { excluirEliminados: false, excluirAnulados: false };
                withEmail = list.filter((p) =>
                  !(excl.excluirEliminados && p.estado === 'eliminado') &&
                  !(excl.excluirAnulados && p.estado === 'anulado') &&
                  p.correo.trim() && EMAIL_RE.test(p.correo.trim())
                ).length;
              } else {
                const list = transParts[row.inscripcion] ?? buildTransDefault(row.inscripcion);
                const excl = exclusionState[`${row.inscripcion}-Transferencia`] ?? { excluirEliminados: false, excluirAnulados: false };
                const evalKind = transEvaluador[row.inscripcion] ?? false;
                const correoKey = evalKind ? 'correoEvaluador' : 'correoJefe';
                withEmail = list.filter((p) =>
                  !(excl.excluirEliminados && p.estado === 'eliminado') &&
                  !(excl.excluirAnulados && p.estado === 'anulado') &&
                  p[correoKey].trim() && EMAIL_RE.test(p[correoKey].trim())
                ).length;
              }
              setAsignModal(null);
              toast.success(`Encuesta de ${kind} asignada correctamente`);
              setTimeout(() => {
                toast.info(`Correo enviado a ${withEmail} participantes con el link de la encuesta.`, {
                  duration: 4000,
                  icon: <EnvelopeSimple size={18} color="#2563EB" weight="regular" />,
                  style: { background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E3A8A' },
                });
              }, 200);
            }}
          />
        );
      })()}

      <SatisfaccionParticipantesModal
        open={!!participantsModal && participantsModal.kind === 'Satisfacción'}
        row={participantsModal?.row ?? null}
        initial={participantsModal && participantsModal.kind === 'Satisfacción'
          ? (satisParts[participantsModal.row.inscripcion] ?? buildSatisDefault(participantsModal.row.inscripcion))
          : DEFAULT_SATIS}
        initialExcluirEliminados={participantsModal ? exclusionState[`${participantsModal.row.inscripcion}-Satisfacción`]?.excluirEliminados : false}
        initialExcluirAnulados={participantsModal ? exclusionState[`${participantsModal.row.inscripcion}-Satisfacción`]?.excluirAnulados : false}
        onClose={() => {
          if (participantsModal) {
            setAsignModal({ kind: participantsModal.kind, row: participantsModal.row });
          }
          setParticipantsModal(null);
        }}
        onSave={(list, excluirEliminados, excluirAnulados) => {
          if (!participantsModal) return;
          const { row, kind } = participantsModal;
          setSatisParts((prev) => ({ ...prev, [row.inscripcion]: list }));
          setExclusionState((prev) => ({ ...prev, [`${row.inscripcion}-${kind}`]: { excluirEliminados, excluirAnulados } }));
          const visible = list.filter((p) =>
            !(excluirEliminados && p.estado === 'eliminado') &&
            !(excluirAnulados && p.estado === 'anulado')
          );
          patchForm(row.inscripcion, kind, { participantesCount: visible.length });
          toast.success('Participantes guardados correctamente');
          setAsignModal({ kind, row });
          setParticipantsModal(null);
        }}
      />

      <TransferenciaParticipantesModal
        open={!!participantsModal && participantsModal.kind === 'Transferencia'}
        row={participantsModal?.row ?? null}
        initial={participantsModal && participantsModal.kind === 'Transferencia'
          ? buildTransDefault(participantsModal.row.inscripcion)
          : DEFAULT_TRANS}
        initialEvaluador={participantsModal ? (transEvaluador[participantsModal.row.inscripcion] ?? false) : false}
        initialExcluirEliminados={participantsModal ? exclusionState[`${participantsModal.row.inscripcion}-Transferencia`]?.excluirEliminados : false}
        initialExcluirAnulados={participantsModal ? exclusionState[`${participantsModal.row.inscripcion}-Transferencia`]?.excluirAnulados : false}
        onClose={() => {
          if (participantsModal) {
            setAsignModal({ kind: participantsModal.kind, row: participantsModal.row });
          }
          setParticipantsModal(null);
        }}
        onSave={(list, evaluador, excluirEliminados, excluirAnulados) => {
          if (!participantsModal) return;
          const { row, kind } = participantsModal;
          setTransParts((prev) => ({ ...prev, [row.inscripcion]: list }));
          setTransEvaluador((prev) => ({ ...prev, [row.inscripcion]: evaluador }));
          setExclusionState((prev) => ({ ...prev, [`${row.inscripcion}-${kind}`]: { excluirEliminados, excluirAnulados } }));
          const visible = list.filter((p) =>
            !(excluirEliminados && p.estado === 'eliminado') &&
            !(excluirAnulados && p.estado === 'anulado')
          );
          patchForm(row.inscripcion, kind, { participantesCount: visible.length });
          toast.success('Participantes guardados correctamente');
          setAsignModal({ kind, row });
          setParticipantsModal(null);
        }}
      />

      <PreviewModal
        open={!!previewModal}
        onClose={() => setPreviewModal(null)}
        encuesta={previewModal ? {
          id: ENCUESTA_INFO[previewModal.kind].id,
          nombre: ENCUESTA_INFO[previewModal.kind].nombre,
          origen: 'OTIC',
          cliente: '',
          tipo: previewModal.kind,
          version: 2,
          vigente: 'Si',
        } : null}
      />

      {(() => {
        if (!emailPreviewModal) return null;
        const { kind, row } = emailPreviewModal;
        const form = getForm(row.inscripcion, kind);
        // Pick first participant from the appropriate list
        let firstName = 'Participante';
        if (kind === 'Satisfacción') {
          const list = satisParts[row.inscripcion] ?? buildSatisDefault(row.inscripcion);
          firstName = list[0]?.nombre || firstName;
        } else {
          const list = transParts[row.inscripcion] ?? buildTransDefault(row.inscripcion);
          firstName = list[0]?.nombre || firstName;
        }
        const fechaStr = form.fecha ? dayjs(form.fecha).format('DD-MM-YYYY') : '—';
        return (
          <Modal
            open={!!emailPreviewModal}
            onCancel={() => setEmailPreviewModal(null)}
            width={640}
            title={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins' }}>
                <EnvelopeSimple size={20} color={TEAL} weight="regular" />
                <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Vista previa del correo</span>
              </span>
            }
            footer={[
              <Button key="close" onClick={() => setEmailPreviewModal(null)} block>
                Cerrar
              </Button>,
            ]}
          >
            <div style={{ background: '#F9FAFB', padding: 24, borderRadius: 8 }}>
              <div style={{ background: '#FFFFFF', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <EncuestaEmailContent
                  data={{
                    participante: firstName,
                    curso: row.curso,
                    fecha: fechaStr,
                    relator: form.relator || '—',
                  }}
                  onResponderClick={() => {}}
                />
              </div>
            </div>
          </Modal>
        );
      })()}

      <Modal
        open={!!resendModal}
        onCancel={() => { setResendModal(null); setResendConfirmOpen(false); }}
        width={640}
        footer={null}
        title={
          resendModal && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Poppins' }}>
              <PaperPlaneTilt size={20} color={TEAL} weight="regular" />
              <span style={{ fontWeight: 600, color: '#111827' }}>Reenviar Encuesta</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: resendModal.kind === 'Satisfacción' ? '#DBEAFE' : '#D1FAE5',
                  color: resendModal.kind === 'Satisfacción' ? '#1E3A8A' : '#065F46',
                }}
              >
                {resendModal.kind}
              </span>
            </div>
          )
        }
      >
        {resendModal && (
          <div style={{ fontFamily: 'Poppins' }}>
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Curso: {resendModal.row.curso}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Encuesta: {ENCUESTA_INFO[resendModal.kind].nombre}</div>
            </div>

            {RESEND_PENDIENTES.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={56} color="#10B981" weight="regular" />
                <div style={{ fontSize: 15, fontWeight: 500, color: '#065F46', marginTop: 12 }}>¡Todos los participantes han respondido!</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>No hay participantes pendientes de respuesta en este curso.</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                  <Button onClick={() => setResendModal(null)}>Cerrar</Button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F3F4F6', padding: '4px 10px', borderRadius: 999, fontSize: 12, color: '#374151' }}>
                    <Users size={14} color="#6B7280" weight="regular" /> {RESEND_TOTAL} total
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEF3C7', padding: '4px 10px', borderRadius: 999, fontSize: 12, color: '#D97706' }}>
                    <EnvelopeSimple size={14} color="#D97706" weight="regular" /> {RESEND_PENDIENTES.length} pendientes de respuesta
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#D1FAE5', padding: '4px 10px', borderRadius: 999, fontSize: 12, color: '#065F46' }}>
                    <CheckCircle size={14} color="#10B981" weight="regular" /> {RESEND_RESPONDIDOS} ya respondieron
                  </span>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Participantes que recibirán el reenvío</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>Solo se muestran participantes con correo registrado que aún no han respondido la encuesta.</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: '#6B7280' }}>
                    <Info size={14} color="#9CA3AF" weight="regular" />
                    Puedes editar el correo de un participante antes de confirmar el reenvío. Los cambios se guardarán al hacer clic en Reenviar a seleccionados.
                  </div>
                </div>

                <Table
                  size="small"
                  pagination={false}
                  rowKey="rut"
                  dataSource={RESEND_PENDIENTES}
                  style={{ border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff' }}
                  rowSelection={{
                    selectedRowKeys: resendSelected,
                    onChange: (keys) => setResendSelected(keys as string[]),
                  }}
                  columns={[
                    { title: 'RUT', dataIndex: 'rut', width: 120, render: (v: string) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span> },
                    { title: 'Nombre', dataIndex: 'nombre', render: (v: string) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</span> },
                    {
                      title: 'Correo', dataIndex: 'correo',
                      render: (_v: string, rec: { rut: string; correo: string }) => {
                        const cur = resendEmails[rec.rut] ?? rec.correo;
                        const err = resendEmailErrors[rec.rut];
                        const valid = resendEmailValid[rec.rut];
                        const edited = (resendOriginalEmails[rec.rut] ?? rec.correo) !== cur;
                        const borderColor = err === 'empty' ? '#F59E0B' : err === 'invalid' ? '#EF4444' : valid ? '#10B981' : undefined;
                        const tip = err === 'empty' ? 'El correo no puede estar vacío' : err === 'invalid' ? 'Formato de correo inválido. Ej: nombre@empresa.cl' : '';
                        return (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: '100%' }}>
                            <Tooltip title={tip} open={tip ? undefined : false}>
                              <Input
                                size="small"
                                value={cur}
                                prefix={<EnvelopeSimple size={14} color="#9CA3AF" weight="regular" />}
                                onChange={(e) => {
                                  setResendEmails((p) => ({ ...p, [rec.rut]: e.target.value }));
                                  if (resendEmailErrors[rec.rut]) setResendEmailErrors((p) => ({ ...p, [rec.rut]: null }));
                                }}
                                onBlur={(e) => validateResendEmail(rec.rut, e.target.value, true)}
                                style={{ fontFamily: 'Poppins', fontSize: 13, borderColor, boxShadow: borderColor ? `0 0 0 2px ${borderColor}22` : undefined }}
                              />
                            </Tooltip>
                            {edited && (
                              <Tooltip title="Correo editado">
                                <PencilSimple size={12} color={TEAL} weight="regular" />
                              </Tooltip>
                            )}
                          </div>
                        );
                      },
                    },
                    {
                      title: 'Estado',
                      dataIndex: 'estado',
                      render: () => (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FEF3C7', color: '#D97706', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                          Pendiente
                        </span>
                      ),
                    },
                  ]}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
                  <Button onClick={() => setResendModal(null)}>Cancelar</Button>
                  {(() => {
                    const editedCount = resendSelected.filter((r) => (resendOriginalEmails[r] ?? '') !== (resendEmails[r] ?? '')).length;
                    return (
                      <Popconfirm
                        open={resendConfirmOpen}
                        onOpenChange={setResendConfirmOpen}
                        title={<span style={{ fontFamily: 'Poppins', fontWeight: 600 }}>¿Confirmar reenvío?</span>}
                        description={
                          <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B7280' }}>
                            {editedCount > 0
                              ? `Se enviará la encuesta a ${resendSelected.length} participantes seleccionados. Los correos editados serán actualizados en el sistema.`
                              : `Se reenviará la encuesta a ${resendSelected.length} participantes seleccionados.`}
                          </span>
                        }
                        okText="Sí, reenviar"
                        cancelText="Cancelar"
                        okButtonProps={{ style: { background: TEAL, borderColor: TEAL } }}
                        onConfirm={() => {
                          const n = resendSelected.length;
                          setResendModal(null);
                          setResendConfirmOpen(false);
                          toast.success(
                            editedCount > 0
                              ? `Encuesta reenviada exitosamente a ${n} participantes. ${editedCount} correos actualizados.`
                              : `Encuesta reenviada exitosamente a ${n} participantes.`
                          );
                        }}
                      >
                        <Button
                          type="primary"
                          disabled={resendSelected.length === 0}
                          icon={<PaperPlaneTilt size={16} weight="regular" />}
                          style={{ background: TEAL, borderColor: TEAL }}
                          onClick={(e) => {
                            // Validate selected emails before opening Popconfirm
                            const errs: Record<string, 'empty' | 'invalid' | null> = {};
                            let hasError = false;
                            resendSelected.forEach((rut) => {
                              const v = (resendEmails[rut] ?? '').trim();
                              if (!v) { errs[rut] = 'empty'; hasError = true; }
                              else if (!isValidEmail(v)) { errs[rut] = 'invalid'; hasError = true; }
                            });
                            if (hasError) {
                              e.stopPropagation();
                              setResendEmailErrors((p) => ({ ...p, ...errs }));
                              setResendConfirmOpen(false);
                              toast.warning('Corrige los correos inválidos antes de reenviar.');
                            }
                          }}
                        >
                          Reenviar a seleccionados
                        </Button>
                      </Popconfirm>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const Encuestas: React.FC = () => {
  const { selectedHoldingId, selectedCompanyId, selectedHolding, selectedCompany } = useOTICFilter();
  const [activeTab, setActiveTab] = useState('evaluaciones');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [deletedKeys, setDeletedKeys] = useState<Set<number>>(new Set());
  const [tipoFilter, setTipoFilter] = useState<TipoFilter>('all');

  const baseRows = selectedCompanyId ? (DATA_BY_COMPANY[selectedCompanyId] || []) : [];
  const rows = baseRows.filter((r) => !deletedKeys.has(r.inscripcion));

  // Rows after text-search only (used to compute pill counts)
  const searchedRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      [r.inscripcion, r.sc, r.sencenet, r.curso, r.encuesta, r.tipologia, r.tipoCarga, r.participantes, r.contestadas]
        .map((v) => (v == null ? '' : String(v).toLowerCase()))
        .some((s) => s.includes(q))
    );
  }, [rows, search]);

  const counts = useMemo(() => ({
    all: searchedRows.length,
    Satisfacción: searchedRows.filter((r) => r.tipologia === 'Satisfacción').length,
    Transferencia: searchedRows.filter((r) => r.tipologia === 'Transferencia').length,
  }), [searchedRows]);

  const filteredRows = useMemo(() => {
    if (tipoFilter === 'all') return searchedRows;
    return searchedRows.filter((r) => r.tipologia === tipoFilter);
  }, [searchedRows, tipoFilter]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const handleDelete = (inscripcion: number) => {
    setDeletedKeys((prev) => new Set(prev).add(inscripcion));
    message.error({ content: 'Evaluación eliminada correctamente', style: { fontFamily: 'Poppins, sans-serif' } });
  };

  const getContestadasColor = (contestadas: number, total: number) => {
    if (contestadas === 0) return '#EF4444';
    if (contestadas / total <= 0.5) return '#F59E0B';
    return '#10B981';
  };

  const exportRows = filteredRows.map((r) => ({
    'N° Inscripción': r.inscripcion,
    'SC': r.sc ?? '',
    'Sencenet': r.sencenet ?? '',
    'Nombre Curso': r.curso,
    'Nombre Encuesta': r.encuesta,
    'Tipología': r.tipologia,
    'Tipo Carga': r.tipoCarga,
    'N° Participantes': r.participantes,
    'N° Contestadas': r.contestadas,
    '% Respuesta': r.participantes === 0 ? '—' : `${Math.round((r.contestadas / r.participantes) * 100)}%`,
  }));

  const fileBaseName = `evaluaciones_${slug(selectedHolding?.name || 'holding')}_${slug(selectedCompany?.name || 'empresa')}_${todayStr()}`;

  const exportDisabled = filteredRows.length === 0;

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (exportDisabled) return;
    const headers = Object.keys(exportRows[0]);
    const sep = ';';
    const escape = (v: any) => {
      const s = String(v ?? '');
      if (s.includes(sep) || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const lines = [headers.join(sep)];
    exportRows.forEach((row) => {
      lines.push(headers.map((h) => escape((row as any)[h])).join(sep));
    });
    const bom = '\uFEFF';
    const blob = new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${fileBaseName}.csv`);
  };

  const handleExportExcel = () => {
    if (exportDisabled) return;
    message.info({ content: 'Generando Excel...', style: { fontFamily: 'Poppins, sans-serif' } });
    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');
      XLSX.writeFile(wb, `${fileBaseName}.xlsx`);
    }, 1000);
  };

  const handleExportPDF = () => {
    if (exportDisabled) return;
    message.info({ content: 'Generando PDF...', style: { fontFamily: 'Poppins, sans-serif' } });
    setTimeout(() => {
      const doc = new jsPDF({ orientation: 'landscape' });
      const now = new Date();
      doc.setFontSize(14);
      doc.text('Administrar Evaluaciones', 14, 14);
      doc.setFontSize(10);
      doc.text(`Holding: ${selectedHolding?.name || '—'}    Empresa: ${selectedCompany?.name || '—'}`, 14, 21);
      doc.text(`Fecha: ${now.toLocaleString('es-CL')}    Total registros: ${exportRows.length}`, 14, 27);
      const headers = Object.keys(exportRows[0]);
      const body = exportRows.map((r) => headers.map((h) => String((r as any)[h] ?? '')));
      autoTable(doc, {
        head: [headers],
        body,
        startY: 32,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [101, 191, 177] },
      });
      doc.save(`${fileBaseName}.pdf`);
    }, 1500);
  };

  const nowrapTitle = (text: string) => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>;
  const columns = [
    {
      title: nowrapTitle('N° Inscripción'),
      dataIndex: 'inscripcion',
      width: 120,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 500, color: '#111827' }}>{v}</span>,
    },
    {
      title: nowrapTitle('Código SC'),
      dataIndex: 'sc',
      width: 100,
      render: (v: number | null) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v ?? '—'}</span>,
    },
    {
      title: nowrapTitle('Código Sencenet'),
      dataIndex: 'sencenet',
      width: 120,
      render: (v: number | null) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>{v ?? '—'}</span>,
    },
    {
      title: nowrapTitle('Curso'),
      dataIndex: 'curso',
      ellipsis: true,
      minWidth: 140,
      render: (v: string) => (
        <Tooltip title={v}>
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: nowrapTitle('Encuesta'),
      dataIndex: 'encuesta',
      ellipsis: true,
      minWidth: 140,
      render: (v: string) => (
        <Tooltip title={v}>
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: nowrapTitle('Tipo Encuesta'),
      dataIndex: 'tipologia',
      width: 130,
      render: (v: 'Satisfacción' | 'Transferencia') => {
        const styles = v === 'Satisfacción'
          ? { background: '#EFF6FF', color: '#1D4ED8' }
          : { background: '#F0FDF4', color: '#15803D' };
        return (
          <span style={{ ...styles, fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap', display: 'inline-block' }}>
            {v}
          </span>
        );
      },
    },
    {
      title: nowrapTitle('Modalidad'),
      dataIndex: 'tipoCarga',
      width: 90,
      render: (v: string) => (
        <span style={{ background: '#F3F4F6', color: '#374151', fontFamily: 'Poppins', fontSize: 12, padding: '2px 10px', borderRadius: 999 }}>
          {v}
        </span>
      ),
    },
    {
      title: nowrapTitle('Participantes'),
      dataIndex: 'participantes',
      width: 100,
      align: 'center' as const,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</span>,
    },
    {
      title: nowrapTitle('Respondidas'),
      dataIndex: 'contestadas',
      width: 100,
      align: 'center' as const,
      render: (v: number, row: EvalRow) => {
        const color = getContestadasColor(v, row.participantes);
        const pct = row.participantes ? Math.round((v / row.participantes) * 100) : 0;
        return (
          <Tooltip title={`${v} de ${row.participantes} participantes han contestado (${pct}%)`}>
            <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color }}>{v}</span>
          </Tooltip>
        );
      },
    },
    {
      title: nowrapTitle('Tasa Respuesta'),
      dataIndex: 'pct',
      width: 120,
      align: 'center' as const,
      render: (_: any, row: EvalRow) => (
        <ProgressCell contestadas={row.contestadas} participantes={row.participantes} />
      ),
    },
    {
      title: nowrapTitle('Acciones'),
      width: 70,
      align: 'center' as const,
      render: (_: any, row: EvalRow) => (
        <Popconfirm
          title={<span style={{ fontFamily: 'Poppins', fontWeight: 500 }}>¿Estás seguro de eliminar esta evaluación?</span>}
          description={<span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B7280' }}>Esta acción no se puede deshacer.</span>}
          onConfirm={() => handleDelete(row.inscripcion)}
          okText="Sí, eliminar"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
          icon={<Warning size={16} weight="fill" color="#F59E0B" />}
        >
          <Tooltip title="Eliminar evaluación">
            <button className="p-1 rounded hover:bg-red-50 transition-colors">
              <Trash size={16} color="#EF4444" />
            </button>
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  const renderEmptyTab = (Icon: React.ComponentType<any>, label: string) => (
    <div className="flex flex-col items-center justify-center py-24">
      <Icon size={64} color="#D1D5DB" weight="regular" />
      <p className="mt-4 mb-1" style={{ fontFamily: 'Poppins', fontSize: 16, color: '#9CA3AF' }}>Próximamente</p>
      <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>{label}</p>
    </div>
  );

  // Pill renderer
  const renderPill = (key: TipoFilter, label: string, count: number) => {
    const active = tipoFilter === key;
    let activeStyle: React.CSSProperties = {};
    if (active) {
      if (key === 'all') activeStyle = { background: '#111827', color: '#FFFFFF', borderColor: '#111827' };
      else if (key === 'Satisfacción') activeStyle = { background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' };
      else activeStyle = { background: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0' };
    }
    return (
      <button
        key={key}
        onClick={() => { setTipoFilter(key); setPage(1); }}
        className="transition-colors"
        style={{
          fontFamily: 'Poppins',
          fontSize: 13,
          fontWeight: 500,
          padding: '4px 16px',
          borderRadius: 999,
          border: '1px solid #E5E7EB',
          background: '#F3F4F6',
          color: '#6B7280',
          cursor: 'pointer',
          ...activeStyle,
        }}
        onMouseEnter={(e) => {
          if (!active) (e.currentTarget.style.background = '#E5E7EB');
        }}
        onMouseLeave={(e) => {
          if (!active) (e.currentTarget.style.background = '#F3F4F6');
        }}
      >
        {label} ({count})
      </button>
    );
  };

  const exportBtnStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    color: '#374151',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 6,
    padding: '4px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: exportDisabled ? 'not-allowed' : 'pointer',
    opacity: exportDisabled ? 0.5 : 1,
  };

  const ExportButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <Tooltip title={exportDisabled ? 'Aplica filtros para exportar' : `Exportar ${label}`}>
      <button
        type="button"
        disabled={exportDisabled}
        onClick={onClick}
        style={exportBtnStyle}
        onMouseEnter={(e) => {
          if (!exportDisabled) {
            e.currentTarget.style.background = '#F9FAFB';
            e.currentTarget.style.borderColor = '#D1D5DB';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#FFFFFF';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
      >
        {icon}
        {label}
      </button>
    </Tooltip>
  );

  const renderEvaluacionesTab = () => {
    if (!selectedHoldingId && !selectedCompanyId) {
      return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-[#E5E7EB]">
          <ClipboardText size={56} color="#D1D5DB" weight="regular" />
          <p className="mt-4 mb-1" style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 500, color: '#6B7280' }}>
            Selecciona un Holding y Empresa
          </p>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>
            Usa los filtros del menú superior para cargar las evaluaciones.
          </p>
        </div>
      );
    }

    if (selectedHoldingId && !selectedCompanyId) {
      return (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-[#E5E7EB]">
          <Buildings size={56} color="#D1D5DB" weight="regular" />
          <p className="mt-4 mb-1" style={{ fontFamily: 'Poppins', fontSize: 15, fontWeight: 500, color: '#6B7280' }}>
            Selecciona una Empresa
          </p>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>
            Elige una empresa del filtro superior para ver sus evaluaciones.
          </p>
        </div>
      );
    }

    return (
      <div>
        {/* Pills de tipología */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {renderPill('all', 'Todas', counts.all)}
          {renderPill('Satisfacción', 'Satisfacción', counts.Satisfacción)}
          {renderPill('Transferencia', 'Transferencia', counts.Transferencia)}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
            {filteredRows.length} evaluaciones encontradas
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Buscar..."
              prefix={<MagnifyingGlass size={14} color="#9CA3AF" />}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ width: 220, fontFamily: 'Poppins' }}
              allowClear
            />
            <div className="flex items-center gap-2">
              <ExportButton icon={<FileCsv size={16} weight="regular" />} label="CSV" onClick={handleExportCSV} />
              <ExportButton icon={<FileXls size={16} weight="regular" />} label="Excel" onClick={handleExportExcel} />
              <ExportButton icon={<FilePdf size={16} weight="regular" />} label="PDF" onClick={handleExportPDF} />
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>Mostrar</span>
              <Select
                value={pageSize}
                onChange={(v) => { setPageSize(v); setPage(1); }}
                style={{ width: 80 }}
                options={[
                  { value: 10, label: '10' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' },
                ]}
              />
            </div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
          <Table
            rowKey="inscripcion"
            dataSource={pagedRows}
            columns={columns as any}
            pagination={false}
            scroll={{ x: 'max-content' }}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center justify-center py-12">
                  <MagnifyingGlass size={48} color="#D1D5DB" weight="regular" />
                  <p className="mt-3 mb-1" style={{ fontFamily: 'Poppins', fontSize: 14, color: '#6B7280' }}>
                    No se encontraron evaluaciones
                  </p>
                  <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#9CA3AF' }}>
                    Intenta con otro término de búsqueda
                  </p>
                </div>
              ),
            }}
          />
        </div>

        {filteredRows.length > 0 && (
          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280' }}>
              Mostrando {(page - 1) * pageSize + 1} a {Math.min(page * pageSize, filteredRows.length)} de {filteredRows.length} evaluaciones
            </span>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filteredRows.length}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    );
  };

  const tabItems = [
    {
      key: 'evaluaciones',
      label: (
        <span className="flex items-center gap-2" style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 500 }}>
          <ClipboardText size={16} weight="regular" />
          Administrar Evaluaciones
        </span>
      ),
      children: renderEvaluacionesTab(),
    },
    {
      key: 'encuestas',
      label: (
        <span className="flex items-center gap-2" style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 500 }}>
          <Note size={16} weight="regular" />
          Administrar Encuestas
        </span>
      ),
      children: <AdministrarEncuestasTab />,
    },
    {
      key: 'asignar',
      label: (
        <span className="flex items-center gap-2" style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: 500 }}>
          <UserPlus size={16} weight="regular" />
          Asignar Encuestas
        </span>
      ),
      children: <AsignarEncuestasTab />,
    },
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'Poppins', fontSize: 28, fontWeight: 700, color: '#111827', margin: 0 }}>
            Encuestas
          </h1>
          <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
            Gestiona evaluaciones, encuestas y cursos finalizados
          </p>
        </div>
      </div>

      <Tabs
        type="line"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </div>
  );
};

export default Encuestas;
