import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Pencil, ArrowLeft, Mail, FileDown, ChevronUp, ChevronDown, Users, FileText, Building2, GraduationCap, Search } from 'lucide-react';

// ── Precontratos Normales ──

interface Participante {
  nombre: string;
  rut: string;
  correo: string;
  telefono: string;
  firmaEmpresa: 'FALTANTE' | 'FIRMADO';
  firmaParticipante: 'FALTANTE' | 'FIRMADO';
  autorizMenor: 'NO APLICA' | 'FALTANTE' | 'FIRMADO';
  vulnerabilidad: 'FALTANTE' | 'SIN VULNERABILIDAD' | 'VULNERABLE';
  ultimoRecordatorio: string;
}

interface PrecontratoNormal {
  diasPlazo: number;
  nroInscripcion: string;
  sencenet: string;
  curso: string;
  empresa: string;
  empresaRut: string;
  empresaNombre: string;
  otecNombre: string;
  otecRut: string;
  codigoSence: string;
  tipoContrato: string;
  inicioTermino: string;
  preinscripcion: string;
  precontratosFaltantes: string;
  autorizMenores: string;
  vulnerabilidad: number;
  celula: string;
  criticidad: 'alta' | 'media' | 'baja';
  repLegalNombre: string;
  repLegalCi: string;
  participantes: Participante[];
}

const mockParticipantes: Participante[] = [
  { nombre: 'Yoselin Ceron Jaramillo', rut: '19.249.775-2', correo: 'YMALDONADO@INACAP.CL', telefono: '987159317', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Ermelinda Mellado Jaramillo', rut: '13.520.404-8', correo: 'YMALDONADO@INACAP.CL', telefono: '949247596', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'María Núñez Almonacid', rut: '11.325.257-K', correo: 'YMALDONADO@INACAP.CL', telefono: '999403690', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Patricia Rivas Burgos', rut: '11.129.550-6', correo: 'YMALDONADO@INACAP.CL', telefono: '967239584', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
  { nombre: 'Juana Loiza Saez', rut: '10.987.653-4', correo: 'YMALDONADO@INACAP.CL', telefono: '993999593', firmaEmpresa: 'FALTANTE', firmaParticipante: 'FALTANTE', autorizMenor: 'NO APLICA', vulnerabilidad: 'FALTANTE', ultimoRecordatorio: 'Sin recordatorios enviados' },
];

const precontratosNormalesData: PrecontratoNormal[] = [
  { diasPlazo: -74, nroInscripcion: '2132479', sencenet: '6739401', curso: 'Producción de Pastelería y Repostería Básica', empresa: '84.009.400-6 – Astilleros y Servicios Navales S.A.', empresaRut: '84.009.400-6', empresaNombre: 'Astilleros y Servicios Navales S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073224', tipoContrato: 'precontrato', inicioTermino: '29/11/2025 - 31/12/2025', preinscripcion: '134960892', precontratosFaltantes: '20/20', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel8', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -76, nroInscripcion: '2132535', sencenet: '6739647', curso: 'Aplicación de Procedimientos Orientados a la Operación Planta Concentradora', empresa: '76.727.040-2 – Minera Centinela', empresaRut: '76.727.040-2', empresaNombre: 'Minera Centinela', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073225', tipoContrato: 'precontrato', inicioTermino: '01/12/2025 - 15/01/2026', preinscripcion: '134960893', precontratosFaltantes: '0/8', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel2', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 3) },
  { diasPlazo: -76, nroInscripcion: '2132546', sencenet: '6739652', curso: 'Aplicación de Procedimientos Orientados a la Operación Planta Concentradora', empresa: '76.727.040-2 – Minera Centinela', empresaRut: '76.727.040-2', empresaNombre: 'Minera Centinela', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073226', tipoContrato: 'precontrato', inicioTermino: '01/12/2025 - 15/01/2026', preinscripcion: '134960894', precontratosFaltantes: '11/22', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel2', criticidad: 'media', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes.slice(0, 4) },
  { diasPlazo: -79, nroInscripcion: '2144256', sencenet: '6752620', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.829-3 – Gestiones y Servicios Los Álamos S.A.', empresaRut: '78.163.829-3', empresaNombre: 'Gestiones y Servicios Los Álamos S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073227', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960895', precontratosFaltantes: '24/24', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -79, nroInscripcion: '2144293', sencenet: '6752622', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', empresaRut: '78.163.838-2', empresaNombre: 'Outsourcing Global de Servicios S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073228', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960896', precontratosFaltantes: '25/25', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -79, nroInscripcion: '2144300', sencenet: '6752626', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', empresaRut: '78.163.838-2', empresaNombre: 'Outsourcing Global de Servicios S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073229', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960897', precontratosFaltantes: '24/24', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
  { diasPlazo: -79, nroInscripcion: '2144305', sencenet: '6752627', curso: 'Técnicas de Comunicación Efectiva', empresa: '78.163.838-2 – Outsourcing Global de Servicios S.A.', empresaRut: '78.163.838-2', empresaNombre: 'Outsourcing Global de Servicios S.A.', otecNombre: 'Corporacion Instituto Profesional Inacap', otecRut: '87.152.900-0', codigoSence: '1238073230', tipoContrato: 'precontrato', inicioTermino: '05/12/2025 - 20/01/2026', preinscripcion: '134960898', precontratosFaltantes: '27/27', autorizMenores: '0/0', vulnerabilidad: 0, celula: 'Cel4', criticidad: 'alta', repLegalNombre: '-', repLegalCi: 'No disponible', participantes: mockParticipantes },
];

const getCriticidadColor = (val: string) => {
  const [a, b] = val.split('/').map(Number);
  if (a === b && a > 0) return 'text-green-700 bg-green-50 border-green-200';
  if (a === 0) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  return 'text-orange-700 bg-orange-50 border-orange-200';
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'FALTANTE':
      return <span className="inline-block bg-red-500 text-white text-[10px] font-semibold rounded px-2 py-0.5">FALTANTE</span>;
    case 'FIRMADO':
      return <span className="inline-block bg-green-600 text-white text-[10px] font-semibold rounded px-2 py-0.5">FIRMADO</span>;
    case 'NO APLICA':
      return <span className="inline-block bg-muted text-muted-foreground text-[10px] font-semibold rounded px-2 py-0.5">NO APLICA</span>;
    case 'SIN VULNERABILIDAD':
      return <span className="inline-block bg-green-600 text-white text-[10px] font-semibold rounded px-2 py-0.5">SIN VULNERABILIDAD</span>;
    case 'VULNERABLE':
      return <span className="inline-block bg-orange-500 text-white text-[10px] font-semibold rounded px-2 py-0.5">VULNERABLE</span>;
    default:
      return <span className="text-[10px] text-muted-foreground">{status}</span>;
  }
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

// ── Detail View Component ──

const PrecontratoDetailView: React.FC<{ precontrato: PrecontratoNormal; onBack: () => void }> = ({ precontrato, onBack }) => {
  const [detalleOpen, setDetalleOpen] = useState(true);
  const [searchParticipante, setSearchParticipante] = useState('');

  const filteredParticipantes = precontrato.participantes.filter(p =>
    p.nombre.toLowerCase().includes(searchParticipante.toLowerCase()) ||
    p.rut.includes(searchParticipante)
  );

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </button>

      {/* Detalle del curso - Collapsible */}
      <div className="border rounded-lg bg-background">
        <button
          onClick={() => setDetalleOpen(!detalleOpen)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <h2 className="text-base font-semibold text-foreground">Detalle del curso</h2>
          {detalleOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {detalleOpen && (
          <div className="px-4 pb-4 space-y-4">
            {/* Curso info */}
            <div className="flex items-start gap-4 border-b pb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-5 gap-4 text-xs">
                <div>
                  <p className="text-primary font-medium">Curso</p>
                  <p className="text-foreground">{precontrato.curso}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">Sencenet</p>
                  <p className="text-foreground">{precontrato.sencenet}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">Código Sence</p>
                  <p className="text-foreground">{precontrato.codigoSence}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">Tipo de contrato</p>
                  <p className="text-foreground font-semibold">{precontrato.tipoContrato}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">Inicio y término</p>
                  <p className="text-foreground">{precontrato.inicioTermino}</p>
                </div>
              </div>
            </div>

            {/* Días de plazo, Preinscripción, Célula */}
            <div className="flex items-start gap-4 border-b pb-4 pl-14">
              <div className="grid grid-cols-3 gap-8 text-xs">
                <div>
                  <p className="text-primary font-medium">Días de plazo</p>
                  <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full px-2.5 py-0.5 mt-1">
                    {precontrato.diasPlazo}
                  </span>
                </div>
                <div>
                  <p className="text-primary font-medium">Preinscripción</p>
                  <p className="text-foreground">{precontrato.preinscripcion}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">Célula</p>
                  <p className="text-foreground">{precontrato.celula}</p>
                </div>
              </div>
            </div>

            {/* Empresa info */}
            <div className="flex items-start gap-4 border-b pb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-primary font-medium">Empresa</p>
                  <p className="text-foreground">{precontrato.empresaNombre}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">RUT</p>
                  <p className="text-foreground">{precontrato.empresaRut}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">Nombre Rep. Legal</p>
                  <p className="text-foreground">{precontrato.repLegalNombre}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">C.I. Rep. Legal</p>
                  <p className="text-foreground">{precontrato.repLegalCi}</p>
                </div>
              </div>
            </div>

            {/* OTEC info */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-primary font-medium">Otec</p>
                  <p className="text-foreground">{precontrato.otecNombre}</p>
                </div>
                <div>
                  <p className="text-primary font-medium">RUT</p>
                  <p className="text-foreground">{precontrato.otecRut}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Precontrato - Participantes */}
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">Precontrato</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{precontrato.participantes.length} participantes activos</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-xs">
              <Mail className="h-3.5 w-3.5 mr-1" />
              RECORDATORIO MASIVO
            </Button>
            <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-white text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              DESCARGAR
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o rut del participante"
                value={searchParticipante}
                onChange={(e) => setSearchParticipante(e.target.value)}
                className="pl-8 h-8 text-xs w-[280px]"
              />
            </div>
          </div>
        </div>

        {/* Participantes table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-2.5 text-left font-medium text-primary w-[14%]">Nombre participante</th>
                <th className="p-2.5 text-left font-medium text-primary w-[8%]">Rut</th>
                <th className="p-2.5 text-left font-medium text-primary w-[14%]">Correo electrónico</th>
                <th className="p-2.5 text-left font-medium text-primary w-[8%]">Teléfono</th>
                <th className="p-2.5 text-center font-medium text-primary w-[8%]">Firma<br/>empresa</th>
                <th className="p-2.5 text-center font-medium text-primary w-[8%]">Firma<br/>participante</th>
                <th className="p-2.5 text-center font-medium text-primary w-[14%]">Autorización para menor de<br/>edad</th>
                <th className="p-2.5 text-center font-medium text-primary w-[10%]">Vulnerabilidad</th>
                <th className="p-2.5 text-left font-medium text-primary w-[12%]">Último recordatorio</th>
                <th className="p-2.5 text-center font-medium text-primary w-[4%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipantes.map((p, idx) => (
                <tr key={p.rut} className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20`}>
                  <td className="p-2.5 text-primary font-medium">{p.nombre}</td>
                  <td className="p-2.5">{p.rut}</td>
                  <td className="p-2.5 text-muted-foreground">{p.correo}</td>
                  <td className="p-2.5">{p.telefono}</td>
                  <td className="p-2.5 text-center">{getStatusBadge(p.firmaEmpresa)}</td>
                  <td className="p-2.5 text-center">{getStatusBadge(p.firmaParticipante)}</td>
                  <td className="p-2.5 text-center">{getStatusBadge(p.autorizMenor)}</td>
                  <td className="p-2.5 text-center">{getStatusBadge(p.vulnerabilidad)}</td>
                  <td className="p-2.5 text-muted-foreground">{p.ultimoRecordatorio}</td>
                  <td className="p-2.5 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button className="text-muted-foreground hover:text-foreground"><Mail className="h-3.5 w-3.5" /></button>
                      <button className="text-muted-foreground hover:text-foreground"><FileDown className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ──

const Precontratos: React.FC = () => {
  const [selectedModulares, setSelectedModulares] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('precontratos');
  const [subTab, setSubTab] = useState('pendientes');
  const [criticidadAlta, setCriticidadAlta] = useState(true);
  const [criticidadMedia, setCriticidadMedia] = useState(true);
  const [criticidadBaja, setCriticidadBaja] = useState(true);
  const [selectedPrecontrato, setSelectedPrecontrato] = useState<PrecontratoNormal | null>(null);

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

  // If a precontrato is selected, show detail view
  if (selectedPrecontrato) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
            <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">C1PPPC11</span>
          </div>
        </div>
        <PrecontratoDetailView
          precontrato={selectedPrecontrato}
          onBack={() => setSelectedPrecontrato(null)}
        />
      </div>
    );
  }

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
                  <tr
                    key={p.nroInscripcion}
                    className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20 cursor-pointer`}
                    onClick={() => setSelectedPrecontrato(p)}
                  >
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
                      <button className="text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
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
