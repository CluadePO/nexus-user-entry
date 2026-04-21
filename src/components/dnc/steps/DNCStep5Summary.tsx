import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Edit, Rocket, CheckCircle2, Mail, Users, Calendar,
  LayoutGrid, SlidersHorizontal, Building2, Settings, PartyPopper,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
  onEdit: (step: number) => void;
  empresaData: {
    razonSocial: string;
    rut: string;
    giro: string;
    region: string;
    contactoNombre: string;
    contactoEmail: string;
  };
  participantsCount: number;
  modalidadEstudio: string | null;
  selectedRules: string[];
  surveyConfig: {
    numAreas: string;
    maxTemas: number;
    fechaInicio: string;
    fechaCierre: string;
    modalidades: string[];
    mesPreferencia: string;
    necesitaMasEspacios: boolean | null;
  };
}

const RULE_LABELS: Record<string, string> = {
  jefatura_designa: 'Jefatura designa cursos',
  jefatura_y_auto: 'Jefatura designa + autoasignación',
  jefatura_autoeval: 'Jefatura designa + autoevaluación',
  flujo_completo: 'Flujo completo',
};

const MODALIDAD_LABELS: Record<string, string> = {
  cargo: 'Por Cargo',
  persona: 'Por Persona',
  area: 'Por Área / Departamento / Gerencia',
};

const DNCStep5Summary: React.FC<Props> = ({
  onBack, onEdit, empresaData, participantsCount,
  modalidadEstudio, selectedRules, surveyConfig,
}) => {
  const [launched, setLaunched] = useState(false);

  const handleLaunch = () => {
    setLaunched(true);
    toast.success('¡Proceso DNC iniciado exitosamente!');
  };

  if (launched) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <PartyPopper className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">¡Proceso DNC iniciado!</h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          Las encuestas han sido enviadas a <strong>{participantsCount} participantes</strong>. 
          Podrás monitorear el avance desde el historial de procesos.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 gap-1 py-1.5 px-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {participantsCount} correos enviados
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 gap-1 py-1.5 px-3">
            <Calendar className="w-3.5 h-3.5" />
            Cierre: {surveyConfig.fechaCierre ? new Date(surveyConfig.fechaCierre).toLocaleDateString('es-CL') : '—'}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Resumen de Pre-vuelo</h2>
        <p className="text-muted-foreground text-sm">Revisa toda la configuración antes de iniciar el proceso DNC.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{participantsCount}</p>
          <p className="text-xs text-muted-foreground">Correos a enviar</p>
        </Card>
        <Card className="p-4 text-center">
          <LayoutGrid className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{surveyConfig.numAreas}</p>
          <p className="text-xs text-muted-foreground">Áreas de formación</p>
        </Card>
        <Card className="p-4 text-center">
          <SlidersHorizontal className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{surveyConfig.maxTemas}</p>
          <p className="text-xs text-muted-foreground">Temas máx. por persona</p>
        </Card>
        <Card className="p-4 text-center">
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground">
            {surveyConfig.fechaInicio ? new Date(surveyConfig.fechaInicio).toLocaleDateString('es-CL') : '—'}
          </p>
          <p className="text-xs text-muted-foreground">Fecha de inicio</p>
        </Card>
      </div>

      {/* Empresa */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Datos de Empresa</h3>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => onEdit(2)}>
            <Edit className="w-3.5 h-3.5" /> Editar
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div><p className="text-xs text-muted-foreground">Razón Social</p><p className="font-medium">{empresaData.razonSocial || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">RUT</p><p className="font-medium font-mono">{empresaData.rut || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Giro</p><p className="font-medium">{empresaData.giro || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Región</p><p className="font-medium">{empresaData.region || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Contacto</p><p className="font-medium">{empresaData.contactoNombre || '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Email contacto</p><p className="font-medium">{empresaData.contactoEmail || '—'}</p></div>
        </div>
      </Card>

      {/* Config negocio */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Configuración del Negocio</h3>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => onEdit(3)}>
            <Edit className="w-3.5 h-3.5" /> Editar
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Modalidad del estudio</p>
            <p className="font-medium">{modalidadEstudio ? MODALIDAD_LABELS[modalidadEstudio] : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Reglas de asignación</p>
            <div className="flex flex-wrap gap-2">
              {selectedRules.map(r => (
                <Badge key={r} variant="secondary" className="text-xs">{RULE_LABELS[r] || r}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Participantes cargados</p>
            <p className="font-medium">{participantsCount}</p>
          </div>
        </div>
      </Card>

      {/* Encuesta */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Estructura de Levantamiento</h3>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => onEdit(4)}>
            <Edit className="w-3.5 h-3.5" /> Editar
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div><p className="text-xs text-muted-foreground">Áreas</p><p className="font-medium">{surveyConfig.numAreas}</p></div>
          <div><p className="text-xs text-muted-foreground">Máx. temas</p><p className="font-medium">{surveyConfig.maxTemas}</p></div>
          <div><p className="text-xs text-muted-foreground">Fecha inicio</p><p className="font-medium">{surveyConfig.fechaInicio ? new Date(surveyConfig.fechaInicio).toLocaleDateString('es-CL') : '—'}</p></div>
          <div><p className="text-xs text-muted-foreground">Fecha cierre</p><p className="font-medium">{surveyConfig.fechaCierre ? new Date(surveyConfig.fechaCierre).toLocaleDateString('es-CL') : '—'}</p></div>
          <div>
            <p className="text-xs text-muted-foreground">Modalidades</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {surveyConfig.modalidades.map(m => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}
            </div>
          </div>
          <div><p className="text-xs text-muted-foreground">Mes preferencia</p><p className="font-medium">{surveyConfig.mesPreferencia || '—'}</p></div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" size="lg" onClick={handleLaunch}>
          <Rocket className="w-4 h-4" /> Confirmar e iniciar DNC
        </Button>
      </div>
    </div>
  );
};

export default DNCStep5Summary;
