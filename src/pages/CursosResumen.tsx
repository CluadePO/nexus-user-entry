import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Briefcase } from 'lucide-react';

const CursosResumen: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  // Check if user has access to the tabs (OTIC, EMPRESA, EMPRESA_REPRESENTANTE)
  const hasTabAccess = userRole === 'OTIC' || userRole === 'EMPRESA' || userRole === 'EMPRESA_REPRESENTANTE';

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

        <TabsContent value="cursos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Gestión de Cursos
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Gestión de Cursos</h3>
                <p className="text-muted-foreground max-w-md">
                  Administra y supervisa todos los cursos de capacitación. 
                  Esta sección está en desarrollo.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Gestión de Servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[400px]">
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl">🛠️</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Gestión de Servicios</h3>
                <p className="text-muted-foreground max-w-md">
                  Administra y supervisa todos los servicios complementarios. 
                  Esta sección está en desarrollo.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursosResumen;
