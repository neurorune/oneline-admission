const db = require('../config/database');

exports.getAllUsers = async (req, res) => {
    try {
        const { role, is_verified, sort, limit } = req.query;
        
        let query = 'SELECT id, name, email, role, is_verified, is_active, last_login, created_at FROM users WHERE 1=1';
        const params = [];

        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }
        if (is_verified !== undefined) {
            query += ' AND is_verified = ?';
            params.push(is_verified === 'true');
        }

        query += ' ORDER BY created_at DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [users] = await db.query(query, params);

        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const [students] = await db.query(
            `SELECT sp.*, u.name, u.email 
             FROM student_profiles sp
             JOIN users u ON sp.user_id = u.id
             WHERE sp.is_profile_complete = true
             ORDER BY sp.created_at DESC`,
            []
        );

        res.json({ success: true, count: students.length, data: students });
    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch students', error: error.message });
    }
};

exports.getPendingStudents = async (req, res) => {
    try {
        const [students] = await db.query(
            `SELECT sp.*, u.name, u.email 
             FROM student_profiles sp
             JOIN users u ON sp.user_id = u.id
             WHERE (sp.ssc_verification_status = 'pending' OR sp.hsc_verification_status = 'pending')
             AND sp.is_profile_complete = true
             ORDER BY sp.created_at DESC`,
            []
        );

        res.json({ success: true, count: students.length, data: students });
    } catch (error) {
        console.error('Get pending students error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending students', error: error.message });
    }
};

exports.verifyStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { verify_ssc, verify_hsc, reset_to_pending } = req.body;

        const [students] = await db.query('SELECT * FROM student_profiles WHERE id = ?', [studentId]);
        if (students.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const student = students[0];
        let sscStatus = student.ssc_verification_status;
        let hscStatus = student.hsc_verification_status;

        // Handle reset to pending (for reapply)
        if (reset_to_pending) {
            await db.query(
                'UPDATE student_profiles SET ssc_verification_status = ?, hsc_verification_status = ?, ssc_rejection_reason = NULL, hsc_rejection_reason = NULL WHERE id = ?',
                ['pending', 'pending', studentId]
            );
            
            await db.query(
                'UPDATE users SET is_verified = false WHERE id = ?',
                [student.user_id]
            );

            await db.query(
                'INSERT INTO admin_logs (admin_id, action_type, description, table_name, record_id) VALUES (?, ?, ?, ?, ?)',
                [req.user.id, 'allowed_reapply', `Allowed student ID ${studentId} to reapply`, 'student_profiles', studentId]
            );

            await db.query(
                'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
                [student.user_id, 'Reapply Allowed', 'You can now update your profile and reapply for verification.', 'verification']
            );

            return res.json({
                success: true,
                message: 'Student can now reapply',
                data: {
                    student_id: studentId,
                    ssc_verification_status: 'pending',
                    hsc_verification_status: 'pending'
                }
            });
        }

        if (verify_ssc) {
            sscStatus = 'verified';
            await db.query(
                'UPDATE student_profiles SET ssc_verification_status = ?, ssc_verified_by_admin = ?, ssc_verified_at = NOW(), ssc_rejection_reason = NULL WHERE id = ?',
                ['verified', req.user.id, studentId]
            );
        }

        if (verify_hsc) {
            hscStatus = 'verified';
            await db.query(
                'UPDATE student_profiles SET hsc_verification_status = ?, hsc_verified_by_admin = ?, hsc_verified_at = NOW(), hsc_rejection_reason = NULL WHERE id = ?',
                ['verified', req.user.id, studentId]
            );
        }

        if (sscStatus === 'verified' && hscStatus === 'verified') {
            await db.query(
                'UPDATE users SET is_verified = true WHERE id = ?',
                [student.user_id]
            );
        }

        await db.query(
            'INSERT INTO admin_logs (admin_id, action_type, description, table_name, record_id) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'verified_student', `Verified student ID ${studentId}`, 'student_profiles', studentId]
        );

        await db.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [student.user_id, 'Account Verified', 'Your account has been verified by admin. You can now apply to programs.', 'verification']
        );

        res.json({
            success: true,
            message: 'Student verified successfully',
            data: {
                student_id: studentId,
                ssc_verification_status: sscStatus,
                hsc_verification_status: hscStatus,
                user_is_verified: sscStatus === 'verified' && hscStatus === 'verified',
                notification_sent: true
            }
        });
    } catch (error) {
        console.error('Verify student error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify student', error: error.message });
    }
};

exports.rejectStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { reject_ssc, reject_hsc, ssc_rejection_reason, hsc_rejection_reason } = req.body;

        const [students] = await db.query('SELECT * FROM student_profiles WHERE id = ?', [studentId]);
        if (students.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const student = students[0];

        if (reject_ssc) {
            await db.query(
                'UPDATE student_profiles SET ssc_verification_status = ?, ssc_rejection_reason = ? WHERE id = ?',
                ['rejected', ssc_rejection_reason, studentId]
            );
        }

        if (reject_hsc) {
            await db.query(
                'UPDATE student_profiles SET hsc_verification_status = ?, hsc_rejection_reason = ? WHERE id = ?',
                ['rejected', hsc_rejection_reason, studentId]
            );
        }

        await db.query(
            'INSERT INTO admin_logs (admin_id, action_type, description, table_name, record_id) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'rejected_student', `Rejected student ID ${studentId}`, 'student_profiles', studentId]
        );

        const reasons = [];
        if (reject_ssc && ssc_rejection_reason) reasons.push(`SSC: ${ssc_rejection_reason}`);
        if (reject_hsc && hsc_rejection_reason) reasons.push(`HSC: ${hsc_rejection_reason}`);

        await db.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [student.user_id, 'Verification Rejected', `Your verification was rejected. Reasons: ${reasons.join(', ')}`, 'verification']
        );

        res.json({
            success: true,
            message: 'Student verification rejected',
            data: {
                student_id: studentId,
                ssc_verification_status: reject_ssc ? 'rejected' : student.ssc_verification_status,
                hsc_verification_status: reject_hsc ? 'rejected' : student.hsc_verification_status,
                notification_sent: true
            }
        });
    } catch (error) {
        console.error('Reject student error:', error);
        res.status(500).json({ success: false, message: 'Failed to reject student', error: error.message });
    }
};

exports.getPendingUniversities = async (req, res) => {
    try {
        const [universities] = await db.query(
            `SELECT u.*, us.name as user_name, us.email 
             FROM universities u
             JOIN users us ON u.user_id = us.id
             WHERE u.is_verified = false
             ORDER BY u.created_at DESC`,
            []
        );

        res.json({ success: true, count: universities.length, data: universities });
    } catch (error) {
        console.error('Get pending universities error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending universities', error: error.message });
    }
};

exports.verifyUniversity = async (req, res) => {
    try {
        const universityId = req.params.id;

        const [universities] = await db.query('SELECT * FROM universities WHERE id = ?', [universityId]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        const university = universities[0];

        await db.query(
            'UPDATE universities SET is_verified = true WHERE id = ?',
            [universityId]
        );

        await db.query(
            'UPDATE users SET is_verified = true WHERE id = ?',
            [university.user_id]
        );

        await db.query(
            'INSERT INTO admin_logs (admin_id, action_type, description, table_name, record_id) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'verified_university', `Verified university ID ${universityId}`, 'universities', universityId]
        );

        await db.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [university.user_id, 'University Verified', 'Your university has been verified. You can now create programs.', 'verification']
        );

        res.json({
            success: true,
            message: 'University verified successfully',
            data: { university_id: universityId, is_verified: true, notification_sent: true }
        });
    } catch (error) {
        console.error('Verify university error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify university', error: error.message });
    }
};

exports.rejectUniversity = async (req, res) => {
    try {
        const universityId = req.params.id;
        const { reason } = req.body;

        const [universities] = await db.query('SELECT * FROM universities WHERE id = ?', [universityId]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        const university = universities[0];

        await db.query('UPDATE universities SET is_verified = false WHERE id = ?', [universityId]);

        await db.query(
            'INSERT INTO admin_logs (admin_id, action_type, description, table_name, record_id) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'rejected_university', `Rejected university ID ${universityId}: ${reason}`, 'universities', universityId]
        );

        await db.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [university.user_id, 'Verification Rejected', `Your university verification was rejected. Reason: ${reason}`, 'verification']
        );

        res.json({
            success: true,
            message: 'University verification rejected',
            data: { university_id: universityId, is_verified: false, notification_sent: true }
        });
    } catch (error) {
        console.error('Reject university error:', error);
        res.status(500).json({ success: false, message: 'Failed to reject university', error: error.message });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const { status, university_id, payment_status, sort } = req.query;

        let query = `
            SELECT a.*, 
                   u.name as student_name,
                   uni.name as university_name,
                   p.name as program_name,
                   pay.payment_status
            FROM applications a
            JOIN student_profiles sp ON a.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            JOIN universities uni ON a.university_id = uni.id
            JOIN programs p ON a.program_id = p.id
            LEFT JOIN payments pay ON pay.application_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND a.application_status = ?';
            params.push(status);
        }
        if (university_id) {
            query += ' AND a.university_id = ?';
            params.push(university_id);
        }
        if (payment_status) {
            query += ' AND pay.payment_status = ?';
            params.push(payment_status);
        }

        query += ' ORDER BY a.created_at DESC';

        const [applications] = await db.query(query, params);

        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        console.error('Get all applications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const { status, date_from, date_to } = req.query;

        let query = `
            SELECT pay.*, 
                   u.name as student_name,
                   uni.name as university_name
            FROM payments pay
            JOIN applications a ON pay.application_id = a.id
            JOIN student_profiles sp ON a.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            JOIN universities uni ON a.university_id = uni.id
            WHERE 1=1
        `;
        const params = [];

        if (status) {
            query += ' AND pay.payment_status = ?';
            params.push(status);
        }
        if (date_from) {
            query += ' AND pay.created_at >= ?';
            params.push(date_from);
        }
        if (date_to) {
            query += ' AND pay.created_at <= ?';
            params.push(date_to);
        }

        query += ' ORDER BY pay.created_at DESC';

        const [payments] = await db.query(query, params);

        const [revenue] = await db.query(
            "SELECT SUM(amount) as total FROM payments WHERE payment_status = 'completed'"
        );

        res.json({
            success: true,
            total_revenue: revenue[0].total || 0,
            total_payments: payments.length,
            data: payments
        });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const [totalStudents] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
        const [verifiedStudents] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND is_verified = true");
        const [pendingStudents] = await db.query("SELECT COUNT(*) as count FROM student_profiles WHERE ssc_verification_status = 'pending' OR hsc_verification_status = 'pending'");
        const [rejectedStudents] = await db.query("SELECT COUNT(*) as count FROM student_profiles WHERE ssc_verification_status = 'rejected' OR hsc_verification_status = 'rejected'");
        
        const [totalUniversities] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'university'");
        const [verifiedUniversities] = await db.query("SELECT COUNT(*) as count FROM universities WHERE is_verified = true");
        const [pendingUniversities] = await db.query("SELECT COUNT(*) as count FROM universities WHERE is_verified = false");
        
        const [totalApplications] = await db.query("SELECT COUNT(*) as count FROM applications");
        const [pendingApps] = await db.query("SELECT COUNT(*) as count FROM applications WHERE application_status = 'pending'");
        const [submittedApps] = await db.query("SELECT COUNT(*) as count FROM applications WHERE application_status = 'submitted'");
        const [shortlistedApps] = await db.query("SELECT COUNT(*) as count FROM applications WHERE application_status = 'shortlisted'");
        const [acceptedApps] = await db.query("SELECT COUNT(*) as count FROM applications WHERE application_status = 'accepted'");
        const [rejectedApps] = await db.query("SELECT COUNT(*) as count FROM applications WHERE application_status = 'rejected'");
        
        const [revenue] = await db.query("SELECT SUM(amount) as total FROM payments WHERE payment_status = 'completed'");
        const [totalPayments] = await db.query("SELECT COUNT(*) as total, COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed FROM payments");

        const successRate = totalPayments[0].total > 0 
            ? Math.round((totalPayments[0].completed / totalPayments[0].total) * 100) 
            : 0;

        res.json({
            success: true,
            data: {
                total_students: totalStudents[0].count,
                verified_students: verifiedStudents[0].count,
                pending_students: pendingStudents[0].count,
                rejected_students: rejectedStudents[0].count,
                total_universities: totalUniversities[0].count,
                verified_universities: verifiedUniversities[0].count,
                pending_universities: pendingUniversities[0].count,
                total_applications: totalApplications[0].count,
                applications_by_status: {
                    pending: pendingApps[0].count,
                    submitted: submittedApps[0].count,
                    shortlisted: shortlistedApps[0].count,
                    accepted: acceptedApps[0].count,
                    rejected: rejectedApps[0].count
                },
                total_revenue: revenue[0].total || 0,
                payment_success_rate: `${successRate}%`
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const { action_type, date_from, limit } = req.query;

        let query = `
            SELECT al.*, u.name as admin_name
            FROM admin_logs al
            JOIN users u ON al.admin_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (action_type) {
            query += ' AND al.action_type = ?';
            params.push(action_type);
        }
        if (date_from) {
            query += ' AND al.created_at >= ?';
            params.push(date_from);
        }

        query += ' ORDER BY al.created_at DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [logs] = await db.query(query, params);

        res.json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        console.error('Get logs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch logs', error: error.message });
    }
};

exports.deactivateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { reason } = req.body;

        await db.query('UPDATE users SET is_active = false WHERE id = ?', [userId]);

        await db.query(
            'INSERT INTO admin_logs (admin_id, action_type, description, table_name, record_id) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'deactivated_user', `Deactivated user ID ${userId}: ${reason}`, 'users', userId]
        );

        res.json({ success: true, message: 'User account deactivated' });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({ success: false, message: 'Failed to deactivate user', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { new_password } = req.body;

        if (!new_password) {
            return res.status(400).json({ success: false, message: 'New password is required' });
        }

        await db.query('UPDATE users SET password = ? WHERE id = ?', [new_password, userId]);

        await db.query(
            'INSERT INTO admin_logs (admin_id, action_type, description, table_name, record_id) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, 'reset_password', `Reset password for user ID ${userId}`, 'users', userId]
        );

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
    }
};
