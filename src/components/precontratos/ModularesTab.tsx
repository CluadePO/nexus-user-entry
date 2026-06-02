import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Ban, EyeOff, PlusCircle, Download, ChevronDown, ChevronRight, Users, FolderPlus, Unlink, FileText } from 'lucide-react';
import AddCourseToModuleModal from './AddCourseToModuleModal';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Participante {
  nombre: string;
  rut: string;
}

const mockParticipantesByCurso: Record<string, Participante[]> = {
  '2160101': [
    { nombre: 'Alejandro Elías Jesús Castillo Rodríguez', rut: '21.826.390-9' },
    { nombre: 'Bryan Tomás Villagra Núñez', rut: '19.543.221-7' },
    { nombre: 'Camila Fernanda Flores Pizarro', rut: '20.112.445-3' },
    { nombre: 'Claudia Alejandra Chacana Cabrera', rut: '18.765.890-K' },
    { nombre: 'Cristian Luis Vergara Tobar', rut: '17.234.567-1' },
    { nombre: 'Cristofer Ignacio Martínez Jiménez', rut: '22.345.678-2' },
    { nombre: 'Daniel Esteban Rojas Medina', rut: '19.876.543-3' },
    { nombre: 'Daniela Andrea Soto Espinoza', rut: '20.567.890-4' },
    { nombre: 'Diego Alejandro Morales Tapia', rut: '21.234.567-5' },
    { nombre: 'Eduardo Antonio Ramírez López', rut: '18.345.678-6' },
    { nombre: 'Esteban Felipe Guzmán Araya', rut: '19.456.789-7' },
    { nombre: 'Fernanda Beatriz Muñoz Contreras', rut: '20.678.901-8' },
  ],
  '2160107': [
    { nombre: 'Gabriel Andrés Herrera Fuentes', rut: '21.789.012-9' },
    { nombre: 'Héctor Mauricio Paredes Vega', rut: '18.901.234-0' },
    { nombre: 'Ignacio José Navarro Bravo', rut: '19.012.345-1' },
    { nombre: 'Javiera Constanza Reyes Aguilar', rut: '20.123.456-2' },
    { nombre: 'Karen Lorena Figueroa Díaz', rut: '21.234.567-3' },
    { nombre: 'Leonardo Pablo Sepúlveda Castro', rut: '17.345.678-4' },
    { nombre: 'María Isabel Contreras Riquelme', rut: '22.456.789-5' },
  ],
};

// Generate default participants for courses not in the map
const getParticipantes = (sc: string, nroPart: number): Participante[] => {
  if (mockParticipantesByCurso[sc]) return mockParticipantesByCurso[sc];
  const nombres = ['Ana María González Pérez', 'Carlos Alberto Muñoz Silva', 'Patricia Elena Rojas Vargas', 'Miguel Ángel Torres Fernández', 'Rosa Emilia Díaz Soto', 'Francisco Javier López Cruz', 'Valentina Paz Herrera Mora', 'Rodrigo Esteban Castillo Ruiz'];
  return Array.from({ length: Math.min(nroPart, nombres.length) }, (_, i) => ({
    nombre: nombres[i % nombres.length],
    rut: `${17 + (i % 6)}.${String(100 + i * 111).slice(0, 3)}.${String(200 + i * 77).slice(0, 3)}-${i % 10}`,
  }));
};

const PART_PAGE_SIZE = 5;

interface Props {
  onVerDetalle: (nroInscripcion: string, idModular: string) => void;
  showAddCourse?: boolean;
  searchTerm?: string;
}

export interface CursoModular {
  idModular: string;
  sc: string;
  sencenet: string;
  curso: string;
  cliente: string;
  nroPart: number;
  mtFranquicia: string;
  inicioCurso: string;
  modalidad: string;
  tipoContrato: string;
  codigoSence: string;
  vencimientoSence: string;
  celula: string;
  otec: string;
  oc: string;
  estadoCurso: 'Activo' | 'Pendiente' | 'Finalizado';
  analistaResponsable: string;
  edcACargo: string;
  jefeComercial: string;
  fechaCreacion: string;
}

const otecs = ['EDUCAPRO Ltda.', 'CapacitaPro S.A.', 'FormaTec Chile', 'Instituto SENCE Pro'];
const analistas = ['María González', 'Carlos Pérez', 'Ana Muñoz', 'Roberto Silva'];
const edcs = ['Roberto Muñoz', 'Patricia Rojas', 'Jorge Díaz', 'Camila Vera'];
const jefes = ['Patricia Rojas', 'Fernando López', 'Andrea Soto', 'Miguel Torres'];
const estados: Array<'Activo' | 'Pendiente' | 'Finalizado'> = ['Activo', 'Pendiente', 'Activo'];

const addExtraFields = (base: Omit<CursoModular, 'otec' | 'oc' | 'estadoCurso' | 'analistaResponsable' | 'edcACargo' | 'jefeComercial' | 'fechaCreacion'>, idx: number): CursoModular => ({
  ...base,
  otec: otecs[idx % otecs.length],
  oc: `OC-${800000 + idx * 1111}`,
  estadoCurso: estados[idx % estados.length],
  analistaResponsable: analistas[idx % analistas.length],
  edcACargo: edcs[idx % edcs.length],
  jefeComercial: jefes[idx % jefes.length],
  fechaCreacion: `${String(9 + (idx % 20)).padStart(2, '0')}/06/2026`,
});

const initialCursosModulares: CursoModular[] = [
  { idModular: 'MOD-001', sc: '2160101', sencenet: '6790101', curso: 'Operación Segura de Equipos Mineros', cliente: 'Sierra Gorda S.c.m.', nroPart: 18, mtFranquicia: '$450.000', inicioCurso: '05/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050101', vencimientoSence: '2026-04-22', celula: 'Cel1' },
  { idModular: 'MOD-001', sc: '2160107', sencenet: '6790107', curso: 'Manejo Defensivo en Faenas', cliente: 'Sierra Gorda S.c.m.', nroPart: 15, mtFranquicia: '$375.000', inicioCurso: '08/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050107', vencimientoSence: '2026-06-15', celula: 'Cel1' },
  { idModular: 'MOD-001', sc: '2160108', sencenet: '6790108', curso: 'Primeros Auxilios en Terreno', cliente: 'Sierra Gorda S.c.m.', nroPart: 20, mtFranquicia: '$500.000', inicioCurso: '10/05/2026', modalidad: 'Presencial', tipoContrato: 'Precontrato', codigoSence: '1238050108', vencimientoSence: '2026-04-19', celula: 'Cel1' },
  { idModular: 'MOD-002', sc: '2160102', sencenet: '6790102', curso: 'Mantenimiento Predictivo Industrial', cliente: 'Albemarle Limitada', nroPart: 22, mtFranquicia: '$550.000', inicioCurso: '07/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050102', vencimientoSence: '2026-07-30', celula: 'Cel2' },
  { idModular: 'MOD-002', sc: '2160109', sencenet: '6790109', curso: 'Lubricación y Análisis de Aceites', cliente: 'Albemarle Limitada', nroPart: 18, mtFranquicia: '$360.000', inicioCurso: '12/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050109', vencimientoSence: '2026-08-10', celula: 'Cel2' },
  { idModular: 'MOD-003', sc: '2160103', sencenet: '6790103', curso: 'Liderazgo y Gestión de Equipos', cliente: 'Goodyear de Chile S.a.i.c.', nroPart: 15, mtFranquicia: '$300.000', inicioCurso: '10/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050103', vencimientoSence: '2026-04-21', celula: 'Cel3' },
  { idModular: 'MOD-003', sc: '2160110', sencenet: '6790110', curso: 'Comunicación Efectiva', cliente: 'Goodyear de Chile S.a.i.c.', nroPart: 15, mtFranquicia: '$300.000', inicioCurso: '15/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050110', vencimientoSence: '2026-09-01', celula: 'Cel3' },
  { idModular: 'MOD-004', sc: '2160104', sencenet: '6790104', curso: 'Excel Avanzado para Gestión', cliente: 'Gestiones y Servicios Los Álamos S.A.', nroPart: 25, mtFranquicia: '$625.000', inicioCurso: '12/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050104', vencimientoSence: '2026-05-20', celula: 'Cel4' },
  { idModular: 'MOD-005', sc: '2160105', sencenet: '6790105', curso: 'Inglés Técnico Nivel Intermedio', cliente: 'Metso Chile SPA', nroPart: 12, mtFranquicia: '$240.000', inicioCurso: '15/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050105', vencimientoSence: '2026-04-20', celula: 'Cel5' },
  { idModular: 'MOD-005', sc: '2160111', sencenet: '6790111', curso: 'Inglés Técnico Nivel Avanzado', cliente: 'Metso Chile SPA', nroPart: 10, mtFranquicia: '$200.000', inicioCurso: '20/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050111', vencimientoSence: '2026-10-15', celula: 'Cel5' },
  { idModular: 'MOD-006', sc: '2160106', sencenet: '6790106', curso: 'Gestión Documental Digital', cliente: 'Minera Centinela', nroPart: 20, mtFranquicia: '$400.000', inicioCurso: '18/05/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050106', vencimientoSence: '2026-04-18', celula: 'Cel6' },
  { idModular: 'MOD-007', sc: '2160112', sencenet: '6790112', curso: 'Soldadura TIG Avanzada', cliente: 'CAP Acero S.A.', nroPart: 14, mtFranquicia: '$350.000', inicioCurso: '20/05/2026', modalidad: 'Presencial', tipoContrato: 'Precontrato', codigoSence: '1238050112', vencimientoSence: '2026-12-01', celula: 'Cel1' },
  { idModular: 'MOD-007', sc: '2160113', sencenet: '6790113', curso: 'Soldadura MIG Industrial', cliente: 'CAP Acero S.A.', nroPart: 14, mtFranquicia: '$350.000', inicioCurso: '25/05/2026', modalidad: 'Presencial', tipoContrato: 'Precontrato', codigoSence: '1238050113', vencimientoSence: '2026-11-15', celula: 'Cel1' },
  { idModular: 'MOD-008', sc: '2160114', sencenet: '6790114', curso: 'Gestión de Proyectos PMI', cliente: 'Bechtel Chile Ltda.', nroPart: 16, mtFranquicia: '$480.000', inicioCurso: '01/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050114', vencimientoSence: '2026-04-17', celula: 'Cel2' },
  { idModular: 'MOD-009', sc: '2160115', sencenet: '6790115', curso: 'Control de Calidad ISO 9001', cliente: 'Nestlé Chile S.A.', nroPart: 30, mtFranquicia: '$750.000', inicioCurso: '03/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050115', vencimientoSence: '2026-07-01', celula: 'Cel3' },
  { idModular: 'MOD-009', sc: '2160116', sencenet: '6790116', curso: 'Auditoría Interna ISO 19011', cliente: 'Nestlé Chile S.A.', nroPart: 20, mtFranquicia: '$500.000', inicioCurso: '10/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050116', vencimientoSence: '2026-08-20', celula: 'Cel3' },
  { idModular: 'MOD-010', sc: '2160117', sencenet: '6790117', curso: 'Power BI para Analistas', cliente: 'Falabella Tecnología', nroPart: 28, mtFranquicia: '$700.000', inicioCurso: '05/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050117', vencimientoSence: '2026-04-22', celula: 'Cel4' },
  { idModular: 'MOD-011', sc: '2160118', sencenet: '6790118', curso: 'Prevención de Riesgos Eléctricos', cliente: 'CGE Distribución S.A.', nroPart: 19, mtFranquicia: '$380.000', inicioCurso: '08/06/2026', modalidad: 'Presencial', tipoContrato: 'Precontrato', codigoSence: '1238050118', vencimientoSence: '2026-09-15', celula: 'Cel5' },
  { idModular: 'MOD-011', sc: '2160119', sencenet: '6790119', curso: 'Trabajo en Altura Física', cliente: 'CGE Distribución S.A.', nroPart: 19, mtFranquicia: '$380.000', inicioCurso: '15/06/2026', modalidad: 'Presencial', tipoContrato: 'Precontrato', codigoSence: '1238050119', vencimientoSence: '2026-10-01', celula: 'Cel5' },
  { idModular: 'MOD-012', sc: '2160120', sencenet: '6790120', curso: 'Atención al Cliente Premium', cliente: 'Cencosud Retail S.A.', nroPart: 35, mtFranquicia: '$875.000', inicioCurso: '10/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050120', vencimientoSence: '2026-04-19', celula: 'Cel6' },
  { idModular: 'MOD-013', sc: '2160121', sencenet: '6790121', curso: 'Logística y Cadena de Suministro', cliente: 'CSAV S.A.', nroPart: 17, mtFranquicia: '$425.000', inicioCurso: '12/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050121', vencimientoSence: '2026-06-30', celula: 'Cel1' },
  { idModular: 'MOD-014', sc: '2160122', sencenet: '6790122', curso: 'Normativa Ambiental Vigente', cliente: 'Sierra Gorda S.c.m.', nroPart: 22, mtFranquicia: '$550.000', inicioCurso: '15/06/2026', modalidad: 'E-learning', tipoContrato: 'Precontrato', codigoSence: '1238050122', vencimientoSence: '2026-04-21', celula: 'Cel2' },
].map((item, idx) => addExtraFields(item, idx));

const MOD_PAGE_SIZE = 10;

const isProximoAVencer = (vencimiento: string) => {
  const hoy = new Date();
  const fechaVenc = new Date(vencimiento);
  const diffMs = fechaVenc.getTime() - hoy.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDias >= 0 && diffDias <= 10;
};

const ModularesTab: React.FC<Props> = ({ onVerDetalle, showAddCourse = true, searchTerm = '' }) => {
  const [pageModulares, setPageModulares] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [noComunicar, setNoComunicar] = useState<string[]>([]);
  const [cursosModulares, setCursosModulares] = useState<CursoModular[]>(initialCursosModulares);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalModuleId, setAddModalModuleId] = useState('');
  const [addModalCliente, setAddModalCliente] = useState('');
  const [extraModules, setExtraModules] = useState<string[]>([]);
  const [confirmDesasociar, setConfirmDesasociar] = useState<{ modId: string; sc: string; curso: string } | null>(null);
  const [downloadCtx, setDownloadCtx] = useState<{ modId: string; cursos: CursoModular[]; participante?: Participante; curso?: CursoModular } | null>(null);
  const [repForm, setRepForm] = useState({ nombre: '', rutNum: '', rutDv: '', email: '' });
  const [generating, setGenerating] = useState(false);

  const toggleNoComunicar = (sc: string) => {
    setNoComunicar(prev =>
      prev.includes(sc) ? prev.filter(s => s !== sc) : [...prev, sc]
    );
  };

  const filteredCursos = searchTerm
    ? cursosModulares.filter(c => {
        const term = searchTerm.toLowerCase();
        return c.sc.toLowerCase().includes(term) || c.cliente.toLowerCase().includes(term);
      })
    : cursosModulares;

  const grouped = filteredCursos.reduce<Record<string, CursoModular[]>>((acc, c) => {
    if (!acc[c.idModular]) acc[c.idModular] = [];
    acc[c.idModular].push(c);
    return acc;
  }, {});

  // Include empty extra modules created by the user
  extraModules.forEach(modId => {
    if (!grouped[modId]) grouped[modId] = [];
  });

  const allGroups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  const totalPagesModulares = Math.max(1, Math.ceil(allGroups.length / MOD_PAGE_SIZE));
  const safePageMod = Math.min(pageModulares, totalPagesModulares);
  const paginatedGroups = allGroups.slice((safePageMod - 1) * MOD_PAGE_SIZE, safePageMod * MOD_PAGE_SIZE);

  const handleCreateNewModule = () => {
    const allIds = [...new Set([...cursosModulares.map(c => c.idModular), ...extraModules])];
    const nums = allIds
      .map(id => parseInt(id.replace(/^MOD-/, ''), 10))
      .filter(n => !isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    const newId = `MOD-${String(next).padStart(3, '0')}`;
    setExtraModules(prev => [...prev, newId]);
    setPageModulares(Math.ceil((allGroups.length + 1) / MOD_PAGE_SIZE));
    toast.success(`Módulo ${newId} creado correctamente. Ahora puedes asociar cursos precontratos.`);
  };

  const handleConfirmDesasociar = () => {
    if (!confirmDesasociar) return;
    const { modId, sc, curso } = confirmDesasociar;
    setCursosModulares(prev => prev.filter(c => !(c.idModular === modId && c.sc === sc)));
    // Keep empty module visible if it was the last course
    const remaining = cursosModulares.filter(c => c.idModular === modId && c.sc !== sc);
    if (remaining.length === 0 && !extraModules.includes(modId)) {
      setExtraModules(prev => [...prev, modId]);
    }
    toast.success(`Curso "${curso}" desasociado del módulo ${modId}.`);
    setConfirmDesasociar(null);
  };

  const handleSelectRow = (sc: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, sc]);
    } else {
      setSelectedRows(prev => prev.filter(s => s !== sc));
    }
  };

  const handleOpenAddModal = (modId: string, cliente: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddModalModuleId(modId);
    setAddModalCliente(cliente);
    setAddModalOpen(true);
  };

  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  const [partPages, setPartPages] = useState<Record<string, number>>({});

  const toggleCourseExpand = (sc: string) => {
    setExpandedCourses(prev => ({ ...prev, [sc]: !prev[sc] }));
    if (!partPages[sc]) setPartPages(prev => ({ ...prev, [sc]: 1 }));
  };

  const handleAddCourse = (sc: string) => {
    const newCurso: CursoModular = {
      idModular: addModalModuleId,
      sc,
      sencenet: '',
      curso: `Curso S.C ${sc}`,
      cliente: addModalCliente,
      nroPart: 0,
      mtFranquicia: '$0',
      inicioCurso: '',
      modalidad: '',
      tipoContrato: 'Precontrato',
      codigoSence: '',
      vencimientoSence: '',
      celula: '',
      otec: '',
      oc: '',
      estadoCurso: 'Pendiente',
      analistaResponsable: '',
      edcACargo: '',
      jefeComercial: '',
      fechaCreacion: new Date().toLocaleDateString('es-CL'),
    };
    setCursosModulares(prev => [...prev, newCurso]);
  };

  const handleDownloadPrecontrato = (modId: string, cursos: CursoModular[], e: React.MouseEvent) => {
    e.stopPropagation();
    setRepForm({ nombre: '', rutNum: '', rutDv: '', email: '' });
    setDownloadCtx({ modId, cursos });
  };

  const isRepFormValid = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(repForm.email.trim());
    return (
      repForm.nombre.trim().length >= 3 &&
      /^\d{7,9}$/.test(repForm.rutNum.trim()) &&
      /^[0-9kK]$/.test(repForm.rutDv.trim()) &&
      emailOk
    );
  };

  const handleGenerateWord = async () => {
    if (!downloadCtx || !isRepFormValid()) return;
    setGenerating(true);
    try {
      const { modId, cursos } = downloadCtx;
      const empresa = cursos[0]?.cliente ?? 'Sin cliente';
      const rutFormateado = `${repForm.rutNum.trim()}-${repForm.rutDv.trim().toUpperCase()}`;
      const fecha = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });

      const {
        Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        Table, TableRow, TableCell, WidthType, BorderStyle,
      } = await import('docx');
      const { saveAs } = await import('file-saver');

      const border = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
      const cellBorders = { top: border, bottom: border, left: border, right: border };

      const labelValue = (label: string, value: string) =>
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: `${label}: `, bold: true }),
            new TextRun({ text: value }),
          ],
        });

      const cursosHeader = new TableRow({
        tableHeader: true,
        children: ['Código SENCE', 'Curso', 'Modalidad', 'Participantes', 'Inicio'].map(
          (h) =>
            new TableCell({
              borders: cellBorders,
              shading: { fill: 'E8F4F1' } as any,
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18 })] })],
            }),
        ),
      });

      const cursosRows = cursos.map(
        (c) =>
          new TableRow({
            children: [
              c.codigoSence || '-',
              c.curso,
              c.modalidad || '-',
              String(c.nroPart),
              c.inicioCurso || '-',
            ].map(
              (v) =>
                new TableCell({
                  borders: cellBorders,
                  children: [new Paragraph({ children: [new TextRun({ text: v, size: 18 })] })],
                }),
            ),
          }),
      );

      const doc = new Document({
        creator: 'Sucursal Virtual',
        title: `Precontrato Modular ${modId}`,
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun({ text: 'CONTRATO DE CAPACITACIÓN MODULAR', bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [new TextRun({ text: `Módulo: ${modId}`, bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 200 },
                children: [
                  new TextRun(
                    `En Santiago, a ${fecha}, entre la Empresa ${empresa.toUpperCase()}, representada por las personas individualizadas a continuación, y los participantes inscritos en los cursos detallados más abajo, se ha convenido el siguiente Contrato de Capacitación Modular.`,
                  ),
                ],
              }),

              new Paragraph({
                spacing: { before: 200, after: 120 },
                children: [new TextRun({ text: 'Datos del Representante de la Empresa', bold: true, size: 24 })],
              }),
              labelValue('Nombre Representante de la Empresa', repForm.nombre.trim()),
              labelValue('Rut Representante de la Empresa', rutFormateado),
              labelValue('Email Representante de la Empresa', repForm.email.trim()),

              new Paragraph({
                spacing: { before: 300, after: 120 },
                children: [new TextRun({ text: 'Cursos asociados al módulo', bold: true, size: 24 })],
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [cursosHeader, ...cursosRows],
              }),

              new Paragraph({
                spacing: { before: 300, after: 120 },
                children: [new TextRun({ text: 'Cláusulas', bold: true, size: 24 })],
              }),
              ...[
                '1. El capacitado se obliga a asistir a los cursos indicados en la tabla anterior.',
                '2. El programa de capacitación tiene como objetivo desarrollar competencias laborales y potenciar la empleabilidad del capacitado.',
                '3. El capacitado se obliga a asistir regularmente y cumplir el porcentaje mínimo de asistencia exigido para su aprobación.',
                `4. La duración total del proceso de capacitación será de ${cursos.reduce((s, c) => s + c.nroPart, 0)} horas cronológicas.`,
                '5. El curso es financiado mediante la franquicia tributaria contemplada en la Ley Nº 19.518.',
                '6. El presente contrato no genera vínculo laboral entre las partes firmantes.',
              ].map(
                (txt) =>
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 120 },
                    children: [new TextRun(txt)],
                  }),
              ),

              new Paragraph({ spacing: { before: 500 }, children: [new TextRun('Para constancia, firman:')] }),
              new Paragraph({ spacing: { before: 600 }, children: [new TextRun('______________________________')] }),
              new Paragraph({ children: [new TextRun({ text: repForm.nombre.trim(), bold: true })] }),
              new Paragraph({ children: [new TextRun(`RUT: ${rutFormateado}`)] }),
              new Paragraph({ children: [new TextRun(`Email: ${repForm.email.trim()}`)] }),
              new Paragraph({ children: [new TextRun(`Representante de ${empresa}`)] }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Precontrato_Modular_${modId}_${empresa.replace(/\s/g, '_')}.docx`);
      toast.success(`Documento Word descargado: Precontrato Modular ${modId}`);
      setDownloadCtx(null);
    } catch (err) {
      console.error(err);
      toast.error('Error al generar el documento Word.');
    } finally {
      setGenerating(false);
    }
  };


  return (
    <>
      <div className="border rounded-lg p-4 bg-background space-y-1 mb-4">
        <p className="text-sm font-medium text-foreground">Cursos inscritos como Precontrato Modular</p>
        <p className="text-xs text-muted-foreground">
          Listado de cursos generados desde el módulo de Inscripción del sistema con tipo de precontrato Modular (MOD-00X), agrupados por módulo.
        </p>
      </div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
          Mostrando {(safePageMod - 1) * MOD_PAGE_SIZE + 1}–{Math.min(safePageMod * MOD_PAGE_SIZE, allGroups.length)} de {allGroups.length} módulos
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8 text-primary border-primary/30 hover:bg-primary/10"
          onClick={handleCreateNewModule}
        >
          <FolderPlus className="w-3.5 h-3.5" />
          Crear nuevo módulo
        </Button>
      </div>
      <Accordion type="multiple" className="space-y-3">
        {paginatedGroups.map(([modId, cursos]) => (
          <AccordionItem key={modId} value={modId} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3 text-left flex-1">
                <span className="inline-block border rounded-full px-3 py-0.5 text-xs font-bold text-primary bg-primary/10 border-primary/20">
                  {modId}
                </span>
                <span className="text-sm font-medium text-foreground">{cursos[0]?.cliente ?? <span className="italic text-muted-foreground">Sin cliente asignado</span>}</span>
                <Badge variant="secondary" className="text-xs">{cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}</Badge>
                {showAddCourse && (
                  <div className="ml-auto mr-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs h-7 px-2 text-primary border-primary/30 hover:bg-primary/10"
                      disabled={cursos.length === 0}
                      onClick={(e) => handleDownloadPrecontrato(modId, cursos, e)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar precontrato
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs h-7 px-2 text-primary border-primary/30 hover:bg-primary/10"
                      onClick={(e) => handleOpenAddModal(modId, cursos[0]?.cliente ?? '', e)}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Agregar curso
                    </Button>
                  </div>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">Sencenet</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">SSC</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">Monto Total OTEC</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">OTEC</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">OC</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">Estado del Curso</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">Célula</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">Analista Responsable</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">EDC a Cargo</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">Jefe Comercial</th>
                      <th className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">Fecha Creación</th>
                      <th className="p-2 text-right font-medium text-muted-foreground whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.length === 0 && (
                      <tr>
                        <td colSpan={12} className="p-4 text-center text-xs text-muted-foreground italic">
                          Este módulo aún no tiene cursos asociados. Usa "Agregar curso" para asociar un curso precontrato.
                        </td>
                      </tr>
                    )}
                    {cursos.map((curso, idx) => {
                      const isExpanded = expandedCourses[curso.sc];
                      const participantes = getParticipantes(curso.sc, curso.nroPart);
                      const currentPartPage = partPages[curso.sc] || 1;
                      const totalPartPages = Math.max(1, Math.ceil(participantes.length / PART_PAGE_SIZE));
                      const paginatedParts = participantes.slice((currentPartPage - 1) * PART_PAGE_SIZE, currentPartPage * PART_PAGE_SIZE);

                      return (
                        <React.Fragment key={curso.sc}>
                          <tr className={`border-b ${idx % 2 === 0 ? 'hover:bg-muted/20' : 'bg-muted/10 hover:bg-muted/20'}`}>
                            <td className="p-2 font-medium whitespace-nowrap">
                              <button
                                className="flex items-center gap-1 hover:text-primary transition-colors"
                                onClick={() => toggleCourseExpand(curso.sc)}
                              >
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                SN-{curso.sencenet}
                              </button>
                            </td>
                            <td className="p-2 whitespace-nowrap">SSC-{curso.sc}</td>
                            <td className="p-2 font-medium whitespace-nowrap">{curso.mtFranquicia}</td>
                            <td className="p-2 whitespace-nowrap">{curso.otec}</td>
                            <td className="p-2 whitespace-nowrap">{curso.oc}</td>
                            <td className="p-2 whitespace-nowrap">
                              <Badge
                                variant={curso.estadoCurso === 'Activo' ? 'default' : curso.estadoCurso === 'Pendiente' ? 'secondary' : 'outline'}
                                className={`text-[10px] px-2 py-0.5 ${curso.estadoCurso === 'Activo' ? 'bg-primary/20 text-primary border-primary/30' : ''}`}
                              >
                                {curso.estadoCurso}
                              </Badge>
                            </td>
                            <td className="p-2 whitespace-nowrap">{curso.celula}</td>
                            <td className="p-2 whitespace-nowrap">{curso.analistaResponsable}</td>
                            <td className="p-2 whitespace-nowrap">{curso.edcACargo}</td>
                            <td className="p-2 whitespace-nowrap">{curso.jefeComercial}</td>
                            <td className="p-2 whitespace-nowrap">{curso.fechaCreacion}</td>
                            <td className="p-2 whitespace-nowrap text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs h-7 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => setConfirmDesasociar({ modId, sc: curso.sc, curso: curso.curso })}
                              >
                                <Unlink className="w-3.5 h-3.5" />
                                Desasociar
                              </Button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={12} className="p-0">
                                <div className="bg-muted/20 border-t border-b mx-4 my-1 rounded-md">
                                  <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30 rounded-t-md">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-medium text-foreground">Participantes ({participantes.length})</span>
                                  </div>
                                  <ScrollArea className="max-h-[200px]">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="border-b">
                                          <th className="p-2 text-left font-medium text-muted-foreground pl-4" style={{ width: '70%' }}>Nombre</th>
                                          <th className="p-2 text-left font-medium text-muted-foreground" style={{ width: '30%' }}>Descargar</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {paginatedParts.map((part, pIdx) => (
                                          <tr key={pIdx} className={`border-b last:border-0 ${pIdx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                                            <td className="p-2 pl-4 text-foreground">{part.nombre}</td>
                                            <td className="p-2">
                                              <button 
                                                className="text-primary hover:underline text-xs font-medium"
                                                onClick={() => {
                                                  toast.success(`Descargando precontrato de ${part.nombre}...`);
                                                }}
                                              >Descargar</button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </ScrollArea>
                                  {totalPartPages > 1 && (
                                    <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/10 rounded-b-md">
                                      <span className="text-[10px] text-muted-foreground">
                                        Pág. {currentPartPage} de {totalPartPages}
                                      </span>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 px-2 text-[10px]"
                                          disabled={currentPartPage === 1}
                                          onClick={() => setPartPages(prev => ({ ...prev, [curso.sc]: currentPartPage - 1 }))}
                                        >
                                          Anterior
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 px-2 text-[10px]"
                                          disabled={currentPartPage === totalPartPages}
                                          onClick={() => setPartPages(prev => ({ ...prev, [curso.sc]: currentPartPage + 1 }))}
                                        >
                                          Siguiente
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {totalPagesModulares > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPageModulares((p) => Math.max(1, p - 1)); }}
                  className={safePageMod === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPagesModulares }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === safePageMod}
                    onClick={(e) => { e.preventDefault(); setPageModulares(p); }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPageModulares((p) => Math.min(totalPagesModulares, p + 1)); }}
                  className={safePageMod === totalPagesModulares ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AddCourseToModuleModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        moduleId={addModalModuleId}
        clienteName={addModalCliente}
        onAdd={handleAddCourse}
      />

      <AlertDialog open={confirmDesasociar !== null} onOpenChange={(open) => !open && setConfirmDesasociar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desasociar curso del módulo?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás por desasociar el curso <strong>{confirmDesasociar?.curso}</strong> del módulo{' '}
              <strong>{confirmDesasociar?.modId}</strong>. El curso quedará disponible para asociarse a otro módulo.
              Esta acción no elimina el curso del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDesasociar}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, desasociar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={downloadCtx !== null} onOpenChange={(open) => { if (!open) setDownloadCtx(null); }}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Datos del Representante de la Empresa
            </DialogTitle>
            <DialogDescription>
              Completa los siguientes datos obligatorios para generar el precontrato modular{' '}
              <strong>{downloadCtx?.modId}</strong> de{' '}
              <strong>{downloadCtx?.cursos[0]?.cliente ?? ''}</strong> en formato Word.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rep-nombre" className="text-xs">
                Nombre Representante de la Empresa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rep-nombre"
                value={repForm.nombre}
                placeholder="Ej: Andrea Jara Ortega"
                onChange={(e) => setRepForm((f) => ({ ...f, nombre: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Rut Representante de la Empresa <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  value={repForm.rutNum}
                  placeholder="16639860"
                  inputMode="numeric"
                  maxLength={9}
                  onChange={(e) => setRepForm((f) => ({ ...f, rutNum: e.target.value.replace(/\D/g, '') }))}
                />
                <Input
                  className="w-16 text-center"
                  value={repForm.rutDv}
                  placeholder="DV"
                  maxLength={1}
                  onChange={(e) => setRepForm((f) => ({ ...f, rutDv: e.target.value.replace(/[^0-9kK]/g, '').toUpperCase() }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rep-email" className="text-xs">
                Email Representante de la Empresa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rep-email"
                type="email"
                value={repForm.email}
                placeholder="representante@empresa.cl"
                onChange={(e) => setRepForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>

            <p className="text-[11px] text-muted-foreground">
              Todos los campos son obligatorios. El botón de descarga se habilitará al completar la información correctamente.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadCtx(null)} disabled={generating}>
              Cancelar
            </Button>
            <Button
              onClick={handleGenerateWord}
              disabled={!isRepFormValid() || generating}
              className="gap-1.5"
            >
              <Download className="w-4 h-4" />
              {generating ? 'Generando...' : 'Descargar Word'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModularesTab;
