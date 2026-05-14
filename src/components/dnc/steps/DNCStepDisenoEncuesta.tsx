import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, ArrowRight, Info, Building2, Laptop, Globe, CheckCircle2, X, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const MODALIDADES = [
  { id: 'presencial', label: 'Presencial', desc: 'Clases en sala con instructor, en un lugar físico.', icon: Building2 },
  { id: 'elearning', label: 'E-learning', desc: 'Aprendizaje online a tu propio ritmo, desde cualquier lugar.', icon: Laptop },
  { id: 'distancia', label: 'Distancia', desc: 'Formación remota sincrónica vía videoconferencia.', icon: Globe },
];

export interface SurveyDesignState {
  modalidadEnabled: boolean;
  modalidades: string[];
  temporalidadEnabled: boolean;
  meses: string[];
  necesidadEnabled: boolean;
}

export const defaultSurveyDesign = (): SurveyDesignState => ({
  modalidadEnabled: true,
  modalidades: ['presencial', 'elearning', 'distancia'],
  temporalidadEnabled: true,
  meses: [...MESES],
  necesidadEnabled: true,
});

interface Props {
  state: SurveyDesignState;
  onChange: (s: SurveyDesignState) => void;
  onNext: () => void;
  onBack: () => void;
}

const DNCStepDisenoEncuesta: React.FC<Props> = ({ state, onChange, onNext, onBack }) => {
  const update = (partial: Partial<SurveyDesignState>) => onChange({ ...state, ...partial });

  const toggleModalidad = (id: string) => {
    if (!state.modalidadEnabled) return;
    update({
      modalidades: state.modalidades.includes(id)
        ? state.modalidades.filter(m => m !== id)
        : [...state.modalidades, id],
    });
  };

  const removeMes = (m: string) => update({ meses: state.meses.filter(x => x !== m) });

  return (
    <div className="grid grid-cols-[1fr_480px] gap-6">
      {/* LEFT: form */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground text-xl">Preguntas adicionales de la encuesta</h3>
        </div>

        <Alert className="border-primary/30 bg-primary/10">
          <Info className="w-4 h-4 text-primary" />
          <AlertDescription className="text-sm text-foreground">
            Estas preguntas se incluirán <span className="text-primary font-medium">al final de la encuesta</span> para todos los participantes.
          </AlertDescription>
        </Alert>

        {/* Pregunta 1 */}
        <Card className={cn('p-5', state.modalidadEnabled && 'border-primary/30')}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-foreground">Pregunta 1 · Modalidad preferida</p>
              <p className="text-sm text-muted-foreground mt-1">¿Qué modalidad de capacitación prefieres?</p>
            </div>
            <Switch checked={state.modalidadEnabled} onCheckedChange={(v) => update({ modalidadEnabled: v })} />
          </div>
          <div className="space-y-2">
            {MODALIDADES.map((m) => {
              const Icon = m.icon;
              const checked = state.modalidades.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={!state.modalidadEnabled}
                  onClick={() => toggleModalidad(m.id)}
                  className={cn(
                    'w-full text-left flex items-start gap-3 p-2 rounded transition-colors',
                    !state.modalidadEnabled && 'opacity-50 cursor-not-allowed',
                    state.modalidadEnabled && 'hover:bg-muted/50'
                  )}
                >
                  <CheckCircle2 className={cn('w-5 h-5 mt-0.5 shrink-0', checked ? 'text-primary' : 'text-muted-foreground/30')} />
                  <Icon className={cn('w-4 h-4 mt-1 shrink-0', checked ? 'text-primary' : 'text-muted-foreground')} />
                  <div>
                    <p className={cn('font-medium text-sm', checked ? 'text-primary' : 'text-foreground')}>{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Pregunta 2 */}
        <Card className={cn('p-5', state.temporalidadEnabled && 'border-primary/30')}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-foreground">Pregunta 2 · Temporalidad</p>
              <p className="text-sm text-muted-foreground mt-1">¿En qué mes(es) preferirías realizar las capacitaciones?</p>
            </div>
            <Switch checked={state.temporalidadEnabled} onCheckedChange={(v) => update({ temporalidadEnabled: v })} />
          </div>
          <div className={cn(
            'min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 flex items-center justify-between gap-2',
            !state.temporalidadEnabled && 'opacity-50'
          )}>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {state.meses.length === 0 && (
                <span className="text-sm text-muted-foreground">Sin meses seleccionados</span>
              )}
              {state.meses.map((m) => (
                <Badge key={m} variant="outline" className="bg-primary/5 border-primary/20 text-foreground gap-1">
                  {m}
                  <X
                    className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-destructive"
                    onClick={() => state.temporalidadEnabled && removeMes(m)}
                  />
                </Badge>
              ))}
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </Card>

        {/* Pregunta 3 */}
        <Card className={cn('p-5', state.necesidadEnabled && 'border-primary/30')}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="font-semibold text-foreground">Pregunta 3 · Necesidad de más capacitación</p>
              <p className="text-sm text-muted-foreground mt-1">
                ¿Crees que necesitas más espacios de capacitación? <span className="text-primary">(Sí / No / No estoy seguro/a)</span>
              </p>
            </div>
            <Switch checked={state.necesidadEnabled} onCheckedChange={(v) => update({ necesidadEnabled: v })} />
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" className="gap-2" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Revisar paso anterior
          </Button>
          <Button className="gap-2" onClick={onNext}>
            Siguiente <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* RIGHT: phone preview */}
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground">Vista previa del encuestado</h4>
        <div className="sticky top-4">
          <div className="mx-auto w-[320px] rounded-[2rem] bg-foreground p-3 shadow-xl">
            <div className="rounded-[1.5rem] bg-background p-4 max-h-[640px] overflow-y-auto space-y-5">
              {state.modalidadEnabled && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-primary">Pregunta 1</p>
                  <p className="text-sm font-medium text-foreground">¿Qué modalidad prefieres?</p>
                  <div className="space-y-2">
                    {MODALIDADES.filter(m => state.modalidades.includes(m.id)).map(m => (
                      <div key={m.id} className="rounded-md border bg-card p-3">
                        <p className="text-sm font-semibold text-primary">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    ))}
                    {state.modalidades.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No hay opciones activas.</p>
                    )}
                  </div>
                </div>
              )}

              {state.temporalidadEnabled && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-primary">Pregunta 2</p>
                  <p className="text-sm font-medium text-foreground">¿En qué mes(es)?</p>
                  <div className="h-9 rounded-md border bg-background px-3 flex items-center justify-between text-xs text-muted-foreground">
                    Seleccionar meses...
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              )}

              {state.necesidadEnabled && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-primary">Pregunta 3</p>
                  <p className="text-sm font-medium text-foreground">¿Necesitas más capacitación?</p>
                  <RadioGroup className="flex gap-4">
                    {['Sí', 'No', 'No estoy seguro/a'].map(opt => (
                      <div key={opt} className="flex items-center gap-1.5">
                        <RadioGroupItem value={opt} id={`prev-${opt}`} disabled />
                        <Label htmlFor={`prev-${opt}`} className="text-xs text-muted-foreground">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {!state.modalidadEnabled && !state.temporalidadEnabled && !state.necesidadEnabled && (
                <p className="text-sm text-muted-foreground italic text-center py-10">
                  Activa al menos una pregunta para ver la vista previa.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNCStepDisenoEncuesta;
