ALTER TABLE timetables
ALTER COLUMN hour TYPE TIME
USING hour::time;