import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRoleDisplayName } from '@/config/menuConfig';
import { QuickAccessButtons } from '@/components/dashboard/QuickAccessButtons';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DJOManagementCard } from '@/components/dashboard/DJOManagementCard';
import { OTECHighlightMetrics } from '@/components/dashboard/OTECHighlightMetrics';
import { EmpresaResumenFinanciero } from '@/components/dashboard/EmpresaManagementCard';
import { EmpresaHighlightMetrics } from '@/components/dashboard/EmpresaHighlightMetrics';
import { EmpresaPlanCapacitacion } from '@/components/dashboard/EmpresaPlanCapacitacion';
import { OTICDashboardSections, CourseSearchGrid } from '@/components/dashboard/OTICDashboardSections';
import { Calendar, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const isOTECRole = user?.role === 'OTEC' || user?.role === 'OTEC_REPRESENTANTE';
  const isEmpresaRole = user?.role === 'EMPRESA' || user?.role === 'EMPRESA_REPRESENTANTE';
  const isOTICRole = !isOTECRole && !isEmpresaRole;

  if (!user) return null;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = today.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              ¡Bienvenido, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-white/80 mt-1">
              {getRoleDisplayName(user.role)} • {user.company}
            </p>
          </div>
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{formattedTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Buttons - Centered at top */}
      <QuickAccessButtons />

      {/* Course Search - Only for OTIC role, shown below quick access */}
      {isOTICRole && <CourseSearchGrid />}

      {/* DJO Management Card - Only for OTEC roles */}
      {isOTECRole && <DJOManagementCard />}

      {/* OTEC Highlight Metrics - Cursos y Participantes side by side */}
      {isOTECRole && <OTECHighlightMetrics />}

      {/* Empresa Dashboard Layout */}
      {isEmpresaRole && (
        <>
          {/* Plan de Capacitación (left) + Resumen Financiero (right) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <EmpresaPlanCapacitacion />
            <EmpresaResumenFinanciero />
          </div>

          {/* Gestión de Cursos y Participantes - Unified Section */}
          <EmpresaHighlightMetrics />
        </>
      )}

      {/* OTIC Operational Dashboard */}
      {isOTICRole && <OTICDashboardSections />}
    </div>
  );
};

export default Dashboard;