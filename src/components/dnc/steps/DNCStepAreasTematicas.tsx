import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  Users, Laptop, Briefcase, Headphones, Wallet, UserCircle, ShieldAlert,
  Package, Megaphone, Scale, CheckSquare, Smile, Sparkles, FolderKanban, Globe,
  ArrowLeft, ArrowRight, Info, AlertCircle, CheckCircle2, ChevronDown, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Area {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  tematicas: string[];
}

const AREAS: Area[] = [
  { id: 'liderazgo', name: 'Liderazgo y Gestión', icon: Users, color: 'text-violet-600', tematicas: ['Liderazgo efectivo', 'Gestión del cambio', 'Toma de decisiones', 'Coaching ejecutivo', 'Delegación', 'Gestión de equipos'] },
  { id: 'tecnologia', name: 'Tecnología e Innovación', icon: Laptop, color: 'text-sky-600', tematicas: ['Excel avanzado', 'Power BI', 'Ciberseguridad', 'Cloud Computing', 'Inteligencia Artificial'] },
  { id: 'ventas', name: 'Ventas y Comercial', icon: Briefcase, color: 'text-amber-700', tematicas: ['Técnicas de venta', 'Negociación', 'Atención consultiva', 'CRM', 'Cierre de ventas', 'Prospección'] },
  { id: 'atencion', name: 'Atención al Cliente', icon: Headphones, color: 'text-amber-500', tematicas: ['Servicio al cliente', 'Manejo de reclamos', 'Comunicación efectiva', 'Fidelización', 'Empatía', 'Resolución de conflictos'] },
  { id: 'finanzas', name: 'Finanzas y Contabilidad', icon: Wallet, color: 'text-orange-600', tematicas: ['Contabilidad básica', 'Análisis financiero', 'Tributación', 'Presupuestos', 'Tesorería'] },
  { id: 'rrhh', name: 'Recursos Humanos', icon: UserCircle, color: 'text-orange-500', tematicas: ['Reclutamiento', 'Evaluación de desempeño', 'Clima laboral', 'Capacitación', 'Compensaciones'] },
  { id: 'seguridad', name: 'Seguridad y Prevención de Riesgos', icon: ShieldAlert, color: 'text-rose-600', tematicas: ['Ley 16.744', 'Uso de EPP', 'Investigación de accidentes', 'Plan de emergencia', 'Trabajo en altura', 'Manejo de cargas'] },
  { id: 'operaciones', name: 'Operaciones y Logística', icon: Package, color: 'text-amber-700', tematicas: ['Cadena de suministro', 'Gestión de bodegas', 'Lean manufacturing', 'Inventarios'] },
  { id: 'marketing', name: 'Marketing y Comunicaciones', icon: Megaphone, color: 'text-orange-600', tematicas: ['Marketing digital'] },
  { id: 'legal', name: 'Legal y Cumplimiento', icon: Scale, color: 'text-amber-600', tematicas: ['Compliance', 'Protección de datos', 'Contratos', 'Normativa laboral'] },
  { id: 'calidad', name: 'Calidad y Mejora Continua', icon: CheckSquare, color: 'text-emerald-600', tematicas: ['ISO 9001', 'Kaizen', '5S', 'Auditorías internas'] },
  { id: 'blandas', name: 'Habilidades Blandas', icon: Smile, color: 'text-amber-500', tematicas: ['Trabajo en equipo', 'Inteligencia emocional', 'Comunicación asertiva', 'Gestión del tiempo', 'Resiliencia'] },
  { id: 'transformacion', name: 'Transformación Digital', icon: Sparkles, color: 'text-pink-600', tematicas: ['Cultura digital', 'Agile', 'Scrum', 'Design thinking'] },
  { id: 'proyectos', name: 'Gestión de Proyectos', icon: FolderKanban, color: 'text-blue-600', tematicas: ['PMBOK', 'Scrum Master', 'Project Management', 'Gestión de riesgos'] },
  { id: 'idiomas', name: 'Idiomas', icon: Globe, color: 'text-cyan-600', tematicas: ['Inglés básico', 'Inglés intermedio', 'Inglés de negocios', 'Portugués'] },
];

export interface AreaSelection {
  selected: boolean;
  tematicas: string[];
  maxPriorizar: number;
}

export type AreasState = Record<string, AreaSelection>;

const defaultState = (): AreasState =>
  AREAS.reduce((acc, a) => {
    acc[a.id] = { selected: false, tematicas: [], maxPriorizar: 3 };
    return acc;
  }, {} as AreasState);

interface Props {
  state: AreasState;
  onChange: (s: AreasState) => void;
  onNext: () => void;
  onBack: () => void;
}

const MIN_AREAS = 6;
const MAX_AREAS = 12;

const DNCStepAreasTematicas: React.FC<Props> = ({ state, onChange, onNext, onBack }) => {
  const current = state && Object.keys(state).length ? state : defaultState();
  const [aplicarMismo, setAplicarMismo] = useState(false);
  const [valorComun, setValorComun] = useState(3);

  const update = (id: string, partial: Partial<AreaSelection>) => {
    onChange({ ...current, [id]: { ...current[id], ...partial } });
  };

  const toggleArea = (id: string) => {
    const sel = current[id].selected;
    update(id, { selected: !sel, tematicas: !sel ? current[id].tematicas : [] });
  };

  const toggleTematica = (id: string, t: string) => {
    const list = current[id].tematicas;
    const next = list.includes(t) ? list.filter(x => x !== t) : [...list, t];
    update(id, { tematicas: next, selected: next.length > 0 ? true : current[id].selected });
  };

  const toggleAllTematicas = (id: string, all: string[]) => {
    const list = current[id].tematicas;
    const allSelected = all.every(t => list.includes(t));
    const next = allSelected ? [] : [...all];
    update(id, { tematicas: next, selected: next.length > 0 });
  };

  const selectedAreas = AREAS.filter(a => current[a.id]?.selected);
  const activeCount = selectedAreas.length;
  const faltan = Math.max(0, MIN_AREAS - activeCount);
  const exceso = Math.max(0, activeCount - MAX_AREAS);

  const applyCommon = (v: number) => {
    setValorComun(v);
    if (!aplicarMismo) return;
    const next = { ...current };
    selectedAreas.forEach(a => {
      const max = Math.min(v, a.tematicas.length);
      next[a.id] = { ...next[a.id], maxPriorizar: Math.max(1, max) };
    });
    onChange(next);
  };

  const toggleAplicar = (v: boolean) => {
    setAplicarMismo(v);
    if (v) applyCommon(valorComun);
  };

  const canProceed = activeCount >= MIN_AREAS && activeCount <= MAX_AREAS &&
    selectedAreas.every(a => current[a.id].tematicas.length >= 1);

  const getEstado = (incluidas: number, max: number) => {
    if (incluidas === 0) return { label: 'Sin temáticas', cls: 'text-destructive', icon: AlertCircle };
    if (max < 2 || max > 5) return { label: 'Fuera de rango', cls: 'text-amber-600', icon: AlertCircle };
    return { label: 'Óptimo', cls: 'text-emerald-600', icon: CheckCircle2 };
  };

  return (
    <div className="space-y-6">
      {/* Header / Selección */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Selecciona las áreas e incluye las temáticas</h3>
            <p className="text-sm text-muted-foreground">
              Debes seleccionar entre {MIN_AREAS} y {MAX_AREAS} áreas. Cada área debe tener al menos 1 temática seleccionada.
            </p>
          </div>

          <Badge
            variant="outline"
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              activeCount < MIN_AREAS || activeCount > MAX_AREAS
                ? 'bg-destructive text-destructive-foreground border-destructive'
                : 'bg-emerald-600 text-white border-emerald-600'
            )}
          >
            {activeCount} / {MIN_AREAS}–{MAX_AREAS} áreas activas
          </Badge>

          {faltan > 0 && (
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <AlertDescription className="text-sm text-destructive">
                Debes seleccionar al menos {MIN_AREAS} áreas para continuar. Faltan {faltan}.
              </AlertDescription>
            </Alert>
          )}
          {exceso > 0 && (
            <Alert className="border-amber-500/40 bg-amber-500/5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-700">
                Has superado el máximo de {MAX_AREAS} áreas. Quita {exceso}.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Areas list */}
      <div className="space-y-2">
        {AREAS.map((a) => {
          const Icon = a.icon;
          const sel = current[a.id]?.selected;
          const tematicasSel = current[a.id]?.tematicas ?? [];
          return (
            <Card key={a.id} className={cn('p-3 transition-colors', sel && 'border-primary/40 bg-primary/[0.03]')}>
              <div className="flex items-center gap-4">
                <Checkbox checked={sel} onCheckedChange={() => toggleArea(a.id)} />
                <div className="flex items-center gap-2 min-w-[260px]">
                  <Icon className={cn('w-5 h-5', a.color)} />
                  <span className="text-sm font-semibold text-foreground">{a.name}</span>
                </div>
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full h-9 px-3 rounded-md border border-input bg-background text-left text-sm text-muted-foreground flex items-center justify-between hover:border-primary/40"
                      >
                        {tematicasSel.length === 0 ? (
                          'Buscar y seleccionar temáticas...'
                        ) : (
                          <span className="flex flex-wrap gap-1 py-0.5">
                            {tematicasSel.map(t => (
                              <Badge key={t} variant="secondary" className="text-xs gap-1">
                                {t}
                                <X
                                  className="w-3 h-3 cursor-pointer"
                                  onClick={(e) => { e.stopPropagation(); toggleTematica(a.id, t); }}
                                />
                              </Badge>
                            ))}
                          </span>
                        )}
                        <ChevronDown className="w-4 h-4 opacity-60 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2 w-[--radix-popover-trigger-width]" align="start">
                      <button
                        type="button"
                        onClick={() => toggleAllTematicas(a.id, a.tematicas)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-left text-sm font-medium border-b mb-1"
                      >
                        <Checkbox checked={a.tematicas.every(t => tematicasSel.includes(t))} />
                        <span className="text-primary">Seleccionar todas las temáticas</span>
                      </button>
                      <div className="space-y-1 max-h-64 overflow-auto">
                        {a.tematicas.map(t => {
                          const checked = tematicasSel.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleTematica(a.id, t)}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-left text-sm"
                            >
                              <Checkbox checked={checked} />
                              <span>{t}</span>
                            </button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-xs whitespace-nowrap">
                  {tematicasSel.length} temáticas
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Priorización */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-foreground text-lg">Configuración de priorización de temáticas</h3>
            <p className="text-sm text-muted-foreground">Define cuántas temáticas puede priorizar cada participante por área.</p>
          </div>

          <Alert className="border-primary/30 bg-primary/10">
            <Info className="w-4 h-4 text-primary" />
            <AlertDescription className="text-sm text-foreground">
              Cada área debe permitir priorizar entre 2 y 5 temáticas.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-3 p-3 rounded-md bg-background border">
            <Switch checked={aplicarMismo} onCheckedChange={toggleAplicar} />
            <span className="text-sm font-medium">
              Aplicar <span className="text-primary">mismo valor</span> a todas las áreas
            </span>
            {aplicarMismo && (
              <div className="ml-auto flex items-center gap-3 w-72">
                <Slider value={[valorComun]} min={2} max={5} step={1} onValueChange={(v) => applyCommon(v[0])} />
                <Input
                  type="number"
                  min={2}
                  max={5}
                  value={valorComun}
                  onChange={(e) => applyCommon(Math.max(2, Math.min(5, Number(e.target.value) || 2)))}
                  className="w-16"
                />
              </div>
            )}
          </div>

          {selectedAreas.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Selecciona áreas arriba para configurar la priorización.</p>
          )}

          <div className="space-y-3">
            {selectedAreas.map((a) => {
              const sel = current[a.id];
              const totalT = sel.tematicas.length;
              const onlyOne = totalT <= 1;
              const max = sel.maxPriorizar;
              const inRange = !onlyOne && max >= 2 && max <= Math.min(5, totalT);

              return (
                <Card key={a.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <p className={cn('font-semibold text-sm', a.color)}>{a.name}</p>
                        <p className="text-xs text-muted-foreground">Temáticas incluidas: {totalT}</p>
                      </div>
                      {!onlyOne && (
                        <Slider
                          value={[max]}
                          min={2}
                          max={Math.min(5, totalT)}
                          step={1}
                          onValueChange={(v) => update(a.id, { maxPriorizar: v[0] })}
                        />
                      )}
                      {onlyOne && (
                        <div className="flex items-center gap-2">
                          <Input value={1} readOnly className="w-20" />
                          <span className="text-xs text-muted-foreground">Solo hay 1 temática en esta área</span>
                        </div>
                      )}
                    </div>
                    {!onlyOne && (
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {!inRange && (
                          <Badge
                            variant="outline"
                            className="text-xs gap-1 bg-amber-50 text-amber-700 border-amber-200"
                          >
                            <AlertCircle className="w-3 h-3" />
                            Fuera de rango
                          </Badge>
                        )}
                        <Input
                          type="number"
                          min={2}
                          max={Math.min(5, totalT)}
                          value={max}
                          onChange={(e) => update(a.id, { maxPriorizar: Math.max(2, Math.min(5, Number(e.target.value) || 2)) })}
                          className="w-20 text-center"
                        />
                      </div>
                    )}

                  </div>
                </Card>
              );
            })}
          </div>

          {/* Resumen */}
          {selectedAreas.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Resumen</h4>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead>Área</TableHead>
                      <TableHead>Temáticas incluidas</TableHead>
                      <TableHead>Máx. a priorizar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAreas.map(a => {
                      const sel = current[a.id];
                      const incluidas = sel.tematicas.length;
                      return (
                        <TableRow key={a.id}>
                          <TableCell className={cn('font-medium', a.color)}>{a.name}</TableCell>
                          <TableCell className="text-primary font-medium">{incluidas}</TableCell>
                          <TableCell>{incluidas <= 1 ? 1 : sel.maxPriorizar}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Revisar paso anterior
        </Button>
        <Button className="gap-2" disabled={!canProceed} onClick={onNext}>
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DNCStepAreasTematicas;
export { AREAS };
