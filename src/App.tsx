import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { OTICFilterProvider } from "@/context/OTICFilterContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inscripcion from "./pages/Inscripcion";
import AsesorDashboard from "./pages/AsesorDashboard";
import MiBuscador from "./pages/MiBuscador";
import MiRecomendador from "./pages/MiRecomendador";
import CourseDetail from "./pages/CourseDetail";
import DNC from "./pages/DNC";
import Encuestas from "./pages/Encuestas";
import CursosResumen from "./pages/CursosResumen";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminCarterasComerciales from "./pages/AdminCarterasComerciales";
import CentroAyuda from "./pages/CentroAyuda";
import ComunicacionSence from "./pages/ComunicacionSence";
import Precontratos from "./pages/Precontratos";
import PrecontratosNuevo from "./pages/PrecontratosNuevo";
import LiquidacionSence from "./pages/LiquidacionSence";
import ComiteBipartito from "./pages/ComiteBipartito";
import ComiteVoto from "./pages/ComiteVoto";
import EncuestaResponder from "./pages/EncuestaResponder";
import EncuestaFormulario from "./pages/EncuestaFormulario";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Ant Design theme configuration
const antTheme = {
  token: {
    colorPrimary: '#65BFB1',
    colorLink: '#65BFB1',
    borderRadius: 8,
    fontFamily: 'Inter, sans-serif',
  },
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={antTheme} locale={esES}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OTICFilterProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/comite/voto/:comiteId/1" element={<ComiteVoto tipo={1} />} />
                <Route path="/comite/voto/:comiteId/2" element={<ComiteVoto tipo={2} />} />
                <Route path="/encuestas/responder/:encuestaId" element={<EncuestaResponder />} />
                <Route path="/encuestas/responder/:encuestaId/formulario" element={<EncuestaFormulario />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inscripcion" element={<Inscripcion />} />
                <Route path="/cursos/inscripcion" element={<Inscripcion />} />
                {/* Cursos y Servicios routes */}
                <Route path="/cursos/resumen" element={<CursosResumen />} />
                <Route path="/cursos/sence" element={<ComunicacionSence />} />
                <Route path="/cursos/liquidacion" element={<LiquidacionSence />} />
                <Route path="/cursos/comite-bipartito" element={<ComiteBipartito />} />
                <Route path="/cursos/precontratos" element={<Precontratos />} />
                <Route path="/cursos/precontratos-nuevo" element={<PrecontratosNuevo />} />
                <Route path="/cursos/*" element={<PlaceholderPage title="Cursos y Servicios" />} />
                <Route path="/reportes" element={<PlaceholderPage title="Reportes" />} />
                <Route path="/data360" element={<PlaceholderPage title="Data 360" />} />
                <Route path="/buscador/*" element={<MiBuscador />} />
                <Route path="/formacion/buscador" element={<MiBuscador />} />
                <Route path="/formacion/curso/:courseId" element={<CourseDetail />} />
                <Route path="/asesor" element={<AsesorDashboard />} />
                <Route path="/asesor/diagnostico" element={<PlaceholderPage title="Diagnóstico" />} />
                <Route path="/asesor/herramientas" element={<PlaceholderPage title="Herramientas" />} />
                <Route path="/asesor/resultados" element={<PlaceholderPage title="Resultados" />} />
                <Route path="/asesor/plan" element={<PlaceholderPage title="Plan de Capacitación" />} />
                <Route path="/asesor/buscador" element={<PlaceholderPage title="Mi Buscador" />} />
                <Route path="/asesor/recomendador" element={<MiRecomendador />} />
                <Route path="/asesor/dnc" element={<PlaceholderPage title="Mi DNC" />} />
                <Route path="/asesor/ruta" element={<PlaceholderPage title="Mi Ruta" />} />
                <Route path="/documentos/*" element={<PlaceholderPage title="Gestión Documental" />} />
                <Route path="/facturacion/*" element={<PlaceholderPage title="Facturación" />} />
                <Route path="/formacion/dnc" element={<DNC />} />
                <Route path="/formacion/*" element={<PlaceholderPage title="Formación" />} />
                <Route path="/encuestas" element={<Encuestas />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/carteras" element={<AdminCarterasComerciales />} />
                <Route path="/admin/*" element={<PlaceholderPage title="Administración" />} />
                <Route path="/ayuda/centro" element={<CentroAyuda />} />
                <Route path="/ayuda/*" element={<PlaceholderPage title="Ayuda y Soporte" />} />
              </Route>
              <Route path="*" element={<NotFound />} />
              </Routes>
            </OTICFilterProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

// Placeholder component for unimplemented pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <span className="text-3xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
    <p className="text-muted-foreground">Esta sección está en desarrollo</p>
  </div>
);

export default App;
