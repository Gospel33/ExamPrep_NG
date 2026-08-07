import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { authService } from '../../lib/api';

const { width } = Dimensions.get('window');
const authIllustration = require("../../assets/images/auth_illustration.png");
const logoIllustration = require("../../assets/images/examPrep_logo.png")

export default function SignUp1Screen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinueToVerify = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return Alert.alert('Fields Required', 'Please fill in all input fields.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Password Mismatch', 'Your passwords do not match.');
    }
    if (password.length < 6) {
      return Alert.alert('Weak Password', 'Password must be at least 6 characters.');
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    setIsSubmitting(true);
    try {
      // Creates the account. The backend is expected to send the 5-digit
      // verification code to the user's email at this point.
      await authService.register({ fullName, email, password });

      router.push({
        pathname: '/verify',
        params: {
          mode: 'signup',
          firstName,
          lastName,
          email,
          password, // carried forward so /verify can log in right after OTP check
        },
      });
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const message =
        apiErrors?.[0]?.message ||
        error?.response?.data?.message ||
        'Something went wrong while creating your account. Please try again.';
      Alert.alert('Sign-Up Failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.illustrationFrame}>
          <Image source={logoIllustration} style={styles.logoImage} resizeMode="contain" />
          <Image source={authIllustration} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={styles.formCardContainer}>
          <Text style={styles.screenTitleText}>Sign-Up</Text>
          <Text style={styles.screenSubtitleText}>Hello, join us to start test updates</Text>

          <View style={styles.rowFormGroup}>
            <View style={styles.flexItem}>
              <Text style={styles.fieldLabelText}>First name</Text>
              <TextInput style={styles.inputFieldBox} placeholder="John" placeholderTextColor="#9CA3AF" value={firstName} onChangeText={setFirstName} editable={!isSubmitting} />
            </View>
            <View style={styles.flexItem}>
              <Text style={styles.fieldLabelText}>Last name</Text>
              <TextInput style={styles.inputFieldBox} placeholder="Doe" placeholderTextColor="#9CA3AF" value={lastName} onChangeText={setLastName} editable={!isSubmitting} />
            </View>
          </View>

          <Text style={styles.fieldLabelText}>Email</Text>
          <TextInput style={styles.inputFieldBox} placeholder="username@gmail.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" editable={!isSubmitting} />

          <Text style={styles.fieldLabelText}>Create Password</Text>
          <View style={styles.passwordFieldWrapper}>
            <TextInput style={styles.innerFieldTextInput} placeholder="••••••••••••" placeholderTextColor="#9CA3AF" secureTextEntry={!showPass} value={password} onChangeText={setPassword} autoCapitalize="none" editable={!isSubmitting} />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Feather name={showPass ? "eye" : "eye-off"} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabelText}>Confirm Password</Text>
          <TextInput style={styles.inputFieldBox} placeholder="••••••••••••" placeholderTextColor="#9CA3AF" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" editable={!isSubmitting} />

          <TouchableOpacity
            style={[styles.primaryActionButton, isSubmitting && styles.primaryActionButtonDisabled]}
            onPress={handleContinueToVerify}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryActionBtnText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* TOGGLE SCREEN LINK */}
          <View style={styles.footerPromptTextRow}>
            <Text style={styles.promptLabelText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.promptActionText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, paddingBottom: 32 },
  illustrationFrame: { width: width, height: 350, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F5FE', paddingVertical: 32, },
  logoImage: { width: '25%', height: '40%', marginTop: 22 },
  heroImage: { width: '85%', height: '100%', marginTop: -45, marginBottom: 30 },
  formCardContainer: { paddingHorizontal: 24, paddingTop: 20 },
  screenTitleText: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  screenSubtitleText: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 12 },
  rowFormGroup: { flexDirection: 'row', gap: 16, width: '100%' },
  flexItem: { flex: 1 },
  fieldLabelText: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6, marginTop: 12 },
  inputFieldBox: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, height: 48, paddingHorizontal: 16, color: '#111827' },
  passwordFieldWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, height: 48 },
  innerFieldTextInput: { flex: 1, height: '100%', paddingHorizontal: 16, color: '#111827' },
  eyeBtn: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
  primaryActionButton: { backgroundColor: '#3B82F6', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  primaryActionButtonDisabled: { backgroundColor: '#93C5FD' },
  primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  footerPromptTextRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  promptLabelText: { color: '#6B7280', fontSize: 14 },
  promptActionText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 14 }
});