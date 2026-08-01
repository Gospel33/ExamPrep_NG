import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';

const { width } = Dimensions.get('window');

// Placeholder local empty-state asset graphic 
const emptyDashboardIllustration = require("../../assets/images/auth_illustration.png");

// Mock Syllabus Data corresponding to the selected subjects configuration array
const MOCK_SYLLABUS = [
  { name: 'English', progress: 0.92, color: '#15803D' },     
  { name: 'Biology', progress: 0.48, color: '#EAB308' },     
  { name: 'Chemistry', progress: 0.30, color: '#DC2626' },   
  { name: 'Mathematics', progress: 0.87, color: '#2563EB' },
];

const MOCK_HISTORY = [
  { id: '1', title: 'Self-Timed Practice', specs: '10mins • English • Biology', date: '12/08/26', score: '256/400' },
  { id: '2', title: 'Self-Timed Practice', specs: '10mins • English • Biology', date: '12/08/26', score: '256/400' },
  { id: '3', title: 'Self-Timed Practice', specs: '10mins • English • Biology', date: '12/08/26', score: '256/400' },
];

export default function StudentDashboardScreen() {
  // 2. DYNAMIC LOOKUP SWITCH STATE FLAG
  // Change to 'false' to immediately preview the active student analytics view layout!
  const [isNewUser, setIsNewUser] = useState(false); 

  //  VIEW A: ACTIVE PERFORMANCE STUDENT SUMMARY 
  const RenderActiveDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
      
      {/* SYLLABUS PROGRESS CARD BOX */}
      <View style={styles.dashboardMetricCard}>
        <Text style={styles.cardSectionHeadingText}>Syllabus Progress</Text>
        
        {MOCK_SYLLABUS.map((subject, index) => (
          <View key={index} style={styles.subjectProgressRowLine}>
            <Text style={styles.subjectLabelText}>{subject.name}</Text>
            {/* The multi-color progress bar track */}
            <View style={styles.progressBarTrackBackground}>
              <View 
                style={[
                  styles.progressBarFillCore, 
                  { width: `${subject.progress * 100}%`, backgroundColor: subject.color }
                ]} 
              />
            </View>
            <Text style={styles.percentageTextLabel}>{`${Math.round(subject.progress * 100)}%`}</Text>
          </View>
        ))}
      </View>

      {/* THREE COLUMN GRID BOX METRIC TILES SUMMARYROW */}
      <View style={styles.numericalMetricsRowGrid}>
        <View style={styles.metricGridBoxTile}>
          <Text style={styles.metricBigNumberText}>324</Text>
          <Text style={styles.metricLabelSubtext}>Average Score</Text>
        </View>
        <View style={styles.metricGridBoxTile}>
          <Text style={styles.metricBigNumberText}>6secs</Text>
          <Text style={styles.metricLabelSubtext}>Avg. T/Q</Text>
        </View>
        <View style={styles.metricGridBoxTile}>
          <Text style={styles.metricBigNumberText}>88%</Text>
          <Text style={styles.metricLabelSubtext}>Accuracy</Text>
        </View>
      </View>

      {/* PRACTICE HISTORY LIST CANVAS */}
      <Text style={styles.globalSectionHeadingTitleText}>Practice History</Text>
      
      {MOCK_HISTORY.map((item) => (
        <View key={item.id} style={styles.historyListCardItemRow}>
          <View style={styles.historyLeftMetaBox}>
            <Text style={styles.historyCardTitleText}>{item.title}</Text>
            <Text style={styles.historyCardSpecsSubtext}>{item.specs}</Text>
          </View>
          <View style={styles.historyRightScoreBox}>
            <Text style={styles.historyCardDateText}>{item.date}</Text>
            <Text style={styles.historyCardScoreValueText}>{item.score}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  //  VIEW B: NEW USER EMPTY BLANK STATE 
  const RenderNewUserBlankState = () => (
    <View style={styles.emptyStateContainerBoxCenteringLayer}>
      <Image 
        source={emptyDashboardIllustration} 
        style={styles.emptyStateIllustrationAsset} 
        resizeMode="contain" 
      />
      <Text style={styles.emptyStateHeadlineTitleText}>You haven't completed any practice yet</Text>
      <Text style={styles.emptyStateDescriptionSubtext}>
        Start your first practice session to test your knowledge and track your progress.
      </Text>

      <TouchableOpacity 
        style={styles.primaryLaunchPracticeButton} 
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/practice')} // Redirects to practice tab screen viewport
      >
        <Text style={styles.primaryLaunchPracticeButtonText}>Start Practice</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainerWrapperCanvas}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* PERMANENT TOP HERO WELCOME BANNER LAYER */}
      <View style={styles.topStickyHeaderBarContainer}>
        <Text style={styles.welcomeSalutationText}>Welcome Back Joe!</Text>
        <Text style={styles.mainScreenTitleTextHeadingText}>Performance Summary</Text>
      </View>

      {/* CORE LAYER TOGGLE LAYOUT SWITCH ENGINE */}
      {isNewUser ? RenderNewUserBlankState() : RenderActiveDashboard()}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainerWrapperCanvas: {
    flex: 1,
    backgroundColor: '#FFFFFC',
  },
  topStickyHeaderBarContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  welcomeSalutationText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mainScreenTitleTextHeadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  scrollContentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 110, // Leaves clean clearance for the bottom tab navigator overlay
  },
  dashboardMetricCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.015,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSectionHeadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 20,
  },
  subjectProgressRowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  subjectLabelText: {
    width: 90,
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  progressBarTrackBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBarFillCore: {
    height: '100%',
    borderRadius: 4,
  },
  percentageTextLabel: {
    width: 36,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  numericalMetricsRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
    marginBottom: 28,
  },
  metricGridBoxTile: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricBigNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricLabelSubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 6,
    fontWeight: '500',
  },
  globalSectionHeadingTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  historyListCardItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  historyLeftMetaBox: {
    flex: 1,
  },
  historyCardTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  historyCardSpecsSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  historyRightScoreBox: {
    alignItems: 'flex-end',
  },
  historyCardDateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  historyCardScoreValueText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  
  // NEW USER LAYOUT WRAPPER ALIGNMENTS
  emptyStateContainerBoxCenteringLayer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 64,
  },
  emptyStateIllustrationAsset: {
    width: width * 0.65,
    height: 200,
    marginBottom: 24,
  },
  emptyStateHeadlineTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyStateDescriptionSubtext: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  primaryLaunchPracticeButton: {
    backgroundColor: '#3B82F6',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryLaunchPracticeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
