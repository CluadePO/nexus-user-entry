import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRoleDisplayName } from '@/config/menuConfig';
import { QuickAccessButtons } from '@/components/dashboard/QuickAccessButtons';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DJOManagementCard } from '@/components/dashboard/DJOManagementCard';
import { OTECHighlightMetrics } from '@/components/dashboard/OTECHighlightMetrics';
import { Calendar, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const isOTECRole = user?.role === 'OTEC' || user?.role === 'OTEC_REPRESENTANTE';

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

      {/* DJO Management Card - Only for OTEC roles */}
      {isOTECRole && <DJOManagementCard />}

      {/* OTEC Highlight Metrics - Cursos y Participantes side by side */}
      {isOTECRole && <OTECHighlightMetrics />}

      {/* Charts Section */}
      <DashboardCharts />

      {/* Metrics Dashboard - Grouped by category */}
      <DashboardMetrics />
    </div>
  );
};

export default Dashboard;
