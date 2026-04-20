import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CursoModular {
  idModular: string;
  nroInscripcion: string;
  sencenet: string;
  curso: string;
  empresa: string;
  nroParticipantes: number;
  inicioTermino: string;
  celula: string;
}

const cursosModulares: CursoModular[] = [
  { idModular: 'MOD-001', nroInscripcion: '2160101', sencenet: '6790101', curso: 'Operación Segura de Equipos Mineros', empresa: '76.081.590-K – Sierra Gorda S.c.m.', nroParticipantes: 18, inicioTermino: '05/05/2026 - 05/06/2026', celula: 'Cel1' },
  { idModular: 'MOD-001', nroInscripcion: '2160107', sencenet: '6790107', curso: 'Manejo Defensivo en Faenas', empresa: '76.081.590-K – Sierra Gorda S.c.m.', nroParticipantes: 15, inicioTermino: '08/05/2026 - 08/06/2026', celula: 'Cel1' },
  { idModular: 'MOD-001', nroInscripcion: '2160108', sencenet: '6790108', curso: 'Primeros Auxilios en Terreno', empresa: '76.081.590-K – Sierra Gorda S.c.m.', nroParticipantes: 20, inicioTermino: '10/05/2026 - 10/06/2026', celula: 'Cel1' },
  { idModular: 'MOD-002', nroInscripcion: '2160102', sencenet: '6790102', curso: 'Mantenimiento Predictivo Industrial', empresa: '85.066.600-8 – Albemarle Limitada', nroParticipantes: 22, inicioTermino: '07/05/2026 - 07/06/2026', celula: 'Cel2' },
  { idModular: 'MOD-002', nroInscripcion: '2160109', sencenet: '6790109', curso: 'Lubricación y Análisis de Aceites', empresa: '85.066.600-8 – Albemarle Limitada', nroParticipantes: 18, inicioTermino: '12/05/2026 - 12/06/2026', celula: 'Cel2' },
  { idModular: 'MOD-003', nroInscripcion: '2160103', sencenet: '6790103', curso: 'Liderazgo y Gestión de Equipos', empresa: '93.770.000-8 – Goodyear de Chile S.a.i.c.', nroParticipantes: 15, inicioTermino: '10/05/2026 - 10/06/2026', celula: 'Cel3' },
  { idModular: 'MOD-003', nroInscripcion: '2160110', sencenet: '6790110', curso: 'Comunicación Efectiva', empresa: '93.770.000-8 – Goodyear de Chile S.a.i.c.', nroParticipantes: 15, inicioTermino: '15/05/2026 - 15/06/2026', celula: 'Cel3' },
  { idModular: 'MOD-004', nroInscripcion: '2160104', sencenet: '6790104', curso: 'Excel Avanzado para Gestión', empresa: '78.163.829-3 – Gestiones y Servicios Los Álamos S.A.', nroParticipantes: 25, inicioTermino: '12/05/2026 - 12/06/2026', celula: 'Cel4' },
  { idModular: 'MOD-005', nroInscripcion: '2160105', sencenet: '6790105', curso: 'Inglés Técnico Nivel Intermedio', empresa: '93.077.000-0 – Metso Chile SPA', nroParticipantes: 12, inicioTermino: '15/05/2026 - 15/06/2026', celula: 'Cel5' },
  { idModular: 'MOD-005', nroInscripcion: '2160111', sencenet: '6790111', curso: 'Inglés Técnico Nivel Avanzado', empresa: '93.077.000-0 – Metso Chile SPA', nroParticipantes: 10, inicioTermino: '20/06/2026 - 20/07/2026', celula: 'Cel5' },
  { idModular: 'MOD-006', nroInscripcion: '2160106', sencenet: '6790106', curso: 'Gestión Documental Digital', empresa: '76.727.040-2 – Minera Centinela', nroParticipantes: 20, inicioTermino: '18/05/2026 - 18/06/2026', celula: 'Cel6' },
  { idModular: 'MOD-007', nroInscripcion: '2160112', sencenet: '6790112', curso: 'Soldadura TIG Avanzada', empresa: '96.530.200-7 – CAP Acero S.A.', nroParticipantes: 14, inicioTermino: '20/05/2026 - 20/06/2026', celula: 'Cel1' },
  { idModular: 'MOD-007', nroInscripcion: '2160113', sencenet: '6790113', curso: 'Soldadura MIG Industrial', empresa: '96.530.200-7 – CAP Acero S.A.', nroParticipantes: 14, inicioTermino: '25/05/2026 - 25/06/2026', celula: 'Cel1' },
  { idModular: 'MOD-008', nroInscripcion: '2160114', sencenet: '6790114', curso: 'Gestión de Proyectos PMI', empresa: '76.196.556-2 – Bechtel Chile Ltda.', nroParticipantes: 16, inicioTermino: '01/06/2026 - 01/07/2026', celula: 'Cel2' },
  { idModular: 'MOD-009', nroInscripcion: '2160115', sencenet: '6790115', curso: 'Control de Calidad ISO 9001', empresa: '90.266.000-3 – Nestlé Chile S.A.', nroParticipantes: 30, inicioTermino: '03/06/2026 - 03/07/2026', celula: 'Cel3' },
  { idModular: 'MOD-009', nroInscripcion: '2160116', sencenet: '6790116', curso: 'Auditoría Interna ISO 19011', empresa: '90.266.000-3 – Nestlé Chile S.A.', nroParticipantes: 20, inicioTermino: '10/06/2026 - 10/07/2026', celula: 'Cel3' },
  { idModular: 'MOD-010', nroInscripcion: '2160117', sencenet: '6790117', curso: 'Power BI para Analistas', empresa: '76.645.030-K – Falabella Tecnología', nroParticipantes: 28, inicioTermino: '05/06/2026 - 05/07/2026', celula: 'Cel4' },
  { idModular: 'MOD-011', nroInscripcion: '2160118', sencenet: '6790118', curso: 'Prevención de Riesgos Eléctricos', empresa: '91.143.000-2 – CGE Distribución S.A.', nroParticipantes: 19, inicioTermino: '08/06/2026 - 08/07/2026', celula: 'Cel5' },
  { idModular: 'MOD-011', nroInscripcion: '2160119', sencenet: '6790119', curso: 'Trabajo en Altura Física', empresa: '91.143.000-2 – CGE Distribución S.A.', nroParticipantes: 19, inicioTermino: '15/06/2026 - 15/07/2026', celula: 'Cel5' },
  { idModular: 'MOD-012', nroInscripcion: '2160120', sencenet: '6790120', curso: 'Atención al Cliente Premium', empresa: '76.101.347-4 – Cencosud Retail S.A.', nroParticipantes: 35, inicioTermino: '10/06/2026 - 10/07/2026', celula: 'Cel6' },
  { idModular: 'MOD-013', nroInscripcion: '2160121', sencenet: '6790121', curso: 'Logística y Cadena de Suministro', empresa: '96.989.940-0 – CSAV S.A.', nroParticipantes: 17, inicioTermino: '12/06/2026 - 12/07/2026', celula: 'Cel1' },
  { idModular: 'MOD-014', nroInscripcion: '2160122', sencenet: '6790122', curso: 'Normativa Ambiental Vigente', empresa: '76.081.590-K – Sierra Gorda S.c.m.', nroParticipantes: 22, inicioTermino: '15/06/2026 - 15/07/2026', celula: 'Cel2' },
];

interface ModularesTabProps {
  onVerDetalle?: (nroInscripcion: string, idModular: string) => void;
}

const MOD_PAGE_SIZE = 10;

const ModularesTab: React.FC<ModularesTabProps> = ({ onVerDetalle }) => {
  const [pageModulares, setPageModulares] = useState(1);

  const grouped = cursosModulares.reduce<Record<string, CursoModular[]>>((acc, c) => {
    if (!acc[c.idModular]) acc[c.idModular] = [];
    acc[c.idModular].push(c);
    return acc;
  }, {});

  const allGroups = Object.entries(grouped);
  const totalPagesModulares = Math.max(1, Math.ceil(allGroups.length / MOD_PAGE_SIZE));
  const safePageMod = Math.min(pageModulares, totalPagesModulares);
  const paginatedGroups = allGroups.slice((safePageMod - 1) * MOD_PAGE_SIZE, safePageMod * MOD_PAGE_SIZE);

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
              <div className="flex items-center gap-3 text-left">
                <span className="inline-block border rounded-full px-3 py-0.5 text-xs font-bold text-primary bg-primary/10 border-primary/20">
                  {modId}
                </span>
                <span className="text-sm font-medium text-foreground">{cursos[0].empresa}</span>
                <Badge variant="secondary" className="text-xs">{cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-3 text-center font-medium">Nº Inscripción</th>
                      <th className="p-3 text-center font-medium">Sencenet</th>
                      <th className="p-3 text-left font-medium">Curso</th>
                      <th className="p-3 text-center font-medium">Nº Part.</th>
                      <th className="p-3 text-left font-medium">Inicio - Término</th>
                      <th className="p-3 text-center font-medium">Célula</th>
                      {onVerDetalle && <th className="p-3 text-center font-medium">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map((c, idx) => (
                      <tr key={c.nroInscripcion} className={`border-b hover:bg-muted/30 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                        <td className="p-3 text-center font-mono">{c.nroInscripcion}</td>
                        <td className="p-3 text-center font-mono">{c.sencenet}</td>
                        <td className="p-3">{c.curso}</td>
                        <td className="p-3 text-center">{c.nroParticipantes}</td>
                        <td className="p-3 text-muted-foreground">{c.inicioTermino}</td>
                        <td className="p-3 text-center text-muted-foreground">{c.celula}</td>
                        {onVerDetalle && (
                          <td className="p-3 text-center">
                            <Button variant="outline" size="sm" onClick={() => onVerDetalle(c.nroInscripcion, c.idModular)}>Ver Detalle</Button>
                          </td>
                        )}
                      </tr>
                    ))}
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
    </>
  );
};

export default ModularesTab;
