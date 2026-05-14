import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { ArrowLeft, Search, Send, Download, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  dncName: string;
  onBack: () => void;
}

const TEMPORALIDAD = [
  { mes: 'Ene', valor: 4 }, { mes: 'Feb', valor: 7 }, { mes: 'Mar', valor: 12 },
  { mes: 'Abr', valor: 18 }, { mes: 'May', valor: 9 }, { mes: 'Jun', valor: 13 },
  { mes: 'Jul', valor: 22 }, { mes: 'Ago', valor: 25 }, { mes: 'Sep', valor: 17 },
  { mes: 'Oct', valor: 11 }, { mes: 'Nov', valor: 6 }, { mes: 'Dic', valor: 3 },
];

const MODALIDAD = [
  { name: 'Presencial', value: 35 },
  { name: 'E-learning', value: 28 },
  { name: 'Mixta', value: 20 },
  { name: 'Distancia', value: 17 },
];

const NECESITAS = [
  { label: 'Sí', valor: 68, color: 'hsl(var(--primary))' },
  { label: 'No', valor: 17, color: 'hsl(var(--destructive))' },
  { label: 'No sé', valor: 15, color: 'hsl(var(--warning))' },
];

const PRIORIDAD = [
  { area: 'Habilidades blandas', tematica: 'Comunicación asertiva', votos: 24, pct: 85, pos: 1 },
  { area: 'Liderazgo y Gestión', tematica: 'Liderazgo situacional', votos: 22, pct: 78, pos: 2 },
  { area: 'Tecnología e Innovación', tematica: 'Ciberseguridad básica', votos: 21, pct: 75, pos: 3 },
  { area: 'Habilidades blandas', tematica: 'Trabajo en equipo', votos: 20, pct: 71, pos: 4 },
  { area: 'Tecnología e Innovación', tematica: 'Análisis de datos', votos: 19, pct: 67, pos: 5 },
  { area: 'Liderazgo y Gestión', tematica: 'Gestión de equipos', votos: 18, pct: 65, pos: 6 },
  { area: 'Seguridad y Prevención', tematica: 'Primeros auxilios', votos: 17, pct: 60, pos: 7 },
  { area: 'Ventas y Comercial', tematica: 'Negociación efectiva', votos: 15, pct: 53, pos: 8 },
];

type EstadoP = 'Respondido' | 'Pendiente';
const PARTICIPANTES = [
  { nombre: 'María José Fuentes', cargo: 'Analista', gerencia: 'Operaciones', tipo: 'Colaborador', estado: 'Respondido' as EstadoP, fecha: '06/05/2025' },
  { nombre: 'Carlos Mendoza', cargo: 'Jefe TI', gerencia: 'Operaciones', tipo: 'Jefatura', estado: 'Respondido' as EstadoP, fecha: '06/05/2025' },
  { nombre: 'Ana Pérez', cargo: 'Diseñadora', gerencia: 'Marketing', tipo: 'Colaborador', estado: 'Respondido' as EstadoP, fecha: '07/05/2025' },
  { nombre: 'Pedro González', cargo: 'Vendedor', gerencia: 'Ventas', tipo: 'Colaborador', estado: 'Pendiente' as EstadoP, fecha: '—' },
  { nombre: 'Valentina Soto', cargo: 'Gerente', gerencia: 'Comercial', tipo: 'Jefatura', estado: 'Pendiente' as EstadoP, fecha: '—' },
  { nombre: 'Roberto Jiménez', cargo: 'Supervisor', gerencia: 'Logística', tipo: 'Colaborador', estado: 'Respondido' as EstadoP, fecha: '08/05/2025' },
  { nombre: 'Diego Morales', cargo: 'Coordinador', gerencia: 'Abast.', tipo: 'Colaborador', estado: 'Pendiente' as EstadoP, fecha: '—' },
  { nombre: 'Laura Soto', cargo: 'Contadora', gerencia: 'Finanzas', tipo: 'Colaborador', estado: 'Respondido' as EstadoP, fecha: '08/05/2025' },
];

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(186 69% 33%)', 'hsl(168 43% 75%)', 'hsl(38 92% 60%)'];

const DNCTrackingDashboard: React.FC<Props> = ({ dncName, onBack }) => {
  const [search, setSearch] = useState('');
  const [tipoF, setTipoF] = useState('all');
  const [estadoF, setEstadoF] = useState('all');

  const total = PARTICIPANTES.length + 39;
  const respondieron = PARTICIPANTES.filter(p => p.estado === 'Respondido').length + 24;
  const pendientes = total - respondieron;
  const dias = 3;
  const pct = Math.round((respondieron / total) * 100);

  const colaboradoresT = PARTICIPANTES.filter(p => p.tipo === 'Colaborador').length + 30;
  const colaboradoresR = PARTICIPANTES.filter(p => p.tipo === 'Colaborador' && p.estado === 'Respondido').length + 17;
  const jefaturasT = PARTICIPANTES.filter(p => p.tipo === 'Jefatura').length + 9;
  const jefaturasR = PARTICIPANTES.filter(p => p.tipo === 'Jefatura' && p.estado === 'Respondido').length + 7;

  const rows = useMemo(() => PARTICIPANTES.filter(p =>
    (tipoF === 'all' || p.tipo === tipoF) &&
    (estadoF === 'all' || p.estado === estadoF) &&
    (search === '' || p.nombre.toLowerCase().includes(search.toLowerCase()))
  ), [search, tipoF, estadoF]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <button onClick={onBack} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> DNC / {dncName}
          </button>
          <h1 className="text-2xl font-bold text-foreground">{dncName}</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Iniciada</Badge>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => toast.success('Fechas actualizadas')}>
          Editar fechas
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total participantes', value: total },
          { label: 'Han respondido', value: `${respondieron} (${pct}%)` },
          { label: 'Pendientes', value: pendientes },
          { label: 'Días restantes', value: dias },
        ].map(k => (
          <Card key={k.label} className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{k.label}</p>
            <p className="text-3xl font-bold text-primary mt-2">{k.value}</p>
          </Card>
        ))}
      </div>

      {/* Progress global */}
      <Card className="p-5 space-y-2">
        <Progress value={pct} className="h-3" />
        <p className="text-xs text-muted-foreground">{respondieron} de {total} participantes han respondido · {pct}%</p>
      </Card>

      {/* Avance por tipo + Modalidad */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground">Avance por tipo</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Colaboradores: {colaboradoresR}/{colaboradoresT}</span>
                <span className="font-medium">{Math.round(colaboradoresR / colaboradoresT * 100)}%</span>
              </div>
              <Progress value={colaboradoresR / colaboradoresT * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Jefaturas: {jefaturasR}/{jefaturasT}</span>
                <span className="font-medium">{Math.round(jefaturasR / jefaturasT * 100)}%</span>
              </div>
              <Progress value={jefaturasR / jefaturasT * 100} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground">Modalidad preferida</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MODALIDAD} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {MODALIDAD.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Temporalidad + Necesitas */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground">Temporalidad preferida</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TEMPORALIDAD}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground">¿Necesitas más capacitación?</h3>
          <div className="space-y-3 pt-4">
            {NECESITAS.map(n => (
              <div key={n.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{n.label}: {n.valor}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${n.valor}%`, backgroundColor: n.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Prioridad de temáticas por área */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Prioridad de temáticas por área</h3>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success('Tabla descargada')}>
            <Download className="w-4 h-4" /> Descargar tabla
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Área</TableHead>
              <TableHead>Temática</TableHead>
              <TableHead className="text-right">Votos</TableHead>
              <TableHead className="text-right">% del área</TableHead>
              <TableHead className="text-right">Posición</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PRIORIDAD.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm">{r.area}</TableCell>
                <TableCell className="text-sm font-medium text-primary">🏆 {r.tematica}</TableCell>
                <TableCell className="text-right text-sm">{r.votos}</TableCell>
                <TableCell className="text-right text-sm">{r.pct}%</TableCell>
                <TableCell className="text-right text-sm font-semibold">{r.pos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Estado de participantes */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Estado de participantes</h3>
          <Button size="sm" className="gap-2" onClick={() => toast.success('Reenviadas invitaciones a pendientes')}>
            <Mail className="w-4 h-4" /> Reenviar a todos los pendientes ({pendientes})
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={tipoF} onValueChange={setTipoF}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Colaborador">Colaborador</SelectItem>
              <SelectItem value="Jefatura">Jefatura</SelectItem>
            </SelectContent>
          </Select>
          <Select value={estadoF} onValueChange={setEstadoF}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Respondido">Respondido</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Gerencia</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha respuesta</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">Sin resultados.</TableCell></TableRow>
            ) : rows.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm font-medium text-primary">{p.nombre}</TableCell>
                <TableCell className="text-sm">{p.cargo}</TableCell>
                <TableCell className="text-sm">{p.gerencia}</TableCell>
                <TableCell><Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">{p.tipo}</Badge></TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    p.estado === 'Respondido'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  )}>{p.estado}</Badge>
                </TableCell>
                <TableCell className="text-sm">{p.fecha}</TableCell>
                <TableCell className="text-right">
                  {p.estado === 'Pendiente' && (
                    <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => toast.success(`Invitación reenviada a ${p.nombre}`)}>
                      <Send className="w-3.5 h-3.5" /> Reenviar invitación
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default DNCTrackingDashboard;
