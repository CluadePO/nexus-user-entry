import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from 'antd';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface ChartConfig {
  title: string;
  data: ChartData[];
  bars: { dataKey: string; name: string; color: string }[];
}

const getChartsForRole = (role: string): ChartConfig[] => {
  switch (role) {
    case 'OTEC':
    case 'OTEC_REPRESENTANTE':
      return [];
    case 'EMPRESA':
    case 'EMPRESA_REPRESENTANTE':
      return [
        {
          title: 'Trabajadores: Planificados vs Capacitados',
          data: [
            { name: 'Ene', planificados: 45, capacitados: 38 },
            { name: 'Feb', planificados: 50, capacitados: 42 },
            { name: 'Mar', planificados: 55, capacitados: 48 },
            { name: 'Abr', planificados: 60, capacitados: 52 },
            { name: 'May', planificados: 48, capacitados: 45 },
            { name: 'Jun', planificados: 52, capacitados: 50 },
          ],
          bars: [
            { dataKey: 'planificados', name: 'Planificados', color: '#8B9DC3' },
            { dataKey: 'capacitados', name: 'Capacitados', color: '#65BFB1' },
          ],
        },
        {
          title: 'Inversión Mensual ($M)',
          data: [
            { name: 'Ene', inversion: 8.5 },
            { name: 'Feb', inversion: 10.2 },
            { name: 'Mar', inversion: 12.8 },
            { name: 'Abr', inversion: 11.5 },
            { name: 'May', inversion: 14.2 },
            { name: 'Jun', inversion: 12.5 },
          ],
          bars: [
            { dataKey: 'inversion', name: 'Inversión', color: '#65BFB1' },
          ],
        },
      ];
    case 'OTIC':
      return [
        {
          title: 'Resumen por Entidad',
          data: [
            { name: 'Ene', empresas: 75, otecs: 28 },
            { name: 'Feb', empresas: 78, otecs: 30 },
            { name: 'Mar', empresas: 82, otecs: 31 },
            { name: 'Abr', empresas: 85, otecs: 32 },
            { name: 'May', empresas: 87, otecs: 33 },
            { name: 'Jun', empresas: 89, otecs: 34 },
          ],
          bars: [
            { dataKey: 'empresas', name: 'Empresas', color: '#65BFB1' },
            { dataKey: 'otecs', name: 'OTECs', color: '#4A90A4' },
          ],
        },
        {
          title: 'Montos Liquidados ($M)',
          data: [
            { name: 'Ene', liquidado: 85, pendiente: 25 },
            { name: 'Feb', liquidado: 92, pendiente: 28 },
            { name: 'Mar', liquidado: 98, pendiente: 22 },
            { name: 'Abr', liquidado: 95, pendiente: 30 },
            { name: 'May', liquidado: 102, pendiente: 20 },
            { name: 'Jun', liquidado: 95, pendiente: 18 },
          ],
          bars: [
            { dataKey: 'liquidado', name: 'Liquidado', color: '#65BFB1' },
            { dataKey: 'pendiente', name: 'Pendiente', color: '#F5A623' },
          ],
        },
      ];
    default:
      return [];
  }
};

export const DashboardCharts: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const charts = getChartsForRole(user.role);

  if (charts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart, index) => (
        <Card 
          key={index}
          title={<span className="text-foreground font-semibold">{chart.title}</span>}
          className="shadow-sm border-border"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chart.data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              {chart.bars.map((bar) => (
                <Bar 
                  key={bar.dataKey} 
                  dataKey={bar.dataKey} 
                  name={bar.name} 
                  fill={bar.color} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      ))}
    </div>
  );
};
