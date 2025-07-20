// mern-project-server/src/constants/paymentConstants.js
const CREDIT_PACKS = {
    10: 10,
    20: 20,
    50: 50,
    100: 100
};

const PLAN_IDS = {
    UNLIMITED_YEARLY: {
        id: process.env.RAZORPAY_YEARLY_PLAN_ID,
        planName: 'Unlimited Yearly',
        totalBillingCycleCount: 30 // MODIFIED: Set to 30 years worth of cycles
    },
    UNLIMITED_MONTHLY: {
        id: process.env.RAZORPAY_MONTHLY_PLAN_ID,
        planName: 'Unlimited Monthly',
        totalBillingCycleCount: 360 // MODIFIED: Set to 30 years worth of cycles
    },
};

module.exports ={ CREDIT_PACKS, PLAN_IDS };