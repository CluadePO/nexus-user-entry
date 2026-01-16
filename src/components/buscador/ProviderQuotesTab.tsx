import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  FileText,
  Clock,
  User,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const regiones = [
  'Metropolitana',
  'Valparaíso',
  'Biobío',
  'Araucanía',
  "O'Higgins",
  'Maule',
  'Los Lagos',
  'Antofagasta',
  'Coquimbo',
  'Atacama',
  'Tarapacá',
  'Arica y Parinacota',
  'Los Ríos',
  'Aysén',
  'Magallanes',
  'Ñuble',
];

const comunasPorRegion: Record<string, string[]> = {
  'Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Vitacura', 'La Florida', 'Maipú', 'Puente Alto'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
  'Biobío': ['Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz', 'Coronel'],
  'Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón'],
  "O'Higgins": ['Rancagua', 'San Fernando', 'Rengo', 'Machalí'],
  'Maule': ['Talca', 'Curicó', 'Linares', 'Constitución'],
  'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Ancud'],
  'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel'],
  'Atacama': ['Copiapó', 'Vallenar', 'Chañaral', 'Diego de Almagro'],
  'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
  'Arica y Parinacota': ['Arica', 'Putre', 'Camarones'],
  'Los Ríos': ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli'],
  'Aysén': ['Coyhaique', 'Puerto Aysén', 'Chile Chico'],
  'Magallanes': ['Punta Arenas', 'Puerto Natales', 'Porvenir'],
  'Ñuble': ['Chillán', 'San Carlos', 'Bulnes', 'Yungay'],
};

interface ProviderData {
  nombre: string;
  sitioWeb: string;
  correo: string;
  confirmarCorreo: string;
  direccion: string;
  telefono: string;
  region: string;
  comuna: string;
}

interface QuoteRequest {
  id: string;
  courseName: string;
  courseCode: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  participants: number;
  requestDate: string;
  status: 'pending' | 'answered' | 'rejected';
  message: string;
}

const mockQuotes: QuoteRequest[] = [
  {
    id: 'Q001',
    courseName: 'Excel Avanzado para Análisis de Datos',
    courseCode: 'SENCE-2024-001',
    clientName: 'María González',
    clientEmail: 'maria.gonzalez@empresa.cl',
    companyName: 'Empresa ABC Ltda.',
    participants: 15,
    requestDate: '2026-01-15',
    status: 'pending',
    message: 'Necesitamos capacitar a nuestro equipo de finanzas en análisis de datos con Excel. ¿Tienen disponibilidad para marzo?'
  },
  {
    id: 'Q002',
    courseName: 'Liderazgo y Gestión de Equipos',
    courseCode: 'SENCE-2024-002',
    clientName: 'Carlos Pérez',
    clientEmail: 'carlos.perez@corporacion.cl',
    companyName: 'Corporación XYZ S.A.',
    participants: 8,
    requestDate: '2026-01-14',
    status: 'answered',
    message: 'Queremos desarrollar habilidades de liderazgo en nuestros supervisores.'
  },
  {
    id: 'Q003',
    courseName: 'Seguridad Industrial y Prevención de Riesgos',
    courseCode: 'SENCE-2024-003',
    clientName: 'Ana Martínez',
    clientEmail: 'ana.martinez@minera.cl',
    companyName: 'Minera del Norte SpA',
    participants: 25,
    requestDate: '2026-01-13',
    status: 'pending',
    message: 'Requerimos certificar a todo el personal operativo en seguridad industrial.'
  },
  {
    id: 'Q004',
    courseName: 'Marketing Digital y Redes Sociales',
    courseCode: 'NO-SENCE-001',
    clientName: 'Roberto Silva',
    clientEmail: 'roberto.silva@agencia.cl',
    companyName: 'Agencia Creativa Ltda.',
    participants: 5,
    requestDate: '2026-01-12',
    status: 'rejected',
    message: 'Buscamos capacitar a nuestro equipo de marketing en estrategias digitales.'
  },
  {
    id: 'Q005',
    courseName: 'Inglés Técnico para Profesionales',
    courseCode: 'SENCE-2024-004',
    clientName: 'Patricia Rojas',
    clientEmail: 'patricia.rojas@tech.cl',
    companyName: 'Tech Solutions Chile',
    participants: 12,
    requestDate: '2026-01-10',
    status: 'answered',
    message: 'Necesitamos mejorar el inglés técnico de nuestros desarrolladores para comunicación con clientes internacionales.'
  },
];

const ProviderQuotesTab: React.FC = () => {
  const [providerData, setProviderData] = useState<ProviderData>({
    nombre: 'Instituto de Capacitación Profesional',
    sitioWeb: 'www.icpchile.cl',
    correo: 'contacto@icpchile.cl',
    confirmarCorreo: 'contacto@icpchile.cl',
    direccion: 'Av. Providencia 1234, Oficina 501',
    telefono: '+56 2 2345 6789',
    region: 'Metropolitana',
    comuna: 'Providencia',
  });

  const [quotes] = useState<QuoteRequest[]>(mockQuotes);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const handleInputChange = (field: keyof ProviderData, value: string) => {
    setProviderData(prev => ({ ...prev, [field]: value }));
    
    // Reset comuna when region changes
    if (field === 'region') {
      setProviderData(prev => ({ ...prev, comuna: '' }));
    }
  };

  const handleSaveContactInfo = () => {
    if (providerData.correo !== providerData.confirmarCorreo) {
      toast.error('Los correos electrónicos no coinciden');
      return;
    }
    
    toast.success('Datos de contacto actualizados correctamente');
  };

  const getStatusBadge = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Pendiente</Badge>;
      case 'answered':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Respondida</Badge>;
      case 'rejected':
        return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">Rechazada</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const pendingCount = quotes.filter(q => q.status === 'pending').length;
  const answeredCount = quotes.filter(q => q.status === 'answered').length;
  const rejectedCount = quotes.filter(q => q.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Provider Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Datos de Contacto del Proveedor
          </CardTitle>
          <CardDescription>
            Actualiza la información de contacto que verán los clientes al solicitar cotizaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre del Proveedor */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Nombre del Proveedor
              </Label>
              <Input
                id="nombre"
                value={providerData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>

            {/* Sitio Web */}
            <div className="space-y-2">
              <Label htmlFor="sitioWeb" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Sitio Web
              </Label>
              <Input
                id="sitioWeb"
                value={providerData.sitioWeb}
                onChange={(e) => handleInputChange('sitioWeb', e.target.value)}
                placeholder="www.ejemplo.cl"
              />
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="correo" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Correo Electrónico
              </Label>
              <Input
                id="correo"
                type="email"
                value={providerData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                placeholder="contacto@ejemplo.cl"
              />
            </div>

            {/* Confirmar Correo */}
            <div className="space-y-2">
              <Label htmlFor="confirmarCorreo" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Confirmar Correo Electrónico
              </Label>
              <Input
                id="confirmarCorreo"
                type="email"
                value={providerData.confirmarCorreo}
                onChange={(e) => handleInputChange('confirmarCorreo', e.target.value)}
                placeholder="contacto@ejemplo.cl"
                className={providerData.correo !== providerData.confirmarCorreo && providerData.confirmarCorreo ? 'border-rose-500' : ''}
              />
              {providerData.correo !== providerData.confirmarCorreo && providerData.confirmarCorreo && (
                <p className="text-xs text-rose-500">Los correos electrónicos no coinciden</p>
              )}
            </div>

            {/* Dirección */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Dirección Principal
              </Label>
              <Input
                id="direccion"
                value={providerData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Av. Principal 123, Oficina 456"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={providerData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </div>

            {/* Región */}
            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Región
              </Label>
              <Select
                value={providerData.region}
                onValueChange={(value) => handleInputChange('region', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una región" />
                </SelectTrigger>
                <SelectContent>
                  {regiones.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comuna */}
            <div className="space-y-2 md:col-span-2 md:w-1/2">
              <Label htmlFor="comuna" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Comuna
              </Label>
              <Select
                value={providerData.comuna}
                onValueChange={(value) => handleInputChange('comuna', value)}
                disabled={!providerData.region}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una comuna" />
                </SelectTrigger>
                <SelectContent>
                  {(comunasPorRegion[providerData.region] || []).map((comuna) => (
                    <SelectItem key={comuna} value={comuna}>
                      {comuna}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button onClick={handleSaveContactInfo} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quote Requests Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Cotizaciones Recibidas
              </CardTitle>
              <CardDescription>
                Gestiona las solicitudes de cotización enviadas por clientes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Pendientes: {pendingCount}
              </Badge>
              <Badge variant="outline" className="gap-1 text-emerald-600">
                <CheckCircle className="h-3 w-3" />
                Respondidas: {answeredCount}
              </Badge>
              <Badge variant="outline" className="gap-1 text-rose-600">
                <XCircle className="h-3 w-3" />
                Rechazadas: {rejectedCount}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead className="text-center">Participantes</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{quote.courseName}</p>
                        <p className="text-xs text-muted-foreground">{quote.courseCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{quote.clientName}</p>
                          <p className="text-xs text-muted-foreground">{quote.clientEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{quote.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{quote.participants}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(quote.requestDate)}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(quote.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedQuote(quote)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Detalle de Cotización</DialogTitle>
                              <DialogDescription>
                                Solicitud #{quote.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Curso</p>
                                  <p className="font-medium">{quote.courseName}</p>
                                  <p className="text-sm text-muted-foreground">{quote.courseCode}</p>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Cliente</p>
                                    <p className="text-sm font-medium">{quote.clientName}</p>
                                    <p className="text-xs text-muted-foreground">{quote.clientEmail}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Empresa</p>
                                    <p className="text-sm font-medium">{quote.companyName}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Participantes</p>
                                    <p className="text-sm font-medium">{quote.participants}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Fecha de solicitud</p>
                                    <p className="text-sm font-medium">{formatDate(quote.requestDate)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  Mensaje del cliente
                                </p>
                                <div className="p-3 bg-muted/30 rounded-lg border">
                                  <p className="text-sm">{quote.message}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div>{getStatusBadge(quote.status)}</div>
                                {quote.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-700">
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Rechazar
                                    </Button>
                                    <Button size="sm" className="bg-primary">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Responder
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderQuotesTab;
