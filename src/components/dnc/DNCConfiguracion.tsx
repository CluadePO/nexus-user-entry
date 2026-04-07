import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Settings, Users, FileText, CheckCircle2, Save, AlertTriangle, Info, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';
import DNCParticipantUpload, { type Participante } from './DNCParticipantUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { type Modalidad, type DNCProceso, saveDraft, generateId } from './dncStorage';

interface DNCConfiguracionProps {
  onBack: () => void;
  existingDraft?: DNCProceso | null;
}

const modalidades: { value: Modalidad; label: string; description: string }[] = [
  { value: 'colaboradores', label: 'Consulta a Colaboradores', description: 'Encuestas dirigidas directamente a los colaboradores de la organización.' },
  { value: 'jefaturas', label: 'Consulta a Jefaturas', description: 'Encuestas dirigidas a los líderes y jefes de área.' },
  { value: 'mixta', label: 'Consulta Mixta', description: 'Encuestas tanto a colaboradores como a jefaturas para un diagnóstico integral.' },
];

const DNCConfiguracion: React.FC<DNCConfiguracionProps> = ({ onBack, existingDraft }) => {
  const [draftId] = useState(() => existingDraft?.id || generateId());
  const [nombre, setNombre] = useState(existingDraft?.nombre || '');
  const [rubro, setRubro] = useState(existingDraft?.rubro || '');
  const [fechaInicio, setFechaInicio] = useState(existingDraft?.fechaInicio || '');
  const [fechaFin, setFechaFin] = useState(existingDraft?.fechaFin || '');
  const [modalidad, setModalidad] = useState<Modalidad | null>(existingDraft?.modalidad || null);
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [step1Complete, setStep1Complete] = useState(
    !!(existingDraft?.nombre && existingDraft?.rubro && existingDraft?.fechaInicio && existingDraft?.fechaFin && existingDraft?.modalidad)
  );
  const [step3Complete, setStep3Complete] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(['mes_capacitacion', 'modalidad_capacitacion']);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [tipoDiagnostico, setTipoDiagnostico] = useState<string | null>(null);
  const [incluirAutodiagnostico, setIncluirAutodiagnostico] = useState<boolean | null>(null);
  const [diagnosticoConfigured, setDiagnosticoConfigured] = useState(false);

  const showAutodiagnostico = modalidad === 'jefaturas' || modalidad === 'mixta';

  const isStep1Valid = nombre.trim() !== '' && rubro !== '' && fechaInicio !== '' && fechaFin !== '' && modalidad !== null;

  const buildDraft = (): DNCProceso => ({
    id: draftId,
    nombre,
    rubro,
    fechaInicio,
    fechaFin,
    modalidad: modalidad!,
    estado: 'borrador',
    participantes: participants.length || existingDraft?.participantes || 0,
    avance: 10,
    tcFirmados: true,
    creadoEn: existingDraft?.creadoEn || new Date().toISOString().split('T')[0],
  });

  const handleSaveStep1 = () => {
    if (!isStep1Valid) return;
    saveDraft(buildDraft());
    setStep1Complete(true);
    toast.success('Parámetros generales guardados como borrador');
  };

  const handleBack = () => {
    if (step1Complete) {
      saveDraft(buildDraft());
      toast.info('Proceso guardado como borrador');
      onBack();
    } else if (isStep1Valid) {
      setShowExitDialog(true);
    } else {
      setShowExitDialog(true);
    }
  };

  const handleConfirmExit = (save: boolean) => {
    setShowExitDialog(false);
    if (save && isStep1Valid) {
      saveDraft(buildDraft());
      toast.info('Proceso guardado como borrador');
    } else if (!isStep1Valid) {
      toast('El proceso no se guardó: faltan campos obligatorios', {
        icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      });
    }
    onBack();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); handleBack(); }} className="text-primary hover:text-primary/80">
              DNC
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Configuración del proceso</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Configuración del proceso DNC</h1>
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Borrador</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configura los parámetros del diagnóstico antes de enviarlo a los colaboradores.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      {/* Step 1 */}
      <Card className={cn("p-6 border-2", step1Complete ? "border-emerald-300 bg-emerald-50/30" : "border-primary/30 bg-primary/5")}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg border flex items-center justify-center",
                step1Complete ? "bg-emerald-100 border-emerald-200" : "bg-primary/10 border-primary/20"
              )}>
                {step1Complete ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Settings className="w-5 h-5 text-primary" />}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Paso 1: Parámetros generales</h3>
                <p className="text-xs text-muted-foreground">Todos los campos son obligatorios para guardar como borrador.</p>
              </div>
            </div>
            {step1Complete && (
              <Button size="sm" variant="ghost" onClick={() => setStep1Complete(false)}>Editar</Button>
            )}
          </div>

          {!step1Complete ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dnc-nombre">Nombre del proceso <span className="text-destructive">*</span></Label>
                <Input id="dnc-nombre" placeholder="Ej: DNC Primer Semestre 2025" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dnc-rubro">Rubro <span className="text-destructive">*</span></Label>
                <Select value={rubro} onValueChange={setRubro}>
                  <SelectTrigger id="dnc-rubro">
                    <SelectValue placeholder="Selecciona un rubro" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'Agricultura y Ganadería', 'Minería', 'Industria Manufacturera', 'Construcción',
                      'Comercio', 'Transporte y Logística', 'Tecnología e Informática', 'Telecomunicaciones',
                      'Servicios Financieros y Banca', 'Salud y Servicios Sociales', 'Educación',
                      'Hotelería y Turismo', 'Energía y Medio Ambiente', 'Inmobiliario',
                      'Servicios Profesionales y Consultoría', 'Administración Pública', 'Retail',
                      'Alimentos y Bebidas', 'Forestal y Pesca', 'Otro',
                    ].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Período de evaluación <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="dnc-inicio" className="text-xs text-muted-foreground">Fecha inicio</Label>
                    <Input id="dnc-inicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="dnc-fin" className="text-xs text-muted-foreground">Fecha fin</Label>
                    <Input id="dnc-fin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Modalidad del proceso <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {modalidades.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setModalidad(m.value)}
                      className={cn(
                        "text-left p-4 rounded-lg border-2 transition-all",
                        modalidad === m.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/40 bg-background"
                      )}
                    >
                      <p className="font-medium text-sm text-foreground">{m.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button className="gap-2" disabled={!isStep1Valid} onClick={handleSaveStep1}>
                  <Save className="w-4 h-4" />
                  Guardar parámetros
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Nombre</p>
                <p className="font-medium text-foreground">{nombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Rubro</p>
                <p className="font-medium text-foreground">{rubro}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Período</p>
                <p className="font-medium text-foreground">
                  {new Date(fechaInicio).toLocaleDateString('es-CL')} — {new Date(fechaFin).toLocaleDateString('es-CL')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Modalidad</p>
                <p className="font-medium text-foreground">
                  {modalidades.find((m) => m.value === modalidad)?.label}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Step 2 */}
      <Card className={cn("p-6 border-2", step1Complete ? (participants.length > 0 ? "border-emerald-300 bg-emerald-50/30" : "border-primary/30 bg-primary/5") : "opacity-50 pointer-events-none")}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg border flex items-center justify-center",
                participants.length > 0 ? "bg-emerald-100 border-emerald-200" : "bg-muted"
              )}>
                {participants.length > 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Users className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Paso 2: Selección de participantes</h3>
                  <Badge variant="secondary" className="text-xs">Paso 2</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">La plantilla debe contener las columnas: <strong>Rut, Nombre, Apellido Paterno, Apellido Materno, E-mail, Cargo, Nivel de Cargo, Área, Unidad y Rut Jefatura Evaluadora</strong>.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
          <DNCParticipantUpload
            participants={participants}
            onParticipantsChange={setParticipants}
            disabled={!step1Complete}
          />
        </div>
      </Card>

      {/* Step 3 */}
      <Card className={cn(
        "p-6 border-2",
        step1Complete && participants.length > 0
          ? (step3Complete ? "border-emerald-300 bg-emerald-50/30" : "border-primary/30 bg-primary/5")
          : "opacity-50 pointer-events-none"
      )}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg border flex items-center justify-center",
                step3Complete ? "bg-emerald-100 border-emerald-200" : "bg-muted"
              )}>
                {step3Complete ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <ClipboardList className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Paso 3: Configuración de la encuesta</h3>
                  <Badge variant="secondary" className="text-xs">Paso 3</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Define las preguntas obligatorias que se incluirán en la encuesta DNC.</p>
              </div>
            </div>
            {step3Complete && (
              <Button size="sm" variant="ghost" onClick={() => { setStep3Complete(false); setDiagnosticoConfigured(false); }}>Editar</Button>
            )}
          </div>

          {!step3Complete ? (
            <div className="space-y-4">
              {!diagnosticoConfigured ? (
                /* Sub-paso: Configuración del diagnóstico */
                <div className="space-y-5">
                  <p className="text-xs text-muted-foreground">Antes de configurar las preguntas de la encuesta, define cómo deseas realizar el diagnóstico.</p>

                  {/* Tipo de diagnóstico */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">¿Cómo deseas realizar el diagnóstico? <span className="text-destructive">*</span></Label>
                    <p className="text-xs text-muted-foreground">Esta selección determina cómo se identificarán los datos en el proceso.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'persona', label: 'Por persona', desc: 'El diagnóstico se realiza de forma individual por cada participante.' },
                        { value: 'cargo', label: 'Por cargo', desc: 'El diagnóstico se agrupa por el cargo de los participantes.' },
                        { value: 'persona_cargo', label: 'Por persona y cargo', desc: 'Combina la identificación individual con la agrupación por cargo.' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setTipoDiagnostico(opt.value)}
                          className={cn(
                            "text-left p-4 rounded-lg border-2 transition-all",
                            tipoDiagnostico === opt.value
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border hover:border-primary/40 bg-background"
                          )}
                        >
                          <p className="font-medium text-sm text-foreground">{opt.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Autodiagnóstico para jefaturas */}
                  {showAutodiagnostico && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">¿Deseas incluir autodiagnóstico para jefaturas? <span className="text-destructive">*</span></Label>
                      <p className="text-xs text-muted-foreground">Permite que las jefaturas también se evalúen a sí mismas dentro del proceso.</p>
                      <div className="grid grid-cols-2 gap-3 max-w-md">
                        {[
                          { value: true, label: 'Sí, incluir' },
                          { value: false, label: 'No, omitir' },
                        ].map((opt) => (
                          <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => setIncluirAutodiagnostico(opt.value)}
                            className={cn(
                              "p-3 rounded-lg border-2 transition-all text-center",
                              incluirAutodiagnostico === opt.value
                                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                : "border-border hover:border-primary/40 bg-background"
                            )}
                          >
                            <p className="font-medium text-sm text-foreground">{opt.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button
                      className="gap-2"
                      disabled={!tipoDiagnostico || (showAutodiagnostico && incluirAutodiagnostico === null)}
                      onClick={() => {
                        setDiagnosticoConfigured(true);
                        toast.success('Configuración de diagnóstico guardada');
                      }}
                    >
                      Continuar a preguntas de encuesta
                    </Button>
                  </div>
                </div>
              ) : (
                /* Sub-paso: Preguntas de la encuesta */
                <div className="space-y-4">
                  {/* Resumen diagnóstico */}
                  <div className="bg-muted/50 rounded-lg p-3 flex flex-wrap gap-4 items-center text-xs">
                    <div>
                      <span className="text-muted-foreground">Diagnóstico:</span>{' '}
                      <span className="font-medium text-foreground">
                        {tipoDiagnostico === 'persona' ? 'Por persona' : tipoDiagnostico === 'cargo' ? 'Por cargo' : 'Por persona y cargo'}
                      </span>
                    </div>
                    {showAutodiagnostico && (
                      <div>
                        <span className="text-muted-foreground">Autodiagnóstico jefaturas:</span>{' '}
                        <span className="font-medium text-foreground">{incluirAutodiagnostico ? 'Sí' : 'No'}</span>
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="text-xs ml-auto h-7" onClick={() => setDiagnosticoConfigured(false)}>
                      Modificar
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">Selecciona las preguntas que se incluirán en la encuesta.</p>

                  {surveyQuestions.map((q) => (
                    <div key={q.id} className={cn("rounded-lg border-2 transition-all", selectedQuestions.includes(q.id) ? "border-primary/40 bg-primary/5" : "border-border bg-background")}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(q.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedQuestions(prev => [...prev, q.id]);
                              } else {
                                setSelectedQuestions(prev => prev.filter(x => x !== q.id));
                              }
                            }}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{q.title}</p>
                            <p className="text-xs text-muted-foreground">{q.subtitle}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs text-muted-foreground flex-shrink-0"
                          onClick={() => setExpandedQuestions(prev =>
                            prev.includes(q.id) ? prev.filter(x => x !== q.id) : [...prev, q.id]
                          )}
                        >
                          {expandedQuestions.includes(q.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          Ver detalle
                        </Button>
                      </div>
                      {expandedQuestions.includes(q.id) && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Opciones de respuesta disponibles:</p>
                            <div className={cn("grid gap-2", q.gridCols || "grid-cols-2 md:grid-cols-4")}>
                              {q.options.map((opt) => (
                                <span key={opt} className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-muted-foreground text-center">
                                  {opt}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end pt-2">
                    <Button
                      className="gap-2"
                      disabled={selectedQuestions.length === 0}
                      onClick={() => {
                        setStep3Complete(true);
                        toast.success('Configuración de encuesta guardada');
                      }}
                    >
                      <Save className="w-4 h-4" />
                      Guardar configuración
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm space-y-3">
              <div className="flex flex-wrap gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Diagnóstico:</span>{' '}
                  <Badge variant="outline" className="text-xs">{tipoDiagnostico === 'persona' ? 'Por persona' : tipoDiagnostico === 'cargo' ? 'Por cargo' : 'Por persona y cargo'}</Badge>
                </div>
                {showAutodiagnostico && (
                  <div>
                    <span className="text-muted-foreground">Autodiagnóstico jefaturas:</span>{' '}
                    <Badge variant="outline" className="text-xs">{incluirAutodiagnostico ? 'Sí' : 'No'}</Badge>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-xs">Preguntas incluidas en la encuesta:</p>
              <div className="flex flex-wrap gap-2">
                {selectedQuestions.includes('mes_capacitacion') && (
                  <Badge variant="secondary" className="text-xs">Preferencia de mes de capacitación</Badge>
                )}
                {selectedQuestions.includes('modalidad_capacitacion') && (
                  <Badge variant="secondary" className="text-xs">Preferencia de modalidad de capacitación</Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Terms signed confirmation */}
      <Card className="p-4 bg-emerald-50 border-emerald-200">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800">Términos y condiciones aceptados</p>
            <p className="text-xs text-emerald-600">Documento firmado digitalmente. Puedes continuar con la configuración del proceso.</p>
          </div>
        </div>
      </Card>

      {/* Exit dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Deseas salir de la configuración?</DialogTitle>
            <DialogDescription>
              {isStep1Valid
                ? 'Tienes cambios sin guardar. ¿Deseas guardar el proceso como borrador antes de salir?'
                : 'No has completado los campos obligatorios (nombre, período y modalidad). El proceso no podrá guardarse como borrador.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>Cancelar</Button>
            {isStep1Valid ? (
              <>
                <Button variant="destructive" onClick={() => handleConfirmExit(false)}>Salir sin guardar</Button>
                <Button onClick={() => handleConfirmExit(true)}>Guardar y salir</Button>
              </>
            ) : (
              <Button variant="destructive" onClick={() => handleConfirmExit(false)}>Salir sin guardar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DNCConfiguracion;
