import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Building2, Scale, PenLine, Eraser, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmpresaData {
  razonSocial: string;
  rut: string;
  giro: string;
  direccion: string;
  comuna: string;
  region: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoCargo: string;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
  empresaData: EmpresaData;
  onEmpresaDataChange: (data: EmpresaData) => void;
}

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Metropolitana', "O'Higgins", 'Maule', 'Ñuble', 'Biobío',
  'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

const RUBROS = [
  'Agricultura y Ganadería', 'Minería', 'Industria Manufacturera', 'Construcción',
  'Comercio', 'Transporte y Logística', 'Tecnología e Informática', 'Telecomunicaciones',
  'Servicios Financieros y Banca', 'Salud y Servicios Sociales', 'Educación',
  'Hotelería y Turismo', 'Energía y Medio Ambiente', 'Inmobiliario',
  'Servicios Profesionales y Consultoría', 'Administración Pública', 'Retail',
  'Alimentos y Bebidas', 'Forestal y Pesca', 'Otro',
];

const DNCStep2Legal: React.FC<Props> = ({ onNext, onBack, empresaData, onEmpresaDataChange }) => {
  const [accepted, setAccepted] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const isEmpresaValid = empresaData.razonSocial.trim() !== '' &&
    empresaData.rut.trim() !== '' &&
    empresaData.giro !== '' &&
    empresaData.region !== '' &&
    empresaData.contactoNombre.trim() !== '' &&
    empresaData.contactoEmail.trim() !== '';

  const canProceed = isEmpresaValid && accepted && hasSigned;

  useEffect(() => {
    if (accepted && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [accepted]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDraw = () => { isDrawing.current = false; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const update = (field: keyof EmpresaData, value: string) => {
    onEmpresaDataChange({ ...empresaData, [field]: value });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Datos de Empresa */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Datos de la Empresa</h3>
              <p className="text-xs text-muted-foreground">Completa la información de tu organización.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Razón Social <span className="text-destructive">*</span></Label>
              <Input placeholder="Empresa S.A." value={empresaData.razonSocial} onChange={(e) => update('razonSocial', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>RUT Empresa <span className="text-destructive">*</span></Label>
              <Input placeholder="76.123.456-7" value={empresaData.rut} onChange={(e) => update('rut', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Giro / Rubro <span className="text-destructive">*</span></Label>
              <Select value={empresaData.giro} onValueChange={(v) => update('giro', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona un rubro" /></SelectTrigger>
                <SelectContent>
                  {RUBROS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Región <span className="text-destructive">*</span></Label>
              <Select value={empresaData.region} onValueChange={(v) => update('region', v)}>
                <SelectTrigger><SelectValue placeholder="Selecciona región" /></SelectTrigger>
                <SelectContent>
                  {REGIONES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input placeholder="Av. Principal 123" value={empresaData.direccion} onChange={(e) => update('direccion', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Comuna</Label>
              <Input placeholder="Providencia" value={empresaData.comuna} onChange={(e) => update('comuna', e.target.value)} />
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Contacto responsable</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nombre completo <span className="text-destructive">*</span></Label>
                <Input placeholder="Juan Pérez" value={empresaData.contactoNombre} onChange={(e) => update('contactoNombre', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email <span className="text-destructive">*</span></Label>
                <Input type="email" placeholder="juan@empresa.cl" value={empresaData.contactoEmail} onChange={(e) => update('contactoEmail', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input placeholder="Jefe de RRHH" value={empresaData.contactoCargo} onChange={(e) => update('contactoCargo', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Términos y Condiciones */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Validación Legal</h3>
              <p className="text-xs text-muted-foreground">Acepta los términos y firma digitalmente para continuar.</p>
            </div>
          </div>

          <ScrollArea className="h-[200px] border rounded-lg p-4 bg-muted/30">
            <div className="space-y-3 text-sm text-muted-foreground pr-4">
              <h3 className="font-semibold text-foreground">Términos y Condiciones del Proceso DNC</h3>
              <p>El presente documento establece los términos y condiciones para la ejecución del Diagnóstico de Necesidades de Capacitación (DNC) en el marco de la normativa vigente del Servicio Nacional de Capacitación y Empleo (SENCE).</p>
              <h4 className="font-semibold text-foreground">1. Objeto del Proceso</h4>
              <p>El DNC tiene como finalidad identificar las brechas de competencias de los colaboradores de la organización, a través de la aplicación de instrumentos de evaluación y encuestas.</p>
              <h4 className="font-semibold text-foreground">2. Tratamiento de Datos Personales</h4>
              <p>Los datos personales recopilados durante el proceso DNC serán tratados conforme a la Ley N° 19.628 sobre Protección de la Vida Privada.</p>
              <h4 className="font-semibold text-foreground">3. Confidencialidad</h4>
              <p>Toda la información recopilada durante el proceso es de carácter confidencial. Los resultados individuales no serán divulgados.</p>
              <h4 className="font-semibold text-foreground">4. Responsabilidades</h4>
              <p>La empresa se compromete a facilitar la participación de los colaboradores en el proceso de diagnóstico.</p>
              <h4 className="font-semibold text-foreground">5. Vigencia</h4>
              <p>Los resultados del DNC tendrán una vigencia de 12 meses desde la fecha de su ejecución.</p>
              <h4 className="font-semibold text-foreground">6. Aceptación</h4>
              <p>Al firmar digitalmente este documento, el usuario declara haber leído, comprendido y aceptado en su totalidad los términos y condiciones aquí descritos.</p>
            </div>
          </ScrollArea>

          <div className="flex items-start gap-3">
            <Checkbox id="accept-terms-step2" checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} />
            <label htmlFor="accept-terms-step2" className="text-sm leading-snug cursor-pointer select-none">
              He leído el documento y acepto en su totalidad las condiciones
            </label>
          </div>

          {accepted && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-muted-foreground">Dibuja tu firma digital para continuar</p>
              <div className="border-2 border-dashed border-border rounded-lg overflow-hidden bg-background">
                <canvas
                  ref={canvasRef}
                  className="w-full h-[140px] cursor-crosshair touch-none"
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={clearCanvas} className="gap-2">
                  <Eraser className="w-4 h-4" /> Limpiar
                </Button>
              </div>
              {hasSigned && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Firma registrada
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <Button className="gap-2" disabled={!canProceed} onClick={onNext}>
          Continuar <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DNCStep2Legal;
