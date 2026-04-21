import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, ArrowRight, Users, Settings, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import DNCParticipantUpload, { type Participante } from '../DNCParticipantUpload';

type ModalidadEstudio = 'cargo' | 'persona' | 'area';

interface AssignmentRule {
  id: string;
  title: string;
  description: string;
}

const ASSIGNMENT_RULES: AssignmentRule[] = [
  { id: 'jefatura_designa', title: 'Jefatura designa cursos', description: 'La jefatura asigna los cursos que deben tomar los colaboradores.' },
  { id: 'jefatura_y_auto', title: 'Jefatura designa + autoasignación', description: 'La jefatura designa cursos y los colaboradores también se auto-asignan cursos adicionales.' },
  { id: 'jefatura_autoeval', title: 'Jefatura designa + autoevaluación', description: 'La jefatura designa cursos para otros y realiza su propia autoevaluación.' },
  { id: 'flujo_completo', title: 'Flujo completo', description: 'Jefatura designa para otros, colaboradores se auto-asignan, y la jefatura también se autoevalúa.' },
];

const MODALIDADES_ESTUDIO: { value: ModalidadEstudio; label: string; desc: string }[] = [
  { value: 'cargo', label: 'Por Cargo', desc: 'El estudio se agrupa por el cargo de los participantes.' },
  { value: 'persona', label: 'Por Persona', desc: 'El estudio se realiza individualmente por cada participante.' },
  { value: 'area', label: 'Por Área / Departamento / Gerencia', desc: 'El estudio se agrupa por área, departamento o gerencia.' },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
  modalidadEstudio: ModalidadEstudio | null;
  onModalidadEstudioChange: (v: ModalidadEstudio) => void;
  selectedRules: string[];
  onSelectedRulesChange: (v: string[]) => void;
  participants: Participante[];
  onParticipantsChange: (p: Participante[]) => void;
}

const DNCStep3BusinessCore: React.FC<Props> = ({
  onNext, onBack,
  modalidadEstudio, onModalidadEstudioChange,
  selectedRules, onSelectedRulesChange,
  participants, onParticipantsChange,
}) => {
  const toggleRule = (id: string) => {
    if (selectedRules.includes(id)) {
      onSelectedRulesChange(selectedRules.filter(r => r !== id));
    } else {
      onSelectedRulesChange([...selectedRules, id]);
    }
  };

  const canProceed = modalidadEstudio !== null && selectedRules.length > 0 && participants.length > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Modalidad del estudio */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Definición de Participantes</h3>
              <p className="text-xs text-muted-foreground">Selecciona la modalidad del estudio.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MODALIDADES_ESTUDIO.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => onModalidadEstudioChange(m.value)}
                className={cn(
                  "text-left p-4 rounded-lg border-2 transition-all",
                  modalidadEstudio === m.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/40 bg-background"
                )}
              >
                <p className="font-medium text-sm text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Matriz de Reglas */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Matriz de Reglas de Asignación</h3>
              <p className="text-xs text-muted-foreground">Selecciona una o más lógicas de asignación para el proceso. <span className="text-destructive">*</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ASSIGNMENT_RULES.map((rule) => {
              const selected = selectedRules.includes(rule.id);
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={cn(
                    "text-left p-4 rounded-lg border-2 transition-all relative",
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-primary/40 bg-background"
                  )}
                >
                  {selected && (
                    <CheckCircle2 className="w-5 h-5 text-primary absolute top-3 right-3" />
                  )}
                  <p className="font-medium text-sm text-foreground pr-6">{rule.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Carga de Nómina */}
      <Card className="p-6 border-2 border-primary/30 bg-primary/5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h3 className="font-semibold text-foreground">Carga de Nómina</h3>
                <p className="text-xs text-muted-foreground">Sube el archivo Excel con los participantes del proceso.</p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Columnas requeridas: <strong>Rut, Nombres, Apellidos, Email, Cargo, Gerencia, Departamento, Rut de Jefatura, Tipo de participante</strong>.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <DNCParticipantUpload
            participants={participants}
            onParticipantsChange={onParticipantsChange}
          />
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

export default DNCStep3BusinessCore;
