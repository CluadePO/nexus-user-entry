import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  dncName?: string;
  onViewTracking: () => void;
  onBackToList: () => void;
}

const DNCSuccess: React.FC<Props> = ({ dncName, onViewTracking, onBackToList }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl p-10 text-center space-y-6 border-primary/10 shadow-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">¡Tu DNC ha sido creada exitosamente!</h1>
          <p className="text-sm text-muted-foreground">
            {dncName ? <span className="font-medium text-foreground">{dncName}</span> : null}
            {dncName ? ' · ' : ''}Los participantes recibirán su invitación la próxima semana.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={onViewTracking}>Ver seguimiento</Button>
          <Button variant="outline" onClick={onBackToList}>Volver al listado de DNC</Button>
          <Button variant="ghost" onClick={() => toast.success('Resumen PDF descargado')} className="gap-2">
            <FileDown className="w-4 h-4" /> Descargar resumen PDF
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DNCSuccess;
