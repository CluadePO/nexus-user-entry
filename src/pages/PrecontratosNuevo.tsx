import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, Download } from 'lucide-react';

interface ParticipantePrecontrato {
  nombre: string;
}

interface PrecontratoDetalle {
  numeroSC: string;
  fechaPrecontrato: string;
  fechaLimite: string;
  nombreRepresentante: string;
  rutRepresentante: string;
  dvRepresentante: string;
  emailRepresentante: string;
  nombreRepresentanteOpcional: string;
  rutRepresentanteOpcional: string;
  dvRepresentanteOpcional: string;
  participantes: ParticipantePrecontrato[];
}

const mockResultados: PrecontratoDetalle[] = [
  {
    numeroSC: '2032050',
    fechaPrecontrato: '17/10/2024',
    fechaLimite: '16/10/2024',
    nombreRepresentante: 'Andrea Jara Ortega',
    rutRepresentante: '16639860',
    dvRepresentante: '4',
    emailRepresentante: '',
    nombreRepresentanteOpcional: '',
    rutRepresentanteOpcional: '',
    dvRepresentanteOpcional: '',
    participantes: [
      { nombre: 'Alejandro Elías Jesús Castillo Rodríguez' },
      { nombre: 'Bryan Tomás Villagra Núñez' },
      { nombre: 'Camila Fernanda Flores Pizarro' },
      { nombre: 'Claudia Alejandra Chacana Cabrera' },
      { nombre: 'Cristian Luis Vergara Tobar' },
    ],
  },
];

const PrecontratosNuevo: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<PrecontratoDetalle | null>(null);

  const handleBuscar = () => {
    const resultado = mockResultados.find((r) => r.numeroSC === busqueda.trim());
    if (resultado) {
      setDetalle(resultado);
    } else {
      setDetalle(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBuscar();
  };

  if (detalle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Volver */}
            <Button variant="outline" size="sm" onClick={() => setDetalle(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver
            </Button>

            {/* Info del precontrato */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30 w-1/3">Número SC{detalle.numeroSC}</td>
                    <td className="p-2">
                      <Input value={detalle.numeroSC} readOnly className="h-8 max-w-xs" />
                    </td>
                    <td className="p-2 text-destructive font-medium text-sm">
                      El precontrado debe ser presentado antes de {detalle.fechaLimite}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Fecha del Precontrato:</td>
                    <td className="p-2" colSpan={2}>
                      <Input value={detalle.fechaPrecontrato} readOnly className="h-8 max-w-xs" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Datos firmante */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-destructive/10 text-destructive font-medium text-sm p-2 border-b">
                Ingrese los datos de quien firmara el documento:
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30 w-1/3">Nombre Representante de la Empresa:</td>
                    <td className="p-2" colSpan={2}>
                      <Input defaultValue={detalle.nombreRepresentante} className="h-8" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Rut Representante de la Empresa:</td>
                    <td className="p-2" colSpan={2}>
                      <div className="flex gap-2 items-center">
                        <Input defaultValue={detalle.rutRepresentante} className="h-8 max-w-[160px]" />
                        <Input defaultValue={detalle.dvRepresentante} className="h-8 w-12" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Email Representante de la Empresa:</td>
                    <td className="p-2" colSpan={2}>
                      <Input defaultValue={detalle.emailRepresentante} className="h-8" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30">Nombre Representante de la Empresa (opcional):</td>
                    <td className="p-2" colSpan={2}>
                      <Input defaultValue={detalle.nombreRepresentanteOpcional} className="h-8" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-muted/30">Rut Representante de la Empresa (opcional):</td>
                    <td className="p-2" colSpan={2}>
                      <div className="flex gap-2 items-center">
                        <Input defaultValue={detalle.rutRepresentanteOpcional} className="h-8 max-w-[160px]" />
                        <Input defaultValue={detalle.dvRepresentanteOpcional} className="h-8 w-12" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Descargar todos */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Descargar todos los contratos en</span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" /> Word
              </Button>
            </div>

            {/* Tabla participantes */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2 text-left font-medium">Nombre del Participante</th>
                    <th className="p-2 text-left font-medium">Link descarga individual</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.participantes.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{p.nombre}</td>
                      <td className="p-2">
                        <button className="text-primary hover:underline text-sm">Descargar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
      </div>
      <p className="text-muted-foreground">Busque un precontrato por Solicitud de Compra para ver su detalle.</p>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-md space-y-1">
              <label className="text-sm font-medium">Solicitud de Compra (SC)</label>
              <Input
                placeholder="Ej: 2032050"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button onClick={handleBuscar}>
              <Search className="w-4 h-4 mr-2" /> Buscar
            </Button>
          </div>
          {busqueda && !detalle && (
            <p className="text-sm text-muted-foreground mt-4">
              Ingrese un número de SC válido. Pruebe con: <span className="font-mono text-foreground">2032050</span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrecontratosNuevo;
