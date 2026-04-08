import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, FolderX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContractCardProps {
  title: string;
  icon: React.ReactNode;
  proximosVencer: number;
  enVigencia: number;
  faltaDocumentacion: number;
  accentColor: string;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
}

const ContractCard: React.FC<ContractCardProps> = ({
  title,
  icon,
  proximosVencer,
  enVigencia,
  faltaDocumentacion,
  accentColor,
  badgeVariant,
}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}>
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`} />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${accentColor.replace('bg-', 'bg-')}/10 flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <Badge variant={badgeVariant} className="mt-1 text-[10px]">
              {proximosVencer + enVigencia + faltaDocumentacion} cursos
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Próximos a vencer */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium text-orange-700">Próximos a vencer</span>
          </div>
          <span className="text-lg font-bold text-orange-600">{proximosVencer}</span>
        </div>

        {/* En vigencia */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-green-700">En vigencia</span>
          </div>
          <span className="text-lg font-bold text-green-600">{enVigencia}</span>
        </div>

        {/* Falta documentación */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-2">
            <FolderX className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-red-700">Falta documentación</span>
          </div>
          <span className="text-lg font-bold text-red-600">{faltaDocumentacion}</span>
        </div>
      </div>
    </div>
  );
};

export const ContractManagementSection: React.FC = () => {
  // Mock data - replace with real data from API
  const contractData = [
    {
      title: 'Precontratos',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      proximosVencer: 8,
      enVigencia: 24,
      faltaDocumentacion: 5,
      accentColor: 'bg-blue-500',
      badgeVariant: 'default' as const,
    },
    {
      title: 'Postcontratos',
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      proximosVencer: 3,
      enVigencia: 18,
      faltaDocumentacion: 7,
      accentColor: 'bg-purple-500',
      badgeVariant: 'secondary' as const,
    },
    {
      title: 'Normales',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      proximosVencer: 12,
      enVigencia: 45,
      faltaDocumentacion: 2,
      accentColor: 'bg-emerald-500',
      badgeVariant: 'outline' as const,
    },
  ];

  const totalProximos = contractData.reduce((sum, c) => sum + c.proximosVencer, 0);
  const totalVigentes = contractData.reduce((sum, c) => sum + c.enVigencia, 0);
  const totalFaltaDoc = contractData.reduce((sum, c) => sum + c.faltaDocumentacion, 0);

  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className="flex flex-wrap gap-4 p-4 rounded-lg border bg-muted/30">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-orange-600">{totalProximos}</span> próximos a vencer
          </span>
        </div>
        <div className="w-px h-5 bg-border" />
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-green-600">{totalVigentes}</span> en vigencia
          </span>
        </div>
        <div className="w-px h-5 bg-border" />
        <div className="flex items-center gap-2">
          <FolderX className="w-4 h-4 text-red-500" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-red-600">{totalFaltaDoc}</span> con falta de documentación
          </span>
        </div>
      </div>

      {/* Contract cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contractData.map((contract) => (
          <ContractCard key={contract.title} {...contract} />
        ))}
      </div>
    </div>
  );
};
