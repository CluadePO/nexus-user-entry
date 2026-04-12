import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Pencil } from 'lucide-react';

// ── Precontratos Normales (matching screenshot) ──

interface PrecontratoNormal {
  diasPlazo: number;
  nroInscripcion: string;
  sencenet: string;
  curso: string;
  empresa: string;
  precontratosFaltantes: string;
  autorizMenores: string;
  vulnerabilidad: number;
  celula: string;
  criticidad: 'alta' | 'media' | 'baja';
}

const precontratosNormalesData: PrecontratoNormal[] = [
  { diasPlazo: -74, nroInscripcion: '2132479', sencenet: '6739401', curso: 'Producción de Pastelería y Repostería Básica', empresa: '84.009.400-6 – Astilleros y Servicios Navales S.A.', precontratosFaltantes: '20/20', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel8', criticidad: 'alta' },
  { diasPlazo: -76, nroInscripcion: '2132535', sencenet: '6739647', curso: 'Aplicación de Procedimientos Orientados a la Operación Planta Concentradora', empresa: '76.727.040-2 – Minera Centinela', precontratosFaltantes: '0/8', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel2', criticidad: 'alta' },
  { diasPlazo: -76, nroInscripcion: '2132546', sencenet: '6739652', curso: 'Aplicación de Procedimientos Orientados a la Operación Planta Concentradora', empresa: '76.727.040-2 – Minera Centinela', precontratosFaltantes: '11/22', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel2', criticidad: 'media' },
  { diasPlazo: -79, nroInscripcion: '2144256', sencenet: '6752620', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.829-3 – Gestiones y Servicios Los Álamos S.A.', precontratosFaltantes: '24/24', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta' },
  { diasPlazo: -79, nroInscripcion: '2144293', sencenet: '6752622', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', precontratosFaltantes: '25/25', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta' },
  { diasPlazo: -79, nroInscripcion: '2144300', sencenet: '6752626', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', precontratosFaltantes: '24/24', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta' },
  { diasPlazo: -79, nroInscripcion: '2144305', sencenet: '6752627', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', precontratosFaltantes: '27/27', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta' },
];

const getCriticidadColor = (val: string) => {
  const [a, b] = val.split('/').map(Number);
  if (a === b && a > 0) return 'text-green-700 bg-green-50 border-green-200';
  if (a === 0) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-orange-700 bg-orange-50 border-orange-200';
};

// ── Precontratos Modulares ──

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

const Precontratos: React.FC = () => {
  const [selectedModulares, setSelectedModulares] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('precontratos');
  const [subTab, setSubTab] = useState('pendientes');
  const [criticidadAlta, setCriticidadAlta] = useState(true);
  const [criticidadMedia, setCriticidadMedia] = useState(true);
  const [criticidadBaja, setCriticidadBaja] = useState(true);

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

  const filteredNormales = precontratosNormalesData.filter(p => {
    if (p.criticidad === 'alta' && !criticidadAlta) return false;
    if (p.criticidad === 'media' && !criticidadMedia) return false;
    if (p.criticidad === 'baja' && !criticidadBaja) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">C1PPPC11</span>
        </div>
        <p className="text-muted-foreground">Gestión de precontratos y precontratos modulares</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="precontratos">Precontratos</TabsTrigger>
          <TabsTrigger value="modulares">Precontratos Modulares</TabsTrigger>
        </TabsList>

        {/* ── Tab: Precontratos ── */}
        <TabsContent value="precontratos" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="border rounded-lg p-4 space-y-3 bg-background">
            <div className="grid grid-cols-3 gap-4">
              <Select>
                <SelectTrigger><SelectValue placeholder="Nº Inscripción" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="Sencenet" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <Select>
                <SelectTrigger><SelectValue placeholder="Empresa" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent>
              </Select>
              <Select>
                <SelectTrigger><SelectValue placeholder="OTEC" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent>
              </Select>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground">Criticidad</span>
                <label className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={criticidadAlta} onCheckedChange={(c) => setCriticidadAlta(!!c)} className="border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                  Alta
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={criticidadMedia} onCheckedChange={(c) => setCriticidadMedia(!!c)} className="border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" />
                  Media
                </label>
                <label className="flex items-center gap-1.5 text-xs">
                  <Checkbox checked={criticidadBaja} onCheckedChange={(c) => setCriticidadBaja(!!c)} className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />
                  Baja
                </label>
              </div>
            </div>
          </div>

          {/* Sub-tabs + Download */}
          <div className="flex items-center justify-between">
            <div className="flex border-b">
              <button
                onClick={() => setSubTab('pendientes')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${subTab === 'pendientes' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                PENDIENTES
              </button>
              <button
                onClick={() => setSubTab('cerrados')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${subTab === 'cerrados' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                CERRADOS
              </button>
            </div>
            <Button variant="default" size="sm" className="bg-teal-700 hover:bg-teal-800 text-white">
              <Download className="h-4 w-4 mr-1" />
              DESCARGAR
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Días de<br/>plazo</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[9%]">Nº<br/>Inscripción</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Sencenet</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[20%]">Curso</th>
                  <th className="p-2 text-left font-medium text-muted-foreground w-[20%]">Empresa</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[10%]">Precontratos<br/>faltantes</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[8%]">Autoriz.<br/>Menores</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[9%]">Vulnerabilidad</th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[4%]"></th>
                  <th className="p-2 text-center font-medium text-muted-foreground w-[6%]">Célula</th>
                </tr>
              </thead>
              <tbody>
                {filteredNormales.map((p, idx) => (
                  <tr key={p.nroInscripcion} className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20`}>
                    <td className="p-2 text-center">
                      <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[36px]">
                        {p.diasPlazo}
                      </span>
                    </td>
                    <td className="p-2 text-center">{p.nroInscripcion}</td>
                    <td className="p-2 text-center">{p.sencenet}</td>
                    <td className="p-2">{p.curso}</td>
                    <td className="p-2 text-muted-foreground">{p.empresa}</td>
                    <td className="p-2 text-center">
                      <span className={`inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium ${getCriticidadColor(p.precontratosFaltantes)}`}>
                        {p.precontratosFaltantes}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span className="inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium text-green-700 bg-green-50 border-green-200">
                        {p.autorizMenores}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span className="inline-block border rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/30 border-border">
                        {p.vulnerabilidad}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button className="text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </td>
                    <td className="p-2 text-center text-muted-foreground">{p.celula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── Tab: Precontratos Modulares ── */}
        <TabsContent value="modulares" className="space-y-4 mt-4">
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

export default Precontratos;
