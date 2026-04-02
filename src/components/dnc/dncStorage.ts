export type Modalidad = 'colaboradores' | 'jefaturas' | 'mixta';
export type ProcesoStatus = 'borrador' | 'en_curso' | 'completado' | 'cancelado';

export interface DNCProceso {
  id: string;
  nombre: string;
  rubro: string;
  fechaInicio: string;
  fechaFin: string;
  modalidad: Modalidad;
  estado: ProcesoStatus;
  participantes: number;
  avance: number;
  tcFirmados: boolean;
  creadoEn: string;
}

const STORAGE_KEY = 'dnc_procesos';

// Seed data for demo
const seedProcesos: DNCProceso[] = [
  {
    id: 'DNC-2025-002',
    nombre: 'DNC Área Comercial Q1',
    fechaInicio: '2025-01-15',
    fechaFin: '2025-03-20',
    modalidad: 'colaboradores',
    estado: 'en_curso',
    participantes: 45,
    avance: 65,
    tcFirmados: true,
    creadoEn: '2025-01-10',
  },
  {
    id: 'DNC-2024-001',
    nombre: 'DNC Anual 2024',
    fechaInicio: '2024-08-01',
    fechaFin: '2024-11-10',
    modalidad: 'mixta',
    estado: 'completado',
    participantes: 120,
    avance: 100,
    tcFirmados: true,
    creadoEn: '2024-07-20',
  },
];

function loadProcesos(): DNCProceso[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // First load — seed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProcesos));
  return seedProcesos;
}

function saveProcesos(procesos: DNCProceso[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(procesos));
}

export function getProcesos(): DNCProceso[] {
  return loadProcesos();
}

export function getDraft(): DNCProceso | undefined {
  return loadProcesos().find((p) => p.estado === 'borrador');
}

export function generateId(): string {
  const year = new Date().getFullYear();
  const all = loadProcesos();
  const num = all.length + 1;
  return `DNC-${year}-${String(num).padStart(3, '0')}`;
}

export function saveDraft(draft: DNCProceso) {
  const all = loadProcesos();
  const idx = all.findIndex((p) => p.id === draft.id);
  if (idx >= 0) {
    all[idx] = draft;
  } else {
    all.unshift(draft);
  }
  saveProcesos(all);
}

export function deleteDraft(id: string) {
  const all = loadProcesos().filter((p) => p.id !== id);
  saveProcesos(all);
}
