import React, { useState } from 'react';
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
  CheckCircle
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
    participants: 1,
    message: '',
  });

  const participantOptions = [1, 2, 3, 4, 5, 6, 7, '8+'];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quote request submitted:', formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      participants: 1,
      message: '',
    });
    
    // Close modal
    onOpenChange(false);
    
    // Show success toast
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
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
              <h3 className="font-semibold text-foreground">Tus datos de contacto</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
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

                {/* Correo electrónico */}
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

                {/* Nombre de la empresa */}
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

                {/* Número de participantes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Participantes <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {participantOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={formData.participants === option ? 'default' : 'outline'}
                        size="sm"
                        className="w-11 h-11 text-sm font-medium"
                        onClick={() => handleInputChange('participants', option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mensaje */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Mensaje <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Cuéntanos sobre tus necesidades de capacitación..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={3}
                    required
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
