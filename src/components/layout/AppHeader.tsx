import React from 'react';
import { useLocation } from 'react-router-dom';
import { Badge, Avatar, Dropdown, Select, Tag } from 'antd';
import { BellOutlined, SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Building2, Building, Filter, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getRoleDisplayName } from '@/config/menuConfig';
import { useOTICFilter } from '@/context/OTICFilterContext';

export const AppHeader: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const {
    holdings,
    filteredCompanies,
    selectedHoldingId,
    selectedCompanyId,
    setSelectedHoldingId,
    setSelectedCompanyId,
    filterLabel,
  } = useOTICFilter();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Inicio';
    if (path.includes('/cursos')) return 'Cursos y Servicios';
    if (path.includes('/reportes')) return 'Reportes y Análisis';
    if (path.includes('/encuestas')) return 'Reportes y Análisis';
    if (path.includes('/data360')) return 'Data 360';
    if (path.includes('/buscador')) return 'Mi Buscador';
    if (path.includes('/documentos')) return 'Gestión Documental';
    if (path.includes('/facturacion')) return 'Facturación';
    if (path.includes('/admin')) return 'Administración';
    if (path.includes('/ayuda')) return 'Ayuda y Soporte';
    return 'Inicio';
  };

  const notificationItems = [
    { key: '1', label: 'Nueva DJO pendiente de revisión' },
    { key: '2', label: 'Curso próximo a iniciar' },
    { key: '3', label: '3 documentos pendientes de firma' },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center">
      {/* Left: Page title */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
        {user && (
          <p className="text-sm text-muted-foreground">
            {getRoleDisplayName(user.role)} • {user.company}
          </p>
        )}
      </div>

      {/* Center: Filter controls */}
      <div className="flex-1 flex items-center justify-center gap-3 px-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium hidden lg:inline">Filtrar por:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary hidden sm:block" />
          <Select
            placeholder="Holding"
            value={selectedHoldingId}
            onChange={setSelectedHoldingId}
            className="w-40 lg:w-48"
            size="small"
            options={[
              { value: null, label: 'Todos los Holdings' },
              ...holdings.map(h => ({
                value: h.id,
                label: h.name,
              }))
            ]}
            popupClassName="bg-card"
          />
        </div>

        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-primary hidden sm:block" />
          <Select
            placeholder="Empresa"
            value={selectedCompanyId}
            onChange={setSelectedCompanyId}
            className="w-40 lg:w-48"
            size="small"
            options={[
              { value: null, label: 'Todas las Empresas' },
              ...filteredCompanies.map(c => ({
                value: c.id,
                label: c.name,
              }))
            ]}
            popupClassName="bg-card"
          />
        </div>

        <button
          onClick={() => {
            setSelectedHoldingId(null);
            setSelectedCompanyId(null);
          }}
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Reiniciar filtros"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex-shrink-0 flex items-center gap-3">
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Badge count={3} size="small">
              <BellOutlined className="text-lg text-muted-foreground" />
            </Badge>
          </button>
        </Dropdown>

        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <SettingOutlined className="text-lg text-muted-foreground" />
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <Avatar className="bg-primary text-primary-foreground" size="small">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Avatar>
            <div className="hidden xl:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
