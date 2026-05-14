import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Info } from 'lucide-react';

export interface EmpresaDataStep1 {
  razonSocial: string;
  rut: string;
  nombreProceso: string;
  rubro: string;
  region: string;
  ciudad: string;
  responsable: string;
  email: string;
  telefono: string;
}

interface Props {
  data: EmpresaDataStep1;
  onChange: (d: EmpresaDataStep1) => void;
  onNext: () => void;
}

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Metropolitana', "O'Higgins", 'Maule', 'Ñuble', 'Biobío',
  'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

const RUBROS = [
  'Agricultura y Ganadería', 'Minería', 'Industria Manufacturera', 'Construcción',
  'Comercio', 'Transporte y Logística', 'Tecnología e Informática', 'Telecomunicaciones',
  'Servicios Financieros y Banca', 'Salud y Servicios Sociales', 'Educación',
  'Hotelería y Turismo', 'Energía y Medio Ambiente', 'Inmobiliario',
  'Servicios Profesionales y Consultoría', 'Administración Pública', 'Retail',
  'Alimentos y Bebidas', 'Forestal y Pesca', 'Otro',
];

const TC_TEXT = `TÉRMINOS Y CONDICIONES — SUCURSAL VIRTUAL OTIC

1. OBJETO. El presente documento regula el uso de la plataforma Sucursal Virtual OTIC para la configuración y ejecución de procesos de Detección de Necesidades de Capacitación (DNC).

2. ACEPTACIÓN. Al marcar las casillas correspondientes, usted declara haber leído, comprendido y aceptado integramente estos términos.

3. TRATAMIENTO DE DATOS PERSONALES. La información ingresada será tratada conforme a la Ley N° 19.628 sobre Protección de la Vida Privada. Usted autoriza el tratamiento de los datos de los participantes para los fines exclusivos del proceso DNC.

4. CONFIDENCIALIDAD. OTIC se compromete a mantener la confidencialidad de la información ingresada, utilizándola únicamente para los fines del diagnóstico.

5. RESPONSABILIDADES DEL USUARIO. El usuario responsable declara contar con las autorizaciones necesarias para cargar la nómina de participantes y realizar el proceso DNC.

6. DURACIÓN Y MODIFICACIONES. Una vez iniciado el proceso, solo podrán modificarse las fechas de inicio y cierre.

7. RESULTADOS. Los resultados serán entregados al responsable indicado en este formulario y tendrán una vigencia de 12 meses.

8. JURISDICCIÓN. Cualquier controversia se resolverá conforme a la legislación chilena vigente.`;

const DNCStepDatos: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [readPct, setReadPct] = useState(0);
  const [accept1, setAccept1] = useState(false);
  const [accept2, setAccept2] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const upd = (k: keyof EmpresaDataStep1, v: string) => onChange({ ...data, [k]: v });

  const isValid =
    data.razonSocial && data.rut && data.nombreProceso && data.rubro &&
    data.region && data.ciudad && data.responsable && data.email;

  const canProceed = isValid && accept1 && accept2;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) { setReadPct(100); return; }
    setReadPct(Math.min(100, Math.round((el.scrollTop / max) * 100)));
  };

  return (
    <div className="space-y-6">
      {/* Información de la empresa */}
      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">Información de la empresa</h2>
          <p className="text-sm text-muted-foreground">Completa los datos de la empresa responsable del proceso DNC.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>* Razón Social</Label>
            <Input placeholder="Ej: Constructora Arenas Ltda." value={data.razonSocial} onChange={e => upd('razonSocial', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>* RUT Empresa</Label>
            <Input placeholder="12.345.678-9" value={data.rut} onChange={e => upd('rut', e.target.value)} />
            <p className="text-xs text-muted-foreground">Formato: XX.XXX.XXX-X</p>
          </div>
          <div className="space-y-2 col-span-2">
            <Label>* Nombre del proceso DNC</Label>
            <Input placeholder="DNC Anual 2025" value={data.nombreProceso} onChange={e => upd('nombreProceso', e.target.value)} />
            <p className="text-xs text-muted-foreground">Aparecerá como el nombre de la DNC en el listado.</p>
          </div>
          <div className="space-y-2">
            <Label>* Rubro / Industria</Label>
            <Select value={data.rubro} onValueChange={v => upd('rubro', v)}>
              <SelectTrigger><SelectValue placeholder="Selecciona un rubro" /></SelectTrigger>
              <SelectContent>{RUBROS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>* Región</Label>
            <Select value={data.region} onValueChange={v => upd('region', v)}>
              <SelectTrigger><SelectValue placeholder="Selecciona una región" /></SelectTrigger>
              <SelectContent>{REGIONES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>* Ciudad</Label>
            <Input value={data.ciudad} onChange={e => upd('ciudad', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>* Nombre del responsable</Label>
            <Input value={data.responsable} onChange={e => upd('responsable', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>* Email del responsable</Label>
            <Input type="email" placeholder="responsable@empresa.cl" value={data.email} onChange={e => upd('email', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input placeholder="+56 9 ..." value={data.telefono} onChange={e => upd('telefono', e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Términos y Condiciones */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Términos y Condiciones</h2>

        <ScrollArea className="h-[260px] border rounded-lg bg-muted/30">
          <div ref={scrollRef} onScroll={handleScroll} className="p-4 max-h-[260px] overflow-y-auto whitespace-pre-line text-sm text-muted-foreground">
            {TC_TEXT}
          </div>
        </ScrollArea>

        <p className="text-xs text-muted-foreground">Has leído el {readPct}% del documento</p>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox id="tc1" checked={accept1} onCheckedChange={v => setAccept1(v === true)} />
            <label htmlFor="tc1" className="text-sm cursor-pointer">He leído y acepto los Términos y Condiciones</label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="tc2" checked={accept2} onCheckedChange={v => setAccept2(v === true)} />
            <label htmlFor="tc2" className="text-sm cursor-pointer">Autorizo el tratamiento de datos personales conforme a la Ley 19.628</label>
          </div>
        </div>

        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription className="text-sm">La aceptación de ambas declaraciones es obligatoria para continuar.</AlertDescription>
        </Alert>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2" disabled={!canProceed} onClick={onNext}>
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DNCStepDatos;
