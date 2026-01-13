import React from 'react';
import { useLocation } from 'react-router-dom';
import { Badge, Avatar, Dropdown } from 'antd';
import { BellOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { getRoleDisplayName } from '@/config/menuConfig';

export const AppHeader: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Inicio';
    if (path.includes('/cursos')) return 'Cursos y Servicios';
    if (path.includes('/reportes')) return 'Reportes y Análisis';
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
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
        {user && (
          <p className="text-sm text-muted-foreground">
            {getRoleDisplayName(user.role)} • {user.company}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <Avatar className="bg-primary text-primary-foreground">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
