# Oneline Admission Platform

A centralized university admission management system built for Bangladesh, simplifying the admission process for students, universities, and administrators.

---

## Quick Links

- **Video Demo:** [YouTube](https://youtu.be/sKk10J_Emh0)

---

## Project Overview

### Problem Statement
Students in Bangladesh face several challenges:
- Must visit 5-10 different university websites
- Re-enter same information repeatedly
- Risk missing application deadlines
- No centralized tracking of applications
- No transparency in admission status

### Our Solution
One-Line Admission provides:
- Single platform for all universities
- Fill once, apply to multiple programs
- Automatic eligibility checking
- Real-time application tracking
- Deadline reminders and notifications
- Secure payment processing
- Admin verification system

---

## Key Features

### For Students
- Register with SSC/HSC academic information
- Browse all university programs in one place
- Automatic eligibility checking (GPA, group requirements)
- Apply to multiple programs at once
- Secure payment processing for application fees
- Real-time application status tracking
- Notification system for updates and deadlines
- Withdraw applications if needed
- View payment history

### For Universities
- Register and manage university profile
- Create and manage academic programs
- Set eligibility criteria (GPA, group requirements)
- View and manage student applications
- Accept/Reject applications with feedback
- Edit program details
- Track application statistics

### For Admin
- Verify student academic credentials (SSC/HSC)
- Verify university registrations
- Manage all users (activate/deactivate accounts)
- View system-wide statistics and analytics
- Monitor all applications across universities
- Track payment information and revenue
- Access audit logs of all admin actions
- Reset user passwords

---

## Technology Stack

### Frontend
- React - UI library
- Axios - HTTP client for API calls
- Bootstrap - CSS styling framework

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MySQL - Relational database

### Database
- MySQL
- 9 tables with proper relationships

---

## Installation & Setup

### Prerequisites
- Node.js 
- MySQL
- Docker

### Step 1: Database Setup



1. Go to the **./database** directory in the terminal and run

   ``````
   docker compose up -d
   ``````

2. **Open phpMyAdmin** or MySQL command line

3. **Create database:**

   ```sql
   CREATE DATABASE onelinee;
   ```

4. **Import schema:**

   - Go to phpMyAdmin → Select onelinee database
   - Click "Import" tab
   - Select database/01_create_schema.sql
   - Click "Go"

5. **Import test data:**
   - Still in phpMyAdmin
   - Click "Import" tab again
   - Select database/02_test_data.sql
   - Click "Go"

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure database (edit .env file)
# Update these values:
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=onelinee
JWT_SECRET=your-secret-key-change-in-production

# Start the server
npm start
# Server runs on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
# Application opens at http://localhost:3000
```

---

## Test Credentials

### Admin Account
```
Email: admin@test.com
Password: admin123
```

### University Accounts (All verified)
```
Dhaka University:
  Email: dhaka@university.com
  Password: dhaka123

BUET:
  Email: buet@university.com
  Password: buet123

BRAC University:
  Email: brac@university.com
  Password: brac123

(10 total universities with pattern: name@university.com / name123)
```

### Student Accounts (All pending verification by admin)
```
Rahim Ahmed:
  Email: rahim@student.com
  Password: rahim123
  Group: Science, GPA: 5.0

Fatima Khan:
  Email: fatima@student.com
  Password: fatima123
  Group: Science, GPA: 4.9

Karim Hassan:
  Email: karim@student.com
  Password: karim123
  Group: Science, GPA: 4.7

(20+ total students with pattern: firstname@student.com / firstname123)
```

---

## Usage Workflow

### Step 1: Admin Verification (Required)
1. Login as admin (admin@test.com / admin123)
2. Go to Student Verification section
3. Review pending students' SSC/HSC details
4. Click "Verify" to approve students
5. Verified students can now apply to programs

### Step 2: University Management
1. Login as university (after admin verification)
2. Navigate to My Programs
3. Click Create Program and fill:
   - Program name and description
   - Minimum SSC/HSC GPA requirements
   - Group requirement (Science/Commerce/Arts/Any)
   - Application fee and intake capacity
   - Application deadline
4. View incoming applications in Applications section
5. Review student qualifications and Accept/Reject

### Step 3: Student Application
1. Login as student (after admin verification)
2. Go to My Profile and complete SSC/HSC details
3. Navigate to Browse Programs to see all available programs
4. Filter by location, university, group, or GPA
5. Click program to see details and eligibility status
6. If eligible: Click Apply Now
7. Complete payment for application fee
8. Application automatically submitted to university
9. Go to My Applications to track status
10. Receive notifications when university reviews application

---

## System Architecture

### Database Schema (9 Tables)

```
users (Authentication)
├── id, name, email, password, role
├── is_verified, verified_at, is_active
└── Stores: admin, student, university accounts

student_profiles (Student Records)
├── id, user_id, registration_number
├── SSC details (gpa, group, board, year, roll)
├── HSC details (gpa, group, board, year, roll)
├── ssc_verification_status, hsc_verification_status
└── Linked to: users, admin_logs

universities (University Profiles)
├── id, user_id, name, location, type (public/private)
├── phone, address, website_url, contact_person
├── is_verified, is_active
└── Linked to: users, programs

programs (University Programs)
├── id, university_id, name, description, duration_years
├── min_ssc_gpa, min_hsc_gpa, group_required
├── application_fee, intake_capacity, current_applications
├── application_start_date, application_deadline
└── Linked to: universities, applications

applications (Student Applications)
├── id, student_id, program_id, university_id
├── application_status (pending/submitted/shortlisted/accepted/rejected/withdrawn)
├── is_eligible, eligibility_reason
├── submitted_at, submitted_by_student
└── Linked to: student_profiles, programs, payments

payments (Payment Records)
├── id, application_id, amount, payment_status
├── payment_method, transaction_id, paid_at
└── Linked to: applications

notifications (System Notifications)
├── id, user_id, title, message, type
├── is_read, is_sent, related_id, related_type
└── Linked to: users, applications

application_updates (Audit Trail)
├── id, application_id, old_status, new_status
├── changed_by, change_reason, created_at
└── Linked to: applications, users

admin_logs (Admin Actions)
├── id, admin_id, action_type, description
├── table_name, record_id, ip_address
└── Linked to: users
```

---

## API Endpoints (32 Total)

### Authentication (3)
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout

### Student APIs (11)
- GET /api/student/profile - Get profile
- PUT /api/student/profile - Update profile
- GET /api/student/programs - Browse programs
- GET /api/student/programs/:id - Program details + eligibility
- POST /api/student/applications - Submit application
- GET /api/student/applications - Get my applications
- GET /api/student/applications/:id - Get single application
- POST /api/student/applications/:id/withdraw - Withdraw application
- GET /api/student/payments - Payment history
- GET /api/student/notifications - Get notifications
- PUT /api/student/notifications/:id/read - Mark as read

### Payment APIs (3)
- POST /api/payments/initiate - Initiate payment
- POST /api/payments/verify - Verify payment
- GET /api/payments/:id - Get payment details

### University APIs (10)
- GET /api/university/profile - Get profile
- PUT /api/university/profile - Update profile
- POST /api/university/programs - Create program
- GET /api/university/programs - Get my programs
- PUT /api/university/programs/:id - Update program
- POST /api/university/programs/:id/deactivate - Deactivate program
- GET /api/university/applications - Get applications
- GET /api/university/applications/:id - Get single application
- POST /api/university/applications/:id/status - Change status
- GET /api/university/notifications - Get notifications

### Admin APIs (5)
- GET /api/admin/students/pending - Pending students
- POST /api/admin/students/:id/verify - Verify student
- GET /api/admin/users - Get all users
- GET /api/admin/applications - Get all applications
- GET /api/admin/analytics - Get system analytics

---

## Frontend Pages

### Student Dashboard (7 Pages)
1. Dashboard Home - Welcome, stats, quick links
2. My Profile - View/edit SSC/HSC details, verification status
3. Browse Programs - Search, filter, view all programs
4. Program Details - Full info, eligibility check, apply button
5. My Applications - Table of all applications, status, actions
6. Payment History - All payments, amounts, dates, statuses
7. Notifications - Inbox-style notifications, read/unread, delete

### University Dashboard (4 Pages)
1. Dashboard Home - Stats, recent applications
2. University Profile - Edit details, verification status
3. My Programs - Create, edit, deactivate programs
4. Applications Received - Review, filter, change status

### Admin Dashboard (3 Pages)
1. Dashboard Home - System stats, recent activities
2. Student Verification - Verify/reject pending students
3. All Applications - View all applications, filter, search

### Public Pages (3 Pages)
1. Landing Page - Intro, features, benefits
2. About Page - Platform story, mission, vision
3. Features Page - Detailed feature descriptions

---

## Security Features

- JWT Authentication - Secure token-based auth
- Role-Based Access - Different permissions per role
- Verification System - Prevents fraudulent accounts
- Unique Constraints - Prevents duplicate applications
- Audit Logs - Tracks all admin actions

---

## Testing

### Test Scenarios
1. Student Registration & Verification
   - Register as student
   - Admin verifies credentials
   - Student can now apply

2. Program Browsing & Eligibility
   - Browse programs (gray buttons for ineligible)
   - Check eligibility criteria
   - Apply to eligible programs

3. Application Workflow
   - Submit application
   - Make payment
   - University reviews and accepts/rejects
   - Student receives notification

4. Admin Dashboard
   - Verify students
   - View analytics
   - Monitor payments
   - Check admin logs

---

## Project Statistics

| Metric | Count |
|--------|-------|
| Database Tables | 9 |
| Database Indexes | 24 |
| API Endpoints | 32 |
| Frontend Pages | 17 |
| Backend Controllers | 4 |
| Test Users | 30+ |
| Test Universities | 10 |

---

## Video Demo

Full Project Walkthrough: [Watch on YouTube](https://youtu.be/sKk10J_Emh0)

The video demonstrates:
- Landing page and features
- Student registration and verification
- Browsing programs and eligibility checking
- Submitting applications and payments
- University application review
- Admin verification panel
- System analytics and reports

---

## Project Structure

```
oneline-admission/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── universityController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── universityRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── student/
│   │   │   ├── university/
│   │   │   ├── admin/
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── database/
│   ├── 01_create_schema.sql
│   └── 02_test_data.sql
│
├── .gitignore
└── README.md
```



