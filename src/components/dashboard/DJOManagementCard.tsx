import React from 'react';
import { Card, Progress, Button } from 'antd';
import { FileCheck, FileClock, FileX, PenTool, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DJOStatus {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export const DJOManagementCard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'OTEC' && user.role !== 'OTEC_REPRESENTANTE')) {
    return null;
  }

  const djoStatuses: DJOStatus[] = [
    { 
      label: 'Presentadas', 
      value: 45, 
      icon: <FileCheck className="w-6 h-6" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)'
    },
    { 
      label: 'Pendientes', 
      value: 12, 
      icon: <FileClock className="w-6 h-6" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)'
    },
    { 
      label: 'Rechazadas', 
      value: 3, 
      icon: <FileX className="w-6 h-6" />, 
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)'
    },
  ];

  const totalDJO = djoStatuses.reduce((acc, status) => acc + status.value, 0);
  const presentadasPercent = Math.round((djoStatuses[0].value / totalDJO) * 100);
  const pendientesPercent = Math.round((djoStatuses[1].value / totalDJO) * 100);
  const rechazadasPercent = Math.round((djoStatuses[2].value / totalDJO) * 100);

  const isRepresentante = user.role === 'OTEC_REPRESENTANTE';

  return (
    <Card className="shadow-sm border-0 bg-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gestión de Declaraciones Juradas</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isRepresentante 
                ? 'Resumen de declaraciones pendientes de firma' 
                : 'Estado actual de tus DJO'}
            </p>
          </div>
          <Button type="link" className="text-primary flex items-center gap-1 p-0">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-4">
          {djoStatuses.map((status) => (
            <div 
              key={status.label}
              className="rounded-xl p-4 text-center transition-all hover:scale-105"
              style={{ backgroundColor: status.bgColor }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: status.color, color: 'white' }}
              >
                {status.icon}
              </div>
              <p className="text-2xl font-bold" style={{ color: status.color }}>
                {status.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{status.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Distribución de DJO</span>
            <span className="text-sm text-muted-foreground">Total: {totalDJO}</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-muted">
            <div 
              className="h-full transition-all" 
              style={{ width: `${presentadasPercent}%`, backgroundColor: '#65BFB1' }}
            />
            <div 
              className="h-full transition-all" 
              style={{ width: `${pendientesPercent}%`, backgroundColor: '#F5A623' }}
            />
            <div 
              className="h-full transition-all" 
              style={{ width: `${rechazadasPercent}%`, backgroundColor: '#E74C3C' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#65BFB1' }} />
              Presentadas ({presentadasPercent}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F5A623' }} />
              Pendientes ({pendientesPercent}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E74C3C' }} />
              Rechazadas ({rechazadasPercent}%)
            </span>
          </div>
        </div>

        {/* Representante specific info */}
        {isRepresentante && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Firmas Pendientes</p>
                <p className="text-xs text-muted-foreground">Tienes declaraciones esperando tu firma</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">8</p>
                <Button type="primary" size="small" className="mt-1 bg-primary hover:bg-primary/90">
                  Firmar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button className="flex-1 h-10" type="default">
            Nueva Declaración
          </Button>
          <Button className="flex-1 h-10" type="default">
            Historial Completo
          </Button>
        </div>
      </div>
    </Card>
  );
};
