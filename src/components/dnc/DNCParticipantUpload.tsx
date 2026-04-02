import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, Download, FileSpreadsheet, Eye, Trash2, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

export interface Participante {
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  cargo: string;
  nivelCargo: string;
  area: string;
  unidad: string;
  rutJefatura: string;
}

const TEMPLATE_COLUMNS = [
  'Rut',
  'Nombre',
  'Apellido Paterno',
  'Apellido Materno',
  'E-mail',
  'Cargo',
  'Nivel de Cargo',
  'Área',
  'Unidad',
  'Rut Jefatura Evaluadora',
];

const EXAMPLE_DATA = [
  ['12.345.678-9', 'Juan', 'Pérez', 'González', 'juan.perez@empresa.cl', 'Analista', 'Profesional', 'Finanzas', 'Contabilidad', '11.222.333-4'],
  ['13.456.789-0', 'María', 'López', 'Soto', 'maria.lopez@empresa.cl', 'Coordinadora', 'Supervisión', 'RRHH', 'Desarrollo Organizacional', '11.222.333-4'],
  ['14.567.890-1', 'Carlos', 'Muñoz', 'Díaz', 'carlos.munoz@empresa.cl', 'Ejecutivo', 'Operativo', 'Comercial', 'Ventas Zona Norte', '15.678.901-2'],
];

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS]);
  ws['!cols'] = TEMPLATE_COLUMNS.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, 'Participantes');
  XLSX.writeFile(wb, 'Plantilla_Participantes_DNC.xlsx');
}

function downloadExample() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS, ...EXAMPLE_DATA]);
  ws['!cols'] = TEMPLATE_COLUMNS.map(() => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, ws, 'Ejemplo');
  XLSX.writeFile(wb, 'Ejemplo_Carga_Participantes_DNC.xlsx');
}

function parseRow(row: any): Participante | null {
  const rut = String(row['Rut'] ?? row['rut'] ?? '').trim();
  if (!rut) return null;
  return {
    rut,
    nombre: String(row['Nombre'] ?? row['nombre'] ?? '').trim(),
    apellidoPaterno: String(row['Apellido Paterno'] ?? row['apellido paterno'] ?? '').trim(),
    apellidoMaterno: String(row['Apellido Materno'] ?? row['apellido materno'] ?? '').trim(),
    email: String(row['E-mail'] ?? row['e-mail'] ?? row['Email'] ?? row['email'] ?? '').trim(),
    cargo: String(row['Cargo'] ?? row['cargo'] ?? '').trim(),
    nivelCargo: String(row['Nivel de Cargo'] ?? row['nivel de cargo'] ?? '').trim(),
    area: String(row['Área'] ?? row['área'] ?? row['Area'] ?? row['area'] ?? '').trim(),
    unidad: String(row['Unidad'] ?? row['unidad'] ?? '').trim(),
    rutJefatura: String(row['Rut Jefatura Evaluadora'] ?? row['rut jefatura evaluadora'] ?? '').trim(),
  };
}

interface DNCParticipantUploadProps {
  participants: Participante[];
  onParticipantsChange: (p: Participante[]) => void;
  disabled?: boolean;
}

const DNCParticipantUpload: React.FC<DNCParticipantUploadProps> = ({
  participants,
  onParticipantsChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Formato no soportado. Por favor sube un archivo Excel (.xlsx, .xls) o CSV.');
      return;
    }

    setUploading(true);
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws);

      if (rows.length === 0) {
        toast.error('El archivo no contiene datos. Verifica que la plantilla tenga registros.');
        setUploading(false);
        return;
      }

      const parsed = rows.map(parseRow).filter(Boolean) as Participante[];

      if (parsed.length === 0) {
        toast.error('No se encontraron registros válidos. Verifica que las columnas coincidan con la plantilla.');
        setUploading(false);
        return;
      }

      onParticipantsChange(parsed);
      setFileName(file.name);
      toast.success(`${parsed.length} participantes cargados correctamente`);
    } catch {
      toast.error('Error al leer el archivo. Verifica que sea un Excel válido.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onParticipantsChange([]);
    setFileName(null);
    toast.info('Participantes eliminados');
  };

  return (
    <div className="space-y-4">
      {/* Action links */}
      <div className="flex items-center justify-between">
        <Button variant="link" className="gap-2 text-primary p-0 h-auto" onClick={downloadTemplate}>
          <Download className="w-4 h-4" />
          Descargar plantilla base
        </Button>
        <Button variant="link" className="gap-2 text-primary p-0 h-auto" onClick={() => setShowExample(true)}>
          <FileSpreadsheet className="w-4 h-4" />
          Ejemplo de carga
        </Button>
      </div>

      {/* Upload area */}
      {participants.length === 0 ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            disabled
              ? "opacity-50 pointer-events-none border-border"
              : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">
            {uploading ? 'Procesando archivo...' : 'Haz clic o arrastra tu archivo Excel aquí'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Formatos aceptados: .xlsx, .xls, .csv
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Upload summary */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-emerald-50/50 border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {participants.length} participantes cargados
                </p>
                {fileName && (
                  <p className="text-xs text-muted-foreground">Archivo: {fileName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowPreview(true)}>
                <Eye className="w-3.5 h-3.5" />
                Ver datos
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-3.5 h-3.5" />
                Reemplazar
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5 text-destructive hover:text-destructive" onClick={handleClear}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Participantes cargados ({participants.length})</DialogTitle>
            <DialogDescription>Vista previa de los datos importados desde el archivo Excel.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">#</TableHead>
                  <TableHead className="text-xs">Rut</TableHead>
                  <TableHead className="text-xs">Nombre</TableHead>
                  <TableHead className="text-xs">Ap. Paterno</TableHead>
                  <TableHead className="text-xs">Ap. Materno</TableHead>
                  <TableHead className="text-xs">E-mail</TableHead>
                  <TableHead className="text-xs">Cargo</TableHead>
                  <TableHead className="text-xs">Nivel</TableHead>
                  <TableHead className="text-xs">Área</TableHead>
                  <TableHead className="text-xs">Unidad</TableHead>
                  <TableHead className="text-xs">Rut Jefatura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="text-xs font-mono">{p.rut}</TableCell>
                    <TableCell className="text-xs">{p.nombre}</TableCell>
                    <TableCell className="text-xs">{p.apellidoPaterno}</TableCell>
                    <TableCell className="text-xs">{p.apellidoMaterno}</TableCell>
                    <TableCell className="text-xs">{p.email}</TableCell>
                    <TableCell className="text-xs">{p.cargo}</TableCell>
                    <TableCell className="text-xs">{p.nivelCargo}</TableCell>
                    <TableCell className="text-xs">{p.area}</TableCell>
                    <TableCell className="text-xs">{p.unidad}</TableCell>
                    <TableCell className="text-xs font-mono">{p.rutJefatura}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DNCParticipantUpload;
