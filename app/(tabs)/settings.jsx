import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StatusBar,
  Dimensions,
  Alert,
  BackHandler
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  // NAVIGATION SUB-SCREEN CONTROLLER
  const [activeSubScreen, setActiveSubScreen] = useState('menu');

  // INDEPENDENT COOLDOWN CHANNELS FOR EACH SWITCH (Toggles one at a time)
  const [questionUpdates, setQuestionUpdates] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [autoCheckUpdates, setAutoCheckUpdates] = useState(true);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(true);

  // ACCORDION DROPDOWN INDEX STATE
  const [expandedFaq, setExpandedFaq] = useState(null);

    // 🔑 THE EXACT NATIVE PHONE BACK BUTTON INTERCEPTOR LOGIC
  React.useEffect(() => {
    const handleHardwareBackPress = () => {
      // If the user is currently deep inside any sub-screen option menu...
      if (activeSubScreen !== 'menu') {
        setActiveSubScreen('menu'); // Smoothly close it and return to the main settings list
        return true; // "true" tells the phone: "Stop! I handled this back-click internally, do not switch tabs."
      }
      return false; // "false" tells the phone: "Go ahead and execute your default back navigation action."
    };

    // 1. Register the event listener with the phone operating system
    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress', 
      handleHardwareBackPress
    );

    // 2. 🔑 CRITICAL CLEANUP: Wipes the listener subscription when switching tabs to prevent memory leaks
    return () => {
      backSubscription.remove(); 
    };
  }, [activeSubScreen]); // Dependency array tracks sub-screen changes


  // LOGOUT GATEWAY HANDLER (CLEARS STORAGE & REDIRECTS TO SIGN-UP 1)
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to end your session?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive",
        onPress: () => {
          console.log("Session cleared from secure hardware registers.");
          router.replace('/signup1'); 
        }
      }
    ]);
  };

  // REUSABLE SUB-NAVBAR HEADER
  const renderSubHeader = (title) => (
    <View style={styles.navigationHeaderBarRow}>
      <TouchableOpacity onPress={() => setActiveSubScreen('menu')} activeOpacity={0.7} style={styles.backButtonTouchCircle}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.navigationHeaderTitleText}>{title}</Text>
      <View style={styles.headerSpacer} /> 
    </View>
  );

  const faqData = [
    { q: "How do I update my question bank?", a: "Go to 'Question Bank Settings' and select 'Download Update' to download new versions when you are online." },
    { q: "How do I reset my password?", a: "Log out of your account, click 'Forgotten Password?' on the login screen, and complete the 5-digit verification." },
    { q: "Can I use ExamPrep NG without internet?", a: "Yes, once your question data is fetched and updated, all practice features work 100% offline." },
    { q: "Why can't I download the latest question bank?", a: "Ensure you have at least 15MB of free storage and your 'Download over Wi-Fi only' toggle is turned off if on mobile data." },
    { q: "How is my performance calculated?", a: "Your analytics scorecard weights correct responses, accuracy, and aggregate response times dynamically on completion of any mock test session." }
  ];
    //  SCREEN 1: MAIN MENU 
  const RenderMainMenu = () => (
    <View style={styles.menuContainer}>
      <Text style={styles.sectionSalutation}>Welcome Back Joe!</Text>
      <Text style={styles.screenHeading}>Settings</Text>

      <View style={styles.listCardWrapper}>
        <TouchableOpacity style={styles.menuRowItem} onPress={() => setActiveSubScreen('notifications')}>
          <Text style={styles.menuRowText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRowItem} onPress={() => setActiveSubScreen('question_bank')}>
          <Text style={styles.menuRowText}>Question Bank</Text>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRowItem} onPress={() => setActiveSubScreen('help')}>
          <Text style={styles.menuRowText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuRowItem, styles.lastRowNoBorder]} onPress={handleLogout}>
          <Text style={[styles.menuRowText, styles.logoutTextDanger]}>Logout</Text>
          <Ionicons name="chevron-forward" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // SCREEN 2: NOTIFICATION SETTINGS 
  const RenderNotificationSettings = () => (
    <View style={styles.subScreenWrapper}>
      {renderSubHeader("Notification Settings")}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollSpacing}>
        
        <View style={styles.toggleSettingBlock}>
          <View style={styles.toggleLeftMeta}>
            <Text style={styles.toggleTitleText}>Question Bank Updates</Text>
            <Text style={styles.toggleDescriptionText}>Get notified when a new question bank is available to download.</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setQuestionUpdates(!questionUpdates)}
            style={[styles.customSwitchTrack, questionUpdates ? styles.customSwitchTrackActive : styles.customSwitchTrackInactive]}
          >
            <View style={[styles.customSwitchThumb, questionUpdates ? { left: 35, backgroundColor: '#FFFFFF' } : { left: 4, backgroundColor: '#2F6FED' }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleSettingBlock}>
          <View style={styles.toggleLeftMeta}>
            <Text style={styles.toggleTitleText}>App Updates</Text>
            <Text style={styles.toggleDescriptionText}>Receive notifications about important app improvements and bug fixes.</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setAppUpdates(!appUpdates)}
            style={[styles.customSwitchTrack, appUpdates ? styles.customSwitchTrackActive : styles.customSwitchTrackInactive]}
          >
            <View style={[styles.customSwitchThumb, appUpdates ? { left: 35, backgroundColor: '#FFFFFF' } : { left: 4, backgroundColor: '#2F6FED' }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleSettingBlock}>
          <View style={styles.toggleLeftMeta}>
            <Text style={styles.toggleTitleText}>Daily Practice Reminder</Text>
            <Text style={styles.toggleDescriptionText}>Receive a reminder to complete your daily practice.</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setDailyReminder(!dailyReminder)}
            style={[styles.customSwitchTrack, dailyReminder ? styles.customSwitchTrackActive : styles.customSwitchTrackInactive]}
          >
            <View style={[styles.customSwitchThumb, dailyReminder ? { left: 35, backgroundColor: '#FFFFFF' } : { left: 4, backgroundColor: '#2F6FED' }]} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  //  SCREEN 3: QUESTION BANK SETTINGS 
  const RenderQuestionBankSettings = () => (
    <View style={styles.subScreenWrapper}>
      {renderSubHeader("Question Bank Settings")}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollSpacing}>
        
        <View style={styles.toggleSettingBlock}>
          <View style={styles.toggleLeftMeta}>
            <Text style={styles.toggleTitleText}>Auto-check for Updates</Text>
            <Text style={styles.toggleDescriptionText}>Automatically check for new question bank versions when you're online.</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setAutoCheckUpdates(!autoCheckUpdates)}
            style={[styles.customSwitchTrack, autoCheckUpdates ? styles.customSwitchTrackActive : styles.customSwitchTrackInactive]}
          >
            <View style={[styles.customSwitchThumb, autoCheckUpdates ? { left: 35, backgroundColor: '#FFFFFF' } : { left: 4, backgroundColor: '#2F6FED' }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleSettingBlock}>
          <View style={styles.toggleLeftMeta}>
            <Text style={styles.toggleTitleText}>Download over Wi-Fi only</Text>
            <Text style={styles.toggleDescriptionText}>Help reduce mobile data usage when downloading updates.</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setDownloadWifiOnly(!downloadWifiOnly)}
            style={[styles.customSwitchTrack, downloadWifiOnly ? styles.customSwitchTrackActive : styles.customSwitchTrackInactive]}
          >
            <View style={[styles.customSwitchThumb, downloadWifiOnly ? { left: 35, backgroundColor: '#FFFFFF' } : { left: 4, backgroundColor: '#2F6FED' }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.metaDataSpecsBox}>
          <Text style={styles.metaBoxTitleHeadingText}>Current Question Bank</Text>
          <View style={styles.metaInlineDataRow}><Text style={styles.metaLabelLeft}>Version:</Text><Text style={styles.metaValueRight}>v1.0.0</Text></View>
          <View style={styles.metaInlineDataRow}><Text style={styles.metaLabelLeft}>Last Updated:</Text><Text style={styles.metaValueRight}>08/08/26</Text></View>
        </View>

        <View style={styles.updateAvailableBannerBox}>
          <Text style={styles.updateBannerHeadlineTitleText}>Question Bank Update Available!</Text>
          <View style={styles.metaInlineDataRow}><Text style={styles.metaLabelLeft}>Version:</Text><Text style={styles.metaValueRight}>v1.2.0</Text></View>
          <Text style={styles.whatsNewHeadingText}>What's New:</Text>
          <Text style={styles.bulletItemText}>• Added 2026 JAMB Questions</Text>
          <Text style={styles.bulletItemText}>• Updated Answer Explanations</Text>
          <Text style={styles.bulletItemText}>• Improved Question Categorization</Text>
          <Text style={styles.bulletItemText}>• Performance Improvements</Text>
          <View style={[styles.metaInlineDataRow, { marginTop: 14 }]}><Text style={styles.metaLabelLeft}>Download Size:</Text><Text style={styles.metaValueRight}>15MB</Text></View>
          <TouchableOpacity style={styles.downloadBlueButton} activeOpacity={0.8} onPress={() => Alert.alert("Success", "Question bank updated offline successfully!")}>
            <Text style={styles.downloadBlueButtonText}>Download Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
    //  SCREEN 4: HELP & SUPPORT 
  const RenderHelpSupport = () => (
    <View style={styles.subScreenWrapper}>
      {renderSubHeader("Help & Support")}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollSpacing}>
        
        <View style={styles.helpSearchWrapperRow}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIconGap} />
          <TextInput placeholder="Search FAQs..." placeholderTextColor="#9CA3AF" style={styles.helpSearchInputField} />
        </View>

        <Text style={styles.faqSectionHeadingText}>Frequently Asked Questions</Text>

        {faqData.map((faq, index) => {
          const isExpanded = expandedFaq === index;
          return (
            <View key={index} style={styles.accordionContainerItem}>
              <TouchableOpacity style={styles.accordionHeaderButtonRow} activeOpacity={0.7} onPress={() => setExpandedFaq(isExpanded ? null : index)}>
                <Text style={styles.faqQuestionText}>{faq.q}</Text>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color="#374151" />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.accordionBodyContentBox}>
                  <Text style={styles.faqAnswerText}>{faq.a}</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.supportContactGridFooterBox}>
          <Text style={styles.supportNeedMoreHelpTitleText}>Need More Help?</Text>
          <View style={styles.supportContactDataInlineRow}><Text style={styles.supportContactLabelLeft}>Customer Support</Text><Text style={styles.supportContactValueLinkRight}>support@examprep.ng</Text></View>
          <View style={styles.supportContactDataInlineRow}><Text style={styles.supportContactLabelLeft}>WhatsApp</Text><Text style={styles.supportContactValueLinkRight}>+234 909 222 4444</Text></View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainerCanvasLayoutWrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {activeSubScreen === 'menu' && RenderMainMenu()}
      {activeSubScreen === 'notifications' && RenderNotificationSettings()}
      {activeSubScreen === 'question_bank' && RenderQuestionBankSettings()}
      {activeSubScreen === 'help' && RenderHelpSupport()}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainerCanvasLayoutWrapper: { flex: 1, backgroundColor: '#FFFFFC' },
  scrollSpacing: { paddingBottom: 110 },
  headerSpacer: { width: 24 },
  searchIconGap: { marginRight: 10 },
  
  menuContainer: { paddingHorizontal: 24, paddingTop: 30 },
  sectionSalutation: { fontSize: 16, color: '#6B7280', fontWeight: '700' },
  screenHeading: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 12, marginBottom: 13 },
  listCardWrapper: { borderColor: '#F3F4F6', borderRadius: 14 },
  menuRowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 76, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  lastRowNoBorder: { borderBottomWidth: 0 },
  menuRowText: { fontSize: 15, fontWeight: '500', color: '#111827' },
  logoutTextDanger: { color: '#EF4444', fontWeight: '600' },

  subScreenWrapper: { flex: 1 },
  navigationHeaderBarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 86, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  backButtonTouchCircle: { padding: 4 },
  navigationHeaderTitleText: { fontSize: 16, fontWeight: 'bold', color: '#111827' },

  toggleSettingBlock: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28, paddingVertical: 35, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  toggleLeftMeta: { flex: 1, paddingRight: 16 },
  toggleTitleText: { fontSize: 15, fontWeight: '600', color: '#111827' },
  toggleDescriptionText: { fontSize: 12, color: '#6B7280', lineHeight: 18, marginTop: 4 },

  customSwitchTrack: {
    width: 64,
    height: 34,
    borderRadius: 25,
    position: 'relative',
    justifyContent: 'center',
  },
  customSwitchTrackActive: { backgroundColor: '#1458E1' },   
  customSwitchTrackInactive: { backgroundColor: '#F4F8FE' }, 
  
  customSwitchThumb: {
    width: 25,
    height: 25,
    borderRadius: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },

  metaDataSpecsBox: { backgroundColor: '#F9FAFB', marginHorizontal: 24, marginTop: 24, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  metaBoxTitleHeadingText: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
  metaInlineDataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaLabelLeft: { fontSize: 13, color: '#6B7280' },
  metaValueRight: { fontSize: 13, fontWeight: '600', color: '#111827' },

  updateAvailableBannerBox: { marginHorizontal: 24, marginTop: 20, borderRadius: 12, padding: 16, borderWidth: 1.5, borderColor: '#DBEAFE', backgroundColor: '#EFF6FF' },
  updateBannerHeadlineTitleText: { fontSize: 14, fontWeight: 'bold', color: '#1E40AF', marginBottom: 12 },
  whatsNewHeadingText: { fontSize: 13, fontWeight: '600', color: '#1E40AF', marginTop: 12, marginBottom: 6 },
  bulletItemText: { fontSize: 13, color: '#1E40AF', lineHeight: 18, marginLeft: 4, marginBottom: 2 },
  downloadBlueButton: { backgroundColor: '#3B82F6', width: '100%', height: 46, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  downloadBlueButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  helpSearchWrapperRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', height: 46, borderRadius: 10, marginHorizontal: 24, marginTop: 20, paddingHorizontal: 14, marginBottom: 20 },
  helpSearchInputField: { flex: 1, height: '100%', color: '#111827', fontSize: 14 },
  faqSectionHeadingText: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginHorizontal: 24, marginBottom: 12 },
  accordionContainerItem: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#F3F4F6', marginHorizontal: 24 },
  accordionHeaderButtonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  faqQuestionText: { fontSize: 14, color: '#111827', fontWeight: '500', flex: 0.95 },
  accordionBodyContentBox: { paddingBottom: 16, paddingRight: 8 },
  faqAnswerText: { fontSize: 13, color: '#6B7280', lineHeight: 18 },

  supportContactGridFooterBox: { marginTop: 32, marginHorizontal: 24, borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 20, paddingBottom: 40 },
  supportNeedMoreHelpTitleText: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 14 },
  supportContactDataInlineRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  supportContactLabelLeft: { fontSize: 13, color: '#6B7280' },
  supportContactValueLinkRight: { fontSize: 13, fontWeight: '600', color: '#3B82F6' }
});
