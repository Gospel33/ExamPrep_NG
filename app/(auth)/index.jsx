import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, StatusBar } from 'react-native';
import { router, Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

const { width } = Dimensions.get('window');
const authIllustration = require("../../assets/images/auth_illustration.png");
const logoIllustration = require("../../assets/images/examPrep_logo.png");

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* TOP HERO ILLUSTRATION SECTION */}
        <View style={styles.illustrationFrame}>
          <Image source={logoIllustration} style={styles.logoImage} resizeMode="contain" />
          <Image source={authIllustration} style={styles.heroImage} resizeMode="contain" />
        </View>

        {/* INPUT FORM CONTENT SHEET CONTAINER */}
        <View style={styles.formCardContainer}>
          <Text style={styles.screenTitleText}>Sign-In</Text>
          <Text style={styles.screenSubtitleText}>Welcome back!</Text>

          <Text style={styles.fieldLabelText}>Email</Text>
          <TextInput 
            placeholder="username@gmail.com" 
            placeholderTextColor="#9CA3AF"
            style={styles.inputFieldBox}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.fieldLabelText}>Enter Password</Text>
          <View style={styles.passwordFieldWrapper}>
            <TextInput 
              placeholder="••••••••••••" 
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={styles.innerFieldTextInput}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryActionButton} onPress={() => router.replace('/(tabs)/home')}>
            <Text style={styles.primaryActionBtnText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/forgot')} style={styles.secondaryLinkRow}>
            <Text style={styles.forgotPasswordText}>Forgotten Password?</Text>
          </TouchableOpacity>

          <View style={styles.footerPromptTextRow}>
            <Text style={styles.promptLabelText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup1')}>
              <Text style={styles.promptActionText}>Sign Up</Text>
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
  illustrationFrame: { width: width, height: 350,flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F5FE', paddingVertical: 58, marginBottom: 14 },
  logoImage: { width: '25%', height: '40%', marginTop: 16 },
  heroImage: { width: '150%', height: '120%', marginTop: -36 },
  formCardContainer: { paddingHorizontal: 24, paddingTop: 34 },
  screenTitleText: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  screenSubtitleText: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 24 },
  fieldLabelText: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8, marginTop: 14 },
  inputFieldBox: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, height: 50, paddingHorizontal: 16, color: '#111827', fontSize: 15 },
  passwordFieldWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, height: 50 },
  innerFieldTextInput: { flex: 1, height: '100%', paddingHorizontal: 16, color: '#111827', fontSize: 15 },
  eyeBtn: { paddingHorizontal: 16, height: '100%', justifyContent: 'center' },
  primaryActionButton: { backgroundColor: '#3B82F6', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  secondaryLinkRow: { alignItems: 'center', marginTop: 16 },
  forgotPasswordText: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },
  footerPromptTextRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  promptLabelText: { color: '#6B7280', fontSize: 14 },
  promptActionText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 14 }
});
