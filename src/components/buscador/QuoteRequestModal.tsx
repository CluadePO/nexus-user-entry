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
    // Here you would handle the form submission
    console.log('Quote request submitted:', formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-6 space-y-6">
            <DialogHeader className="p-0">
              <DialogTitle className="text-2xl font-bold">
                Solicitud de Cotización
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">Ingresa tus datos</p>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  <span className="text-red-500">*</span> Nombre
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Escribe aquí"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    maxLength={50}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {formData.name.length} / 50
                  </span>
                </div>
              </div>

              {/* Correo electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  <span className="text-red-500">*</span> Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Escribe aquí"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              {/* Nombre de la empresa */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm">
                  <span className="text-red-500">*</span> Nombre de la empresa
                </Label>
                <div className="relative">
                  <Input
                    id="company"
                    placeholder="Escribe aquí"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    maxLength={50}
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {formData.company.length} / 50
                  </span>
                </div>
              </div>

              {/* Número de participantes */}
              <div className="space-y-2">
                <Label className="text-sm">
                  <span className="text-red-500">*</span> Número de participantes
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {participantOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={formData.participants === option ? 'default' : 'outline'}
                      size="sm"
                      className="w-10 h-10"
                      onClick={() => handleInputChange('participants', option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm">
                  <span className="text-red-500">*</span> Mensaje
                </Label>
                <Textarea
                  id="message"
                  placeholder="Escribe aquí..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar solicitud
              </Button>
            </form>
          </div>

          {/* Right Side - Course Info */}
          <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground flex flex-col justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/2" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Información del curso</h3>
              <div className="w-16 h-1 bg-white/40 rounded-full mb-6" />

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-6">
                <p className="text-lg font-semibold leading-tight">
                  {courseInfo.name}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">P</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wide">Proveedor</p>
                    <p className="font-medium">{courseInfo.provider}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">#</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wide">Código</p>
                      <p className="font-medium text-sm">{courseInfo.senceCode}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">A</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wide">Área</p>
                      <p className="font-medium text-sm">{courseInfo.area}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">M</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wide">Modalidad</p>
                      <p className="font-medium text-sm">{courseInfo.modality}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">H</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 uppercase tracking-wide">Horas</p>
                      <p className="font-medium text-sm">{courseInfo.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">E</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wide">Especialidad</p>
                    <p className="font-medium text-sm">{courseInfo.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Pricing cards */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-xs text-white/70 mb-1">Valor efectivo</p>
                  <p className="text-lg font-bold">{formatPrice(courseInfo.effectiveValuePerParticipant)}</p>
                  <p className="text-xs text-white/60">por participante</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                  <p className="text-xs text-white/70 mb-1">Máximo imputable</p>
                  <p className="text-lg font-bold">{formatPrice(courseInfo.maxImputableValue)}</p>
                  <p className="text-xs text-white/60">franquicia</p>
                </div>
              </div>

              <p className="text-xs mt-6 text-white/60 leading-relaxed">
                (*) Valor según información proporcionada por el proveedor para uso
                de la franquicia tributaria. Pueden existir diferencias con los
                valores particulares.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestModal;
