import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const logoAsset = require("../../assets/images/examPrep_logo.png"); 
const slide1Asset = require("../../assets/images/onboard-1.png"); 
const slide2Asset = require("../../assets/images/onboard-2.png"); 
const slide3Asset = require("../../assets/images/onboard-3.png"); 

const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Prep Anytime, Anywhere',
    description: 'Access JAMB past questions offline and study at your own pace.',
    image: slide1Asset,
  },
  {
    id: '2',
    title: 'Understand, Improve',
    description: 'Get clear explanations and track your progress to know your weak areas.',
    image: slide2Asset,
  },
  {
    id: '3',
    title: 'Practice, Learn, Improve',
    description: 'Flexible practice with detailed explanations and insights to help you succeed.',
    image: slide3Asset,
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const completeOnboarding = async () => {
    try {
      await SecureStore.setItemAsync('has_onboarded_app', 'true');
      router.replace('/signup1'); 
    } catch (error) {
      router.replace('/signup1');
    }
  };

  const handleNextAction = () => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const renderSlideItem = ({ item }) => (
    <View style={styles.slideWrapper}>
      
      {/* LOGO IMAGE */}
      <View style={styles.logoContainer}>
        <Image 
          source={logoAsset} 
          style={styles.logoImageBrand}
          resizeMode="contain" 
        />
      </View>

      {/* HERO ILLUSTRATION IMAGE CONTAINER */}
      <View style={styles.illustrationImageFrame}>
        <Image 
          source={item.image} 
          style={styles.heroGraphicAsset}
          resizeMode="contain" 
        />
      </View>

      {/* PROGRESS BAR */}
      <View style={styles.segmentedProgressBarWrapper}>
        {ONBOARDING_SLIDES.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <View 
              key={index}
              style={[
                styles.progressLineSegment,
                isActive ? styles.segmentLineActive : styles.segmentLineInactive,
                { width: isActive ? 150 : 40 } // Progress Bar Effect: Active bar expands wider than inactive dots
              ]}
            />
          );
        })}
      </View>

      {/* ONBOARDING TEXT WRITE-UP DETAILS */}
      <View style={styles.textDetailsBlock}>
        <Text style={styles.headlineText}>{item.title}</Text>
        <Text style={styles.subtextDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* TOP SKIP CONTROLS: SKIP ONBOARDING TO AUTH */}
      <View style={styles.topControlActionRow}>
        <TouchableOpacity onPress={completeOnboarding} activeOpacity={0.7}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* HORIZONTAL SLIDER ENGINE */}
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlideItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        style={styles.flatListStyle}
      />

      {/* NEXT/GET STARTED BUTTON CONTAINER */}
      <View style={styles.footerActionContainer}>
        <TouchableOpacity 
          style={styles.outlineSubmitBtn} 
          activeOpacity={0.8}
          onPress={handleNextAction}
        >
          <Text style={styles.submitBtnText}>
            {activeIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F0F5FE',
  },
  topControlActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
    height: 44,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#3B82F6', 
    fontWeight: '500',
  },
  flatListStyle: {
    flex: 1,
  },
  slideWrapper: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center', 
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 34, 
    marginTop: -26,
    width: '100%',
    height: 70, 
    justifyContent: 'center',
  },
  logoImageBrand: {
    width: 280, 
    height: '120%',
  },
  illustrationImageFrame: {
    width: width - 8,
    height: 440, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 44,
  },
  heroGraphicAsset: {
    width: '100%',
    height: '100%',
  },
  
  segmentedProgressBarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,          
    marginTop: 8,
    marginBottom: 28,  
    width: '120%',
  },
  progressLineSegment: {
    height: 5,        
    borderRadius: 3,
  },
  segmentLineActive: {
    backgroundColor: '#3B82F6', 
  },
  segmentLineInactive: {
    backgroundColor: '#E5E7EB', 
  },

  textDetailsBlock: {
    alignItems: 'center',
    width: '100%',
  },
  headlineText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtextDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  footerActionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: '100%',
  },
  outlineSubmitBtn: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
  },
  submitBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
