const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No authorization token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await db.query('SELECT * FROM users WHERE id = ? AND is_active = true', [decoded.id]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid token or user not found' });
        }

        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

const roleCheck = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        next();
    };
};

module.exports = { auth, roleCheck };
