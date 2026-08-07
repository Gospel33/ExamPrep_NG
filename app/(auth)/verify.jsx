import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { authService } from '../../lib/api';

const { width } = Dimensions.get('window');
const authIllustration = require("../../assets/images/auth_illustration.png");
const logoIllustration = require("../../assets/images/examPrep_logo.png");

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams();
  const { mode, firstName, lastName, email, password } = params;
  const isSignUpMode = mode === 'signup';

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  const formatTimerString = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const remainderSeconds = secondsLeft % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainderSeconds < 10 ? `0${remainderSeconds}` : remainderSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleResendCodeTrigger = async () => {
    setIsResending(true);
    try {
      if (isSignUpMode) {
        await authService.resendVerificationOtp(email);
        Alert.alert('Code Dispatched', `A fresh 5-digit verification code has been sent to ${email || 'your email'}.`);
      } else {
        // Password-reset flow does have a real endpoint for this.
        await authService.forgotPassword(email);
        Alert.alert('Code Dispatched', `A fresh 5-digit verification code has been sent to ${email || 'your email'}.`);
      }
      setSecondsLeft(60);
      setOtp(['', '', '', '', '']);
      inputRefs[0].current?.focus();
    } catch (error) {
      const message = error?.response?.data?.message || 'Could not resend the code. Please try again.';
      Alert.alert('Resend Failed', message);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length > 0 && index < 4) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerificationSubmit = async () => {
    const enteredPin = otp.join('');
    if (enteredPin.length < 5) {
      return Alert.alert('Incomplete Pin', 'Please enter your entire 5-digit verification code.');
    }

    setIsVerifying(true);
    try {
      if (isSignUpMode) {
        // Confirms the email using the 5-digit code as the verification token.
        // The backend looks the user up by email, so it must be sent too.
        await authService.verifyEmail(email, enteredPin);

        // verify-email doesn't return auth tokens in the docs, so we log in
        // right after using the credentials carried from the sign-up screen -
        // this is an assumption, confirm with the backend team that this is
        // the intended flow (vs. verify-email returning tokens itself).
        await authService.login({ email, password });

        router.push({
          pathname: '/signup2',
          params: { firstName, lastName, email },
        });
      } else {
        // For password reset, verification and the actual reset happen
        // together on the next screen via /auth/reset-password, so we just
        // carry the entered code forward as the reset token.
        router.push({
          pathname: '/reset',
          params: { email, token: enteredPin },
        });
      }
    } catch (error) {
      // TEMP DEBUG - remove once verification is confirmed working
      console.log('verify-email error:', JSON.stringify(error?.response?.data, null, 2));

      const apiErrors = error?.response?.data?.errors;
      const message =
        apiErrors?.[0]?.message ||
        error?.response?.data?.message ||
        'That code could not be verified. Please check it and try again.';
      Alert.alert('Verification Failed', message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* LOGO + HERO GRAPHIC ILLUSTRATION FRAME LAYER */}
        <View style={styles.illustrationFrame}>
          <Image source={logoIllustration} style={styles.logoImage} resizeMode="contain" />
          <Image source={authIllustration} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={styles.formCardContainer}>
          <Text style={styles.screenTitleText}>
            {isSignUpMode ? 'Verify your email' : 'Verify Recovery Code'}
          </Text>
          <Text style={styles.screenSubtitleText}>
            {isSignUpMode
              ? 'An activation pin code was sent to your email address.'
              : 'Enter the 5-digit verification token to reset your password.'
            }
          </Text>

          {/* OTP SEPARATE DISCRETE NUMBERED FIELDS ROW CONTAINER */}
          <View style={styles.otpInputsWrapperRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpPinBox}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                textAlign="center"
                editable={!isVerifying}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryActionButton, isVerifying && styles.primaryActionButtonDisabled]}
            onPress={handleVerificationSubmit}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryActionBtnText}>
                {isSignUpMode ? 'Verify Account' : 'Verify & Continue'}
              </Text>
            )}
          </TouchableOpacity>

          {/* DYNAMICALLY RENDERED INTERACTIVE FOOTER ROW */}
          {secondsLeft > 0 ? (
            <Text style={styles.resendClockText}>
              {`Didn't receive code? `}
              <Text style={styles.timeHighlight}>{`Resend in ${formatTimerString()}`}</Text>
            </Text>
          ) : (
            <View style={styles.resendActionWrapperRow}>
              <Text style={styles.resendClockText}>{`Didn't receive code? `}</Text>
              <TouchableOpacity onPress={handleResendCodeTrigger} activeOpacity={0.7} disabled={isResending}>
                {isResending ? (
                  <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                  <Text style={styles.resendActiveActionText}>Resend Code</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, paddingBottom: 32 },
  illustrationFrame: { width: width, height: 350, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F5FE', paddingVertical: 32 },
  logoImage: { width: '25%', height: '40%', marginTop: 22 },
  heroImage: { width: '85%', height: '100%', marginTop: -45, marginBottom: 30 },
  formCardContainer: { paddingHorizontal: 24, paddingTop: 20, alignItems: 'center' },
  screenTitleText: { fontSize: 24, fontWeight: 'bold', color: '#111827', alignSelf: 'flex-start' },
  screenSubtitleText: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 32, alignSelf: 'flex-start' },
  otpInputsWrapperRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 8, marginBottom: 32 },
  otpPinBox: { width: 52, height: 56, borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 8, fontSize: 22, fontWeight: 'bold', backgroundColor: '#F9FAFB', color: '#111827' },
  primaryActionButton: { backgroundColor: '#3B82F6', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  primaryActionButtonDisabled: { backgroundColor: '#93C5FD' },
  primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  resendClockText: { marginTop: 24, fontSize: 13, color: '#6B7280' },
  timeHighlight: { color: '#3B82F6', fontWeight: '500' },

  resendActionWrapperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  resendActiveActionText: { marginTop: 24, fontSize: 13, color: '#3B82F6', fontWeight: 'bold', textDecorationLine: 'underline' }
});