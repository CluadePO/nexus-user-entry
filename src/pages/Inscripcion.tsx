import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Search, X, ChevronUp, ChevronDown, Trash2, Copy, Upload, Download, Eye, LogOut, ArrowLeft, ArrowRight, Save, Plus, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';

// ─── Mock Data ───────────────────────────────────────────────────
const mockClients = [
  { id: '1', name: 'CORPORACION EDUCACIONAL KINGSTON COLLEGE', rut: '70374900-3', sucursales: ['Casa Matriz', 'Sucursal Norte', 'Sucursal Sur'] },
  { id: '2', name: 'EMPRESA DE SERVICIOS TECNOLOGICOS LTDA', rut: '76123456-7', sucursales: ['Casa Matriz', 'Sucursal Oriente'] },
  { id: '3', name: 'CONSTRUCTORA NACIONAL S.A.', rut: '78345678-9', sucursales: ['Casa Matriz'] },
];

const mockSenceData = {
  courseName: 'MANTENIMIENTO INDUSTRIAL DE MÁQUINAS Y SISTEMAS ELÉCTRICOS',
  otec: 'CORPORACION INSTITUTO PROFESIONAL INACAP',
  otecRut: '87152900-0',
  hours: 36,
  participants: 30,
  modality: 'Presencial',
  franchiseType: 'Normal',
  effectiveValue: 900000,
  maxImputableValue: 252000,
  validUntil: '13 de noviembre de 2027',
};

const regiones = ['REGION METROPOLITANA', 'VALPARAISO', 'BIOBIO', 'ARAUCANIA', 'LOS LAGOS'];
const comunas: Record<string, string[]> = {
  'REGION METROPOLITANA': ['ALHUE', 'BUIN', 'CALERA DE TANGO', 'CERRILLOS', 'CERRO NAVIA', 'COLINA', 'CONCHALI', 'SANTIAGO'],
  'VALPARAISO': ['VALPARAISO', 'VIÑA DEL MAR', 'QUILPUE'],
  'BIOBIO': ['CONCEPCION', 'TALCAHUANO', 'CHILLAN'],
  'ARAUCANIA': ['TEMUCO', 'VILLARRICA'],
  'LOS LAGOS': ['PUERTO MONTT', 'OSORNO'],
};

const dayLabelsShort = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const dayNamesFull = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const formatCLP = (v: number) => '$' + v.toLocaleString('es-CL');

// ─── Stepper Component ──────────────────────────────────────────
const Stepper = ({ current, steps }: { current: number; steps: string[] }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          {i > 0 && (
            <div className={`h-0.5 w-12 md:w-20 ${done ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
          )}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors
              ${done ? 'bg-primary border-primary text-primary-foreground' : active ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-muted-foreground/30 text-muted-foreground'}`}>
              {i + 1}
            </div>
            <span className={`text-xs mt-1 text-center max-w-[80px] ${active || done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Main Component ─────────────────────────────────────────────
const Inscripcion: React.FC = () => {
  const { user } = useAuth();

  // Pre-step: client selection
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [selectedSucursal, setSelectedSucursal] = useState('');
  const [preStepDone, setPreStepDone] = useState(false);

  // Step state
  const [currentStep, setCurrentStep] = useState(0);
  const stepLabels = ['Tipo de Curso', 'Datos de Curso', 'Horarios', 'Participantes', 'Cuenta de Cargo'];

  // Step 1
  const [lineaTrabajo, setLineaTrabajo] = useState<'franquicia' | 'no_franquicia' | null>(null);
  const [contractType, setContractType] = useState<string | null>(null);

  // Step 2
  const [senceCode, setSenceCode] = useState('');
  const [senceValidated, setSenceValidated] = useState(false);
  const [agreedValue, setAgreedValue] = useState('');
  const [courseInfoOpen, setCourseInfoOpen] = useState(true);

  // Step 3
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaTermino, setFechaTermino] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [direccion, setDireccion] = useState('');
  const [selectedDays, setSelectedDays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [horasIngresadas, setHorasIngresadas] = useState(35);
  const [observaciones, setObservaciones] = useState('');

  // Step 4
  const [participants, setParticipants] = useState<any[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [financialOpen, setFinancialOpen] = useState(true);

  // Step 5
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [serviceRelationType, setServiceRelationType] = useState('Solicitud de Compra');
  const [serviceRelationSearch, setServiceRelationSearch] = useState('');
  const [planYear, setPlanYear] = useState('');
  const [planName, setPlanName] = useState('');
  const [planCourse, setPlanCourse] = useState('');

  // Completion
  const [isComplete, setIsComplete] = useState(false);
  const [inscripcionId] = useState('2148684');

  // ─── Client search ──────────────────────────────────
  const filteredClients = clientSearch.length >= 2
    ? mockClients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.rut.includes(clientSearch))
    : [];

  const selectClient = (client: typeof mockClients[0]) => {
    setSelectedClient(client);
    setClientSearch('');
  };

  const handleContinuePreStep = () => {
    if (selectedClient && selectedSucursal) {
      setPreStepDone(true);
    } else {
      toast.error('Seleccione cliente y sucursal');
    }
  };

  // ─── Step navigation ───────────────────────────────
  const canProceed = () => {
    switch (currentStep) {
      case 0: return lineaTrabajo !== null && (lineaTrabajo === 'no_franquicia' || contractType !== null);
      case 1: return senceValidated && agreedValue !== '';
      case 2: return fechaInicio !== '' && fechaTermino !== '';
      case 3: return participants.length > 0;
      case 4: return selectedAccount !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      toast.success('Tu borrador de inscripción se ha guardado automáticamente.');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    setIsComplete(true);
    toast.success('Curso inscrito con éxito!');
  };

  const handleValidateSence = () => {
    if (senceCode.length >= 8) {
      setSenceValidated(true);
      toast.success('¡Validado exitosamente!');
    } else {
      toast.error('El código SENCE debe tener al menos 8 caracteres');
    }
  };

  const handleFileUpload = () => {
    setUploadedFile('Carga_Masiva_Participantes_Plantilla (19).xlsx');
    setParticipants([
      { id: 1, tipoDoc: 'RUT', rut: '15.429.504-6', numDoc: '', name: 'Maria Antonieta Perez Rodriguez', fechaNac: '14-12-1987', sexo: 'F' },
      { id: 2, tipoDoc: 'RUT', rut: '15.241.420-K', numDoc: '', name: 'Alejandra Rodriguez Rodriguez', fechaNac: '14-12-1987', sexo: 'F' },
    ]);
    toast.success('Archivo cargado exitosamente');
  };

  const toggleDay = (index: number) => {
    const newDays = [...selectedDays];
    newDays[index] = !newDays[index];
    setSelectedDays(newDays);
  };

  // ─── Right Sidebar ─────────────────────────────────
  const renderSidebar = () => (
    <div className="w-64 shrink-0 space-y-4">
      <div>
        <p className="text-xs text-muted-foreground">ID Inscripción</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{inscripcionId}</span>
          <button onClick={() => { navigator.clipboard.writeText(inscripcionId); toast.info('ID copiado'); }}>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      <button className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground">
        <Trash2 className="h-5 w-5" />
      </button>
      <Separator />
      <div>
        <p className="text-xs text-muted-foreground">Cliente</p>
        <p className="text-sm font-semibold leading-tight">{selectedClient?.name?.slice(0, 28)}...</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Línea</p>
        <p className="text-sm font-semibold">{lineaTrabajo === 'franquicia' ? 'Franquicia' : lineaTrabajo === 'no_franquicia' ? 'No Franquicia' : '-'}</p>
      </div>
      {senceValidated && (
        <div>
          <p className="text-xs text-muted-foreground">Nombre del curso</p>
          <p className="text-sm font-semibold leading-tight">{mockSenceData.courseName.slice(0, 28)}...</p>
        </div>
      )}
      {fechaInicio && (
        <div>
          <p className="text-xs text-muted-foreground">Fecha inicio del curso</p>
          <p className="text-sm font-semibold">{fechaInicio}</p>
        </div>
      )}
      {fechaTermino && (
        <div>
          <p className="text-xs text-muted-foreground">Fecha término del curso</p>
          <p className="text-sm font-semibold">{fechaTermino}</p>
        </div>
      )}
      {participants.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground">Participantes</p>
          <p className="text-sm font-semibold">{participants.length}</p>
        </div>
      )}
    </div>
  );

  // ─── Pre-step: Client Search ───────────────────────
  if (!preStepDone) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-light text-muted-foreground mb-8">Curso o Servicio</h1>
        <h2 className="text-lg font-semibold text-muted-foreground mb-4">Ingresemos al Cliente antes de comenzar</h2>
        <div className="relative mb-6">
          <Input
            placeholder="Escribe el RUT o Nombre del Cliente"
            value={clientSearch}
            onChange={e => setClientSearch(e.target.value)}
            className="h-12 text-base border-primary/40 placeholder:text-primary/60"
          />
          {filteredClients.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 bg-card border rounded-md shadow-lg mt-1">
              {filteredClients.map(c => (
                <button key={c.id} onClick={() => selectClient(c)} className="w-full text-left px-4 py-3 hover:bg-muted transition-colors">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.rut}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedClient && (
          <>
            <div className="flex border rounded-lg overflow-hidden mb-6">
              <div className="flex-1 p-4 border-r">
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="font-semibold text-sm">{selectedClient.name}</p>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">Rut Cliente</p>
                <p className="font-semibold text-sm">{selectedClient.rut}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Sucursal:</p>
              <Select value={selectedSucursal} onValueChange={setSelectedSucursal}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {selectedClient.sucursales.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between">
              <Button variant="outline" className="gap-2 border-primary text-primary">
                <LogOut className="h-4 w-4" /> Salir
              </Button>
              <Button onClick={handleContinuePreStep} className="gap-2 bg-primary hover:bg-primary/90">
                Continuar <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Completion Screen ─────────────────────────────
  if (isComplete) {
    return (
      <div className="p-6">
        <div className="flex gap-8 max-w-5xl mx-auto">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-primary mb-4">Inscripción de curso realizada</h1>
            <p className="text-muted-foreground mb-8">
              Has completado la inscripción del curso. Te invitamos a revisar tu solicitud de compra generada.
            </p>

            <h2 className="text-lg font-semibold text-muted-foreground mb-4">Descargar solicitud de compra</h2>
            <div className="flex items-center justify-between border rounded-lg p-4 mb-8">
              <div>
                <span className="text-sm text-muted-foreground">Franquicia {contractType || 'Normal'}</span>
                <span className="text-sm text-muted-foreground ml-8">Nro. 2107893</span>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                Descargar <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="gap-2 border-primary text-primary" onClick={() => {
                setIsComplete(false);
                setPreStepDone(false);
                setCurrentStep(0);
                setSelectedClient(null);
                setSelectedSucursal('');
                setLineaTrabajo(null);
                setContractType(null);
                setSenceCode('');
                setSenceValidated(false);
                setAgreedValue('');
                setParticipants([]);
                setSelectedAccount(null);
              }}>
                <LogOut className="h-4 w-4" /> Salir
              </Button>
            </div>
          </div>
          {renderSidebar()}
        </div>
      </div>
    );
  }

  // ─── Step Renderers ────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">¿En qué línea de trabajo quieres inscribir el curso?</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setLineaTrabajo('franquicia')}
          className={`py-3 px-6 rounded-full text-sm font-medium transition-colors ${
            lineaTrabajo === 'franquicia'
              ? 'bg-amber-200 text-amber-900 border-2 border-amber-400'
              : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'
          }`}
        >
          Franquicia (Cuenta 1)
        </button>
        <button
          onClick={() => setLineaTrabajo('no_franquicia')}
          className={`py-3 px-6 rounded-full text-sm font-medium transition-colors ${
            lineaTrabajo === 'no_franquicia'
              ? 'bg-primary text-primary-foreground border-2 border-primary'
              : 'bg-primary/80 text-primary-foreground border border-primary hover:bg-primary'
          }`}
        >
          No Franquicia (Cuenta 2)
        </button>
      </div>

      {lineaTrabajo === 'franquicia' && (
        <>
          <p className="text-muted-foreground">Selecciona un tipo de contrato para el curso</p>
          <div className="grid grid-cols-3 gap-4">
            {['Precontrato', 'Normal', 'Postcontrato'].map(type => (
              <button
                key={type}
                onClick={() => setContractType(type)}
                className={`py-3 px-4 rounded-full text-sm font-medium transition-colors ${
                  contractType === type
                    ? 'bg-primary text-primary-foreground border-2 border-primary'
                    : 'bg-muted text-muted-foreground border border-muted-foreground/30 hover:bg-muted-foreground/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-muted-foreground">Validemos el código Sence</h2>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            value={senceCode}
            onChange={e => { setSenceCode(e.target.value); setSenceValidated(false); }}
            placeholder="Ingrese código SENCE"
            className="h-12 pr-10"
          />
          {senceCode && (
            <button onClick={() => { setSenceCode(''); setSenceValidated(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        {!senceValidated ? (
          <Button onClick={handleValidateSence} disabled={senceCode.length < 8} className="bg-primary hover:bg-primary/90">Validar</Button>
        ) : (
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <CheckCircle className="h-5 w-5" />
            <span>¡Validado exitosamente!</span>
          </div>
        )}
      </div>
      {senceValidated && (
        <p className="text-xs text-muted-foreground">Válido hasta el {mockSenceData.validUntil}</p>
      )}

      {senceValidated && (
        <>
          <Collapsible open={courseInfoOpen} onOpenChange={setCourseInfoOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b">
              <span className="font-semibold">Información del Curso</span>
              {courseInfoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border rounded-lg mt-3 divide-y">
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">Nombre del Curso</p>
                  <p className="font-bold text-sm">{mockSenceData.courseName}</p>
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">OTEC</p>
                    <p className="font-bold text-sm">{mockSenceData.otec}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Rut OTEC</p>
                    <p className="font-bold text-sm">{mockSenceData.otecRut}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Horas</p>
                    <p className="font-bold text-sm">{mockSenceData.hours} Horas</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Participantes</p>
                    <p className="font-bold text-sm">{mockSenceData.participants}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Modalidad</p>
                    <p className="font-bold text-sm">{mockSenceData.modality}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Tipo de Franquicia</p>
                    <p className="font-bold text-sm">{mockSenceData.franchiseType}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Valor efectivo participante</p>
                    <p className="font-bold text-sm">{formatCLP(mockSenceData.effectiveValue)}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">Valor máx. imputable</p>
                    <p className="font-bold text-sm">{formatCLP(mockSenceData.maxImputableValue)}</p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-3">¿Cual es el valor acordado por participante?</h3>
            <div className="flex items-center gap-2 border rounded-lg px-4 py-3 max-w-xs">
              <span className="text-primary text-lg">$</span>
              <Input
                value={agreedValue}
                onChange={e => setAgreedValue(e.target.value)}
                placeholder="10.000"
                className="border-0 p-0 h-auto focus-visible:ring-0"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-muted-foreground">Ingresemos los horarios</h2>

      {contractType === 'Precontrato' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <span className="w-3 h-3 bg-amber-500 rounded-full mt-1 shrink-0" />
          <p className="text-sm text-amber-800">
            Importante: Para este tipo de contrato (precontrato), el curso puede durar máximo <span className="underline font-semibold">60 días</span> según lo estipulado por Sence.
          </p>
        </div>
      )}

      {contractType === 'Normal' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <span className="w-3 h-3 bg-blue-500 rounded-full mt-1 shrink-0" />
          <p className="text-sm text-blue-800">
            Contrato Normal: El curso debe ejecutarse dentro del período de vigencia del contrato. Las fechas deben estar dentro del año calendario correspondiente.
          </p>
        </div>
      )}

      {contractType === 'Postcontrato' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <span className="w-3 h-3 bg-orange-500 rounded-full mt-1 shrink-0" />
          <p className="text-sm text-orange-800">
            Importante: Para este tipo de contrato (postcontrato), el curso debe iniciar dentro de los <span className="underline font-semibold">60 días posteriores</span> al término de la relación laboral según lo estipulado por Sence.
          </p>
        </div>
      )}

      <p className="text-muted-foreground text-sm">Comencemos por ingresar la fecha de inicio y término del curso</p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
          <span className="text-muted-foreground">📅</span>
          <Input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border-0 p-0 h-auto focus-visible:ring-0" />
        </div>
        <div className="flex items-center gap-2 border rounded-lg px-4 py-2">
          <span className="text-muted-foreground">📅</span>
          <Input type="date" value={fechaTermino} onChange={e => setFechaTermino(e.target.value)} className="border-0 p-0 h-auto focus-visible:ring-0" />
        </div>
      </div>

      <p className="text-muted-foreground text-sm">Región y comuna dónde se impartirá el curso</p>
      <div className="flex gap-4">
        <Select value={region} onValueChange={v => { setRegion(v); setComuna(''); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Región..." /></SelectTrigger>
          <SelectContent>
            {regiones.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={comuna} onValueChange={setComuna}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Comuna..." /></SelectTrigger>
          <SelectContent>
            {(comunas[region] || []).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border rounded-lg px-4 py-2 max-w-lg">
        <span className="text-muted-foreground">📍</span>
        <Input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Dirección" className="border-0 p-0 h-auto focus-visible:ring-0" />
      </div>

      <p className="text-muted-foreground text-sm">Ahora organicemos los dias del curso</p>
      <div className="grid grid-cols-3 gap-4 max-w-sm">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Horas del curso</p>
          <p className="text-2xl font-bold">{mockSenceData.hours} hrs.</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Ingresadas</p>
          <p className="text-2xl font-bold text-primary">{horasIngresadas} hrs.</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Pendientes</p>
          <p className="text-2xl font-bold text-destructive">{Math.max(0, mockSenceData.hours - horasIngresadas)} hrs.</p>
        </div>
      </div>

      {fechaInicio && (
        <p className="text-primary text-sm font-medium">
          Comienza el lunes {new Date(fechaInicio).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

      <div className="border-2 border-primary/30 rounded-2xl p-6 flex items-center gap-4">
        <span className="text-primary font-bold text-lg">Jornada 1</span>
        <div className="flex gap-2">
          {dayLabelsShort.map((d, i) => (
            <button
              key={i}
              onClick={() => toggleDay(i)}
              className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
                selectedDays[i]
                  ? i >= 5 ? 'bg-amber-200 text-amber-900' : 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button className="w-10 h-10 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center hover:bg-amber-300">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div>
        <p className="text-muted-foreground text-sm mb-2">Si tienes información adicional puedes ingresarla a continuación</p>
        <Textarea
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
          placeholder="Observaciones..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <Collapsible open={financialOpen} onOpenChange={setFinancialOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b">
          <span className="font-semibold">Resumen Financiero</span>
          {financialOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-3 gap-4 mt-3 border rounded-lg p-4">
            <div><p className="text-xs text-muted-foreground">Valor Franquicia</p><p className="font-bold text-primary">{formatCLP(20000)}</p></div>
            <div><p className="text-xs text-muted-foreground">Costo Empresa</p><p className="font-bold text-primary">$0</p></div>
            <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold">{formatCLP(20000)}</p></div>
            <div><p className="text-xs text-muted-foreground">Costo Viático</p><p className="font-bold text-primary">$0</p></div>
            <div><p className="text-xs text-muted-foreground">Costo Traslado</p><p className="font-bold text-primary">$0</p></div>
            <div><p className="text-xs text-muted-foreground">Participantes</p><p className="font-bold">{participants.length || 2}</p></div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <h2 className="text-lg font-semibold text-muted-foreground">Ingresemos a los participantes</h2>
      <p className="text-sm text-muted-foreground">Para ingresar a los participantes descarga la siguiente plantilla</p>
      <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-full">
        Descargar Aquí <Download className="h-4 w-4" />
      </Button>

      <p className="text-sm text-muted-foreground">Puedes ingresarlos en grupo desde un archivo</p>
      <div
        onClick={handleFileUpload}
        className="border-2 border-dashed border-primary/40 rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      >
        {uploadedFile ? (
          <>
            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground animate-spin" />
            <Badge className="bg-primary text-primary-foreground mb-2">📄 Archivo cargado:{uploadedFile}</Badge>
            <p className="text-xs text-muted-foreground">Haz clic aquí para reemplazar tu archivo o arrastra y suéltalo</p>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Haz clic aquí para subir tu archivo o arrastra y suéltalo</p>
          </>
        )}
      </div>

      {participants.length > 0 && (
        <Button variant="outline" className="gap-2 border-primary text-primary" onClick={() => setShowParticipantsModal(true)}>
          <Eye className="h-4 w-4" /> Ver Listado de Participantes
        </Button>
      )}

      {/* Participants Modal */}
      <Dialog open={showParticipantsModal} onOpenChange={setShowParticipantsModal}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              <Badge className="bg-primary text-primary-foreground">Participantes con error 0 de {participants.length}</Badge>
            </DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Tipo de Documento</TableHead>
                <TableHead>Rut</TableHead>
                <TableHead>Número de Documento</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha de Nacimiento</TableHead>
                <TableHead>Sexo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{p.tipoDoc}</TableCell>
                  <TableCell>{p.rut}</TableCell>
                  <TableCell>{p.numDoc || '-'}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.fechaNac}</TableCell>
                  <TableCell>{p.sexo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex gap-4 mt-4">
            <Button variant="outline" className="border-primary text-primary">Guardar</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowParticipantsModal(false)}>Salir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-muted-foreground">Seleccione cuenta de Financiamiento</h2>

      <Collapsible open={financialOpen} onOpenChange={setFinancialOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-b">
          <span className="font-semibold">Resumen</span>
          {financialOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-3 gap-4 mt-3 border rounded-lg p-4">
            <div><p className="text-xs text-muted-foreground">Valor Franquicia</p><p className="font-bold text-primary">{formatCLP(20000)}</p></div>
            <div><p className="text-xs text-muted-foreground">Costo Empresa</p><p className="font-bold text-primary">$0</p></div>
            <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold">{formatCLP(20000)}</p></div>
            <div><p className="text-xs text-muted-foreground">Costo Viático</p><p className="font-bold text-primary">$0</p></div>
            <div><p className="text-xs text-muted-foreground">Costo Traslado</p><p className="font-bold text-primary">$0</p></div>
            <div><p className="text-xs text-muted-foreground">Participantes</p><p className="font-bold">{participants.length}</p></div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Cuenta Capacitacion</p>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedAccount('anual')}
            className={`flex-1 py-4 rounded-full text-center text-sm font-medium transition-colors ${
              selectedAccount === 'anual'
                ? 'bg-amber-300 text-amber-900 border-2 border-amber-500'
                : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'
            }`}
          >
            <p className="font-semibold">Capacitación al año</p>
            <p className="text-xs mt-1">{formatCLP(916000)}</p>
          </button>
          <button
            onClick={() => setSelectedAccount('excedente')}
            className={`flex-1 py-4 rounded-full text-center text-sm font-medium transition-colors ${
              selectedAccount === 'excedente'
                ? 'bg-primary text-primary-foreground border-2 border-primary'
                : 'bg-primary/80 text-primary-foreground border border-primary hover:bg-primary'
            }`}
          >
            <p className="font-semibold">Excedente capacitación</p>
            <p className="text-xs mt-1">{formatCLP(10800000)}</p>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-3">Relación del Servicio</h3>
        <div className="flex gap-2">
          <Select value={serviceRelationType} onValueChange={setServiceRelationType}>
            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Solicitud de Compra">Solicitud de Compra</SelectItem>
              <SelectItem value="Orden de Compra">Orden de Compra</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder={`Buscar por ${serviceRelationType}`} value={serviceRelationSearch} onChange={e => setServiceRelationSearch(e.target.value)} className="flex-1" />
          <Button size="icon" className="bg-primary hover:bg-primary/90"><Search className="h-4 w-4" /></Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">Relación de Plan de Capacitación</h3>
        <p className="text-xs text-primary mb-3">Las fechas asociadas al curso del plan seleccionado pueden diferir de las fechas del curso inscrito</p>
        <div className="flex gap-2 mb-2">
          <Select value={planYear} onValueChange={setPlanYear}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Seleccion..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planName} onValueChange={setPlanName}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Nombre d..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="plan1">Plan Anual 2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planCourse} onValueChange={setPlanCourse}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Id Curso - Nombre del curso - Fecha Inicio - Fecha Térmi..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="c1">001 - Mantenimiento Industrial - 20/04/2026 - 24/04/2026</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">Limpiar</Button>
        </div>
        <p className="text-destructive text-sm">No existen planes de capacitación disponibles para este cliente.</p>
      </div>
    </div>
  );

  // ─── Main Layout ───────────────────────────────────
  return (
    <div className="p-6">
      <div className="flex gap-8 max-w-5xl mx-auto">
        <div className="flex-1">
          <h1 className="text-3xl font-light text-muted-foreground mb-6">
            {lineaTrabajo === 'franquicia' || lineaTrabajo === 'no_franquicia' ? 'Curso' : 'Curso o Servicio'}
          </h1>

          <Stepper current={currentStep} steps={stepLabels} />

          <Card className="p-6">
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
            {currentStep === 3 && renderStep4()}
            {currentStep === 4 && renderStep5()}

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="gap-2 bg-primary/80 text-primary-foreground hover:bg-primary/70 rounded-full"
                disabled={currentStep === 0}
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" /> Volver
              </Button>

              {currentStep < 4 ? (
                <Button
                  className="gap-2 bg-primary hover:bg-primary/90 rounded-full"
                  disabled={!canProceed()}
                  onClick={handleNext}
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="gap-2 bg-primary hover:bg-primary/90 rounded-full"
                  disabled={!canProceed()}
                  onClick={handleSubmit}
                >
                  Inscribir <ArrowRight className="h-4 w-4" />
                </Button>
              )}

              <Button variant="outline" className="gap-2 border-primary text-primary rounded-full">
                <LogOut className="h-4 w-4" /> Salir
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-full">
                <Save className="h-4 w-4" /> Guardar
              </Button>
            </div>
          </Card>
        </div>

        {renderSidebar()}
      </div>
    </div>
  );
};

export default Inscripcion;
