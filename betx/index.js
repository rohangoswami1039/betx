const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const STRIPE_SECRET = defineSecret("STRIPE_SECRET");

let stripeClient;

function getStripe() {
  if (!stripeClient) {
    stripeClient = require("stripe")(STRIPE_SECRET.value());
  }
  return stripeClient;
}

setGlobalOptions({
  maxInstances: 10,
  secrets: [STRIPE_SECRET],
});

exports.createPaymentIntent = onCall(async (request) => {
  const {amount, currency} = request.data;

  if (!amount || amount <= 0) {
    throw new HttpsError(
      "invalid-argument",
      "Amount must be greater than zero",
    );
  }

  if (!currency) {
    throw new HttpsError(
      "invalid-argument",
      "Currency is required",
    );
  }

  try {
    const stripe = getStripe();

    const customer = await stripe.customers.create();

    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: "2023-10-16"},
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    };
  } catch (error) {
    throw new HttpsError(
      "internal",
      error.message,
    );
  }
});