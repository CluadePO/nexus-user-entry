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
          <div className="bg-primary p-6 text-primary-foreground flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6">Información del curso</h3>

            <div className="space-y-4">
              <p className="text-lg font-semibold leading-tight">
                {courseInfo.name}
              </p>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold">Proveedor:</span>{' '}
                  {courseInfo.provider}
                </div>
                <div>
                  <span className="font-semibold">Código:</span>{' '}
                  {courseInfo.senceCode}
                </div>
                <div>
                  <span className="font-semibold">Área:</span> {courseInfo.area}
                </div>
                <div>
                  <span className="font-semibold">Modalidad de ejecución:</span>{' '}
                  {courseInfo.modality}
                </div>
                <div>
                  <span className="font-semibold">Horas:</span> {courseInfo.hours}
                </div>
                <div>
                  <span className="font-semibold">Especialidad:</span>{' '}
                  {courseInfo.specialty}
                </div>
                <div>
                  <span className="font-semibold">Valor efectivo por participante:</span>{' '}
                  {formatPrice(courseInfo.effectiveValuePerParticipant)}
                </div>
                <div>
                  <span className="font-semibold">Valor máximo imputable:</span>{' '}
                  {formatPrice(courseInfo.maxImputableValue)}
                </div>
              </div>

              <p className="text-xs mt-6 opacity-80">
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
