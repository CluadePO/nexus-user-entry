import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CursoModular {
  moduloRef: string;
  sc: string;
  cliente: string;
  nroPart: number;
  mtFranquicia: string;
  inicioCurso: string;
}

interface ModuloGroup {
  modulo: string;
  cursos: CursoModular[];
}

const precontratosModulares: ModuloGroup[] = [
  {
    modulo: 'MOD-001',
    cursos: [
      { moduloRef: 'MOD-001', sc: '2103919', cliente: 'CORPORACION NACIONAL DEL COBRE', nroPart: 27, mtFranquicia: '$22.680.000', inicioCurso: '26/12/2025' },
      { moduloRef: 'MOD-001', sc: '2103920', cliente: 'MINERA ESCONDIDA LTDA', nroPart: 15, mtFranquicia: '$18.500.000', inicioCurso: '27/12/2025' },
      { moduloRef: 'MOD-001', sc: '2103921', cliente: 'ANGLO AMERICAN SUR', nroPart: 22, mtFranquicia: '$20.100.000', inicioCurso: '28/12/2025' },
    ],
  },
  {
    modulo: 'MOD-002',
    cursos: [
      { moduloRef: 'MOD-002', sc: '2103922', cliente: 'BHP BILLITON CHILE', nroPart: 30, mtFranquicia: '$25.000.000', inicioCurso: '02/01/2026' },
      { moduloRef: 'MOD-002', sc: '2103923', cliente: 'ANTOFAGASTA MINERALS', nroPart: 18, mtFranquicia: '$16.800.000', inicioCurso: '03/01/2026' },
    ],
  },
  {
    modulo: 'MOD-003',
    cursos: [
      { moduloRef: 'MOD-003', sc: '2103924', cliente: 'COLLAHUASI SCM', nroPart: 25, mtFranquicia: '$21.500.000', inicioCurso: '10/01/2026' },
      { moduloRef: '—', sc: '2103925', cliente: 'TECK RESOURCES CHILE', nroPart: 12, mtFranquicia: '$14.000.000', inicioCurso: '15/01/2026' },
    ],
  },
];

const Precontratos: React.FC = () => {
  const [selectedModulares, setSelectedModulares] = useState<string[]>([]);

  const handleSelectModular = (sc: string, checked: boolean) => {
    setSelectedModulares(prev =>
      checked ? [...prev, sc] : prev.filter(s => s !== sc)
    );
  };

  const handleSelectModulo = (modulo: string, checked: boolean) => {
    const grupo = precontratosModulares.find(m => m.modulo === modulo);
    if (!grupo) return;
    const scs = grupo.cursos.map(c => c.sc);
    setSelectedModulares(prev =>
      checked ? [...new Set([...prev, ...scs])] : prev.filter(s => !scs.includes(s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
        <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">C1PPPC11</span>
      </div>
      <p className="text-muted-foreground">Gestión de precontratos modulares</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-xs table-fixed">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="p-2 w-8"></th>
              <th className="p-2 text-left font-medium text-muted-foreground w-[12%]">Módulo</th>
              <th className="p-2 text-left font-medium text-muted-foreground w-[10%]">S.C.</th>
              <th className="p-2 text-left font-medium text-muted-foreground w-[30%]">Cliente</th>
              <th className="p-2 text-center font-medium text-muted-foreground w-[10%]">Nro. Part.</th>
              <th className="p-2 text-left font-medium text-muted-foreground w-[15%]">M.T. Franquicia</th>
              <th className="p-2 text-left font-medium text-muted-foreground w-[15%]">Inicio Curso</th>
            </tr>
          </thead>
          <tbody>
            {precontratosModulares.map((modulo) => (
              <React.Fragment key={modulo.modulo}>
                <tr className="bg-muted/20 border-b">
                  <td className="p-2">
                    <Checkbox
                      checked={modulo.cursos.every(c => selectedModulares.includes(c.sc))}
                      onCheckedChange={(checked) => handleSelectModulo(modulo.modulo, !!checked)}
                    />
                  </td>
                  <td colSpan={6} className="p-2 font-semibold text-primary text-xs">
                    {modulo.modulo} - Seleccionar todos ({modulo.cursos.length} cursos)
                  </td>
                </tr>
                {modulo.cursos.map((curso, idx) => (
                  <tr key={curso.sc} className={`border-b ${idx % 2 === 0 ? '' : 'bg-muted/10'} hover:bg-muted/20`}>
                    <td className="p-2">
                      <Checkbox
                        checked={selectedModulares.includes(curso.sc)}
                        onCheckedChange={(checked) => handleSelectModular(curso.sc, !!checked)}
                      />
                    </td>
                    <td className="p-2 text-muted-foreground">{curso.moduloRef}</td>
                    <td className="p-2 font-medium">{curso.sc}</td>
                    <td className="p-2 text-muted-foreground">{curso.cliente}</td>
                    <td className="p-2 text-center">{curso.nroPart}</td>
                    <td className="p-2">{curso.mtFranquicia}</td>
                    <td className="p-2">{curso.inicioCurso}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Precontratos;
