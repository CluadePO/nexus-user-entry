import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Input, Avatar, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  LogoutOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { menuByRole, getRoleDisplayName } from '@/config/menuConfig';
import { DynamicIcon } from '@/components/icons/DynamicIcon';
import type { MenuProps } from 'antd';

export const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const menuItems = menuByRole[user.role] || [];

  const convertToAntdItems = (items: typeof menuItems): MenuProps['items'] => {
    return items.map(item => {
      const baseItem = {
        key: item.key,
        icon: item.icon ? <DynamicIcon name={item.icon} className="w-5 h-5" /> : undefined,
        label: item.label,
      };

      if (item.children) {
        return {
          ...baseItem,
          children: item.children.map(child => ({
            key: child.key,
            label: child.label,
            onClick: () => child.url && navigate(child.url),
          })),
        };
      }

      return {
        ...baseItem,
        onClick: () => item.url && navigate(item.url),
      };
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside 
      className={`
        sidebar-gradient flex flex-col h-screen transition-all duration-300
        ${collapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {!collapsed && (
              <>
                <span className="text-white font-bold text-lg">Sucursal</span>
                <span className="text-[#65BFB1] font-bold text-lg">Virtual</span>
                <span className="text-white/60 text-xs ml-1">| OTIC</span>
              </>
            )}
            {collapsed && (
              <span className="text-white font-bold text-xl">SV</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar 
              size={collapsed ? 40 : 64} 
              className="bg-yellow-500 text-yellow-900 font-bold"
            >
              {getInitials(user.name)}
            </Avatar>
          </div>
        </div>

        {/* Search */}
        {!collapsed && (
          <Input
            placeholder="Buscar en el menú"
            prefix={<SearchOutlined className="text-white/50" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg"
          />
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 px-2 overflow-visible">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[]}
          items={convertToAntdItems(menuItems)}
          inlineCollapsed={collapsed}
          className="bg-transparent border-none sidebar-menu"
          style={{
            background: 'transparent',
          }}
        />
      </div>

      {/* Version */}
      {!collapsed && (
        <div className="px-4 py-2 text-center">
          <span className="text-white/40 text-xs">Versión 1.0</span>
        </div>
      )}

      {/* User Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            className="bg-white/20 text-white font-medium flex-shrink-0"
          >
            {getInitials(user.name)}
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{user.name}</p>
                <p className="text-white/60 text-xs truncate">
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
              <div className="flex gap-1">
                <Tooltip title="Cerrar sesión">
                  <button 
                    onClick={handleLogout}
                    className="text-white/60 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
                  >
                    <LogoutOutlined />
                  </button>
                </Tooltip>
                <button className="text-white/60 hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors">
                  <MoreOutlined />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .sidebar-menu .ant-menu-item,
        .sidebar-menu .ant-menu-submenu-title {
          color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 8px;
          margin: 2px 0;
        }
        .sidebar-menu .ant-menu-item:hover,
        .sidebar-menu .ant-menu-submenu-title:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        .sidebar-menu .ant-menu-item-selected {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }
        .sidebar-menu .ant-menu-sub {
          background: transparent !important;
        }
        .sidebar-menu .ant-menu-item-icon,
        .sidebar-menu .ant-menu-submenu-arrow {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        .sidebar-menu .ant-menu-item-selected .ant-menu-item-icon {
          color: white !important;
        }
        /* Hide tooltips when sidebar is collapsed */
        .sidebar-menu.ant-menu-inline-collapsed .ant-tooltip,
        .ant-menu-inline-collapsed-tooltip {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}</style>
    </aside>
  );
};
