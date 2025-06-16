
-- Add Enable_On_Off column to aralogo_simples table
ALTER TABLE public.aralogo_simples 
ADD COLUMN "Enable_On_Off" boolean NOT NULL DEFAULT true;

-- Add comment to explain the column purpose
COMMENT ON COLUMN public.aralogo_simples."Enable_On_Off" IS 'Controls whether the stone is visible in the viewer (true = visible, false = hidden/discontinued)';
