-- Create table for commercial portfolio assignments
CREATE TABLE public.portfolio_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_rut TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    -- Portfolio data to assign
    celula TEXT,
    jefe_comercial TEXT,
    analista_comercial TEXT,
    analista_op TEXT,
    lider_servicio_edc TEXT,
    lider_servicio_op TEXT,
    -- Temporal assignment dates
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    -- Metadata
    notas TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by TEXT
);

-- Enable Row Level Security
ALTER TABLE public.portfolio_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for access
CREATE POLICY "Allow public read on portfolio_assignments" 
ON public.portfolio_assignments 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on portfolio_assignments" 
ON public.portfolio_assignments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on portfolio_assignments" 
ON public.portfolio_assignments 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on portfolio_assignments" 
ON public.portfolio_assignments 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolio_assignments_updated_at
BEFORE UPDATE ON public.portfolio_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();