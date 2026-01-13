import React from 'react';
import { Card, Button, Table } from 'antd';
import { FileCheck, FileClock, FileX, PenTool, ArrowRight, Receipt, Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DJOStatus {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface FacturacionRow {
  key: string;
  indicador: string;
  valor: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
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

  const facturacionData: FacturacionRow[] = [
    { 
      key: '1', 
      indicador: 'OC Emitidas', 
      valor: 67, 
      icon: <Receipt className="w-4 h-4" />,
      trend: 'up',
      trendValue: '+8'
    },
    { 
      key: '2', 
      indicador: 'OC Pendientes Facturación', 
      valor: 15, 
      icon: <Clock className="w-4 h-4" />,
      trend: 'down',
      trendValue: '-3'
    },
    { 
      key: '3', 
      indicador: 'Promedio Facturación', 
      valor: '$2.4M', 
      icon: <DollarSign className="w-4 h-4" />,
      trend: 'up',
      trendValue: '+12%'
    },
    { 
      key: '4', 
      indicador: 'Promedio Días Pago', 
      valor: '18 días', 
      icon: <Clock className="w-4 h-4" /> 
    },
  ];

  const facturacionColumns = [
    {
      title: 'Indicador',
      dataIndex: 'indicador',
      key: 'indicador',
      render: (text: string, record: FacturacionRow) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {record.icon}
          </div>
          <span className="font-medium text-foreground">{text}</span>
        </div>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      align: 'right' as const,
      render: (value: string | number, record: FacturacionRow) => (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xl font-bold text-primary">{value}</span>
          {record.trend && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              record.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {record.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {record.trendValue}
            </div>
          )}
        </div>
      ),
    },
  ];

  const isRepresentante = user.role === 'OTEC_REPRESENTANTE';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* DJO Management Card */}
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
        </div>
      </Card>

      {/* Facturación Table */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-semibold">Facturación</span>
          </div>
        }
      >
        <Table 
          dataSource={facturacionData}
          columns={facturacionColumns}
          pagination={false}
          size="middle"
          className="facturacion-table"
          rowClassName="hover:bg-muted/30"
        />
      </Card>
    </div>
  );
};
