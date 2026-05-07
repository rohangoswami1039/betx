import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSubscriptionPurchase} from '../service/GoogleSubscription/SubscriptionHook';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const amount = 30;

  const {
    loading: subLoading,
    subscriptions,
    buySubscription,
  } = useSubscriptionPurchase();

  const handleBuy = async () => {
    try {
      if (!subscriptions?.length) {
        console.log('No subscriptions available');
        return;
      }

      const product = subscriptions[0];

      const offerDetails = product.subscriptionOfferDetailsAndroid;

      if (!offerDetails?.length) {
        console.log('No offer details found');
        return;
      }

      const offerToken = offerDetails[0].offerToken;

      console.log('Purchasing with:', {
        sku: product.id,
        offerToken,
      });

      await buySubscription({
        sku: product.id,
        subscriptionOffers: [
          {
            sku: product.id,
            offerToken: offerToken,
          },
        ],
      });
    } catch (err) {
      console.log('Purchase Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{position: 'absolute', top: 40, left: 20, zIndex: 10}}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" style={{top: 32}} />
      </TouchableOpacity>

      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={styles.title}>Unlimited Access</Text>
        <Text style={styles.subtitle}>
          Access the most advanced AI research assistant
        </Text>

        <View style={styles.row}>
          <Ionicons name="checkmark-circle" size={22} color="#4da6ff" />
          <Text style={styles.featureText}>Access all the predictions</Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.period}>Month</Text>
          <Text style={styles.amount}>$ {amount}</Text>
          <Text style={styles.perMonth}>per month</Text>
        </View>

        {subLoading ? (
          <ActivityIndicator size="large" color="#4da6ff" />
        ) : (
          <TouchableOpacity onPress={handleBuy} style={styles.unlockBtn}>
            <Text style={styles.unlockText}>Unlock Access →</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{marginBottom: 20}}>
        <Text style={styles.footerText}>
          Terms of use | Privacy Policy | Restore
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  featureText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },

  priceBox: {
    borderWidth: 1,
    borderColor: '#4da6ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    position: 'relative',
  },

  period: {
    color: '#ccc',
    fontSize: 12,
  },

  amount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 6,
  },

  perMonth: {
    color: '#ccc',
    fontSize: 12,
  },

  unlockBtn: {
    backgroundColor: '#4e54c8c0',
    paddingVertical: 14,
    top: 114,
    borderRadius: 30,
    alignItems: 'center',
  },

  unlockText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  footerText: {
    color: '#eee3e3',
    fontSize: 12,
    textAlign: 'center',
  },
});
