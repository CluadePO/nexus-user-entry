import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Hash, 
  Layers, 
  Monitor, 
  Clock, 
  Briefcase,
  DollarSign,
  BookOpen,
  Users
} from 'lucide-react';

interface CourseInfo {
  name: string;
  provider: string;
  senceCode: string;
  area: string;
  modality: string;
  hours: number;
  specialty: string;
  effectiveValuePerParticipant: number;
  maxImputableValue: number;
}

interface QuoteRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseInfo: CourseInfo;
  formatPrice: (price: number) => string;
}

const franchiseTiers = [
  { percentage: 15, label: '15%', color: 'blue' },
  { percentage: 50, label: '50%', color: 'amber' },
  { percentage: 100, label: '100%', color: 'emerald' },
];

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  open,
  onOpenChange,
  courseInfo,
  formatPrice,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [tierParticipants, setTierParticipants] = useState<Record<number, number>>({
    15: 0,
    50: 0,
    100: 0,
  });

  const baseValuePerParticipant = Math.min(courseInfo.effectiveValuePerParticipant, courseInfo.maxImputableValue);
  
  const calculations = useMemo(() => {
    const totalParticipants = Object.values(tierParticipants).reduce((a, b) => a + b, 0);
    const totalEffective = courseInfo.effectiveValuePerParticipant * totalParticipants;
    const totalFranchise = franchiseTiers.reduce((sum, tier) => {
      return sum + ((baseValuePerParticipant * tier.percentage) / 100) * tierParticipants[tier.percentage];
    }, 0);
    const companyCost = Math.max(0, totalEffective - totalFranchise);
    return { totalParticipants, totalEffective, totalFranchise, companyCost };
  }, [tierParticipants, courseInfo.effectiveValuePerParticipant, baseValuePerParticipant]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTierChange = (percentage: number, value: number) => {
    setTierParticipants((prev) => ({ ...prev, [percentage]: Math.max(0, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculations.totalParticipants === 0) {
      toast({ title: "Debes ingresar al menos 1 participante", variant: "destructive" });
      return;
    }
    console.log('Quote request submitted:', { ...formData, tierParticipants, ...calculations });
    setFormData({ name: '', email: '', company: '', message: '' });
    setTierParticipants({ 15: 0, 50: 0, 100: 0 });
    onOpenChange(false);
    toast({
      title: "¡Solicitud enviada con éxito!",
      description: "El proveedor se pondrá en contacto contigo pronto para darte más información sobre el curso.",
      duration: 5000,
    });
  };

  const courseDetails = [
    { icon: Building2, label: 'Proveedor', value: courseInfo.provider },
    { icon: Hash, label: 'Código SENCE', value: courseInfo.senceCode },
    { icon: Layers, label: 'Área', value: courseInfo.area },
    { icon: Monitor, label: 'Modalidad', value: courseInfo.modality },
    { icon: Clock, label: 'Duración', value: `${courseInfo.hours} horas` },
    { icon: Briefcase, label: 'Especialidad', value: courseInfo.specialty },
  ];

  const getColorClasses = (color: string) => {
    if (color === 'emerald') return { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' };
    if (color === 'amber') return { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' };
    return { dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 lg:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Solicitud de Cotización
            </DialogTitle>
            <p className="text-muted-foreground mt-1">
              Completa el formulario para recibir una cotización personalizada
            </p>
          </DialogHeader>

          {/* Course Summary Card */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Curso seleccionado</p>
                <p className="font-semibold text-foreground">{courseInfo.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Side - Form */}
            <div className="lg:col-span-3 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold text-foreground">Tus datos de contacto</h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      maxLength={50}
                      required
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {formData.name.length}/50
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@empresa.cl"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Empresa <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="company"
                      placeholder="Nombre de tu empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      maxLength={50}
                      required
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {formData.company.length}/50
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Franchise Tier Participants */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Participantes por tramo de franquicia
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ingresa la cantidad de participantes según el tramo de franquicia tributaria que aplique.
                  </p>
                  <div className="space-y-3">
                    {franchiseTiers.map((tier) => {
                      const colors = getColorClasses(tier.color);
                      const tierCoverage = ((baseValuePerParticipant * tier.percentage) / 100) * tierParticipants[tier.percentage];
                      return (
                        <div key={tier.percentage} className={`p-3 rounded-lg border ${colors.bg} space-y-2`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                              <span className="text-sm font-semibold">Tramo {tier.label}</span>
                            </div>
                            <span className={`font-bold text-sm ${colors.text}`}>
                              {formatPrice(tierCoverage)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => handleTierChange(tier.percentage, tierParticipants[tier.percentage] - 1)}
                            >
                              -
                            </Button>
                            <input
                              type="number"
                              min="0"
                              value={tierParticipants[tier.percentage]}
                              onChange={(e) => handleTierChange(tier.percentage, parseInt(e.target.value) || 0)}
                              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => handleTierChange(tier.percentage, tierParticipants[tier.percentage] + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calculated Totals */}
                {calculations.totalParticipants > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total participantes</span>
                      <span className="font-medium">{calculations.totalParticipants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor efectivo total</span>
                      <span className="font-medium">{formatPrice(calculations.totalEffective)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total franquicia</span>
                      <span className="font-medium text-primary">{formatPrice(calculations.totalFranchise)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-foreground">Costo empresa</span>
                      <span className="text-destructive">{formatPrice(calculations.companyCost)}</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Mensaje
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Cuéntanos sobre tus necesidades de capacitación..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full mt-4" size="lg">
                  Enviar solicitud
                </Button>
              </form>
            </div>

            {/* Right Side - Course Info */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-foreground mb-4">Detalles del curso</h3>
              
              <div className="space-y-3">
                {courseDetails.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <detail.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{detail.label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Valores</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground">Valor efectivo por participante</p>
                    <p className="text-base font-bold text-foreground">
                      {formatPrice(courseInfo.effectiveValuePerParticipant)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground">Valor máximo imputable</p>
                    <p className="text-base font-bold text-foreground">
                      {formatPrice(courseInfo.maxImputableValue)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                (*) Valores informativos proporcionados por el proveedor. Pueden existir diferencias con los valores finales.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestModal;
