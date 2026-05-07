import React, { useEffect, useImperativeHandle, forwardRef, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2283291470258709/4297777195';

const GoogleInterstitialAd = forwardRef((props, ref) => {
  const interstitial = useRef(
    InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })
  ).current;

  const loadAd = useCallback(() => {
    interstitial.load();
  }, [interstitial]);

  useEffect(() => {
    // Show ad only once when loaded
    const loadedListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('✅ Interstitial ad loaded!');
      interstitial.show();
    });

    // Optional: just log when ad is closed
    const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('🧹 Interstitial ad closed.');
    });

    // Initial load
    loadAd();

    return () => {
      loadedListener();
      closedListener();
    };
  }, [interstitial, loadAd]);

  useImperativeHandle(ref, () => ({
    showAd: () => {
      if (interstitial.loaded) {
        interstitial.show();
      } else {
        loadAd();
      }
    },
  }));

  return <View />;
});

export default GoogleInterstitialAd;
