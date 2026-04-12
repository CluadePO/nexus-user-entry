import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Calendar, PlusCircle, ArrowRight, AlertCircle, Ban, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface CursoModular {
  moduloRef: string;
  sc: string;
  cliente: string;
  nroPart: number;
  mtFranquicia: string;
  inicioCurso: string;
}

interface ModuloGroup {
  modulo: string;
  cursos: CursoModular[];
}

const precontratosModulares: ModuloGroup[] = [
  {
    modulo: 'MOD-001',
    cursos: [
      { moduloRef: 'MOD-001', sc: '2103919', cliente: 'CORPORACION NACIONAL DEL COBRE', nroPart: 27, mtFranquicia: '$22.680.000', inicioCurso: '26/12/2025' },
      { moduloRef: 'MOD-001', sc: '2103920', cliente: 'MINERA ESCONDIDA LTDA', nroPart: 15, mtFranquicia: '$18.500.000', inicioCurso: '27/12/2025' },
      { moduloRef: 'MOD-001', sc: '2103921', cliente: 'ANGLO AMERICAN SUR', nroPart: 22, mtFranquicia: '$20.100.000', inicioCurso: '28/12/2025' },
    ],
  },
  {
    modulo: 'MOD-002',
    cursos: [
      { moduloRef: 'MOD-002', sc: '2103922', cliente: 'BHP BILLITON CHILE', nroPart: 30, mtFranquicia: '$25.000.000', inicioCurso: '02/01/2026' },
      { moduloRef: 'MOD-002', sc: '2103923', cliente: 'ANTOFAGASTA MINERALS', nroPart: 18, mtFranquicia: '$16.800.000', inicioCurso: '03/01/2026' },
    ],
  },
  {
    modulo: 'MOD-003',
    cursos: [
      { moduloRef: 'MOD-003', sc: '2103924', cliente: 'COLLAHUASI SCM', nroPart: 25, mtFranquicia: '$21.500.000', inicioCurso: '10/01/2026' },
      { moduloRef: '—', sc: '2103925', cliente: 'TECK RESOURCES CHILE', nroPart: 12, mtFranquicia: '$14.000.000', inicioCurso: '15/01/2026' },
    ],
  },
];

const ComunicacionSence: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('2026-04-15');
  const [fechaFin, setFechaFin] = useState('2026-05-31');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [noComunicar, setNoComunicar] = useState<string[]>([]);
  const [selectedModulares, setSelectedModulares] = useState<string[]>([]);

  const toggleNoComunicar = (sc: string) => {
    setNoComunicar(prev =>
      prev.includes(sc) ? prev.filter(s => s !== sc) : [...prev, sc]
    );
  };

  const handleSelectModular = (sc: string, checked: boolean) => {
    setSelectedModulares(prev =>
      checked ? [...prev, sc] : prev.filter(s => s !== sc)
    );
  };

  const handleSelectModulo = (modulo: string, checked: boolean) => {
    const grupo = precontratosModulares.find(m => m.modulo === modulo);
    if (!grupo) return;
    const scs = grupo.cursos.map(c => c.sc);
    setSelectedModulares(prev =>
      checked ? [...new Set([...prev, ...scs])] : prev.filter(s => !scs.includes(s))
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        ¿Necesitas generar un archivo o cargar respuesta de comunicación?
      </h1>

      <Tabs defaultValue="comunicacion" className="w-full">
        <TabsList className="bg-muted/50 rounded-full p-1">
          <TabsTrigger value="comunicacion" className="rounded-full px-6 text-sm">Comunicación SENCE</TabsTrigger>
          <TabsTrigger value="precontratos" className="rounded-full px-6 text-sm">Precontratos Modulares</TabsTrigger>
        </TabsList>

        <TabsContent value="comunicacion" className="space-y-6 mt-4">

      {/* Section 1: Upload */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-muted-foreground">
          Carga una respuesta de comunicación SENCE
        </h2>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 gap-2 rounded-full px-6">
          <PlusCircle className="w-4 h-4" />
          Carga comunicación
        </Button>
      </div>

      {/* Section 2: Generate file */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-muted-foreground">
          O continua generando un archivo de comunicación SENCE
        </h2>

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
      <div>
        <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-sm font-medium">
          {mockCursos.length} cursos cargados
        </Badge>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-xs table-fixed">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="p-2 w-8">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
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
            {mockCursos.map((curso, idx) => {
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
        </TabsContent>

        <TabsContent value="precontratos" className="space-y-4 mt-4">
          <h2 className="text-base font-semibold text-muted-foreground">
            Precontratos Modulares
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs table-fixed">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-2 w-8"></th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[12%]">Módulo</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">S.C.</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[30%]">Cliente</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[10%]">Nro. Part.</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[15%]">M.T. Franquicia</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[15%]">Inicio Curso</th>
                </tr>
              </thead>
              <tbody>
                {precontratosModulares.map((modulo) => (
                  <React.Fragment key={modulo.modulo}>
                    <tr className="bg-muted/20 border-b">
                      <td className="p-2">
                        <Checkbox
                          checked={modulo.cursos.every(c => selectedModulares.includes(c.sc))}
                          onCheckedChange={(checked) => handleSelectModulo(modulo.modulo, !!checked)}
                        />
                      </td>
                      <td colSpan={6} className="p-2 font-semibold text-primary text-xs">
                        {modulo.modulo} - Seleccionar todos ({modulo.cursos.length} cursos)
                      </td>
                    </tr>
                    {modulo.cursos.map((curso, idx) => (
                      <tr key={curso.sc} className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20`}>
                        <td className="p-2">
                          <Checkbox
                            checked={selectedModulares.includes(curso.sc)}
                            onCheckedChange={(checked) => handleSelectModular(curso.sc, !!checked)}
                          />
                        </td>
                        <td className="p-2 text-muted-foreground">{curso.moduloRef}</td>
                        <td className="p-2 font-medium">{curso.sc}</td>
                        <td className="p-2 text-muted-foreground">{curso.cliente}</td>
                        <td className="p-2 text-center">{curso.nroPart}</td>
                        <td className="p-2">{curso.mtFranquicia}</td>
                        <td className="p-2">{curso.inicioCurso}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComunicacionSence;
