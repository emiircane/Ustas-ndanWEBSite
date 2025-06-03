-- SQL to run in Supabase SQL Editor
CREATE OR REPLACE FUNCTION add_admin_column_to_kullanicilar()
RETURNS void AS $$
BEGIN
  -- Check if admin column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'kullanicilar'
    AND column_name = 'admin'
  ) THEN
    -- Add the admin column
    ALTER TABLE kullanicilar ADD COLUMN admin BOOLEAN DEFAULT false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 