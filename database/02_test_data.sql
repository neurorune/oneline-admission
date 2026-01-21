-- Test Data for Online University Admission Platform
-- Import this after creating the schema with 01_create_schema.sql

-- Insert Admin User
INSERT INTO users (name, email, password, role, is_verified) VALUES
('System Admin', 'admin@test.com', 'admin123', 'admin', true);

-- Insert Universities (all pending verification)
INSERT INTO users (name, email, password, role, is_verified) VALUES
('University of Dhaka', 'dhaka@university.com', 'dhaka123', 'university', false),
('BUET', 'buet@university.com', 'buet123', 'university', false),
('Jahangirnagar University', 'ju@university.com', 'ju123', 'university', false),
('North South University', 'nsu@university.com', 'nsu123', 'university', false),
('East West University', 'ewu@university.com', 'ewu123', 'university', false),
('Rajshahi University', 'ru@university.com', 'ru123', 'university', false),
('Chittagong University', 'cu@university.com', 'cu123', 'university', false),
('BRAC University', 'brac@university.com', 'brac123', 'university', false),
('Independent University', 'iub@university.com', 'iub123', 'university', false),
('Daffodil International University', 'diu@university.com', 'diu123', 'university', false);

-- Insert University Profiles
INSERT INTO universities (user_id, name, location, type, website_url, is_verified) VALUES
(2, 'University of Dhaka', 'Dhaka', 'public', 'https://du.ac.bd', false),
(3, 'BUET', 'Dhaka', 'public', 'https://buet.ac.bd', false),
(4, 'Jahangirnagar University', 'Savar', 'public', 'https://juniv.edu', false),
(5, 'North South University', 'Dhaka', 'private', 'https://northsouth.edu', false),
(6, 'East West University', 'Dhaka', 'private', 'https://ewubd.edu', false),
(7, 'Rajshahi University', 'Rajshahi', 'public', 'https://ru.ac.bd', false),
(8, 'Chittagong University', 'Chittagong', 'public', 'https://cu.ac.bd', false),
(9, 'BRAC University', 'Dhaka', 'private', 'https://bracu.ac.bd', false),
(10, 'Independent University', 'Dhaka', 'private', 'https://iub.edu.bd', false),
(11, 'Daffodil International University', 'Dhaka', 'private', 'https://daffodilvarsity.edu.bd', false);

-- Insert Students (all pending verification)
INSERT INTO users (name, email, password, role, is_verified) VALUES
('Rahim Ahmed', 'rahim@student.com', 'rahim123', 'student', false),
('Fatima Khan', 'fatima@student.com', 'fatima123', 'student', false),
('Karim Hassan', 'karim@student.com', 'karim123', 'student', false),
('Nadia Islam', 'nadia@student.com', 'nadia123', 'student', false),
('Sadia Afrin', 'sadia@student.com', 'sadia123', 'student', false),
('Tamim Iqbal', 'tamim@student.com', 'tamim123', 'student', false),
('Ayesha Rahman', 'ayesha@student.com', 'ayesha123', 'student', false),
('Mehedi Hasan', 'mehedi@student.com', 'mehedi123', 'student', false),
('Rupa Begum', 'rupa@student.com', 'rupa123', 'student', false),
('Sabbir Khan', 'sabbir@student.com', 'sabbir123', 'student', false),
('Mim Akter', 'mim@student.com', 'mim123', 'student', false),
('Rakib Hossain', 'rakib@student.com', 'rakib123', 'student', false),
('Tania Sultana', 'tania@student.com', 'tania123', 'student', false),
('Imran Ahmed', 'imran@student.com', 'imran123', 'student', false),
('Shakib Ali', 'shakib@student.com', 'shakib123', 'student', false),
('Nasrin Akter', 'nasrin@student.com', 'nasrin123', 'student', false),
('Rifat Khan', 'rifat@student.com', 'rifat123', 'student', false),
('Labib Hassan', 'labib@student.com', 'labib123', 'student', false),
('Sumaiya Islam', 'sumaiya@student.com', 'sumaiya123', 'student', false),
('Fahim Ahmed', 'fahim@student.com', 'fahim123', 'student', false);

-- Insert Student Profiles (all pending verification)
INSERT INTO student_profiles (user_id, registration_number, date_of_birth, address, city,
    ssc_gpa, ssc_group, ssc_board, ssc_year, ssc_roll_number,
    hsc_gpa, hsc_group, hsc_board, hsc_year, hsc_roll_number,
    ssc_verification_status, hsc_verification_status, is_profile_complete) VALUES
(12, 'STU2025001', '2005-01-15', 'House 10, Road 5', 'Dhaka', 5.0, 'Science', 'Dhaka', 2021, '100001', 5.0, 'Science', 'Dhaka', 2023, '200001', 'pending', 'pending', 1),
(13, 'STU2025002', '2005-03-20', 'House 20, Road 10', 'Dhaka', 4.95, 'Science', 'Dhaka', 2021, '100002', 4.9, 'Science', 'Dhaka', 2023, '200002', 'pending', 'pending', 1),
(14, 'STU2025003', '2005-05-10', 'House 30, Road 15', 'Chittagong', 4.8, 'Science', 'Chittagong', 2021, '100003', 4.7, 'Science', 'Chittagong', 2023, '200003', 'pending', 'pending', 1),
(15, 'STU2025004', '2005-07-25', 'House 40, Road 20', 'Dhaka', 4.2, 'Commerce', 'Dhaka', 2021, '100004', 4.3, 'Commerce', 'Dhaka', 2023, '200004', 'pending', 'pending', 1),
(16, 'STU2025005', '2005-09-12', 'House 50, Road 25', 'Dhaka', 3.8, 'Arts', 'Dhaka', 2021, '100005', 4.0, 'Arts', 'Dhaka', 2023, '200005', 'pending', 'pending', 1),
(17, 'STU2025006', '2005-02-18', 'House 60, Road 30', 'Sylhet', 4.0, 'Science', 'Sylhet', 2021, '100006', 4.2, 'Science', 'Sylhet', 2023, '200006', 'pending', 'pending', 1),
(18, 'STU2025007', '2005-04-22', 'House 70, Road 35', 'Dhaka', 4.75, 'Science', 'Dhaka', 2021, '100007', 4.8, 'Science', 'Dhaka', 2023, '200007', 'pending', 'pending', 1),
(19, 'STU2025008', '2005-06-14', 'House 80, Road 40', 'Chittagong', 3.6, 'Commerce', 'Chittagong', 2021, '100008', 3.8, 'Commerce', 'Chittagong', 2023, '200008', 'pending', 'pending', 1),
(20, 'STU2025009', '2005-08-30', 'House 90, Road 45', 'Dhaka', 4.5, 'Science', 'Dhaka', 2021, '100009', 4.6, 'Science', 'Dhaka', 2023, '200009', 'pending', 'pending', 1),
(21, 'STU2025010', '2005-10-05', 'House 100, Road 50', 'Rajshahi', 3.2, 'Arts', 'Rajshahi', 2021, '100010', 3.5, 'Arts', 'Rajshahi', 2023, '200010', 'pending', 'pending', 1),
(22, 'STU2025011', '2005-11-20', 'House 110, Road 55', 'Dhaka', 4.9, 'Science', 'Dhaka', 2021, '100011', 4.95, 'Science', 'Dhaka', 2023, '200011', 'pending', 'pending', 1),
(23, 'STU2025012', '2005-01-28', 'House 120, Road 60', 'Dhaka', 3.8, 'Commerce', 'Rajshahi', 2021, '100012', 4.0, 'Commerce', 'Rajshahi', 2023, '200012', 'pending', 'pending', 1),
(24, 'STU2025013', '2005-03-15', 'House 130, Road 65', 'Chittagong', 4.0, 'Science', 'Chittagong', 2021, '100013', 4.2, 'Science', 'Chittagong', 2023, '200013', 'pending', 'pending', 1),
(25, 'STU2025014', '2005-05-22', 'House 140, Road 70', 'Dhaka', 4.2, 'Commerce', 'Dhaka', 2021, '100014', 4.3, 'Commerce', 'Dhaka', 2023, '200014', 'pending', 'pending', 1),
(26, 'STU2025015', '2005-07-08', 'House 150, Road 75', 'Sylhet', 3.5, 'Arts', 'Sylhet', 2021, '100015', 3.7, 'Arts', 'Sylhet', 2023, '200015', 'pending', 'pending', 1),
(27, 'STU2025016', '2005-09-19', 'House 160, Road 80', 'Dhaka', 4.8, 'Science', 'Dhaka', 2021, '100016', 4.75, 'Science', 'Dhaka', 2023, '200016', 'pending', 'pending', 1),
(28, 'STU2025017', '2005-11-11', 'House 170, Road 85', 'Rajshahi', 3.9, 'Commerce', 'Rajshahi', 2021, '100017', 4.1, 'Commerce', 'Rajshahi', 2023, '200017', 'pending', 'pending', 1),
(29, 'STU2025018', '2005-02-25', 'House 180, Road 90', 'Dhaka', 3.7, 'Arts', 'Dhaka', 2021, '100018', 3.9, 'Arts', 'Dhaka', 2023, '200018', 'pending', 'pending', 1),
(30, 'STU2025019', '2005-04-17', 'House 190, Road 95', 'Chittagong', 4.3, 'Science', 'Chittagong', 2021, '100019', 4.4, 'Science', 'Chittagong', 2023, '200019', 'pending', 'pending', 1),
(31, 'STU2025020', '2005-06-29', 'House 200, Road 100', 'Dhaka', 4.1, 'Commerce', 'Dhaka', 2021, '100020', 4.2, 'Commerce', 'Dhaka', 2023, '200020', 'pending', 'pending', 1);

-- Insert Programs (2-4 programs per university, mix of Science, Commerce, Arts, and Any)
INSERT INTO programs (university_id, name, description, duration_years, 
    min_ssc_gpa, min_hsc_gpa, group_required, application_fee, intake_capacity,
    application_start_date, application_deadline, is_active) VALUES
-- University of Dhaka (3 programs)
(1, 'Computer Science and Engineering', 'CSE with AI and ML focus', 4, 3.5, 4.0, 'Science', 500, 120, '2025-01-01', '2026-01-01', true),
(1, 'Business Administration', 'BBA with finance specialization', 4, 3.0, 3.5, 'Any', 600, 100, '2025-01-01', '2026-01-01', true),
(1, 'English Literature', 'English literature and linguistics', 4, 3.0, 3.5, 'Any', 400, 80, '2025-01-01', '2026-01-01', true),
-- BUET (2 programs)
(2, 'Electrical and Electronic Engineering', 'EEE with power systems', 4, 4.5, 5.0, 'Science', 550, 100, '2025-01-01', '2026-01-01', true),
(2, 'Civil Engineering', 'Civil engineering with structural focus', 4, 4.0, 4.5, 'Science', 550, 120, '2025-01-01', '2026-01-01', true),
-- Jahangirnagar University (3 programs)
(3, 'Economics', 'Economics with development studies', 4, 3.0, 3.5, 'Any', 450, 100, '2025-01-01', '2026-01-01', true),
(3, 'Public Administration', 'Public administration and governance', 4, 3.0, 3.5, 'Any', 400, 80, '2025-01-01', '2026-01-01', true),
(3, 'Sociology', 'Sociology and social research', 4, 3.0, 3.5, 'Arts', 400, 60, '2025-01-01', '2026-01-01', true),
-- North South University (4 programs)
(4, 'Computer Science', 'CS with software engineering', 4, 3.5, 4.0, 'Science', 800, 150, '2025-01-01', '2026-01-01', true),
(4, 'Business Administration', 'BBA with marketing focus', 4, 3.0, 3.5, 'Any', 750, 120, '2025-01-01', '2026-01-01', true),
(4, 'Electrical Engineering', 'EEE with telecommunications', 4, 3.5, 4.0, 'Science', 800, 100, '2025-01-01', '2026-01-01', true),
(4, 'Accounting', 'Accounting and finance', 4, 3.0, 3.5, 'Commerce', 700, 80, '2025-01-01', '2026-01-01', true),
-- East West University (3 programs)
(5, 'Computer Science and Engineering', 'CSE with cybersecurity', 4, 3.5, 4.0, 'Science', 850, 100, '2025-01-01', '2026-01-01', true),
(5, 'Business Administration', 'BBA with supply chain management', 4, 2.5, 3.0, 'Any', 700, 100, '2025-01-01', '2026-01-01', true),
(5, 'Media and Communication', 'Media studies and journalism', 4, 3.0, 3.5, 'Any', 650, 80, '2025-01-01', '2026-01-01', true),
-- Rajshahi University (3 programs)
(6, 'Physics', 'Physics with applied research', 4, 3.5, 4.0, 'Science', 400, 80, '2025-01-01', '2026-01-01', true),
(6, 'Economics', 'Economics and planning', 4, 3.0, 3.5, 'Any', 400, 100, '2025-01-01', '2026-01-01', true),
(6, 'History', 'History and archaeology', 4, 3.0, 3.5, 'Arts', 350, 60, '2025-01-01', '2026-01-01', true),
-- Chittagong University (2 programs)
(7, 'Marine Science', 'Marine biology and oceanography', 4, 3.5, 4.0, 'Science', 450, 70, '2025-01-01', '2026-01-01', true),
(7, 'Business Administration', 'BBA with international business', 4, 3.0, 3.5, 'Any', 500, 90, '2025-01-01', '2026-01-01', true),
-- BRAC University (4 programs)
(8, 'Computer Science', 'CS with data science', 4, 3.5, 4.0, 'Science', 900, 120, '2025-01-01', '2026-01-01', true),
(8, 'Business Administration', 'BBA with entrepreneurship', 4, 3.0, 3.5, 'Any', 850, 100, '2025-01-01', '2026-01-01', true),
(8, 'Architecture', 'Architecture and urban planning', 5, 3.5, 4.0, 'Any', 950, 60, '2025-01-01', '2026-01-01', true),
(8, 'Public Health', 'Public health and epidemiology', 4, 3.5, 4.0, 'Science', 800, 80, '2025-01-01', '2026-01-01', true),
-- Independent University (3 programs)
(9, 'Computer Science and Engineering', 'CSE with blockchain technology', 4, 3.5, 4.0, 'Science', 900, 100, '2025-01-01', '2026-01-01', true),
(9, 'Business Administration', 'BBA with digital marketing', 4, 3.0, 3.5, 'Any', 850, 120, '2025-01-01', '2026-01-01', true),
(9, 'Law', 'Law and legal studies', 4, 3.5, 4.0, 'Any', 800, 80, '2025-01-01', '2026-01-01', true),
-- Daffodil International University (3 programs)
(10, 'Software Engineering', 'Software engineering and development', 4, 3.0, 3.5, 'Science', 700, 150, '2025-01-01', '2026-01-01', true),
(10, 'Business Administration', 'BBA with e-commerce', 4, 2.5, 3.0, 'Any', 650, 120, '2025-01-01', '2026-01-01', true),
(10, 'Multimedia and Creative Technology', 'MCT with animation', 4, 3.0, 3.5, 'Any', 700, 80, '2025-01-01', '2026-01-01', true);

-- Login Credentials (simple passwords):
-- Admin: admin@test.com / admin123
-- Universities: 
--   dhaka@university.com / dhaka123
--   buet@university.com / buet123
--   ju@university.com / ju123
--   nsu@university.com / nsu123
--   ewu@university.com / ewu123
--   ru@university.com / ru123
--   cu@university.com / cu123
--   brac@university.com / brac123
--   iub@university.com / iub123
--   diu@university.com / diu123
-- Students: 
--   rahim@student.com / rahim123
--   fatima@student.com / fatima123
--   (and so on... firstname123)

SELECT 'Database reset complete!' as Status;
SELECT COUNT(*) as Total_Users FROM users;
SELECT COUNT(*) as Total_Universities FROM universities;
SELECT COUNT(*) as Total_Students FROM student_profiles;
SELECT COUNT(*) as Total_Programs FROM programs;
