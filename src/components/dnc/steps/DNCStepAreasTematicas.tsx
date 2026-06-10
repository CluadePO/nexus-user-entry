import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import {
  ArrowLeft, ArrowRight, Info, AlertCircle, ChevronDown, X, Search, Check,
} from 'lucide-react';
import {
  Briefcase, Plant, Tractor, ForkKnife, PaintBrush, Flask, Bank,
  Laptop, HardHat, Leaf, GraduationCap, Lightning, Atom, Fish, Tree,
  Translate, Car, Gear, PaintBucket, BookOpen, Factory, Heartbeat, HandHeart,
  Truck, Stack,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Area {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  tematicas: string[];
}

const AREAS: Area[] = [
  { id: 'administracion', name: 'Administración', icon: Briefcase, color: 'text-violet-600', tematicas: ['Gestión administrativa', 'Planificación estratégica', 'Liderazgo y gestión', 'Procesos y procedimientos', 'Gestión documental'] },
  { id: 'agricultura', name: 'Agricultura', icon: Wheat, color: 'text-amber-600', tematicas: ['Cultivos y siembra', 'Riego tecnificado', 'Manejo de plagas', 'Suelos y fertilización', 'Cosecha y postcosecha'] },
  { id: 'agropecuario', name: 'Agropecuario', icon: Tractor, color: 'text-amber-700', tematicas: ['Producción ganadera', 'Sanidad animal', 'Manejo de praderas', 'Reproducción animal', 'Buenas prácticas agropecuarias'] },
  { id: 'alimentacion', name: 'Alimentación gastronomía y turismo', icon: UtensilsCrossed, color: 'text-orange-600', tematicas: ['Manipulación de alimentos', 'Técnicas culinarias', 'Servicio y atención turística', 'Gestión hotelera', 'Coctelería y barismo'] },
  { id: 'artes', name: 'Artes artesanía y gráfica', icon: Palette, color: 'text-pink-600', tematicas: ['Diseño gráfico', 'Ilustración digital', 'Artesanía tradicional', 'Fotografía', 'Edición audiovisual'] },
  { id: 'ciencias', name: 'Ciencias y técnicas aplicadas', icon: FlaskConical, color: 'text-sky-600', tematicas: ['Investigación aplicada', 'Laboratorio y análisis', 'Metrología', 'Métodos estadísticos', 'Calidad y normativas'] },
  { id: 'comercio', name: 'Comercio y servicios financieros', icon: Banknote, color: 'text-emerald-600', tematicas: ['Técnicas de venta', 'Atención al cliente', 'Productos financieros', 'Análisis crediticio', 'CRM y prospección'] },
  { id: 'computacion', name: 'Computación e informática', icon: Laptop, color: 'text-blue-600', tematicas: ['Excel avanzado', 'Power BI', 'Ciberseguridad', 'Desarrollo web', 'Cloud computing'] },
  { id: 'construccion', name: 'Construcción', icon: HardHat, color: 'text-yellow-700', tematicas: ['Lectura de planos', 'Obra gruesa', 'Terminaciones', 'Prevención de riesgos en obra', 'Topografía'] },
  { id: 'ecologia', name: 'Ecología', icon: Leaf, color: 'text-green-600', tematicas: ['Gestión ambiental', 'Manejo de residuos', 'Huella de carbono', 'Economía circular', 'Normativa ambiental'] },
  { id: 'educacion', name: 'Educación y capacitación', icon: GraduationCap, color: 'text-indigo-600', tematicas: ['Metodologías de enseñanza', 'Diseño instruccional', 'Evaluación de aprendizajes', 'E-learning', 'Facilitación de grupos'] },
  { id: 'electricidad', name: 'Electricidad y electrónica', icon: Zap, color: 'text-yellow-600', tematicas: ['Instalaciones eléctricas', 'Electrónica básica', 'Automatización', 'Mantenimiento eléctrico', 'Normativa SEC'] },
  { id: 'nuclear', name: 'Energía nuclear', icon: Atom, color: 'text-purple-600', tematicas: ['Radioprotección', 'Manejo de fuentes radiactivas', 'Normativa CCHEN', 'Seguridad nuclear', 'Aplicaciones industriales'] },
  { id: 'acuaticas', name: 'Especies acuáticas', icon: Fish, color: 'text-cyan-600', tematicas: ['Acuicultura', 'Sanidad acuícola', 'Manejo de cultivos marinos', 'Calidad del agua', 'Procesos en planta'] },
  { id: 'forestal', name: 'Forestal', icon: Trees, color: 'text-green-700', tematicas: ['Manejo forestal sustentable', 'Prevención de incendios', 'Cosecha forestal', 'Viveros', 'Certificación FSC'] },
  { id: 'idiomas', name: 'Idiomas y comunicación', icon: Languages, color: 'text-teal-600', tematicas: ['Inglés básico', 'Inglés de negocios', 'Comunicación efectiva', 'Redacción profesional', 'Oratoria'] },
  { id: 'automotriz', name: 'Mecánica automotriz', icon: Car, color: 'text-red-600', tematicas: ['Motores a combustión', 'Sistemas eléctricos vehiculares', 'Diagnóstico computarizado', 'Frenos y suspensión', 'Vehículos eléctricos'] },
  { id: 'mecanica', name: 'Mecánica industrial', icon: Cog, color: 'text-slate-600', tematicas: ['Mantenimiento industrial', 'Soldadura', 'Mecanizado CNC', 'Hidráulica y neumática', 'Lectura de planos mecánicos'] },
  { id: 'mineria', name: 'Minería', icon: Pickaxe, color: 'text-stone-700', tematicas: ['Operación de equipos mineros', 'Tronadura', 'Procesamiento de minerales', 'Seguridad minera', 'Geología aplicada'] },
  { id: 'nivelacion', name: 'Nivelación de estudios', icon: BookOpen, color: 'text-amber-500', tematicas: ['Lectoescritura', 'Matemática básica', 'Educación media', 'Preparación PAES', 'Validación de estudios'] },
  { id: 'procesos', name: 'Procesos industriales', icon: Factory, color: 'text-orange-700', tematicas: ['Lean manufacturing', 'Control de calidad', 'Mejora continua', 'Mantenimiento productivo', 'Gestión de operaciones'] },
  { id: 'salud', name: 'Salud nutrición y dietética', icon: HeartPulse, color: 'text-rose-600', tematicas: ['Primeros auxilios', 'Nutrición clínica', 'Alimentación saludable', 'Atención al paciente', 'Salud ocupacional'] },
  { id: 'servicios_personas', name: 'Servicio a las personas', icon: HandHeart, color: 'text-pink-500', tematicas: ['Cuidado de adultos mayores', 'Atención infantil', 'Asistencia domiciliaria', 'Trabajo social', 'Inclusión y diversidad'] },
  { id: 'transporte', name: 'Transporte y telecomunicaciones', icon: Truck, color: 'text-blue-700', tematicas: ['Logística y distribución', 'Conducción profesional', 'Redes y telecomunicaciones', 'Gestión de flotas', 'Normativa de transporte'] },
  { id: 'otra', name: 'Otra', icon: Layers, color: 'text-gray-600', tematicas: ['Temática personalizada 1', 'Temática personalizada 2', 'Temática personalizada 3', 'Temática personalizada 4', 'Temática personalizada 5'] },
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
const MSG_MAX_AREAS = `Se alcanzó el máximo de ${MAX_AREAS} áreas permitidas para seleccionar.`;

type FilterMode = 'todas' | 'seleccionadas' | 'sin';

const DNCStepAreasTematicas: React.FC<Props> = ({ state, onChange, onNext, onBack }) => {
  // Migrate state: ensure all current AREAS exist in state
  const current = useMemo<AreasState>(() => {
    const base = defaultState();
    if (state) {
      Object.keys(state).forEach(k => {
        if (base[k]) base[k] = state[k];
      });
    }
    return base;
  }, [state]);

  const [filter, setFilter] = useState<FilterMode>('todas');
  const [valorComun, setValorComun] = useState(3);

  const update = (id: string, partial: Partial<AreaSelection>) => {
    onChange({ ...current, [id]: { ...current[id], ...partial } });
  };

  const activeAreasCount = AREAS.filter(a => current[a.id]?.selected && (current[a.id]?.tematicas?.length ?? 0) >= 1).length;
  const selectedCount = AREAS.filter(a => current[a.id]?.selected).length;
  const areasLimitReached = activeAreasCount >= MAX_AREAS;

  const toggleArea = (id: string) => {
    const sel = current[id].selected;
    if (!sel && activeAreasCount >= MAX_AREAS) {
      toast.error(MSG_MAX_AREAS);
      return;
    }
    update(id, { selected: !sel, tematicas: !sel ? current[id].tematicas : [] });
  };

  const toggleTematica = (id: string, t: string) => {
    const list = current[id].tematicas;
    const isAdding = !list.includes(t);
    const next = isAdding ? [...list, t] : list.filter(x => x !== t);
    update(id, { tematicas: next, selected: next.length > 0 ? true : current[id].selected });
  };

  const toggleAllTematicas = (id: string, all: string[]) => {
    const list = current[id].tematicas;
    const allSelected = all.every(t => list.includes(t));
    const next = allSelected ? [] : [...all];
    update(id, { tematicas: next, selected: next.length > 0 });
  };

  const clearAll = () => {
    const next: AreasState = { ...current };
    AREAS.forEach(a => { next[a.id] = { ...next[a.id], selected: false, tematicas: [] }; });
    onChange(next);
    setFilter('todas');
  };

  const selectedAreas = AREAS.filter(a => current[a.id]?.selected);
  const activeCount = activeAreasCount;
  const faltan = Math.max(0, MIN_AREAS - activeCount);
  const exceso = Math.max(0, activeCount - MAX_AREAS);

  const applyCommon = (v: number) => {
    setValorComun(v);
    const next = { ...current };
    selectedAreas.forEach(a => {
      const max = Math.min(v, a.tematicas.length);
      next[a.id] = { ...next[a.id], maxPriorizar: Math.max(1, max) };
    });
    onChange(next);
  };

  const visibleAreas = AREAS.filter(a => {
    if (filter === 'seleccionadas') return current[a.id]?.selected;
    if (filter === 'sin') return !current[a.id]?.selected;
    return true;
  });

  const meetsMin = activeCount >= MIN_AREAS && activeCount <= MAX_AREAS;
  const badgeClass = activeCount === 0
    ? 'bg-amber-500 text-white border-amber-500'
    : meetsMin
      ? 'bg-emerald-600 text-white border-emerald-600'
      : activeCount > MAX_AREAS
        ? 'bg-destructive text-destructive-foreground border-destructive'
        : 'bg-amber-500 text-white border-amber-500';

  return (
    <div className="space-y-6">
      {/* Header */}
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
            className={cn('rounded-full px-3 py-1 text-xs font-semibold', badgeClass)}
          >
            {activeCount} / {MIN_AREAS}–{MAX_AREAS} áreas activas
          </Badge>

          {faltan > 0 && (
            <Alert className="border-amber-500/40 bg-amber-500/5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-700">
                Debes seleccionar al menos {MIN_AREAS} áreas para continuar. Faltan {faltan}.
              </AlertDescription>
            </Alert>
          )}
          {exceso > 0 && (
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <AlertDescription className="text-sm text-destructive">
                Has superado el máximo de {MAX_AREAS} áreas. Quita {exceso}.
              </AlertDescription>
            </Alert>
          )}

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button
              size="sm"
              variant={filter === 'todas' ? 'default' : 'outline'}
              onClick={() => setFilter('todas')}
            >
              Todas ({AREAS.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'seleccionadas' ? 'default' : 'outline'}
              onClick={() => setFilter('seleccionadas')}
            >
              Seleccionadas ({selectedCount})
            </Button>
            <Button
              size="sm"
              variant={filter === 'sin' ? 'default' : 'outline'}
              onClick={() => setFilter('sin')}
            >
              Sin seleccionar
            </Button>
            <Button size="sm" variant="ghost" className="ml-auto gap-1" onClick={clearAll}>
              <X className="w-4 h-4" /> Limpiar
            </Button>
          </div>
        </div>
      </Card>

      {/* Areas grid - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibleAreas.map((a) => {
          const Icon = a.icon;
          const sel = current[a.id]?.selected;
          const tematicasSel = current[a.id]?.tematicas ?? [];
          const totalT = a.tematicas.length;
          const allChecked = a.tematicas.every(t => tematicasSel.includes(t));
          return (
            <Card
              key={a.id}
              className={cn(
                'p-4 transition-colors',
                sel
                  ? 'border-2 border-primary bg-primary/10'
                  : 'border'
              )}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Checkbox
                      checked={sel}
                      disabled={!sel && areasLimitReached}
                      onCheckedChange={() => toggleArea(a.id)}
                    />
                    {sel && (
                      <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon className={cn('w-5 h-5 shrink-0', a.color)} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{totalT} temáticas disponibles</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-xs whitespace-nowrap">
                    {tematicasSel.length} / {totalT}
                  </Badge>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full min-h-9 px-3 py-1.5 rounded-md border border-input bg-background text-left text-sm text-muted-foreground flex items-center gap-2 hover:border-primary/40"
                    >
                      <Search className="w-4 h-4 opacity-60 shrink-0" />
                      {tematicasSel.length === 0 ? (
                        <span className="flex-1">Buscar y seleccionar temáticas...</span>
                      ) : (
                        <span className="flex-1 flex flex-wrap gap-1 py-0.5">
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
                      <Checkbox checked={allChecked} />
                      <span className="text-primary">
                        {allChecked ? 'Quitar todas las temáticas' : 'Seleccionar todas las temáticas'}
                      </span>
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
                            <span className="flex-1">{t}</span>
                            {checked && <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="border-t mt-1 pt-1 px-2 text-xs text-muted-foreground">
                      {tematicasSel.length} de {totalT} temáticas
                    </div>
                  </PopoverContent>
                </Popover>
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
              Se debe seleccionar entre 2 y 5 temáticas a priorizar
            </AlertDescription>
          </Alert>

          {/* Global slider 2-5 */}
          <div className="p-4 rounded-md bg-background border space-y-3">
            <p className="text-sm font-medium">
              Aplicar <span className="text-primary">mismo valor</span> a todas las áreas seleccionadas
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  value={[valorComun]}
                  min={2}
                  max={5}
                  step={1}
                  onValueChange={(v) => applyCommon(v[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1 px-0.5">
                  <span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
              </div>
              <Input
                type="number"
                min={2}
                max={5}
                value={valorComun}
                onChange={(e) => applyCommon(Math.max(2, Math.min(5, Number(e.target.value) || 2)))}
                className="w-20 text-center"
              />
            </div>
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
                        <p className="font-semibold text-sm text-foreground">{a.name}</p>
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
                          <Badge variant="outline" className="text-xs gap-1 bg-amber-50 text-amber-700 border-amber-200">
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
                          <TableCell className="font-medium text-foreground">{a.name}</TableCell>
                          <TableCell className="font-medium text-foreground">{incluidas}</TableCell>
                          <TableCell className="text-foreground">{incluidas <= 1 ? 1 : sel.maxPriorizar}</TableCell>
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
        <Button
          className="gap-2"
          onClick={() => {
            if (activeCount < MIN_AREAS) { toast.error(`Debes seleccionar al menos ${MIN_AREAS} áreas`); return; }
            if (activeCount > MAX_AREAS) { toast.error(MSG_MAX_AREAS); return; }
            const sinTematicas = selectedAreas.find(a => current[a.id].tematicas.length === 0);
            if (sinTematicas) { toast.error(`El área "${sinTematicas.name}" no tiene temáticas seleccionadas`); return; }
            onNext();
          }}
        >
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DNCStepAreasTematicas;
export { AREAS };
