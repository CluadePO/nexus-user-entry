import React from 'react';
import { Card } from 'antd';
import { 
  Receipt, 
  FileText, 
  Calculator, 
  Send,
  AlertCircle 
} from 'lucide-react';

interface OperationalMetric {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const operationalMetrics: OperationalMetric[] = [
  {
    id: 'emitir-oc-40-60',
    label: 'Cursos Emitir OC 40-60',
    value: 24,
    icon: <Receipt className="w-6 h-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 'pendiente-factura-40-60',
    label: 'Pendiente Emisión Factura 40-60',
    value: 18,
    icon: <FileText className="w-6 h-6" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 'cursos-liquidar',
    label: 'Cursos para Liquidar',
    value: 32,
    icon: <Calculator className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'emitir-oc-1-39',
    label: 'Cursos por Emitir OC 1-39',
    value: 45,
    icon: <Receipt className="w-6 h-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 'cursos-comunicar',
    label: 'Cursos por Comunicar',
    value: 15,
    icon: <Send className="w-6 h-6" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
];

export const OTICOperationalMetrics: React.FC = () => {
  const totalPending = operationalMetrics.reduce((sum, m) => sum + m.value, 0);

  return (
    <Card 
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Panel de Operaciones</span>
            <span className="ml-3 text-sm text-muted-foreground">
              {totalPending} tareas pendientes
            </span>
          </div>
        </div>
      }
      className="shadow-sm border-border"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {operationalMetrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${metric.bgColor} ${metric.borderColor}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium leading-tight">
                  {metric.label}
                </p>
                <p className={`text-3xl font-bold mt-2 ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor} ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
