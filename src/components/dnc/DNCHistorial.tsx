import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Eye, Play, FileText, Calendar } from 'lucide-react';

interface DNCHistorialProps {
  onBack: () => void;
  onResumeDraft: () => void;
}

type ProcesoStatus = 'borrador' | 'en_curso' | 'completado' | 'cancelado';

interface Proceso {
  id: string;
  nombre: string;
  fecha: string;
  estado: ProcesoStatus;
  participantes: number;
  avance: number;
}

const statusConfig: Record<ProcesoStatus, { label: string; className: string }> = {
  borrador: { label: 'Borrador', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  en_curso: { label: 'En curso', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  completado: { label: 'Completado', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelado: { label: 'Cancelado', className: 'bg-red-50 text-red-700 border-red-200' },
};

// Mock data
const procesos: Proceso[] = [
  { id: 'DNC-2025-003', nombre: 'DNC Primer Semestre 2025', fecha: '2025-06-15', estado: 'borrador', participantes: 0, avance: 10 },
  { id: 'DNC-2025-002', nombre: 'DNC Área Comercial Q1', fecha: '2025-03-20', estado: 'en_curso', participantes: 45, avance: 65 },
  { id: 'DNC-2024-001', nombre: 'DNC Anual 2024', fecha: '2024-11-10', estado: 'completado', participantes: 120, avance: 100 },
];

const DNCHistorial: React.FC<DNCHistorialProps> = ({ onBack, onResumeDraft }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="text-primary hover:text-primary/80">
              DNC
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Historial de procesos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Historial de procesos DNC</h1>
          <p className="text-sm text-muted-foreground">
            Revisa el estado de tus procesos de diagnóstico y retoma los que quedaron pendientes.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre del proceso</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead>Avance</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procesos.map((proceso) => {
              const status = statusConfig[proceso.estado];
              return (
                <TableRow key={proceso.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{proceso.id}</TableCell>
                  <TableCell className="font-medium">{proceso.nombre}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(proceso.fecha).toLocaleDateString('es-CL')}
                    </span>
                  </TableCell>
                  <TableCell>{proceso.participantes}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${proceso.avance}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{proceso.avance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {proceso.estado === 'borrador' ? (
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={onResumeDraft}>
                        <Play className="w-3.5 h-3.5" />
                        Retomar
                      </Button>
                    ) : proceso.estado === 'completado' ? (
                      <Button size="sm" variant="ghost" className="gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Ver resultados
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        Ver detalle
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default DNCHistorial;
