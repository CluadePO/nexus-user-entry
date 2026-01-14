import React from 'react';
import { UserRole } from '@/types/user';
import { getRoleDisplayName, getRoleDescription } from '@/config/menuConfig';
import { Building2, GraduationCap, Users, CheckCircle2 } from 'lucide-react';

interface UserTypeSelectorProps {
  selectedType: UserRole;
  onSelect: (type: UserRole) => void;
}

const userTypeConfig: { role: UserRole; icon: React.ReactNode; color: string }[] = [
  { role: 'OTIC', icon: <Building2 className="w-8 h-8" />, color: 'text-primary' },
  { role: 'OTEC', icon: <GraduationCap className="w-8 h-8" />, color: 'text-blue-500' },
  { role: 'EMPRESA', icon: <Users className="w-8 h-8" />, color: 'text-orange-500' },
];

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ selectedType, onSelect }) => {
  const isRepresentante = selectedType.includes('REPRESENTANTE');
  const baseRole = selectedType.replace('_REPRESENTANTE', '') as UserRole;
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        Tipo de Usuario
      </label>
      <div className="grid grid-cols-3 gap-3">
        {userTypeConfig.map(({ role, icon, color }) => {
          const isSelected = baseRole === role || selectedType === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onSelect(role)}
              className={`
                user-type-card relative flex flex-col items-center text-center p-4
                ${isSelected ? 'selected border-primary' : ''}
              `}
            >
              {isSelected && (
                <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary" />
              )}
              <div className={`mb-2 ${isSelected ? 'text-primary' : color}`}>
                {icon}
              </div>
              <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {getRoleDisplayName(role)}
              </span>
              <span className="text-xs text-muted-foreground mt-1 leading-tight">
                {getRoleDescription(role)}
              </span>
            </button>
          );
        })}
      </div>
      
      {(baseRole === 'OTEC' || baseRole === 'EMPRESA') && (
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRepresentante}
              onChange={(e) => {
                const newRole = e.target.checked 
                  ? `${baseRole}_REPRESENTANTE` as UserRole 
                  : baseRole;
                onSelect(newRole);
              }}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              Soy representante legal
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
