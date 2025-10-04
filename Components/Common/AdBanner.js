import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import Icons from '@react-native-vector-icons/material-design-icons';

const AdBanner = ({ imageUri, redirectUrl, style, onClose }) => {
  const handlePress = async () => {
    if (redirectUrl) {
      try {
        await Linking.openURL(redirectUrl);
      } catch (error) {
        console.warn('Failed to open URL:', error);
      }
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Banner Click */}
      <TouchableOpacity onPress={handlePress} style={{ flex: 1 }} activeOpacity={0.9}>
        <Image source={{ uri: imageUri }} style={styles.bannerImage} resizeMode="contain" />
      </TouchableOpacity>

      {/* Close Button */}
      {onClose && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Icons name="close-circle" size={26} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 140,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 10,
    zIndex: 998,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 2,
  },
});

export default AdBanner;