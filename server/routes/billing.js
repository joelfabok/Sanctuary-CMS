const router      = require('express').Router();
const Organization = require('../models/Organization');
const { protect }  = require('../middleware/auth');

// Only initialise Stripe when the key is configured
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// Resolve a Stripe price ID → internal plan name
const planFromPrice = (priceId) => {
  const map = {
    [process.env.STRIPE_PRICE_STARTER]:  'starter',
    [process.env.STRIPE_PRICE_CHURCH]:   'church',
    [process.env.STRIPE_PRICE_MINISTRY]: 'ministry',
  };
  return map[priceId] || null;
};

// ── POST /api/billing/checkout ──────────────────────────────────
// Creates a Stripe Checkout session and returns the redirect URL.
router.post('/checkout', protect, async (req, res) => {
  try {
    const stripe    = getStripe();
    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ message: 'priceId is required' });

    const org       = await Organization.findById(req.user.orgId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const sessionParams = {
      mode:                 'subscription',
      payment_method_types: ['card'],
      line_items:           [{ price: priceId, quantity: 1 }],
      success_url:          `${clientUrl}/settings?billing=success`,
      cancel_url:           `${clientUrl}/settings?billing=cancelled`,
      metadata:             { orgId: org._id.toString() },
    };

    // Re-use existing Stripe customer so card details are pre-filled
    if (org.billing?.stripeCustomerId) {
      sessionParams.customer = org.billing.stripeCustomerId;
    } else {
      sessionParams.customer_email = req.user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/billing/portal ────────────────────────────────────
// Creates a Stripe Customer Portal session for managing the subscription
// (update card, change plan, cancel, view invoices).
router.post('/portal', protect, async (req, res) => {
  try {
    const stripe = getStripe();
    const org    = await Organization.findById(req.user.orgId);
    if (!org?.billing?.stripeCustomerId)
      return res.status(400).json({ message: 'No active subscription found. Please subscribe first.' });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const session   = await stripe.billingPortal.sessions.create({
      customer:   org.billing.stripeCustomerId,
      return_url: `${clientUrl}/settings`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// ── Stripe Webhook Handler ──────────────────────────────────────
// Exported separately so index.js can mount it with express.raw()
// before express.json() parses the body.
const stripeWebhook = async (req, res) => {
  let event;
  try {
    const stripe = getStripe();
    const sig    = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const stripe = getStripe();

    // ── checkout.session.completed ──────────────────────────────
    if (event.type === 'checkout.session.completed') {
      const session      = event.data.object;
      const orgId        = session.metadata?.orgId;
      if (orgId && session.subscription) {
        const sub    = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = sub.items.data[0]?.price?.id;
        const plan    = planFromPrice(priceId) || 'church';
        await Organization.findByIdAndUpdate(orgId, {
          plan,
          status: 'active',
          'billing.stripeCustomerId':     session.customer,
          'billing.stripeSubscriptionId': session.subscription,
          'billing.stripePriceId':        priceId,
          'billing.nextBilling':          new Date(sub.current_period_end * 1000),
        });
      }
    }

    // ── customer.subscription.updated ──────────────────────────
    if (event.type === 'customer.subscription.updated') {
      const sub     = event.data.object;
      const priceId = sub.items.data[0]?.price?.id;
      const plan    = planFromPrice(priceId);
      const status  = sub.status === 'active'   ? 'active'
                    : sub.status === 'trialing'  ? 'trialing'
                    : sub.status === 'past_due'  ? 'paused'
                                                 : 'cancelled';
      const org = await Organization.findOne({ 'billing.stripeSubscriptionId': sub.id });
      if (org) {
        if (plan) org.plan = plan;
        org.status = status;
        org.billing.nextBilling = new Date(sub.current_period_end * 1000);
        if (priceId) org.billing.stripePriceId = priceId;
        await org.save();
      }
    }

    // ── customer.subscription.deleted ──────────────────────────
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const org = await Organization.findOne({ 'billing.stripeSubscriptionId': sub.id });
      if (org) { org.status = 'cancelled'; await org.save(); }
    }

    // ── invoice.payment_failed ──────────────────────────────────
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const org = await Organization.findOne({ 'billing.stripeCustomerId': invoice.customer });
      if (org) { org.status = 'paused'; await org.save(); }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

module.exports           = router;
module.exports.stripeWebhook = stripeWebhook;
