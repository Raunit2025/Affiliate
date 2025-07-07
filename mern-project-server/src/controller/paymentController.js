const Razorpay = require('razorpay');
const {CREDIT_PACKS, PLAN_IDS} = require("../constants/paymentConstants");
const crypto = require('crypto');
const Users = require('../model/Users');
const { default: subscriptions } = require('razorpay/dist/types/subscriptions');
const { response } = require('express');
const { use } = require('react');
const { log } = require('console');

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
            console.log(error);
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
            user.credits += Number(credits);
            await user.save();

            response.json({ user: user });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    createSubscription: async  (request, response) => {
        try{
            const { plan_name } = request.body;
            if(!PLAN_IDS[plan_name]) {
                return response.status(400).json({
                    message: 'Invalid plan name'
                });
            }

            const plan = PLAN_IDS[plan_name];
            await razorpay.subscriptions.create({
                plan_id:  plan.id,
                customer_notify: 1,
                total_count: plan.totalBillingCycleCount,
                notes: {
                    userId: request.user.id
                }
            });
            response.json({subscription: subscription})
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
    verifySubscription: async (request, response) => {
        try{
            const { subscription_id } = request.body;
            const subscription = await razorpay.subscriptions.fetch(subscription_id);
            const user =  await Users.findById({ _id: request.user.id });

            //We'll use this entry to prevent user from subscribing again
            //from the UI, while we wait for activated event from razorpay.
            user.subscription = {
                id: subscription_id,
                planId: subscription.plan_id,
                status: subscription.status
            };
            await use.save();
            response.json({ user: user});

        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    cancelSubscription : async (request, response) => {
        try {
            const { subscription_id} = request.body;

            if(!subscription_id) {
                return response.status(400).json({
                    message: 'Subscription ID is mandatory'
                });
            }

            const data = await razorpay.subscriptions.cancel(subscription_id);
            response.json({ data: data });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
};

module.exports = paymentController;