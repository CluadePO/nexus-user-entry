import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowLeft, Zap, BarChart3, Target, Settings, Users, PenLine, LineChart, Plus } from 'lucide-react';

interface Props {
  onBack: () => void;
  onNew: () => void;
}

const DNCOnboarding: React.FC<Props> = ({ onBack, onNew }) => {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="text-primary">DNC</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>¿Qué es una DNC?</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button variant="ghost" size="sm" className="gap-2 -ml-2" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" /> Volver al listado
      </Button>

      {/* Hero */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h1 className="text-2xl font-bold text-foreground">¿Qué es una Detección de Necesidades de Capacitación?</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-3xl">
          Es la herramienta que permite identificar brechas de conocimiento y diseñar un plan de formación enfocado en lo que tu organización realmente necesita.
        </p>
      </Card>

      {/* Definición y propósito */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-2">¿Qué es una DNC?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La <strong className="text-foreground">Detección de Necesidades de Capacitación (DNC)</strong> es un proceso sistemático que ayuda a identificar la brecha entre las competencias actuales de tu equipo y las que tu negocio necesita para crecer. Se ejecuta mediante encuestas dirigidas a colaboradores y jefaturas, entregando una visión completa y confiable de las necesidades formativas.
          </p>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-foreground mb-2">¿Para qué sirve?</h3>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>Prioriza las inversiones en capacitación según el impacto real en el negocio.</li>
            <li>Alinea el plan formativo con la estrategia de tu empresa.</li>
            <li>Detecta áreas críticas que requieren atención inmediata.</li>
            <li>Justifica tu presupuesto de formación con datos concretos.</li>
            <li>Mejora el desempeño y la satisfacción de tu equipo.</li>
          </ul>
        </Card>
      </div>

      {/* Beneficios */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Beneficios principales</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Zap, title: 'Configurar', desc: 'Define las áreas, temáticas y participantes que quieres evaluar.' },
            { icon: BarChart3, title: 'Asignar', desc: 'Carga tu nómina y elige cómo se distribuirá la encuesta.' },
            { icon: Target, title: 'Foco estratégico', desc: 'Identifica y prioriza las capacitaciones que generan mayor impacto.' },
          ].map(b => (
            <Card key={b.title} className="p-5">
              <b.icon className="w-6 h-6 text-primary mb-3" />
              <p className="font-semibold text-foreground">{b.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* ¿Cómo funciona? */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">¿Cómo funciona?</h2>
        <Card className="p-6">
          <div className="grid grid-cols-4 gap-2 relative">
            {[
              { icon: Settings, title: 'Configurar', desc: 'Define empresa, áreas y temáticas a evaluar.' },
              { icon: Users, title: 'Asignar', desc: 'Carga la nómina y elige el modelo de asignación.' },
              { icon: PenLine, title: 'Responder', desc: 'Los participantes contestan la encuesta en línea.' },
              { icon: LineChart, title: 'Analizar', desc: 'Revisa resultados y descarga reportes detallados.' },
            ].map((s, i, arr) => (
              <div key={s.title} className="relative space-y-2">
                {i < arr.length - 1 && (
                  <div className="hidden md:block absolute top-3 left-[calc(50%+1rem)] right-[-50%] h-px bg-primary/30" />
                )}
                <div className="flex items-center gap-2 relative">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                    <s.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="font-semibold text-sm text-foreground">{s.title}</p>
                </div>
                <p className="text-xs text-muted-foreground pl-9">{s.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Preguntas frecuentes</h2>
        <Card className="p-2">
          <Accordion type="single" collapsible defaultValue="q1">
            <AccordionItem value="q1">
              <AccordionTrigger className="px-4 text-sm">¿Quién debe responder la DNC?</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                Todas las personas incluidas en la nómina cargada: colaboradores y jefaturas. Cada uno responde según el modelo de asignación definido durante la configuración.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="px-4 text-sm">¿Puedo modificar una DNC después de iniciada?</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                Una vez iniciada, sólo se pueden modificar las fechas de inicio y cierre. La configuración de áreas y participantes queda fija.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="px-4 text-sm">¿Qué pasa si ya respondieron encuestas?</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                Las respuestas quedan registradas. Si reabres el proceso, se conservan los avances anteriores.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="px-4 text-sm">¿Cómo se usan los resultados?</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                Los resultados alimentan el plan anual de capacitación, permitiendo priorizar cursos según las brechas detectadas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger className="px-4 text-sm">¿Cuánto dura el proceso típico?</AccordionTrigger>
              <AccordionContent className="px-4 text-sm text-muted-foreground">
                Entre 2 y 4 semanas, dependiendo del tamaño de la organización y el modelo de asignación elegido.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>

      {/* CTA */}
      <Card className="p-6 bg-foreground text-background flex flex-col items-center text-center gap-3">
        <h3 className="text-lg font-bold">¿Listo para comenzar?</h3>
        <p className="text-sm opacity-80">Configura tu primer diagnóstico en pocos minutos.</p>
        <Button className="gap-2" onClick={onNew}><Plus className="w-4 h-4" /> Crear nueva DNC</Button>
      </Card>
    </div>
  );
};

export default DNCOnboarding;
