const db = require('../config/database');

exports.getProfile = async (req, res) => {
    try {
        const [profiles] = await db.query(
            'SELECT * FROM student_profiles WHERE user_id = ?',
            [req.user.id]
        );

        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.json({ success: true, data: profiles[0] });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {
            date_of_birth, address, city,
            ssc_gpa, ssc_group, ssc_board, ssc_year, ssc_roll_number,
            hsc_gpa, hsc_group, hsc_board, hsc_year, hsc_roll_number
        } = req.body;

        // Check if profile exists
        const [existingProfiles] = await db.query('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
        
        if (existingProfiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        const existingProfile = existingProfiles[0];

        const isComplete = ssc_gpa && ssc_group && ssc_board && ssc_year && ssc_roll_number &&
                          hsc_gpa && hsc_group && hsc_board && hsc_year && hsc_roll_number;

        // Format date properly for MySQL (YYYY-MM-DD)
        const formattedDate = date_of_birth ? date_of_birth.split('T')[0] : null;

        // Convert boolean to 1/0 for MySQL
        const isCompleteValue = isComplete ? 1 : 0;

        // Check if SSC data changed
        const sscChanged = existingProfile.ssc_gpa != ssc_gpa || 
                          existingProfile.ssc_group !== ssc_group ||
                          existingProfile.ssc_board !== ssc_board ||
                          existingProfile.ssc_year != ssc_year ||
                          existingProfile.ssc_roll_number !== ssc_roll_number;

        // Check if HSC data changed
        const hscChanged = existingProfile.hsc_gpa != hsc_gpa ||
                          existingProfile.hsc_group !== hsc_group ||
                          existingProfile.hsc_board !== hsc_board ||
                          existingProfile.hsc_year != hsc_year ||
                          existingProfile.hsc_roll_number !== hsc_roll_number;

        // Only reset verification if academic data changed
        const newSscStatus = sscChanged ? 'pending' : existingProfile.ssc_verification_status;
        const newHscStatus = hscChanged ? 'pending' : existingProfile.hsc_verification_status;

        await db.query(
            `UPDATE student_profiles SET 
            date_of_birth = ?, address = ?, city = ?,
            ssc_gpa = ?, ssc_group = ?, ssc_board = ?, ssc_year = ?, ssc_roll_number = ?,
            hsc_gpa = ?, hsc_group = ?, hsc_board = ?, hsc_year = ?, hsc_roll_number = ?,
            is_profile_complete = ?,
            ssc_verification_status = ?, hsc_verification_status = ?,
            ssc_rejection_reason = ?, hsc_rejection_reason = ?
            WHERE user_id = ?`,
            [formattedDate, address, city,
             ssc_gpa, ssc_group, ssc_board, ssc_year, ssc_roll_number,
             hsc_gpa, hsc_group, hsc_board, hsc_year, hsc_roll_number,
             isCompleteValue,
             newSscStatus, newHscStatus,
             sscChanged ? null : existingProfile.ssc_rejection_reason,
             hscChanged ? null : existingProfile.hsc_rejection_reason,
             req.user.id]
        );

        const [profiles] = await db.query('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: profiles[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
};

exports.getPrograms = async (req, res) => {
    try {
        const { location, type, group, min_gpa, max_fee } = req.query;
        
        let query = `
            SELECT p.*, u.name as university_name, u.location as university_location, u.type as university_type
            FROM programs p
            JOIN universities u ON p.university_id = u.id
            WHERE p.is_active = true AND u.is_verified = true
        `;
        const params = [];

        if (location) {
            query += ' AND u.location = ?';
            params.push(location);
        }
        if (type) {
            query += ' AND u.type = ?';
            params.push(type);
        }
        if (group) {
            query += ' AND (p.group_required = ? OR p.group_required IS NULL)';
            params.push(group);
        }
        if (min_gpa) {
            query += ' AND p.min_hsc_gpa <= ?';
            params.push(parseFloat(min_gpa));
        }
        if (max_fee) {
            query += ' AND p.application_fee <= ?';
            params.push(parseFloat(max_fee));
        }

        query += ' ORDER BY p.application_deadline ASC';

        const [programs] = await db.query(query, params);

        res.json({ success: true, count: programs.length, data: programs });
    } catch (error) {
        console.error('Get programs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch programs', error: error.message });
    }
};

exports.getProgramDetails = async (req, res) => {
    try {
        const programId = req.params.id;

        const [programs] = await db.query(
            `SELECT p.*, u.name as university_name, u.location as university_location, u.type as university_type
             FROM programs p
             JOIN universities u ON p.university_id = u.id
             WHERE p.id = ? AND p.is_active = true`,
            [programId]
        );

        if (programs.length === 0) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const program = programs[0];

        const [profiles] = await db.query('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
        const profile = profiles[0];

        const eligibility = { can_apply: true, reasons: [] };

        if (!req.user.is_verified) {
            eligibility.can_apply = false;
            eligibility.reasons.push('Your account is pending admin verification');
        }

        if (profile.ssc_verification_status !== 'verified') {
            eligibility.can_apply = false;
            eligibility.reasons.push('Your SSC needs admin verification');
        }

        if (profile.hsc_verification_status !== 'verified') {
            eligibility.can_apply = false;
            eligibility.reasons.push('Your HSC needs admin verification');
        }

        if (profile.ssc_gpa < program.min_ssc_gpa) {
            eligibility.can_apply = false;
            eligibility.reasons.push(`SSC GPA ${profile.ssc_gpa} is below requirement of ${program.min_ssc_gpa}`);
        }

        if (profile.hsc_gpa < program.min_hsc_gpa) {
            eligibility.can_apply = false;
            eligibility.reasons.push(`HSC GPA ${profile.hsc_gpa} is below requirement of ${program.min_hsc_gpa}`);
        }

        // Check group requirement - treat empty string or 'any' as no restriction
        const normalizedGroupRequired = program.group_required ? program.group_required.trim().toLowerCase() : '';
        const normalizedHscGroup = profile.hsc_group ? profile.hsc_group.trim() : null;
        
        console.log('Group Check Debug:');
        console.log('  Raw program.group_required:', JSON.stringify(program.group_required));
        console.log('  Normalized group_required:', JSON.stringify(normalizedGroupRequired));
        console.log('  profile.hsc_group:', JSON.stringify(normalizedHscGroup));
        console.log('  Is Any or Empty:', normalizedGroupRequired === 'any' || normalizedGroupRequired === '');
        
        // Empty string or 'any' means no group restriction
        if (normalizedGroupRequired && 
            normalizedGroupRequired !== 'any' && 
            normalizedGroupRequired !== '' &&
            normalizedHscGroup !== program.group_required) {
            eligibility.can_apply = false;
            eligibility.reasons.push(`Program requires ${program.group_required}, you have ${profile.hsc_group}`);
            console.log('  REJECTED: Group mismatch');
        } else {
            console.log('  ACCEPTED: Group is Any/empty or matches');
        }

        const [existing] = await db.query(
            'SELECT id FROM applications WHERE student_id = ? AND program_id = ?',
            [profile.id, programId]
        );

        if (existing.length > 0) {
            eligibility.can_apply = false;
            eligibility.reasons.push('You have already applied to this program');
        }

        res.json({ success: true, data: program, eligibility });
    } catch (error) {
        console.error('Get program details error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch program details', error: error.message });
    }
};

exports.submitApplication = async (req, res) => {
    try {
        const { program_id } = req.body;

        if (!program_id) {
            return res.status(400).json({ success: false, message: 'Program ID is required' });
        }

        const [profiles] = await db.query('SELECT * FROM student_profiles WHERE user_id = ?', [req.user.id]);
        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }
        const profile = profiles[0];

        const [programs] = await db.query('SELECT * FROM programs WHERE id = ? AND is_active = true', [program_id]);
        if (programs.length === 0) {
            return res.status(404).json({ success: false, message: 'Program not found or inactive' });
        }
        const program = programs[0];

        const reasons = [];
        if (!req.user.is_verified) reasons.push('Account not verified');
        if (profile.ssc_verification_status !== 'verified') reasons.push('SSC not verified');
        if (profile.hsc_verification_status !== 'verified') reasons.push('HSC not verified');
        if (profile.ssc_gpa < program.min_ssc_gpa) reasons.push('SSC GPA below requirement');
        if (profile.hsc_gpa < program.min_hsc_gpa) reasons.push('HSC GPA below requirement');
        
        // Check group requirement - empty string or 'any' means no restriction
        const normalizedGroupRequired = program.group_required ? program.group_required.trim().toLowerCase() : '';
        if (normalizedGroupRequired && 
            normalizedGroupRequired !== 'any' && 
            normalizedGroupRequired !== '' &&
            profile.hsc_group !== program.group_required) {
            reasons.push('Group mismatch');
        }

        if (reasons.length > 0) {
            return res.status(400).json({ success: false, message: 'Not eligible to apply', reasons });
        }

        const [result] = await db.query(
            `INSERT INTO applications (student_id, program_id, university_id, is_eligible, submitted_by_student)
             VALUES (?, ?, ?, true, ?)`,
            [profile.id, program_id, program.university_id, req.user.id]
        );

        const applicationId = result.insertId;

        await db.query(
            'INSERT INTO payments (application_id, amount) VALUES (?, ?)',
            [applicationId, program.application_fee]
        );

        await db.query(
            'INSERT INTO notifications (user_id, title, message, type, related_id, related_type) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, 'Application Created', `Your application to ${program.name} has been created. Please complete payment.`, 'general', applicationId, 'application']
        );

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                id: applicationId,
                program_id,
                university_id: program.university_id,
                student_id: profile.id,
                application_status: 'pending',
                is_eligible: true
            }
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const [applications] = await db.query(
            `SELECT a.*, 
                    p.name as program_name, p.application_fee, p.application_deadline,
                    u.name as university_name,
                    pay.id as payment_id, pay.payment_status
             FROM applications a
             JOIN programs p ON a.program_id = p.id
             JOIN universities u ON a.university_id = u.id
             LEFT JOIN payments pay ON pay.application_id = a.id
             WHERE a.student_id = ?
             ORDER BY a.created_at DESC`,
            [profiles[0].id]
        );

        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
    }
};

exports.getApplicationDetails = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const [profiles] = await db.query('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const [applications] = await db.query(
            `SELECT a.*, 
                    p.name as program_name, p.application_fee, p.application_deadline,
                    u.name as university_name,
                    pay.id as payment_id, pay.payment_status
             FROM applications a
             JOIN programs p ON a.program_id = p.id
             JOIN universities u ON a.university_id = u.id
             LEFT JOIN payments pay ON pay.application_id = a.id
             WHERE a.id = ? AND a.student_id = ?`,
            [applicationId, profiles[0].id]
        );

        if (applications.length === 0) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.json({ success: true, data: applications[0] });
    } catch (error) {
        console.error('Get application details error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch application details', error: error.message });
    }
};

exports.withdrawApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { reason } = req.body;

        const [profiles] = await db.query('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const [applications] = await db.query(
            'SELECT * FROM applications WHERE id = ? AND student_id = ?',
            [applicationId, profiles[0].id]
        );

        if (applications.length === 0) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        const app = applications[0];
        if (['accepted', 'rejected'].includes(app.application_status)) {
            return res.status(400).json({ success: false, message: 'Cannot withdraw accepted or rejected applications' });
        }

        await db.query(
            'UPDATE applications SET application_status = ? WHERE id = ?',
            ['withdrawn', applicationId]
        );

        await db.query(
            'INSERT INTO application_updates (application_id, old_status, new_status, changed_by, change_reason) VALUES (?, ?, ?, ?, ?)',
            [applicationId, app.application_status, 'withdrawn', req.user.id, reason || 'Student withdrew']
        );

        res.json({
            success: true,
            message: 'Application withdrawn successfully',
            data: { id: applicationId, application_status: 'withdrawn' }
        });
    } catch (error) {
        console.error('Withdraw application error:', error);
        res.status(500).json({ success: false, message: 'Failed to withdraw application', error: error.message });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const [payments] = await db.query(
            `SELECT pay.*, 
                    p.name as program_name,
                    u.name as university_name,
                    a.id as application_id
             FROM payments pay
             JOIN applications a ON pay.application_id = a.id
             JOIN programs p ON a.program_id = p.id
             JOIN universities u ON a.university_id = u.id
             WHERE a.student_id = ?
             ORDER BY pay.created_at DESC`,
            [profiles[0].id]
        );

        res.json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const { type, is_read, limit } = req.query;
        
        let query = 'SELECT * FROM notifications WHERE user_id = ?';
        const params = [req.user.id];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        if (is_read !== undefined) {
            query += ' AND is_read = ?';
            params.push(is_read === 'true');
        }

        query += ' ORDER BY created_at DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [notifications] = await db.query(query, params);

        res.json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const notificationId = req.params.id;

        await db.query(
            'UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = ? AND user_id = ?',
            [notificationId, req.user.id]
        );

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark notification as read', error: error.message });
    }
};
