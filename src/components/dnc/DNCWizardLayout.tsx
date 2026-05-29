import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CheckCircle2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: number;
  label: string;
  substeps?: { id: string; label: string }[];
}

export const DNC_STEPS: WizardStep[] = [
  { id: 1, label: 'Datos y Legal', substeps: [{ id: 'empresa', label: 'Empresa' }, { id: 'terminos', label: 'Términos' }] },
  { id: 2, label: 'Participantes', substeps: [
    { id: 'alcance', label: 'Alcance' },
    { id: 'modelo', label: 'Modelo asignación' },
    { id: 'carga', label: 'Carga nómina' },
  ]},
  { id: 3, label: 'Áreas y Temáticas' },
  { id: 4, label: 'Diseño de Encuesta' },
  { id: 5, label: 'Comunicación' },
  { id: 6, label: 'Resumen y Confirmación' },
];

interface Props {
  step: number;
  onStepChange?: (s: number) => void;
  onBackToList: () => void;
  children: React.ReactNode;
}

const DNCWizardLayout: React.FC<Props> = ({ step, onStepChange, onBackToList, children, savedAt }) => {
  const current = DNC_STEPS.find(s => s.id === step);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#" className="text-primary">Inicio</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onBackToList(); }} className="text-primary">DNC</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#" className="text-primary">Nueva DNC</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Paso {step}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" /> Guardar borrador
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <Card className="p-4 h-fit sticky top-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Configuración</p>
          <ol className="space-y-1">
            {DNC_STEPS.map(s => {
              const active = s.id === step;
              const done = s.id < step;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onStepChange?.(s.id)}
                    className={cn(
                      'w-full flex items-start gap-3 rounded-md px-2 py-2 text-left transition-colors',
                      active ? 'bg-primary/10' : 'hover:bg-muted'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5',
                      active ? 'bg-primary text-primary-foreground' :
                      done ? 'bg-primary/20 text-primary' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className={cn('text-sm leading-tight', active ? 'font-semibold text-foreground' : 'text-foreground')}>
                        {s.label}
                      </p>
                      {active && s.substeps && (
                        <ul className="space-y-0.5 pt-1">
                          {s.substeps.map(sub => (
                            <li key={sub.id} className="text-xs text-primary flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-primary" />
                              {sub.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* Content */}
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default DNCWizardLayout;
