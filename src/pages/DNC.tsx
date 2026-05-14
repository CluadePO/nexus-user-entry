import React, { useState } from 'react';
import DNCDashboard from '@/components/dnc/DNCDashboard';
import DNCOnboarding from '@/components/dnc/DNCOnboarding';
import DNCWizardLayout from '@/components/dnc/DNCWizardLayout';
import DNCStepDatos, { type EmpresaDataStep1 } from '@/components/dnc/steps/DNCStepDatos';
import DNCStepParticipantes, {
  type Alcance, type ModeloAsignacion, type ParticipanteSimple,
} from '@/components/dnc/steps/DNCStepParticipantes';
import DNCStepAreasTematicas, { type AreasState, AREAS } from '@/components/dnc/steps/DNCStepAreasTematicas';
import DNCStepDisenoEncuesta, { defaultSurveyDesign, type SurveyDesignState } from '@/components/dnc/steps/DNCStepDisenoEncuesta';
import DNCStepComunicacion, { defaultComunicacion, type ComunicacionState } from '@/components/dnc/steps/DNCStepComunicacion';
import DNCStepResumen from '@/components/dnc/steps/DNCStepResumen';

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
  const [comunicacion, setComunicacion] = useState<ComunicacionState>(defaultComunicacion());

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
      {step === 5 && (
        <DNCStepComunicacion
          state={comunicacion}
          onChange={setComunicacion}
          responsableEmail={empresa.email}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}
      {step === 6 && (
        <DNCStepResumen
          empresa={empresa}
          alcance={alcance}
          modelo={modelo}
          participants={participants}
          areasState={areasState}
          areasMeta={AREAS.map(a => ({ id: a.id, name: a.name, tematicas: a.tematicas }))}
          surveyDesign={surveyDesign}
          comunicacion={comunicacion}
          onBack={() => setStep(5)}
          onEdit={(s) => setStep(s)}
          onConfirm={() => setPhase('dashboard')}
        />
      )}
    </DNCWizardLayout>
  );
};

export default DNC;
