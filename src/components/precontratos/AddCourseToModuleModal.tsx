import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onClose: () => void;
  moduleId: string;
  clienteName: string;
  onAdd: (sc: string) => void;
}

const AddCourseToModuleModal: React.FC<Props> = ({ open, onClose, moduleId, clienteName, onAdd }) => {
  const [sc, setSc] = useState('');

  const handleSubmit = () => {
    if (!sc.trim()) return;
    onAdd(sc.trim());
    setSc('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setSc(''); onClose(); } }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">
            Agregar curso al módulo <span className="text-primary font-bold">{moduleId}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">Cliente: {clienteName}</p>
        </DialogHeader>

        <div className="space-y-1">
          <Label className="text-xs">Número S.C *</Label>
          <Input
            value={sc}
            onChange={(e) => setSc(e.target.value)}
            placeholder="Ej: 2160200"
            className="h-9 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <p className="text-[11px] text-muted-foreground">Ingrese la S.C del curso que desea vincular a este módulo.</p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => { setSc(''); onClose(); }}>Cancelar</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!sc.trim()}>
            Agregar Curso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseToModuleModal;
