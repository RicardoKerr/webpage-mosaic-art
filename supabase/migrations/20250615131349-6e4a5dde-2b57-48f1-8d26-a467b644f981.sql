
CREATE TABLE public.aralogo_changes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_email TEXT,
    stone_id INTEGER NOT NULL,
    changes JSONB NOT NULL,
    CONSTRAINT fk_aralogo_simples
        FOREIGN KEY(stone_id) 
        REFERENCES aralogo_simples(id)
        ON DELETE CASCADE
);

COMMENT ON COLUMN public.aralogo_changes.created_at IS 'Timestamp of the change, stored in UTC';
COMMENT ON COLUMN public.aralogo_changes.user_email IS 'Email of the user who made the change';
COMMENT ON COLUMN public.aralogo_changes.stone_id IS 'ID of the stone that was changed';
COMMENT ON COLUMN public.aralogo_changes.changes IS 'JSONB object detailing the changes made';

-- Enable Row Level Security
ALTER TABLE public.aralogo_changes ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read and write changes
CREATE POLICY "Authenticated users can manage changes"
    ON public.aralogo_changes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

