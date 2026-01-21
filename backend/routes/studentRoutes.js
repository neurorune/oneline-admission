const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth, roleCheck } = require('../middleware/auth');

router.get('/profile', auth, roleCheck('student'), studentController.getProfile);
router.put('/profile', auth, roleCheck('student'), studentController.updateProfile);
router.get('/programs', auth, roleCheck('student'), studentController.getPrograms);
router.get('/programs/:id', auth, roleCheck('student'), studentController.getProgramDetails);
router.post('/applications', auth, roleCheck('student'), studentController.submitApplication);
router.get('/applications', auth, roleCheck('student'), studentController.getMyApplications);
router.get('/applications/:id', auth, roleCheck('student'), studentController.getApplicationDetails);
router.post('/applications/:id/withdraw', auth, roleCheck('student'), studentController.withdrawApplication);
router.get('/payments', auth, roleCheck('student'), studentController.getPayments);
router.get('/notifications', auth, roleCheck('student'), studentController.getNotifications);
router.put('/notifications/:id/read', auth, roleCheck('student'), studentController.markNotificationRead);

module.exports = router;
