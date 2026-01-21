# Database Setup Guide

table name: onelinee
to start phpmyadmin & mysql run in terminal
 `docker compose up -d`
to stop and remove them all permanently
`docker compose down -v`

This folder contains SQL files to set up the complete database for the Online University Admission Platform.

## Files

1. **01_create_schema.sql** - Creates all database tables and structure
2. **02_test_data.sql** - Populates database with test data (10 universities, 20 students, 30 programs)


## Database Tables Overview

### users
Main user table for all system users (admin, universities, students)
- Columns: id, name, email, password, role, is_verified, created_at

### universities
University profile information
- Columns: id, user_id, name, location, type, phone, address, website_url, contact_person, is_verified, created_at

### student_profiles
Student academic information and credentials
- Columns: id, user_id, registration_number, date_of_birth, address, city, ssc_gpa, ssc_group, ssc_board, ssc_year, ssc_roll_number, hsc_gpa, hsc_group, hsc_board, hsc_year, hsc_roll_number, ssc_verification_status, hsc_verification_status, is_profile_complete

### programs
University programs/courses
- Columns: id, university_id, name, description, duration_years, min_ssc_gpa, min_hsc_gpa, group_required, application_fee, intake_capacity, current_applications, application_start_date, application_deadline, is_active

### applications
Student applications to programs
- Columns: id, student_id, program_id, university_id, application_status, is_eligible, submitted_by_student, created_at, updated_at

### payments
Application payment records
- Columns: id, application_id, amount, payment_status, payment_method, transaction_id, paid_at

### notifications
System notifications for users
- Columns: id, user_id, title, message, type, is_read, created_at





