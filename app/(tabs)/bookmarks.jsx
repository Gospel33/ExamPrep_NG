import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions,  
  StatusBar,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// LINK YOUR LOCAL DESIGN ASSET EXPORTS HERE
const sortIconAsset = require("../../assets/images/sort_filter.png"); 
const bookmarkActiveAsset = require("../../assets/images/bookmarked_active.png"); 
const emptyBookmarksIllustration = require("../../assets/images/onboard-2.png");

const MOCK_CATEGORIES = [
  { id: 'all', label: 'All', count: 62 },
  { id: 'biology', label: 'Biology', count: 32 },
  { id: 'chemistry', label: 'Chemistry', count: 18 },
  { id: 'physics', label: 'Physics', count: 12 }
];

const MOCK_BOOKMARKED_QUESTIONS = [
  {
    id: '12',
    subject: 'Biology',
    year: '2022 JAMB',
    question: 'A maize plant develops yellow leaves despite receiving enough water and sunlight. A soil test reveals a deficiency of nitrogen, an essential nutrient needed for chlorophyll production. Which process will be most directly affected?',
    explanation: 'Nitrogen is an essential nutrient required for the production of chlorophyll, the green pigment that plants use to absorb sunlight for photosynthesis. When a plant lacks nitrogen, chlorophyll production decreases, causing the leaves to turn yellow—a condition known as chlorosis. As a result, the plant’s ability to carry out photosynthesis is directly affected.',
    tip: 'Remember: Nitrogen → Chlorophyll → Photosynthesis.'
  },
  {
    id: '13',
    subject: 'Biology',
    year: '2022 JAMB',
    question: 'A maize plant develops yellow leaves despite receiving enough water and sunlight. A soil test reveals a deficiency of nitrogen, an essential nutrient needed for chlorophyll production. Which process will be most directly affected?',
    explanation: 'Nitrogen is an essential nutrient required for the production of chlorophyll, the green pigment that plants use to absorb sunlight for photosynthesis. When a plant lacks nitrogen, chlorophyll production decreases, causing the leaves to turn yellow—a condition known as chlorosis. As a result, the plant’s ability to carry out photosynthesis is directly affected.',
    tip: 'Remember: Nitrogen → Chlorophyll → Photosynthesis.'
  },
  {
    id: '14',
    subject: 'Biology',
    year: '2022 JAMB',
    question: 'A maize plant develops yellow leaves despite receiving enough water and sunlight. A soil test reveals a deficiency of nitrogen, an essential nutrient needed for chlorophyll production. Which process will be most directly affected?',
    explanation: 'Nitrogen is an essential nutrient required for the production of chlorophyll, the green pigment that plants use to absorb sunlight for photosynthesis. When a plant lacks nitrogen, chlorophyll production decreases, causing the leaves to turn yellow—a condition known as chlorosis. As a result, the plant’s ability to carry out photosynthesis is directly affected.',
    tip: 'Remember: Nitrogen → Chlorophyll → Photosynthesis.'
  },
];

export default function BookmarksScreen() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // 🔑 THE EXACT PRODUCTION-SUPPORTED BACK BUTTON INTERCEPTOR FIX
  useEffect(() => {
    const handleHardwareBackPress = () => {
      if (selectedQuestion !== null) {
        setSelectedQuestion(null); // Step backward out of details sheet to the list grid
        return true; // Prevents the operating system from closing the tab
      }
      return false; // Let the phone run its default back-route logic if no question is selected
    };

    // 1. Save the event registration as a subscription reference object
    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress', 
      handleHardwareBackPress
    );

    // 2. 🔑 CRITICAL PRO-FIX: Use .remove() on the subscription object directly
    return () => {
      backSubscription.remove(); 
    };
  }, [selectedQuestion]);
    // ==================== VIEW 1: BOOKMARKS LIST VIEW ====================
  const RenderBookmarksList = () => (
    <View style={styles.contentFlex}>
      <Text style={styles.screenHeading}>Bookmarks</Text>

      {/* FILTER CATEGORY SCROLLBAR TRACK */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollPadding}>
          
          <TouchableOpacity style={styles.filterMenuBadge} activeOpacity={0.7}>
            <Image 
              source={sortIconAsset} 
              style={styles.customSortImageStyle} 
              resizeMode="contain" 
            />
          </TouchableOpacity>

          {MOCK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[styles.chipBadge, activeCategory === cat.id && styles.chipBadgeActive]}
            >
              <Text style={[styles.chipBadgeText, activeCategory === cat.id && styles.chipBadgeTextActive]}>
                {`${cat.label} (${cat.count})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.subHintLabelText}>Tap question to view answer explanation</Text>

      {/* VERTICAL SCROLL LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.verticalScrollPadding}>
        {MOCK_BOOKMARKED_QUESTIONS.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.questionCardItem}
            activeOpacity={0.8}
            onPress={() => setSelectedQuestion(item)} 
          >
            <Text style={styles.cardQuestionSnippetText} numberOfLines={2}>
              {`Q${item.id}. ${item.question}`}
            </Text>
            <Text style={styles.cardQuestionMetaBadgeText}>
              {`${item.subject} • ${item.year}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // ==================== VIEW 2: NEW USER EMPTY STATE ====================
  const RenderEmptyState = () => (
    <View style={styles.emptyCenteringWrapper}>
      <Image source={emptyBookmarksIllustration} style={styles.emptyIllustration} resizeMode="contain" />
      <Text style={styles.emptyStateTitle}>No Bookmarks yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Save important questions while practicing to find them here.
      </Text>
      <TouchableOpacity 
        style={styles.primaryActionButton} 
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/practice')} 
      >
        <Text style={styles.primaryActionBtnText}>Start Practice</Text>
      </TouchableOpacity>
    </View>
  );
    // ==================== VIEW 3: ANSWER EXPLANATION DETAIL PANEL ====================
  const RenderAnswerExplanation = () => {
    if (!selectedQuestion) {
      return <View style={styles.mainCanvasContainer} />;
    }

    return (
      <View style={styles.contentFlex}>
        {/* HEADER DEEP DETAIL SECTIONS NAVIGATION BAR */}
        <View style={styles.detailNavBarRow}>
          <TouchableOpacity onPress={() => setSelectedQuestion(null)} style={styles.navCircleBackBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.detailNavBarTitle}>Answer Explanation</Text>
          
          <TouchableOpacity activeOpacity={0.7} style={styles.bookmarkImageClickFrame}>
            <Image 
              source={bookmarkActiveAsset} 
              style={styles.customBookmarkIconStyle} 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailScrollPadding}>
          <View style={styles.detailQuestionBlock}>
            <Text style={styles.questionHeadlineTitle}>{`Question ${selectedQuestion?.id || ''}`}</Text>
            <Text style={styles.detailTextContentBody}>{selectedQuestion?.question || ''}</Text>
          </View>

          <View style={styles.explanationOutputCard}>
            <View style={styles.explanationHeaderLabelRow}>
              <Ionicons name="documents-outline" size={16} color="#2563EB" style={styles.searchIconGap} />
              <Text style={styles.explanationLabelTitleText}>Answer Explanation</Text>
            </View>
            <Text style={styles.detailTextContentBody}>{selectedQuestion?.explanation || ''}</Text>
          </View>

          <View style={styles.tipAccentContainerBox}>
            <View style={styles.explanationHeaderLabelRow}>
              <Ionicons name="bulb-outline" size={16} color="#EAB308" style={styles.searchIconGap} />
              <Text style={styles.tipLabelTitleText}>Tip</Text>
            </View>
            <Text style={styles.tipTextContentBody}>{selectedQuestion?.tip || ''}</Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainCanvasContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {selectedQuestion 
        ? RenderAnswerExplanation() 
        : (isNewUser ? RenderEmptyState() : RenderBookmarksList())
      }
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainCanvasContainer: { flex: 1, backgroundColor: '#FFFFFC' },
  contentFlex: { flex: 1 },
  searchIconGap: { marginRight: 8 },
  screenHeading: { fontSize: 24, fontWeight: 'bold', color: '#111827', paddingHorizontal: 24, paddingTop: 36 },
  
  categoriesContainer: { width: '100%', marginTop: 22, height: 40 },
  categoryScrollPadding: { paddingHorizontal: 22, alignItems: 'center', gap: 8 },
  filterMenuBadge: { width: 58, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F8FB' },
  
  customSortImageStyle: { width: 28, height: 28 },
  bookmarkImageClickFrame: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  customBookmarkIconStyle: { width: 20, height: 20 },

  chipBadge: { paddingHorizontal: 16, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#9EBCF5', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F8FB' },
  chipBadgeActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  chipBadgeText: { fontSize: 13, color: '#6B97F2', fontWeight: '500' },
  chipBadgeTextActive: { color: '#3B82F6', fontWeight: '600' },
  
  subHintLabelText: { fontSize: 13, color: '#9CA3AF', paddingHorizontal: 24, marginTop: 16, marginBottom: 8 },
  verticalScrollPadding: { paddingHorizontal: 24, paddingBottom: 110, paddingTop: 8 },
  
  questionCardItem: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 16 },
  cardQuestionSnippetText: { fontSize: 14, color: '#111827', fontWeight: '500', lineHeight: 20 },
  cardQuestionMetaBadgeText: { fontSize: 12, color: '#9CA3AF', marginTop: 8 },

  detailNavBarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 56, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  navCircleBackBtn: { padding: 4 },
  detailNavBarTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },

  detailScrollPadding: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 110 },
  detailQuestionBlock: { marginBottom: 20 },
  questionHeadlineTitle: { fontSize: 15, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
  detailTextContentBody: { fontSize: 14, color: '#111827', lineHeight: 22 },
  
  explanationOutputCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 16 },
  explanationHeaderLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  explanationLabelTitleText: { fontSize: 14, fontWeight: 'bold', color: '#2563EB' },
  
  tipAccentContainerBox: { backgroundColor: '#FEFCE8', borderWidth: 1, borderColor: '#FEF08A', borderRadius: 12, padding: 16 },
  tipLabelTitleText: { fontSize: 14, fontWeight: 'bold', color: '#CA8A04' },
  tipTextContentBody: { fontSize: 13, color: '#713F12', lineHeight: 20 },

  emptyCenteringWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIllustration: { width: width * 0.6, height: 180, marginBottom: 24 },
  emptyStateTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  emptyStateSubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginTop: 12, paddingHorizontal: 12 },
  primaryActionButton: { backgroundColor: '#3B82F6', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }
});
