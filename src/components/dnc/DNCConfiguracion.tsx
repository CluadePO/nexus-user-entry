import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Settings, Users, FileText, CheckCircle2, Save, AlertTriangle } from 'lucide-react';
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
  const [fechaInicio, setFechaInicio] = useState(existingDraft?.fechaInicio || '');
  const [fechaFin, setFechaFin] = useState(existingDraft?.fechaFin || '');
  const [modalidad, setModalidad] = useState<Modalidad | null>(existingDraft?.modalidad || null);
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [step1Complete, setStep1Complete] = useState(
    !!(existingDraft?.nombre && existingDraft?.fechaInicio && existingDraft?.fechaFin && existingDraft?.modalidad)
  );

  const isStep1Valid = nombre.trim() !== '' && fechaInicio !== '' && fechaFin !== '' && modalidad !== null;

  const buildDraft = (): DNCProceso => ({
    id: draftId,
    nombre,
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Nombre</p>
                <p className="font-medium text-foreground">{nombre}</p>
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
                </div>
                <p className="text-xs text-muted-foreground">Carga un archivo Excel con los colaboradores que participarán en las encuestas.</p>
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
      <Card className="p-6 opacity-50 pointer-events-none">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted border flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="text-xs">Paso 3</Badge>
          </div>
          <h3 className="font-semibold text-foreground">Revisión y envío</h3>
          <p className="text-sm text-muted-foreground">Revisa la configuración completa y envía las encuestas a los participantes seleccionados.</p>
          <Button size="sm" variant="outline" className="w-full gap-2" disabled>
            <CheckCircle2 className="w-4 h-4" />
            Revisar
          </Button>
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
