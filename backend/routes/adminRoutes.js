const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, roleCheck } = require('../middleware/auth');

router.get('/users', auth, roleCheck('admin'), adminController.getAllUsers);
router.get('/students', auth, roleCheck('admin'), adminController.getAllStudents);
router.get('/students/pending', auth, roleCheck('admin'), adminController.getPendingStudents);
router.post('/students/:id/verify', auth, roleCheck('admin'), adminController.verifyStudent);
router.post('/students/:id/reject', auth, roleCheck('admin'), adminController.rejectStudent);
router.get('/universities/pending', auth, roleCheck('admin'), adminController.getPendingUniversities);
router.post('/universities/:id/verify', auth, roleCheck('admin'), adminController.verifyUniversity);
router.post('/universities/:id/reject', auth, roleCheck('admin'), adminController.rejectUniversity);
router.get('/applications', auth, roleCheck('admin'), adminController.getAllApplications);
router.get('/payments', auth, roleCheck('admin'), adminController.getPayments);
router.get('/analytics', auth, roleCheck('admin'), adminController.getAnalytics);
router.get('/logs', auth, roleCheck('admin'), adminController.getLogs);
router.post('/users/:id/deactivate', auth, roleCheck('admin'), adminController.deactivateUser);
router.post('/users/:id/reset-password', auth, roleCheck('admin'), adminController.resetPassword);

module.exports = router;
