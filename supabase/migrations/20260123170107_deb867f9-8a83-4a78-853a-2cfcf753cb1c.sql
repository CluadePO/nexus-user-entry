-- Create design notes table for permanent storage
CREATE TABLE public.design_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for design notes - internal tool)
ALTER TABLE public.design_notes ENABLE ROW LEVEL SECURITY;

-- Allow public read access (design notes are for internal development tracking)
CREATE POLICY "Allow public read access on design_notes" 
  ON public.design_notes 
  FOR SELECT 
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert on design_notes" 
  ON public.design_notes 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update on design_notes" 
  ON public.design_notes 
  FOR UPDATE 
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_design_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_design_notes_updated_at
  BEFORE UPDATE ON public.design_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_design_notes_updated_at();