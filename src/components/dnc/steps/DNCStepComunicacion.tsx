import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Info, Eye, Mail, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComunicacionState {
  fechaInicio: string;
  fechaFin: string;
  recordatorioDias: number;
  emailInvitacionDefault: boolean;
  emailRecordatorioDefault: boolean;
  destinatarios: 'todos' | 'colaboradores' | 'jefaturas';
  alertaResponsable: boolean;
  alertaJefaturas: boolean;
  alertaCorreosExtra: boolean;
  correosExtra: string[];
}

export const defaultComunicacion = (): ComunicacionState => ({
  fechaInicio: '',
  fechaFin: '',
  recordatorioDias: 3,
  emailInvitacionDefault: true,
  emailRecordatorioDefault: true,
  destinatarios: 'todos',
  alertaResponsable: true,
  alertaJefaturas: false,
  alertaCorreosExtra: false,
  correosExtra: [],
});

interface Props {
  state: ComunicacionState;
  onChange: (s: ComunicacionState) => void;
  responsableEmail?: string;
  onNext: () => void;
  onBack: () => void;
}

const fmt = (d: string) => {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}`;
};

const EMAIL_TEMPLATES = {
  invitacion: {
    title: 'Email de Invitación (predeterminado)',
    subject: 'Te invitamos a participar en el proceso de DNC',
    body: `Estimado(a) colaborador(a),

Te invitamos a participar en el proceso de Detección de Necesidades de Capacitación (DNC) de nuestra organización. Tu opinión es fundamental para diseñar el plan de capacitación del próximo período.

La encuesta tomará aproximadamente 10 minutos. Puedes acceder a ella desde el siguiente enlace:

[ENLACE_ENCUESTA]

Plazo de respuesta: hasta [FECHA_CIERRE].

Agradecemos tu compromiso y participación.

Saludos cordiales,
Equipo de Capacitación`,
  },
  recordatorio: {
    title: 'Email de Recordatorio (predeterminado)',
    subject: 'Recordatorio: tu encuesta DNC está pendiente',
    body: `Estimado(a) colaborador(a),

Te recordamos que aún tienes pendiente responder la encuesta de Detección de Necesidades de Capacitación (DNC). Tu participación es muy importante para nosotros.

Accede a la encuesta aquí:

[ENLACE_ENCUESTA]

Quedan pocos días antes del cierre ([FECHA_CIERRE]). Te invitamos a completarla a la brevedad.

Saludos cordiales,
Equipo de Capacitación`,
  },
} as const;

const DNCStepComunicacion: React.FC<Props> = ({ state, onChange, responsableEmail, onNext, onBack }) => {
  const update = (patch: Partial<ComunicacionState>) => onChange({ ...state, ...patch });
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

  const recordatorioStr = (() => {
    if (!state.fechaFin) return '—';
    const end = new Date(state.fechaFin);
    end.setDate(end.getDate() - (state.recordatorioDias || 0));
    return `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}`;
  })();

  const [extraInput, setExtraInput] = React.useState('');
  const [previewKey, setPreviewKey] = React.useState<keyof typeof EMAIL_TEMPLATES | null>(null);
  const addExtra = () => {
    const v = extraInput.trim();
    if (!v || state.correosExtra.includes(v)) return;
    update({ correosExtra: [...state.correosExtra, v] });
    setExtraInput('');
  };

  return (
    <div className="space-y-6">
      {/* Período de respuesta */}
      <Card className="p-6 space-y-5">
        <h2 className="text-lg font-bold text-foreground">Período de respuesta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-sm">Fechas de inicio y cierre</Label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={state.fechaInicio}
                onChange={(e) => update({ fechaInicio: e.target.value })}
                className="flex-1"
              />
              <span className="text-muted-foreground">→</span>
              <Input
                type="date"
                value={state.fechaFin}
                onChange={(e) => update({ fechaFin: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Enviar recordatorio (días antes del cierre)</Label>
            <Input
              type="number"
              min={0}
              max={30}
              value={state.recordatorioDias}
              onChange={(e) => update({ recordatorioDias: Number(e.target.value) || 0 })}
              className="w-32"
            />
          </div>
        </div>

        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription className="text-sm">
            Podrás editar estas fechas una vez creada la DNC desde el dashboard.
          </AlertDescription>
        </Alert>

        {/* Timeline */}
        <div className="pt-4">
          <div className="relative flex items-center justify-between px-2">
            <div className="absolute left-0 right-0 top-2 h-0.5 bg-border" />
            {[
              { label: 'Hoy', date: todayStr },
              { label: 'Inicio', date: fmt(state.fechaInicio) },
              { label: 'Recordatorio', date: recordatorioStr },
              { label: 'Cierre y Resultados', date: fmt(state.fechaFin) },
            ].map((m, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-primary border-2 border-background" />
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                <p className="text-xs font-semibold text-foreground">{m.date}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Correos automáticos */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Correos automáticos</h2>
        <p className="text-xs text-muted-foreground">
          Se utilizará el correo predeterminado en ambos envíos. Haz clic en "Ver predeterminado" para previsualizarlo.
        </p>

        {[
          { key: 'invitacion' as const, label: 'Email de Invitación' },
          { key: 'recordatorio' as const, label: 'Email de Recordatorio' },
        ].map((row) => (
          <div key={row.key} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-primary">{row.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Correo predeterminado</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setPreviewKey(row.key)}>
              <Eye className="w-3.5 h-3.5" /> Ver predeterminado
            </Button>
          </div>
        ))}

        <div className="border rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">¿A quién se envía?</p>
          <div className="space-y-2">
            {[
              { id: 'todos', label: 'Todos los participantes de la nómina' },
              { id: 'colaboradores', label: 'Solo colaboradores' },
              { id: 'jefaturas', label: 'Solo jefaturas' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={state.destinatarios === opt.id}
                  onCheckedChange={() => update({ destinatarios: opt.id as ComunicacionState['destinatarios'] })}
                />
                <span className={cn(state.destinatarios === opt.id && 'text-primary font-medium')}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* Alertas */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Alertas al finalizar el proceso</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Estas personas recibirán una notificación automática cuando el proceso de DNC finalice.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={state.alertaResponsable}
              onCheckedChange={(v) => update({ alertaResponsable: !!v })}
            />
            <span>El responsable configurador</span>
            {responsableEmail && (
              <Badge variant="secondary" className="text-xs">{responsableEmail}</Badge>
            )}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={state.alertaCorreosExtra}
              onCheckedChange={(v) => update({ alertaCorreosExtra: !!v })}
            />
            <span>Agregar correos adicionales</span>
          </label>

          {state.alertaCorreosExtra && (
            <div className="space-y-2 pl-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe correos y presiona Enter..."
                  value={extraInput}
                  onChange={(e) => setExtraInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExtra(); } }}
                />
                <Button type="button" variant="outline" onClick={addExtra}>Agregar</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.correosExtra.map((c) => (
                  <Badge key={c} variant="secondary" className="gap-1">
                    {c}
                    <button onClick={() => update({ correosExtra: state.correosExtra.filter(x => x !== c) })}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-3">
          <p className="text-sm font-semibold text-foreground mb-1">Recibirán la alerta:</p>
          <div className="flex flex-wrap gap-2">
            {state.alertaResponsable && responsableEmail && (
              <Badge variant="outline" className="gap-1"><Mail className="w-3 h-3" />{responsableEmail}</Badge>
            )}
            {state.alertaCorreosExtra && state.correosExtra.map((c) => (
              <Badge key={c} variant="outline" className="gap-1"><Mail className="w-3 h-3" />{c}</Badge>
            ))}
            {!state.alertaResponsable && (!state.alertaCorreosExtra || state.correosExtra.length === 0) && (
              <span className="text-xs text-muted-foreground">Sin destinatarios configurados</span>
            )}
          </div>
        </div>
      </Card>

      {/* Nav */}
      <div className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Revisar paso anterior
        </Button>
        <Button className="gap-2" onClick={onNext}>
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Preview modal */}
      <Dialog open={previewKey !== null} onOpenChange={(o) => !o && setPreviewKey(null)}>
        <DialogContent className="max-w-2xl">
          {previewKey && (
            <>
              <DialogHeader>
                <DialogTitle>{EMAIL_TEMPLATES[previewKey].title}</DialogTitle>
                <DialogDescription>
                  Asunto: <span className="font-medium text-foreground">{EMAIL_TEMPLATES[previewKey].subject}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-md border bg-muted/30 p-4 max-h-[60vh] overflow-auto">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                  {EMAIL_TEMPLATES[previewKey].body}
                </pre>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setPreviewKey(null)}>Cerrar</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DNCStepComunicacion;
