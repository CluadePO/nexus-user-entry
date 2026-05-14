import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
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
import DNCSuccess from '@/components/dnc/DNCSuccess';
import DNCTrackingDashboard from '@/components/dnc/DNCTrackingDashboard';
import { toast } from 'sonner';

type Phase = 'dashboard' | 'onboarding' | 'wizard' | 'success' | 'tracking';

const emptyEmpresa: EmpresaDataStep1 = {
  razonSocial: '', rut: '', nombreProceso: '', rubro: '', region: '',
  ciudad: '', responsable: '', email: '', telefono: '',
};

const DNC: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('dashboard');
  const [step, setStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [empresa, setEmpresa] = useState<EmpresaDataStep1>(emptyEmpresa);
  const [alcance, setAlcance] = useState<Alcance | null>(null);
  const [modelo, setModelo] = useState<ModeloAsignacion | null>(null);
  const [participants, setParticipants] = useState<ParticipanteSimple[]>([]);
  const [areasState, setAreasState] = useState<AreasState>({});
  const [surveyDesign, setSurveyDesign] = useState<SurveyDesignState>(defaultSurveyDesign());
  const [comunicacion, setComunicacion] = useState<ComunicacionState>(defaultComunicacion());

  const startNew = () => { setStep(1); setEditMode(false); setPhase('wizard'); };
  const dncName = empresa.nombreProceso || 'DNC Constructora Arenas 2025';

  const handleEditFromSummary = (s: number) => {
    setEditMode(true);
    setStep(s);
  };

  const handleSaveAndReturn = () => {
    setEditMode(false);
    setStep(6);
    toast.success('Cambios guardados');
  };

  if (phase === 'dashboard') {
    return <DNCDashboard onNew={startNew} onOpenOnboarding={() => setPhase('onboarding')} onOpenTracking={() => setPhase('tracking')} />;
  }
  if (phase === 'onboarding') {
    return <DNCOnboarding onBack={() => setPhase('dashboard')} onNew={startNew} />;
  }
  if (phase === 'success') {
    return <DNCSuccess dncName={dncName} onViewTracking={() => setPhase('tracking')} onBackToList={() => setPhase('dashboard')} />;
  }
  if (phase === 'tracking') {
    return <DNCTrackingDashboard dncName={dncName} onBack={() => setPhase('dashboard')} />;
  }

  return (
    <DNCWizardLayout
      step={step}
      onStepChange={(s) => { if (!editMode) setStep(s); }}
      onBackToList={() => { setEditMode(false); setPhase('dashboard'); }}
    >
      {editMode && step !== 6 && (
        <div className="mb-4 flex items-center justify-between gap-4 p-3 rounded-lg border-2 border-primary/40 bg-primary/5">
          <div className="flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4 text-primary" />
            <span className="text-foreground">
              Editando desde el <strong>resumen</strong>. Guarda los cambios para volver al paso 6.
            </span>
          </div>
          <Button size="sm" className="gap-2" onClick={handleSaveAndReturn}>
            <Save className="w-4 h-4" /> Guardar y volver al resumen
          </Button>
        </div>
      )}
      {step === 1 && (
        <DNCStepDatos data={empresa} onChange={setEmpresa} onNext={() => editMode ? handleSaveAndReturn() : setStep(2)} />
      )}
      {step === 2 && (
        <DNCStepParticipantes
          alcance={alcance}
          onAlcanceChange={setAlcance}
          modelo={modelo}
          onModeloChange={setModelo}
          participants={participants}
          onParticipantsChange={setParticipants}
          onNext={() => editMode ? handleSaveAndReturn() : setStep(3)}
          onBack={() => editMode ? handleSaveAndReturn() : setStep(1)}
        />
      )}
      {step === 3 && (
        <DNCStepAreasTematicas
          state={areasState}
          onChange={setAreasState}
          onNext={() => editMode ? handleSaveAndReturn() : setStep(4)}
          onBack={() => editMode ? handleSaveAndReturn() : setStep(2)}
        />
      )}
      {step === 4 && (
        <DNCStepDisenoEncuesta
          state={surveyDesign}
          onChange={setSurveyDesign}
          onNext={() => editMode ? handleSaveAndReturn() : setStep(5)}
          onBack={() => editMode ? handleSaveAndReturn() : setStep(3)}
        />
      )}
      {step === 5 && (
        <DNCStepComunicacion
          state={comunicacion}
          onChange={setComunicacion}
          responsableEmail={empresa.email}
          onNext={() => editMode ? handleSaveAndReturn() : setStep(6)}
          onBack={() => editMode ? handleSaveAndReturn() : setStep(4)}
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
          onEdit={handleEditFromSummary}
          onConfirm={() => { setEditMode(false); setPhase('success'); }}
        />
      )}
    </DNCWizardLayout>
  );
};

export default DNC;
