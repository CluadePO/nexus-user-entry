import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DNCDashboard from '@/components/dnc/DNCDashboard';
import DNCOnboarding from '@/components/dnc/DNCOnboarding';
import DNCWizardLayout from '@/components/dnc/DNCWizardLayout';
import DNCStepDatos, { type EmpresaDataStep1 } from '@/components/dnc/steps/DNCStepDatos';
import DNCStepParticipantes, {
  type Alcance, type ModeloAsignacion, type ParticipanteSimple,
} from '@/components/dnc/steps/DNCStepParticipantes';
import DNCStepAreasTematicas, { type AreasState } from '@/components/dnc/steps/DNCStepAreasTematicas';
import DNCStepDisenoEncuesta, { defaultSurveyDesign, type SurveyDesignState } from '@/components/dnc/steps/DNCStepDisenoEncuesta';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Phase = 'dashboard' | 'onboarding' | 'wizard';

const emptyEmpresa: EmpresaDataStep1 = {
  razonSocial: '', rut: '', nombreProceso: '', rubro: '', region: '',
  ciudad: '', responsable: '', email: '', telefono: '',
};

const DNC: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('dashboard');
  const [step, setStep] = useState(1);
  const [empresa, setEmpresa] = useState<EmpresaDataStep1>(emptyEmpresa);
  const [alcance, setAlcance] = useState<Alcance | null>(null);
  const [modelo, setModelo] = useState<ModeloAsignacion | null>(null);
  const [participants, setParticipants] = useState<ParticipanteSimple[]>([]);
  const [areasState, setAreasState] = useState<AreasState>({});
  const [surveyDesign, setSurveyDesign] = useState<SurveyDesignState>(defaultSurveyDesign());

  const startNew = () => { setStep(1); setPhase('wizard'); };

  if (phase === 'dashboard') {
    return <DNCDashboard onNew={startNew} onOpenOnboarding={() => setPhase('onboarding')} />;
  }
  if (phase === 'onboarding') {
    return <DNCOnboarding onBack={() => setPhase('dashboard')} onNew={startNew} />;
  }

  return (
    <DNCWizardLayout
      step={step}
      onStepChange={(s) => setStep(s)}
      onBackToList={() => setPhase('dashboard')}
    >
      {step === 1 && (
        <DNCStepDatos data={empresa} onChange={setEmpresa} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <DNCStepParticipantes
          alcance={alcance}
          onAlcanceChange={setAlcance}
          modelo={modelo}
          onModeloChange={setModelo}
          participants={participants}
          onParticipantsChange={setParticipants}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <DNCStepAreasTematicas
          state={areasState}
          onChange={setAreasState}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <DNCStepDisenoEncuesta
          state={surveyDesign}
          onChange={setSurveyDesign}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step >= 5 && (
        <Card className="p-10 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-3xl">🚧</div>
          <h2 className="text-xl font-bold text-foreground">Paso {step} en construcción</h2>
          <p className="text-sm text-muted-foreground">Esta sección será implementada próximamente.</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
            {step < 6 && (
              <Button className="gap-2" onClick={() => setStep(step + 1)}>
                Siguiente <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            {step === 6 && (
              <Button onClick={() => setPhase('dashboard')}>Finalizar</Button>
            )}
          </div>
        </Card>
      )}
    </DNCWizardLayout>
  );
};

export default DNC;
