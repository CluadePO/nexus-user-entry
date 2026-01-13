import { 
  Home, BookOpen, BarChart3, GraduationCap, FileText, Receipt, 
  Settings, HelpCircle, Search, Users, Building2, UserCheck,
  PieChart, CheckCircle, Archive, Award, AlertCircle, Clock,
  FileCheck, FileClock, FileX, FileQuestion, DollarSign, Calendar,
  Play, UserPlus, TrendingUp, Wallet, Lock, CreditCard, PiggyBank,
  Briefcase, Circle, PenTool, ExternalLink
} from 'lucide-react';
import { LucideProps } from 'lucide-react';
import React from 'react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  Home,
  BookOpen,
  BarChart3,
  GraduationCap,
  FileText,
  Receipt,
  Settings,
  HelpCircle,
  Search,
  Users,
  Building2,
  UserCheck,
  PieChart,
  CheckCircle,
  Archive,
  Award,
  AlertCircle,
  Clock,
  FileCheck,
  FileClock,
  FileX,
  FileQuestion,
  DollarSign,
  Calendar,
  Play,
  UserPlus,
  TrendingUp,
  Wallet,
  Lock,
  CreditCard,
  PiggyBank,
  Briefcase,
  Circle,
  PenTool,
  ExternalLink,
};

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || Circle;
  return <IconComponent {...props} />;
};
