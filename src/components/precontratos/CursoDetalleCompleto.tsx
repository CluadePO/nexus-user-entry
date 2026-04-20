import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Download,
  Users,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  History,
  ChevronRight,
  Edit,
  CircleDashed,
  CircleCheck,
} from 'lucide-react';

interface CursoDetalleCompletoProps {
  numeroSC: string;
  onBack: () => void;
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div className="space-y-0.5">
    <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
    <p className={`text-sm text-foreground ${mono ? 'font-mono' : 'font-medium'}`}>
      {value || <span className="text-muted-foreground">—</span>}
    </p>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  accent?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, icon, accent = 'bg-primary/10 text-primary', children, action }) => (
  <Card className="overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/20">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${accent}`}>{icon}</div>
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      {action}
    </div>
    <CardContent className="p-5">{children}</CardContent>
  </Card>
);

const CursoDetalleCompleto: React.FC<CursoDetalleCompletoProps> = ({ numeroSC, onBack }) => {
  // Mock data basado en la imagen
  const curso = {
    idSence: '6751520',
    nombre: 'Aplicación de técnicas de desarrollo de habilidades de comunicación',
    idInscripcion: '2143402',
    codigoSence: '1238036801',
    sc: numeroSC || '2106374',
    oc: '—',
    diasRestantes: 47,
    diasParaLiquidar: 11,
    otec: 'Centro de Capacitacion Profesional Spa',
    rutOtec: '77302633-5',
    cliente: 'SOC.EDUCACIONAL MAGISTER LTDA',
    rutCliente: '79783050-K',
    participantesIniciales: 20,
    participantesActivos: 20,
    estadoSence: 'No encontrado',
    etapa: 'Por Emisión OC',
    beneficioMipyme: false,
    jefeComercial: 'Comercial 31',
    celula: 'CEL 9',
    fechaInicio: '05-01-2026',
    fechaTermino: '04-03-2026',
    fechaAsistencia: '—',
    fechaMaximaLiquidacion: '01-05-2026',
    dias: 'Lunes, Miércoles y Viernes',
    horario: '09:00 - 12:00 hrs, 13:00 - 15:30 hrs, 13:00 - 15:30 hrs',
    linea: 'Franquicia (Cuenta 1)',
    subLinea: 'Normal',
    modalidad: 'Distancia',
    contrato: 'Normal',
    parcialComplementario: 'Parcial Normal',
    montoFranquicia: 5460000,
    montoCostoEmpresa: 0,
    valorViatico: 0,
    valorPorParticipante: 273000,
    cuentaActual: 0,
    cuentaSiguiente: 5460000,
    region: 'REGION METROPOLITANA',
    comuna: 'SANTIAGO',
    direccion: 'Distancia',
    comentarios: 'Las 3 hrs. adicionales se generan dado que el sistema no permite ingresar horarios menores a 1/2 hr.',
    docsValidados: 1,
    docsRequeridos: 7,
    pendientes: 6,
    porcentajePendiente: 86,
    pendientesCarga: [
      { nombre: 'Ingreso de Asistencia', desc: '' },
      { nombre: 'DJP', desc: 'Declaración Jurada Participantes' },
      { nombre: 'Estado Sence Autorizado', desc: '' },
      { nombre: 'DJO', desc: 'Declaración Jurada OTEC' },
      { nombre: 'Aporte', desc: 'Disponibilidad del aporte en proceso' },
      { nombre: 'CI (Cédula de Identidad)', desc: 'Cédula de Identidad' },
    ],
    validados: [{ nombre: 'MDA Rectificaciones' }],
    historial: [
      { etapa: 'Requisitos', activa: true, items: [{ titulo: 'MDA Rectificaciones', fecha: '20 de abril de 2026', autor: 'sistema' }] },
      { etapa: 'Inscripción', activa: false, items: [] },
    ],
  };

  const formatCLP = (n: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-5">
      {/* Header sticky con info principal */}
      <Card className="overflow-hidden border-l-4 border-l-primary">
        <CardContent className="p-0">
          <div className="p-5 flex items-start justify-between flex-wrap gap-4 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
            <div className="flex items-start gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="mt-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Volver
              </Button>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono">
                    ID Sence {curso.idSence}
                  </Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    {curso.etapa}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700">
                    {curso.modalidad}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700">
                    {curso.linea}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-foreground leading-snug max-w-2xl">{curso.nombre}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Inscripción <span className="font-mono text-foreground">{curso.idInscripcion}</span> · Código Sence{' '}
                  <span className="font-mono text-foreground">{curso.codigoSence}</span> · SC{' '}
                  <span className="font-mono text-foreground">{curso.sc}</span> · OC{' '}
                  <span className="font-mono text-foreground">{curso.oc}</span>
                </p>
              </div>
            </div>

            {/* Mini stats */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 min-w-[110px]">
                <span className="text-2xl font-bold text-emerald-700 leading-none">{curso.diasParaLiquidar}</span>
                <span className="text-[10px] uppercase tracking-wide text-emerald-700 font-semibold mt-1">días</span>
                <span className="text-[10px] text-emerald-600 mt-0.5">para liquidar</span>
              </div>
              <div className="flex flex-col items-center justify-center px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 min-w-[110px]">
                <span className="text-2xl font-bold text-blue-700 leading-none">{curso.diasRestantes}</span>
                <span className="text-[10px] uppercase tracking-wide text-blue-700 font-semibold mt-1">días</span>
                <span className="text-[10px] text-blue-600 mt-0.5">término curso</span>
              </div>
            </div>
          </div>

          {/* Barra de progreso de requisitos */}
          <div className="px-5 py-4 border-t bg-background">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-foreground">
                  {curso.pendientes} Pendientes ({curso.porcentajePendiente}%)
                </span>
                <span className="text-xs text-muted-foreground">
                  · {curso.docsValidados} de {curso.docsRequeridos} documentos validados
                </span>
              </div>
              <Button size="sm">
                Actualizar requisitos pendientes <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <Progress value={(curso.docsValidados / curso.docsRequeridos) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-5">
          {/* Pendientes destacado */}
          <SectionCard
            title="Pendientes de Carga"
            icon={<AlertCircle className="w-4 h-4" />}
            accent="bg-destructive/10 text-destructive"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {curso.pendientesCarga.map((p) => (
                <div
                  key={p.nombre}
                  className="flex items-start justify-between gap-2 p-3 rounded-md border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.nombre}</p>
                    {p.desc && <p className="text-[11px] text-muted-foreground truncate">{p.desc}</p>}
                  </div>
                  <CircleDashed className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                </div>
              ))}
            </div>

            {curso.validados.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">Validados</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {curso.validados.map((v) => (
                    <div
                      key={v.nombre}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-md border border-emerald-200 bg-emerald-50"
                    >
                      <span className="text-sm font-medium text-emerald-900">{v.nombre}</span>
                      <CircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Información del curso */}
          <SectionCard
            title="Información del Curso"
            icon={<Building2 className="w-4 h-4" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InfoItem label="OTEC" value={curso.otec} />
              <InfoItem label="Rut OTEC" value={curso.rutOtec} mono />
              <InfoItem label="Cliente" value={curso.cliente} />
              <InfoItem label="Rut Cliente" value={curso.rutCliente} mono />
              <InfoItem
                label="Participantes Iniciales / Activos"
                value={
                  <span>
                    {curso.participantesIniciales} <span className="text-muted-foreground">/</span>{' '}
                    {curso.participantesActivos}
                  </span>
                }
              />
              <InfoItem
                label="Estado Sence"
                value={
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 font-normal">
                    {curso.estadoSence}
                  </Badge>
                }
              />
              <InfoItem label="Jefe Comercial" value={curso.jefeComercial} />
              <InfoItem label="Célula Op." value={curso.celula} />
              <InfoItem
                label="Beneficio Mi Pyme"
                value={
                  <Badge variant="outline" className={curso.beneficioMipyme ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                    {curso.beneficioMipyme ? 'Sí' : 'No'}
                  </Badge>
                }
              />
            </div>
          </SectionCard>

          {/* Fechas y horario */}
          <SectionCard title="Fechas y Horario" icon={<Calendar className="w-4 h-4" />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <InfoItem label="Fecha de Inicio" value={curso.fechaInicio} />
              <InfoItem label="Fecha de Término" value={curso.fechaTermino} />
              <InfoItem label="Fecha de Asistencia" value={curso.fechaAsistencia} />
              <InfoItem label="Fecha Máx. Liquidación" value={curso.fechaMaximaLiquidacion} />
            </div>
            <div className="rounded-md bg-muted/30 border p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Días</p>
                  <p className="text-sm font-medium">{curso.dias}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Horario</p>
                  <p className="text-sm font-medium">{curso.horario}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Tipo de curso */}
          <SectionCard title="Tipo de Curso" icon={<GraduationCap className="w-4 h-4" />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoItem label="Línea" value={curso.linea} />
              <InfoItem label="Sub-línea de trabajo" value={curso.subLinea} />
              <InfoItem
                label="Modalidad"
                value={
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-normal">
                    {curso.modalidad}
                  </Badge>
                }
              />
              <InfoItem label="Contrato" value={curso.contrato} />
              <InfoItem label="Parcial o Complementario" value={curso.parcialComplementario} />
            </div>
          </SectionCard>

          {/* Montos y financiamiento */}
          <SectionCard title="Montos y Financiamiento" icon={<DollarSign className="w-4 h-4" />} accent="bg-emerald-100 text-emerald-700">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-md border bg-emerald-50/50 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Monto Franquicia</p>
                <p className="text-base font-bold text-emerald-700 font-mono mt-1">{formatCLP(curso.montoFranquicia)}</p>
              </div>
              <div className="rounded-md border bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Costo Empresa</p>
                <p className="text-base font-bold font-mono mt-1">
                  {curso.montoCostoEmpresa > 0 ? formatCLP(curso.montoCostoEmpresa) : '—'}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Viático y Movilización</p>
                <p className="text-base font-bold font-mono mt-1">
                  {curso.valorViatico > 0 ? formatCLP(curso.valorViatico) : '—'}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Por Participante</p>
                <p className="text-base font-bold font-mono mt-1">{formatCLP(curso.valorPorParticipante)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-md border p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cuenta Actual</span>
                <span className="font-mono font-semibold">{curso.cuentaActual > 0 ? formatCLP(curso.cuentaActual) : '—'}</span>
              </div>
              <div className="rounded-md border p-3 flex items-center justify-between bg-primary/5 border-primary/20">
                <span className="text-sm font-medium">Cuenta del año siguiente</span>
                <span className="font-mono font-semibold text-primary">{formatCLP(curso.cuentaSiguiente)}</span>
              </div>
            </div>
          </SectionCard>

          {/* Solicitudes y Órdenes de Compra */}
          <SectionCard title="Solicitudes y Órdenes de Compra" icon={<FileText className="w-4 h-4" />}>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Solicitudes de Compra</p>
                <div className="flex items-center justify-between p-3 rounded-md border bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">Franquicia Normal</p>
                    <p className="text-xs text-muted-foreground font-mono">Nro. {curso.sc}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-3.5 h-3.5 mr-1" /> Descargar
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Órdenes de Compra</p>
                <div className="p-3 rounded-md border border-dashed text-center text-xs text-muted-foreground">
                  No hay órdenes de compra disponibles
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Lugar de realización */}
          <SectionCard title="Lugar de Realización" icon={<MapPin className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoItem label="Región" value={curso.region} />
              <InfoItem label="Comuna" value={curso.comuna} />
              <InfoItem label="Dirección" value={curso.direccion} />
            </div>
          </SectionCard>

          {/* Participantes, comentarios, plan, trazabilidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SectionCard
              title="Participantes"
              icon={<Users className="w-4 h-4" />}
              action={
                <Button size="sm" variant="outline">
                  <Users className="w-3.5 h-3.5 mr-1" /> Ver participantes
                </Button>
              }
            >
              <div className="text-center py-3">
                <p className="text-3xl font-bold text-primary">{curso.participantesActivos}</p>
                <p className="text-xs text-muted-foreground">Participantes activos</p>
              </div>
            </SectionCard>

            <SectionCard
              title="Plan de Capacitación Asociado"
              icon={<Briefcase className="w-4 h-4" />}
              action={
                <Button size="sm" variant="outline">
                  <Edit className="w-3.5 h-3.5 mr-1" /> Editar
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground text-center py-3">No existe relación</p>
            </SectionCard>
          </div>

          <SectionCard title="Comentarios" icon={<FileText className="w-4 h-4" />}>
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
              {curso.comentarios}
            </div>
          </SectionCard>

          <SectionCard
            title="Trazabilidad de Cambios"
            icon={<History className="w-4 h-4" />}
            accent="bg-blue-100 text-blue-700"
          >
            <p className="text-sm text-muted-foreground text-center py-2">Sin rectificaciones</p>
          </SectionCard>
        </div>

        {/* Sidebar derecho: histórico */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-4 space-y-5">
            <SectionCard
              title="Historial del Curso"
              icon={<Sparkles className="w-4 h-4" />}
              accent="bg-primary/10 text-primary"
            >
              <div className="space-y-4">
                {curso.historial.map((etapa, idx) => (
                  <div key={etapa.etapa}>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          etapa.activa
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground border'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className={`text-sm font-semibold ${etapa.activa ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {etapa.etapa}
                      </span>
                    </div>
                    {etapa.items.length > 0 && (
                      <div className="ml-3 pl-5 border-l-2 border-primary/30 space-y-2">
                        {etapa.items.map((item, i) => (
                          <div key={i} className="rounded-md bg-primary/5 border border-primary/20 p-2.5">
                            <p className="text-sm font-medium text-foreground">{item.titulo}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{item.fecha}</p>
                            <p className="text-[11px] text-muted-foreground">{item.autor}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <CardContent className="p-5 text-center">
                <p className="text-xs text-muted-foreground mb-2">Próxima actualización</p>
                <p className="text-2xl font-bold text-primary font-mono">--:-- hrs</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">
                  Ir a Requisitos <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursoDetalleCompleto;
