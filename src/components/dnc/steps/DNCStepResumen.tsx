import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { ArrowLeft, Edit, Mail, Users, FolderOpen, Calendar, Info, AlertCircle, Rocket } from 'lucide-react';
import { toast } from 'sonner';

import type { EmpresaDataStep1 } from './DNCStepDatos';
import type { Alcance, ModeloAsignacion, ParticipanteSimple } from './DNCStepParticipantes';
import type { AreasState } from './DNCStepAreasTematicas';
import type { SurveyDesignState } from './DNCStepDisenoEncuesta';
import type { ComunicacionState } from './DNCStepComunicacion';

interface AreaMeta { id: string; name: string; tematicas: string[]; }

interface Props {
  empresa: EmpresaDataStep1;
  alcance: Alcance | null;
  modelo: ModeloAsignacion | null;
  participants: ParticipanteSimple[];
  areasState: AreasState;
  areasMeta: AreaMeta[];
  surveyDesign: SurveyDesignState;
  comunicacion: ComunicacionState;
  onBack: () => void;
  onEdit: (step: number) => void;
  onConfirm: () => void;
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('es-CL') : '—';

const DNCStepResumen: React.FC<Props> = ({
  empresa, alcance, modelo, participants, areasState, areasMeta, surveyDesign, comunicacion,
  onBack, onEdit, onConfirm,
}) => {
  const [open, setOpen] = useState(false);

  const colaboradores = participants.filter(p => p.tipo === 'Colaborador').length;
  const jefaturas = participants.filter(p => p.tipo === 'Jefatura').length;
  const selectedAreas = areasMeta.filter(a => areasState[a.id]?.selected);
  const totalTematicas = selectedAreas.reduce((s, a) => s + (areasState[a.id]?.tematicas.length || 0), 0);

  const periodo = (comunicacion.fechaInicio && comunicacion.fechaFin)
    ? `${fmtDate(comunicacion.fechaInicio)} → ${fmtDate(comunicacion.fechaFin)}`
    : '— - —';

  const handleConfirm = () => {
    setOpen(false);
    toast.success('¡DNC creada exitosamente! El proceso ha iniciado.');
    onConfirm();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">Resumen de configuración</h2>
          <p className="text-xs text-muted-foreground">Revisa todos los detalles antes de crear tu DNC.</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-1">
              <Mail className="w-3.5 h-3.5" /> Correos a enviar
            </div>
            <p className="text-2xl font-bold text-foreground">{participants.length}</p>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-1">
              <Users className="w-3.5 h-3.5" /> Participantes
            </div>
            <p className="text-2xl font-bold text-foreground">{participants.length}</p>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-1">
              <FolderOpen className="w-3.5 h-3.5" /> Áreas / Temáticas
            </div>
            <p className="text-2xl font-bold text-foreground">{selectedAreas.length} <span className="text-base text-muted-foreground">/ {totalTematicas}</span></p>
          </div>
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" /> Período
            </div>
            <p className="text-sm font-bold text-foreground">{periodo}</p>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={['empresa', 'participantes', 'areas', 'preguntas', 'fechas', 'alertas']} className="space-y-2">
          {/* Empresa */}
          <AccordionItem value="empresa" className="border rounded-lg px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 hover:no-underline py-3">
                <span className="text-sm font-semibold text-primary">Empresa y Responsable</span>
              </AccordionTrigger>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); onEdit(1); }}>
                <Edit className="w-3.5 h-3.5" /> Editar
              </Button>
            </div>
            <AccordionContent className="pb-4 space-y-1.5 text-sm">
              <p><span className="font-semibold text-primary">Razón Social:</span> {empresa.razonSocial || '—'}</p>
              <p><span className="font-semibold text-primary">RUT:</span> {empresa.rut || '—'}</p>
              <p><span className="font-semibold text-primary">Nombre DNC:</span> {empresa.nombreProceso || '—'}</p>
              <p><span className="font-semibold text-primary">Responsable:</span> {empresa.responsable || '—'}</p>
              <p><span className="font-semibold text-primary">Email:</span> {empresa.email || '—'}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Participantes */}
          <AccordionItem value="participantes" className="border rounded-lg px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 hover:no-underline py-3">
                <span className="text-sm font-semibold text-primary">Participantes</span>
              </AccordionTrigger>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); onEdit(2); }}>
                <Edit className="w-3.5 h-3.5" /> Editar
              </Button>
            </div>
            <AccordionContent className="pb-4 space-y-1.5 text-sm">
              <p><span className="font-semibold text-primary">Alcance:</span> {alcance || '—'}</p>
              <p><span className="font-semibold text-primary">Modelo de asignación:</span> {modelo ? `Modelo ${modelo}` : '—'}</p>
              <p><span className="font-semibold text-primary">Total nómina:</span> {participants.length} ({colaboradores} colaboradores, {jefaturas} jefaturas)</p>
            </AccordionContent>
          </AccordionItem>

          {/* Áreas */}
          <AccordionItem value="areas" className="border rounded-lg px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 hover:no-underline py-3">
                <span className="text-sm font-semibold text-primary">Áreas y Temáticas</span>
              </AccordionTrigger>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); onEdit(3); }}>
                <Edit className="w-3.5 h-3.5" /> Editar
              </Button>
            </div>
            <AccordionContent className="pb-4 space-y-3 text-sm">
              {selectedAreas.length === 0 && <p className="text-muted-foreground">No hay áreas seleccionadas.</p>}
              {selectedAreas.map((a) => {
                const sel = areasState[a.id];
                return (
                  <div key={a.id}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-primary">{a.name}</span>
                      <Badge variant="secondary" className="text-[10px]">Máx. priorizar: {sel.maxPriorizar}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sel.tematicas.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs font-normal">{t}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>

          {/* Preguntas */}
          <AccordionItem value="preguntas" className="border rounded-lg px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 hover:no-underline py-3">
                <span className="text-sm font-semibold text-primary">Preguntas de Encuesta</span>
              </AccordionTrigger>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); onEdit(4); }}>
                <Edit className="w-3.5 h-3.5" /> Editar
              </Button>
            </div>
            <AccordionContent className="pb-4 space-y-1.5 text-sm">
              <p><span className="font-semibold text-primary">Modalidad:</span> {surveyDesign.modalidadEnabled ? surveyDesign.modalidades.join(', ') : 'No incluida'}</p>
              <p><span className="font-semibold text-primary">Temporalidad:</span> {surveyDesign.temporalidadEnabled ? `${surveyDesign.meses.length} meses disponibles` : 'No incluida'}</p>
              <p><span className="font-semibold text-primary">Necesidad:</span> {surveyDesign.necesidadEnabled ? 'Incluida' : 'No incluida'}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Fechas */}
          <AccordionItem value="fechas" className="border rounded-lg px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 hover:no-underline py-3">
                <span className="text-sm font-semibold text-primary">Fechas y Comunicación</span>
              </AccordionTrigger>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); onEdit(5); }}>
                <Edit className="w-3.5 h-3.5" /> Editar
              </Button>
            </div>
            <AccordionContent className="pb-4 space-y-1.5 text-sm">
              <p>
                <span className="font-semibold text-primary">Inicio:</span> {fmtDate(comunicacion.fechaInicio)}
                {' · '}
                <span className="font-semibold text-primary">Cierre:</span> {fmtDate(comunicacion.fechaFin)}
              </p>
              <p><span className="font-semibold text-primary">Recordatorio:</span> {comunicacion.recordatorioDias} días antes del cierre</p>
              <p><span className="font-semibold text-primary">Invitación:</span> {comunicacion.emailInvitacionDefault ? 'Predeterminada' : 'Personalizada'}</p>
              <p><span className="font-semibold text-primary">Destinatarios:</span> {comunicacion.destinatarios}</p>
            </AccordionContent>
          </AccordionItem>

          {/* Alertas */}
          <AccordionItem value="alertas" className="border rounded-lg px-4">
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1 hover:no-underline py-3">
                <span className="text-sm font-semibold text-primary">Alertas de Finalización</span>
              </AccordionTrigger>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); onEdit(5); }}>
                <Edit className="w-3.5 h-3.5" /> Editar
              </Button>
            </div>
            <AccordionContent className="pb-4 text-sm">
              <div className="flex flex-wrap gap-1.5">
                {comunicacion.alertaResponsable && empresa.email && (
                  <Badge variant="outline" className="gap-1"><Mail className="w-3 h-3" />{empresa.email}</Badge>
                )}
                {comunicacion.alertaJefaturas && <Badge variant="outline">Jefaturas</Badge>}
                {comunicacion.alertaCorreosExtra && comunicacion.correosExtra.map(c => (
                  <Badge key={c} variant="outline" className="gap-1"><Mail className="w-3 h-3" />{c}</Badge>
                ))}
                {!comunicacion.alertaResponsable && !comunicacion.alertaJefaturas && !comunicacion.alertaCorreosExtra && (
                  <span className="text-muted-foreground text-xs">Sin alertas configuradas</span>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription className="text-xs space-y-1">
            <p>Antes de iniciar la DNC, podrás realizar modificaciones sin restricciones.</p>
            <p>Una vez iniciada, solo podrás modificar las fechas de cierre y gestionar participantes (agregar o eliminar).</p>
            <p>No será posible realizar cambios sobre participantes que ya hayan respondido la encuesta.</p>
          </AlertDescription>
        </Alert>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Revisar paso anterior
        </Button>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Rocket className="w-4 h-4" /> Crear DNC
        </Button>
      </div>

      {/* Modal de confirmación */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Confirmas la creación de la DNC?</DialogTitle>
            <DialogDescription>
              Se enviará la encuesta a <strong>{participants.length}</strong> participantes. El proceso iniciará el {fmtDate(comunicacion.fechaInicio)}.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive" className="border-amber-300 bg-amber-50 text-amber-900">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              Esta acción no se puede deshacer. Solo las fechas serán editables después.
            </AlertDescription>
          </Alert>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirm}>Sí, crear DNC</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DNCStepResumen;
