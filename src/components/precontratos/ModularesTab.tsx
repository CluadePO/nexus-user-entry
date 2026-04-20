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
import { AlertCircle, Ban, EyeOff, PlusCircle, Download } from 'lucide-react';
import AddCourseToModuleModal from './AddCourseToModuleModal';
import { toast } from 'sonner';

interface Props {
  onVerDetalle: (nroInscripcion: string, idModular: string) => void;
  showAddCourse?: boolean;
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
}

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
];

const MOD_PAGE_SIZE = 10;

const isProximoAVencer = (vencimiento: string) => {
  const hoy = new Date();
  const fechaVenc = new Date(vencimiento);
  const diffMs = fechaVenc.getTime() - hoy.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDias >= 0 && diffDias <= 10;
};

const ModularesTab: React.FC<Props> = ({ onVerDetalle, showAddCourse = true }) => {
  const [pageModulares, setPageModulares] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [noComunicar, setNoComunicar] = useState<string[]>([]);
  const [cursosModulares, setCursosModulares] = useState<CursoModular[]>(initialCursosModulares);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalModuleId, setAddModalModuleId] = useState('');
  const [addModalCliente, setAddModalCliente] = useState('');

  const toggleNoComunicar = (sc: string) => {
    setNoComunicar(prev =>
      prev.includes(sc) ? prev.filter(s => s !== sc) : [...prev, sc]
    );
  };

  const grouped = cursosModulares.reduce<Record<string, CursoModular[]>>((acc, c) => {
    if (!acc[c.idModular]) acc[c.idModular] = [];
    acc[c.idModular].push(c);
    return acc;
  }, {});

  const allGroups = Object.entries(grouped);
  const totalPagesModulares = Math.max(1, Math.ceil(allGroups.length / MOD_PAGE_SIZE));
  const safePageMod = Math.min(pageModulares, totalPagesModulares);
  const paginatedGroups = allGroups.slice((safePageMod - 1) * MOD_PAGE_SIZE, safePageMod * MOD_PAGE_SIZE);

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
    };
    setCursosModulares(prev => [...prev, newCurso]);
  };

  const handleDownloadPrecontrato = async (modId: string, cursos: CursoModular[], e: React.MouseEvent) => {
    e.stopPropagation();
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'letter');
    const pageW = doc.internal.pageSize.getWidth();
    const marginL = 20;
    const marginR = 20;
    const contentW = pageW - marginL - marginR;
    let y = 25;

    const addLine = (text: string, fontSize: number, bold: boolean, align: 'left' | 'center' | 'justify' = 'left') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, contentW);
      if (y + lines.length * (fontSize * 0.4) > 260) {
        doc.addPage();
        y = 25;
      }
      if (align === 'center') {
        lines.forEach((line: string) => {
          doc.text(line, pageW / 2, y, { align: 'center' });
          y += fontSize * 0.45;
        });
      } else {
        doc.text(lines, marginL, y);
        y += lines.length * (fontSize * 0.45);
      }
      return y;
    };

    // Title
    addLine('CONTRATO DE CAPACITACIÓN', 14, true, 'center');
    y += 5;
    addLine(`Módulo: ${modId}`, 11, true, 'center');
    y += 8;

    // Intro paragraph
    const empresa = cursos[0].cliente;
    const fecha = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
    addLine(
      `En Santiago, a ${fecha}, entre la Empresa ${empresa.toUpperCase()}, en adelante la empresa, y los participantes individualizados más abajo, se ha convenido el siguiente Contrato de Capacitación Modular.`,
      10, false
    );
    y += 5;

    // Clause 1 - courses table
    addLine('1. El Capacitado se obliga a asistir a los siguientes cursos:', 10, false);
    y += 3;

    // Table header
    const colWidths = [25, 55, 25, 25, 35];
    const headers = ['Código SENCE', 'Nombre Curso', 'Modalidad', 'Horas', 'Fecha Inicio'];
    doc.setFillColor(240, 240, 240);
    doc.rect(marginL, y - 3, contentW, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    let xPos = marginL;
    headers.forEach((h, i) => {
      doc.text(h, xPos + 1, y + 1);
      xPos += colWidths[i];
    });
    y += 7;

    // Table rows
    doc.setFont('helvetica', 'normal');
    cursos.forEach(curso => {
      if (y > 250) { doc.addPage(); y = 25; }
      xPos = marginL;
      const rowData = [curso.codigoSence || '-', curso.curso, curso.modalidad || '-', String(curso.nroPart), curso.inicioCurso || '-'];
      rowData.forEach((val, i) => {
        const cellText = doc.splitTextToSize(val, colWidths[i] - 2);
        doc.text(cellText[0] || '-', xPos + 1, y);
        xPos += colWidths[i];
      });
      doc.line(marginL, y + 2, marginL + contentW, y + 2);
      y += 6;
    });
    y += 5;

    // Additional clauses
    const clauses = [
      '2. El Programa de Capacitación al que asistirá el capacitado tiene como objetivo desarrollar sus competencias laborales y potenciar su empleabilidad.',
      '3. El capacitado se obliga a asistir en términos regulares al proceso de capacitación y, a cumplir con el porcentaje mínimo de asistencia exigido para su aprobación.',
      `4. La duración del proceso de capacitación será de ${cursos.reduce((sum, c) => sum + c.nroPart, 0)} horas cronológicas.`,
      '5. El Programa de Capacitación contempla la realización de un módulo de práctica, el que se realizará en las instalaciones de la empresa.',
      '6. El módulo de práctica debe contener una descripción de las funciones y/o tareas en las que se instruirá al capacitado.',
      `7. El presente contrato de capacitación tendrá una duración de 32 Día(s).`,
      '8. Las partes dejan constancia que el curso al cual asiste el capacitado es financiado por el Estado mediante la utilización de la franquicia tributaria contemplada en la Ley Nº 19.518.',
      '9. El presente contrato de capacitación no generará vínculo laboral entre las partes firmantes.',
    ];
    clauses.forEach(clause => {
      addLine(clause, 9, false);
      y += 3;
    });

    y += 8;
    addLine('Para constancia, firman:', 10, false);
    y += 15;

    // Signature lines
    doc.line(marginL, y, marginL + 60, y);
    doc.line(pageW - marginR - 60, y, pageW - marginR, y);
    y += 5;
    doc.setFontSize(8);
    doc.text('Capacitado', marginL + 20, y);
    doc.text('Empresa', pageW - marginR - 35, y);

    // Page 2: Participant IDs
    doc.addPage();
    y = 25;
    addLine('CÉDULAS DE IDENTIDAD - PARTICIPANTES', 13, true, 'center');
    y += 5;
    addLine(`Módulo: ${modId} — ${empresa}`, 10, false, 'center');
    y += 8;

    // Mock participants
    const mockParticipants = [
      { nombre: 'Víctor Manuel Madrid Madrid', rut: '21.826.390-9', nacimiento: '28/04/2005', nacionalidad: 'Chilena' },
      { nombre: 'Carlos Andrés Pérez Soto', rut: '19.543.221-7', nacimiento: '15/03/2000', nacionalidad: 'Chilena' },
      { nombre: 'María José González Fuentes', rut: '20.112.445-3', nacimiento: '22/11/2001', nacionalidad: 'Chilena' },
      { nombre: 'Juan Pablo Rodríguez Muñoz', rut: '18.765.890-K', nacimiento: '03/07/1998', nacionalidad: 'Chilena' },
    ];

    mockParticipants.forEach((p, idx) => {
      if (y > 230) { doc.addPage(); y = 25; }

      // Card border
      doc.setDrawColor(180, 180, 180);
      doc.roundedRect(marginL, y, contentW, 35, 2, 2);
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(marginL, y, contentW, 8, 2, 2, 'F');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`CÉDULA DE IDENTIDAD — REPÚBLICA DE CHILE`, marginL + 4, y + 5);
      doc.text(`Participante ${idx + 1}`, marginL + contentW - 25, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      y += 12;
      doc.text(`Nombre: ${p.nombre}`, marginL + 4, y);
      y += 5;
      doc.text(`RUT: ${p.rut}`, marginL + 4, y);
      doc.text(`Fecha Nacimiento: ${p.nacimiento}`, marginL + contentW / 2, y);
      y += 5;
      doc.text(`Nacionalidad: ${p.nacionalidad}`, marginL + 4, y);
      y += 18;
    });

    // Observations page
    doc.addPage();
    y = 25;
    addLine('OBSERVACIONES:', 12, true);
    y += 5;
    const observations = [
      'A. En la cláusula primera debe indicarse en forma precisa el lugar de ejecución del curso.',
      'B. La cláusula quinta es optativa, debe utilizarse cuando el módulo práctico a desarrollarse al interior de la empresa individualizada en el presente contrato de capacitación, es necesario para la habilitación laboral del capacitado.',
      'C. Si el contrato de capacitación es celebrado por un menor de 18 años de edad, debe comparecer en dicho acto su representante legal de conformidad a las normas del derecho común.',
      'D. Respecto de la cláusula séptima cabe señalar que de acuerdo a lo dispuesto en el inciso penúltimo del artículo 33 de la Ley Nº 19.518, el contrato de capacitación no podrá exceder en total de dos meses, incluidas las prórrogas que pudieren acordarse por las partes.',
    ];
    observations.forEach(obs => {
      addLine(obs, 9, false);
      y += 3;
    });

    doc.save(`Precontrato_Modular_${modId}_${empresa.replace(/\s/g, '_')}.pdf`);
    toast.success(`Documento descargado: Precontrato Modular ${modId}`);
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
      </div>
      <Accordion type="multiple" className="space-y-3">
        {paginatedGroups.map(([modId, cursos]) => (
          <AccordionItem key={modId} value={modId} className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3 text-left flex-1">
                <span className="inline-block border rounded-full px-3 py-0.5 text-xs font-bold text-primary bg-primary/10 border-primary/20">
                  {modId}
                </span>
                <span className="text-sm font-medium text-foreground">{cursos[0].cliente}</span>
                <Badge variant="secondary" className="text-xs">{cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}</Badge>
                {showAddCourse && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto mr-2 gap-1 text-xs h-7 px-2 text-primary border-primary/30 hover:bg-primary/10"
                    onClick={(e) => handleOpenAddModal(modId, cursos[0].cliente, e)}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Agregar curso
                  </Button>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs table-fixed">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-2 w-8">
                        <Checkbox disabled />
                      </th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[7%]">
                        S.C <span className="text-xs">▾</span>
                      </th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[18%]">
                        Cliente <span className="text-xs">▾</span>
                      </th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[5%]">
                        Nro. Part. <span className="text-xs">▾</span>
                      </th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                        M.T. Franquicia <span className="text-xs">▾</span>
                      </th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[9%]">
                        Inicio Curso <span className="text-xs">▾</span>
                      </th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                        Modalidad <span className="text-xs">▾</span>
                      </th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                        Tipo Contrato <span className="text-xs">▾</span>
                      </th>
                      <th className="p-2 text-left font-medium text-muted-foreground w-[12%]">
                        <span className="inline-flex items-center gap-1">
                          <span>Vigencia <span className="text-xs">▾</span></span>
                          <span className="inline-flex items-center rounded-full bg-blue-600 px-1 py-0.5 text-[8px] font-bold leading-none text-white shadow-sm">C1CCOM4</span>
                        </span>
                      </th>
                      <th className="p-2 text-center font-medium text-muted-foreground w-[12%]">
                        <span className="inline-flex items-center gap-1">
                          <span>No comunicar</span>
                          <span className="inline-flex items-center rounded-full bg-blue-600 px-1 py-0.5 text-[8px] font-bold leading-none text-white shadow-sm">C1CCOM5</span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map((curso, idx) => {
                      const excluido = noComunicar.includes(curso.sc);
                      return (
                        <tr key={curso.sc} className={`border-b ${excluido ? 'bg-red-50/50 opacity-60' : idx % 2 === 0 ? 'hover:bg-muted/20' : 'bg-muted/10 hover:bg-muted/20'}`}>
                          <td className="p-2">
                            <Checkbox
                              checked={selectedRows.includes(curso.sc)}
                              onCheckedChange={(checked) => handleSelectRow(curso.sc, !!checked)}
                              disabled={excluido}
                            />
                          </td>
                          <td className="p-2 font-medium">{curso.sc}</td>
                          <td className="p-2 text-muted-foreground truncate">{curso.cliente}</td>
                          <td className="p-2 text-center">{curso.nroPart}</td>
                          <td className="p-2">{curso.mtFranquicia}</td>
                          <td className="p-2">{curso.inicioCurso}</td>
                          <td className="p-2">{curso.modalidad}</td>
                          <td className="p-2">{curso.tipoContrato}</td>
                          <td className="p-2">
                            {isProximoAVencer(curso.vencimientoSence) ? (
                              <Badge variant="destructive" className="gap-1 text-[10px] whitespace-nowrap px-2 py-0.5">
                                <AlertCircle className="w-3 h-3" />
                                Por vencer
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">Vigente</span>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              variant={excluido ? 'destructive' : 'outline'}
                              size="sm"
                              className="gap-1 text-xs h-7 px-2"
                              onClick={() => toggleNoComunicar(curso.sc)}
                            >
                              {excluido ? (
                                <><EyeOff className="w-3 h-3" /> Excluido</>
                              ) : (
                                <><Ban className="w-3 h-3" /> Excluir</>
                              )}
                            </Button>
                          </td>
                        </tr>
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
    </>
  );
};

export default ModularesTab;
