
-- Remove as políticas antigas, se existirem
DROP POLICY IF EXISTS "Allow public uploads to catalogosimples" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to catalogosimples" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to catalogosimples" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes to catalogosimples" ON storage.objects;

-- Cria as políticas novamente com permissões públicas explícitas
CREATE POLICY "Allow public uploads to catalogosimples"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'catalogosimples');

CREATE POLICY "Allow public access to catalogosimples"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'catalogosimples');

CREATE POLICY "Allow public updates to catalogosimples"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'catalogosimples');

CREATE POLICY "Allow public deletes to catalogosimples"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'catalogosimples');
