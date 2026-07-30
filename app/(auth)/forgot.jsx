import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const authIllustration = require("../../assets/images/auth_illustration.png");
const logoIllustration = require("../../assets/images/examPrep_logo.png")

export default function ForgotPasswordScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinueReset = () => {
    if (!firstName || !lastName || !email) {
      return Alert.alert('Fields Required', 'Please fill in all details to verify your identity.');
    }

    router.push({
      pathname: '/verify',
      params: {
        email: email,
        mode: 'reset' 
      }
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.illustrationFrame}>
          <Image source={logoIllustration} style={styles.logoImage} resizeMode="contain" />
          <Image source={authIllustration} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={styles.formCardContainer}>
          <Text style={styles.screenTitleText}>Forgot Password?</Text>
          <Text style={styles.screenSubtitleText}>Verify your account to reset your password.</Text>

          <View style={styles.rowFormGroup}>
            <View style={styles.flexItem}>
              <Text style={styles.fieldLabelText}>First name</Text>
              <TextInput style={styles.inputFieldBox} placeholder="John" placeholderTextColor="#9CA3AF" value={firstName} onChangeText={setFirstName} />
            </View>
            <View style={styles.flexItem}>
              <Text style={styles.fieldLabelText}>Last name</Text>
              <TextInput style={styles.inputFieldBox} placeholder="Doe" placeholderTextColor="#9CA3AF" value={lastName} onChangeText={setLastName} />
            </View>
          </View>

          <Text style={styles.fieldLabelText}>Email</Text>
          <TextInput style={styles.inputFieldBox} placeholder="username@gmail.com" placeholderTextColor="#9CA3AF" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />

          <TouchableOpacity style={styles.primaryActionButton} onPress={handleContinueReset}>
            <Text style={styles.primaryActionBtnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/')} style={styles.backToLoginRow}>
            <Text style={styles.backToLoginText}>Back to login</Text>
          </TouchableOpacity>
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
  primaryActionButton: { backgroundColor: '#3B82F6', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  backToLoginRow: { alignItems: 'center', marginTop: 16 },
  backToLoginText: { color: '#3B82F6', fontSize: 14, fontWeight: '500', textDecorationLine: 'none' }
});
