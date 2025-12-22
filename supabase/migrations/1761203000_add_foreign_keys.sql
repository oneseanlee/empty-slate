-- Migration: add_foreign_keys
-- Add foreign keys needed for nested selects.

ALTER TABLE courses
  ADD CONSTRAINT courses_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE lessons
  ADD CONSTRAINT lessons_course_id_fkey
  FOREIGN KEY (course_id) REFERENCES courses(id);

ALTER TABLE certificates
  ADD CONSTRAINT certificates_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id);
