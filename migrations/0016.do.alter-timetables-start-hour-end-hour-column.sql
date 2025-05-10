ALTER TABLE timetables RENAME COLUMN hour TO start_hour;
ALTER TABLE timetables ADD end_hour TIME;
