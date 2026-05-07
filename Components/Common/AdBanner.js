import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Linking, Text } from 'react-native';
import Icons from '@react-native-vector-icons/material-design-icons';

const AdBanner = ({ imageUri, redirectUrl, style, onClose, description }) => {
  const handlePress = async () => {
    console.warn("Can't handle URL:", redirectUrl);
  if (redirectUrl) {
    try {
      const supported = await Linking.canOpenURL(redirectUrl);
      if (supported) {
        await Linking.openURL(redirectUrl);
      } else {
        console.warn("Can't handle URL:", redirectUrl);
      }
    } catch (error) {
      console.warn('Failed to open URL:', error);
    }
  }
};


  return (
    <View style={[styles.container, style]}>
      {/* Banner Click */}
      <TouchableOpacity onPress={handlePress} style={{ flex: 1 }} activeOpacity={0.9}>
        <Image
          source={{ uri: imageUri }}
          style={styles.bannerImage}
          resizeMode='contain'
        />

        {description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}
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
    width: 300,
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent', 
    elevation: 10,
    zIndex: 998,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12, // keeps corners rounded
  },
  closeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.4)', // lighter overlay
    borderRadius: 15,
    padding: 2,
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)', // lighter so background is visible
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default AdBanner;
