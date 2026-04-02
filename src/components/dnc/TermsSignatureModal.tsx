import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PenLine, Eraser } from 'lucide-react';

interface TermsSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSigned: () => void;
}

const TermsSignatureModal: React.FC<TermsSignatureModalProps> = ({ open, onOpenChange, onSigned }) => {
  const [accepted, setAccepted] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!open) {
      setAccepted(false);
      setHasSigned(false);
    }
  }, [open]);

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
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
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

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleSign = () => {
    onSigned();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Firma del documento</DialogTitle>
          <DialogDescription>
            Para iniciar el proceso de DNC, debe aceptar los términos y condiciones y firmar digitalmente.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[250px] border rounded-lg p-4 bg-muted/30">
          <div className="space-y-3 text-sm text-muted-foreground pr-4">
            <h3 className="font-semibold text-foreground">Términos y Condiciones del Proceso DNC</h3>
            <p>
              El presente documento establece los términos y condiciones para la ejecución del Diagnóstico de
              Necesidades de Capacitación (DNC) en el marco de la normativa vigente del Servicio Nacional de
              Capacitación y Empleo (SENCE).
            </p>
            <h4 className="font-semibold text-foreground">1. Objeto del Proceso</h4>
            <p>
              El DNC tiene como finalidad identificar las brechas de competencias de los colaboradores de la
              organización, a través de la aplicación de instrumentos de evaluación y encuestas, con el objetivo
              de generar un plan de capacitación alineado a las necesidades reales de la empresa.
            </p>
            <h4 className="font-semibold text-foreground">2. Tratamiento de Datos Personales</h4>
            <p>
              Los datos personales recopilados durante el proceso DNC serán tratados conforme a la Ley N° 19.628
              sobre Protección de la Vida Privada. La información será utilizada exclusivamente para fines de
              diagnóstico y planificación de capacitación, y no será compartida con terceros sin el consentimiento
              expreso del titular.
            </p>
            <h4 className="font-semibold text-foreground">3. Confidencialidad</h4>
            <p>
              Toda la información recopilada durante el proceso es de carácter confidencial. Los resultados
              individuales no serán divulgados y solo se presentarán de forma agregada para efectos del análisis
              organizacional.
            </p>
            <h4 className="font-semibold text-foreground">4. Responsabilidades</h4>
            <p>
              La empresa se compromete a facilitar la participación de los colaboradores en el proceso de
              diagnóstico, garantizando el tiempo y los recursos necesarios para completar las evaluaciones
              requeridas.
            </p>
            <h4 className="font-semibold text-foreground">5. Vigencia</h4>
            <p>
              Los resultados del DNC tendrán una vigencia de 12 meses desde la fecha de su ejecución, período
              durante el cual se recomienda implementar las acciones de capacitación sugeridas.
            </p>
            <h4 className="font-semibold text-foreground">6. Aceptación</h4>
            <p>
              Al firmar digitalmente este documento, el usuario declara haber leído, comprendido y aceptado en su
              totalidad los términos y condiciones aquí descritos, así como las políticas de tratamiento de datos
              personales asociadas al proceso DNC.
            </p>
          </div>
        </ScrollArea>

        <div className="flex items-start gap-3 py-2">
          <Checkbox
            id="accept-terms"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
          />
          <label htmlFor="accept-terms" className="text-sm leading-snug cursor-pointer select-none">
            He leído el documento y acepto en su totalidad las condiciones
          </label>
        </div>

        {accepted && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-muted-foreground">
              Usa tu mouse o tu dedo para dibujar tu firma, puedes intentarlo las veces que necesites
            </p>
            <div className="border-2 border-dashed border-border rounded-lg overflow-hidden bg-background">
              <canvas
                ref={canvasRef}
                className="w-full h-[180px] cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={clearCanvas} className="gap-2">
                <Eraser className="w-4 h-4" />
                Limpiar
              </Button>
              <Button
                onClick={handleSign}
                disabled={!hasSigned}
                className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
              >
                <PenLine className="w-4 h-4" />
                Firmar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TermsSignatureModal;
