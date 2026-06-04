import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Calendar, PlusCircle, ArrowRight, Info, Search, X, Ban, EyeOff, AlertCircle } from 'lucide-react';

interface CursoLiquidacion {
  sc: string;
  idSence: string;
  oc: string;
  curso: string;
  empresa: string;
  dias: number;
  mtf: string;
  fechaMax: string;
}

const mockCursos: CursoLiquidacion[] = [
  { sc: '2074555', idSence: '6807337', oc: '2099116', curso: 'Normal', empresa: 'SOCIEDAD DE MEDICINA Y REHABILITACION LAS LILAS ...', dias: 40, mtf: '$61.600', fechaMax: '13/07/2026' },
  { sc: '2078017', idSence: '6807412', oc: '2099228', curso: 'Normal', empresa: 'CONSTRUCTORA ANDINA SPA', dias: 22, mtf: '$185.300', fechaMax: '18/07/2026' },
  { sc: '2078959', idSence: '6807589', oc: '2099415', curso: 'Precontrato', empresa: 'TRANSPORTES DEL SUR LIMITADA', dias: 15, mtf: '$92.450', fechaMax: '20/07/2026' },
  { sc: '2078960', idSence: '6807701', oc: '2099517', curso: 'Normal', empresa: 'AGRICOLA VALLE HERMOSO S.A.', dias: 30, mtf: '$310.000', fechaMax: '25/07/2026' },
];


const LiquidacionSence: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('2026-06-02');
  const [fechaFin, setFechaFin] = useState('2026-06-03');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [noComunicar, setNoComunicar] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const MAX_TAGS = 10;

  const addSearchTag = (raw: string) => {
    const parts = raw.split(/[\s,;]+/).map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return;
    setSearchTags(prev => {
      const next = [...prev];
      for (const p of parts) {
        if (next.length >= MAX_TAGS) break;
        if (!next.includes(p)) next.push(p);
      }
      return next;
    });
    setSearchTerm('');
  };

  const removeSearchTag = (tag: string) => {
    setSearchTags(prev => prev.filter(t => t !== tag));
    setAppliedTags(prev => prev.filter(t => t !== tag));
  };

  const ejecutarBusqueda = () => {
    let tags = searchTags;
    if (searchTerm.trim()) {
      const parts = searchTerm.split(/[\s,;]+/).map(p => p.trim()).filter(Boolean);
      const merged = [...tags];
      for (const p of parts) {
        if (merged.length >= MAX_TAGS) break;
        if (!merged.includes(p)) merged.push(p);
      }
      tags = merged;
      setSearchTags(merged);
      setSearchTerm('');
    }
    setAppliedTags(tags);
  };

  const clearSearch = () => {
    setSearchTags([]);
    setAppliedTags([]);
    setSearchTerm('');
  };

  const cursosFiltrados = appliedTags.length > 0
    ? mockCursos.filter(c => appliedTags.some(t => c.idSence.toLowerCase().includes(t.toLowerCase())))
    : mockCursos;

  const toggleNoComunicar = (id: string) => {
    setNoComunicar(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

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

        {/* Search */}
        <div className="flex items-start gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[280px] max-w-xl">
            <div className="flex items-center flex-wrap gap-1 min-h-10 w-full rounded-full border border-border bg-background pl-10 pr-3 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {searchTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5">
                  {tag}
                  <button type="button" onClick={() => removeSearchTag(tag)} className="hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={searchTags.length >= MAX_TAGS ? `Máximo ${MAX_TAGS} ID Sence` : (searchTags.length === 0 ? 'Ingresa ID Sence y presiona espacio para agregar...' : '')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === ' ' || e.key === ',' || e.key === ';') && searchTerm.trim()) {
                    e.preventDefault();
                    addSearchTag(searchTerm);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    ejecutarBusqueda();
                  } else if (e.key === 'Backspace' && !searchTerm && searchTags.length > 0) {
                    removeSearchTag(searchTags[searchTags.length - 1]);
                  }
                }}
                disabled={searchTags.length >= MAX_TAGS}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
              />
            </div>
          </div>
          <Button
            size="sm"
            className="rounded-full gap-1 h-10 px-4"
            onClick={ejecutarBusqueda}
            disabled={searchTags.length === 0 && !searchTerm.trim()}
          >
            <Search className="w-3 h-3" /> Buscar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1 h-10"
            onClick={clearSearch}
            disabled={searchTags.length === 0 && appliedTags.length === 0 && !searchTerm}
          >
            <X className="w-3 h-3" /> Limpiar
          </Button>
        </div>

        {noComunicar.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4" />
            Actualmente existen cursos restringidos para la liquidación
          </div>
        )}

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
                <th className="p-2 text-left font-medium text-muted-foreground w-[9%]">
                  ID Sence <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[9%]">
                  O.C <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[9%]">
                  Curso <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[26%]">
                  Empresa <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[7%]">
                  Días <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">
                  M.T.F <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[11%]">
                  Fecha máx. <span className="text-xs">▾</span>
                </th>
                <th className="p-2 text-left font-medium text-muted-foreground w-[15%]">
                  <span className="inline-flex items-center gap-1">
                    <span>Acciónes</span>
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-1 py-0.5 text-[8px] font-bold leading-none text-white shadow-sm">C1CLIQ5</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cursosFiltrados.map((curso, idx) => {
                const excluido = noComunicar.includes(curso.idSence);
                return (
                  <tr key={curso.idSence} className={`border-b ${excluido ? 'bg-red-50/50 opacity-60' : idx % 2 === 0 ? 'hover:bg-muted/20' : 'bg-muted/10 hover:bg-muted/20'}`}>
                    <td className="p-2 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={selectedRows.includes(curso.idSence)}
                          onCheckedChange={(checked) => handleSelectRow(curso.idSence, !!checked)}
                          disabled={excluido}
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
                    <td className="p-2 text-left">
                      <Button
                        variant={excluido ? 'destructive' : 'outline'}
                        size="sm"
                        className="gap-1 text-xs h-7 px-2"
                        onClick={() => toggleNoComunicar(curso.idSence)}
                      >
                        {excluido ? (
                          <><EyeOff className="w-3 h-3" /> Liberar</>
                        ) : (
                          <><Ban className="w-3 h-3" /> Restringir</>
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiquidacionSence;
