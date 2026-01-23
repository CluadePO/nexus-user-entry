import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, X, ChevronDown, ChevronUp, Clock, StickyNote, Archive, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DesignNote {
  id: string;
  title: string;
  content: string;
  status: 'pendiente' | 'en_progreso' | 'completado';
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800 border-green-300' },
};

export const DesignNotesPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notes, setNotes] = useState<DesignNote[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'pendiente' | 'en_progreso' | 'completado'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load notes from database on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('design_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setNotes((data || []) as DesignNote[]);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las notas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('design_notes')
        .insert({
          title: newTitle.trim(),
          content: newContent.trim(),
          status: 'pendiente',
        })
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [data as DesignNote, ...prev]);
      setNewTitle('');
      setNewContent('');
      
      toast({
        title: 'Nota agregada',
        description: 'La nota se guardó permanentemente',
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la nota',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (id: string, status: DesignNote['status']) => {
    try {
      const { error } = await supabase
        .from('design_notes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, status, updated_at: new Date().toISOString() }
          : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    }
  };

  const completedCount = notes.filter(n => n.status === 'completado').length;
  const pendingCount = notes.filter(n => n.status === 'pendiente').length;

  const filteredNotes = filter === 'all' 
    ? notes 
    : notes.filter(note => note.status === filter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <StickyNote className="h-6 w-6" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
            {pendingCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50 bg-background border rounded-lg shadow-2xl transition-all duration-300",
        isMinimized ? "w-80" : "w-96"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Notas de Diseño</span>
          <Badge variant="outline" className="text-xs px-1.5 py-0 gap-1">
            <Archive className="h-3 w-3" />
            Cloud
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Add new note form */}
          <div className="p-3 border-b space-y-2">
            <Input
              placeholder="Título de la nota..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-sm"
            />
            <Textarea
              placeholder="Descripción del punto pendiente..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="text-sm min-h-[60px] resize-none"
            />
            <Button 
              onClick={addNote} 
              size="sm" 
              className="w-full"
              disabled={!newTitle.trim() || !newContent.trim() || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageSquarePlus className="h-4 w-4 mr-2" />
              )}
              Agregar Nota
            </Button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-2 border-b bg-muted/30">
            {(['all', 'pendiente', 'en_progreso', 'completado'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'Todas' : statusConfig[status].label}
              </Button>
            ))}
          </div>

          {/* Notes list */}
          <ScrollArea className="h-64">
            <div className="p-2 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No hay notas {filter !== 'all' && `con estado "${statusConfig[filter as keyof typeof statusConfig]?.label}"`}
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div 
                    key={note.id} 
                    className={cn(
                      "p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow",
                      note.status === 'completado' && "opacity-70"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm leading-tight">{note.title}</h4>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">
                        #{note.id.slice(-4)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={note.status}
                        onChange={(e) => updateStatus(note.id, e.target.value as DesignNote['status'])}
                        className={cn(
                          "text-xs px-2 py-1 rounded border cursor-pointer",
                          statusConfig[note.status].color
                        )}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="completado">Completado</option>
                      </select>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDate(note.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer with stats */}
          <div className="p-2 border-t bg-muted/30 text-xs text-muted-foreground text-center">
            ☁️ Guardado en la nube: {notes.length} notas • Pendientes: {pendingCount} • Completadas: {completedCount}
          </div>
        </>
      )}
    </div>
  );
};
