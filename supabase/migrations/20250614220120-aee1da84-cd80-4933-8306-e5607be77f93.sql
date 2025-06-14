
-- This policy allows anyone to read from the aralogo_simples table.
CREATE POLICY "Public can view all stones"
ON "public"."aralogo_simples"
FOR SELECT
USING (true);
