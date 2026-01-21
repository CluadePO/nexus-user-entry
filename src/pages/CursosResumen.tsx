import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs as AntTabs, Card as AntCard } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Briefcase } from 'lucide-react';
import { CourseStagesSection, CourseSearchGrid, usePendingManagementTabs, useEmpresaPendingManagementTabs, ServiceStagesSection, ServiceSearchGrid } from '@/components/dashboard/OTICDashboardSections';

const CursosResumen: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  // Check if user has access to the tabs (OTIC, EMPRESA, EMPRESA_REPRESENTANTE)
  const hasTabAccess = userRole === 'OTIC' || userRole === 'EMPRESA' || userRole === 'EMPRESA_REPRESENTANTE';
  const isEmpresaRole = userRole === 'EMPRESA' || userRole === 'EMPRESA_REPRESENTANTE';

  // Get pending management tabs based on role
  const oticPendingTabItems = usePendingManagementTabs();
  const empresaPendingTabItems = useEmpresaPendingManagementTabs();
  
  // Use appropriate tabs based on role
  const pendingTabItems = isEmpresaRole ? empresaPendingTabItems : oticPendingTabItems;

  if (!hasTabAccess) {
    // For other roles, show a simple placeholder
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resumen de Cursos y Servicios</h1>
          <p className="text-muted-foreground">Vista general de cursos y servicios</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Contenido disponible próximamente</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resumen de Cursos y Servicios</h1>
        <p className="text-muted-foreground">Gestión integral de cursos y servicios de capacitación</p>
      </div>

      <Tabs defaultValue="cursos" className="w-full">
        <TabsList className="w-auto px-1">
          <TabsTrigger value="cursos" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Gestión de Cursos
          </TabsTrigger>
          <TabsTrigger value="servicios" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Gestión de Servicios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="mt-6 space-y-6">
          {/* Course Stages Pipeline */}
          <CourseStagesSection />

          {/* Course Search */}
          <CourseSearchGrid />

          {/* Pending Issues Management */}
          <AntCard title={isEmpresaRole ? "Gestión de Pendientes Cursos Franquicia" : "Gestión de Pendientes"} className="shadow-sm">
            <AntTabs items={pendingTabItems} />
          </AntCard>
        </TabsContent>

        <TabsContent value="servicios" className="mt-6 space-y-6">
          {/* Service Stages Pipeline */}
          <ServiceStagesSection />

          {/* Service Search */}
          <ServiceSearchGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursosResumen;
