import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    id: 'faq-1',
    question: '¿De qué manera puedo contactarme con el proveedor que imparte el curso?',
    answer: 'Dentro del detalle del curso, podrá visualizar una opción llamada "Cotizar curso" donde podrá enviar una solicitud al proveedor indicando la cantidad de participantes que le interesaría inscribir y escribirle un mensaje para que el organismo técnico tome contacto con usted.'
  },
  {
    id: 'faq-2',
    question: '¿Cómo puedo saber las fechas en que el curso será ejecutado?',
    answer: 'Las fechas de realización dependerán de la programación que estipule el organismo técnico, por ende, debe solicitar la información directamente al proveedor a través de la opción "Cotizar curso".'
  },
  {
    id: 'faq-3',
    question: '¿Qué información me arroja el simulador?',
    answer: 'El simulador le permite ingresar la cantidad de participantes que le interesa inscribir al curso según su tramo de franquicia y el sistema calculará automáticamente el monto franquiciable, costo empresa y costo total del curso.'
  },
  {
    id: 'faq-4',
    question: '¿Cómo puedo comparar cursos?',
    answer: 'En el menú principal del buscador tiene disponible el botón "Comparar" en la parte inferior de cada curso, donde podrá seleccionar los cursos que desea comparar. Podrá elegir un máximo de 3 cursos para realizar la comparación.'
  },
  {
    id: 'faq-5',
    question: '¿De dónde se obtiene la información de los cursos de capacitación?',
    answer: 'La fuente de información de cursos con franquicia se obtienen directamente de reportes entregados por el sence sobre los cursos que tengan código sence vigente, sin embargo, existe la opción de que el proveedor cargue cursos sence manualmente en caso que no se encuentre en dicho reporte. Respecto a los cursos no sence, estos son cargados directamente por cada organismo técnico.'
  },
  {
    id: 'faq-6',
    question: '¿Solo se pueden buscar cursos con franquicia?',
    answer: 'No, el sistema cuenta con ofertas de capacitación de cursos sence y no sence, por lo que se pueden buscar y cotizar ambos tipos de cursos.'
  },
  {
    id: 'faq-7',
    question: '¿Existe un quorum mínimo de participantes para que los cursos sean realizados?',
    answer: 'Eso dependerá de las condiciones que aplique el organismo técnico. Dentro del detalle del curso, el proveedor puede informar si el curso requiere de un quorum mínimo, sin embargo, no es algo que aplique en todos los cursos. En caso de necesitar dicha información deberá contactarse con el proveedor.'
  },
];

const FAQStickyPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Scroll to button when opening to ensure visibility
    if (newState && buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  };

  return (
    <div className="w-full mt-8 pb-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Expanded Panel - appears above the button */}
        {isOpen && (
          <div className="bg-background border border-b-0 rounded-t-xl shadow-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Preguntas Frecuentes
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Aquí podrás encontrar respuestas a tus inquietudes, si persisten tus dudas, comunícate con nosotros.
              </p>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              <div className="p-4">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="border-b last:border-b-0">
                      <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        )}

        {/* Tab Button - always at the bottom */}
        <Button
          ref={buttonRef}
          onClick={handleToggle}
          className={`w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center gap-2 ${
            isOpen ? 'rounded-t-none rounded-b-lg' : 'rounded-lg'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span className="font-medium">Preguntas Frecuentes</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 ml-1" />
          ) : (
            <ChevronUp className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FAQStickyPanel;
