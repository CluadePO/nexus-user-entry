import React, { useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Info } from 'lucide-react';
import { toast } from 'sonner';

export interface EmpresaDataStep1 {
  razonSocial: string;
  rut: string;
  nombreProceso: string;
  rubro: string;
  region: string;
  ciudad: string; // ahora representa la Comuna
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

const COMUNAS_POR_REGION: Record<string, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'General Lagos', 'Putre'],
  'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara', 'Camiña', 'Colchane'],
  'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'Taltal', 'María Elena', 'San Pedro de Atacama', 'Sierra Gorda', 'Ollagüe'],
  'Atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Huasco', 'Freirina', 'Alto del Carmen'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña', 'Andacollo', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Salamanca', 'Los Vilos', 'Canela', 'Río Hurtado', 'Paiguano', 'La Higuera'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón', 'Quintero', 'Puchuncaví', 'San Antonio', 'Cartagena', 'El Quisco', 'El Tabo', 'Algarrobo', 'Casablanca', 'Quillota', 'La Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Felipe', 'Los Andes', 'Limache', 'Olmué', 'La Ligua', 'Cabildo', 'Petorca', 'Papudo', 'Zapallar', 'Isla de Pascua', 'Juan Fernández'],
  'Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Reina', 'Vitacura', 'Lo Barnechea', 'Macul', 'Peñalolén', 'La Florida', 'Puente Alto', 'San Bernardo', 'Maipú', 'Estación Central', 'Cerrillos', 'Pudahuel', 'Quilicura', 'Renca', 'Conchalí', 'Independencia', 'Recoleta', 'Huechuraba', 'Quinta Normal', 'Lo Prado', 'Cerro Navia', 'San Joaquín', 'San Miguel', 'La Cisterna', 'El Bosque', 'La Granja', 'La Pintana', 'San Ramón', 'Pedro Aguirre Cerda', 'Lo Espejo', 'Buin', 'Paine', 'Calera de Tango', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'Melipilla', 'Curacaví', 'María Pinto', 'Alhué', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
  "O'Higgins": ['Rancagua', 'Machalí', 'Graneros', 'Codegua', 'Doñihue', 'Coltauco', 'Olivar', 'Requínoa', 'Rengo', 'Mostazal', 'Coínco', 'Quinta de Tilcoco', 'Malloa', 'San Vicente', 'Pichidegua', 'Peumo', 'Las Cabras', 'San Fernando', 'Chimbarongo', 'Nancagua', 'Placilla', 'Santa Cruz', 'Lolol', 'Pumanque', 'Palmilla', 'Peralillo', 'Chépica', 'Pichilemu', 'Marchigüe', 'Litueche', 'La Estrella', 'Navidad', 'Paredones'],
  'Maule': ['Talca', 'San Clemente', 'Pelarco', 'Maule', 'Pencahue', 'San Rafael', 'Río Claro', 'Curepto', 'Constitución', 'Empedrado', 'Curicó', 'Teno', 'Romeral', 'Molina', 'Sagrada Familia', 'Hualañé', 'Licantén', 'Vichuquén', 'Rauco', 'Linares', 'Yerbas Buenas', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'Villa Alegre', 'San Javier', 'Cauquenes', 'Pelluhue', 'Chanco'],
  'Ñuble': ['Chillán', 'Chillán Viejo', 'Bulnes', 'Quillón', 'San Ignacio', 'El Carmen', 'Pemuco', 'Yungay', 'Pinto', 'Coihueco', 'San Carlos', 'Ñiquén', 'San Fabián', 'San Nicolás', 'Quirihue', 'Ninhue', 'Trehuaco', 'Cobquecura', 'Portezuelo', 'Coelemu', 'Ránquil'],
  'Biobío': ['Concepción', 'Talcahuano', 'Hualpén', 'San Pedro de la Paz', 'Chiguayante', 'Penco', 'Tomé', 'Coronel', 'Lota', 'Florida', 'Hualqui', 'Santa Juana', 'Los Ángeles', 'Cabrero', 'Yumbel', 'Mulchén', 'Nacimiento', 'Negrete', 'Laja', 'San Rosendo', 'Quilleco', 'Antuco', 'Tucapel', 'Santa Bárbara', 'Quilaco', 'Alto Biobío', 'Lebu', 'Arauco', 'Curanilahue', 'Los Álamos', 'Cañete', 'Contulmo', 'Tirúa'],
  'Araucanía': ['Temuco', 'Padre Las Casas', 'Vilcún', 'Lautaro', 'Perquenco', 'Galvarino', 'Cunco', 'Melipeuco', 'Pucón', 'Curarrehue', 'Villarrica', 'Loncoche', 'Toltén', 'Teodoro Schmidt', 'Saavedra', 'Carahue', 'Nueva Imperial', 'Cholchol', 'Freire', 'Pitrufquén', 'Gorbea', 'Angol', 'Renaico', 'Collipulli', 'Ercilla', 'Lonquimay', 'Curacautín', 'Victoria', 'Traiguén', 'Lumaco', 'Purén', 'Los Sauces'],
  'Los Ríos': ['Valdivia', 'Corral', 'Lanco', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'Los Lagos', 'Futrono', 'La Unión', 'Lago Ranco', 'Río Bueno'],
  'Los Lagos': ['Puerto Montt', 'Puerto Varas', 'Cochamó', 'Calbuco', 'Maullín', 'Los Muermos', 'Fresia', 'Llanquihue', 'Frutillar', 'Osorno', 'Río Negro', 'Purranque', 'Puyehue', 'Puerto Octay', 'San Pablo', 'San Juan de la Costa', 'Castro', 'Ancud', 'Quemchi', 'Dalcahue', 'Curaco de Vélez', 'Quinchao', 'Puqueldón', 'Chonchi', 'Queilén', 'Quellón', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'],
  'Aysén': ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O\'Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez'],
  'Magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'],
};

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

// Validador RUT Chileno (módulo 11)
function validarRut(rut: string): boolean {
  const clean = rut.replace(/[.\-\s]/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0;
  let mul = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    sum += parseInt(cuerpo[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === dvCalc;
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

type Errors = Partial<Record<keyof EmpresaDataStep1 | 'tc', string>>;

const DNCStepDatos: React.FC<Props> = ({ data, onChange, onNext }) => {
  const [readPct, setReadPct] = useState(0);
  const [accept1, setAccept1] = useState(false);
  const [accept2, setAccept2] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const comunas = useMemo(() => COMUNAS_POR_REGION[data.region] ?? [], [data.region]);

  const upd = (k: keyof EmpresaDataStep1, v: string) => {
    const next = { ...data, [k]: v };
    // Si cambia región, limpia comuna
    if (k === 'region') next.ciudad = '';
    onChange(next);
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!data.nombreProceso.trim()) e.nombreProceso = 'Campo obligatorio';
    if (!data.razonSocial.trim()) e.razonSocial = 'Campo obligatorio';
    if (!data.rut.trim()) e.rut = 'Campo obligatorio';
    else if (!validarRut(data.rut)) e.rut = 'RUT inválido';
    if (!data.rubro) e.rubro = 'Selecciona un rubro';
    if (!data.region) e.region = 'Selecciona una región';
    if (!data.ciudad) e.ciudad = 'Selecciona una comuna';
    if (!data.responsable.trim()) e.responsable = 'Campo obligatorio';
    if (!data.email.trim()) e.email = 'Campo obligatorio';
    else if (!isValidEmail(data.email)) e.email = 'Email inválido';
    if (!accept1 || !accept2) e.tc = 'Debes aceptar ambas declaraciones';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error('Revisa los campos marcados antes de continuar');
      return;
    }
    onNext();
  };

  const handleScroll = (ev: React.UIEvent<HTMLDivElement>) => {
    const el = ev.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) { setReadPct(100); return; }
    setReadPct(Math.min(100, Math.round((el.scrollTop / max) * 100)));
  };

  const errClass = (k: keyof EmpresaDataStep1) => errors[k] ? 'border-destructive focus-visible:ring-destructive' : '';

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">Información de la empresa</h2>
          <p className="text-sm text-muted-foreground">Completa los datos de la empresa responsable del proceso DNC.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>* Nombre del proceso DNC</Label>
            <Input placeholder="DNC Anual 2025" value={data.nombreProceso} onChange={e => upd('nombreProceso', e.target.value)} className={errClass('nombreProceso')} />
            {errors.nombreProceso ? (
              <p className="text-xs text-destructive">{errors.nombreProceso}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Aparecerá como el nombre de la DNC en el listado.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>* Razón Social</Label>
            <Input placeholder="Ej: Constructora Arenas Ltda." value={data.razonSocial} onChange={e => upd('razonSocial', e.target.value)} className={errClass('razonSocial')} />
            {errors.razonSocial && <p className="text-xs text-destructive">{errors.razonSocial}</p>}
          </div>
          <div className="space-y-2">
            <Label>* RUT Empresa</Label>
            <Input value={data.rut} onChange={e => upd('rut', e.target.value)} className={errClass('rut')} />
            {errors.rut && <p className="text-xs text-destructive">{errors.rut}</p>}
          </div>

          <div className="space-y-2">
            <Label>* Rubro</Label>
            <Select value={data.rubro} onValueChange={v => upd('rubro', v)}>
              <SelectTrigger className={errClass('rubro')}><SelectValue placeholder="Selecciona un rubro" /></SelectTrigger>
              <SelectContent>{RUBROS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            {errors.rubro && <p className="text-xs text-destructive">{errors.rubro}</p>}
          </div>
          <div className="space-y-2">
            <Label>* Región</Label>
            <Select value={data.region} onValueChange={v => upd('region', v)}>
              <SelectTrigger className={errClass('region')}><SelectValue placeholder="Selecciona una región" /></SelectTrigger>
              <SelectContent>{REGIONES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
          </div>
          <div className="space-y-2">
            <Label>* Comuna</Label>
            <Select value={data.ciudad} onValueChange={v => upd('ciudad', v)} disabled={!data.region}>
              <SelectTrigger className={errClass('ciudad')}>
                <SelectValue placeholder={data.region ? 'Selecciona una comuna' : 'Selecciona una región primero'} />
              </SelectTrigger>
              <SelectContent>
                {comunas.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.ciudad && <p className="text-xs text-destructive">{errors.ciudad}</p>}
          </div>
          <div className="space-y-2">
            <Label>* Nombre del responsable</Label>
            <Input value={data.responsable} onChange={e => upd('responsable', e.target.value)} className={errClass('responsable')} />
            {errors.responsable && <p className="text-xs text-destructive">{errors.responsable}</p>}
          </div>
          <div className="space-y-2">
            <Label>* Email del responsable</Label>
            <Input type="email" placeholder="responsable@empresa.cl" value={data.email} onChange={e => upd('email', e.target.value)} className={errClass('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input placeholder="+56 9 ..." value={data.telefono} onChange={e => upd('telefono', e.target.value)} />
          </div>
        </div>
      </Card>

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
            <Checkbox id="tc1" checked={accept1} onCheckedChange={v => { setAccept1(v === true); if (errors.tc) setErrors(e => ({ ...e, tc: undefined })); }} />
            <label htmlFor="tc1" className="text-sm cursor-pointer">He leído y acepto los Términos y Condiciones</label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="tc2" checked={accept2} onCheckedChange={v => { setAccept2(v === true); if (errors.tc) setErrors(e => ({ ...e, tc: undefined })); }} />
            <label htmlFor="tc2" className="text-sm cursor-pointer">Autorizo el tratamiento de datos personales conforme a la Ley 19.628</label>
          </div>
        </div>

        {errors.tc ? (
          <Alert className="border-destructive/40 bg-destructive/5">
            <Info className="w-4 h-4 text-destructive" />
            <AlertDescription className="text-sm text-destructive">{errors.tc}</AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription className="text-sm">La aceptación de ambas declaraciones es obligatoria para continuar.</AlertDescription>
          </Alert>
        )}
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleNext}>
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DNCStepDatos;
