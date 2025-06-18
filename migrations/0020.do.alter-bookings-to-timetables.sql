ALTER TABLE bookings
DROP CONSTRAINT fk_bookings_timetables,
ADD CONSTRAINT fk_bookings_timetables FOREIGN KEY (timetable_id) REFERENCES timetables (id) ON UPDATE RESTRICT ON DELETE RESTRICT;