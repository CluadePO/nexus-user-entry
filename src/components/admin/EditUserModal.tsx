import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Search, User, Building2, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SystemUser {
  id: string;
  rut: string;
  email: string;
  nombre: string;
  apellido: string;
  cargo: string | null;
  holding: string | null;
  empresa: string | null;
  celula: string | null;
  jefe_comercial: string | null;
  lider_servicio_edc: string | null;
  analista_comercial: string | null;
  lider_servicio_op: string | null;
  analista_op: string | null;
}

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user: SystemUser | null;
}

// Mock data - same as CreateUserModal
const mockCompanies = [
  { id: '1', name: 'Empresa Alpha', holding: 'Holding A', segmento: 'Cumbre' as const, jefeComercial: 'Juan Pérez', celulaOperacional: 'Célula Norte' },
  { id: '2', name: 'Empresa Beta', holding: 'Holding A', segmento: 'Base' as const, jefeComercial: 'María García', celulaOperacional: 'Célula Sur' },
  { id: '3', name: 'Empresa Gamma', holding: 'Holding B', segmento: 'Valle' as const, jefeComercial: 'Carlos López', celulaOperacional: 'Célula Centro' },
  { id: '4', name: 'Empresa Delta', holding: 'Holding B', segmento: 'Cumbre' as const, jefeComercial: 'Ana Martínez', celulaOperacional: 'Célula Norte' },
  { id: '5', name: 'Empresa Epsilon', holding: 'Holding C', segmento: 'Base' as const, jefeComercial: 'Pedro Sánchez', celulaOperacional: 'Célula Sur' },
];

const mockHoldings = ['Holding A', 'Holding B', 'Holding C'];
const mockProfiles = ['Administrador', 'Usuario Estándar', 'Supervisor', 'Analista'];
const mockUserTypes = ['OTEC', 'OTIC', 'EMPRESA'];
const mockCelulas = ['Célula Norte', 'Célula Sur', 'Célula Centro', 'Célula Oriente', 'Célula Poniente'];
const mockJefesComerciales = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez'];
const mockPersonasAsignables = ['Por asignar', 'No aplica', 'Roberto Silva', 'Carmen Díaz', 'Fernando Rojas', 'Patricia Muñoz', 'Diego Fernández'];

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  user,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // User fields
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [cargo, setCargo] = useState('');

  // Company fields
  const [empresa, setEmpresa] = useState('');
  const [holding, setHolding] = useState('');
  const [selectedHoldings, setSelectedHoldings] = useState<string[]>([]);
  const [assignedCompanies, setAssignedCompanies] = useState<string[]>([]);
  const [holdingSearchQuery, setHoldingSearchQuery] = useState('');
  const [companySearchQuery, setCompanySearchQuery] = useState('');

  // Operational fields
  const [celula, setCelula] = useState('');
  const [jefeComercial, setJefeComercial] = useState('');
  const [analistaComercial, setAnalistaComercial] = useState('');
  const [analistaOp, setAnalistaOp] = useState('');
  const [liderServicioEDC, setLiderServicioEDC] = useState('');
  const [liderServicioOp, setLiderServicioOp] = useState('');
  const [operationalEnabled, setOperationalEnabled] = useState(false);

  // Populate form when user changes
  useEffect(() => {
    if (user && open) {
      setNombres(user.nombre || '');
      setApellidos(user.apellido || '');
      setRut(user.rut || '');
      setEmail(user.email || '');
      setCargo(user.cargo || '');
      setEmpresa(user.empresa || '');

      // Determine user type from data
      const hasOperational = !!(user.celula || user.jefe_comercial || user.analista_comercial || user.analista_op || user.lider_servicio_edc || user.lider_servicio_op);
      
      // Try to detect user type - default to OTIC if has operational data
      if (hasOperational) {
        setUserType('OTIC');
        setOperationalEnabled(true);
      } else {
        setUserType('EMPRESA');
        setOperationalEnabled(false);
      }

      // Holdings
      if (user.holding) {
        const holdings = user.holding.split(', ').filter(Boolean);
        setSelectedHoldings(holdings);
        setHolding(user.holding);
      } else {
        setSelectedHoldings([]);
        setHolding('');
      }

      // Operational
      setCelula(user.celula || '');
      setJefeComercial(user.jefe_comercial || '');
      setAnalistaComercial(user.analista_comercial || '');
      setAnalistaOp(user.analista_op || '');
      setLiderServicioEDC(user.lider_servicio_edc || '');
      setLiderServicioOp(user.lider_servicio_op || '');

      // Assigned companies - try to match by name
      const matchedCompanies = mockCompanies
        .filter(c => user.empresa?.includes(c.name))
        .map(c => c.id);
      setAssignedCompanies(matchedCompanies);
    }
  }, [user, open]);

  const filteredCompanies = selectedHoldings.length > 0
    ? mockCompanies.filter(c => selectedHoldings.includes(c.holding))
    : mockCompanies;

  const searchedCompanies = filteredCompanies.filter(c =>
    c.name.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  const handleSelectAllCompanies = () => {
    const filteredIds = filteredCompanies.map(c => c.id);
    if (filteredIds.every(id => assignedCompanies.includes(id))) {
      setAssignedCompanies(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setAssignedCompanies(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updateData: any = {
        nombre: nombres,
        apellido: apellidos,
        rut,
        email,
        cargo: cargo || null,
        empresa: empresa || null,
        holding: selectedHoldings.length > 0 ? selectedHoldings.join(', ') : (holding || null),
        celula: celula || null,
        jefe_comercial: jefeComercial || null,
        analista_comercial: analistaComercial || null,
        analista_op: analistaOp || null,
        lider_servicio_edc: liderServicioEDC || null,
        lider_servicio_op: liderServicioOp || null,
      };

      const { error } = await supabase
        .from('system_users')
        .update(updateData)
        .eq('id', user!.id);

      if (error) throw error;

      toast({
        title: 'Usuario actualizado',
        description: 'La información del usuario ha sido actualizada exitosamente.',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el usuario. Intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuración de la información de {nombres} {apellidos}
          </DialogTitle>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-muted-foreground">RUT: <span className="font-medium text-foreground">{rut}</span></span>
            <Badge variant="outline" className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              {userType || 'Sin perfil'}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Personal
            </TabsTrigger>
            <TabsTrigger value="empresa" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="operacional" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Asignación Operacional
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[55vh] mt-4">
            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4 mt-0">
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nombres">Nombres *</Label>
                    <Input
                      id="edit-nombres"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-apellidos">Apellidos *</Label>
                    <Input
                      id="edit-apellidos"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-rut">RUT *</Label>
                    <Input
                      id="edit-rut"
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email *</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-userType">Tipo de Usuario</Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger id="edit-userType">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUserTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-profile">Perfil del Usuario</Label>
                    <Select value={userProfile} onValueChange={setUserProfile}>
                      <SelectTrigger id="edit-profile">
                        <SelectValue placeholder="Seleccione un perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProfiles.map(profile => (
                          <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-cargo">Cargo</Label>
                  <Input
                    id="edit-cargo"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Company Tab */}
            <TabsContent value="empresa" className="space-y-4 mt-0">
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-empresa">Empresa a la que pertenece</Label>
                  <Select value={empresa} onValueChange={setEmpresa}>
                    <SelectTrigger id="edit-empresa">
                      <SelectValue placeholder="Seleccione una empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCompanies.map(company => (
                        <SelectItem key={company.id} value={company.name}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Holdings */}
                <div className="space-y-2">
                  <Label>Holdings</Label>
                  <div className="border rounded-md bg-background">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar holding..."
                          value={holdingSearchQuery}
                          onChange={(e) => setHoldingSearchQuery(e.target.value)}
                          className="pl-8 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="p-2 max-h-36 overflow-y-auto">
                      {mockHoldings
                        .filter(h => h.toLowerCase().includes(holdingSearchQuery.toLowerCase()))
                        .map(h => (
                          <div key={h} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`edit-holding-${h}`}
                              checked={selectedHoldings.includes(h)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedHoldings(prev => [...prev, h]);
                                } else {
                                  setSelectedHoldings(prev => prev.filter(x => x !== h));
                                  const companiesFromHolding = mockCompanies
                                    .filter(c => c.holding === h)
                                    .map(c => c.id);
                                  setAssignedCompanies(prev => prev.filter(id => !companiesFromHolding.includes(id)));
                                }
                              }}
                            />
                            <label htmlFor={`edit-holding-${h}`} className="text-sm cursor-pointer flex-1">
                              {h}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                  {selectedHoldings.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedHoldings.map(h => (
                        <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assigned Companies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Empresas Asignadas</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllCompanies}
                      className="text-xs h-7"
                    >
                      Seleccionar Todas
                    </Button>
                  </div>
                  <div className="border rounded-md bg-background">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar empresa..."
                          value={companySearchQuery}
                          onChange={(e) => setCompanySearchQuery(e.target.value)}
                          className="pl-8 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div className="p-2 max-h-36 overflow-y-auto">
                      {searchedCompanies.map(c => (
                        <div key={c.id} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={`edit-company-${c.id}`}
                            checked={assignedCompanies.includes(c.id)}
                            onCheckedChange={() => {
                              setAssignedCompanies(prev =>
                                prev.includes(c.id)
                                  ? prev.filter(id => id !== c.id)
                                  : [...prev, c.id]
                              );
                            }}
                          />
                          <label htmlFor={`edit-company-${c.id}`} className="text-sm cursor-pointer flex-1">
                            {c.name}
                            <span className="text-xs text-muted-foreground ml-2">({c.holding})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {assignedCompanies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assignedCompanies.map(id => {
                        const company = mockCompanies.find(c => c.id === id);
                        return company ? (
                          <Badge key={id} variant="secondary" className="text-xs">{company.name}</Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Operational Assignment Tab */}
            <TabsContent value="operacional" className="space-y-4 mt-0">
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-2 pb-2">
                  <Checkbox
                    id="edit-enableOperational"
                    checked={operationalEnabled}
                    onCheckedChange={(checked) => {
                      setOperationalEnabled(checked === true);
                      if (!checked) {
                        setCelula('');
                        setJefeComercial('');
                        setAnalistaComercial('');
                        setAnalistaOp('');
                        setLiderServicioEDC('');
                        setLiderServicioOp('');
                      }
                    }}
                  />
                  <Label htmlFor="edit-enableOperational" className="text-sm font-medium cursor-pointer">
                    Habilitar Asignación Operacional
                  </Label>
                </div>

                {operationalEnabled ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Célula</Label>
                        <Select value={celula} onValueChange={setCelula}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una célula" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCelulas.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Jefe Comercial</Label>
                        <Select value={jefeComercial} onValueChange={setJefeComercial}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione jefe comercial" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockJefesComerciales.map(j => (
                              <SelectItem key={j} value={j}>{j}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Analista Comercial</Label>
                        <Select value={analistaComercial} onValueChange={setAnalistaComercial}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione analista" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPersonasAsignables.map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Analista Operacional</Label>
                        <Select value={analistaOp} onValueChange={setAnalistaOp}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione analista" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPersonasAsignables.map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Líder Servicio EDC</Label>
                        <Select value={liderServicioEDC} onValueChange={setLiderServicioEDC}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione líder" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPersonasAsignables.map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Líder Servicio Operacional</Label>
                        <Select value={liderServicioOp} onValueChange={setLiderServicioOp}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione líder" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPersonasAsignables.map(p => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    La asignación operacional está deshabilitada. Active la casilla para configurar los campos.
                  </p>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !nombres || !apellidos || !rut || !email}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
