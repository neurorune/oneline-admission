const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

exports.initiatePayment = async (req, res) => {
    try {
        const { application_id } = req.body;

        if (!application_id) {
            return res.status(400).json({ success: false, message: 'Application ID is required' });
        }

        const [profiles] = await db.query('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const [applications] = await db.query(
            'SELECT a.*, p.application_fee FROM applications a JOIN programs p ON a.program_id = p.id WHERE a.id = ? AND a.student_id = ?',
            [application_id, profiles[0].id]
        );

        if (applications.length === 0) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        const [payments] = await db.query('SELECT id FROM payments WHERE application_id = ?', [application_id]);
        const paymentId = payments[0]?.id;

        if (!paymentId) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }

        const paymentGatewayUrl = `http://localhost:3000/payment-gateway?payment_id=${paymentId}&amount=${applications[0].application_fee}`;

        res.json({
            success: true,
            message: 'Payment initiated',
            data: {
                payment_id: paymentId,
                application_id,
                amount: applications[0].application_fee,
                currency: 'BDT',
                payment_gateway_url: paymentGatewayUrl,
                expires_at: new Date(Date.now() + 3600000)
            }
        });
    } catch (error) {
        console.error('Initiate payment error:', error);
        res.status(500).json({ success: false, message: 'Failed to initiate payment', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { payment_id, transaction_id, status, amount } = req.body;

        if (!payment_id || !status) {
            return res.status(400).json({ success: false, message: 'Payment ID and status are required' });
        }

        const [payments] = await db.query('SELECT * FROM payments WHERE id = ?', [payment_id]);
        if (payments.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        const payment = payments[0];

        await db.query(
            'UPDATE payments SET payment_status = ?, transaction_id = ?, payment_method = ?, paid_at = NOW() WHERE id = ?',
            [status, transaction_id || uuidv4(), 'card', payment_id]
        );

        if (status === 'completed') {
            await db.query(
                'UPDATE applications SET application_status = ?, submitted_at = NOW() WHERE id = ?',
                ['submitted', payment.application_id]
            );

            const [apps] = await db.query(
                'SELECT a.student_id, p.name as program_name, p.university_id FROM applications a JOIN programs p ON a.program_id = p.id WHERE a.id = ?',
                [payment.application_id]
            );

            if (apps.length > 0) {
                const [students] = await db.query('SELECT user_id FROM student_profiles WHERE id = ?', [apps[0].student_id]);
                if (students.length > 0) {
                    await db.query(
                        'INSERT INTO notifications (user_id, title, message, type, related_id, related_type) VALUES (?, ?, ?, ?, ?, ?)',
                        [students[0].user_id, 'Payment Successful', `Your payment for ${apps[0].program_name} has been completed successfully.`, 'payment', payment.application_id, 'application']
                    );
                }

                const [universities] = await db.query('SELECT user_id FROM universities WHERE id = ?', [apps[0].university_id]);
                if (universities.length > 0) {
                    await db.query(
                        'INSERT INTO notifications (user_id, title, message, type, related_id, related_type) VALUES (?, ?, ?, ?, ?, ?)',
                        [universities[0].user_id, 'New Application Received', `A new application has been received for ${apps[0].program_name}.`, 'general', payment.application_id, 'application']
                    );
                }
            }
        }

        res.json({
            success: true,
            message: 'Payment verified and application submitted',
            data: {
                payment_id,
                payment_status: status,
                application_id: payment.application_id,
                application_status: status === 'completed' ? 'submitted' : 'pending'
            }
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify payment', error: error.message });
    }
};

exports.getPaymentDetails = async (req, res) => {
    try {
        const paymentId = req.params.id;

        const [payments] = await db.query('SELECT * FROM payments WHERE id = ?', [paymentId]);

        if (payments.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        res.json({ success: true, data: payments[0] });
    } catch (error) {
        console.error('Get payment details error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payment details', error: error.message });
    }
};
