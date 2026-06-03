import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Calendar, PlusCircle, ArrowRight, Info } from 'lucide-react';

interface CursoLiquidacion {
  idSence: string;
  oc: string;
  curso: string;
  empresa: string;
  dias: number;
  mtf: string;
  fechaMax: string;
}

const mockCursos: CursoLiquidacion[] = [
  {
    idSence: '6807337',
    oc: '2099116',
    curso: 'Normal',
    empresa: 'SOCIEDAD DE MEDICINA Y REHABILITACION LAS LILAS ...',
    dias: 40,
    mtf: '$61.600',
    fechaMax: '13/07/2026',
  },
];

const LiquidacionSence: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('2026-06-02');
  const [fechaFin, setFechaFin] = useState('2026-06-03');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedRows(checked ? mockCursos.map(c => c.idSence) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(s => s !== id));
      setSelectAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        ¿Necesitas generar un archivo o cargar respuesta de liquidación?
      </h1>

      <div className="space-y-6">
        {/* Section 1: Upload */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-muted-foreground">
            Carga una respuesta de liquidación SENCE
          </h2>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 gap-2 rounded-full px-6">
            <PlusCircle className="w-4 h-4" />
            Cargar liquidación
          </Button>
        </div>

        {/* Section 2: Generate file */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-muted-foreground">
            O continua generando un archivo de liquidación SENCE
          </h2>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="pl-10 w-[180px] rounded-full border-border"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="pl-10 w-[180px] rounded-full border-border"
              />
            </div>
            <Button variant="secondary" className="gap-2 rounded-full px-6 bg-muted text-muted-foreground">
              Generar Archivo <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            Las fechas corresponden al periodo efectivo de pago.
          </div>
        </div>

        {/* Results badge */}
        <div>
          <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-sm font-medium">
            {mockCursos.length} cursos cargados
          </Badge>
        </div>

        {/* Info alert */}
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          La fecha límite de liquidación aplica únicamente hasta el día hábil anterior a un feriado o festivo
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-xs table-fixed">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-2 w-[40px] text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                    />
                  </div>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                  ID Sence <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                  O.C <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                  Curso <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[30%]">
                  Empresa <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[8%]">
                  Días <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[12%]">
                  M.T.F <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[12%]">
                  Fecha máx. <span className="text-xs">▾</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockCursos.map((curso, idx) => (
                <tr key={curso.idSence} className={`border-b ${idx % 2 === 0 ? 'hover:bg-muted/20' : 'bg-muted/10 hover:bg-muted/20'}`}>
                  <td className="p-2 text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={selectedRows.includes(curso.idSence)}
                        onCheckedChange={(checked) => handleSelectRow(curso.idSence, !!checked)}
                      />
                    </div>
                  </td>
                  <td className="p-2 font-medium">{curso.idSence}</td>
                  <td className="p-2">{curso.oc}</td>
                  <td className="p-2">{curso.curso}</td>
                  <td className="p-2 text-muted-foreground truncate">{curso.empresa}</td>
                  <td className="p-2">{curso.dias}</td>
                  <td className="p-2">{curso.mtf}</td>
                  <td className="p-2">{curso.fechaMax}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LiquidacionSence;
