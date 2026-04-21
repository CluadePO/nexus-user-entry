import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, LayoutGrid, SlidersHorizontal, Calendar, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SurveyConfig {
  numAreas: '6' | '10' | '12';
  maxTemas: number;
  fechaInicio: string;
  fechaCierre: string;
  modalidades: string[];
  mesPreferencia: string;
  necesitaMasEspacios: boolean | null;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
  config: SurveyConfig;
  onConfigChange: (config: SurveyConfig) => void;
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MODALIDADES_CAP = ['Presencial', 'E-learning', 'Distancia'];

const DNCStep4Survey: React.FC<Props> = ({ onNext, onBack, config, onConfigChange }) => {
  const update = (partial: Partial<SurveyConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  const toggleModalidad = (mod: string) => {
    if (config.modalidades.includes(mod)) {
      update({ modalidades: config.modalidades.filter(m => m !== mod) });
    } else {
      update({ modalidades: [...config.modalidades, mod] });
    }
  };

  const canProceed = config.numAreas !== '' &&
    config.fechaInicio !== '' &&
    config.fechaCierre !== '' &&
    config.modalidades.length > 0 &&
    config.mesPreferencia !== '';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Parámetros de selección */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Parámetros de Selección</h3>
              <p className="text-xs text-muted-foreground">Define cuántas áreas de formación estarán disponibles.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Número de áreas <span className="text-destructive">*</span></Label>
            <div className="flex gap-3">
              {(['6', '10', '12'] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => update({ numAreas: n })}
                  className={cn(
                    "px-6 py-3 rounded-lg border-2 transition-all font-bold text-lg",
                    config.numAreas === n
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-primary"
                      : "border-border hover:border-primary/40 bg-background text-foreground"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Priorización */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Priorización de Temas</h3>
              <p className="text-xs text-muted-foreground">Limita cuántos temas puede seleccionar cada participante.</p>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Máximo de temas seleccionables: <span className="font-bold text-primary">{config.maxTemas}</span></Label>
            <Slider
              value={[config.maxTemas]}
              onValueChange={(v) => update({ maxTemas: v[0] })}
              min={2}
              max={5}
              step={1}
              className="max-w-md"
            />
            <div className="flex justify-between max-w-md text-xs text-muted-foreground">
              <span>2 temas</span>
              <span>5 temas</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Cronograma */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Cronograma del Proceso</h3>
              <p className="text-xs text-muted-foreground">Define las fechas de inicio y cierre del levantamiento.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio <span className="text-destructive">*</span></Label>
              <Input type="date" value={config.fechaInicio} onChange={(e) => update({ fechaInicio: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Fecha de cierre <span className="text-destructive">*</span></Label>
              <Input type="date" value={config.fechaCierre} onChange={(e) => update({ fechaCierre: e.target.value })} />
            </div>
          </div>
        </div>
      </Card>

      {/* Preguntas Clave */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Preguntas Clave</h3>
              <p className="text-xs text-muted-foreground">Configuración adicional para la encuesta.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Modalidad */}
            <div className="space-y-2">
              <Label>Modalidad de capacitación preferida <span className="text-destructive">*</span></Label>
              <div className="flex gap-3">
                {MODALIDADES_CAP.map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => toggleModalidad(mod)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 transition-all text-sm",
                      config.modalidades.includes(mod)
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-primary font-medium"
                        : "border-border hover:border-primary/40 bg-background text-foreground"
                    )}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            {/* Mes de preferencia */}
            <div className="space-y-2">
              <Label>Mes de preferencia para capacitación <span className="text-destructive">*</span></Label>
              <Select value={config.mesPreferencia} onValueChange={(v) => update({ mesPreferencia: v })}>
                <SelectTrigger className="max-w-sm"><SelectValue placeholder="Selecciona un mes" /></SelectTrigger>
                <SelectContent>
                  {MESES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Más espacios */}
            <div className="space-y-2">
              <Label>¿Necesita más espacios de capacitación?</Label>
              <div className="flex gap-3">
                {[
                  { value: true, label: 'Sí' },
                  { value: false, label: 'No' },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => update({ necesitaMasEspacios: opt.value })}
                    className={cn(
                      "px-6 py-2 rounded-lg border-2 transition-all text-sm",
                      config.necesitaMasEspacios === opt.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-primary font-medium"
                        : "border-border hover:border-primary/40 bg-background text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <Button className="gap-2" disabled={!canProceed} onClick={onNext}>
          Continuar <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DNCStep4Survey;
