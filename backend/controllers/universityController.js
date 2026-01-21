const db = require('../config/database');

exports.getProfile = async (req, res) => {
    try {
        const [universities] = await db.query(
            'SELECT * FROM universities WHERE user_id = ?',
            [req.user.id]
        );

        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University profile not found' });
        }

        res.json({ success: true, data: universities[0] });
    } catch (error) {
        console.error('Get university profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { phone, address, website_url, contact_person } = req.body;

        await db.query(
            'UPDATE universities SET phone = ?, address = ?, website_url = ?, contact_person = ? WHERE user_id = ?',
            [phone, address, website_url, contact_person, req.user.id]
        );

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update university profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
    }
};

exports.createProgram = async (req, res) => {
    try {
        const {
            name, description, duration_years,
            min_ssc_gpa, min_hsc_gpa, group_required,
            application_fee, intake_capacity,
            application_start_date, application_deadline
        } = req.body;

        if (!name || !application_fee || !application_start_date || !application_deadline) {
            return res.status(400).json({ success: false, message: 'Name, fee, start date, and deadline are required' });
        }

        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        const [result] = await db.query(
            `INSERT INTO programs (university_id, name, description, duration_years, min_ssc_gpa, min_hsc_gpa, 
             group_required, application_fee, intake_capacity, application_start_date, application_deadline)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [universities[0].id, name, description, duration_years, min_ssc_gpa, min_hsc_gpa,
             group_required, application_fee, intake_capacity, application_start_date, application_deadline]
        );

        res.status(201).json({
            success: true,
            message: 'Program created successfully',
            data: {
                id: result.insertId,
                university_id: universities[0].id,
                name,
                is_active: true
            }
        });
    } catch (error) {
        console.error('Create program error:', error);
        res.status(500).json({ success: false, message: 'Failed to create program', error: error.message });
    }
};

exports.getPrograms = async (req, res) => {
    try {
        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        const [programs] = await db.query(
            'SELECT * FROM programs WHERE university_id = ? ORDER BY created_at DESC',
            [universities[0].id]
        );

        res.json({ success: true, count: programs.length, data: programs });
    } catch (error) {
        console.error('Get programs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch programs', error: error.message });
    }
};

exports.updateProgram = async (req, res) => {
    try {
        const programId = req.params.id;
        const updateFields = req.body;

        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        const [programs] = await db.query(
            'SELECT id FROM programs WHERE id = ? AND university_id = ?',
            [programId, universities[0].id]
        );

        if (programs.length === 0) {
            return res.status(404).json({ success: false, message: 'Program not found' });
        }

        const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateFields), programId, universities[0].id];

        await db.query(
            `UPDATE programs SET ${fields} WHERE id = ? AND university_id = ?`,
            values
        );

        res.json({ success: true, message: 'Program updated successfully' });
    } catch (error) {
        console.error('Update program error:', error);
        res.status(500).json({ success: false, message: 'Failed to update program', error: error.message });
    }
};

exports.deleteProgram = async (req, res) => {
    try {
        const programId = req.params.id;

        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        // Check if program has applications
        const [applications] = await db.query(
            'SELECT COUNT(*) as count FROM applications WHERE program_id = ?',
            [programId]
        );

        if (applications[0].count > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete program with existing applications. Please deactivate instead.' 
            });
        }

        await db.query(
            'DELETE FROM programs WHERE id = ? AND university_id = ?',
            [programId, universities[0].id]
        );

        res.json({ success: true, message: 'Program deleted successfully' });
    } catch (error) {
        console.error('Delete program error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete program', error: error.message });
    }
};

exports.deactivateProgram = async (req, res) => {
    try {
        const programId = req.params.id;

        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        await db.query(
            'UPDATE programs SET is_active = false WHERE id = ? AND university_id = ?',
            [programId, universities[0].id]
        );

        res.json({ success: true, message: 'Program deactivated successfully' });
    } catch (error) {
        console.error('Deactivate program error:', error);
        res.status(500).json({ success: false, message: 'Failed to deactivate program', error: error.message });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const { status, program_id, sort, limit } = req.query;

        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        let query = `
            SELECT a.*, 
                   u.name as student_name,
                   p.name as program_name,
                   sp.ssc_gpa as student_ssc_gpa,
                   sp.hsc_gpa as student_hsc_gpa,
                   sp.hsc_group as student_group,
                   pay.payment_status
            FROM applications a
            JOIN student_profiles sp ON a.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            JOIN programs p ON a.program_id = p.id
            LEFT JOIN payments pay ON pay.application_id = a.id
            WHERE a.university_id = ?
        `;
        const params = [universities[0].id];

        if (status) {
            query += ' AND a.application_status = ?';
            params.push(status);
        }
        if (program_id) {
            query += ' AND a.program_id = ?';
            params.push(program_id);
        }

        query += ' ORDER BY a.created_at DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [applications] = await db.query(query, params);

        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
    }
};

exports.getApplicationDetails = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        const [applications] = await db.query(
            `SELECT a.*, 
                   u.name as student_name,
                   p.name as program_name,
                   sp.ssc_gpa as student_ssc_gpa,
                   sp.hsc_gpa as student_hsc_gpa,
                   sp.hsc_group as student_group,
                   pay.payment_status
            FROM applications a
            JOIN student_profiles sp ON a.student_id = sp.id
            JOIN users u ON sp.user_id = u.id
            JOIN programs p ON a.program_id = p.id
            LEFT JOIN payments pay ON pay.application_id = a.id
            WHERE a.id = ? AND a.university_id = ?`,
            [applicationId, universities[0].id]
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

exports.changeApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { new_status, reason } = req.body;

        if (!new_status) {
            return res.status(400).json({ success: false, message: 'New status is required' });
        }

        if (!['shortlisted', 'rejected', 'accepted'].includes(new_status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const [universities] = await db.query('SELECT id FROM universities WHERE user_id = ?', [req.user.id]);
        if (universities.length === 0) {
            return res.status(404).json({ success: false, message: 'University not found' });
        }

        const [applications] = await db.query(
            'SELECT a.*, sp.user_id as student_user_id FROM applications a JOIN student_profiles sp ON a.student_id = sp.id WHERE a.id = ? AND a.university_id = ?',
            [applicationId, universities[0].id]
        );

        if (applications.length === 0) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        const app = applications[0];

        await db.query(
            'UPDATE applications SET application_status = ? WHERE id = ?',
            [new_status, applicationId]
        );

        await db.query(
            'INSERT INTO application_updates (application_id, old_status, new_status, changed_by, change_reason) VALUES (?, ?, ?, ?, ?)',
            [applicationId, app.application_status, new_status, req.user.id, reason || null]
        );

        const statusMessages = {
            shortlisted: 'Your application has been shortlisted',
            rejected: 'Your application has been rejected',
            accepted: 'Congratulations! Your application has been accepted'
        };

        await db.query(
            'INSERT INTO notifications (user_id, title, message, type, related_id, related_type) VALUES (?, ?, ?, ?, ?, ?)',
            [app.student_user_id, 'Application Status Update', statusMessages[new_status], 'status_update', applicationId, 'application']
        );

        res.json({
            success: true,
            message: `Application status updated to ${new_status}`,
            data: {
                id: applicationId,
                application_status: new_status,
                notification_sent: true
            }
        });
    } catch (error) {
        console.error('Change application status error:', error);
        res.status(500).json({ success: false, message: 'Failed to change application status', error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [req.user.id]
        );

        res.json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
    }
};
