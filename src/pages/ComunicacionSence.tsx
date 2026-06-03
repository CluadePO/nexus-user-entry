import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, PlusCircle, ArrowRight, AlertCircle, Ban, Eye, EyeOff } from 'lucide-react';
import ModularesTab from '@/components/precontratos/ModularesTab';
import CursoDetalleCompleto from '@/components/precontratos/CursoDetalleCompleto';

interface CursoSence {
  sc: string;
  cliente: string;
  nroPart: number;
  mtFranquicia: string;
  inicioCurso: string;
  modalidad: string;
  tipoContrato: string;
  codigoSence: string;
  vencimientoSence: string;
}

const mockCursos: CursoSence[] = [
  { sc: '2074555', cliente: 'SALMONES BLUMAR MAGALLANES SPA', nroPart: 1, mtFranquicia: '$250.250', inicioCurso: '26/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238015432', vencimientoSence: '2026-04-20' },
  { sc: '2078017', cliente: 'DOMINION SPA', nroPart: 1, mtFranquicia: '$250.250', inicioCurso: '26/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238017891', vencimientoSence: '2026-06-15' },
  { sc: '2078959', cliente: 'SECURITAS S.A', nroPart: 19, mtFranquicia: '$2.376.000', inicioCurso: '21/04/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238019200', vencimientoSence: '2026-04-18' },
  { sc: '2078960', cliente: 'SERVICIOS SECURITAS AUSTRAL LIMITADA', nroPart: 1, mtFranquicia: '$158.400', inicioCurso: '21/04/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238019201', vencimientoSence: '2026-07-30' },
  { sc: '2079922', cliente: 'ELECNOR CHILE S A', nroPart: 1, mtFranquicia: '$500.500', inicioCurso: '26/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238020155', vencimientoSence: '2026-04-22' },
  { sc: '2085199', cliente: 'COOPERATIVA AGRICOLA PISQUERA ELQUI LTDA.', nroPart: 1, mtFranquicia: '$44.156', inicioCurso: '19/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238025400', vencimientoSence: '2026-08-10' },
  { sc: '2086977', cliente: 'INSTITUTO NACIONAL DE CAPACITACION PROFESIONAL', nroPart: 2, mtFranquicia: '$664.500', inicioCurso: '19/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238026800', vencimientoSence: '2026-04-19' },
  { sc: '2091162', cliente: 'SERVEO FACILITY MANAGEMENT S.A. AGENCIA EN CHILE', nroPart: 1, mtFranquicia: '$210.000', inicioCurso: '26/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238031000', vencimientoSence: '2026-09-01' },
  { sc: '2092667', cliente: 'SACYR CHILE S.A.', nroPart: 1, mtFranquicia: '$500.500', inicioCurso: '26/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238032500', vencimientoSence: '2026-05-20' },
  { sc: '2097498', cliente: 'AGRICOLA LOS QUILLAYES LIMITADA', nroPart: 1, mtFranquicia: '$275.000', inicioCurso: '12/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238037000', vencimientoSence: '2026-04-21' },
  { sc: '2101685', cliente: 'SERVICIO TECNICO TECNOSUR LTDA.', nroPart: 1, mtFranquicia: '$274.750', inicioCurso: '19/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238041200', vencimientoSence: '2026-10-15' },
  { sc: '2106283', cliente: 'INMOBILIARIA E INVERSIONES MALPO SPA', nroPart: 1, mtFranquicia: '$301.000', inicioCurso: '11/05/2026', modalidad: 'E-learning', tipoContrato: 'Normal', codigoSence: '1238045800', vencimientoSence: '2026-04-17' },
  { sc: '2107893', cliente: 'CORPORACION EDUCACIONAL KINGSTON COLLEGE', nroPart: 2, mtFranquicia: '$20.000', inicioCurso: '20/04/2026', modalidad: 'Presencial', tipoContrato: 'Precontrato', codigoSence: '1238047300', vencimientoSence: '2026-12-01' },
];

const ComunicacionSence: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('2026-04-15');
  const [fechaFin, setFechaFin] = useState('2026-05-31');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [noComunicar, setNoComunicar] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('comunicacion');
  const [cursoDetalleSC, setCursoDetalleSC] = useState<string | null>(null);
  const [cursoDetalleIdModular, setCursoDetalleIdModular] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const MAX_TAGS = 10;

  const addSearchTag = (raw: string) => {
    const parts = raw.split(/[\s,;]+/).map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    setSearchTags(prev => {
      const next = [...prev];
      for (const p of parts) {
        if (next.length >= MAX_TAGS) break;
        if (!next.includes(p)) next.push(p);
      }
      return next;
    });
    setSearchTerm('');
  };

  const removeSearchTag = (tag: string) => {
    setSearchTags(prev => prev.filter(t => t !== tag));
  };

  const ejecutarBusqueda = () => {
    let tags = searchTags;
    if (searchTerm.trim()) {
      const parts = searchTerm.split(/[\s,;]+/).map(p => p.trim()).filter(Boolean);
      const merged = [...tags];
      for (const p of parts) {
        if (merged.length >= MAX_TAGS) break;
        if (!merged.includes(p)) merged.push(p);
      }
      tags = merged;
      setSearchTags(merged);
      setSearchTerm('');
    }
    setAppliedTags(tags);
  };

  const clearSearch = () => {
    setSearchTags([]);
    setAppliedTags([]);
    setSearchTerm('');
  };

  const cursosFiltrados = appliedTags.length > 0
    ? mockCursos.filter(c => appliedTags.some(t => c.sc.toLowerCase().includes(t.toLowerCase())))
    : mockCursos;



  const toggleNoComunicar = (sc: string) => {
    setNoComunicar(prev =>
      prev.includes(sc) ? prev.filter(s => s !== sc) : [...prev, sc]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedRows(checked ? mockCursos.map(c => c.sc) : []);
  };

  const handleSelectRow = (sc: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, sc]);
    } else {
      setSelectedRows(prev => prev.filter(s => s !== sc));
      setSelectAll(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const isProximoAVencer = (vencimiento: string) => {
    const hoy = new Date();
    const fechaVenc = new Date(vencimiento);
    const diffMs = fechaVenc.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDias >= 0 && diffDias <= 10;
  };

  if (cursoDetalleSC) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Detalle del Curso</h1>
        <CursoDetalleCompleto
          numeroSC={cursoDetalleSC}
          onBack={() => { setCursoDetalleSC(null); setCursoDetalleIdModular(undefined); }}
          idModular={cursoDetalleIdModular}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        Comunicación SENCE
      </h1>

      <h2 className="text-lg font-semibold text-foreground">
        ¿Necesitas generar un archivo o cargar respuesta de comunicación?
      </h2>

      {/* Section 1: Upload */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-muted-foreground">
          Carga una respuesta de comunicación SENCE
        </h3>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 gap-2 rounded-full px-6">
          <PlusCircle className="w-4 h-4" />
          Carga comunicación
        </Button>
      </div>

      {/* Section 2: Generate file */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-muted-foreground">
          O continua generando un archivo de comunicación SENCE
        </h3>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="pl-10 w-[180px] rounded-full border-border"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="pl-10 w-[180px] rounded-full border-border"
            />
          </div>
          <Button variant="secondary" className="gap-2 rounded-full px-6 bg-muted text-muted-foreground">
            Generar Archivo <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          Deberías indicar los cursos que tienen fechas de inicio a partir del {formatDateDisplay(fechaInicio)}
        </div>
      </div>

      {/* Results badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-sm font-medium">
          {searchTags.length > 0 ? `${cursosFiltrados.length} de ${mockCursos.length}` : mockCursos.length} cursos cargados
        </Badge>
      </div>

      {/* Search */}
      <div className="flex items-start gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[280px] max-w-xl">
          <div className="flex items-center flex-wrap gap-1 min-h-10 w-full rounded-full border border-border bg-background pl-10 pr-3 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            {searchTags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5">
                {tag}
                <button type="button" onClick={() => removeSearchTag(tag)} className="hover:text-primary/70">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={searchTags.length >= MAX_TAGS ? `Máximo ${MAX_TAGS} S.C` : (searchTags.length === 0 ? 'Buscar por S.C (Enter para agregar)...' : '')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && searchTerm.trim()) {
                  e.preventDefault();
                  addSearchTag(searchTerm);
                } else if (e.key === 'Backspace' && !searchTerm && searchTags.length > 0) {
                  removeSearchTag(searchTags[searchTags.length - 1]);
                }
              }}
              onBlur={() => searchTerm.trim() && addSearchTag(searchTerm)}
              disabled={searchTags.length >= MAX_TAGS}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
            />
          </div>
        </div>
        {(searchTags.length > 0 || searchTerm) && (
          <Button variant="outline" size="sm" className="rounded-full gap-1 h-10" onClick={clearSearch}>
            <X className="w-3 h-3" /> Limpiar
          </Button>
        )}
      </div>



      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="comunicacion">Cursos Normales</TabsTrigger>
          <TabsTrigger value="modulares">Cursos Modulares</TabsTrigger>
        </TabsList>

        <TabsContent value="comunicacion" className="mt-4">
          <div className="space-y-4">
            {noComunicar.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4" />
                Actualmente existen cursos restringidos para la comunicación
              </div>
            )}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs table-fixed">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="p-2 w-[40px] text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        />
                      </div>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[8%]">
                      S.C <span className="text-xs">▾</span>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[20%]">
                      Cliente <span className="text-xs">▾</span>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[7%]">
                      Nro. Part. <span className="text-xs">▾</span>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[11%]">
                      M.T. Franquicia <span className="text-xs">▾</span>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                      Inicio Curso <span className="text-xs">▾</span>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[11%]">
                      Modalidad <span className="text-xs">▾</span>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[11%]">
                      Tipo Contrato <span className="text-xs">▾</span>
                    </th>
                    <th className="p-2 text-left font-medium text-muted-foreground w-[18%]">
                      <span className="inline-flex items-center gap-1">
                        <span>Acciónes</span>
                        <span className="inline-flex items-center rounded-full bg-blue-600 px-1 py-0.5 text-[8px] font-bold leading-none text-white shadow-sm">C1CCOM5</span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cursosFiltrados.map((curso, idx) => {

                    const excluido = noComunicar.includes(curso.sc);
                    return (
                      <tr key={curso.sc} className={`border-b ${excluido ? 'bg-red-50/50 opacity-60' : idx % 2 === 0 ? 'hover:bg-muted/20' : 'bg-muted/10 hover:bg-muted/20'}`}>
                        <td className="p-2 text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={selectedRows.includes(curso.sc)}
                              onCheckedChange={(checked) => handleSelectRow(curso.sc, !!checked)}
                              disabled={excluido}
                            />
                          </div>
                        </td>
                        <td className="p-2 font-medium">{curso.sc}</td>
                        <td className="p-2 text-muted-foreground truncate">{curso.cliente}</td>
                        <td className="p-2 text-left">{curso.nroPart}</td>
                        <td className="p-2">{curso.mtFranquicia}</td>
                        <td className="p-2">{curso.inicioCurso}</td>
                        <td className="p-2">{curso.modalidad}</td>
                        <td className="p-2">{curso.tipoContrato}</td>
                        <td className="p-2 text-left">
                          <Button
                            variant={excluido ? 'destructive' : 'outline'}
                            size="sm"
                            className="gap-1 text-xs h-7 px-2"
                            onClick={() => toggleNoComunicar(curso.sc)}
                          >
                            {excluido ? (
                              <><EyeOff className="w-3 h-3" /> Liberar</>
                            ) : (
                              <><Ban className="w-3 h-3" /> Restringir</>
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="modulares" className="mt-4">
          <ModularesTab
            showAddCourse={false}
            searchTerm={searchTerm}
            onVerDetalle={(nroInscripcion, idModular) => {
              setCursoDetalleSC(nroInscripcion);
              setCursoDetalleIdModular(idModular);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComunicacionSence;
