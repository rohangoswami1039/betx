import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {useIAP, ErrorCode} from 'react-native-iap';

export function useSubscriptionPurchase() {
  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    
    onPurchaseSuccess: async (purchase) => {
      try {
        await finishTransaction({purchase});
      } catch (e) {
        console.log('Finish error:', e);
      }
    },
    onPurchaseError: (error) => {
      if (error.code !== ErrorCode.UserCancelled) {
        Alert.alert('Error', error.message);
      }
    },
  });




  const [loading, setLoading] = useState(false);

  const loadSubscriptions = async () => {
    if (!connected) {
      console.log('❗ IAP not connected yet');
      return;
    }

    try {
      setLoading(true);

      await fetchProducts({
        skus: ['edgepx_30_1m'],
        type: 'subs',
      });

      console.log("Loaded subs:", subscriptions);

    } catch (err) {
      console.log('Subscription load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) loadSubscriptions();
  }, [connected]);

  // BUY SUBSCRIPTION
//  const buySubscription = async () => {
//   const product = subscriptions?.[0];

//   if (!product) {
//     Alert.alert("Error", "Subscription is not loaded yet");
//     return;
//   }

//   // Choose the offer with basePlanId = "premium-monthly"
//   const selectedOffer = product.subscriptionOfferDetailsAndroid?.find(
//     offer => offer.basePlanId === "premium-monthly"
//   );

//   if (!selectedOffer) {
//     Alert.alert("Error", "Premium monthly offer not found");
//     return;
//   }

//   const offerToken = selectedOffer.offerToken;

//   try {
//     await requestPurchase({
//       type: "subs",
//       request: {
//         google: {
//           skus: ["edgepx_30_1m"],
//           subscriptionOffers: [
//             {
//               sku: product.id,
//               offerToken: offerToken,
//             },
//           ],
//         },
//       },
//     });
//   } catch (err) {
//     console.log("Purchase error:", err);
//     Alert.alert("Error", err.message);
//   }
// };

  const buySubscription = async () => {
  const product = subscriptions?.[0];

  if (!product) {
    Alert.alert("Error", "Subscription is not loaded yet");
    return;
  }

  const offers = product.subscriptionOfferDetailsAndroid;

  if (!offers || offers.length === 0) {
    Alert.alert("Error", "No offers found.");
    return;
  }

  // ⭐ Use the REAL basePlanId your device returns
  const selectedOffer =
    offers.find(o => o.basePlanId === "monthly-subscription") ||
    offers[0];  // fallback

  if (!selectedOffer) {
    Alert.alert("Error", "Offer not found in device response.");
    return;
  }

  const offerToken = selectedOffer.offerToken;

  try {
    await requestPurchase({
      type: "subs",
      request: {
        google: {
          skus: ["edgepx_30_1m"],
          subscriptionOffers: [
            {
              sku: product.id,
              offerToken: offerToken,
            },
          ],
        },
      },
    });
  } catch (err) {
    console.log("Purchase error:", err);
    Alert.alert("Error", err.message);
  }
};


  return {
    loading,
    subscriptions,
    loadSubscriptions,
    buySubscription,
  };
}
