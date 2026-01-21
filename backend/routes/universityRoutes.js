const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const { auth, roleCheck } = require('../middleware/auth');

router.get('/profile', auth, roleCheck('university'), universityController.getProfile);
router.put('/profile', auth, roleCheck('university'), universityController.updateProfile);
router.post('/programs', auth, roleCheck('university'), universityController.createProgram);
router.get('/programs', auth, roleCheck('university'), universityController.getPrograms);
router.put('/programs/:id', auth, roleCheck('university'), universityController.updateProgram);
router.delete('/programs/:id', auth, roleCheck('university'), universityController.deleteProgram);
router.post('/programs/:id/deactivate', auth, roleCheck('university'), universityController.deactivateProgram);
router.get('/applications', auth, roleCheck('university'), universityController.getApplications);
router.get('/applications/:id', auth, roleCheck('university'), universityController.getApplicationDetails);
router.post('/applications/:id/status', auth, roleCheck('university'), universityController.changeApplicationStatus);
router.get('/notifications', auth, roleCheck('university'), universityController.getNotifications);

module.exports = router;
