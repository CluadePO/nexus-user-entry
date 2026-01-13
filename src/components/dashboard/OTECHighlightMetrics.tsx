import React from 'react';
import { Card, Table } from 'antd';
import { BookOpen, CheckCircle, Archive, Users, Award, AlertCircle, Clock, Receipt, ReceiptText, DollarSign, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HighlightMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtext?: string;
  trend?: 'up' | 'down';
}

interface FacturacionRow {
  key: string;
  indicador: string;
  valor: string | number;
  tipo: 'promedio' | 'porcentaje' | 'cantidad';
}

export const OTECHighlightMetrics: React.FC = () => {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'OTEC' && user.role !== 'OTEC_REPRESENTANTE')) {
    return null;
  }

  const cursosMetrics: HighlightMetric[] = [
    { 
      label: 'Cursos Activos', 
      value: 24, 
      icon: <BookOpen className="w-5 h-5" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)',
      subtext: '+12% este mes',
      trend: 'up'
    },
    { 
      label: 'Cursos Ejecutados', 
      value: 156, 
      icon: <CheckCircle className="w-5 h-5" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)'
    },
    { 
      label: 'Cursos Cerrados', 
      value: 89, 
      icon: <Archive className="w-5 h-5" />, 
      color: '#8B9DC3',
      bgColor: 'rgba(139, 157, 195, 0.1)'
    },
    { 
      label: 'Cursos con Observaciones SENCE', 
      value: '8%', 
      icon: <AlertCircle className="w-5 h-5" />, 
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      subtext: 'Requiere atención',
      trend: 'down'
    },
  ];

  const participantesMetrics: HighlightMetric[] = [
    { 
      label: 'Participantes Inscritos', 
      value: '1,240', 
      icon: <Users className="w-5 h-5" />, 
      color: '#65BFB1',
      bgColor: 'rgba(101, 191, 177, 0.1)'
    },
    { 
      label: 'Participantes Certificados', 
      value: '1,089', 
      icon: <Award className="w-5 h-5" />, 
      color: '#F5A623',
      bgColor: 'rgba(245, 166, 35, 0.1)',
      subtext: '87.8% de conversión',
      trend: 'up'
    },
    { 
      label: 'Promedio Días Comunicación', 
      value: '3.2 días', 
      icon: <Clock className="w-5 h-5" />, 
      color: '#4A90A4',
      bgColor: 'rgba(74, 144, 164, 0.1)'
    },
  ];

  const facturacionData: FacturacionRow[] = [
    { key: '1', indicador: 'OC Emitidas', valor: 67, tipo: 'cantidad' },
    { key: '2', indicador: 'OC Pendientes Facturación', valor: 15, tipo: 'cantidad' },
    { key: '3', indicador: 'Promedio Facturación', valor: '$2.4M', tipo: 'promedio' },
    { key: '4', indicador: 'Promedio Días Pago', valor: '18 días', tipo: 'promedio' },
  ];

  const facturacionColumns = [
    {
      title: 'Indicador',
      dataIndex: 'indicador',
      key: 'indicador',
      render: (text: string, record: FacturacionRow) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {record.tipo === 'promedio' ? (
              <DollarSign className="w-4 h-4 text-primary" />
            ) : record.tipo === 'porcentaje' ? (
              <TrendingUp className="w-4 h-4 text-primary" />
            ) : (
              <Receipt className="w-4 h-4 text-primary" />
            )}
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
      render: (value: string | number) => (
        <span className="text-lg font-bold text-primary">{value}</span>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center' as const,
      render: (tipo: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          tipo === 'promedio' 
            ? 'bg-blue-100 text-blue-700' 
            : tipo === 'porcentaje'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {tipo === 'promedio' ? 'Promedio' : tipo === 'porcentaje' ? 'Porcentaje' : 'Cantidad'}
        </span>
      ),
    },
  ];

  const MetricCard = ({ metric }: { metric: HighlightMetric }) => (
    <div 
      className="rounded-xl p-4 transition-all hover:scale-105 hover:shadow-md cursor-pointer animate-fade-in"
      style={{ backgroundColor: metric.bgColor }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: metric.color, color: 'white' }}
        >
          {metric.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium truncate">{metric.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-2xl font-bold" style={{ color: metric.color }}>
              {metric.value}
            </p>
            {metric.trend && (
              metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )
            )}
          </div>
          {metric.subtext && (
            <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cursos y Participantes en paralelo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cursos Section */}
        <Card 
          className="shadow-sm border-0 bg-card"
          title={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Cursos</span>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            {cursosMetrics.map((metric, index) => (
              <div key={metric.label} style={{ animationDelay: `${index * 100}ms` }}>
                <MetricCard metric={metric} />
              </div>
            ))}
          </div>
        </Card>

        {/* Participantes Section */}
        <Card 
          className="shadow-sm border-0 bg-card"
          title={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground font-semibold">Participantes</span>
            </div>
          }
        >
          <div className="space-y-3">
            {participantesMetrics.map((metric, index) => (
              <div key={metric.label} style={{ animationDelay: `${index * 100}ms` }}>
                <MetricCard metric={metric} />
              </div>
            ))}
          </div>
        </Card>
      </div>

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
        />
      </Card>
    </div>
  );
};
