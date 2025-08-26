-- Remove created_by column from exams table since exams are created by admins only

-- Drop the foreign key constraint first
ALTER TABLE exams DROP CONSTRAINT IF EXISTS exams_created_by_fkey;

-- Drop the created_by column
ALTER TABLE exams DROP COLUMN IF EXISTS created_by;
