ALTER TABLE bookings ADD COLUMN timetable_id INTEGER;

ALTER TABLE bookings
ALTER COLUMN timetable_id
SET NOT NULL,
DROP COLUMN hour;

ALTER TABLE bookings
ADD CONSTRAINT fk_bookings_timetables FOREIGN KEY (timetable_id) REFERENCES timetables (id) ON UPDATE CASCADE ON DELETE RESTRICT;