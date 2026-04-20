import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Search, Download, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface CursoPrecontrato {
  numeroSC: string;
  nombreCurso: string;
  fechaInicio: string;
  fechaTermino: string;
  participantes: number;
  estado: 'Pendiente' | 'En Proceso' | 'Firmado';
}

const mockCursos: CursoPrecontrato[] = [
  {
    numeroSC: '2032050',
    nombreCurso: 'Excel Avanzado para Gestión',
    fechaInicio: '20/10/2024',
    fechaTermino: '15/11/2024',
    participantes: 5,
    estado: 'Pendiente',
  },
  {
    numeroSC: '2032051',
    nombreCurso: 'Liderazgo y Gestión de Equipos',
    fechaInicio: '05/11/2024',
    fechaTermino: '20/12/2024',
    participantes: 12,
    estado: 'En Proceso',
  },
  {
    numeroSC: '2032052',
    nombreCurso: 'Prevención de Riesgos Laborales',
    fechaInicio: '01/10/2024',
    fechaTermino: '30/10/2024',
    participantes: 8,
    estado: 'Firmado',
  },
  {
    numeroSC: '2032053',
    nombreCurso: 'Atención al Cliente Premium',
    fechaInicio: '10/11/2024',
    fechaTermino: '05/12/2024',
    participantes: 15,
    estado: 'Pendiente',
  },
];

const PrecontratosNuevo: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<PrecontratoDetalle | null>(null);
  const [tab, setTab] = useState('buscador');

  const handleBuscar = () => {
    const resultado = mockResultados.find((r) => r.numeroSC === busqueda.trim());
    setDetalle(resultado || null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBuscar();
  };

  const estadoBadge = (estado: CursoPrecontrato['estado']) => {
    const styles: Record<CursoPrecontrato['estado'], string> = {
      Pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
      'En Proceso': 'bg-blue-100 text-blue-800 border-blue-200',
      Firmado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[estado]}`}>
        {estado}
      </span>
    );
  };

  // Breadcrumbs
  const Migas = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard" className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Inicio
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <span className="text-muted-foreground">Cursos y Servicios</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Precontratos</BreadcrumbPage>
        </BreadcrumbItem>
        {detalle && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>SC {detalle.numeroSC}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );

  if (detalle) {
    return (
      <div className="space-y-6">
        {Migas}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <Button variant="outline" size="sm" onClick={() => setDetalle(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver
            </Button>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium bg-muted/30 w-1/3">Número SC</td>
                    <td className="p-2">
                      <Input value={detalle.numeroSC} readOnly className="h-8 max-w-xs" />
                    </td>
                    <td className="p-2 text-destructive font-medium text-sm">
                      El precontrato debe ser presentado antes de {detalle.fechaLimite}
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

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">Descargar todos los contratos en</span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" /> Word
              </Button>
            </div>

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
      {Migas}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Precontratos</h1>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="buscador">Buscador</TabsTrigger>
          <TabsTrigger value="cursos">Cursos Precontratos</TabsTrigger>
        </TabsList>

        <TabsContent value="buscador" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Busque un precontrato por Solicitud de Compra para ver su detalle.
          </p>
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
                  Ingrese un número de SC válido. Pruebe con:{' '}
                  <span className="font-mono text-foreground">2032050</span>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursos" className="mt-4">
          <p className="text-muted-foreground mb-4">
            Listado de cursos asociados a precontratos. Seleccione una SC para ver el detalle.
          </p>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="p-3 text-left font-medium">N° SC</th>
                      <th className="p-3 text-left font-medium">Nombre del Curso</th>
                      <th className="p-3 text-left font-medium">Fecha Inicio</th>
                      <th className="p-3 text-left font-medium">Fecha Término</th>
                      <th className="p-3 text-left font-medium">Participantes</th>
                      <th className="p-3 text-left font-medium">Estado</th>
                      <th className="p-3 text-left font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCursos.map((c) => (
                      <tr key={c.numeroSC} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-mono text-foreground">{c.numeroSC}</td>
                        <td className="p-3">{c.nombreCurso}</td>
                        <td className="p-3">{c.fechaInicio}</td>
                        <td className="p-3">{c.fechaTermino}</td>
                        <td className="p-3">{c.participantes}</td>
                        <td className="p-3">{estadoBadge(c.estado)}</td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const r = mockResultados.find((m) => m.numeroSC === c.numeroSC);
                              if (r) {
                                setDetalle(r);
                              } else {
                                setBusqueda(c.numeroSC);
                                setTab('buscador');
                              }
                            }}
                          >
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrecontratosNuevo;
