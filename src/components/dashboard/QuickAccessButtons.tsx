import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { quickAccessByRole } from '@/config/menuConfig';
import { DynamicIcon } from '@/components/icons/DynamicIcon';
import { Button } from 'antd';
import { ExternalLink } from 'lucide-react';

export const QuickAccessButtons: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const quickAccess = quickAccessByRole[user.role] || [];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {quickAccess.map((item) => (
        <Button
          key={item.id}
          type="default"
          size="large"
          href={item.url}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-2 h-14 px-6 rounded-lg border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200"
          icon={<DynamicIcon name={item.icon} className="w-5 h-5 text-primary" />}
        >
          <span className="font-medium text-foreground">{item.title}</span>
          {item.external && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
        </Button>
      ))}
    </div>
  );
};
