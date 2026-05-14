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
import { ScrollArea } from '@/components/ui/scroll-area';
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
  email: string;
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
  { id: 'area', title: 'Por área / departamento / gerencia', desc: 'Agrupa por unidad organizacional' },
];

const MODELOS: { id: ModeloAsignacion; title: string; desc: string; nodes: number; tags: string[] }[] = [
  { id: 1, title: 'Modelo 1', desc: 'Jefatura evalúa a sus colaboradores.', nodes: 2, tags: ['Jefatura', 'Colaborador'] },
  { id: 2, title: 'Modelo 2', desc: 'Jefatura evalúa a colaboradores + autoevaluación de colaboradores.', nodes: 3, tags: ['Jefatura', 'Colaborador'] },
  { id: 3, title: 'Modelo 3', desc: 'Jefatura evalúa a colaboradores + autoevaluación de jefatura.', nodes: 3, tags: ['Jefatura', 'Colaborador'] },
  { id: 4, title: 'Modelo 4', desc: 'Evaluación completa: jefatura, colaboradores y autoevaluaciones.', nodes: 4, tags: ['Jefatura', 'Colaborador'] },
];

const TEMPLATE_COLUMNS = ['Rut', 'Nombres', 'Email', 'Tipo Participante'];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    TEMPLATE_COLUMNS,
    ['12.345.678-9', 'Juan Pérez', 'juan@empresa.cl', 'Colaborador'],
    ['11.222.333-4', 'María López', 'maria@empresa.cl', 'Jefatura'],
  ]);
  ws['!cols'] = TEMPLATE_COLUMNS.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, 'Participantes');
  XLSX.writeFile(wb, 'Plantilla_Participantes_DNC.xlsx');
}

function parseRow(row: any): ParticipanteSimple | null {
  const rut = String(row['Rut'] ?? row['rut'] ?? '').trim();
  if (!rut) return null;
  const tipoRaw = String(row['Tipo Participante'] ?? row['Tipo participante'] ?? row['tipo'] ?? '').trim();
  const tipo: 'Colaborador' | 'Jefatura' = tipoRaw.toLowerCase().startsWith('jef') ? 'Jefatura' : 'Colaborador';
  return {
    rut,
    nombres: String(row['Nombres'] ?? row['nombres'] ?? row['Nombre'] ?? '').trim(),
    email: String(row['Email'] ?? row['email'] ?? row['E-mail'] ?? '').trim(),
    tipo,
  };
}

const DNCStepParticipantes: React.FC<Props> = ({
  alcance, onAlcanceChange, modelo, onModeloChange,
  participants, onParticipantsChange, onNext, onBack,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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
      onParticipantsChange(parsed);
      setFileName(file.name);
      toast.success(`${parsed.length} participantes cargados`);
    } catch {
      toast.error('Error al leer el archivo');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0]; if (f) handleFile(f);
  };

  const canProceed = alcance && modelo && participants.length > 0;

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
                alcance === a.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              )}
            >
              <p className="font-semibold text-sm text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Modelo de asignación */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Modelo de asignación de cursos</h2>
          <p className="text-sm text-muted-foreground">Define quién puede asignar cursos a quién.</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {MODELOS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeloChange(m.id)}
              className={cn(
                'text-left p-4 rounded-lg border-2 transition-all bg-background space-y-3',
                modelo === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
              )}
            >
              <div>
                <p className="font-semibold text-sm text-foreground">{m.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug min-h-[40px]">{m.desc}</p>
              </div>
              {/* Diagrama */}
              <div className="flex items-center gap-1 py-3">
                {Array.from({ length: m.nodes }).map((_, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="h-px w-2 bg-primary/40 flex-shrink-0" />}
                    <span className="h-2 flex-1 rounded-full bg-primary/70" />
                  </React.Fragment>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {m.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Carga de nómina */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Carga la nómina de participantes</h2>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Paso 1 · Descarga la plantilla</p>
          <Button variant="outline" size="sm" className="gap-2" onClick={downloadTemplate}>
            <Download className="w-4 h-4" /> Descargar plantilla Excel
          </Button>
          <Alert className="mt-2">
            <AlertDescription className="text-xs">
              Columnas obligatorias: <strong>Rut, Nombres, Email, Tipo Participante</strong>. Tipo debe ser 'Colaborador' o 'Jefatura'.
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Paso 2 · Sube tu archivo</p>
          {participants.length === 0 ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors',
                drag ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-muted/40'
              )}
            >
              <Inbox className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-sm text-foreground">Haz clic o arrastra el archivo aquí para subirlo</p>
              <p className="text-xs text-muted-foreground mt-1">Formatos aceptados: .xlsx, .xls, .csv</p>
            </div>
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
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowPreview(true)}>
                  <Eye className="w-3.5 h-3.5" /> Ver datos
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
          <ArrowLeft className="w-4 h-4" /> Revisar paso anterior
        </Button>
        <Button className="gap-2" disabled={!canProceed} onClick={onNext}>
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Participantes ({participants.length})</DialogTitle></DialogHeader>
          <ScrollArea className="h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rut</TableHead>
                  <TableHead>Nombres</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{p.rut}</TableCell>
                    <TableCell className="text-sm">{p.nombres}</TableCell>
                    <TableCell className="text-sm">{p.email}</TableCell>
                    <TableCell className="text-sm">{p.tipo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <DialogFooter><Button variant="outline" onClick={() => setShowPreview(false)}>Cerrar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DNCStepParticipantes;
