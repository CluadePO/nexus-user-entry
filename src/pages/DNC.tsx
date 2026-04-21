import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { cn } from '@/lib/utils';
import DNCStep1Onboarding from '@/components/dnc/steps/DNCStep1Onboarding';
import DNCStep2Legal from '@/components/dnc/steps/DNCStep2Legal';
import DNCStep3BusinessCore from '@/components/dnc/steps/DNCStep3BusinessCore';
import DNCStep4Survey from '@/components/dnc/steps/DNCStep4Survey';
import DNCStep5Summary from '@/components/dnc/steps/DNCStep5Summary';
import DNCHistorial from '@/components/dnc/DNCHistorial';
import { type DNCProceso } from '@/components/dnc/dncStorage';
import { type Participante } from '@/components/dnc/DNCParticipantUpload';

const STEP_LABELS = ['Onboarding', 'Identificación', 'Núcleo de Negocio', 'Levantamiento', 'Pre-vuelo'];

const DNC: React.FC = () => {
  const [phase, setPhase] = useState<'wizard' | 'historial'>('wizard');
  const [step, setStep] = useState(1);

  // Step 2 state
  const [empresaData, setEmpresaData] = useState({
    razonSocial: '', rut: '', giro: '', direccion: '', comuna: '', region: '',
    contactoNombre: '', contactoEmail: '', contactoCargo: '',
  });

  // Step 3 state
  const [modalidadEstudio, setModalidadEstudio] = useState<'cargo' | 'persona' | 'area' | null>(null);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [participants, setParticipants] = useState<Participante[]>([]);

  // Step 4 state
  const [surveyConfig, setSurveyConfig] = useState({
    numAreas: '6' as '6' | '10' | '12',
    maxTemas: 3,
    fechaInicio: '',
    fechaCierre: '',
    modalidades: [] as string[],
    mesPreferencia: '',
    necesitaMasEspacios: null as boolean | null,
  });

  if (phase === 'historial') {
    return (
      <DNCHistorial
        onBack={() => setPhase('wizard')}
        onResumeDraft={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stepper header - only for steps 2-5 */}
      {step > 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {STEP_LABELS.map((label, i) => {
                const s = i + 1;
                const isActive = s === step;
                const isDone = s < step;
                return (
                  <React.Fragment key={s}>
                    {i > 0 && <div className={cn("w-8 h-0.5", isDone ? "bg-primary" : "bg-border")} />}
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        isActive ? "bg-primary text-primary-foreground" :
                        isDone ? "bg-primary/20 text-primary" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {s}
                      </div>
                      <span className={cn("text-xs hidden md:inline", isActive ? "font-semibold text-foreground" : "text-muted-foreground")}>
                        {label}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setPhase('historial')}>
              <History className="w-4 h-4" /> Historial
            </Button>
          </div>
        </div>
      )}

      {/* Steps */}
      {step === 1 && (
        <DNCStep1Onboarding onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <DNCStep2Legal
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          empresaData={empresaData}
          onEmpresaDataChange={setEmpresaData}
        />
      )}
      {step === 3 && (
        <DNCStep3BusinessCore
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
          modalidadEstudio={modalidadEstudio}
          onModalidadEstudioChange={setModalidadEstudio}
          selectedRules={selectedRules}
          onSelectedRulesChange={setSelectedRules}
          participants={participants}
          onParticipantsChange={setParticipants}
        />
      )}
      {step === 4 && (
        <DNCStep4Survey
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
          config={surveyConfig}
          onConfigChange={setSurveyConfig}
        />
      )}
      {step === 5 && (
        <DNCStep5Summary
          onBack={() => setStep(4)}
          onEdit={(s) => setStep(s)}
          empresaData={empresaData}
          participantsCount={participants.length}
          modalidadEstudio={modalidadEstudio}
          selectedRules={selectedRules}
          surveyConfig={surveyConfig}
        />
      )}
    </div>
  );
};

export default DNC;
