import React from 'react';
import { Card, Button, Table } from 'antd';
import { Play, CheckCircle, Clock, Calendar, ArrowRight, TrendingUp, Wallet, Lock, CreditCard, PiggyBank, TrendingDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EmpresaStatus {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface FinancieroRow {
  key: string;
  indicador: string;
  valor: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export const EmpresaManagementCard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'EMPRESA' && user.role !== 'EMPRESA_REPRESENTANTE')) {
    return null;
  }

  const empresaStatuses: EmpresaStatus[] = [
    { 
      label: 'En Ejecución', 
      value: 8, 
      icon: <Play className="w-6 h-6" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)'
    },
    { 
      label: 'Pendientes Cierre', 
      value: 5, 
      icon: <Clock className="w-6 h-6" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)'
    },
    { 
      label: 'Finalizados', 
      value: 34, 
      icon: <CheckCircle className="w-6 h-6" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)'
    },
  ];

  const financieroData: FinancieroRow[] = [
    { 
      key: '1', 
      indicador: 'Inversión Mensual', 
      valor: '$12.5M', 
      icon: <TrendingUp className="w-4 h-4" />,
      trend: 'up',
      trendValue: '+15%'
    },
    { 
      key: '2', 
      indicador: 'Franquicia Disponible', 
      valor: '$45M', 
      icon: <Wallet className="w-4 h-4" />
    },
    { 
      key: '3', 
      indicador: 'Monto Comprometido', 
      valor: '$28M', 
      icon: <Lock className="w-4 h-4" />,
      trend: 'up',
      trendValue: '+$5M'
    },
    { 
      key: '4', 
      indicador: 'Monto Utilizado', 
      valor: '$18M', 
      icon: <CreditCard className="w-4 h-4" /> 
    },
    { 
      key: '5', 
      indicador: 'Saldo Disponible', 
      valor: '$17M', 
      icon: <PiggyBank className="w-4 h-4" />,
      trend: 'up',
      trendValue: '+$2M'
    },
  ];

  const financieroColumns = [
    {
      title: 'Indicador',
      dataIndex: 'indicador',
      key: 'indicador',
      render: (text: string, record: FinancieroRow) => (
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
      render: (value: string | number, record: FinancieroRow) => (
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

  const isRepresentante = user.role === 'EMPRESA_REPRESENTANTE';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cursos Overview Card */}
      <Card className="shadow-sm border-0 bg-card">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Estado de Cursos</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isRepresentante 
                  ? 'Resumen general de capacitaciones' 
                  : 'Estado actual de tus cursos'}
              </p>
            </div>
            <Button type="link" className="text-primary flex items-center gap-1 p-0">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-4">
            {empresaStatuses.map((status) => (
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

          {/* Próximos Cursos */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Próximos Cursos</p>
                <p className="text-xs text-muted-foreground">Cursos programados para iniciar</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">12</p>
                <Button type="primary" size="small" className="mt-1 bg-primary hover:bg-primary/90">
                  Ver Agenda
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Financiero Table */}
      <Card 
        className="shadow-sm border-0 bg-card"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-foreground font-semibold">Resumen Financiero</span>
          </div>
        }
      >
        <Table 
          dataSource={financieroData}
          columns={financieroColumns}
          pagination={false}
          size="middle"
          className="financiero-table"
          rowClassName="hover:bg-muted/30"
        />
      </Card>
    </div>
  );
};
