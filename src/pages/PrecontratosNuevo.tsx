import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { ArrowLeft, Search, Download, Home, CalendarIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import CursoDetalleCompleto from '@/components/precontratos/CursoDetalleCompleto';

interface ParticipantePrecontrato {
  nombre: string;
}

interface PrecontratoDetalle {
  numeroSC: string;
  fechaPrecontrato: string;
  fechaLimite: string;
  nombreRepresentante: string;
  rutRepresentante: string;
  dvRepresentante: string;
  emailRepresentante: string;
  nombreRepresentanteOpcional: string;
  rutRepresentanteOpcional: string;
  dvRepresentanteOpcional: string;
  participantes: ParticipantePrecontrato[];
}

const mockResultados: PrecontratoDetalle[] = [
  {
    numeroSC: '2032050',
    fechaPrecontrato: '17/10/2024',
    fechaLimite: '16/10/2024',
    nombreRepresentante: 'Andrea Jara Ortega',
    rutRepresentante: '16639860',
    dvRepresentante: '4',
    emailRepresentante: '',
    nombreRepresentanteOpcional: '',
    rutRepresentanteOpcional: '',
    dvRepresentanteOpcional: '',
    participantes: [
      { nombre: 'Alejandro Elías Jesús Castillo Rodríguez' },
      { nombre: 'Bryan Tomás Villagra Núñez' },
      { nombre: 'Camila Fernanda Flores Pizarro' },
      { nombre: 'Claudia Alejandra Chacana Cabrera' },
      { nombre: 'Cristian Luis Vergara Tobar' },
    ],
  },
];

interface CursoPrecontrato {
  numeroSC: string;
  nombreCurso: string;
  sencenet: string;
  ssc: string;
  montoTotalOtec: number;
  otec: string;
  oc: string;
  estadoCurso: 'Activo' | 'Cerrado' | 'Suspendido' | 'Programado';
  celula: string;
  analistaResponsable: string;
  edcACargo: string;
  jefeComercial: string;
  fechaCreacionPC: string;
  estadoSence: 'Aprobado' | 'En Revisión' | 'Rechazado' | 'Pendiente';
  modalidad: 'Presencial' | 'E-learning' | 'Distancia';
  partActivos: number;
  fechaInicio: string;
  fechaTermino: string;
  participantes: number;
  estado: 'Pendiente' | 'En Proceso' | 'Firmado';
}

const otecs = ['EDUCAPRO Ltda.', 'Capacita Chile S.A.', 'Formación Total', 'Pro Training SpA', 'Aprende+ Ltda.'];
const celulas = ['Célula Norte', 'Célula Sur', 'Célula Centro', 'Célula Oriente', 'Célula Poniente'];
const analistas = ['María González', 'Juan Pérez', 'Carla Soto', 'Luis Ramírez', 'Pamela Díaz'];
const edcs = ['Roberto Muñoz', 'Andrea Lagos', 'Felipe Torres', 'Sofía Vega'];
const jefesComerciales = ['Patricia Rojas', 'Diego Salas', 'Marcela Castro'];
const cursos = [
  'Excel Avanzado para Gestión',
  'Liderazgo y Gestión de Equipos',
  'Prevención de Riesgos Laborales',
  'Atención al Cliente Premium',
  'Power BI para Analistas',
  'Comunicación Efectiva',
  'Gestión del Cambio',
  'Inglés de Negocios',
  'Trabajo en Equipo',
  'Manejo Defensivo',
];
const estadosCurso: CursoPrecontrato['estadoCurso'][] = ['Activo', 'Cerrado', 'Suspendido', 'Programado'];
const estadosSence: CursoPrecontrato['estadoSence'][] = ['Aprobado', 'En Revisión', 'Rechazado', 'Pendiente'];
const modalidades: CursoPrecontrato['modalidad'][] = ['Presencial', 'E-learning', 'Distancia'];
const estadosPC: CursoPrecontrato['estado'][] = ['Pendiente', 'En Proceso', 'Firmado'];

const pad = (n: number) => String(n).padStart(2, '0');
const randomDate = (year: number) => {
  const m = Math.floor(Math.random() * 12) + 1;
  const d = Math.floor(Math.random() * 28) + 1;
  return `${pad(d)}/${pad(m)}/${year}`;
};

const mockCursos: CursoPrecontrato[] = Array.from({ length: 87 }, (_, i) => {
  const sc = String(2032050 + i);
  return {
    numeroSC: sc,
    nombreCurso: cursos[i % cursos.length],
    sencenet: `SN-${100000 + i}`,
    ssc: `SSC-${50000 + i}`,
    montoTotalOtec: 500000 + (i * 37500) % 4500000,
    otec: otecs[i % otecs.length],
    oc: `OC-${800000 + i}`,
    estadoCurso: estadosCurso[i % estadosCurso.length],
    celula: celulas[i % celulas.length],
    analistaResponsable: analistas[i % analistas.length],
    edcACargo: edcs[i % edcs.length],
    jefeComercial: jefesComerciales[i % jefesComerciales.length],
    fechaCreacionPC: randomDate(2024),
    estadoSence: estadosSence[i % estadosSence.length],
    modalidad: modalidades[i % modalidades.length],
    partActivos: 5 + (i * 3) % 25,
    fechaInicio: randomDate(2024),
    fechaTermino: randomDate(2024),
    participantes: 5 + (i * 3) % 25,
    estado: estadosPC[i % estadosPC.length],
  };
});

const PAGE_SIZE = 10;

const PrecontratosNuevo: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<PrecontratoDetalle | null>(null);
  const [cursoDetalleSC, setCursoDetalleSC] = useState<string | null>(null);
  const [cursoDetalleIdModular, setCursoDetalleIdModular] = useState<string | undefined>();
  const [tab, setTab] = useState('buscador');
  const [page, setPage] = useState(1);
  const [pageModulares, setPageModulares] = useState(1);

  // Filtros grilla "Precontrato Normal"
  const [fSencenet, setFSencenet] = useState('');
  const [fEstadoSence, setFEstadoSence] = useState<string>('all');
  const [fCelula, setFCelula] = useState<string>('all');
  const [fLiderEdc, setFLiderEdc] = useState<string>('all');
  const [fFechaCreacionPC, setFFechaCreacionPC] = useState<Date | undefined>();
  const [fFechaInicio, setFFechaInicio] = useState<Date | undefined>();
  const [fFechaTermino, setFFechaTermino] = useState<Date | undefined>();

  const handleBuscar = () => {
    const resultado = mockResultados.find((r) => r.numeroSC === busqueda.trim());
    setDetalle(resultado || null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBuscar();
  };

  const parseDMY = (s: string) => {
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d);
  };
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const filteredCursos = useMemo(() => {
    return mockCursos.filter((c) => {
      if (fSencenet && !c.sencenet.toLowerCase().includes(fSencenet.toLowerCase())) return false;
      if (fEstadoSence !== 'all' && c.estadoSence !== fEstadoSence) return false;
      if (fCelula !== 'all' && c.celula !== fCelula) return false;
      if (fLiderEdc !== 'all' && c.edcACargo !== fLiderEdc) return false;
      if (fFechaCreacionPC && !sameDay(parseDMY(c.fechaCreacionPC), fFechaCreacionPC)) return false;
      if (fFechaInicio && !sameDay(parseDMY(c.fechaInicio), fFechaInicio)) return false;
      if (fFechaTermino && !sameDay(parseDMY(c.fechaTermino), fFechaTermino)) return false;
      return true;
    });
  }, [fSencenet, fEstadoSence, fCelula, fLiderEdc, fFechaCreacionPC, fFechaInicio, fFechaTermino]);

  const totalPages = Math.max(1, Math.ceil(filteredCursos.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedCursos = useMemo(
    () => filteredCursos.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredCursos, safePage]
  );

  const limpiarFiltros = () => {
    setFSencenet('');
    setFEstadoSence('all');
    setFCelula('all');
    setFLiderEdc('all');
    setFFechaCreacionPC(undefined);
    setFFechaInicio(undefined);
    setFFechaTermino(undefined);
    setPage(1);
  };

  React.useEffect(() => { setPage(1); }, [fSencenet, fEstadoSence, fCelula, fLiderEdc, fFechaCreacionPC, fFechaInicio, fFechaTermino]);


  const formatCLP = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  const estadoBadge = (estado: CursoPrecontrato['estado']) => {
    const styles: Record<CursoPrecontrato['estado'], string> = {
      Pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
      'En Proceso': 'bg-blue-100 text-blue-800 border-blue-200',
      Firmado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[estado]}`}>
        {estado}
      </span>
    );
  };

  const estadoCursoBadge = (estado: CursoPrecontrato['estadoCurso']) => {
    const styles: Record<CursoPrecontrato['estadoCurso'], string> = {
      Activo: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Cerrado: 'bg-slate-100 text-slate-800 border-slate-200',
      Suspendido: 'bg-red-100 text-red-800 border-red-200',
      Programado: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[estado]}`}>
        {estado}
      </span>
    );
  };

  const estadoSenceBadge = (estado: CursoPrecontrato['estadoSence']) => {
    const styles: Record<CursoPrecontrato['estadoSence'], string> = {
      Aprobado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'En Revisión': 'bg-blue-100 text-blue-800 border-blue-200',
      Rechazado: 'bg-red-100 text-red-800 border-red-200',
      Pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[estado]}`}>
        {estado}
      </span>
    );
  };

  // Breadcrumbs
  const Migas = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard" className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Inicio
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <span className="text-muted-foreground">Cursos y Servicios</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Precontratos</BreadcrumbPage>
        </BreadcrumbItem>
        {detalle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>SC {detalle.numeroSC}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {cursoDetalleSC && !detalle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Curso SC {cursoDetalleSC}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (cursoDetalleSC) {
    return (
      <div className="space-y-6">
        {Migas}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Detalle del Curso</h1>
        </div>
        <CursoDetalleCompleto numeroSC={cursoDetalleSC} onBack={() => { setCursoDetalleSC(null); setCursoDetalleIdModular(undefined); }} idModular={cursoDetalleIdModular} />
      </div>
    );
  }

  if (detalle) {
    return (
      <div className="space-y-6">
        {Migas}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <Button variant="outline" size="sm" onClick={() => setDetalle(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver
            </Button>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30 w-1/3">Número SC</td>
                    <td className="p-2">
                      <Input value={detalle.numeroSC} readOnly className="h-8 max-w-xs" />
                    </td>
                    <td className="p-2 text-destructive font-medium text-sm">
                      El precontrato debe ser presentado antes de {detalle.fechaLimite}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Fecha del Precontrato:</td>
                    <td className="p-2" colSpan={2}>
                      <Input value={detalle.fechaPrecontrato} readOnly className="h-8 max-w-xs" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-destructive/10 text-destructive font-medium text-sm p-2 border-b">
                Ingrese los datos de quien firmara el documento:
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30 w-1/3">Nombre Representante de la Empresa:</td>
                    <td className="p-2" colSpan={2}>
                      <Input defaultValue={detalle.nombreRepresentante} className="h-8" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Rut Representante de la Empresa:</td>
                    <td className="p-2" colSpan={2}>
                      <div className="flex gap-2 items-center">
                        <Input defaultValue={detalle.rutRepresentante} className="h-8 max-w-[160px]" />
                        <Input defaultValue={detalle.dvRepresentante} className="h-8 w-12" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Email Representante de la Empresa:</td>
                    <td className="p-2" colSpan={2}>
                      <Input defaultValue={detalle.emailRepresentante} className="h-8" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Nombre Representante de la Empresa (opcional):</td>
                    <td className="p-2" colSpan={2}>
                      <Input defaultValue={detalle.nombreRepresentanteOpcional} className="h-8" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-muted/30">Rut Representante de la Empresa (opcional):</td>
                    <td className="p-2" colSpan={2}>
                      <div className="flex gap-2 items-center">
                        <Input defaultValue={detalle.rutRepresentanteOpcional} className="h-8 max-w-[160px]" />
                        <Input defaultValue={detalle.dvRepresentanteOpcional} className="h-8 w-12" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Descargar todos los contratos en</span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" /> Word
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2 text-left font-medium">Nombre del Participante</th>
                    <th className="p-2 text-left font-medium">Link descarga individual</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.participantes.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{p.nombre}</td>
                      <td className="p-2">
                        <button className="text-primary hover:underline text-sm">Descargar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Migas}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="buscador">Buscador</TabsTrigger>
          <TabsTrigger value="cursos">Precontrato Normal</TabsTrigger>
          <TabsTrigger value="parcial">Parcial Complementario</TabsTrigger>
        </TabsList>

        <TabsContent value="buscador" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Busque un precontrato por Solicitud de Compra para ver su detalle.
          </p>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-end gap-4">
                <div className="flex-1 max-w-md space-y-1">
                  <label className="text-sm font-medium">Solicitud de Compra (SC)</label>
                  <Input
                    placeholder="Ej: 2032050"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button onClick={handleBuscar}>
                  <Search className="w-4 h-4 mr-2" /> Buscar
                </Button>
              </div>
              {busqueda && !detalle && (
                <p className="text-sm text-muted-foreground mt-4">
                  Ingrese un número de SC válido. Pruebe con:{' '}
                  <span className="font-mono text-foreground">2032050</span>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursos" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Listado de cursos asociados a precontratos. Seleccione una SC para ver el detalle.
          </p>

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Sencenet</Label>
                  <Input
                    placeholder="Ej: SN-100000"
                    value={fSencenet}
                    onChange={(e) => setFSencenet(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Estado Sence</Label>
                  <Select value={fEstadoSence} onValueChange={setFEstadoSence}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {estadosSence.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Célula</Label>
                  <Select value={fCelula} onValueChange={setFCelula}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {celulas.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Líder EDC</Label>
                  <Select value={fLiderEdc} onValueChange={setFLiderEdc}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {edcs.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Fecha Creación PC</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-9 w-full justify-start text-left font-normal',
                          !fFechaCreacionPC && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fFechaCreacionPC ? format(fFechaCreacionPC, 'dd/MM/yyyy', { locale: es }) : <span>Seleccionar</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fFechaCreacionPC}
                        onSelect={setFFechaCreacionPC}
                        initialFocus
                        locale={es}
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Fecha Inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-9 w-full justify-start text-left font-normal',
                          !fFechaInicio && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fFechaInicio ? format(fFechaInicio, 'dd/MM/yyyy', { locale: es }) : <span>Seleccionar</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fFechaInicio}
                        onSelect={setFFechaInicio}
                        initialFocus
                        locale={es}
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Fecha Término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-9 w-full justify-start text-left font-normal',
                          !fFechaTermino && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fFechaTermino ? format(fFechaTermino, 'dd/MM/yyyy', { locale: es }) : <span>Seleccionar</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fFechaTermino}
                        onSelect={setFFechaTermino}
                        initialFocus
                        locale={es}
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="h-9 w-full" onClick={limpiarFiltros}>
                    <X className="w-4 h-4 mr-1" /> Limpiar filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      
                      
                      <th className="p-2 text-left font-medium">Sencenet</th>
                      <th className="p-2 text-left font-medium">SSC</th>
                      <th className="p-2 text-right font-medium">Monto Total OTEC</th>
                      <th className="p-2 text-left font-medium">OTEC</th>
                      <th className="p-2 text-left font-medium">OC</th>
                      <th className="p-2 text-left font-medium">Estado del Curso</th>
                      <th className="p-2 text-left font-medium">Célula</th>
                      <th className="p-2 text-left font-medium">Analista Responsable</th>
                      <th className="p-2 text-left font-medium">EDC a Cargo</th>
                      <th className="p-2 text-left font-medium">Jefe Comercial</th>
                      <th className="p-2 text-left font-medium">Fecha Creación PC</th>
                      <th className="p-2 text-left font-medium">Estado Sence</th>
                      <th className="p-2 text-left font-medium">Modalidad</th>
                      <th className="p-2 text-right font-medium">N° Part. Activos</th>
                      <th className="p-2 text-left font-medium">Fecha Inicio</th>
                      <th className="p-2 text-left font-medium">Fecha Término</th>
                      <th className="p-2 text-left font-medium sticky right-0 bg-muted/50">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCursos.map((c) => (
                      <tr key={c.numeroSC} className="border-b hover:bg-muted/30">
                        
                        
                        <td className="p-2 font-mono text-muted-foreground">{c.sencenet}</td>
                        <td className="p-2 font-mono text-muted-foreground">{c.ssc}</td>
                        <td className="p-2 text-right font-mono">{formatCLP(c.montoTotalOtec)}</td>
                        <td className="p-2">{c.otec}</td>
                        <td className="p-2 font-mono text-muted-foreground">{c.oc}</td>
                        <td className="p-2">{estadoCursoBadge(c.estadoCurso)}</td>
                        <td className="p-2">{c.celula}</td>
                        <td className="p-2">{c.analistaResponsable}</td>
                        <td className="p-2">{c.edcACargo}</td>
                        <td className="p-2">{c.jefeComercial}</td>
                        <td className="p-2">{c.fechaCreacionPC}</td>
                        <td className="p-2">{estadoSenceBadge(c.estadoSence)}</td>
                        <td className="p-2">{c.modalidad}</td>
                        <td className="p-2 text-right">{c.partActivos}</td>
                        <td className="p-2">{c.fechaInicio}</td>
                        <td className="p-2">{c.fechaTermino}</td>
                        <td className="p-2 sticky right-0 bg-background">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCursoDetalleSC(c.numeroSC)}
                          >
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between p-3 border-t flex-wrap gap-2">
                <p className="text-xs text-muted-foreground">
                  {filteredCursos.length === 0
                    ? 'Sin registros'
                    : `Mostrando ${(safePage - 1) * PAGE_SIZE + 1}-${Math.min(safePage * PAGE_SIZE, filteredCursos.length)} de ${filteredCursos.length} registros`}
                </p>
                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                        className={safePage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                      .map((p, idx, arr) => (
                        <React.Fragment key={p}>
                          {idx > 0 && p - arr[idx - 1] > 1 && (
                            <PaginationItem><PaginationEllipsis /></PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              isActive={p === safePage}
                              onClick={(e) => { e.preventDefault(); setPage(p); }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        </React.Fragment>
                      ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                        className={safePage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="parcial" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Listado de precontratos parciales complementarios. Seleccione una SC para ver el detalle.
          </p>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-3 text-left font-medium">N° SC</th>
                      <th className="p-3 text-left font-medium">Nombre del Curso</th>
                      <th className="p-3 text-left font-medium">SC Original</th>
                      <th className="p-3 text-left font-medium">Fecha Complemento</th>
                      <th className="p-3 text-left font-medium">Participantes Adic.</th>
                      <th className="p-3 text-left font-medium">Estado</th>
                      <th className="p-3 text-left font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { numeroSC: '2032050-C1', nombreCurso: 'Excel Avanzado para Gestión', scOriginal: '2032050', fecha: '25/10/2024', participantes: 2, estado: 'Pendiente' as const },
                      { numeroSC: '2032051-C1', nombreCurso: 'Liderazgo y Gestión de Equipos', scOriginal: '2032051', fecha: '12/11/2024', participantes: 3, estado: 'En Proceso' as const },
                      { numeroSC: '2032052-C1', nombreCurso: 'Prevención de Riesgos Laborales', scOriginal: '2032052', fecha: '08/10/2024', participantes: 1, estado: 'Firmado' as const },
                    ].map((c) => (
                      <tr key={c.numeroSC} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-mono text-foreground">{c.numeroSC}</td>
                        <td className="p-3">{c.nombreCurso}</td>
                        <td className="p-3 font-mono text-muted-foreground">{c.scOriginal}</td>
                        <td className="p-3">{c.fecha}</td>
                        <td className="p-3">{c.participantes}</td>
                        <td className="p-3">{estadoBadge(c.estado)}</td>
                        <td className="p-3">
                          <Button variant="outline" size="sm">Ver detalle</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default PrecontratosNuevo;
