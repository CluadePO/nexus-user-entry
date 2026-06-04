import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, ArrowLeft, Building2, HardHat, FileText, Download, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

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
  onBack?: () => void;
}

interface EmpresaOpt {
  id: string;
  razonSocial: string;
  rut: string;
  rubro: string;
}

const EMPRESAS: EmpresaOpt[] = [
  { id: 'e1', razonSocial: 'Constructora Arenas Ltda.', rut: '12345678-9', rubro: 'Construcción' },
  { id: 'e2', razonSocial: 'Minera Norte S.A.', rut: '76543210-1', rubro: 'Minería' },
  { id: 'e3', razonSocial: 'Retail Sur SpA', rut: '78901234-5', rubro: 'Retail' },
  { id: 'e4', razonSocial: 'Servicios Andinos Ltda.', rut: '90123456-7', rubro: 'Servicios Profesionales' },
];

const DOC_TEXT = `Título del documento

Última actualización: Febrero 2026 | Versión 1.0.0

1. ACEPTACIÓN DE LOS TÉRMINOS

Al acceder y utilizar la Sucursal Virtual de OTIC CChC (en adelante, "la Plataforma"), usted acepta cumplir y estar sujeto a los presentes Términos y Condiciones de Uso. Si no está de acuerdo con alguno de estos términos, no deberá utilizar la Plataforma.

2. DESCRIPCIÓN DEL SERVICIO

La Plataforma permite a los usuarios autorizados configurar y ejecutar procesos de Detección de Necesidades de Capacitación (DNC), administrar nóminas de participantes y obtener resultados diagnósticos.

3. TRATAMIENTO DE DATOS PERSONALES

La información ingresada será tratada conforme a la Ley N° 19.628 sobre Protección de la Vida Privada. Usted autoriza el tratamiento de los datos de los participantes para los fines exclusivos del proceso DNC.

4. CONFIDENCIALIDAD

OTIC se compromete a mantener la confidencialidad de la información ingresada, utilizándola únicamente para los fines del diagnóstico.

5. RESPONSABILIDADES DEL USUARIO

El usuario responsable declara contar con las autorizaciones necesarias para cargar la nómina de participantes y realizar el proceso DNC.

6. DURACIÓN Y MODIFICACIONES

Una vez iniciado el proceso, solo podrán modificarse las fechas de inicio y cierre.

7. JURISDICCIÓN

Cualquier controversia se resolverá conforme a la legislación chilena vigente.`;

interface DocBlockProps {
  title: string;
  acceptLabel: string;
  scrolled: boolean;
  checked: boolean;
  onScrolledChange: (v: boolean) => void;
  onCheckedChange: (v: boolean) => void;
}

const DocBlock: React.FC<DocBlockProps> = ({ title, acceptLabel, scrolled, checked, onScrolledChange, onCheckedChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleScroll = (ev: React.UIEvent<HTMLDivElement>) => {
    const el = ev.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 8) onScrolledChange(true);
  };
  useEffect(() => {
    const el = ref.current;
    if (el && el.scrollHeight <= el.clientHeight + 4) onScrolledChange(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <span>{title}</span>
          <Download className="w-3.5 h-3.5 cursor-pointer hover:opacity-70" />
        </div>
        {!scrolled && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Desplázate hasta el final
          </span>
        )}
      </div>
      <div ref={ref} onScroll={handleScroll} className="p-4 max-h-[220px] overflow-y-auto whitespace-pre-line text-sm text-muted-foreground">
        {DOC_TEXT}
      </div>
      <div className="px-4 py-3 border-t bg-muted/20 flex items-center gap-2">
        <Checkbox
          id={`acc-${title}`}
          checked={checked}
          disabled={!scrolled}
          onCheckedChange={(v) => onCheckedChange(v === true)}
        />
        <label
          htmlFor={`acc-${title}`}
          className={`text-sm ${scrolled ? 'cursor-pointer text-foreground' : 'cursor-not-allowed text-muted-foreground'}`}
        >
          {acceptLabel}
        </label>
      </div>
    </div>
  );
};

const DNCStepDatos: React.FC<Props> = ({ data, onChange, onNext, onBack }) => {
  const [empresaId, setEmpresaId] = useState<string>('');
  const [scrolled1, setScrolled1] = useState(false);
  const [scrolled2, setScrolled2] = useState(false);
  const [accept1, setAccept1] = useState(false);
  const [accept2, setAccept2] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedEmpresa = EMPRESAS.find(e => e.id === empresaId) || null;

  const updNombre = (v: string) => {
    onChange({ ...data, nombreProceso: v });
  };

  const handleSelectEmpresa = (id: string) => {
    setEmpresaId(id);
    const emp = EMPRESAS.find(e => e.id === id);
    if (emp) {
      onChange({
        ...data,
        razonSocial: emp.razonSocial,
        rut: emp.rut,
        rubro: emp.rubro,
      });
    }
  };

  const nombreErr = submitted && !data.nombreProceso.trim();
  const empresaErr = submitted && !empresaId;
  const tcErr = submitted && (!accept1 || !accept2);

  const handleNext = () => {
    setSubmitted(true);
    if (!data.nombreProceso.trim() || !empresaId || !accept1 || !accept2) {
      toast.error('Revisa los campos marcados antes de continuar');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">Información de la empresa</h2>
          <p className="text-sm text-muted-foreground">Completa los datos de la empresa responsable del proceso DNC.</p>
        </div>

        <div className="space-y-2">
          <Label>* Nombre del proceso DNC</Label>
          <Input
            placeholder="DNC Anual 2025"
            value={data.nombreProceso}
            onChange={e => updNombre(e.target.value)}
            className={nombreErr ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {nombreErr ? (
            <p className="text-xs text-destructive">Campo obligatorio</p>
          ) : (
            <p className="text-xs text-muted-foreground">Aparecerá como el nombre de la DNC en el listado.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>* Empresa</Label>
          <Select value={empresaId} onValueChange={handleSelectEmpresa}>
            <SelectTrigger className={empresaErr ? 'border-destructive focus-visible:ring-destructive' : ''}>
              <SelectValue placeholder="Selecciona una empresa" />
            </SelectTrigger>
            <SelectContent>
              {EMPRESAS.map(e => (
                <SelectItem key={e.id} value={e.id}>
                  {e.razonSocial} - {e.rut}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {empresaErr && <p className="text-xs text-destructive">Campo obligatorio</p>}
        </div>

        {selectedEmpresa && (
          <div className="border rounded-lg p-4 bg-muted/20">
            <p className="text-sm font-semibold text-foreground mb-3">Datos Tributarios</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rut Empresa</p>
                  <p className="text-sm font-semibold text-foreground">{selectedEmpresa.rut}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rubro</p>
                  <p className="text-sm font-semibold text-foreground">{selectedEmpresa.rubro}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Razón Social</p>
                  <p className="text-sm font-semibold text-foreground">{selectedEmpresa.razonSocial}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Revisión y aceptación de condiciones</h2>
          <p className="text-sm text-muted-foreground">Para continuar la creación de una nueva DNC, debes revisar y aceptar los siguientes documentos:</p>
        </div>

        <p className="text-sm font-medium text-foreground">Documentos que requieren revisión previa</p>

        <DocBlock
          title="Términos y condiciones de uso"
          acceptLabel="He leído y acepto los Términos y condiciones"
          scrolled={scrolled1}
          checked={accept1}
          onScrolledChange={setScrolled1}
          onCheckedChange={setAccept1}
        />

        <DocBlock
          title="Política de privacidad"
          acceptLabel="He leído y acepto la Política de privacidad"
          scrolled={scrolled2}
          checked={accept2}
          onScrolledChange={setScrolled2}
          onCheckedChange={setAccept2}
        />

        {tcErr && (
          <Alert className="border-destructive/40 bg-destructive/5">
            <XCircle className="w-4 h-4 text-destructive" />
            <AlertDescription className="text-sm text-destructive">
              Debes revisar y aceptar ambas declaraciones para continuar
            </AlertDescription>
          </Alert>
        )}
      </Card>

      <div className="flex justify-between">
        {onBack ? (
          <Button variant="outline" className="gap-2" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        ) : <span />}
        <Button className="gap-2" onClick={handleNext}>
          Siguiente <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DNCStepDatos;
