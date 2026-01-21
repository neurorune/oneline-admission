const db = require('../config/database');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, location, type, address, website_url, contact_person } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Name, email, password, and role are required' });
        }

        if (!['student', 'university'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Role must be student or university' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, phone, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, role, phone || null, false]
        );

        const userId = result.insertId;

        if (role === 'student') {
            const regNumber = `STU${new Date().getFullYear()}${String(userId).padStart(4, '0')}`;
            await db.query(
                'INSERT INTO student_profiles (user_id, registration_number) VALUES (?, ?)',
                [userId, regNumber]
            );
        } else if (role === 'university') {
            await db.query(
                'INSERT INTO universities (user_id, name, location, type, phone, address, website_url, contact_person, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, name, location || null, type || 'private', phone || null, address || null, website_url || null, contact_person || null, false]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: { id: userId, name, email, role, is_verified: false }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND is_active = true', [email]);

        if (users.length === 0 || users[0].password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = users[0];
        await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

exports.logout = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const [users] = await db.query('SELECT id, name, email FROM users WHERE email = ? AND is_active = true', [email]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No account found with this email' });
        }

        const resetToken = uuidv4();
        const expiresAt = new Date(Date.now() + 3600000);

        await db.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
            [resetToken, expiresAt, users[0].id]
        );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

        res.json({
            success: true,
            message: 'Password reset link generated',
            resetLink,
            token: resetToken
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate reset link', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        const [users] = await db.query(
            'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW() AND is_active = true',
            [token]
        );

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        await db.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [newPassword, users[0].id]
        );

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
    }
};
