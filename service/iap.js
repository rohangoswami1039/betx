import * as RNIap from 'react-native-iap';

export const subscriptionSkus = ["edgepx_30_1m:premium-monthly"];

// Initialize
export async function initIAP() {
  try {
    await RNIap.initConnection();
  } catch (e) {
    console.log("IAP init error", e);
  }
}

// Fetch products
export async function getSubscriptionsList() {
  try {
    const subs = await RNIap.getProducts(subscriptionSkus);
    console.log("Subs", subs);
    return subs;
  } catch (e) {
    console.log("Get subs error", e);
    return [];
  }
}

// Purchase
export async function buyMonthlyPlan() {
  try {
    await RNIap.requestSubscription({
      sku: "edgepx_30_1m:premium-monthly",
    });
  } catch (e) {
    console.log("Buy error", e);
  }
}
