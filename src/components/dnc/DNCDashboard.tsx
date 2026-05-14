import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Plus, Info, Zap, BarChart3, Target, Search, Eye, Download, FileText, Pencil,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type DNCEstado = 'Iniciada' | 'Terminada' | 'Borrador' | 'Creada';

export interface DNCRow {
  id: string;
  nombre: string;
  empresa: string;
  fechaInicio: string | null;
  fechaCierre: string | null;
  participantes: number;
  respondieron: number;
  estado: DNCEstado;
}

const MOCK_ROWS: DNCRow[] = [
  { id: '1', nombre: 'DNC Constructora Arenas 2025', empresa: 'Constructora Arenas Ltda.', fechaInicio: '2025-05-01', fechaCierre: '2025-05-31', participantes: 47, respondieron: 28, estado: 'Iniciada' },
  { id: '2', nombre: 'DNC Retail Norte Q1', empresa: 'Comercial Tarapacá SpA', fechaInicio: '2025-03-01', fechaCierre: '2025-03-31', participantes: 23, respondieron: 23, estado: 'Terminada' },
  { id: '3', nombre: 'DNC Salud Corporativa 2025', empresa: 'Clínica Bío-Bío S.A.', fechaInicio: null, fechaCierre: null, participantes: 0, respondieron: 0, estado: 'Borrador' },
  { id: '4', nombre: 'DNC Logística Sur 2024', empresa: 'Transportes del Pacífico', fechaInicio: '2024-11-01', fechaCierre: '2024-11-30', participantes: 61, respondieron: 61, estado: 'Terminada' },
  { id: '5', nombre: 'DNC TI Innovación', empresa: 'Minera Los Andes', fechaInicio: '2025-06-01', fechaCierre: '2025-06-30', participantes: 15, respondieron: 0, estado: 'Creada' },
  { id: '6', nombre: 'DNC RRHH Corporativo', empresa: 'Holding Cienfuegos', fechaInicio: '2025-04-01', fechaCierre: '2025-04-30', participantes: 89, respondieron: 76, estado: 'Terminada' },
];

const estadoStyle: Record<DNCEstado, string> = {
  Iniciada: 'bg-primary/10 text-primary border-primary/30',
  Terminada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Borrador: 'bg-amber-50 text-amber-700 border-amber-200',
  Creada: 'bg-blue-50 text-blue-700 border-blue-200',
};

const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('es-CL') : '—';

interface Props {
  onNew: () => void;
  onOpenOnboarding: () => void;
  onOpenTracking?: (id: string) => void;
}

const DNCDashboard: React.FC<Props> = ({ onNew, onOpenOnboarding, onOpenTracking }) => {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'inicio' | 'cierre' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rows = useMemo(() => {
    let r = MOCK_ROWS.filter(x =>
      (estadoFilter === 'all' || x.estado === estadoFilter) &&
      (search === '' || x.nombre.toLowerCase().includes(search.toLowerCase()) || x.empresa.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortBy) {
      r = [...r].sort((a, b) => {
        const av = (sortBy === 'inicio' ? a.fechaInicio : a.fechaCierre) ?? '';
        const bv = (sortBy === 'inicio' ? b.fechaInicio : b.fechaCierre) ?? '';
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return r;
  }, [search, estadoFilter, sortBy, sortDir]);

  const stats = useMemo(() => ({
    total: MOCK_ROWS.length,
    activas: MOCK_ROWS.filter(r => r.estado === 'Iniciada').length,
    borradores: MOCK_ROWS.filter(r => r.estado === 'Borrador').length,
    finalizadas: MOCK_ROWS.filter(r => r.estado === 'Terminada').length,
  }), []);

  const toggleSort = (key: 'inicio' | 'cierre') => {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortDir('asc'); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Detecciones de Necesidades de Capacitación</h1>
          <p className="text-sm text-muted-foreground">¿Por qué usar una DNC?</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary" onClick={onOpenOnboarding}>
            <Info className="w-4 h-4" /> ¿Qué es una DNC?
          </Button>
          <Button className="gap-2" onClick={onNew}>
            <Plus className="w-4 h-4" /> Nueva DNC
          </Button>
        </div>
      </div>

      {/* Beneficios */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Zap, title: 'Ahorra tiempo', desc: 'Proceso autoguiado, sin necesidad de consultor' },
          { icon: BarChart3, title: 'Datos precisos', desc: 'Diagnóstico basado en respuestas reales de tu equipo' },
          { icon: Target, title: 'Foco estratégico', desc: 'Prioriza las capacitaciones de mayor impacto' },
        ].map(b => (
          <Card key={b.title} className="p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <b.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-sm text-foreground">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total DNC', value: stats.total },
          { label: 'Activas', value: stats.activas },
          { label: 'Borradores', value: stats.borradores },
          { label: 'Finalizadas', value: stats.finalizadas },
        ].map(k => (
          <Card key={k.label} className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{k.label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{k.value}</p>
          </Card>
        ))}
      </div>

      {/* Tabla */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Iniciada">Iniciada</SelectItem>
              <SelectItem value="Terminada">Terminada</SelectItem>
              <SelectItem value="Borrador">Borrador</SelectItem>
              <SelectItem value="Creada">Creada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre DNC</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('inicio')}>
                <span className="inline-flex items-center gap-1">Fecha Inicio <ArrowUpDown className="w-3 h-3" /></span>
              </TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('cierre')}>
                <span className="inline-flex items-center gap-1">Fecha Cierre <ArrowUpDown className="w-3 h-3" /></span>
              </TableHead>
              <TableHead className="text-right">Participantes</TableHead>
              <TableHead className="text-right">Respondieron</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">No hay procesos.</TableCell></TableRow>
            ) : rows.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium text-primary">{r.nombre}</TableCell>
                <TableCell className="text-sm">{r.empresa}</TableCell>
                <TableCell className="text-sm">{fmt(r.fechaInicio)}</TableCell>
                <TableCell className="text-sm">{fmt(r.fechaCierre)}</TableCell>
                <TableCell className="text-right text-sm">{r.participantes}</TableCell>
                <TableCell className="text-right text-sm">{r.respondieron}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-medium', estadoStyle[r.estado])}>{r.estado}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onOpenTracking?.(r.id)}><Eye className="w-4 h-4" /></Button>
                    {r.estado === 'Terminada' && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8"><FileText className="w-4 h-4" /></Button>
                      </>
                    )}
                    {r.estado === 'Borrador' && (
                      <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="w-4 h-4" /></Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default DNCDashboard;
