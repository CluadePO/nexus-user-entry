import React, { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Download, Inbox, CheckCircle2, Trash2, Eye, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

export type Alcance = 'cargo' | 'persona' | 'cargo_persona' | 'area';
export type ModeloAsignacion = 1 | 2 | 3 | 4;

export interface ParticipanteSimple {
  rut: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  cargo: string;
  gerencia: string;
  departamento: string;
  rutJefatura: string;
  tipo: 'Colaborador' | 'Jefatura';
}

interface Props {
  alcance: Alcance | null;
  onAlcanceChange: (a: Alcance) => void;
  modelo: ModeloAsignacion | null;
  onModeloChange: (m: ModeloAsignacion) => void;
  participants: ParticipanteSimple[];
  onParticipantsChange: (p: ParticipanteSimple[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ALCANCES: { id: Alcance; title: string; desc: string }[] = [
  { id: 'cargo', title: 'Por cargo', desc: 'Asigna según el cargo de los participantes' },
  { id: 'persona', title: 'Por persona', desc: 'Asigna de forma individual a cada persona' },
  { id: 'cargo_persona', title: 'Por cargo y persona', desc: 'Combina ambos criterios' },
  { id: 'area', title: 'Gerencia', desc: 'Agrupa por unidad organizacional' },
];

type Tag = { label: string; tone: 'blue' | 'green' | 'pink' };
const TAG_CLASSES: Record<Tag['tone'], string> = {
  blue: 'border-sky-300 bg-sky-50 text-sky-700',
  green: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  pink: 'border-rose-300 bg-rose-50 text-rose-700',
};

const MODELOS: { id: ModeloAsignacion; title: string; desc: string; tags: Tag[] }[] = [
  {
    id: 1,
    title: 'Solo jefatura evalúa',
    desc: 'Jefatura define las necesidades de capacitación de su equipo.',
    tags: [{ label: 'Jefatura asigna a colaboradores', tone: 'blue' }],
  },
  {
    id: 2,
    title: 'Participación colaborativa',
    desc: 'Combina asignación por jefatura con participación activa de colaboradores.',
    tags: [
      { label: 'Jefatura asigna a colaboradores', tone: 'blue' },
      { label: 'Colaborador se autogestiona', tone: 'green' },
    ],
  },
  {
    id: 3,
    title: 'Jefatura con autoevaluación',
    desc: 'La jefatura evalúa necesidades de su equipo y también propias.',
    tags: [
      { label: 'Jefatura asigna a colaboradores', tone: 'blue' },
      { label: 'Jefatura se autoevalúa', tone: 'pink' },
    ],
  },
  {
    id: 4,
    title: 'Participación completa',
    desc: 'Modelo más completo y participativo para levantamiento de necesidades.',
    tags: [
      { label: 'Jefatura asigna a colaboradores', tone: 'blue' },
      { label: 'Colaborador se autogestiona', tone: 'green' },
      { label: 'Jefatura se autoevalúa', tone: 'pink' },
    ],
  },
];

const TEMPLATE_COLUMNS = [
  'Rut', 'Nombres', 'Apellido Paterno', 'Apellido Materno', 'Email',
  'Cargo', 'Gerencia', 'Departamento', 'Rut de Jefatura (Si aplica)', 'Tipo de participante',
];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    TEMPLATE_COLUMNS,
    ['12.345.678-9', 'Juan', 'Pérez', 'González', 'juan@empresa.cl', 'Analista', 'Finanzas', 'Contabilidad', '11.222.333-4', 'Colaborador'],
    ['11.222.333-4', 'María', 'López', 'Soto', 'maria@empresa.cl', 'Gerente', 'Finanzas', 'Contabilidad', '', 'Jefatura'],
  ]);
  ws['!cols'] = TEMPLATE_COLUMNS.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, 'Participantes');
  XLSX.writeFile(wb, 'Plantilla_Participantes_DNC.xlsx');
}

function parseRow(row: any): ParticipanteSimple | null {
  const rut = String(row['Rut'] ?? row['rut'] ?? '').trim();
  if (!rut) return null;
  const tipoRaw = String(row['Tipo de participante'] ?? row['Tipo Participante'] ?? row['Tipo participante'] ?? row['tipo'] ?? '').trim();
  const tipo: 'Colaborador' | 'Jefatura' = tipoRaw.toLowerCase().startsWith('jef') ? 'Jefatura' : 'Colaborador';
  return {
    rut,
    nombres: String(row['Nombres'] ?? row['nombres'] ?? row['Nombre'] ?? '').trim(),
    apellidoPaterno: String(row['Apellido Paterno'] ?? row['apellido paterno'] ?? '').trim(),
    apellidoMaterno: String(row['Apellido Materno'] ?? row['apellido materno'] ?? '').trim(),
    email: String(row['Email'] ?? row['email'] ?? row['E-mail'] ?? '').trim(),
    cargo: String(row['Cargo'] ?? row['cargo'] ?? '').trim(),
    gerencia: String(row['Gerencia'] ?? row['gerencia'] ?? '').trim(),
    departamento: String(row['Departamento'] ?? row['departamento'] ?? '').trim(),
    rutJefatura: String(row['Rut de Jefatura (Si aplica)'] ?? row['Rut Jefatura'] ?? row['rut jefatura'] ?? '').trim(),
    tipo,
  };
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validateRow = (p: ParticipanteSimple) => ({
  rut: !p.rut.trim(),
  nombres: !p.nombres.trim(),
  apellidoPaterno: !p.apellidoPaterno.trim(),
  email: !p.email.trim() || !isValidEmail(p.email),
  rutJefatura: p.tipo === 'Colaborador' && !p.rutJefatura.trim(),
});

const DNCStepParticipantes: React.FC<Props> = ({
  alcance, onAlcanceChange, modelo, onModeloChange,
  participants, onParticipantsChange, onNext, onBack,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [draftRows, setDraftRows] = useState<ParticipanteSimple[]>([]);
  const [reviewMode, setReviewMode] = useState<'review' | 'view'>('review');
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => draftRows.map(validateRow), [draftRows]);
  const errorCount = errors.filter(e => e.rut || e.nombres || e.apellidoPaterno || e.email || e.rutJefatura).length;

  const showAlcanceErr = submitted && !alcance;
  const showModeloErr = submitted && !modelo;
  const showFileErr = submitted && participants.length === 0;

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Formato no soportado. Usa .xlsx, .xls o .csv');
      return;
    }
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws);
      const parsed = rows.map(parseRow).filter(Boolean) as ParticipanteSimple[];
      if (!parsed.length) { toast.error('No se encontraron registros válidos.'); return; }
      setDraftRows(parsed);
      setFileName(file.name);
      setReviewMode('review');
      setShowPreview(true);
    } catch {
      toast.error('Error al leer el archivo');
    }
  };

  const updateDraft = (i: number, patch: Partial<ParticipanteSimple>) => {
    setDraftRows(rows => rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  };

  const removeDraft = (i: number) => setDraftRows(rows => rows.filter((_, idx) => idx !== i));

  const confirmUpload = () => {
    if (errorCount > 0) {
      toast.error(`Aún hay ${errorCount} registro(s) con errores. Corrige antes de continuar.`);
      return;
    }
    onParticipantsChange(draftRows);
    setShowPreview(false);
    toast.success(`${draftRows.length} participantes confirmados`);
  };

  const openExisting = () => {
    setDraftRows(participants);
    setReviewMode('view');
    setShowPreview(true);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0]; if (f) handleFile(f);
  };

  const handleNext = () => {
    setSubmitted(true);
    if (!alcance || !modelo || participants.length === 0) return;
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Alcance del estudio */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Alcance del estudio</h2>
          <p className="text-sm text-muted-foreground">Selecciona el criterio con el que se asignarán los cursos.</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ALCANCES.map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => onAlcanceChange(a.id)}
              className={cn(
                'text-left p-4 rounded-lg border-2 transition-all bg-background',
                alcance === a.id
                  ? 'border-primary bg-primary/5'
                  : showAlcanceErr
                    ? 'border-destructive'
                    : 'border-border hover:border-primary/40'
              )}
            >
              <p className="font-semibold text-sm text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
        {showAlcanceErr && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Selecciona una opción para continuar
          </p>
        )}
      </Card>

      {/* Modelo de asignación */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Modelo de asignación de cursos</h2>
          <p className="text-sm text-muted-foreground">Define quién puede proponer o asignar necesidades de capacitación:</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {MODELOS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeloChange(m.id)}
              className={cn(
                'text-left p-4 rounded-lg border-2 transition-all bg-background flex flex-col gap-3 h-full',
                modelo === m.id
                  ? 'border-primary bg-primary/5'
                  : showModeloErr
                    ? 'border-destructive'
                    : 'border-border hover:border-primary/40'
              )}
            >
              <div>
                <p className="font-semibold text-sm text-foreground">{m.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{m.desc}</p>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                {m.tags.map(t => (
                  <span
                    key={t.label}
                    className={cn(
                      'text-[11px] text-center px-2 py-1.5 rounded border font-medium leading-tight',
                      TAG_CLASSES[t.tone]
                    )}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        {showModeloErr && (
          <p className="text-xs text-destructive flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Selecciona una opción para continuar
          </p>
        )}
      </Card>

      {/* Carga de nómina */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Carga la lista de participantes</h2>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Paso 1 · Descarga y completa la plantilla</p>
          <Button variant="outline" size="sm" className="gap-2" onClick={downloadTemplate}>
            <Download className="w-4 h-4" /> Descargar plantilla Excel
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Paso 2 · Sube la plantilla completada</p>
          {participants.length === 0 ? (
            <>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                className={cn(
                  'border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors',
                  drag
                    ? 'border-primary bg-primary/10'
                    : showFileErr
                      ? 'border-destructive bg-destructive/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/40'
                )}
              >
                <Inbox className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-sm text-foreground">Haz clic o arrastra el archivo aquí para subirlo</p>
                <p className="text-xs text-muted-foreground mt-1">Formatos aceptados: .xlsx, .xls, .csv</p>
              </div>
              {showFileErr && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Carga un archivo válido para continuar
                </p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-lg border border-emerald-200 bg-emerald-50/60">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">{participants.length} participantes cargados</p>
                  {fileName && <p className="text-xs text-muted-foreground">Archivo: {fileName}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={openExisting}>
                  <Eye className="w-3.5 h-3.5" /> Ver / editar datos
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-3.5 h-3.5" /> Reemplazar
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { onParticipantsChange([]); setFileName(null); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <Button className="gap-2" onClick={handleNext}>
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>


      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[95vw] xl:max-w-7xl">
          <DialogHeader>
            <DialogTitle>Revisión de carga ({draftRows.length} registros)</DialogTitle>
            <DialogDescription>
              Verifica los datos procesados desde {fileName ?? 'el archivo'} antes de confirmar la carga definitiva.
            </DialogDescription>
          </DialogHeader>

          {errorCount > 0 ? (
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <AlertDescription className="text-sm text-destructive">
                Hay <strong>{errorCount}</strong> registro(s) con datos incompletos o inválidos. Corrige los campos resaltados.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <AlertDescription className="text-sm">
                Todos los registros son válidos. Puedes confirmar la carga.
              </AlertDescription>
            </Alert>
          )}

          <div className="h-[50vh] overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Rut</TableHead>
                  <TableHead>Nombres</TableHead>
                  <TableHead>Ap. Paterno</TableHead>
                  <TableHead>Ap. Materno</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Gerencia</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Rut Jefatura</TableHead>
                  <TableHead className="w-32">Tipo</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftRows.map((p, i) => {
                  const err = errors[i];
                  const hasErr = err && (err.rut || err.nombres || err.apellidoPaterno || err.email || err.rutJefatura);
                  return (
                    <TableRow key={i} className={cn(hasErr && 'bg-destructive/5')}>
                      <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <Input value={p.rut} onChange={(e) => updateDraft(i, { rut: e.target.value })}
                          className={cn('h-8 text-xs font-mono min-w-[110px]', err?.rut && 'border-destructive')} />
                      </TableCell>
                      <TableCell>
                        <Input value={p.nombres} onChange={(e) => updateDraft(i, { nombres: e.target.value })}
                          className={cn('h-8 text-xs min-w-[120px]', err?.nombres && 'border-destructive')} />
                      </TableCell>
                      <TableCell>
                        <Input value={p.apellidoPaterno} onChange={(e) => updateDraft(i, { apellidoPaterno: e.target.value })}
                          className={cn('h-8 text-xs min-w-[110px]', err?.apellidoPaterno && 'border-destructive')} />
                      </TableCell>
                      <TableCell>
                        <Input value={p.apellidoMaterno} onChange={(e) => updateDraft(i, { apellidoMaterno: e.target.value })}
                          className="h-8 text-xs min-w-[110px]" />
                      </TableCell>
                      <TableCell>
                        <Input value={p.email} onChange={(e) => updateDraft(i, { email: e.target.value })}
                          className={cn('h-8 text-xs min-w-[160px]', err?.email && 'border-destructive')} />
                      </TableCell>
                      <TableCell>
                        <Input value={p.cargo} onChange={(e) => updateDraft(i, { cargo: e.target.value })}
                          className="h-8 text-xs min-w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Input value={p.gerencia} onChange={(e) => updateDraft(i, { gerencia: e.target.value })}
                          className="h-8 text-xs min-w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Input value={p.departamento} onChange={(e) => updateDraft(i, { departamento: e.target.value })}
                          className="h-8 text-xs min-w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Input value={p.rutJefatura} onChange={(e) => updateDraft(i, { rutJefatura: e.target.value })}
                          placeholder={p.tipo === 'Jefatura' ? 'Opcional' : ''}
                          className={cn('h-8 text-xs font-mono min-w-[110px]', err?.rutJefatura && 'border-destructive')} />
                      </TableCell>
                      <TableCell>
                        <Select value={p.tipo} onValueChange={(v) => updateDraft(i, { tipo: v as 'Colaborador' | 'Jefatura' })}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Colaborador">Colaborador</SelectItem>
                            <SelectItem value="Jefatura">Jefatura</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeDraft(i)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Cancelar</Button>
            <Button onClick={confirmUpload} disabled={errorCount > 0 || draftRows.length === 0}>
              {reviewMode === 'view' ? 'Guardar cambios' : `Confirmar carga (${draftRows.length})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DNCStepParticipantes;
