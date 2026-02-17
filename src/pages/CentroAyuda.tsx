import React, { useState } from 'react';
import { Search, BookOpen, Play, HelpCircle, BookA, ThumbsUp, ThumbsDown, ChevronDown, ChevronRight, ExternalLink, Clock, Eye, Tag, MessageSquare, Send, X, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// --- Mock Data ---
const articles = [
  { id: 1, title: 'Cómo inscribir un curso en la plataforma', category: 'Cursos', readTime: '5 min', views: 234, content: 'Para inscribir un curso en la plataforma, sigue estos pasos:\n\n1. Ingresa al módulo de Inscripción desde el menú lateral.\n2. Selecciona la empresa y el curso que deseas inscribir.\n3. Completa los datos del participante.\n4. Revisa la información y confirma la inscripción.\n\nRecuerda que debes tener los permisos necesarios para realizar inscripciones. Si tienes dudas, contacta a tu administrador.' },
  { id: 2, title: 'Gestión de Declaraciones Juradas (DJO)', category: 'Documentos', readTime: '8 min', views: 189, content: 'Las Declaraciones Juradas Online (DJO) son documentos esenciales para el proceso de capacitación.\n\n**¿Qué es una DJO?**\nEs un documento legal que certifica la información proporcionada por la OTEC respecto a un curso.\n\n**Estados posibles:**\n- Pendiente: En espera de revisión\n- Aprobada: Validada correctamente\n- Rechazada: Requiere correcciones\n\nPara presentar una DJO, accede al módulo de Gestión Documental.' },
  { id: 3, title: 'Entendiendo la Franquicia Tributaria SENCE', category: 'SENCE', readTime: '10 min', views: 456, content: 'La Franquicia Tributaria es un incentivo que permite a las empresas descontar de impuestos los gastos en capacitación.\n\n**Beneficios:**\n- Recuperación de hasta el 1% de la planilla de remuneraciones\n- Formación continua para trabajadores\n- Mejora de competencias laborales\n\n**Requisitos:**\n- Empresa contribuyente de Primera Categoría\n- Curso registrado en SENCE\n- Comunicación oportuna al organismo' },
  { id: 4, title: 'Cómo usar el Buscador de Cursos', category: 'Herramientas', readTime: '4 min', views: 312, content: 'El Buscador de Cursos te permite encontrar la oferta formativa disponible.\n\n**Filtros disponibles:**\n- Por modalidad (presencial, e-learning, b-learning)\n- Por región y comuna\n- Por rango de precios\n- Por OTEC proveedor\n\n**Tips:**\n- Usa palabras clave específicas\n- Guarda tus búsquedas favoritas\n- Compara hasta 3 cursos simultáneamente' },
  { id: 5, title: 'Proceso de Liquidación SENCE', category: 'SENCE', readTime: '12 min', views: 278, content: 'La liquidación es el proceso final para recuperar la inversión en capacitación.\n\n**Etapas:**\n1. Cierre del curso en plataforma\n2. Generación de documentación\n3. Envío a SENCE\n4. Revisión y aprobación\n5. Aplicación del descuento tributario\n\n**Plazos importantes:**\n- Comunicación: dentro de los plazos SENCE\n- Liquidación: 60 días hábiles post-término' },
  { id: 6, title: 'Roles y Permisos de Usuario', category: 'Administración', readTime: '6 min', views: 145, content: 'La plataforma maneja diferentes roles con permisos específicos:\n\n**OTIC:** Acceso completo a administración y gestión\n**OTEC:** Gestión de cursos y documentación\n**Empresa:** Inscripción y seguimiento\n**Asesor:** Herramientas de diagnóstico y recomendación\n\nCada rol tiene un dashboard personalizado con métricas relevantes.' },
];

const videoCapsules = [
  { id: 1, title: 'Tutorial: Inscripción de Cursos paso a paso', duration: '3:45', category: 'Cursos', thumbnail: '🎓', views: 567 },
  { id: 2, title: 'Cómo generar una DJO correctamente', duration: '5:20', category: 'Documentos', thumbnail: '📄', views: 423 },
  { id: 3, title: 'Navegando el Dashboard OTIC', duration: '4:10', category: 'Dashboard', thumbnail: '📊', views: 389 },
  { id: 4, title: 'Uso del Recomendador de Cursos', duration: '2:55', category: 'Herramientas', thumbnail: '✨', views: 298 },
  { id: 5, title: 'Proceso de Facturación explicado', duration: '6:30', category: 'Facturación', thumbnail: '💰', views: 201 },
  { id: 6, title: 'Configuración de Carteras Comerciales', duration: '4:50', category: 'Administración', thumbnail: '💼', views: 176 },
];

const faqs = [
  { id: 1, question: '¿Cómo recupero mi contraseña?', answer: 'Para recuperar tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión. Recibirás un correo electrónico con un enlace para restablecer tu contraseña. El enlace tiene una validez de 24 horas.', category: 'Cuenta' },
  { id: 2, question: '¿Cuántos participantes puedo inscribir en un curso?', answer: 'El número máximo de participantes depende de la capacidad del curso definida por la OTEC. Generalmente, los cursos presenciales tienen un límite de 25 participantes y los cursos e-learning pueden tener hasta 100.', category: 'Cursos' },
  { id: 3, question: '¿Qué hago si mi DJO fue rechazada?', answer: 'Si tu DJO fue rechazada, revisa las observaciones indicadas en el detalle del rechazo. Corrige los errores señalados y vuelve a presentar la declaración. Si tienes dudas sobre las observaciones, contacta a tu ejecutivo OTIC.', category: 'Documentos' },
  { id: 4, question: '¿Cómo puedo ver el estado de mis cursos?', answer: 'Accede al módulo "Cursos y Servicios" > "Resumen" para ver el estado actualizado de todos tus cursos. Puedes filtrar por estado (activo, ejecutado, cerrado) y por período.', category: 'Cursos' },
  { id: 5, question: '¿Cuál es el plazo para comunicar un curso a SENCE?', answer: 'La comunicación a SENCE debe realizarse al menos 2 días hábiles antes del inicio del curso. Para cursos e-learning, el plazo puede variar. Consulta la normativa vigente en el sitio web de SENCE.', category: 'SENCE' },
  { id: 6, question: '¿Cómo solicito soporte técnico?', answer: 'Puedes solicitar soporte técnico a través del módulo OTICKET en "Ayuda y Soporte". Describe tu problema con el mayor detalle posible y adjunta capturas de pantalla si es necesario. Nuestro equipo responderá en un plazo máximo de 24 horas hábiles.', category: 'Soporte' },
  { id: 7, question: '¿Puedo modificar una inscripción ya confirmada?', answer: 'Sí, puedes modificar una inscripción siempre que el curso no haya iniciado. Accede al detalle de la inscripción y selecciona "Editar". Los cambios quedarán registrados en el historial del curso.', category: 'Cursos' },
  { id: 8, question: '¿Qué es la Franquicia Tributaria?', answer: 'Es un incentivo fiscal que permite a las empresas contribuyentes de Primera Categoría descontar del impuesto a la renta los gastos incurridos en capacitación de sus trabajadores, hasta el equivalente al 1% de la planilla anual de remuneraciones.', category: 'SENCE' },
];

const glossary = [
  { term: 'DJO', definition: 'Declaración Jurada Online. Documento digital que certifica la veracidad de la información proporcionada respecto a actividades de capacitación.' },
  { term: 'DJP', definition: 'Declaración Jurada de Participantes. Documento que valida la asistencia y participación de los trabajadores en un curso.' },
  { term: 'Franquicia Tributaria', definition: 'Incentivo fiscal que permite a las empresas descontar de impuestos los gastos realizados en programas de capacitación para sus trabajadores.' },
  { term: 'LCE', definition: 'Liquidación de Curso de Empresa. Proceso de cierre financiero de un curso para la recuperación de la inversión vía franquicia tributaria.' },
  { term: 'OC', definition: 'Orden de Compra. Documento comercial que formaliza la contratación de servicios de capacitación entre la empresa y la OTEC.' },
  { term: 'OTIC', definition: 'Organismo Técnico Intermedio para Capacitación. Entidad que intermedia entre empresas y OTECs para gestionar la capacitación laboral.' },
  { term: 'OTEC', definition: 'Organismo Técnico de Capacitación. Entidad autorizada por SENCE para impartir actividades de capacitación.' },
  { term: 'SENCE', definition: 'Servicio Nacional de Capacitación y Empleo. Organismo público encargado de regular y promover la capacitación laboral en Chile.' },
  { term: 'Comunicación SENCE', definition: 'Proceso de notificación obligatoria a SENCE sobre la realización de un curso de capacitación con franquicia tributaria.' },
  { term: 'Liquidación SENCE', definition: 'Proceso mediante el cual se rinde cuenta a SENCE sobre la ejecución de un curso para efectos de aplicar la franquicia tributaria.' },
  { term: 'Malla de Formación', definition: 'Estructura organizada de cursos y actividades de capacitación diseñada para desarrollar competencias específicas en un área determinada.' },
  { term: 'Plan de Capacitación', definition: 'Documento estratégico que define las necesidades, objetivos y actividades de capacitación planificadas para un período determinado.' },
  { term: 'DNC', definition: 'Detección de Necesidades de Capacitación. Proceso sistemático para identificar las brechas de competencias en una organización.' },
  { term: 'Cartera Comercial', definition: 'Agrupación de empresas asignadas a un equipo comercial específico para su gestión y atención.' },
];

// --- Feedback Component ---
const FeedbackWidget: React.FC<{ contentType: string; contentId: number; contentTitle: string }> = ({ contentType, contentId, contentTitle }) => {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleVote = (type: 'up' | 'down') => {
    setVoted(type);
    if (type === 'down') setShowComment(true);
    else {
      toast.success('¡Gracias por tu feedback!');
      setSubmitted(true);
    }
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    toast.success('¡Gracias! Tu comentario nos ayuda a mejorar.');
    setSubmitted(true);
    setShowComment(false);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t border-border mt-4">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span>Gracias por tu valoración</span>
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-border mt-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">¿Te resultó útil?</span>
        <Button variant={voted === 'up' ? 'default' : 'outline'} size="sm" onClick={() => handleVote('up')} className="h-8 gap-1.5">
          <ThumbsUp className="h-3.5 w-3.5" /> Sí
        </Button>
        <Button variant={voted === 'down' ? 'destructive' : 'outline'} size="sm" onClick={() => handleVote('down')} className="h-8 gap-1.5">
          <ThumbsDown className="h-3.5 w-3.5" /> No
        </Button>
      </div>
      {showComment && (
        <div className="space-y-2">
          <Textarea
            placeholder="¿Cómo podemos mejorar este contenido?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-sm min-h-[80px]"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => { setShowComment(false); setVoted(null); }}>Cancelar</Button>
            <Button size="sm" onClick={handleSubmitComment} className="gap-1.5">
              <Send className="h-3.5 w-3.5" /> Enviar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
const CentroAyuda: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<typeof videoCapsules[0] | null>(null);
  const [glossaryFilter, setGlossaryFilter] = useState('');

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videoCapsules.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlossary = glossary.filter(g =>
    g.term.toLowerCase().includes(glossaryFilter.toLowerCase() || searchQuery.toLowerCase()) ||
    g.definition.toLowerCase().includes(glossaryFilter.toLowerCase() || searchQuery.toLowerCase())
  );

  const categoryColors: Record<string, string> = {
    Cursos: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Documentos: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    SENCE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Herramientas: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    Administración: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    Dashboard: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    Facturación: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Cuenta: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
    Soporte: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Centro de Ayuda</h1>
        <p className="text-muted-foreground mt-1">Encuentra respuestas, tutoriales y recursos para aprovechar al máximo la plataforma</p>
      </div>

      {/* Global Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar en artículos, videos, preguntas frecuentes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
        {searchQuery && (
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0" onClick={() => setSearchQuery('')}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: 'Artículos', count: articles.length, color: 'text-blue-500' },
          { icon: Play, label: 'Cápsulas de Video', count: videoCapsules.length, color: 'text-red-500' },
          { icon: HelpCircle, label: 'Preguntas Frecuentes', count: faqs.length, color: 'text-amber-500' },
          { icon: BookA, label: 'Términos en Glosario', count: glossary.length, color: 'text-green-500' },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="articulos" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="articulos" className="gap-1.5">
            <BookOpen className="h-4 w-4" /> Artículos
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-1.5">
            <Play className="h-4 w-4" /> Cápsulas de Video
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-1.5">
            <HelpCircle className="h-4 w-4" /> Preguntas Frecuentes
          </TabsTrigger>
          <TabsTrigger value="glosario" className="gap-1.5">
            <BookA className="h-4 w-4" /> Glosario
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articulos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="border border-border hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedArticle(article)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className={`text-xs ${categoryColors[article.category] || ''}`}>
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2 group-hover:text-primary transition-colors leading-snug">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views} vistas</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No se encontraron artículos para "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="border border-border hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedVideo(video)}>
                <CardContent className="p-0">
                  <div className="bg-muted/60 h-36 flex items-center justify-center rounded-t-lg relative">
                    <span className="text-5xl">{video.thumbnail}</span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors rounded-t-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Play className="h-5 w-5 text-primary-foreground ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">{video.duration}</Badge>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors leading-snug">{video.title}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="secondary" className={`text-xs ${categoryColors[video.category] || ''}`}>{video.category}</Badge>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {video.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredVideos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No se encontraron videos para "{searchQuery}"</p>
            </div>
          )}
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card className="border border-border">
            <CardContent className="p-6">
              <Accordion type="multiple" className="space-y-2">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
                      <div className="flex items-start gap-3 pr-4">
                        <HelpCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <span>{faq.question}</span>
                          <Badge variant="secondary" className={`ml-2 text-xs ${categoryColors[faq.category] || ''}`}>{faq.category}</Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4 pl-7">
                      <p className="leading-relaxed">{faq.answer}</p>
                      <FeedbackWidget contentType="faq" contentId={faq.id} contentTitle={faq.question} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No se encontraron preguntas para "{searchQuery}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Glossary Tab */}
        <TabsContent value="glosario" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar términos..."
              value={glossaryFilter}
              onChange={(e) => setGlossaryFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Card className="border border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredGlossary.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="font-mono text-xs mt-0.5 flex-shrink-0">{item.term}</Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.definition}</p>
                    </div>
                  </div>
                ))}
              </div>
              {filteredGlossary.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookA className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No se encontraron términos para "{glossaryFilter || searchQuery}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Article Detail Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={`text-xs ${categoryColors[selectedArticle?.category || ''] || ''}`}>
                {selectedArticle?.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedArticle?.readTime}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" /> {selectedArticle?.views} vistas</span>
            </div>
            <DialogTitle className="text-xl">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[55vh] pr-4">
            <div className="prose prose-sm max-w-none text-foreground">
              {selectedArticle?.content.split('\n').map((line, i) => (
                <p key={i} className={`${line.startsWith('**') ? 'font-semibold text-foreground mt-4' : 'text-muted-foreground'} ${line === '' ? 'h-2' : ''}`}>
                  {line.replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
            {selectedArticle && (
              <FeedbackWidget contentType="article" contentId={selectedArticle.id} contentTitle={selectedArticle.title} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Video Detail Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={`text-xs ${categoryColors[selectedVideo?.category || ''] || ''}`}>
                {selectedVideo?.category}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedVideo?.duration}</span>
            </div>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="bg-muted/60 rounded-lg h-64 flex flex-col items-center justify-center gap-3">
            <span className="text-6xl">{selectedVideo?.thumbnail}</span>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                <Play className="h-6 w-6 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Vista previa del video</p>
          </div>
          {selectedVideo && (
            <FeedbackWidget contentType="video" contentId={selectedVideo.id} contentTitle={selectedVideo.title} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CentroAyuda;
