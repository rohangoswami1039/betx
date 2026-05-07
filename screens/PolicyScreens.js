// PolicyScreens.js

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';

// Colors
const COLORS = {
  bg: '#0B0B0F',
  text: 'rgba(255,255,255,0.92)',
  textDim: 'rgba(255,255,255,0.76)',
  link: '#6E6AF6',
  primary: '#6E6AF6',
  outline: 'rgba(255,255,255,0.22)',
  divider: 'rgba(255,255,255,0.08)',
};

// ------------------ Common Components ------------------ //

// Header Component
const Header = ({ title, onBack }) => (
  <View style={styles.header}>
    <Pressable
      onPress={onBack}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={styles.backWrap}
    >
      <Text style={styles.backArrow}>‹</Text>
    </Pressable>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.backWrap} />
  </View>
);

// Button Component
const AppButton = ({ title, onPress, variant = 'primary' }) => {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.buttonBase,
        isOutline ? styles.btnOutline : styles.btnPrimary,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={isOutline ? styles.btnOutlineText : styles.btnPrimaryText}>
        {title}
      </Text>
    </Pressable>
  );
};

// Paragraph Component
const P = ({ children }) => <Text style={styles.p}>{children}</Text>;

// Link Text Component
const LinkText = ({ label, href }) => (
  <Pressable onPress={() => Linking.openURL(href)} hitSlop={8}>
    {({ pressed }) => (
      <Text
        style={[
          styles.link,
          pressed && { textDecorationLine: 'underline', opacity: 0.9 },
        ]}
      >
        {label}
      </Text>
    )}
  </Pressable>
);

// ------------------ Screens ------------------ //

// Privacy Policy Screen
 function PrivacyPolicyScreen({ onBack, onAgree }) {
      const navigation = useNavigation();
    const handleAgree = () => {
    // Add any other logic if needed, then navigate
    navigation.navigate('Login');
  };
    const handleBack = () => {
    // Add any other logic if needed, then navigate
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Privacy Policy" onBack={handleBack} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <P>
          Your privacy is important to us. It is Brainstorming's policy to
          respect your privacy regarding any information we may collect from you
          across our 
          <LinkText label="website" href="https://example.com" />, 
          and
          other sites we own and operate.
        </P>

        <P>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we’re collecting it
          and how it will be used.
        </P>

        <P>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we’ll
          protect within commercially acceptable means to prevent loss and theft,
          as well as unauthorized access, disclosure, copying, use, or
          modification.
        </P>

        <P>
          We don’t share any personally identifying information publicly or with
          third parties, except when required to by law.
        </P>

        <View style={{ height: 20 }} />
        <AppButton title="I agree with this" onPress={handleAgree} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Terms & Conditions Screen
function TermsAndConditionsScreen({
  onBack,
  onAgree,
  onDecline,
  onOpenTermsLink,
  onOpenPrivacyLink,
}) {
  return (
    <SafeAreaView style={styles.root}>
      <Header title="Terms & Conditions" onBack={onBack} />
      <View style={styles.divider} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Review Terms & Conditions</Text>

        <P>
          Your privacy is important to us. It is Brainstorming's policy to
          respect your privacy regarding any information we may collect from you
          across our 
          <LinkText label="website" href="https://example.com" />,
           and
          other sites we own and operate.
        </P>

        <P>
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we’re collecting it
          and how it will be used.
        </P>

        <P>
          We only retain collected information for as long as necessary to
          provide you with your requested service.
        </P>

        <View style={{ height: 12 }} />

        <Pressable onPress={onOpenTermsLink}>
          <Text style={[styles.link, { textAlign: 'center' }]}>
            Terms & Conditions
          </Text>
        </Pressable>

        <View style={{ height: 8 }} />

        <Pressable onPress={onOpenPrivacyLink}>
          <Text style={[styles.link, { textAlign: 'center' }]}>
            Privacy Policy
          </Text>
        </Pressable>

        <View style={{ height: 20 }} />
        <AppButton title="I agree with this" onPress={onAgree} />
        <View style={{ height: 12 }} />
        <AppButton title="Decline" variant="outline" onPress={onDecline} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ------------------ Styles ------------------ //

const styles = StyleSheet.create({
  root: { flex: 1, 
    backgroundColor: COLORS.bg,
 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 68,
  },
  backWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: COLORS.text, fontSize: 26, marginTop: -2 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: COLORS.divider },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  subtitle: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.9,
  },
  p: {
    color: COLORS.textDim,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 14,
  },
  link: {
    color: COLORS.link,
    fontSize: 16,
  },
  buttonBase: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnPrimaryText: { color: '#0B0B0F', fontWeight: '600', fontSize: 16 },
  btnOutline: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    backgroundColor: 'transparent',
  },
  btnOutlineText: { color: '#FFFFFF', fontWeight: '500', fontSize: 16 },
});

// Export both screens (no default object)
export { PrivacyPolicyScreen, TermsAndConditionsScreen };
