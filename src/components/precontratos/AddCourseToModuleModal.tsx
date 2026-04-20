import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewCourseData {
  sc: string;
  sencenet: string;
  curso: string;
  cliente: string;
  nroPart: number;
  mtFranquicia: string;
  inicioCurso: string;
  modalidad: string;
  tipoContrato: string;
  codigoSence: string;
  vencimientoSence: string;
  celula: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  moduleId: string;
  clienteName: string;
  onAdd: (data: NewCourseData) => void;
}

const AddCourseToModuleModal: React.FC<Props> = ({ open, onClose, moduleId, clienteName, onAdd }) => {
  const [form, setForm] = useState({
    sc: '',
    sencenet: '',
    curso: '',
    nroPart: '',
    mtFranquicia: '',
    inicioCurso: '',
    modalidad: 'E-learning',
    codigoSence: '',
    vencimientoSence: '',
    celula: '',
  });

  const handleSubmit = () => {
    if (!form.sc || !form.curso || !form.nroPart) return;
    onAdd({
      sc: form.sc,
      sencenet: form.sencenet,
      curso: form.curso,
      cliente: clienteName,
      nroPart: parseInt(form.nroPart) || 0,
      mtFranquicia: form.mtFranquicia || '$0',
      inicioCurso: form.inicioCurso,
      modalidad: form.modalidad,
      tipoContrato: 'Precontrato',
      codigoSence: form.codigoSence,
      vencimientoSence: form.vencimientoSence,
      celula: form.celula,
    });
    setForm({ sc: '', sencenet: '', curso: '', nroPart: '', mtFranquicia: '', inicioCurso: '', modalidad: 'E-learning', codigoSence: '', vencimientoSence: '', celula: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            Agregar curso al módulo <span className="text-primary font-bold">{moduleId}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">Cliente: {clienteName}</p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">S.C *</Label>
            <Input value={form.sc} onChange={(e) => setForm(f => ({ ...f, sc: e.target.value }))} placeholder="Ej: 2160200" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sencenet</Label>
            <Input value={form.sencenet} onChange={(e) => setForm(f => ({ ...f, sencenet: e.target.value }))} placeholder="Ej: 6790200" className="h-8 text-xs" />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-xs">Nombre del Curso *</Label>
            <Input value={form.curso} onChange={(e) => setForm(f => ({ ...f, curso: e.target.value }))} placeholder="Nombre del curso" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Nro. Participantes *</Label>
            <Input type="number" value={form.nroPart} onChange={(e) => setForm(f => ({ ...f, nroPart: e.target.value }))} placeholder="0" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">M.T. Franquicia</Label>
            <Input value={form.mtFranquicia} onChange={(e) => setForm(f => ({ ...f, mtFranquicia: e.target.value }))} placeholder="$0" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Inicio Curso</Label>
            <Input type="date" value={form.inicioCurso} onChange={(e) => setForm(f => ({ ...f, inicioCurso: e.target.value }))} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Modalidad</Label>
            <Select value={form.modalidad} onValueChange={(v) => setForm(f => ({ ...f, modalidad: v }))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="E-learning">E-learning</SelectItem>
                <SelectItem value="Presencial">Presencial</SelectItem>
                <SelectItem value="Distancia">Distancia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Código SENCE</Label>
            <Input value={form.codigoSence} onChange={(e) => setForm(f => ({ ...f, codigoSence: e.target.value }))} placeholder="1238XXXXXX" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Vencimiento SENCE</Label>
            <Input type="date" value={form.vencimientoSence} onChange={(e) => setForm(f => ({ ...f, vencimientoSence: e.target.value }))} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Célula</Label>
            <Input value={form.celula} onChange={(e) => setForm(f => ({ ...f, celula: e.target.value }))} placeholder="Ej: Cel1" className="h-8 text-xs" />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!form.sc || !form.curso || !form.nroPart}>
            Agregar Curso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseToModuleModal;
