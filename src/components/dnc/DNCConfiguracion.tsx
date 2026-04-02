import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ArrowLeft, Settings, Users, FileText, CheckCircle2 } from 'lucide-react';

interface DNCConfiguracionProps {
  onBack: () => void;
}

const DNCConfiguracion: React.FC<DNCConfiguracionProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="text-primary hover:text-primary/80">
              DNC
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Configuración del proceso</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Configuración del proceso DNC</h1>
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
              Borrador
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configura los parámetros del diagnóstico antes de enviarlo a los colaboradores.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      {/* Configuration Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-primary/30 bg-primary/5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <Badge className="bg-primary text-primary-foreground text-xs">Paso 1</Badge>
            </div>
            <h3 className="font-semibold text-foreground">Parámetros generales</h3>
            <p className="text-sm text-muted-foreground">Define el nombre del proceso, el período de evaluación y las áreas a diagnosticar.</p>
            <Button size="sm" className="w-full gap-2">
              <Settings className="w-4 h-4" />
              Configurar
            </Button>
          </div>
        </Card>

        <Card className="p-6 opacity-70">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted border flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="text-xs">Paso 2</Badge>
            </div>
            <h3 className="font-semibold text-foreground">Selección de participantes</h3>
            <p className="text-sm text-muted-foreground">Selecciona los colaboradores que participarán en las encuestas del diagnóstico.</p>
            <Button size="sm" variant="outline" className="w-full gap-2" disabled>
              <Users className="w-4 h-4" />
              Seleccionar
            </Button>
          </div>
        </Card>

        <Card className="p-6 opacity-70">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted border flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <Badge variant="secondary" className="text-xs">Paso 3</Badge>
            </div>
            <h3 className="font-semibold text-foreground">Revisión y envío</h3>
            <p className="text-sm text-muted-foreground">Revisa la configuración completa y envía las encuestas a los participantes seleccionados.</p>
            <Button size="sm" variant="outline" className="w-full gap-2" disabled>
              <CheckCircle2 className="w-4 h-4" />
              Revisar
            </Button>
          </div>
        </Card>
      </div>

      {/* Terms signed confirmation */}
      <Card className="p-4 bg-emerald-50 border-emerald-200">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800">Términos y condiciones aceptados</p>
            <p className="text-xs text-emerald-600">Documento firmado digitalmente. Puedes continuar con la configuración del proceso.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DNCConfiguracion;
