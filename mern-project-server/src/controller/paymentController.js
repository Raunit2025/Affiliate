const Razorpay = require('razorpay');
const { CREDIT_PACKS, PLAN_IDS } = require("../constants/paymentConstants");
const crypto = require('crypto');
const Users = require('../model/Users');
// const {request} =  require('http'); // This import is unused and can be removed.

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentController = {
    createOrder: async (request, response) => {
        try {
            const { credits } = request.body;

            if (!CREDIT_PACKS[credits]) {
                return response.status(400).json({
                    message: 'Invalid credit value'
                });
            }

            const amount = CREDIT_PACKS[credits] * 100; // Convert to paisa

            const order = await razorpay.orders.create({
                amount: amount,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });

            response.json({
                order: order
            });
        } catch (error) {
            console.error('Create Order Error:', error); // Improved logging
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    verifyOrder: async (request, response) => {
        try {
            const {
                razorpay_order_id, razorpay_payment_id,
                razorpay_signature, credits
            } = request.body;

            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return response.status(400).json({
                    message: 'Signature verification failed'
                });
            }

            const user = await Users.findById({ _id: request.user.id });
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
            user.credits += Number(credits);
            await user.save();

            // Return filtered user object to avoid sending sensitive data to frontend
            const updatedUser = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                adminId: user.adminId,
                credits: user.credits,
                subscription: user.subscription
            };

            response.json({ user: updatedUser });
        } catch (error) {
            console.error('Verify Order Error:', error); // Improved logging
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    createSubscription: async (request, response) => {
        try {
            const { plan_name } = request.body;
            if (!PLAN_IDS[plan_name]) {
                return response.status(400).json({
                    message: 'Invalid plan name'
                });
            }

            const plan = PLAN_IDS[plan_name];
            const subscription = await razorpay.subscriptions.create({ // Added subscription variable
                plan_id: plan.id,
                customer_notify: 1,
                // total_count: plan.totalBillingCycleCount, // Use 0 for indefinite subscriptions until canceled
                                                          // or actual number of cycles if fixed term.
                                                          // Assuming "Unlimited" means indefinite until canceled.
                total_count: 0, // Set to 0 for auto-renewal until cancelled
                notes: {
                    userId: request.user.id
                }
            });
            response.json({ subscription: subscription })
        } catch (error) {
            console.error('Create Subscription Error:', error); // Improved logging
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    verifySubscription: async (request, response) => {
        try {
            const { subscription_id } = request.body;
            const subscription = await razorpay.subscriptions.fetch(subscription_id);
            const user = await Users.findById({ _id: request.user.id });
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }

            //We'll use this entry to prevent user from subscribing again
            //from the UI, while we wait for activated event from razorpay.
            user.subscription = {
                id: subscription_id,
                planId: subscription.plan_id,
                status: subscription.status
            };
            await user.save(); // Corrected: Typo `use.save()` to `user.save()`

            // Return filtered user object
            const updatedUser = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                adminId: user.adminId,
                credits: user.credits,
                subscription: user.subscription
            };
            response.json({ user: updatedUser });

        } catch (error) {
            console.error('Verify Subscription Error:', error); // Improved logging
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    cancelSubscription: async (request, response) => {
        try {
            const { subscription_id } = request.body;

            if (!subscription_id) {
                return response.status(400).json({
                    message: 'Subscription ID is mandatory'
                });
            }

            const data = await razorpay.subscriptions.cancel(subscription_id);
            response.json({ data: data });
        } catch (error) {
            console.error('Cancel Subscription Error:', error); // Improved logging
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    handleWebhookEvent: async (request, response) => {
        try {
            console.log('Received webhook event');
            // Headers are typically lowercase in Node.js request.headers object
            const signature = request.headers['x-razorpay-signature']; // Corrected: request.header to request.headers
            const body = request.body; // This is a Buffer from express.raw()

            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
                .update(body) // body is already a Buffer, no need for toString() for crypto
                .digest('hex');

            if (expectedSignature !== signature) {
                console.warn('Invalid webhook signature');
                return response.status(400).send('Invalid Signature');
            }

            const payload = JSON.parse(body.toString('utf8')); // Convert Buffer to string for JSON.parse
            console.log('Webhook Payload:', JSON.stringify(payload, null, 2));

            const event = payload.event;
            const subscriptionData = payload.payload.subscription.entity;
            const razorpaySubscriptionId = subscriptionData.id;
            const userId = subscriptionData.notes?.userId;
            if (!userId) {
                console.warn('UserID not found in notes for webhook event:', subscriptionData);
                return response.status(400).send('UserId not found in notes');
            }

            let newStatus = '';
            switch (event) {
                case 'subscription.activated':
                    newStatus = 'active'; // Changed from 'activate' for consistency
                    break;
                case 'subscription.pending':
                    newStatus = 'pending';
                    break;
                case 'subscription.cancelled':
                    newStatus = 'canceled'; // Changed from 'cancelled' for consistency
                    break;
                case 'subscription.completed':
                    newStatus = 'completed';
                    break;
                case 'subscription.halted': // Add other relevant Razorpay events
                    newStatus = 'halted';
                    break;
                case 'subscription.paused':
                    newStatus = 'paused';
                    break;
                default:
                    console.log('Unhandled subscription event: ', event);
                    return response.status(200).send("Unhandled event type"); // Return 200 for unhandled events
            }

            const user = await Users.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'subscription.id': razorpaySubscriptionId,
                        'subscription.status': newStatus,
                        'subscription.planId': subscriptionData.plan_id,
                        'subscription.start': subscriptionData.start_at // Corrected path
                            ? new Date(subscriptionData.start_at * 1000)
                            : null,
                        'subscription.end': subscriptionData.end_at // Corrected path
                            ? new Date(subscriptionData.end_at * 1000)
                            : null,
                        'subscription.lastBillDate': subscriptionData.current_start // Corrected path
                            ? new Date(subscriptionData.current_start * 1000)
                            : null,
                        'subscription.nextBillDate': subscriptionData.current_end // Corrected path
                            ? new Date(subscriptionData.current_end * 1000)
                            : null,
                        'subscription.paymentsMade': subscriptionData.paid_count, // Corrected path
                        'subscription.paymentsRemaining': subscriptionData.remaining_count, // Corrected path
                    }
                },
                { new: true, runValidators: true } // Add runValidators for schema validation
            );

            if(!user) {
                console.warn('User not found for webhook update:', userId);
                return response.status(404).send('User not found'); // Send 404 if user not found
            }

            console.log(`Updated subscription status for user ${user.email} to ${newStatus}`);
            return response.status(200).send(`Event processed for user: ${userId}`);
        } catch (error) {
            console.error('Webhook Event Handler Error:', error); // Improved logging
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
};

module.exports = paymentController;