-- Simple Database Schema for Online University Admission Platform
-- Compatible with phpMyAdmin and MySQL 8.0+

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'student', 'university') NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  reset_token VARCHAR(100) UNIQUE,
  reset_token_expires TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create universities table
CREATE TABLE IF NOT EXISTS universities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(100),
  type ENUM('public', 'private') NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  website_url VARCHAR(255),
  contact_person VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  registration_number VARCHAR(50) UNIQUE,
  date_of_birth DATE,
  address TEXT,
  city VARCHAR(100),
  ssc_gpa DECIMAL(3,2),
  ssc_group VARCHAR(50),
  ssc_board VARCHAR(100),
  ssc_year INT,
  ssc_roll_number VARCHAR(50),
  hsc_gpa DECIMAL(3,2),
  hsc_group VARCHAR(50),
  hsc_board VARCHAR(100),
  hsc_year INT,
  hsc_roll_number VARCHAR(50),
  ssc_verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  hsc_verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  ssc_verified_by_admin INT,
  ssc_verified_at TIMESTAMP NULL,
  hsc_verified_by_admin INT,
  hsc_verified_at TIMESTAMP NULL,
  ssc_rejection_reason TEXT,
  hsc_rejection_reason TEXT,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ssc_verified_by_admin) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (hsc_verified_by_admin) REFERENCES users(id) ON DELETE SET NULL
);

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  university_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  duration_years INT NOT NULL,
  min_ssc_gpa DECIMAL(3,2) NOT NULL,
  min_hsc_gpa DECIMAL(3,2) NOT NULL,
  group_required VARCHAR(50),
  application_fee DECIMAL(10,2) NOT NULL,
  intake_capacity INT NOT NULL,
  current_applications INT DEFAULT 0,
  application_start_date DATE NOT NULL,
  application_deadline DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  program_id INT NOT NULL,
  university_id INT NOT NULL,
  application_status ENUM('pending', 'submitted', 'shortlisted', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
  is_eligible BOOLEAN DEFAULT NULL,
  eligibility_reason VARCHAR(255),
  submitted_at TIMESTAMP NULL,
  submitted_by_student INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
  FOREIGN KEY (submitted_by_student) REFERENCES users(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_application (student_id, program_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_id VARCHAR(100) UNIQUE,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('deadline', 'status_update', 'payment', 'eligibility', 'verification', 'general') DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  related_id INT,
  related_type ENUM('application', 'program', 'payment', 'user') DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  sent_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create application_updates table
CREATE TABLE IF NOT EXISTS application_updates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by INT NOT NULL,
  change_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Create admin_logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  description TEXT,
  table_name VARCHAR(50),
  record_id INT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Indexes are automatically created for PRIMARY KEY and FOREIGN KEY columns
-- No additional indexes needed for basic functionality
