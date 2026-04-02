import { UserRole, MenuItem, QuickAccess, DashboardMetric } from '@/types/user';

// Quick Access configurations per role
export const quickAccessByRole: Record<UserRole, QuickAccess[]> = {
  OTEC_REPRESENTANTE: [
    { id: '1', title: 'Gestión Documental', description: 'Conecta', icon: 'FileText', url: '#', external: true },
    { id: '2', title: 'Cursos y Servicios', icon: 'BookOpen', url: '/cursos' },
    { id: '3', title: 'Gestión de Facturación', description: 'Artikos', icon: 'Receipt', url: '#', external: true },
    { id: '4', title: 'Mi Buscador', icon: 'Search', url: '/buscador' },
    { id: '5', title: 'Reportes', description: 'Capacinet 2.0', icon: 'BarChart3', url: '/reportes' },
  ],
  OTEC: [
    { id: '1', title: 'Gestión Documental', description: 'Conecta', icon: 'FileText', url: '#', external: true },
    { id: '2', title: 'Cursos y Servicios', icon: 'BookOpen', url: '/cursos' },
    { id: '3', title: 'Gestión de Facturación', description: 'Artikos', icon: 'Receipt', url: '#', external: true },
    { id: '4', title: 'Mi Buscador', icon: 'Search', url: '/buscador' },
    { id: '5', title: 'Reportes', description: 'Capacinet 2.0', icon: 'BarChart3', url: '/reportes' },
  ],
  EMPRESA: [
    { id: '1', title: 'Gestión Documental', description: 'Conecta', icon: 'FileText', url: '#', external: true },
    { id: '2', title: 'Inscripción de Cursos', icon: 'GraduationCap', url: '/inscripcion' },
    { id: '3', title: 'Data 360', icon: 'PieChart', url: '/data360' },
    { id: '4', title: 'Rol Asesor', icon: 'UserCheck', url: '/asesor' },
    { id: '5', title: 'Reportes', description: 'Capacinet 2.0', icon: 'BarChart3', url: '/reportes' },
  ],
  EMPRESA_REPRESENTANTE: [
    { id: '1', title: 'Gestión Documental', description: 'Conecta', icon: 'FileText', url: '#', external: true },
    { id: '2', title: 'Inscripción de Cursos', icon: 'GraduationCap', url: '/inscripcion' },
    { id: '3', title: 'Data 360', icon: 'PieChart', url: '/data360' },
    { id: '4', title: 'Rol Asesor', icon: 'UserCheck', url: '/asesor' },
    { id: '5', title: 'Reportes', description: 'Capacinet 2.0', icon: 'BarChart3', url: '/reportes' },
  ],
  OTIC: [
    { id: '1', title: 'Gestión Documental', description: 'Conecta', icon: 'FileText', url: '#', external: true },
    { id: '2', title: 'Inscripción de Cursos', icon: 'GraduationCap', url: '/inscripcion' },
    { id: '3', title: 'Data 360', icon: 'PieChart', url: '/data360' },
    { id: '4', title: 'Reportes', description: 'Capacinet 2.0', icon: 'BarChart3', url: '/reportes' },
    { id: '5', title: 'Rol Asesor', icon: 'UserCheck', url: '/asesor' },
  ],
  ASESOR: [
    { id: '1', title: 'Dashboard', icon: 'LayoutDashboard', url: '/asesor' },
    { id: '2', title: 'Mi Buscador', icon: 'Search', url: '/asesor/buscador' },
    { id: '3', title: 'Mi Recomendador', icon: 'Sparkles', url: '/asesor/recomendador' },
    { id: '4', title: 'Mi DNC', icon: 'Target', url: '/asesor/dnc' },
    { id: '5', title: 'Mi Ruta', icon: 'Route', url: '/asesor/ruta' },
  ],
};

// Menu configurations per role
export const menuByRole: Record<UserRole, MenuItem[]> = {
  OTEC: [
    { key: 'inicio', label: 'Inicio', icon: 'Home', url: '/dashboard' },
    { 
      key: 'cursos', 
      label: 'Cursos y Servicios', 
      icon: 'BookOpen',
      children: [
        { key: 'cursos-resumen', label: 'Resumen', url: '/cursos/resumen' },
        { key: 'cursos-contenido', label: 'Contenido del Curso', url: '/cursos/contenido' },
        { key: 'cursos-inscripcion', label: 'Inscripción', url: '/cursos/inscripcion' },
      ]
    },
    { 
      key: 'reportes', 
      label: 'Reportes y Análisis', 
      icon: 'BarChart3',
      children: [
        { key: 'reportes-main', label: 'Reportes', url: '/reportes' },
        { key: 'encuestas', label: 'Encuestas', url: '/encuestas' },
      ]
    },
    { 
      key: 'formacion', 
      label: 'Formación', 
      icon: 'GraduationCap',
      children: [
        { key: 'rol-asesor', label: 'Rol Asesor', url: '/asesor' },
        { key: 'mi-buscador', label: 'Mi Buscador', url: '/formacion/buscador' },
        { key: 'mallas', label: 'Mallas de Formación', url: '/formacion/mallas' },
        { key: 'dnc', label: 'DNC', url: '/formacion/dnc' },
      ]
    },
    { 
      key: 'documental', 
      label: 'Gestión Documental', 
      icon: 'FileText',
      children: [
        { key: 'doc-cursos', label: 'Documentación de Cursos', url: '/documentos/cursos' },
      ]
    },
    { 
      key: 'facturacion', 
      label: 'Facturación', 
      icon: 'Receipt',
      children: [
        { key: 'estados-pago', label: 'Estados de Pago', url: '/facturacion/estados' },
      ]
    },
  ],
  OTEC_REPRESENTANTE: [
    { key: 'inicio', label: 'Inicio', icon: 'Home', url: '/dashboard' },
    { 
      key: 'cursos', 
      label: 'Cursos y Servicios', 
      icon: 'BookOpen',
      children: [
        { key: 'cursos-resumen', label: 'Resumen', url: '/cursos/resumen' },
        { key: 'cursos-contenido', label: 'Contenido del Curso', url: '/cursos/contenido' },
        { key: 'cursos-inscripcion', label: 'Inscripción', url: '/cursos/inscripcion' },
      ]
    },
    { 
      key: 'reportes', 
      label: 'Reportes y Análisis', 
      icon: 'BarChart3',
      children: [
        { key: 'reportes-main', label: 'Reportes', url: '/reportes' },
        { key: 'encuestas', label: 'Encuestas', url: '/encuestas' },
      ]
    },
    { 
      key: 'formacion', 
      label: 'Formación', 
      icon: 'GraduationCap',
      children: [
        { key: 'rol-asesor', label: 'Rol Asesor', url: '/asesor' },
        { key: 'mi-buscador', label: 'Mi Buscador', url: '/formacion/buscador' },
        { key: 'mallas', label: 'Mallas de Formación', url: '/formacion/mallas' },
      ]
    },
    { 
      key: 'documental', 
      label: 'Gestión Documental', 
      icon: 'FileText',
      children: [
        { key: 'doc-cursos', label: 'Documentación de Cursos', url: '/documentos/cursos' },
      ]
    },
    { 
      key: 'facturacion', 
      label: 'Facturación', 
      icon: 'Receipt',
      children: [
        { key: 'estados-pago', label: 'Estados de Pago', url: '/facturacion/estados' },
      ]
    },
  ],
  EMPRESA: [
    { key: 'inicio', label: 'Inicio', icon: 'Home', url: '/dashboard' },
    { 
      key: 'cursos', 
      label: 'Cursos y Servicios', 
      icon: 'BookOpen',
      children: [
        { key: 'cursos-resumen', label: 'Resumen', url: '/cursos/resumen' },
        { key: 'cursos-inscripcion', label: 'Inscripción', url: '/cursos/inscripcion' },
      ]
    },
    { 
      key: 'reportes', 
      label: 'Reportes y Análisis', 
      icon: 'BarChart3',
      children: [
        { key: 'data360', label: 'Data 360', url: '/data360' },
        { key: 'reportes-main', label: 'Reportes', url: '/reportes' },
        { key: 'encuestas', label: 'Encuestas', url: '/encuestas' },
      ]
    },
    { 
      key: 'formacion', 
      label: 'Formación', 
      icon: 'GraduationCap',
      children: [
        { key: 'rol-asesor', label: 'Rol Asesor', url: '/asesor' },
        { key: 'mi-buscador', label: 'Mi Buscador', url: '/formacion/buscador' },
        { key: 'mallas', label: 'Mallas de Formación', url: '/formacion/mallas' },
      ]
    },
    { 
      key: 'documental', 
      label: 'Gestión Documental', 
      icon: 'FileText',
      children: [
        { key: 'doc-cursos', label: 'Documentación de Cursos', url: '/documentos/cursos' },
        { key: 'digitalizacion', label: 'Digitalización', url: '/documentos/digitalizacion' },
      ]
    },
  ],
  EMPRESA_REPRESENTANTE: [
    { key: 'inicio', label: 'Inicio', icon: 'Home', url: '/dashboard' },
    { 
      key: 'cursos', 
      label: 'Cursos y Servicios', 
      icon: 'BookOpen',
      children: [
        { key: 'cursos-resumen', label: 'Resumen', url: '/cursos/resumen' },
        { key: 'cursos-inscripcion', label: 'Inscripción', url: '/cursos/inscripcion' },
      ]
    },
    { 
      key: 'reportes', 
      label: 'Reportes y Análisis', 
      icon: 'BarChart3',
      children: [
        { key: 'data360', label: 'Data 360', url: '/data360' },
        { key: 'reportes-main', label: 'Reportes', url: '/reportes' },
        { key: 'encuestas', label: 'Encuestas', url: '/encuestas' },
      ]
    },
    { 
      key: 'formacion', 
      label: 'Formación', 
      icon: 'GraduationCap',
      children: [
        { key: 'rol-asesor', label: 'Rol Asesor', url: '/asesor' },
        { key: 'mi-buscador', label: 'Mi Buscador', url: '/formacion/buscador' },
        { key: 'mallas', label: 'Mallas de Formación', url: '/formacion/mallas' },
      ]
    },
    { 
      key: 'documental', 
      label: 'Gestión Documental', 
      icon: 'FileText',
      children: [
        { key: 'doc-cursos', label: 'Documentación de Cursos', url: '/documentos/cursos' },
        { key: 'digitalizacion', label: 'Digitalización', url: '/documentos/digitalizacion' },
      ]
    },
  ],
  OTIC: [
    { key: 'inicio', label: 'Inicio', icon: 'Home', url: '/dashboard' },
    { 
      key: 'cursos', 
      label: 'Cursos y Servicios', 
      icon: 'BookOpen',
      children: [
        { key: 'cursos-resumen', label: 'Resumen', url: '/cursos/resumen' },
        { key: 'cursos-inscripcion', label: 'Inscripción', url: '/cursos/inscripcion' },
        { key: 'comunicacion-sence', label: 'Comunicación Sence', url: '/cursos/sence' },
        { key: 'liquidacion-sence', label: 'Liquidación Sence', url: '/cursos/liquidacion' },
      ]
    },
    { 
      key: 'reportes', 
      label: 'Reportes y Análisis', 
      icon: 'BarChart3',
      children: [
        { key: 'data360', label: 'Data 360', url: '/data360' },
        { key: 'reportes-main', label: 'Reportes', url: '/reportes' },
        { key: 'encuestas', label: 'Encuestas', url: '/encuestas' },
      ]
    },
    { 
      key: 'formacion', 
      label: 'Formación', 
      icon: 'GraduationCap',
      children: [
        { key: 'rol-asesor', label: 'Rol Asesor', url: '/asesor' },
        { key: 'mi-buscador', label: 'Mi Buscador', url: '/formacion/buscador' },
        { key: 'mallas', label: 'Mallas de Formación', url: '/formacion/mallas' },
      ]
    },
    { 
      key: 'documental', 
      label: 'Gestión Documental', 
      icon: 'FileText',
      children: [
        { key: 'doc-cursos', label: 'Documentación de Cursos', url: '/documentos/cursos' },
        { key: 'digitalizacion', label: 'Digitalización', url: '/documentos/digitalizacion' },
        { key: 'biblioteca', label: 'Biblioteca Documental', url: '/documentos/biblioteca' },
      ]
    },
    { 
      key: 'facturacion', 
      label: 'Facturación', 
      icon: 'Receipt',
      children: [
        { key: 'gestion-facturas', label: 'Gestión de Facturas', url: '/facturacion/gestion' },
      ]
    },
    { 
      key: 'admin', 
      label: 'Administración', 
      icon: 'Settings',
      children: [
        { key: 'admin-usuarios', label: 'Usuarios', url: '/admin/usuarios' },
        { key: 'admin-carteras', label: 'Asignación de Carteras Comerciales', url: '/admin/carteras' },
        { key: 'admin-perfiles', label: 'Perfiles', url: '/admin/perfiles' },
        { key: 'admin-sistemas', label: 'Sistemas', url: '/admin/sistemas' },
        { key: 'admin-reglas', label: 'Reglas de Negocio', url: '/admin/reglas' },
        { key: 'admin-portal', label: 'Apertura Portal de Comunicaciones', url: '/admin/portal' },
      ]
    },
    { 
      key: 'ayuda', 
      label: 'Ayuda y Soporte', 
      icon: 'HelpCircle',
      children: [
        { key: 'oticket', label: 'OTICKET', url: '/ayuda/oticket' },
        { key: 'rectificacion', label: 'Rectificación Sence', url: '/ayuda/rectificacion' },
        { key: 'centro-ayuda', label: 'Centro de Ayuda', url: '/ayuda/centro' },
      ]
    },
  ],
  ASESOR: [
    { key: 'inicio', label: 'Inicio', icon: 'Home', url: '/dashboard' },
    { 
      key: 'rol-asesor', 
      label: 'Rol Asesor', 
      icon: 'UserCheck',
      children: [
        { key: 'asesor-dashboard', label: 'Dashboard', url: '/asesor' },
        { key: 'asesor-diagnostico', label: 'Diagnóstico', url: '/asesor/diagnostico' },
        { key: 'asesor-herramientas', label: 'Herramientas', url: '/asesor/herramientas' },
        { key: 'asesor-resultados', label: 'Resultados', url: '/asesor/resultados' },
        { key: 'asesor-plan', label: 'Plan de Capacitación', url: '/asesor/plan' },
      ]
    },
  ],
};

// Dashboard metrics per role
export const dashboardMetricsByRole: Record<UserRole, DashboardMetric[]> = {
  OTEC: [
    { id: '1', label: 'Cursos Activos', value: 24, icon: 'BookOpen', change: 12, changeType: 'positive' },
    { id: '2', label: 'Cursos Ejecutados', value: 156, icon: 'CheckCircle' },
    { id: '3', label: 'Cursos Cerrados', value: 89, icon: 'Archive' },
    { id: '4', label: 'Participantes Inscritos', value: 1240, icon: 'Users' },
    { id: '5', label: 'Participantes Certificados', value: 1089, icon: 'Award', change: 87.8, changeType: 'positive' },
    { id: '6', label: 'Cursos con Observaciones SENCE', value: '8%', icon: 'AlertCircle', changeType: 'negative' },
    { id: '7', label: 'Promedio Días Comunicación', value: 3.2, icon: 'Clock' },
    { id: '8', label: 'DJO Presentadas', value: 45, icon: 'FileCheck' },
    { id: '9', label: 'DJO Pendientes', value: 12, icon: 'FileClock', changeType: 'neutral' },
    { id: '10', label: 'DJO Rechazadas', value: 3, icon: 'FileX', changeType: 'negative' },
    { id: '11', label: 'DJP Pendientes', value: 8, icon: 'FileQuestion' },
    { id: '12', label: 'LCE Pendientes', value: 5, icon: 'FileText' },
    { id: '13', label: 'OC Emitidas', value: 67, icon: 'Receipt' },
    { id: '14', label: 'OC Pendientes Facturación', value: 15, icon: 'ReceiptText' },
    { id: '15', label: 'Promedio Facturación', value: '$2.4M', icon: 'DollarSign' },
    { id: '16', label: 'Promedio Días Pago', value: 18, icon: 'Calendar' },
  ],
  OTEC_REPRESENTANTE: [
    { id: '1', label: 'DJO Presentadas', value: 45, icon: 'FileCheck', change: 5, changeType: 'positive' },
    { id: '2', label: 'DJO Pendientes', value: 12, icon: 'FileClock', changeType: 'neutral' },
    { id: '3', label: 'DJO Rechazadas', value: 3, icon: 'FileX', changeType: 'negative' },
    { id: '4', label: 'Histórico Firmas DJ', value: 234, icon: 'PenTool' },
  ],
  EMPRESA: [
    { id: '1', label: 'Cursos en Ejecución', value: 8, icon: 'Play', change: 2, changeType: 'positive' },
    { id: '2', label: 'Cursos Finalizados', value: 34, icon: 'CheckCircle' },
    { id: '3', label: 'Cursos Pendientes de Cierre', value: 5, icon: 'Clock' },
    { id: '4', label: 'Próximos Cursos', value: 12, icon: 'Calendar' },
    { id: '5', label: 'Trabajadores Capacitados', value: 156, icon: 'Users' },
    { id: '6', label: 'Trabajadores Planificados', value: 200, icon: 'UserPlus' },
    { id: '7', label: 'Cursos con Observaciones', value: 2, icon: 'AlertCircle', changeType: 'negative' },
    { id: '8', label: 'Inversión Mensual', value: '$12.5M', icon: 'TrendingUp' },
    { id: '9', label: 'Franquicia Disponible', value: '$45M', icon: 'Wallet' },
    { id: '10', label: 'Monto Comprometido', value: '$28M', icon: 'Lock' },
    { id: '11', label: 'Monto Utilizado', value: '$18M', icon: 'CreditCard' },
    { id: '12', label: 'Saldo Disponible', value: '$17M', icon: 'PiggyBank', changeType: 'positive' },
  ],
  EMPRESA_REPRESENTANTE: [
    { id: '1', label: 'Cursos en Ejecución', value: 8, icon: 'Play' },
    { id: '2', label: 'Cursos Finalizados', value: 34, icon: 'CheckCircle' },
    { id: '3', label: 'Próximos Cursos', value: 12, icon: 'Calendar' },
    { id: '4', label: 'Trabajadores Capacitados', value: 156, icon: 'Users' },
  ],
  OTIC: [
    { id: '1', label: 'Cursos Activos', value: 156, icon: 'BookOpen' },
    { id: '2', label: 'Empresas Afiliadas', value: 89, icon: 'Building2' },
    { id: '3', label: 'OTECs Asociadas', value: 34, icon: 'Briefcase' },
    { id: '4', label: 'Franquicia Total', value: '$890M', icon: 'Wallet' },
    { id: '5', label: 'Monto Liquidado', value: '$567M', icon: 'CheckCircle' },
    { id: '6', label: 'Pendiente Liquidación', value: '$123M', icon: 'Clock' },
  ],
  ASESOR: [
    { id: '1', label: 'Diagnósticos Realizados', value: 12, icon: 'CheckCircle', change: 3, changeType: 'positive' },
    { id: '2', label: 'Herramientas Utilizadas', value: 28, icon: 'Sparkles' },
    { id: '3', label: 'Nivel de Madurez', value: '68%', icon: 'TrendingUp', changeType: 'positive' },
    { id: '4', label: 'Áreas de Mejora', value: 5, icon: 'AlertTriangle', changeType: 'neutral' },
  ],
};

export const getRoleDisplayName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    OTIC: 'OTIC',
    OTEC: 'OTEC',
    OTEC_REPRESENTANTE: 'OTEC Representante',
    EMPRESA: 'Empresa',
    EMPRESA_REPRESENTANTE: 'Empresa Representante',
    ASESOR: 'Asesor',
  };
  return names[role];
};

export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    OTIC: 'Organismo Técnico Intermedio',
    OTEC: 'Organismo Técnico de Capacitación',
    OTEC_REPRESENTANTE: 'Representante Legal OTEC',
    EMPRESA: 'Empresa o Institución',
    EMPRESA_REPRESENTANTE: 'Representante de Empresa',
    ASESOR: 'Asesor de Capacitación',
  };
  return descriptions[role];
};
