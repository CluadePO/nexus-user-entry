import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import TermsSignatureModal from '@/components/dnc/TermsSignatureModal';
import DNCConfiguracion from '@/components/dnc/DNCConfiguracion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  PlayCircle, 
  ClipboardList, 
  BarChart3, 
  BookOpen, 
  ArrowRight, 
  Users, 
  Target, 
  TrendingUp,
  CheckCircle2,
  Info
} from 'lucide-react';

const processSteps = [
  {
    step: 1,
    title: 'Diagnóstico',
    description: 'Se aplican encuestas y evaluaciones a los colaboradores para identificar brechas de competencias.',
    icon: ClipboardList,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    step: 2,
    title: 'Análisis',
    description: 'Los datos recopilados se procesan para detectar las áreas con mayor necesidad de formación.',
    icon: BarChart3,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    step: 3,
    title: 'Recomendación',
    description: 'Se genera un resumen con los cursos recomendados según las necesidades detectadas.',
    icon: BookOpen,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
];

const benefits = [
  { icon: Target, title: 'Capacitación focalizada', description: 'Identifica exactamente qué competencias necesitan reforzarse en tu equipo.' },
  { icon: Users, title: 'Participación activa', description: 'Los colaboradores responden encuestas que alimentan el diagnóstico de forma directa.' },
  { icon: TrendingUp, title: 'Mejor ROI', description: 'Invierte en formación que realmente impacta en el desempeño organizacional.' },
  { icon: CheckCircle2, title: 'Cursos recomendados', description: 'Obtén un listado de cursos alineados a las brechas detectadas, listo para gestionar.' },
];

const DNC: React.FC = () => {
  const [showTerms, setShowTerms] = useState(false);

  const handleSigned = () => {
    // TODO: proceed to DNC configuration
    console.log('Document signed, proceeding with DNC');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-xs font-medium">
              <Info className="w-3 h-3 mr-1" />
              Diagnóstico de Necesidades de Capacitación
            </Badge>
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              Detecta las necesidades de formación de tu equipo
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              El proceso de <strong>DNC</strong> permite recopilar información directamente de los colaboradores
              a través de encuestas y evaluaciones, para luego analizar los resultados y generar un
              <strong> resumen de cursos recomendados</strong> que se alinean con las brechas de competencias detectadas.
            </p>
            <div className="flex gap-3 pt-2">
              <Button className="gap-2" onClick={() => setShowTerms(true)}>
                <ClipboardList className="w-4 h-4" />
                Iniciar Diagnóstico
              </Button>
              <Button variant="outline" className="gap-2">
                Ver resultados anteriores
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="relative">
            <Card className="overflow-hidden border-2 border-dashed border-primary/30 bg-muted/50">
              <div className="aspect-video flex flex-col items-center justify-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-foreground">Video explicativo del proceso DNC</p>
                  <p className="text-sm text-muted-foreground">
                    Conoce paso a paso cómo funciona el diagnóstico de necesidades de capacitación
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Reproducir video
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">¿Cómo funciona el proceso?</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            El DNC se desarrolla en tres etapas que permiten transformar las respuestas de los encuestados en recomendaciones concretas de formación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {processSteps.map((step, index) => (
            <Card key={step.step} className="relative p-6 hover:shadow-md transition-shadow border">
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground/40" />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${step.color}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Paso {step.step}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground text-center">Beneficios del DNC</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-5 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">¿Necesitas ayuda para comenzar?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Si es la primera vez que realizas un DNC, te recomendamos ver el video explicativo y revisar la
              documentación complementaria. También puedes contactar a tu asesor para recibir orientación
              personalizada sobre cómo configurar y aplicar las encuestas a tu equipo.
            </p>
          </div>
        </div>
      </Card>
      <TermsSignatureModal open={showTerms} onOpenChange={setShowTerms} onSigned={handleSigned} />
    </div>
  );
};

export default DNC;
