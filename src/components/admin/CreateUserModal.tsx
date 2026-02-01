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
import { Check, ChevronLeft, ChevronRight, Building2, User, FileCheck, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CompanyData {
  id: string;
  name: string;
  holding: string;
  segmento: 'Valle' | 'Base' | 'Cumbre';
  jefeComercial: string;
  celulaOperacional: string;
}

// Mock data - en producción vendría de la base de datos
const mockCompanies: CompanyData[] = [
  { id: '1', name: 'Empresa Alpha', holding: 'Holding A', segmento: 'Cumbre', jefeComercial: 'Juan Pérez', celulaOperacional: 'Célula Norte' },
  { id: '2', name: 'Empresa Beta', holding: 'Holding A', segmento: 'Base', jefeComercial: 'María García', celulaOperacional: 'Célula Sur' },
  { id: '3', name: 'Empresa Gamma', holding: 'Holding B', segmento: 'Valle', jefeComercial: 'Carlos López', celulaOperacional: 'Célula Centro' },
  { id: '4', name: 'Empresa Delta', holding: 'Holding B', segmento: 'Cumbre', jefeComercial: 'Ana Martínez', celulaOperacional: 'Célula Norte' },
  { id: '5', name: 'Empresa Epsilon', holding: 'Holding C', segmento: 'Base', jefeComercial: 'Pedro Sánchez', celulaOperacional: 'Célula Sur' },
];

const mockHoldings = ['Holding A', 'Holding B', 'Holding C'];
const mockProfiles = ['Administrador', 'Usuario Estándar', 'Supervisor', 'Analista'];
const mockUserTypes = ['OTEC', 'OTIC', 'EMPRESA'];

// Mock data for OTIC specific fields
const mockCelulas = ['Célula Norte', 'Célula Sur', 'Célula Centro', 'Célula Oriente', 'Célula Poniente'];
const mockJefesComerciales = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez'];
const mockPersonasAsignables = ['Por asignar', 'No aplica', 'Roberto Silva', 'Carmen Díaz', 'Fernando Rojas', 'Patricia Muñoz', 'Diego Fernández'];

const steps = [
  { id: 1, title: 'Usuario', icon: User },
  { id: 2, title: 'Empresa', icon: Building2 },
  { id: 3, title: 'Confirmar', icon: FileCheck },
];

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Step 1: User Information
  const [userProfile, setUserProfile] = useState<string>('');
  const [rut, setRut] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<string>('');
  const [cargo, setCargo] = useState('');

  // Step 2: Company Selection (for OTEC/EMPRESA)
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedHolding, setSelectedHolding] = useState<string>('');
  const [assignedCompanies, setAssignedCompanies] = useState<string[]>([]);
  const [autoFilledData, setAutoFilledData] = useState({
    segmento: '',
    jefeComercial: '',
    celulaOperacional: '',
  });

  // Step 2: OTIC specific fields
  const [oticEmpresa, setOticEmpresa] = useState<string>('');
  const [oticCelula, setOticCelula] = useState<string>('');
  const [oticJefeComercial, setOticJefeComercial] = useState<string>('');
  const [oticAnalistaComercial, setOticAnalistaComercial] = useState<string>('');
  const [oticAnalistaOperacional, setOticAnalistaOperacional] = useState<string>('');
  const [oticLiderServicioEDC, setOticLiderServicioEDC] = useState<string>('');
  const [oticLiderServicioOperacional, setOticLiderServicioOperacional] = useState<string>('');

  // OTIC Holding and assigned companies
  const [oticSelectedHoldings, setOticSelectedHoldings] = useState<string[]>([]);
  const [oticAssignedCompanies, setOticAssignedCompanies] = useState<string[]>([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [holdingSearchQuery, setHoldingSearchQuery] = useState('');
  const [oticCompanySearchQuery, setOticCompanySearchQuery] = useState('');
  
  // Search queries for OTEC/EMPRESA
  const [otecHoldingSearchQuery, setOtecHoldingSearchQuery] = useState('');
  const [otecCompanySearchQuery, setOtecCompanySearchQuery] = useState('');
  
  // Checkbox to enable OTIC role fields
  const [oticRoleFieldsEnabled, setOticRoleFieldsEnabled] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setSelectedCompany('');
      setSelectedHolding('');
      setAssignedCompanies([]);
      setAutoFilledData({ segmento: '', jefeComercial: '', celulaOperacional: '' });
      setUserProfile('');
      setRut('');
      setNombres('');
      setApellidos('');
      setEmail('');
      setUserType('');
      setCargo('');
      // Reset OTIC fields
      setOticEmpresa('');
      setOticCelula('');
      setOticJefeComercial('');
      setOticAnalistaComercial('');
      setOticAnalistaOperacional('');
      setOticLiderServicioEDC('');
      setOticLiderServicioOperacional('');
      setOticSelectedHoldings([]);
      setOticAssignedCompanies([]);
      setCompanySearchQuery('');
      setHoldingSearchQuery('');
      setOticCompanySearchQuery('');
      setOtecHoldingSearchQuery('');
      setOtecCompanySearchQuery('');
      setOticRoleFieldsEnabled(false);
    }
  }, [open]);

  // Auto-fill data when company is selected
  useEffect(() => {
    if (selectedCompany) {
      const company = mockCompanies.find((c) => c.id === selectedCompany);
      if (company) {
        setAutoFilledData({
          segmento: company.segmento,
          jefeComercial: company.jefeComercial,
          celulaOperacional: company.celulaOperacional,
        });
      }
    } else {
      setAutoFilledData({ segmento: '', jefeComercial: '', celulaOperacional: '' });
    }
  }, [selectedCompany]);

  const handleSelectAllCompanies = () => {
    if (assignedCompanies.length === mockCompanies.length) {
      setAssignedCompanies([]);
    } else {
      setAssignedCompanies(mockCompanies.map((c) => c.id));
    }
  };

  const toggleCompanyAssignment = (companyId: string) => {
    setAssignedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  // OTIC companies filtered by selected holdings
  const oticFilteredCompanies = oticSelectedHoldings.length > 0
    ? mockCompanies.filter((c) => oticSelectedHoldings.includes(c.holding))
    : mockCompanies;

  // Search filter for companies
  const searchedCompanies = oticFilteredCompanies.filter((c) =>
    c.name.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  const handleOticSelectAllCompanies = () => {
    const filteredIds = oticFilteredCompanies.map((c) => c.id);
    if (filteredIds.every((id) => oticAssignedCompanies.includes(id))) {
      setOticAssignedCompanies((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setOticAssignedCompanies((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const toggleOticCompanyAssignment = (companyId: string) => {
    setOticAssignedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleAddCompanyFromSearch = (companyId: string) => {
    if (!oticAssignedCompanies.includes(companyId)) {
      setOticAssignedCompanies((prev) => [...prev, companyId]);
    }
    setCompanySearchQuery('');
  };

  const getOticAssignedCompanyNames = () => {
    return oticAssignedCompanies
      .map((id) => mockCompanies.find((c) => c.id === id)?.name)
      .filter(Boolean);
  };

  const isStep1Valid = nombres && apellidos && rut && email && userType && userProfile && (userType !== 'OTIC' || cargo);
  
  // Step 2 validation depends on user type
  // If role fields are enabled, they must be filled; if disabled, only empresa is required
  const isStep2ValidOTIC = oticEmpresa && (!oticRoleFieldsEnabled || (oticCelula && oticJefeComercial && oticAnalistaComercial && oticAnalistaOperacional && oticLiderServicioEDC && oticLiderServicioOperacional));
  const isStep2ValidOther = selectedHolding && assignedCompanies.length > 0 && selectedCompany;
  const isStep2Valid = userType === 'OTIC' ? isStep2ValidOTIC : isStep2ValidOther;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedCompanyData = mockCompanies.find((c) => c.id === selectedCompany);
      
      const insertData: any = {
        rut,
        email,
        nombre: nombres,
        apellido: apellidos,
        cargo: cargo || null,
      };

      if (userType === 'OTIC') {
        insertData.empresa = oticEmpresa || null;
        insertData.celula = oticCelula || null;
        insertData.jefe_comercial = oticJefeComercial || null;
        insertData.analista_comercial = oticAnalistaComercial || null;
        insertData.analista_op = oticAnalistaOperacional || null;
        insertData.lider_servicio_edc = oticLiderServicioEDC || null;
        insertData.lider_servicio_op = oticLiderServicioOperacional || null;
      } else {
        insertData.holding = selectedHolding;
        insertData.empresa = selectedCompanyData?.name || null;
        insertData.celula = autoFilledData.celulaOperacional || null;
        insertData.jefe_comercial = autoFilledData.jefeComercial || null;
      }

      const { error } = await supabase.from('system_users').insert(insertData);

      if (error) throw error;

      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente.',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el usuario. Intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCompanyName = () => {
    return mockCompanies.find((c) => c.id === selectedCompany)?.name || '';
  };

  const getAssignedCompanyNames = () => {
    return assignedCompanies
      .map((id) => mockCompanies.find((c) => c.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Crear Nuevo Usuario
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isCurrent ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-16 h-0.5 mb-6',
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <ScrollArea className="max-h-[50vh] pr-4">
          {/* Step 1: User Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres *</Label>
                  <Input
                    id="nombres"
                    placeholder="Ingrese nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    placeholder="Ingrese apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT *</Label>
                  <Input
                    id="rut"
                    placeholder="12.345.678-9"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userType">Tipo de Usuario *</Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger id="userType">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUserTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile">Perfil del Usuario *</Label>
                  <Select value={userProfile} onValueChange={setUserProfile}>
                    <SelectTrigger id="profile">
                      <SelectValue placeholder="Seleccione un perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProfiles.map((profile) => (
                        <SelectItem key={profile} value={profile}>
                          {profile}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {userType === 'OTIC' && (
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    placeholder="Ingrese cargo"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Company Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {userType === 'OTIC' ? (
                // OTIC specific fields
                <>
                  <div className="space-y-2">
                    <Label htmlFor="oticEmpresa">Empresa a la que pertenece *</Label>
                    <Select value={oticEmpresa} onValueChange={setOticEmpresa}>
                      <SelectTrigger id="oticEmpresa">
                        <SelectValue placeholder="Seleccione una empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCompanies.map((company) => (
                          <SelectItem key={company.id} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Checkbox to enable role fields */}
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id="enableRoleFields"
                      checked={oticRoleFieldsEnabled}
                      onCheckedChange={(checked) => {
                        setOticRoleFieldsEnabled(checked === true);
                        // Clear role fields when disabled
                        if (!checked) {
                          setOticCelula('');
                          setOticJefeComercial('');
                          setOticAnalistaComercial('');
                          setOticAnalistaOperacional('');
                          setOticLiderServicioEDC('');
                          setOticLiderServicioOperacional('');
                        }
                      }}
                    />
                    <Label 
                      htmlFor="enableRoleFields" 
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Asignación Operacional
                    </Label>
                  </div>

                  {oticRoleFieldsEnabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oticCelula">Célula *</Label>
                          <Select value={oticCelula} onValueChange={setOticCelula}>
                            <SelectTrigger id="oticCelula">
                              <SelectValue placeholder="Seleccione una célula" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCelulas.map((celula) => (
                                <SelectItem key={celula} value={celula}>
                                  {celula}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="oticJefeComercial">Jefe Comercial *</Label>
                          <Select value={oticJefeComercial} onValueChange={setOticJefeComercial}>
                            <SelectTrigger id="oticJefeComercial">
                              <SelectValue placeholder="Seleccione jefe comercial" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockJefesComerciales.map((jefe) => (
                                <SelectItem key={jefe} value={jefe}>
                                  {jefe}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oticAnalistaComercial">Analista Comercial *</Label>
                          <Select value={oticAnalistaComercial} onValueChange={setOticAnalistaComercial}>
                            <SelectTrigger id="oticAnalistaComercial">
                              <SelectValue placeholder="Seleccione analista" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPersonasAsignables.map((persona) => (
                                <SelectItem key={persona} value={persona}>
                                  {persona}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="oticAnalistaOperacional">Analista Operacional *</Label>
                          <Select value={oticAnalistaOperacional} onValueChange={setOticAnalistaOperacional}>
                            <SelectTrigger id="oticAnalistaOperacional">
                              <SelectValue placeholder="Seleccione analista" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPersonasAsignables.map((persona) => (
                                <SelectItem key={persona} value={persona}>
                                  {persona}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="oticLiderServicioEDC">Líder Servicio EDC *</Label>
                          <Select value={oticLiderServicioEDC} onValueChange={setOticLiderServicioEDC}>
                            <SelectTrigger id="oticLiderServicioEDC">
                              <SelectValue placeholder="Seleccione líder" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPersonasAsignables.map((persona) => (
                                <SelectItem key={persona} value={persona}>
                                  {persona}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="oticLiderServicioOperacional">Líder Servicio Operacional *</Label>
                          <Select value={oticLiderServicioOperacional} onValueChange={setOticLiderServicioOperacional}>
                            <SelectTrigger id="oticLiderServicioOperacional">
                              <SelectValue placeholder="Seleccione líder" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPersonasAsignables.map((persona) => (
                                <SelectItem key={persona} value={persona}>
                                  {persona}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Holding and Company Assignment for OTIC */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-sm mb-4">Asignación de Holdings y Empresas</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Holding</Label>
                        <div className="border rounded-md bg-background">
                          {/* Search input */}
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
                          {/* Holdings list with scroll */}
                          <div className="p-2 max-h-48 overflow-y-auto">
                            {mockHoldings
                              .filter((holding) => 
                                holding.toLowerCase().includes(holdingSearchQuery.toLowerCase())
                              )
                              .map((holding) => (
                                <div key={holding} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    id={`otic-holding-${holding}`}
                                    checked={oticSelectedHoldings.includes(holding)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setOticSelectedHoldings((prev) => [...prev, holding]);
                                      } else {
                                        setOticSelectedHoldings((prev) => prev.filter((h) => h !== holding));
                                        // Also remove companies from the unselected holding
                                        const companiesFromHolding = mockCompanies
                                          .filter((c) => c.holding === holding)
                                          .map((c) => c.id);
                                        setOticAssignedCompanies((prev) => 
                                          prev.filter((id) => !companiesFromHolding.includes(id))
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`otic-holding-${holding}`}
                                    className="text-sm cursor-pointer flex-1"
                                  >
                                    {holding}
                                  </label>
                                </div>
                              ))}
                            {mockHoldings.filter((h) => 
                              h.toLowerCase().includes(holdingSearchQuery.toLowerCase())
                            ).length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-2">
                                No se encontraron holdings
                              </p>
                            )}
                          </div>
                        </div>
                        {oticSelectedHoldings.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {oticSelectedHoldings.map((holding) => (
                              <Badge key={holding} variant="secondary" className="text-xs">
                                {holding}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Companies list with checkboxes */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Empresas Asignadas</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleOticSelectAllCompanies}
                          >
                            {oticFilteredCompanies.every((c) => oticAssignedCompanies.includes(c.id))
                              ? 'Deseleccionar Todas'
                              : 'Seleccionar Todas'}
                          </Button>
                        </div>
                        <div className="border rounded-md bg-background">
                          {/* Search input */}
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Buscar empresa..."
                                value={oticCompanySearchQuery}
                                onChange={(e) => setOticCompanySearchQuery(e.target.value)}
                                className="pl-8 h-8 text-sm"
                              />
                            </div>
                          </div>
                          {/* Companies list with scroll */}
                          <div className="p-2 max-h-48 overflow-y-auto space-y-1">
                            {oticFilteredCompanies
                              .filter((company) =>
                                company.name.toLowerCase().includes(oticCompanySearchQuery.toLowerCase())
                              )
                              .map((company) => (
                                <div key={company.id} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    id={`otic-company-${company.id}`}
                                    checked={oticAssignedCompanies.includes(company.id)}
                                    onCheckedChange={() => toggleOticCompanyAssignment(company.id)}
                                  />
                                  <label
                                    htmlFor={`otic-company-${company.id}`}
                                    className="text-sm cursor-pointer flex-1"
                                  >
                                    {company.name}
                                    <span className="text-xs text-muted-foreground ml-2">({company.holding})</span>
                                  </label>
                                </div>
                              ))}
                            {oticFilteredCompanies.filter((c) =>
                              c.name.toLowerCase().includes(oticCompanySearchQuery.toLowerCase())
                            ).length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-2">
                                No se encontraron empresas
                              </p>
                            )}
                          </div>
                        </div>
                        {oticAssignedCompanies.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {oticAssignedCompanies.length} empresa(s) seleccionada(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // OTEC/EMPRESA fields - homologated with OTIC pattern
                <>
                  <div className="space-y-4">
                    {/* Holding multi-select with search */}
                    <div className="space-y-2">
                      <Label>Holding *</Label>
                      <div className="border rounded-md bg-background">
                        {/* Search input */}
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar holding..."
                              value={otecHoldingSearchQuery}
                              onChange={(e) => setOtecHoldingSearchQuery(e.target.value)}
                              className="pl-8 h-8 text-sm"
                            />
                          </div>
                        </div>
                        {/* Holdings list with scroll */}
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {mockHoldings
                            .filter((holding) => 
                              holding.toLowerCase().includes(otecHoldingSearchQuery.toLowerCase())
                            )
                            .map((holding) => (
                              <div key={holding} className="flex items-center space-x-2 py-1">
                                <Checkbox
                                  id={`otec-holding-${holding}`}
                                  checked={selectedHolding === holding}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedHolding(holding);
                                    } else {
                                      setSelectedHolding('');
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`otec-holding-${holding}`}
                                  className="text-sm cursor-pointer flex-1"
                                >
                                  {holding}
                                </label>
                              </div>
                            ))}
                          {mockHoldings.filter((h) => 
                            h.toLowerCase().includes(otecHoldingSearchQuery.toLowerCase())
                          ).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                              No se encontraron holdings
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedHolding && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {selectedHolding}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Empresas Asignadas multi-select with search */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Empresas Asignadas</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAllCompanies}
                        >
                          {assignedCompanies.length === mockCompanies.length
                            ? 'Deseleccionar Todas'
                            : 'Seleccionar Todas'}
                        </Button>
                      </div>
                      <div className="border rounded-md bg-background">
                        {/* Search input */}
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar empresa..."
                              value={otecCompanySearchQuery}
                              onChange={(e) => setOtecCompanySearchQuery(e.target.value)}
                              className="pl-8 h-8 text-sm"
                            />
                          </div>
                        </div>
                        {/* Companies list with scroll */}
                        <div className="p-2 max-h-48 overflow-y-auto space-y-1">
                          {mockCompanies
                            .filter((company) =>
                              company.name.toLowerCase().includes(otecCompanySearchQuery.toLowerCase())
                            )
                            .map((company) => (
                              <div key={company.id} className="flex items-center space-x-2 py-1">
                                <Checkbox
                                  id={`otec-company-${company.id}`}
                                  checked={assignedCompanies.includes(company.id)}
                                  onCheckedChange={() => toggleCompanyAssignment(company.id)}
                                />
                                <label
                                  htmlFor={`otec-company-${company.id}`}
                                  className="text-sm cursor-pointer flex-1"
                                >
                                  {company.name}
                                  <span className="text-xs text-muted-foreground ml-2">({company.holding})</span>
                                </label>
                              </div>
                            ))}
                          {mockCompanies.filter((c) =>
                            c.name.toLowerCase().includes(otecCompanySearchQuery.toLowerCase())
                          ).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                              No se encontraron empresas
                            </p>
                          )}
                        </div>
                      </div>
                      {assignedCompanies.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {assignedCompanies.length} empresa(s) seleccionada(s)
                        </p>
                      )}
                    </div>

                    {/* Empresa Principal - now as single-select from assigned companies */}
                    {assignedCompanies.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Empresa Principal *</Label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                          <SelectTrigger id="empresa">
                            <SelectValue placeholder="Seleccione la empresa principal" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCompanies
                              .filter((c) => assignedCompanies.includes(c.id))
                              .map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Auto-filled data */}
                  {selectedCompany && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3 mt-4">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Información de la empresa seleccionada
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Segmento</Label>
                          <Badge variant="secondary" className="mt-1">
                            {autoFilledData.segmento}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Jefe Comercial</Label>
                          <p className="text-sm font-medium mt-1">{autoFilledData.jefeComercial}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Célula Operacional</Label>
                          <p className="text-sm font-medium mt-1">{autoFilledData.celulaOperacional}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Usuario
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Perfil:</span>
                    <p className="font-medium">{userProfile}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">RUT:</span>
                    <p className="font-medium font-mono">{rut}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nombres:</span>
                    <p className="font-medium">{nombres}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Apellidos:</span>
                    <p className="font-medium">{apellidos}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipo de Usuario:</span>
                    <Badge>{userType}</Badge>
                  </div>
                  {cargo && (
                    <div>
                      <span className="text-muted-foreground">Cargo:</span>
                      <p className="font-medium">{cargo}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Información de Empresa
                </h4>
                {userType === 'OTIC' ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Empresa a la que pertenece:</span>
                      <p className="font-medium">{oticEmpresa}</p>
                    </div>
                    {oticRoleFieldsEnabled && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Célula:</span>
                          <p className="font-medium">{oticCelula}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Jefe Comercial:</span>
                          <p className="font-medium">{oticJefeComercial}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Analista Comercial:</span>
                          <p className="font-medium">{oticAnalistaComercial}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Analista Operacional:</span>
                          <p className="font-medium">{oticAnalistaOperacional}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Líder Servicio EDC:</span>
                          <p className="font-medium">{oticLiderServicioEDC}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Líder Servicio Operacional:</span>
                          <p className="font-medium">{oticLiderServicioOperacional}</p>
                        </div>
                      </>
                    )}
                    {oticSelectedHoldings.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Holdings:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {oticSelectedHoldings.map((holding) => (
                            <Badge key={holding} variant="outline" className="text-xs">
                              {holding}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {oticAssignedCompanies.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Empresas Asignadas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getOticAssignedCompanyNames().map((name) => (
                            <Badge key={name} variant="outline" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Empresa Principal:</span>
                      <p className="font-medium">{getSelectedCompanyName()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Holding:</span>
                      <p className="font-medium">{selectedHolding}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Segmento:</span>
                      <Badge variant="secondary">{autoFilledData.segmento}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Jefe Comercial:</span>
                      <p className="font-medium">{autoFilledData.jefeComercial}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Célula Operacional:</span>
                      <p className="font-medium">{autoFilledData.celulaOperacional}</p>
                    </div>
                    {assignedCompanies.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Empresas Asignadas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getAssignedCompanyNames().map((name) => (
                            <Badge key={name} variant="outline" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer with navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid) ||
                  (currentStep === 2 && !isStep2Valid)
                }
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Usuario'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
