import React, { useEffect, useMemo, useState } from 'react';
import { Button, Tabs, Select, Input, Table, Tooltip, Popconfirm, Pagination, Modal, message, DatePicker } from 'antd';
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
} from '@phosphor-icons/react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useOTICFilter } from '@/context/OTICFilterContext';

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

const PreviewModal: React.FC<{ open: boolean; onClose: () => void; encuesta: EncuestaRow | null }> = ({ open, onClose, encuesta }) => {
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
  { inscripcion: 2095229, sc: 2081283, sencenet: 6751930, inicio: '06/01/2026', termino: '14/02/2026', curso: 'HERRAMIENTAS ESENCIALES DEL STORYTELLING PARA LA CONSTRUCCIÓN DE HISTORIAS CORPORATIVAS EFECTIVAS', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2118699, sc: null, sencenet: 6720127, inicio: '31/03/2026', termino: '26/05/2026', curso: 'GESTIÓN DE LA INTELIGENCIA EMOCIONAL PARA EL LIDERAZGO DE EQUIPOS', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'asignada', transferencia: 'sin_asignar' },
  { inscripcion: 2118700, sc: null, sencenet: 6720128, inicio: '26/05/2026', termino: '21/07/2026', curso: 'HERRAMIENTAS DE GESTIÓN PARA LA DIRECCIÓN DE ORGANIZACIONES', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2118703, sc: null, sencenet: 6720129, inicio: '28/07/2026', termino: '29/09/2026', curso: 'HERRAMIENTAS PARA EL EJERCICIO DEL LIDERAZGO EN LAS ORGANIZACIONES', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2126744, sc: null, sencenet: 6732975, inicio: '31/03/2026', termino: '26/05/2026', curso: 'Gestión socio-ambiental: casos de empresa', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'asignada', transferencia: 'asignada' },
  { inscripcion: 2126747, sc: null, sencenet: 6732976, inicio: '26/05/2026', termino: '28/07/2026', curso: 'Sostenibilidad Socio-Ambiental: desafíos para la empresa', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2126757, sc: null, sencenet: 6732977, inicio: '28/07/2026', termino: '29/09/2026', curso: 'Técnicas para la gestión ambiental', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2143994, sc: null, sencenet: 6752071, inicio: '05/01/2026', termino: '13/02/2026', curso: 'Aplicación De Técnicas De Comunicación Efectiva', tipo: 'Sence', modalidad: 'E-Learning', participantes: 1, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2144001, sc: null, sencenet: 6752074, inicio: '05/01/2026', termino: '30/01/2026', curso: 'Excel Básico: planillas inteligentes para el trabajo diario', tipo: 'Sence', modalidad: 'E-Learning', participantes: 2, satisfaccion: 'asignada', transferencia: 'sin_asignar' },
  { inscripcion: 2174396, sc: null, sencenet: null, inicio: '05/03/2026', termino: '05/03/2026', curso: 'Capacitación Teórica práctica sobre uso de extintores', tipo: 'Curso Interno', modalidad: 'Presencial', participantes: 9, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2177407, sc: null, sencenet: null, inicio: '05/03/2026', termino: '05/03/2026', curso: 'Capacitación Teórica práctica sobre uso de extintores', tipo: 'Curso Interno', modalidad: 'Presencial', participantes: 9, satisfaccion: 'sin_asignar', transferencia: 'sin_asignar' },
  { inscripcion: 2177416, sc: null, sencenet: null, inicio: '05/03/2026', termino: '05/03/2026', curso: 'Capacitación Teórica práctica sobre uso de extintores', tipo: 'Curso Interno', modalidad: 'E-Learning', participantes: 9, satisfaccion: 'asignada', transferencia: 'asignada' },
];

type PillKey = 'todos' | 'sin' | 'asig';
type AsignKind = 'Satisfacción' | 'Transferencia';

const ENCUESTA_INFO: Record<AsignKind, { nombre: string; id: number }> = {
  'Satisfacción': { nombre: 'Encuesta de Satisfacción Estándar v2.0', id: 4728 },
  'Transferencia': { nombre: 'Encuesta de Transferencia Estándar v2.0', id: 4484 },
};

const AsignarModal: React.FC<{
  open: boolean;
  kind: AsignKind | null;
  row: AsignarCursoRow | null;
  onClose: () => void;
  onSave: (relator: string, fecha: any) => void;
}> = ({ open, kind, row, onClose, onSave }) => {
  const [relator, setRelator] = useState('');
  const [fecha, setFecha] = useState<any>(null);
  const [errRelator, setErrRelator] = useState(false);
  const [errFecha, setErrFecha] = useState(false);

  useEffect(() => {
    if (open) {
      setRelator(''); setFecha(null); setErrRelator(false); setErrFecha(false);
    }
  }, [open, row, kind]);

  if (!kind || !row) return null;
  const info = ENCUESTA_INFO[kind];
  const isSatis = kind === 'Satisfacción';
  const badgeBg = isSatis ? '#EFF6FF' : '#F0FDF4';
  const badgeColor = isSatis ? '#1D4ED8' : '#15803D';

  const handleSave = () => {
    const eR = !relator.trim();
    const eF = !fecha;
    setErrRelator(eR); setErrFecha(eF);
    if (eR || eF) return;
    onSave(relator.trim(), fecha);
  };

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
        {/* Header info */}
        <div style={{ background: '#F0FDF9', border: '1px solid #99F6E4', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12 }}>
          <BookOpen size={20} color={TEAL} weight="regular" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>N° Inscripción: {row.inscripcion}</span>
            <span style={{ fontSize: 13, color: '#374151', wordBreak: 'break-word' }}>Curso: {row.curso}</span>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Encuesta */}
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

          {/* Relator */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Relator *</label>
            <Input
              value={relator}
              onChange={(e) => { setRelator(e.target.value); if (e.target.value.trim()) setErrRelator(false); }}
              placeholder="Ingresa el nombre del relator"
              status={errRelator ? 'error' : undefined}
              style={{ fontFamily: 'Poppins' }}
            />
            {errRelator && <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>El relator es obligatorio</div>}
          </div>

          {/* Fecha */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Fecha de Evaluación *</label>
            <DatePicker
              value={fecha}
              onChange={(v) => { setFecha(v); if (v) setErrFecha(false); }}
              format="DD-MM-YYYY"
              placeholder="Selecciona una fecha"
              style={{ width: '100%' }}
              status={errFecha ? 'error' : undefined}
            />
            {errFecha && <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>La fecha de evaluación es obligatoria</div>}
          </div>

          {/* Tipo de Carga */}
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

          {/* Participantes */}
          <div>
            <Button
              block
              onClick={() => console.log(`Abrir modal participantes ${kind}`)}
              style={{ borderColor: TEAL, color: TEAL, background: '#FFFFFF', fontFamily: 'Poppins', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              icon={<Users size={16} weight="regular" />}
            >
              Gestionar Participantes
            </Button>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>
              Agrega el correo de los participantes del curso
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', margin: '20px 0 16px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <Button onClick={onClose} style={{ fontFamily: 'Poppins' }}>Cancelar</Button>
          <Button
            type="primary"
            onClick={handleSave}
            icon={<FloppyDisk size={16} weight="regular" />}
            style={{ background: TEAL, borderColor: TEAL, fontFamily: 'Poppins', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            Guardar Configuración
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
  const [pill, setPill] = useState<PillKey>('todos');
  const [showTech, setShowTech] = useState(false);
  const [rows, setRows] = useState<AsignarCursoRow[]>(ASIGNAR_DATA);
  const [asignModal, setAsignModal] = useState<{ kind: AsignKind; row: AsignarCursoRow } | null>(null);
  const [previewModal, setPreviewModal] = useState<{ kind: AsignKind; row: AsignarCursoRow } | null>(null);

  // Auto-load when both holding+company are selected
  useEffect(() => {
    setSearch('');
    setPage(1);
    setPill('todos');
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
    if (!q) return ASIGNAR_DATA;
    return ASIGNAR_DATA.filter((r) =>
      [r.curso, String(r.inscripcion), String(r.sc ?? ''), String(r.sencenet ?? '')]
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [searched, search]);

  const isAsignado = (r: AsignarCursoRow) => r.satisfaccion === 'asignada' && r.transferencia === 'asignada';
  const isSinAsignar = (r: AsignarCursoRow) => r.satisfaccion === 'sin_asignar' || r.transferencia === 'sin_asignar';

  const counts = useMemo(() => ({
    todos: searched_rows.length,
    sin: searched_rows.filter(isSinAsignar).length,
    asig: searched_rows.filter(isAsignado).length,
  }), [searched_rows]);

  const totals = useMemo(() => ({
    total: searched ? ASIGNAR_DATA.length : 0,
    sin: searched ? ASIGNAR_DATA.filter(isSinAsignar).length : 0,
    asig: searched ? ASIGNAR_DATA.filter(isAsignado).length : 0,
  }), [searched]);

  const filtered = useMemo(() => {
    if (pill === 'sin') return searched_rows.filter(isSinAsignar);
    if (pill === 'asig') return searched_rows.filter(isAsignado);
    return searched_rows;
  }, [searched_rows, pill]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const renderActionCell = (
    state: 'sin_asignar' | 'asignada',
    kind: 'Satisfacción' | 'Transferencia',
    inscripcion: number
  ) => {
    if (state === 'sin_asignar') {
      return (
        <Tooltip title="Sin asignar — clic para asignar">
          <button
            onClick={() => console.log(`Abrir modal ${kind} ${inscripcion}`)}
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
          <button onClick={() => console.log(`Reenviar ${kind}`)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'inline-flex' }}>
            <PaperPlaneTilt size={22} color={TEAL} weight="regular" />
          </button>
        </Tooltip>
        <Tooltip title="Ver previsualización">
          <button onClick={() => console.log(`Preview ${kind}`)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'inline-flex' }}>
            <Eye size={22} color={TEAL} weight="regular" />
          </button>
        </Tooltip>
      </div>
    );
  };

  const headerLabel = (text: string) => (
    <span style={{ whiteSpace: 'nowrap', fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#374151' }}>{text}</span>
  );

  const allColumns: any[] = [
    {
      key: 'inscripcion',
      title: headerLabel('N° Inscripción'),
      dataIndex: 'inscripcion', width: 120,
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
      key: 'inicio',
      title: headerLabel('Inicio'),
      dataIndex: 'inicio', width: 100,
      render: (v: string) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v.replace(/\//g, '-')}</span>,
    },
    {
      key: 'termino',
      title: headerLabel('Término'),
      dataIndex: 'termino', width: 100,
      render: (v: string) => <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151' }}>{v.replace(/\//g, '-')}</span>,
    },
    {
      key: 'curso',
      title: headerLabel('Curso'),
      dataIndex: 'curso',
      ellipsis: { showTitle: false },
      render: (v: string) => (
        <Tooltip title={v}>
          <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#374151', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 220 }}>{v}</span>
        </Tooltip>
      ),
    },
    {
      key: 'tipo',
      title: headerLabel('Tipo'),
      dataIndex: 'tipo', width: 110, align: 'center' as const,
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
      dataIndex: 'modalidad', width: 100, align: 'center' as const,
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
      dataIndex: 'participantes', width: 90, align: 'center' as const,
      render: (v: number) => <span style={{ fontFamily: 'Poppins', fontSize: 13, fontWeight: 600, color: '#111827' }}>{v}</span>,
    },
    {
      key: 'satisfaccion',
      title: headerLabel('Satisfacción'),
      dataIndex: 'satisfaccion', width: 110, align: 'center' as const,
      render: (v: 'sin_asignar' | 'asignada', row: AsignarCursoRow) =>
        renderActionCell(v, 'Satisfacción', row.inscripcion),
    },
    {
      key: 'transferencia',
      title: headerLabel('Transferencia'),
      dataIndex: 'transferencia', width: 110, align: 'center' as const,
      render: (v: 'sin_asignar' | 'asignada', row: AsignarCursoRow) =>
        renderActionCell(v, 'Transferencia', row.inscripcion),
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

  const pillBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#F3F4F6', color: '#6B7280',
    border: '1px solid #E5E7EB', borderRadius: 999,
    padding: '4px 16px', fontFamily: 'Poppins', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', transition: 'background .15s',
  };
  const pillStyles: Record<PillKey, React.CSSProperties> = {
    todos: { background: '#111827', color: '#FFFFFF', border: '1px solid #111827' },
    sin: { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
    asig: { background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' },
  };
  const pillStyle = (key: PillKey): React.CSSProperties =>
    pill === key ? { ...pillBase, ...pillStyles[key] } : pillBase;

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
          {/* Summary cards */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div
              onClick={() => { setPill('todos'); setPage(1); }}
              style={{ flex: '1 1 180px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 16px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ClipboardText size={20} color="#6B7280" weight="regular" />
                <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#6B7280' }}>Total Cursos</span>
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 700, color: '#111827' }}>{totals.total}</div>
            </div>
            <div
              onClick={() => { setPill('sin'); setPage(1); }}
              style={{ flex: '1 1 180px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8, padding: '12px 16px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <GearSix size={20} color="#D97706" weight="regular" />
                <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#D97706' }}>Sin Asignar</span>
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 700, color: '#D97706' }}>{totals.sin}</div>
            </div>
            <div
              onClick={() => { setPill('asig'); setPage(1); }}
              style={{ flex: '1 1 180px', background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '12px 16px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <CheckCircle size={20} color="#065F46" weight="regular" />
                <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#065F46' }}>Asignados</span>
              </div>
              <div style={{ fontFamily: 'Poppins', fontSize: 24, fontWeight: 700, color: '#065F46' }}>{totals.asig}</div>
            </div>
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={pillStyle('todos')} onClick={() => { setPill('todos'); setPage(1); }}>
              Todos ({counts.todos})
            </span>
            <span style={pillStyle('sin')} onClick={() => { setPill('sin'); setPage(1); }}>
              Sin Asignar ({counts.sin})
            </span>
            <span style={pillStyle('asig')} onClick={() => { setPill('asig'); setPage(1); }}>
              Asignados ({counts.asig})
            </span>
          </div>

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
              scroll={{ x: 'max-content' }}
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
        <Button
          type="primary"
          icon={<Plus size={16} weight="bold" />}
          style={{ background: '#65BFB1', borderColor: '#65BFB1', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          Nueva Encuesta
        </Button>
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
