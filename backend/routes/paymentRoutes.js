const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth, roleCheck } = require('../middleware/auth');

router.post('/initiate', auth, roleCheck('student'), paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);
router.get('/:id', auth, paymentController.getPaymentDetails);

module.exports = router;
