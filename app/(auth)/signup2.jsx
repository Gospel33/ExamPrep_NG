import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { authService } from '../../lib/api';

const { width } = Dimensions.get('window');
const authIllustration = require("../../assets/images/auth_illustration.png");
const logoIllustration = require("../../assets/images/examPrep_logo.png");

const AVAILABLE_SUBJECTS = [
  'English', 'Biology', 'Physics', 'Chemistry', 'Literature',
  'Commerce', 'Government', 'CRS', 'IRS', 'Computer Studies',
  'Business Studies', 'History', 'Geography', 'Economics', 'Mathematics',
  'Further Mathematics', 'Agricultural Science', 'Civic Education', 'French',
];

// The backend requires preferredExamType alongside preferredSubjects, but
// this screen doesn't currently ask the user for it. Defaulting to JAMB for
// now - swap this out once there's a real exam-type picker in the flow.
const DEFAULT_EXAM_TYPE = 'JAMB';

export default function SignUp2Screen() {
  const params = useLocalSearchParams();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSubjectSelection = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(prev => prev.filter(item => item !== subject));
    } else {
      if (selectedSubjects.length >= 4) {
        Alert.alert('Selection Limit', 'You can choose exactly four subjects for your focus tracking.');
        return;
      }
      setSelectedSubjects(prev => [...prev, subject]);
    }
  };

  const handleRegistrationFinalSubmit = async () => {
    if (selectedSubjects.length !== 4) {
      return Alert.alert('Incomplete Profile', 'Please select exactly 4 subjects to proceed.');
    }
    if (!agreedToTerms) {
      return Alert.alert('Terms & Conditions', 'You must agree to the Terms & Conditions to create an account.');
    }

    setIsSubmitting(true);
    try {
      // Save the chosen exam type and subjects to the authenticated user.
      const response = await authService.updateSettings({
        preferredExamType: DEFAULT_EXAM_TYPE,
        preferredSubjects: selectedSubjects,
      });

      if (!response) {
        throw new Error('No response received from the server.');
      }

      Alert.alert('Registration Complete', 'Your subjects have been saved successfully.', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)/home') },
      ]);
    } catch (error) {
      console.log('updateSettings error:', JSON.stringify(error?.response?.data || error?.message, null, 2));
      const apiErrors = error?.response?.data?.errors;
      const message =
        apiErrors?.[0]?.message ||
        error?.response?.data?.message ||
        'Could not save your subject preferences. Please try again.';
      Alert.alert('Save Failed', message);
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
          <Text style={styles.screenSubtitleText}>Choose four subjects</Text>

          <View style={styles.subjectsGridWrapper}>
            {AVAILABLE_SUBJECTS.map((subject) => {
              const isSelected = selectedSubjects.includes(subject);
              return (
                <TouchableOpacity
                  key={subject}
                  onPress={() => toggleSubjectSelection(subject)}
                  style={[styles.subjectChip, isSelected && styles.subjectChipActive]}
                  activeOpacity={0.7}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.subjectChipText, isSelected && styles.subjectChipTextActive]}>
                    {subject}
                  </Text>

                  {/* Cancel Icon: Renders only when the subject is selected */}
                  {isSelected && (
                    <View style={styles.closeIconWrapper}>
                      <Text style={styles.closeIconText}>×</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.checkboxContainerRow} activeOpacity={0.8} onPress={() => setAgreedToTerms(!agreedToTerms)} disabled={isSubmitting}>
            <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxBoxActive]}>
              {agreedToTerms && <Text style={styles.checkmarkIcon}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabelText}>
              I agree to the <Text style={styles.legalHighlightText}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryActionButton, isSubmitting && styles.primaryActionButtonDisabled]}
            onPress={handleRegistrationFinalSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryActionBtnText}>Complete Registration</Text>
            )}
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
  screenSubtitleText: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  subjectsGridWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%', marginBottom: 24 },

  // UPDATED STYLES FOR THE CHIPS
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  subjectChipActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  subjectChipText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  subjectChipTextActive: { color: '#3B82F6', fontWeight: '600' },

  // NEW STYLES FOR THE CLOSE ACCENT INDICATOR
  closeIconWrapper: {
    marginLeft: 8,
    backgroundColor: '#3B82F6',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
    textAlign: 'center',
  },

  checkboxContainerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, marginBottom: 16 },
  checkboxBox: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#9CA3AF', borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  checkboxBoxActive: { borderColor: '#3B82F6', backgroundColor: '#3B82F6' },
  checkmarkIcon: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', bottom: 1 },
  checkboxLabelText: { fontSize: 13, color: '#4B5563' },
  legalHighlightText: { color: '#3B82F6', fontWeight: '500' },
  primaryActionButton: { backgroundColor: '#3B82F6', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  primaryActionButtonDisabled: { backgroundColor: '#93C5FD' },
  primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }
});