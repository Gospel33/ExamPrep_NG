import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const authIllustration = require("../../assets/images/auth_illustration.png");
const logoIllustration = require("../../assets/images/examPrep_logo.png")

export default function CreateNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateSubmit = () => {
    if (!newPassword || !confirmPassword) return Alert.alert('Error', 'Please completely fill text fields.');
    if (newPassword !== confirmPassword) return Alert.alert('Mismatch', 'Passwords do not look identical.');
    
    Alert.alert('Success', 'Password updated successfully!', [
      { text: 'OK', onPress: () => router.replace('/') } // Clears stack history and redirects to Sign-In
    ]);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.illustrationFrame}>
          <Image source={logoIllustration} style={styles.logoImage} resizeMode="contain" />
          <Image source={authIllustration} style={styles.heroImage} resizeMode="contain" />
        </View>

        <View style={styles.formCardContainer}>
          <Text style={styles.screenTitleText}>Create New Password</Text>
          <Text style={styles.screenSubtitleText}>Enter a new password to continue</Text>

          <Text style={styles.fieldLabelText}>Create New Password</Text>
          <TextInput style={styles.inputFieldBox} placeholder="••••••••••••" placeholderTextColor="#9CA3AF" secureTextEntry value={newPassword} onChangeText={setNewPassword} autoCapitalize="none" />

          <Text style={styles.fieldLabelText}>Confirm Password</Text>
          <TextInput style={styles.inputFieldBox} placeholder="••••••••••••" placeholderTextColor="#9CA3AF" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" />

          <TouchableOpacity style={styles.primaryActionButton} onPress={handleUpdateSubmit}>
            <Text style={styles.primaryActionBtnText}>Update Password</Text>
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
  fieldLabelText: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6, marginTop: 12 },
  inputFieldBox: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, height: 48, paddingHorizontal: 16, color: '#111827' },
  primaryActionButton: { backgroundColor: '#3B82F6', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }
});
