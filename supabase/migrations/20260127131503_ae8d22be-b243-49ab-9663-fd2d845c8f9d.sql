-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for system users management
CREATE TABLE public.system_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rut TEXT NOT NULL,
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  cargo TEXT,
  holding TEXT,
  empresa TEXT,
  celula TEXT,
  jefe_comercial TEXT,
  lider_servicio_edc TEXT,
  analista_comercial TEXT,
  lider_servicio_op TEXT,
  analista_op TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;

-- Create policies for access
CREATE POLICY "Allow public read on system_users"
ON public.system_users FOR SELECT USING (true);

CREATE POLICY "Allow public insert on system_users"
ON public.system_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on system_users"
ON public.system_users FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on system_users"
ON public.system_users FOR DELETE USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_system_users_updated_at
BEFORE UPDATE ON public.system_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.system_users (rut, email, nombre, apellido, cargo, holding, empresa, celula, jefe_comercial, lider_servicio_edc, analista_comercial, lider_servicio_op, analista_op) VALUES
('12.345.678-9', 'juan.perez@empresa.cl', 'Juan', 'Pérez González', 'Gerente de Capacitación', 'Holding ABC', 'Empresa Alpha S.A.', 'Célula Norte', 'María López', 'Carlos Ruiz', 'Ana Martínez', 'Pedro Soto', 'Luis Vera'),
('11.222.333-4', 'maria.rodriguez@empresa.cl', 'María', 'Rodríguez Silva', 'Jefe de RRHH', 'Holding XYZ', 'Empresa Beta Ltda.', 'Célula Sur', 'Roberto Díaz', 'Fernando Mora', 'Claudia Pino', 'Jorge Rivas', 'Carmen Fuentes'),
('15.666.777-8', 'carlos.mendoza@empresa.cl', 'Carlos', 'Mendoza Vargas', 'Coordinador de Formación', 'Holding ABC', 'Empresa Gamma SpA', 'Célula Centro', 'María López', 'Carlos Ruiz', 'Patricia Núñez', 'Pedro Soto', 'Luis Vera'),
('18.999.000-1', 'andrea.silva@empresa.cl', 'Andrea', 'Silva Morales', 'Analista de Capacitación', 'Holding DEF', 'Empresa Delta S.A.', 'Célula Oriente', 'Gonzalo Parra', 'Mónica Castro', 'Felipe Araya', 'Sandra Vega', 'Raúl Torres'),
('14.555.666-7', 'roberto.castro@empresa.cl', 'Roberto', 'Castro Herrera', 'Supervisor de Operaciones', 'Holding XYZ', 'Empresa Epsilon Ltda.', 'Célula Poniente', 'Roberto Díaz', 'Fernando Mora', 'Claudia Pino', 'Jorge Rivas', 'Carmen Fuentes');