import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  Users, UserPlus, Search, Plus, Trash2, CheckCircle, XCircle, 
  Upload, FileText, BarChart3, Vote, ShieldCheck, RefreshCw,
  Building2, Image, FileCheck, Eye, Download, Play, Square
} from 'lucide-react';

// Mock data
const mockComites = [
  { id: 1, nombre: 'Comité Seguridad 2024', empresa: 'Empresa ABC', estado: 'Abierto', votantes: 45, candidatos: 8, fechaCreacion: '2024-01-15' },
  { id: 2, nombre: 'Comité Bienestar Q1', empresa: 'Empresa XYZ', estado: 'Cerrado', votantes: 32, candidatos: 6, fechaCreacion: '2024-02-20' },
  { id: 3, nombre: 'Comité Capacitación', empresa: 'Empresa DEF', estado: 'Abierto', votantes: 28, candidatos: 5, fechaCreacion: '2024-03-10' },
];

const mockVotantes = [
  { id: 1, rut: '12.345.678-9', nombre: 'Juan Pérez', email: 'juan@empresa.cl', habilitado: true },
  { id: 2, rut: '13.456.789-0', nombre: 'María López', email: 'maria@empresa.cl', habilitado: true },
  { id: 3, rut: '14.567.890-1', nombre: 'Carlos García', email: 'carlos@empresa.cl', habilitado: false },
  { id: 4, rut: '15.678.901-2', nombre: 'Ana Torres', email: 'ana@empresa.cl', habilitado: true },
];

const mockCandidatos = [
  { id: 1, rut: '16.789.012-3', nombre: 'Pedro Soto', cargo: 'Supervisor', habilitado: true, votos: 12 },
  { id: 2, rut: '17.890.123-4', nombre: 'Laura Muñoz', cargo: 'Analista', habilitado: true, votos: 18 },
  { id: 3, rut: '18.901.234-5', nombre: 'Diego Rojas', cargo: 'Coordinador', habilitado: false, votos: 0 },
  { id: 4, rut: '19.012.345-6', nombre: 'Sofía Vargas', cargo: 'Jefa de Área', habilitado: true, votos: 15 },
];

const ComiteBipartito = () => {
  const [activeTab, setActiveTab] = useState('creacion');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCrearComite, setShowCrearComite] = useState(false);
  const [showAgregarVotante, setShowAgregarVotante] = useState(false);
  const [showAgregarCandidato, setShowAgregarCandidato] = useState(false);
  const [rutValidation, setRutValidation] = useState('');

  const handleValidarRut = () => {
    if (rutValidation.length > 0) {
      toast({ title: 'RUT Validado', description: `El RUT ${rutValidation} ha sido validado correctamente.` });
    }
  };

  const handleValidarEmpresa = () => {
    toast({ title: 'Empresa Validada', description: 'La empresa ha sido validada correctamente en el sistema.' });
  };

  const handleCargaMasiva = (tipo: string) => {
    toast({ title: `Carga Masiva de ${tipo}`, description: `Se ha iniciado la carga masiva de ${tipo.toLowerCase()}.` });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Comité Bipartito</h1>
          <p className="text-sm text-muted-foreground">Gestión integral de comités bipartitos de capacitación</p>
        </div>
      </div>

      {/* Tabs por Submódulo */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="creacion" className="text-xs">Creación</TabsTrigger>
          <TabsTrigger value="votantes" className="text-xs">Votantes</TabsTrigger>
          <TabsTrigger value="candidatos" className="text-xs">Candidatos</TabsTrigger>
          <TabsTrigger value="comites" className="text-xs">Comités</TabsTrigger>
          <TabsTrigger value="reportes" className="text-xs">Reportes</TabsTrigger>
          <TabsTrigger value="voto" className="text-xs">Voto</TabsTrigger>
        </TabsList>

        {/* ===== MANTENEDOR DE CREACIÓN ===== */}
        <TabsContent value="creacion" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Mantenedor de Creación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Acciones rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={handleValidarEmpresa}>
                  <CheckCircle className="h-3 w-3 mr-1" /> Validar Empresa
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleCargaMasiva('Candidatos')}>
                  <Upload className="h-3 w-3 mr-1" /> Carga Masiva Candidatos
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleCargaMasiva('Votantes')}>
                  <Upload className="h-3 w-3 mr-1" /> Carga Masiva Votantes
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: 'Foto actualizada' })}>
                  <Image className="h-3 w-3 mr-1" /> Actualizar Foto Candidato
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: 'Votantes validados correctamente' })}>
                  <ShieldCheck className="h-3 w-3 mr-1" /> Validar Votantes
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: 'Candidatos validados correctamente' })}>
                  <ShieldCheck className="h-3 w-3 mr-1" /> Validar Candidatos
                </Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: 'Logo actualizado' })}>
                  <Image className="h-3 w-3 mr-1" /> Actualizar Logo
                </Button>
                <Button size="sm" className="text-xs" onClick={() => setShowCrearComite(true)}>
                  <Plus className="h-3 w-3 mr-1" /> Crear Comité
                </Button>
              </div>

              {/* Validar RUT */}
              <div className="flex items-end gap-2 pt-2 border-t">
                <div className="flex-1 max-w-xs">
                  <Label className="text-xs">Validar RUT</Label>
                  <Input placeholder="Ej: 12.345.678-9" value={rutValidation} onChange={(e) => setRutValidation(e.target.value)} className="h-8 text-xs" />
                </div>
                <Button size="sm" variant="secondary" className="text-xs" onClick={handleValidarRut}>
                  <CheckCircle className="h-3 w-3 mr-1" /> Validar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MANTENEDOR DE VOTANTES ===== */}
        <TabsContent value="votantes" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Mantenedor de Votantes
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input placeholder="Buscar votante..." className="pl-7 h-8 text-xs w-48" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <Button size="sm" className="text-xs" onClick={() => setShowAgregarVotante(true)}>
                    <UserPlus className="h-3 w-3 mr-1" /> Agregar Votante
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">RUT</TableHead>
                      <TableHead className="text-xs">Nombre</TableHead>
                      <TableHead className="text-xs">Email</TableHead>
                      <TableHead className="text-xs">Estado</TableHead>
                      <TableHead className="text-xs text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockVotantes.filter(v => v.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map(votante => (
                      <TableRow key={votante.id}>
                        <TableCell className="text-xs font-mono">{votante.rut}</TableCell>
                        <TableCell className="text-xs">{votante.nombre}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{votante.email}</TableCell>
                        <TableCell>
                          <Badge variant={votante.habilitado ? 'default' : 'destructive'} className="text-[10px]">
                            {votante.habilitado ? 'Habilitado' : 'No Habilitado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toast({ title: `Verificando votante: ${votante.nombre}` })}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => toast({ title: `Votante ${votante.nombre} eliminado` })}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MANTENEDOR DE CANDIDATOS ===== */}
        <TabsContent value="candidatos" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Mantenedor de Candidatos
                </CardTitle>
                <Button size="sm" className="text-xs" onClick={() => setShowAgregarCandidato(true)}>
                  <Plus className="h-3 w-3 mr-1" /> Agregar Candidato
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">RUT</TableHead>
                      <TableHead className="text-xs">Nombre</TableHead>
                      <TableHead className="text-xs">Cargo</TableHead>
                      <TableHead className="text-xs">Estado</TableHead>
                      <TableHead className="text-xs">Votos</TableHead>
                      <TableHead className="text-xs text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCandidatos.map(candidato => (
                      <TableRow key={candidato.id}>
                        <TableCell className="text-xs font-mono">{candidato.rut}</TableCell>
                        <TableCell className="text-xs">{candidato.nombre}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{candidato.cargo}</TableCell>
                        <TableCell>
                          <Badge variant={candidato.habilitado ? 'default' : 'destructive'} className="text-[10px]">
                            {candidato.habilitado ? 'Habilitado' : 'No Habilitado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-semibold">{candidato.votos}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toast({ title: `Verificando candidato: ${candidato.nombre}` })}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => toast({ title: `Candidato ${candidato.nombre} eliminado` })}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MANTENEDOR DE COMITÉS ===== */}
        <TabsContent value="comites" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Mantenedor de Comités
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: 'Validación de votación activa realizada' })}>
                    <CheckCircle className="h-3 w-3 mr-1" /> Validar Votación Activa
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Nombre</TableHead>
                      <TableHead className="text-xs">Empresa</TableHead>
                      <TableHead className="text-xs">Estado</TableHead>
                      <TableHead className="text-xs">Votantes</TableHead>
                      <TableHead className="text-xs">Candidatos</TableHead>
                      <TableHead className="text-xs">Fecha Creación</TableHead>
                      <TableHead className="text-xs text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockComites.map(comite => (
                      <TableRow key={comite.id}>
                        <TableCell className="text-xs font-medium">{comite.nombre}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{comite.empresa}</TableCell>
                        <TableCell>
                          <Badge variant={comite.estado === 'Abierto' ? 'default' : 'secondary'} className="text-[10px]">
                            {comite.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{comite.votantes}</TableCell>
                        <TableCell className="text-xs">{comite.candidatos}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{comite.fechaCreacion}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Obtener datos" onClick={() => toast({ title: `Datos del comité: ${comite.nombre}` })}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            {comite.estado === 'Abierto' ? (
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-amber-600" title="Cerrar comité" onClick={() => toast({ title: `Comité ${comite.nombre} cerrado` })}>
                                <Square className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-emerald-600" title="Abrir comité" onClick={() => toast({ title: `Comité ${comite.nombre} abierto` })}>
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600" title="Reiniciar comité" onClick={() => toast({ title: `Comité ${comite.nombre} reiniciado` })}>
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MANTENEDOR DE REPORTES ===== */}
        <TabsContent value="reportes" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Mantenedor de Reportes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20" onClick={() => toast({ title: 'Generando resumen del comité...' })}>
                  <CardContent className="p-4 text-center space-y-2">
                    <FileCheck className="h-8 w-8 mx-auto text-primary" />
                    <p className="text-sm font-medium">Obtener Resumen Comité</p>
                    <p className="text-xs text-muted-foreground">Resumen general del estado del comité seleccionado</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20" onClick={() => toast({ title: 'Generando informe de votos por candidato...' })}>
                  <CardContent className="p-4 text-center space-y-2">
                    <BarChart3 className="h-8 w-8 mx-auto text-blue-600" />
                    <p className="text-sm font-medium">Informe Votos por Candidato</p>
                    <p className="text-xs text-muted-foreground">Detalle de votación recibida por cada candidato</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20" onClick={() => toast({ title: 'Generando informe de votantes...' })}>
                  <CardContent className="p-4 text-center space-y-2">
                    <Users className="h-8 w-8 mx-auto text-amber-600" />
                    <p className="text-sm font-medium">Informe Votantes que Votaron</p>
                    <p className="text-xs text-muted-foreground">Listado de votantes que ya emitieron su voto</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MANTENEDOR VOTO ===== */}
        <TabsContent value="voto" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Vote className="h-4 w-4 text-primary" />
                Mantenedor de Voto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-primary/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Vote className="h-5 w-5 text-primary" />
                      <p className="text-sm font-medium">Registrar Voto</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">RUT Votante</Label>
                      <Input placeholder="Ej: 12.345.678-9" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Candidato</Label>
                      <Select>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Seleccionar candidato" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCandidatos.filter(c => c.habilitado).map(c => (
                            <SelectItem key={c.id} value={c.id.toString()} className="text-xs">{c.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="sm" className="w-full text-xs" onClick={() => toast({ title: 'Voto registrado exitosamente' })}>
                      Registrar Voto
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-medium">Verificar Voto</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">RUT Votante</Label>
                      <Input placeholder="Ej: 12.345.678-9" className="h-8 text-xs" />
                    </div>
                    <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => toast({ title: 'Voto verificado', description: 'El votante ya emitió su voto.' })}>
                      Verificar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-amber-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-amber-600" />
                      <p className="text-sm font-medium">Verificar si es Admin</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">RUT Usuario</Label>
                      <Input placeholder="Ej: 12.345.678-9" className="h-8 text-xs" />
                    </div>
                    <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => toast({ title: 'Verificación completada', description: 'El usuario tiene permisos de administrador.' })}>
                      Verificar Admin
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Crear Comité */}
      <Dialog open={showCrearComite} onOpenChange={setShowCrearComite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Comité</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Nombre del Comité</Label><Input className="h-8 text-xs" placeholder="Nombre del comité" /></div>
            <div><Label className="text-xs">Empresa</Label><Input className="h-8 text-xs" placeholder="Nombre de la empresa" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCrearComite(false)}>Cancelar</Button>
            <Button size="sm" onClick={() => { setShowCrearComite(false); toast({ title: 'Comité creado exitosamente' }); }}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Votante */}
      <Dialog open={showAgregarVotante} onOpenChange={setShowAgregarVotante}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Votante</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">RUT</Label><Input className="h-8 text-xs" placeholder="12.345.678-9" /></div>
            <div><Label className="text-xs">Nombre</Label><Input className="h-8 text-xs" placeholder="Nombre completo" /></div>
            <div><Label className="text-xs">Email</Label><Input className="h-8 text-xs" placeholder="correo@empresa.cl" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAgregarVotante(false)}>Cancelar</Button>
            <Button size="sm" onClick={() => { setShowAgregarVotante(false); toast({ title: 'Votante agregado exitosamente' }); }}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Agregar Candidato */}
      <Dialog open={showAgregarCandidato} onOpenChange={setShowAgregarCandidato}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Candidato</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">RUT</Label><Input className="h-8 text-xs" placeholder="12.345.678-9" /></div>
            <div><Label className="text-xs">Nombre</Label><Input className="h-8 text-xs" placeholder="Nombre completo" /></div>
            <div><Label className="text-xs">Cargo</Label><Input className="h-8 text-xs" placeholder="Cargo en la empresa" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowAgregarCandidato(false)}>Cancelar</Button>
            <Button size="sm" onClick={() => { setShowAgregarCandidato(false); toast({ title: 'Candidato agregado exitosamente' }); }}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComiteBipartito;
