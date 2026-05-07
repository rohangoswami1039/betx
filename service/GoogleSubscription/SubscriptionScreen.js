import React, {useEffect} from 'react';
import {View, Text, Button, ActivityIndicator} from 'react-native';
import {useSubscriptionPurchase} from './SubscriptionHook';

export default function SubscriptionScreen() {
  const {
    loading,
    subscriptions,
    loadSubscriptions,
    buySubscription,
  } = useSubscriptionPurchase();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        Premium Subscription
      </Text>

      {loading && <ActivityIndicator />}

      {!loading && subscriptions.length === 0 && (
        <Text>No subscription found</Text>
      )}

      {subscriptions.length > 0 && (
        <View style={{marginTop: 20}}>
          <Text>
            {subscriptions[0].title}
          </Text>
          <Text>
            Price: {subscriptions[0].price}
          </Text>

          <Button title="Buy Subscription" onPress={buySubscription} />
        </View>
      )}
    </View>
  );
};