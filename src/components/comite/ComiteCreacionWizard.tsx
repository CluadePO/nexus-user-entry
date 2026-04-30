import { useState, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Upload, Trash2, Check, AlertTriangle, FileSpreadsheet, Search,
  ArrowRight, ArrowLeft, Copy, CheckCircle2, X, Image as ImageIcon, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { message as antdMessage } from 'antd';

const EMPRESAS = [
  { rut: '70.200.800-K', nombre: 'Constructora Diamante S.A.' },
  { rut: '76.543.210-5', nombre: 'Empresa Constructora Norte Ltda.' },
  { rut: '88.123.456-7', nombre: 'Inmobiliaria Sur S.A.' },
];

interface CandidatoRow {
  id: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  rut: string;
  dv: string;
  foto?: { name: string } | null;
}

interface VotanteRow {
  id: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  rut: string;
  dv: string;
  permisoInforme: string;
  dobleRol: string;
}

const STEPS = [
  '1.- Crear Comité',
  '2. Ingresar Candidatos',
  '3. Ingresar Votantes',
  '4. Opciones Finales',
];

const newId = () => Math.random().toString(36).slice(2, 9);

const ERROR_MSG = 'El archivo no tiene el formato correcto. Verifica que las columnas estén en el orden indicado.';

const pick = (row: Record<string, any>, keys: string[]): string => {
  for (const k of keys) {
    const found = Object.keys(row).find(
      rk => rk.toLowerCase().trim() === k.toLowerCase().trim(),
    );
    if (found && row[found] != null) return String(row[found]).trim();
  }
  return '';
};

async function parseCSVByIndex(file: File): Promise<string[][]> {
  const buffer = await file.arrayBuffer();
  const decoder = new TextDecoder('latin1');
  const text = decoder.decode(buffer);
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  return lines.map(line => line.split(';').map(c => c.trim()));
}

async function parseSpreadsheetByIndex(file: File): Promise<string[][]> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv')) {
    return parseCSVByIndex(file);
  }
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) throw new Error('empty');
    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });
    return (rows as any[][]).map(r => r.map(c => String(c ?? '').trim()));
  }
  throw new Error('format');
}


// Chilean DV calculator (SII algorithm)
const calcularDV = (rut: string): string => {
  let suma = 0;
  let multiplicador = 2;
  const rutStr = String(rut).replace(/\D/g, '');
  if (!rutStr) return '';
  for (let i = rutStr.length - 1; i >= 0; i--) {
    suma += parseInt(rutStr[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
};

// Ordered RUT validation. Returns null if OK, otherwise error code.
// 'empty' | 'format' | 'length' | 'dv'
const getRutError = (rut: string, dv: string): null | 'empty' | 'format' | 'length' | 'dv' => {
  if (!rut || rut.trim().length === 0) return 'empty';
  if (!/^[0-9]+$/.test(rut)) return 'format';
  if (rut.length > 8) return 'length';
  // Only check DV match when DV itself has a valid format
  if (/^[0-9Kk]$/.test(dv) && calcularDV(rut).toUpperCase() !== dv.toUpperCase()) return 'dv';
  return null;
};

// Ordered DV validation. 'empty' | 'format' | 'dv'
const getDvError = (rut: string, dv: string): null | 'empty' | 'format' | 'dv' => {
  if (!dv || dv.trim().length === 0) return 'empty';
  if (!/^[0-9Kk]$/.test(dv)) return 'format';
  if (/^[0-9]+$/.test(rut) && rut.length > 0 && rut.length <= 8) {
    if (calcularDV(rut).toUpperCase() !== dv.toUpperCase()) return 'dv';
  }
  return null;
};

const validateNombre = (v: string) => v.trim().length > 0;
const validateBinario = (v: string) => v === '0' || v === '1';

const ComiteCreacionWizard = () => {
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);

  // Step 1
  const [empresaRut, setEmpresaRut] = useState<string>('');
  const [logo, setLogo] = useState<{ name: string; url: string } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Step 2
  const [candidatos, setCandidatos] = useState<CandidatoRow[]>([]);
  const [candidatosFileName, setCandidatosFileName] = useState<string | null>(null);
  const [candidatosError, setCandidatosError] = useState<string | null>(null);
  const [candidatosDragOver, setCandidatosDragOver] = useState(false);
  const candidatosFileRef = useRef<HTMLInputElement>(null);

  // Step 3
  const [votantes, setVotantes] = useState<VotanteRow[]>([]);
  const [votantesFileName, setVotantesFileName] = useState<string | null>(null);
  const [votantesError, setVotantesError] = useState<string | null>(null);
  const [votantesDragOver, setVotantesDragOver] = useState(false);
  const votantesFileRef = useRef<HTMLInputElement>(null);

  // Step 4
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Result
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const comiteId = 644;

  const empresaSeleccionada = EMPRESAS.find(e => e.rut === empresaRut);

  // ---------- handlers ----------
  const handleLogo = (file: File | null) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;
    setLogo({ name: file.name, url: URL.createObjectURL(file) });
  };

  const handleCargarCandidatos = async (file: File | null) => {
    if (!file) return;
    setCandidatosError(null);
    try {
      const rows = await parseSpreadsheetByIndex(file);
      const parsed: CandidatoRow[] = rows
        .filter(cols => cols.length >= 5)
        .map(cols => ({
          id: newId(),
          nombre: cols[0] ?? '',
          apPaterno: cols[1] ?? '',
          apMaterno: cols[2] ?? '',
          rut: cols[3] ?? '',
          dv: cols[4] ?? '',
          foto: null,
        }));
      if (parsed.length === 0) {
        setCandidatos([]);
        setCandidatosFileName(null);
        setCandidatosError(ERROR_MSG);
        return;
      }
      setCandidatos(parsed);
      setCandidatosFileName(file.name);
    } catch {
      setCandidatos([]);
      setCandidatosFileName(null);
      setCandidatosError(ERROR_MSG);
    }
  };

  const handleCargarVotantes = async (file: File | null) => {
    if (!file) return;
    setVotantesError(null);
    try {
      const rows = await parseSpreadsheetByIndex(file);
      const parsed: VotanteRow[] = rows
        .filter(cols => cols.length >= 7)
        .map(cols => ({
          id: newId(),
          nombre: cols[0] ?? '',
          apPaterno: cols[1] ?? '',
          apMaterno: cols[2] ?? '',
          rut: cols[3] ?? '',
          dv: cols[4] ?? '',
          permisoInforme: cols[5] ?? '',
          dobleRol: cols[6] ?? '',
        }));
      if (parsed.length === 0) {
        setVotantes([]);
        setVotantesFileName(null);
        setVotantesError(ERROR_MSG);
        return;
      }
      setVotantes(parsed);
      setVotantesFileName(file.name);
    } catch {
      setVotantes([]);
      setVotantesFileName(null);
      setVotantesError(ERROR_MSG);
    }
  };

  const clearCandidatos = () => {
    setCandidatos([]);
    setCandidatosFileName(null);
    setCandidatosError(null);
    if (candidatosFileRef.current) candidatosFileRef.current.value = '';
  };

  const clearVotantes = () => {
    setVotantes([]);
    setVotantesFileName(null);
    setVotantesError(null);
    if (votantesFileRef.current) votantesFileRef.current.value = '';
  };

  // Build set of duplicate keys (rut+dv) — only keys that appear in 2+ rows count.
  const computeDuplicateKeys = (rows: { rut: string; dv: string }[]): Set<string> => {
    const counts = new Map<string, number>();
    rows.forEach(r => {
      const key = `${r.rut.trim().toLowerCase()}|${r.dv.trim().toLowerCase()}`;
      if (!r.rut.trim() || !r.dv.trim()) return;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const dups = new Set<string>();
    counts.forEach((count, key) => { if (count > 1) dups.add(key); });
    return dups;
  };

  const candidatosDuplicateKeys = useMemo(() => computeDuplicateKeys(candidatos), [candidatos]);
  const votantesDuplicateKeys = useMemo(() => computeDuplicateKeys(votantes), [votantes]);

  const isDuplicate = (rut: string, dv: string, dupSet: Set<string>) => {
    if (!rut.trim() || !dv.trim()) return false;
    return dupSet.has(`${rut.trim().toLowerCase()}|${dv.trim().toLowerCase()}`);
  };

  const candidatosErrores = useMemo(() => {
    let errors = 0;
    candidatos.forEach(c => {
      if (!validateNombre(c.nombre)) errors++;
      if (getRutError(c.rut, c.dv) !== null) errors++;
      if (getDvError(c.rut, c.dv) !== null) errors++;
      if (isDuplicate(c.rut, c.dv, candidatosDuplicateKeys)) errors++;
    });
    return errors;
  }, [candidatos, candidatosDuplicateKeys]);

  const votantesErrores = useMemo(() => {
    let errors = 0;
    votantes.forEach(v => {
      if (!validateNombre(v.nombre)) errors++;
      if (getRutError(v.rut, v.dv) !== null) errors++;
      if (getDvError(v.rut, v.dv) !== null) errors++;
      if (!validateBinario(v.permisoInforme)) errors++;
      if (!validateBinario(v.dobleRol)) errors++;
      if (isDuplicate(v.rut, v.dv, votantesDuplicateKeys)) errors++;
    });
    return errors;
  }, [votantes, votantesDuplicateKeys]);

  const candidatosHasDup = candidatosDuplicateKeys.size > 0;
  const votantesHasDup = votantesDuplicateKeys.size > 0;

  // ---------- External RUT validation (simulated) ----------
  // Hardcoded RUTs already registered in other comités
  const EXTERNAL_RUT_REGISTRY: Record<string, number> = {
    '10035838': 644,
    '12345678': 645,
  };
  type ExternalConflict = { nombre: string; rut: string; dv: string; comiteId: number };
  const [externalWarning, setExternalWarning] = useState<{
    open: boolean;
    origen: 'candidatos' | 'votantes' | null;
    conflicts: ExternalConflict[];
  }>({ open: false, origen: null, conflicts: [] });

  const findExternalConflicts = (
    rows: Array<{ nombre: string; apPaterno?: string; apMaterno?: string; rut: string; dv: string }>
  ): ExternalConflict[] => {
    const out: ExternalConflict[] = [];
    rows.forEach(r => {
      const key = (r.rut || '').trim();
      if (key && EXTERNAL_RUT_REGISTRY[key] !== undefined) {
        const fullName = [r.nombre, r.apPaterno, r.apMaterno].filter(Boolean).join(' ').trim();
        out.push({
          nombre: fullName || '—',
          rut: key,
          dv: r.dv,
          comiteId: EXTERNAL_RUT_REGISTRY[key],
        });
      }
    });
    return out;
  };

  const handleConfirmCandidatos = () => {
    const conflicts = findExternalConflicts(candidatos);
    if (conflicts.length > 0) {
      setExternalWarning({ open: true, origen: 'candidatos', conflicts });
      return;
    }
    setStep(3);
  };

  const handleConfirmVotantes = () => {
    const conflicts = findExternalConflicts(votantes);
    if (conflicts.length > 0) {
      setExternalWarning({ open: true, origen: 'votantes', conflicts });
      return;
    }
    setStep(4);
  };

  const proceedAfterWarning = () => {
    const origen = externalWarning.origen;
    setExternalWarning({ open: false, origen: null, conflicts: [] });
    if (origen === 'candidatos') setStep(3);
    else if (origen === 'votantes') setStep(4);
  };

  const updateCandidato = (id: string, field: keyof CandidatoRow, value: string) => {
    setCandidatos(prev => prev.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };
  const updateVotante = (id: string, field: keyof VotanteRow, value: string) => {
    setVotantes(prev => prev.map(v => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const setCandidatoFoto = (id: string, file: File | null) => {
    setCandidatos(prev => prev.map(c => (c.id === id ? { ...c, foto: file ? { name: file.name } : null } : c)));
  };

  const filteredCandidatos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidatos;
    return candidatos.filter(c =>
      `${c.nombre} ${c.apPaterno} ${c.apMaterno}`.toLowerCase().includes(q),
    );
  }, [candidatos, search]);

  const reset = () => {
    setStep(1);
    setShowResult(false);
    setEmpresaRut('');
    setLogo(null);
    setCandidatos([]);
    setCandidatosFileName(null);
    setCandidatosError(null);
    setVotantes([]);
    setVotantesFileName(null);
    setVotantesError(null);
    setSearch('');
    setCopied1(false);
    setCopied2(false);
  };

  const copy = async (text: string, which: 1 | 2) => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === 1) {
        setCopied1(true);
        setTimeout(() => setCopied1(false), 2000);
      } else {
        setCopied2(true);
        setTimeout(() => setCopied2(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  // ---------- result screen ----------
  if (showResult) {
    const link1 = `${window.location.origin}/comite/voto/644/1`;
    const link2 = `${window.location.origin}/comite/voto/644/2`;
    return (
      <div className="space-y-6">
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-base font-semibold">Resumen</h3>
            <p className="text-sm">Id Comité : <span className="font-medium">{comiteId}</span></p>
            <p className="text-sm">Total de Candidatos : <span className="font-medium">{candidatos.length}</span></p>
            <p className="text-sm">Total de Votantes : <span className="font-medium">{votantes.length}</span></p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-semibold">Link</h3>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Link votantes estándar (Col F = 0)</p>
              <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-md p-2.5">
                <a href={link1} target="_blank" rel="noopener noreferrer" className="text-xs font-mono flex-1 break-all text-primary hover:underline">{link1}</a>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 shrink-0"
                  onClick={() => copy(link1, 1)}
                >
                  {copied1 ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Link votantes con informe (Col F = 1)</p>
              <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-md p-2.5">
                <a href={link2} target="_blank" rel="noopener noreferrer" className="text-xs font-mono flex-1 break-all text-primary hover:underline">{link2}</a>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 shrink-0"
                  onClick={() => copy(link2, 2)}
                >
                  {copied2 ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={reset} className="bg-primary hover:bg-primary/90">
            Crear nuevo comité
          </Button>
        </div>
      </div>
    );
  }

  // ---------- stepper ----------
  const Stepper = () => (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {STEPS.map((label, idx) => {
        const n = idx + 1;
        const isActive = step === n;
        const isDone = step > n;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1.5',
              isActive && 'font-bold text-foreground',
              isDone && 'text-primary',
              !isActive && !isDone && 'text-muted-foreground',
            )}>
              {isDone && <Check className="h-4 w-4" />}
              <span>{label}</span>
            </div>
            {n < STEPS.length && <span className="text-muted-foreground">·</span>}
          </div>
        );
      })}
    </div>
  );

  // ---------- render steps ----------
  return (
    <div className="space-y-6">
      <Card className="border-[#E5E7EB]">
        <CardContent className="p-5">
          <Stepper />
        </CardContent>
      </Card>

      {/* PASO 1 */}
      {step === 1 && (
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm">Empresa <span className="text-destructive">*</span></Label>
              <Select value={empresaRut} onValueChange={(value) => {
                setEmpresaRut(value);
                if (logo) {
                  setLogo(null);
                  if (logoInputRef.current) logoInputRef.current.value = '';
                  antdMessage.info({
                    content: 'El logo anterior fue eliminado al cambiar de empresa',
                    duration: 3,
                  });
                }
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una empresa" />
                </SelectTrigger>
                <SelectContent>
                  {EMPRESAS.map(e => (
                    <SelectItem key={e.rut} value={e.rut}>
                      {e.rut} — {e.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Logo</Label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => handleLogo(e.target.files?.[0] || null)}
              />
              {!logo ? (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E5E7EB] rounded-md p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-foreground">Arrastra tu logo aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground">Formatos: PNG, JPG. Máx 2MB</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-md">
                  <img src={logo.url} alt="logo" className="h-12 w-12 object-contain rounded" />
                  <span className="text-sm flex-1 truncate">{logo.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setLogo(null)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                disabled={!empresaRut}
                onClick={() => setStep(2)}
                className="bg-primary hover:bg-primary/90"
              >
                Siguiente <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PASO 2 */}
      {step === 2 && (
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6 space-y-4">
            <input
              ref={candidatosFileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => handleCargarCandidatos(e.target.files?.[0] ?? null)}
            />
            {candidatos.length === 0 ? (
              <div
                onClick={() => candidatosFileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setCandidatosDragOver(true); }}
                onDragLeave={() => setCandidatosDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setCandidatosDragOver(false);
                  handleCargarCandidatos(e.dataTransfer.files?.[0] ?? null);
                }}
                className={cn(
                  'border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
                  candidatosDragOver ? 'border-primary bg-primary/5' : 'border-[#E5E7EB] hover:border-primary/50',
                )}
              >
                <FileSpreadsheet className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium">Arrastra el archivo de candidatos aquí</p>
                <p className="text-xs text-muted-foreground text-center">
                  Columnas requeridas: Nombre*, Ap. Paterno, Ap. Materno, RUT* (sin puntos ni DV, máx 8 chars), DV* (máx 1 char). Formatos: .xlsx, .xls, .csv
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); candidatosFileRef.current?.click(); }}
                >
                  Seleccionar archivo
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-md bg-emerald-50/40">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{candidatosFileName}</span>
                  <span className="text-muted-foreground">· {candidatos.length} filas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => candidatosFileRef.current?.click()}>
                    Reemplazar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCandidatos}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {candidatosError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {candidatosError}
              </div>
            )}

            {candidatos.length > 0 && (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {candidatos.length} registros cargados · <span className={candidatosErrores > 0 ? 'text-destructive font-medium' : ''}>{candidatosErrores} errores</span>
                  </span>
                </div>

                {candidatosErrores > 0 && (
                  <div
                    className="flex items-center gap-2 border rounded-md p-3 text-sm text-yellow-900"
                    style={{ backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {candidatosHasDup
                      ? 'Existen RUTs duplicados. Revisa y elimina los registros repetidos antes de continuar.'
                      : 'Corrige los errores antes de continuar'}
                  </div>
                )}

                <div className="overflow-x-auto border border-[#E5E7EB] rounded-md">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 w-10">N°</th>
                        <th className="text-left p-2">Nombre*</th>
                        <th className="text-left p-2">Ap. Paterno</th>
                        <th className="text-left p-2">Ap. Materno</th>
                        <th className="text-left p-2">RUT*</th>
                        <th className="text-left p-2">
                          <span className="inline-flex items-center gap-1">
                            DV*
                            <span title="El DV se calcula automáticamente según el algoritmo del Servicio de Impuestos Internos (SII). Puede ser un número del 0 al 9 o la letra K." className="inline-flex cursor-help" aria-label="Ayuda DV">
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
                          </span>
                        </th>
                        <th className="text-right p-2 w-16">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidatos.map((c, idx) => {
                        const errNombre = !validateNombre(c.nombre);
                        const rutErr = getRutError(c.rut, c.dv);
                        const dvErr = getDvError(c.rut, c.dv);
                        const isDup = isDuplicate(c.rut, c.dv, candidatosDuplicateKeys);
                        const dvCalc = /^[0-9]+$/.test(c.rut) && c.rut.length > 0 && c.rut.length <= 8 ? calcularDV(c.rut) : '';
                        const rutTooltip = isDup
                          ? 'RUT duplicado. Este registro ya existe en el listado.'
                          : rutErr === 'empty' ? 'RUT obligatorio.'
                          : rutErr === 'format' ? 'RUT inválido. Solo se permiten dígitos numéricos.'
                          : rutErr === 'length' ? 'RUT inválido. Máximo 8 dígitos.'
                          : rutErr === 'dv' ? `DV incorrecto. El dígito verificador para este RUT debería ser ${dvCalc}`
                          : undefined;
                        const dvTooltip = isDup
                          ? 'RUT duplicado. Este registro ya existe en el listado.'
                          : dvErr === 'empty' ? 'DV obligatorio.'
                          : dvErr === 'format' ? 'DV inválido. Debe ser un número 0-9 o la letra K.'
                          : dvErr === 'dv' ? `DV incorrecto. El dígito verificador para este RUT debería ser ${dvCalc}`
                          : undefined;
                        return (
                          <tr key={c.id} className="border-t border-[#E5E7EB]">
                            <td className="p-2 text-muted-foreground">{idx + 1}</td>
                            <td className="p-1">
                              <div className="relative">
                                <Input
                                  value={c.nombre}
                                  onChange={(e) => updateCandidato(c.id, 'nombre', e.target.value)}
                                  className={cn('h-8 text-xs', errNombre && 'border-destructive pr-7')}
                                />
                                {errNombre && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-destructive absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                              </div>
                            </td>
                            <td className="p-1">
                              <Input
                                value={c.apPaterno}
                                onChange={(e) => updateCandidato(c.id, 'apPaterno', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={c.apMaterno}
                                onChange={(e) => updateCandidato(c.id, 'apMaterno', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={c.rut}
                                onChange={(e) => updateCandidato(c.id, 'rut', e.target.value)}
                                title={rutTooltip}
                                className={cn('h-8 text-xs', (rutErr || isDup) && 'border-destructive')}
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={c.dv}
                                onChange={(e) => updateCandidato(c.id, 'dv', e.target.value)}
                                title={dvTooltip}
                                className={cn('h-8 text-xs w-14', (dvErr || isDup) && 'border-destructive')}
                              />
                            </td>
                            <td className="p-1 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => setCandidatos(prev => prev.filter(x => x.id !== c.id))}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                disabled={candidatos.length === 0 || candidatosErrores > 0}
                onClick={handleConfirmCandidatos}
                className="bg-primary hover:bg-primary/90"
              >
                Continuar con votantes <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PASO 3 */}
      {step === 3 && (
        <Card className="border-[#E5E7EB]">
          <CardContent className="p-6 space-y-4">
            <input
              ref={votantesFileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => handleCargarVotantes(e.target.files?.[0] ?? null)}
            />
            {votantes.length === 0 ? (
              <div
                onClick={() => votantesFileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setVotantesDragOver(true); }}
                onDragLeave={() => setVotantesDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setVotantesDragOver(false);
                  handleCargarVotantes(e.dataTransfer.files?.[0] ?? null);
                }}
                className={cn(
                  'border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
                  votantesDragOver ? 'border-primary bg-primary/5' : 'border-[#E5E7EB] hover:border-primary/50',
                )}
              >
                <FileSpreadsheet className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium">Arrastra el archivo de votantes aquí</p>
                <p className="text-xs text-muted-foreground text-center">
                  Columnas requeridas: Nombre*, Ap. Paterno, Ap. Materno, RUT* (máx 8 chars), DV* (máx 1 char), Permiso informe* (0/1), Doble rol* (0/1). Formatos: .xlsx, .xls, .csv
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); votantesFileRef.current?.click(); }}
                >
                  Seleccionar archivo
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-md bg-emerald-50/40">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">{votantesFileName}</span>
                  <span className="text-muted-foreground">· {votantes.length} filas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => votantesFileRef.current?.click()}>
                    Reemplazar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={clearVotantes}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {votantesError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {votantesError}
              </div>
            )}

            {votantes.length > 0 && (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {votantes.length} registros cargados · <span className={votantesErrores > 0 ? 'text-destructive font-medium' : ''}>{votantesErrores} errores</span>
                  </span>
                </div>

                {votantesErrores > 0 && (
                  <div
                    className="flex items-center gap-2 border rounded-md p-3 text-sm text-yellow-900"
                    style={{ backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }}
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {votantesHasDup
                      ? 'Existen RUTs duplicados. Revisa y elimina los registros repetidos antes de continuar.'
                      : 'Corrige los errores antes de continuar'}
                  </div>
                )}

                <div className="overflow-x-auto border border-[#E5E7EB] rounded-md">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 w-10">N°</th>
                        <th className="text-left p-2">Nombre*</th>
                        <th className="text-left p-2">Ap. Paterno</th>
                        <th className="text-left p-2">Ap. Materno</th>
                        <th className="text-left p-2">RUT*</th>
                        <th className="text-left p-2">DV*</th>
                        <th className="text-left p-2" title="0 = solo vota · 1 = vota y ve informes">Permiso informe*</th>
                        <th className="text-left p-2" title="0 = solo votante · 1 = votante y candidato">Doble rol*</th>
                        <th className="text-right p-2 w-16">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votantes.map((v, idx) => {
                        const errNombre = !validateNombre(v.nombre);
                        const rutErr = getRutError(v.rut, v.dv);
                        const dvErr = getDvError(v.rut, v.dv);
                        const errPI = !validateBinario(v.permisoInforme);
                        const errDR = !validateBinario(v.dobleRol);
                        const isDup = isDuplicate(v.rut, v.dv, votantesDuplicateKeys);
                        const dvCalc = /^[0-9]+$/.test(v.rut) && v.rut.length > 0 && v.rut.length <= 8 ? calcularDV(v.rut) : '';
                        const rutTooltip = isDup
                          ? 'RUT duplicado. Este registro ya existe en el listado.'
                          : rutErr === 'empty' ? 'RUT obligatorio.'
                          : rutErr === 'format' ? 'RUT inválido. Solo se permiten dígitos numéricos.'
                          : rutErr === 'length' ? 'RUT inválido. Máximo 8 dígitos.'
                          : rutErr === 'dv' ? `DV incorrecto. El dígito verificador para este RUT debería ser ${dvCalc}`
                          : undefined;
                        const dvTooltip = isDup
                          ? 'RUT duplicado. Este registro ya existe en el listado.'
                          : dvErr === 'empty' ? 'DV obligatorio.'
                          : dvErr === 'format' ? 'DV inválido. Debe ser un número 0-9 o la letra K.'
                          : dvErr === 'dv' ? `DV incorrecto. El dígito verificador para este RUT debería ser ${dvCalc}`
                          : undefined;
                        return (
                          <tr key={v.id} className="border-t border-[#E5E7EB]">
                            <td className="p-2 text-muted-foreground">{idx + 1}</td>
                            <td className="p-1">
                              <div className="relative">
                                <Input
                                  value={v.nombre}
                                  onChange={(e) => updateVotante(v.id, 'nombre', e.target.value)}
                                  className={cn('h-8 text-xs', errNombre && 'border-destructive pr-7')}
                                />
                                {errNombre && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-destructive absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                              </div>
                            </td>
                            <td className="p-1">
                              <Input
                                value={v.apPaterno}
                                onChange={(e) => updateVotante(v.id, 'apPaterno', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={v.apMaterno}
                                onChange={(e) => updateVotante(v.id, 'apMaterno', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={v.rut}
                                onChange={(e) => updateVotante(v.id, 'rut', e.target.value)}
                                title={rutTooltip}
                                className={cn('h-8 text-xs', (rutErr || isDup) && 'border-destructive')}
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                value={v.dv}
                                onChange={(e) => updateVotante(v.id, 'dv', e.target.value)}
                                title={dvTooltip}
                                className={cn('h-8 text-xs w-14', (dvErr || isDup) && 'border-destructive')}
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                title="0 = solo vota · 1 = vota y ve informes"
                                value={v.permisoInforme}
                                onChange={(e) => updateVotante(v.id, 'permisoInforme', e.target.value)}
                                className={cn('h-8 text-xs w-16', errPI && 'border-destructive')}
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                title="0 = solo votante · 1 = votante y candidato opcional"
                                value={v.dobleRol}
                                onChange={(e) => updateVotante(v.id, 'dobleRol', e.target.value)}
                                className={cn('h-8 text-xs w-16', errDR && 'border-destructive')}
                              />
                            </td>
                            <td className="p-1 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => setVotantes(prev => prev.filter(x => x.id !== v.id))}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                disabled={votantes.length === 0 || votantesErrores > 0}
                onClick={handleConfirmVotantes}
                className="bg-primary hover:bg-primary/90"
              >
                Finalizar carga <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PASO 4 */}
      {step === 4 && (
        <div className="space-y-4">
          <Card className="border-[#E5E7EB]">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-base font-semibold">Resumen del comité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Empresa</p>
                  <p className="font-medium">
                    {empresaSeleccionada
                      ? `${empresaSeleccionada.nombre} (${empresaSeleccionada.rut})`
                      : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Logo</p>
                    {logo ? (
                      <img src={logo.url} alt="logo" className="h-12 w-12 object-contain rounded border border-[#E5E7EB]" />
                    ) : (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" /> Sin logo
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total candidatos cargados</p>
                  <p className="font-medium">{candidatos.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total votantes cargados</p>
                  <p className="font-medium">{votantes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E5E7EB]">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold">Fotos de candidatos</h3>
              <p className="text-sm text-muted-foreground">
                Seleccione una imagen a los candidatos que les correspondan
              </p>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar candidato..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-md">
                {filteredCandidatos.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">No se encontraron candidatos</p>
                ) : (
                  filteredCandidatos.map(c => (
                    <CandidatoFotoRow
                      key={c.id}
                      candidato={c}
                      onPick={(file) => setCandidatoFoto(c.id, file)}
                      onRemove={() => setCandidatoFoto(c.id, null)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <Button
              size="lg"
              onClick={() => setConfirmOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Finalizar y activar comité
            </Button>
          </div>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Confirmas que deseas activar este comité?</DialogTitle>
            <DialogDescription>
              Una vez activado, los votantes podrán acceder a través del link generado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => { setConfirmOpen(false); setShowResult(true); }}
            >
              Sí, activar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* External RUT validation warning */}
      <Dialog
        open={externalWarning.open}
        onOpenChange={(o) => !o && setExternalWarning({ open: false, origen: null, conflicts: [] })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FEF3C7' }}
              >
                <AlertTriangle className="h-5 w-5" style={{ color: '#B45309' }} />
              </div>
              <DialogTitle>RUTs ya registrados en otro comité</DialogTitle>
            </div>
            <DialogDescription>
              Los siguientes {externalWarning.origen === 'candidatos' ? 'candidatos' : 'votantes'} ya
              figuran como participantes activos en otro comité. Verifica si corresponde mantenerlos
              antes de continuar.
            </DialogDescription>
          </DialogHeader>

          <div className="border border-[#E5E7EB] rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2">Nombre</th>
                  <th className="text-left p-2">RUT</th>
                  <th className="text-left p-2">Comité existente</th>
                </tr>
              </thead>
              <tbody>
                {externalWarning.conflicts.map((c, i) => (
                  <tr key={i} className="border-t border-[#E5E7EB]">
                    <td className="p-2">{c.nombre}</td>
                    <td className="p-2 font-mono">{c.rut}-{c.dv}</td>
                    <td className="p-2">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                      >
                        Comité #{c.comiteId}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExternalWarning({ open: false, origen: null, conflicts: [] })}
            >
              Volver a revisar
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={proceedAfterWarning}>
              Continuar de todas formas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ---------- subcomponent ----------
interface CandidatoFotoRowProps {
  candidato: CandidatoRow;
  onPick: (file: File) => void;
  onRemove: () => void;
}
const CandidatoFotoRow = ({ candidato, onPick, onRemove }: CandidatoFotoRowProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        {candidato.foto ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 grid grid-cols-3 gap-2 text-sm min-w-0">
        <span className="truncate">{candidato.nombre}</span>
        <span className="truncate">{candidato.apPaterno}</span>
        <span className="truncate">{candidato.apMaterno}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        Elegir archivo
      </Button>
      <div className="min-w-[180px] flex items-center justify-end gap-2 text-xs">
        {candidato.foto ? (
          <>
            <span className="truncate max-w-[120px]">{candidato.foto.name}</span>
            <Check className="h-4 w-4 text-primary shrink-0" />
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRemove}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : (
          <span className="text-muted-foreground">No se ha seleccionado ningún archivo</span>
        )}
      </div>
    </div>
  );
};

export default ComiteCreacionWizard;
