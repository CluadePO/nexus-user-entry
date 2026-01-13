import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { quickAccessByRole } from '@/config/menuConfig';
import { DynamicIcon } from '@/components/icons/DynamicIcon';
import { ExternalLink } from 'lucide-react';

export const QuickAccessGrid: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const quickAccess = quickAccessByRole[user.role] || [];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">Accesos Directos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {quickAccess.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className="quick-access-card group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <DynamicIcon name={item.icon} className="w-6 h-6" />
              </div>
              {item.external && (
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};
