export type UserRole = 
  | 'OTIC' 
  | 'OTEC' 
  | 'OTEC_REPRESENTANTE' 
  | 'EMPRESA' 
  | 'EMPRESA_REPRESENTANTE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}

export interface QuickAccess {
  id: string;
  title: string;
  description?: string;
  icon: string;
  url: string;
  external?: boolean;
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  url?: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}
