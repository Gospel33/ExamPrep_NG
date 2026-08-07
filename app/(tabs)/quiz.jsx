import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Alert,
  BackHandler,
  Modal,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { authService, questionsService, practiceService, bookmarksService } from '../../lib/api';

const { width } = Dimensions.get('window');

// 14 Core JAMB Subjects mapped directly from your Onboarding parameters schema
const ALL_AVAILABLE_SUBJECTS = [
  'English', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Literature', 
  'Commerce', 'Government', 'CRS', 'IRS', 'Computer Studies', 
  'Business Studies', 'History', 'Geography', 'Economics'
];

const quizTimer = require('../../assets/images/quiz_timer.png')
const stPractice = require('../../assets/images/practice_icon.png')
const noTimer = require('../../assets/images/no_timer.png')

const EXAM_YEARS_LIST = Array.from({ length: 15 }, (_, i) => String(2024 - i)); // Terminates precisely at 2024
const QUESTION_COUNTS_LIST = Array.from({ length: 21 }, (_, i) => i + 5); // Terminates at 25 per subject

// The backend requires durationMinutes to be exactly one of 10/15/25/45/60 -
// there is no "untimed" value it accepts. "No Timer" is mapped to 60 here so
// the API call stays valid, while the UI still displays "Untimed" locally
// via formatClockDisplayString(). Ask the backend team for a real untimed
// option (e.g. durationMinutes: null) if this matters for your product.
const DURATION_TO_MINUTES = { 'No Timer': 60, '10 Mins': 10, '15 Mins': 15 };

const subjectIdFor = (subject) => {
  const mapping = {
    English: 'English',
    Biology: 'Biology',
    Physics: 'Physics',
    Chemistry: 'Chemistry',
    Mathematics: 'Mathematics',
    Literature: 'Literature',
    Commerce: 'Commerce',
    Government: 'Government',
    CRS: 'CRS',
    IRS: 'IRS',
    'Computer Studies': 'Computer Studies',
    'Business Studies': 'Business Studies',
    History: 'History',
    Geography: 'Geography',
    Economics: 'Economics',
  };
  return mapping[subject] ?? subject;
};

const getFirstName = (profile) => {
  const name = profile?.firstName ?? profile?.fullName ?? profile?.name;
  return name ? String(name).split(' ')[0] : '';
};

export default function PracticeScreen() {
  // ROUTER CONTROLLER INTERNAL TRACKER STATES
  const [currentScreen, setCurrentScreen] = useState('landing');

  // USER CONFIGURATION VARIABLES HOOKS
  const [selectedSubjects, setSelectedSubjects] = useState(['Mathematics', 'Biology', 'Chemistry']);
  const [examYear, setExamYear] = useState('2021');
  const [questionCount, setQuestionCount] = useState(10); // Questions requested *per subject*
  const [practiceDuration, setPracticeDuration] = useState('10 Mins'); 

  // MODAL ACCORDION SHEETS VISIBILITY LOG FLAGS
  const [isYearModalVisible, setIsYearModalVisible] = useState(false);
  const [isCountModalVisible, setIsQuestionModalVisible] = useState(false);
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);

  // RUNTIME EXAM SESSION REGISTER BUFFERS
  const [activeSessionQuestions, setActiveSessionQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userSelectedOptions, setUserSelectedOptions] = useState({}); 
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [isTimerActive, setIsTimerRunning] = useState(false);

  // BACKEND SESSION + NETWORK STATE
  const [practiceSessionId, setPracticeSessionId] = useState(null);
  const [isStartingPractice, setIsStartingPractice] = useState(false);
  const [isSubmittingPractice, setIsSubmittingPractice] = useState(false);
  const [practiceResult, setPracticeResult] = useState(null); // backend-confirmed score data

  // REVIEW CHANNELS METRIC MEMORY POINTERS
  const [reviewFilterTab, setReviewFilterTab] = useState('all'); 
  const [selectedReviewQuestion, setSelectedReviewQuestion] = useState(null);

  const [reviewIndexPointer, setReviewIndexPointer] = useState(0); // 🔑 New pointer tracker
  const [userFirstName, setUserFirstName] = useState('');


  // ANDROID HARDWARE BACK-CLICK / IPHONE SWIPE GESTURE CAPTURE MECHANISM
  useEffect(() => {
    const handleHardwareBack = () => {
      if (currentScreen === 'review_detail') { setCurrentScreen('review_list'); return true; }
      if (currentScreen === 'review_list') { setCurrentScreen('summary'); return true; }
      if (currentScreen === 'summary') { setCurrentScreen('landing'); return true; }
      if (currentScreen === 'quiz') {
        Alert.alert("Exit Test", "Quit this active practice session?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", style: "destructive", onPress: () => { setIsTimerRunning(false); setCurrentScreen('setup2'); } }
        ]);
        return true;
      }
      if (currentScreen === 'setup2') { setCurrentScreen('setup1'); return true; }
      if (currentScreen === 'setup1') { setCurrentScreen('landing'); return true; }
      return false;
    };
    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => backSubscription.remove();
  }, [currentScreen]);
    // LIVE TIMER TICK CLOCK INTERVAL SUBSCRIPTION 
  useEffect(() => {
    if (!isTimerActive || practiceDuration === 'No Timer' || secondsRemaining <= 0) {
      if (secondsRemaining === 0 && isTimerActive) {
        setIsTimerRunning(false);
        handleFinishPractice();
      }
      return;
    }
    const intervalId = setInterval(() => { setSecondsRemaining(prev => prev - 1); }, 1000);
    return () => clearInterval(intervalId);
  }, [isTimerActive, secondsRemaining, practiceDuration]);

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const [settingsResponse, profileResponse] = await Promise.all([
          authService.getSettings().catch(() => null),
          authService.getProfile().catch(() => null),
        ]);

        const settings = settingsResponse ?? profileResponse ?? {};
        const profile = profileResponse ?? settingsResponse ?? {};

        const preferredSubjects = settings?.preferredSubjects;
        const preferredExamType = settings?.preferredExamType;
        const name = getFirstName(profile);

        if (Array.isArray(preferredSubjects) && preferredSubjects.length > 0) {
          setSelectedSubjects(preferredSubjects);
        }

        if (preferredExamType && preferredExamType.toLowerCase() === 'random') {
          setExamYear('random');
        }

        if (name) {
          setUserFirstName(name);
        }
      } catch (error) {
        console.log('Failed to load user preferences:', error?.message || error);
      }
    };

    loadUserPreferences();
  }, []);

  // 🔑 STARTS THE REAL BACKEND SESSION, THEN FETCHES + HYDRATES REAL QUESTIONS
  const initializeCbtSessionRuntimeDataset = async () => {
    setIsStartingPractice(true);
    try {
      const durationMinutes = DURATION_TO_MINUTES[practiceDuration] || 10;
      // const yearPayload = examYear === 'random' ? 'random' : Number(examYear);

      // if (examYear !== 'random' && Number.isNaN(yearPayload)) {
      //   throw new Error('Selected year is not valid.');
      // }

      // 1. Create the tracked session on the backend.
      // If the backend session creation fails (for example due to the subject
      // filter shape), we still want the practice flow to proceed locally.
      let sessionId = null;
      try {
        const startResponse = await practiceService.start({
          subjects: selectedSubjects,
          durationMinutes,
          // year: yearPayload,
        });
        sessionId = startResponse?.id ?? startResponse?.data?.id;
        if (sessionId) {
          setPracticeSessionId(sessionId);
        } else {
          console.log('practiceService.start returned no session id:', startResponse);
          Alert.alert('Practice Note', 'Could not create a backend practice session, but your questions will still load locally.');
        }
      } catch (startError) {
        console.log('Practice start failed, continuing with local questions:', startError?.response?.data || startError?.message || startError);
        Alert.alert('Practice Note', 'Could not create a backend practice session, but your questions will still load locally.');
      }

      // 2. Fetch full questions per subject directly; the list endpoint already
      // returns options/correctOption/explanation/tip.
      const perSubjectResults = await Promise.all(
        selectedSubjects.map((subject) =>
          questionsService.getQuestions({ subjectId: subjectIdFor(subject), limit: questionCount })
        )
      );
      const rawQuestions = perSubjectResults.flatMap((res) => res?.data?.questions || []);

if (rawQuestions.length === 0) {
  throw new Error('No questions were found for the selected subjects/year. Try a different year or fewer questions.');
}

// Transform into the shape the rest of this screen expects:
// { id, subject, text, options: [{key, text}], correctAnswer }
const transformed = rawQuestions.map((q) => ({
  id: q.id,
  subject: selectedSubjects.find((s) => subjectIdFor(s) === q.subjectId) || q.subjectId,
  text: q.questionText,
  options: Object.entries(q.options || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, text]) => ({ key, text })),
  correctAnswer: q.correctOption,
  explanation: q.explanation,
  tip: q.tip,
  questionImage: q.questionImage,
}));

setActiveSessionQuestions(transformed);

      if (practiceDuration === 'No Timer') {
        setSecondsRemaining(-1);
      } else {
        setSecondsRemaining(durationMinutes * 60);
      }

      setActiveQuestionIndex(0);
      setUserSelectedOptions({});
      setPracticeResult(null);
      setIsTimerRunning(true);
      setCurrentScreen('quiz');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Could not start practice. Please try again.';
      Alert.alert('Unable to Start Practice', message);
    } finally {
      setIsStartingPractice(false);
    }
  };

  // 🔑 SUBMITS THE SESSION TO THE BACKEND FOR AN AUTHORITATIVE SCORE
  const handleFinishPractice = async () => {
    if (!practiceSessionId) {
      // Shouldn't happen in normal flow, but fail safe into the summary
      // screen using local computation rather than getting stuck.
      setCurrentScreen('summary');
      return;
    }

    setIsSubmittingPractice(true);
    try {
      const answers = Object.entries(userSelectedOptions).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const submitResponse = await practiceService.submit(practiceSessionId, { answers });
      // Documented shape: { score, correctAnswers, wrongAnswers, percentage }
      setPracticeResult(submitResponse?.data || null);
    } catch (error) {
      const message = error?.response?.data?.message || 'Could not submit your practice session. Showing locally-computed results instead.';
      Alert.alert('Submit Failed', message);
      setPracticeResult(null); // Summary screen falls back to local computation below
    } finally {
      setIsSubmittingPractice(false);
      setCurrentScreen('summary');
    }
  };

  // Fire-and-forget autosave - doesn't block the UI, logs quietly on failure
  const autosaveCurrentAnswer = (questionId, selectedOption) => {
    if (!practiceSessionId) return;
    practiceService
      .autosave(practiceSessionId, {
        questionId,
        selectedOption,
        timeRemaining: secondsRemaining,
      })
      .catch((err) => console.log('autosave failed (non-blocking):', err?.message));
  };

  const formatClockDisplayString = () => {
    if (practiceDuration === 'No Timer') return "Untimed";
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleSubjectListFromModalRegistry = (subjectName) => {
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length === 1) return Alert.alert('Required', 'Keep at least one subject active.');
      setSelectedSubjects(prev => prev.filter(s => s !== subjectName));
    } else {
      setSelectedSubjects(prev => [...prev, subjectName]);
    }
  };

  // ==================== SCREEN 1: PRACTICE LANDING DASHBOARD ====================
  const RenderPracticeLanding = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollSpacing}>
      <Text style={styles.sectionSalutation}>{`Welcome Back ${userFirstName || 'Student'}!`}</Text>
      <Text style={styles.screenHeading}>Practice</Text>
      <View style={styles.searchWrapperRow}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIconGap} />
        <TextInput placeholder="Search topics, questions..." placeholderTextColor="#9CA3AF" style={styles.searchInputField} />
      </View>
      <Text style={styles.globalSectionHeadingTitleText}>Self-Paced Practice</Text>
      <TouchableOpacity style={styles.startCustomPracticeBigBlueCard} activeOpacity={0.9} onPress={() => setCurrentScreen('setup1')}>
        <View style={styles.cardLeftContentBlock}>
          <View style={styles.iconCircleWhiteBackplate}>
            <Image 
              source={stPractice}
              style={{width: 48, height: 58,alignItems: 'center', marginRight: 2, marginTop: 22}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.cardTextMetadataGroup}>
            <Text style={styles.cardBigTitleText}>Start Custom Practice</Text>
            <Text style={styles.cardSubDescriptionText}>Customize your practice by choosing your subjects, duration, difficulty, and question count.</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
    // ==================== SCREEN 2: PRACTICE SETUP I (CUSTOMIZE) ====================
  const RenderPracticeSetup1 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cleanCanvasScrollPadding}>
      <TouchableOpacity onPress={() => setCurrentScreen('landing')} style={styles.minimalBackArrowFrame} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.customizePracticeHeadingText}>Customize your practice</Text>

      <Text style={styles.wireframeFieldLabelText}>1. Select the subjects you'd like to practice</Text>
      <View style={styles.chipGridWrapperLayout}>
        {selectedSubjects.map((subject) => (
          <TouchableOpacity key={subject} onPress={() => toggleSubjectListFromModalRegistry(subject)} style={[styles.setup1SubjectBubbleChip, styles.setup1SubjectBubbleChipActive]}>
            <Text style={[styles.setup1ChipTextLabel, styles.setup1ChipTextLabelActive]}>{subject}</Text>
          </TouchableOpacity>
        ))}
        {/* "+ Add Another" launches the 14-subject sheet overlay */}
        <TouchableOpacity style={styles.setup1AddAnotherDottedBtn} activeOpacity={0.7} onPress={() => setIsSubjectModalVisible(true)}>
          <Text style={styles.setup1AddAnotherText}>Add Another +</Text>
        </TouchableOpacity>
      </View>

      {/**
      <Text style={styles.wireframeFieldLabelText}>2. Exam Year</Text>
      <TouchableOpacity style={styles.mockSelectorDropdownRowBox} activeOpacity={0.8} onPress={() => setIsYearModalVisible(true)}>
        <Text style={styles.setup1DropdownValueStringText}>{examYear}</Text><Ionicons name="chevron-down" size={18} color="#4B5563" />
      </TouchableOpacity>
      */}

      <Text style={styles.wireframeFieldLabelText}>2. Number of Questions</Text>
      <TouchableOpacity style={styles.mockSelectorDropdownRowBox} activeOpacity={0.8} onPress={() => setIsQuestionModalVisible(true)}>
        <Text style={styles.setup1DropdownValueStringText}>{`${questionCount} Questions per Subject`}</Text><Ionicons name="chevron-down" size={18} color="#4B5563" />
      </TouchableOpacity>

      <Text style={styles.wireframeFieldLabelText}>4. Preferred Practice Duration</Text>
      <View style={styles.setup1DurationTilesRowGrid}>
        {['No Timer', '10 Mins', '15 Mins'].map((timeValue) => {
          const isTimeActive = practiceDuration === timeValue;
          return (
            <TouchableOpacity key={timeValue} onPress={() => setPracticeDuration(timeValue)} style={[styles.setup1DurationTileCardBox, isTimeActive && styles.setup1DurationTileCardBoxActive]}>
              <Text style={[styles.durationValueTitleText, isTimeActive && styles.durationValueTitleTextActive]}>{timeValue}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.setup1PrimaryBlueSubmitButton} activeOpacity={0.8} onPress={() => setCurrentScreen('setup2')}><Text style={styles.setup1PrimarySubmitButtonText}>Continue to Practice</Text></TouchableOpacity>
    </ScrollView>
  );

  // ==================== SCREEN 3: PRACTICE SETUP II (REVIEW PRE-EXAM) ====================
  const RenderPracticeSetup2 = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cleanCanvasScrollPadding}>
      <TouchableOpacity onPress={() => setCurrentScreen('setup1')} style={styles.minimalBackArrowFrame} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.customizePracticeHeadingText}>Review Your Setup</Text>

      <View style={styles.setup2SubjectsListSummaryCardBox}>
        <View style={styles.setup2RowLabelTitleLine}>
          <Text style={styles.setup2CardHeadingLabelText}>Selected Subject (s)</Text>
          <TouchableOpacity onPress={() => setCurrentScreen('setup1')}><Octicons name="pencil" size={16} color="#9CA3AF" /></TouchableOpacity>
        </View>
        {selectedSubjects.map((sub, idx) => <Text key={idx} style={styles.setup2VerticalSubjectNameRowText}>{sub}</Text>)}
      </View>

      <View style={styles.setup2MetadataBlockCardRowItem}>
        <View style={styles.setup2LeftMetaGroup}>
          <Ionicons name="book-outline" size={18} color="#15803D" style={styles.searchIconGap} />
          <View>
            <Text style={styles.setup2MetaLabelTitleText}>Total Questions Matrix</Text>
            <Text style={styles.setup2MetaValueResultValueText}>{`${selectedSubjects.length} × ${questionCount} = ${selectedSubjects.length * questionCount} Questions`}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setCurrentScreen('setup1')}><Octicons name="pencil" size={16} color="#9CA3AF" /></TouchableOpacity>
      </View>

      <View style={styles.setup2MetadataBlockCardRowItem}>
        <View style={styles.setup2LeftMetaGroup}>
          <Ionicons name="time-outline" size={18} color="#2563EB" style={styles.searchIconGap} /><View><Text style={styles.setup2MetaLabelTitleText}>Duration</Text><Text style={styles.setup2MetaValueResultValueText}>{practiceDuration}</Text></View>
        </View>
        <TouchableOpacity onPress={() => setCurrentScreen('setup1')}><Octicons name="pencil" size={16} color="#9CA3AF" /></TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.setup2PrimaryBlueSubmitButton, isStartingPractice && styles.disabledSubmitButton]}
        activeOpacity={0.8}
        onPress={initializeCbtSessionRuntimeDataset}
        disabled={isStartingPractice}
      >
        {isStartingPractice ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.setup2PrimarySubmitButtonText}>Start Practice</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
    // ==================== SCREEN 4: LIVE PRACTICE QUIZ ENGINE ====================
  const RenderQuizPage = () => {
    if (activeSessionQuestions.length === 0) return <View style={styles.quizMasterFlexLayoutViewport} />;
    const currentQuestion = activeSessionQuestions[activeQuestionIndex];
    const selectedOption = userSelectedOptions[currentQuestion.id] || null;
    const isLastQuestion = activeQuestionIndex === activeSessionQuestions.length - 1;

    return (
      <View style={styles.quizMasterFlexLayoutViewport}>
        <View style={styles.quizHeaderBarActionRow}>
          <TouchableOpacity onPress={() => { setIsTimerRunning(false); setCurrentScreen('setup2'); }}><Text style={styles.quizExitButtonLabelText}>End Practice</Text></TouchableOpacity>
          <View style={styles.quizClockCounterBadgeBox}>
            <Image 
              source={quizTimer}
              style={{width: 18, alignItems: 'center', marginRight: 5, marginTop: 2}}
              resizeMode="contain"
            />
            <Text style={styles.quizClockCounterValueText}>{formatClockDisplayString()}</Text>
            </View>
        </View>
        <ScrollView contentContainerStyle={styles.quizQuestionsScrollPaddingLayer} showsVerticalScrollIndicator={false}>
          <Text style={styles.quizQuestionNumberTitleText}>{`Question ${activeQuestionIndex + 1} of ${activeSessionQuestions.length} • ${currentQuestion.subject}`}</Text>
          <Text style={styles.quizQuestionMainStemContentText}>{currentQuestion.text}</Text>
          {currentQuestion.options.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => {
                setUserSelectedOptions(prev => ({ ...prev, [currentQuestion.id]: opt.key }));
                autosaveCurrentAnswer(currentQuestion.id, opt.key);
              }}
              style={[styles.quizOptionBubbleRowBox, selectedOption === opt.key && styles.quizOptionBubbleRowBoxActive]}
            >
              <Text style={styles.quizOptionMainBodyStringText}>{`${opt.key}. ${opt.text}`}</Text>
              <View style={[styles.quizRadioOuterCircleRing, selectedOption === opt.key && styles.quizRadioOuterCircleRingActive]}><View style={selectedOption === opt.key && styles.quizRadioInnerCirclePointDotActive} /></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.quizStickyBottomNavBarRow}>
          <TouchableOpacity style={[styles.quizNavArrowBtnSquareEdgeButton, activeQuestionIndex === 0 && styles.disabledArrowButton]} disabled={activeQuestionIndex === 0} onPress={() => setActiveQuestionIndex(prev => prev - 1)}><Ionicons name="chevron-back" size={20} color={activeQuestionIndex === 0 ? "#9CA3AF" : "#2563EB"} /></TouchableOpacity>
          <Text style={styles.quizFooterPageCounterText}>{`${activeQuestionIndex + 1} of ${activeSessionQuestions.length}`}</Text>
          <TouchableOpacity
            style={styles.quizSubmitActiveRectangleButton}
            disabled={isSubmittingPractice}
            onPress={() => {
              if (isLastQuestion) {
                setIsTimerRunning(false);
                handleFinishPractice();
              } else {
                setActiveQuestionIndex(prev => prev + 1);
              }
            }}
          >
            {isSubmittingPractice && isLastQuestion ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.quizSubmitTextStringLabelText}>{isLastQuestion ? 'Submit' : 'Next'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
    // ==================== SCREEN 5: FINAL SCORE SUMMARY REPORT VIEW ====================
  const RenderPracticeSummary = () => {
    let globalCorrectScoreCount = 0;
    let scoresMapBySubject = {};

    selectedSubjects.forEach(sub => { scoresMapBySubject[sub] = { total: 0, correct: 0 }; });

    activeSessionQuestions.forEach(q => {
      const chosen = userSelectedOptions[q.id];
      const isCorrect = chosen === q.correctAnswer;
      if (isCorrect) globalCorrectScoreCount++;

      if (scoresMapBySubject[q.subject]) {
        scoresMapBySubject[q.subject].total++;
        if (isCorrect) scoresMapBySubject[q.subject].correct++;
      }
    });

    // Prefer the backend-confirmed score from /submit when available - the
    // per-subject breakdown below still uses local computation since submit
    // only returns an aggregate (score, correctAnswers, wrongAnswers,
    // percentage), not a per-subject split.
    const displayedCorrectCount = practiceResult?.correctAnswers ?? globalCorrectScoreCount;
    const displayedTotalCount = activeSessionQuestions.length;

    // 🎨 UNIQUE BRAND COLORS ASSIGNED PER SUBJECT REGISTER 
    const SUBJECT_BRAND_COLORS = {
      'English': '#1B6E45',      
      'Biology': '#FFC229',      
      'Chemistry': '#C03221',    
      'Mathematics': '#2F6FED',  
      'Physics': '#0d6a7a',      
      'Literature': '#8e1954',   
      'Economics': '#059669',    
      'Government': '#4B5563'    
    };

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollSpacing}>
        <Text style={styles.screenHeadingCenter}>Practice Summary</Text>
        
        <View style={styles.radialScoreRingCenteringFrame}>
          <View style={styles.radialOuterCircleTrack}>
            <Text style={styles.radialScoreBigValueText}>{`${displayedCorrectCount} / ${displayedTotalCount}`}</Text>
            <Text style={styles.radialScoreSubCongratsLabelText}>{`Well done ${userFirstName || 'Student'}!`}</Text>
            <Text style={styles.radialFinishedDescriptionText}>You've completed your practice.</Text>
          </View>
        </View>
        
        <Text style={styles.globalSectionHeadingTitleText}>Practice Breakdown</Text>
        
        <View style={styles.summarySubjectsMetersCardContainer}>
          {selectedSubjects.map((subjectName) => {
            const stats = scoresMapBySubject[subjectName] || { total: questionCount, correct: 0 };
            const percentageValue = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            const barFillColor = SUBJECT_BRAND_COLORS[subjectName] || '#2563EB';

            return (
              <View key={subjectName} style={styles.summaryBarRowLine}>
                <Text style={styles.summaryBarLabel} numberOfLines={1}>{subjectName}</Text>
                <View style={styles.summaryTrackBg}>
                  <View style={[styles.summaryFillFg, { width: `${percentageValue || 8}%`, backgroundColor: barFillColor }]} />
                </View>
                <Text style={styles.summaryBarPct}>{`${stats.correct}/${stats.total} (${percentageValue}%)`}</Text>
              </View>
            );
          })}
        </View>
        <TouchableOpacity style={styles.primaryActionButton} onPress={() => { setReviewFilterTab('all'); setCurrentScreen('review_list'); }}><Text style={styles.primaryActionBtnText}>Review Answers</Text></TouchableOpacity>
      </ScrollView>
    );
  };
    // ==================== SCREEN 6: DYNAMIC ANSWER REVIEW MASTER LIST ====================
  const RenderAnswerReviewList = () => {
    // 🔑 THE UPDATE: Reads dynamically from the active session questions array populated during setup
    const totalQuestionsCount = activeSessionQuestions.length;
    const correctItems = activeSessionQuestions.filter(q => userSelectedOptions[q.id] === q.correctAnswer);
    const incorrectItems = activeSessionQuestions.filter(q => userSelectedOptions[q.id] !== q.correctAnswer);

    // Switch dataset feeds on click based on tab filter tokens
    const displayDataset = reviewFilterTab === 'correct' ? correctItems : (reviewFilterTab === 'incorrect' ? incorrectItems : activeSessionQuestions);

    return (
      <View style={styles.containerFlex}>
        {/* HEADER BAR TRACK */}
        <View style={styles.reviewHeaderRowStickyBar}>
          <TouchableOpacity onPress={() => setCurrentScreen('summary')} style={styles.backTouchPadding}><Ionicons name="chevron-back" size={24} color="#111827" /></TouchableOpacity>
          <Text style={styles.reviewMainHeaderTitleText}>Answer Review</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* INTERACTIVE SCORE HOVER CARD BADGES */}
        <View style={styles.filterPillsTrackRow}>
          <TouchableOpacity onPress={() => setReviewFilterTab('all')} style={[styles.filterPillBadge, reviewFilterTab === 'all' && styles.filterPillBadgeActive]}>
            <Text style={[styles.filterPillText, reviewFilterTab === 'all' && styles.filterPillTextActive]}>{`All (${totalQuestionsCount})`}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReviewFilterTab('correct')} style={[styles.filterPillBadge, reviewFilterTab === 'correct' && styles.filterPillBadgeActive]}>
            <Text style={[styles.filterPillText, reviewFilterTab === 'correct' && styles.filterPillTextActive]}>{`Correct (${correctItems.length})`}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setReviewFilterTab('incorrect')} style={[styles.filterPillBadge, reviewFilterTab === 'incorrect' && styles.filterPillBadgeActive]}>
            <Text style={[styles.filterPillText, reviewFilterTab === 'incorrect' && styles.filterPillTextActive]}>{`Incorrect (${incorrectItems.length})`}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.reviewClickHelperHintText}>Tap question to view answer explanation</Text>

        {/* LIST RENDERS EXACTLY THE QUESTIONS GENERATED FOR THIS SESSION */}
        <ScrollView contentContainerStyle={styles.reviewListScrollPaddingTrack} showsVerticalScrollIndicator={false}>
          {displayDataset.map((item, index) => {
            const chosenKey = userSelectedOptions[item.id] || "Skipped";
            const isItemRight = chosenKey === item.correctAnswer;
            
            // Look up the accurate positional index within the main session list tracker
            const masterSessionIndex = activeSessionQuestions.findIndex(q => q.id === item.id);

            return (

              <TouchableOpacity 
                key={item.id + '-' + index} 
                style={styles.reviewQuestionCardTile} 
                onPress={() => { 
                  setSelectedReviewQuestion(item); 
                  setReviewIndexPointer(index); // 🔑 Save the exact list position index here!
                  setCurrentScreen('review_detail'); 
                }}
               >

                <View style={styles.cardInlineQuestionTextHeaderRow}>
                  <Ionicons 
                    name={isItemRight ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={isItemRight ? "#15803D" : "#DC2626"} 
                    style={{ marginRight: 8, marginTop: 2 }} 
                  />
                  <Text style={styles.cardQuestionBodyTruncatedSnippetText} numberOfLines={2}>
                    {`Q${masterSessionIndex + 1}. [${item.subject}] ${item.text}`}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </View>
                
                <View style={styles.cardInlineScoreMetaStatsRow}>
                  <Text style={styles.cardMetaLabelText}>{`Your Answer: ${chosenKey}`}</Text>
                  <Text style={[styles.cardMetaLabelText, { color: '#15803D', fontWeight: 'bold' }]}>
                    {`Correct Answer: ${item.correctAnswer}`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

    // ==================== SCREEN 7: FIXED CHRONOLOGICAL REVIEW ENGINE ====================
  const RenderAnswerExplanationDetailPanel = () => {
    // Compile our filtered group matching current filter constraints
    const correctItems = activeSessionQuestions.filter(q => userSelectedOptions[q.id] === q.correctAnswer);
    const incorrectItems = activeSessionQuestions.filter(q => userSelectedOptions[q.id] !== q.correctAnswer);
    const activeReviewPool = reviewFilterTab === 'correct' ? correctItems : (reviewFilterTab === 'incorrect' ? incorrectItems : activeSessionQuestions);
    
    // 🔑 Safely look up the current question directly from the pointer slot index
    const currentReviewItem = activeReviewPool[reviewIndexPointer];
    
    if (!currentReviewItem) return <View style={styles.containerFlex} />;

    const isLastReviewItem = reviewIndexPointer === activeReviewPool.length - 1;
    const targetCorrectOptionObject = currentReviewItem.options?.find(o => o.key === currentReviewItem.correctAnswer);
    const studentChosenKey = userSelectedOptions[currentReviewItem.id] || "Skipped";

    // 🔑 FIXED: Increments the index numerical value cleanly to advance duplicate entries perfectly
    const handleAdvanceNextReviewQuestion = () => {
      if (!isLastReviewItem) {
        setReviewIndexPointer(prev => prev + 1);
      } else {
        setCurrentScreen('review_list');
      }
    };

    return (
      <View style={styles.quizMasterFlexLayoutViewport}>
        <View style={styles.reviewHeaderRowStickyBar}>
          <TouchableOpacity onPress={() => setCurrentScreen('review_list')} style={styles.backTouchPadding}><Ionicons name="chevron-back" size={24} color="#111827" /></TouchableOpacity>
          <Text style={styles.reviewMainHeaderTitleText}>Answer Explanation</Text>
          <TouchableOpacity onPress={() => {
            if (currentReviewItem?.id) {
              bookmarksService.create(currentReviewItem.id)
                .then(() => Alert.alert("Saved", "Question saved to your bookmarks."))
                .catch((err) => Alert.alert("Could Not Bookmark", err?.response?.data?.message || 'Please try again.'));
            }
          }}>
            <Ionicons name="bookmark-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.explanationDeepDetailsScrollTrackPadding} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailsQuestionNumberTagTitle}>{`Question ${reviewIndexPointer + 1} of ${activeReviewPool.length} • ${currentReviewItem.subject}`}</Text>
          <Text style={styles.detailsMainQuestionStemBodyText}>{currentReviewItem.text}</Text>
          <View style={styles.correctAnswerNotificationBannerCellRow}><Ionicons name="checkmark-circle" size={16} color="#15803D" style={styles.searchIconGap} /><Text style={styles.correctAnswerNotificationBannerTextString}>{`Correct Answer: ${currentReviewItem.correctAnswer} (Your Pick: ${studentChosenKey})`}</Text></View>
          
          <View style={[styles.detailsOptionStaticCoreCardBox, { borderColor: '#2563EB', borderWidth: 1.5 }]}>
            <Text style={styles.detailsOptionStaticCardContentTextString}>{`${targetCorrectOptionObject?.key}. ${targetCorrectOptionObject?.text}`}</Text>
            <View style={styles.detailsOptionActiveCheckIndicatorDotCircle}><View style={styles.detailsOptionInnerActiveCheckIndicatorDotCircleCore} /></View>
          </View>
          
          <View style={styles.detailsExplanationTextBodyCardContainerBox}>
            <View style={styles.explanationSectionSubLabelHeadingTitleRow}><Ionicons name="document-text-outline" size={16} color="#2563EB" style={styles.searchIconGap} /><Text style={styles.explanationSectionSubLabelHeadingTitleText}>Answer Explanation</Text></View>
            <Text style={styles.explanationParagraphBodyContentStringText}>{`This question belongs to the core ${currentReviewItem.subject} curriculum dataset. Your choice of option ${studentChosenKey} has been recorded.`}</Text>
          </View>
        </ScrollView>
        
        {/* MATCHES THE EXPORT IMAGE FILE SPECIFICATIONS PIXEL-FOR-PIXEL */}
        <View style={styles.detailsStickyActionFooterRowContainer}>
          <TouchableOpacity style={styles.detailsPrimaryActionButtonBlueCapsule} onPress={handleAdvanceNextReviewQuestion}>
            <Text style={styles.detailsPrimaryActionButtonBlueCapsuleTextString}>
              {isLastReviewItem ? "Finish Review" : "Next Question"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.detailsOutlineActionButtonWhiteCapsule} 
            onPress={() => {
              if (currentReviewItem?.id) {
                bookmarksService.create(currentReviewItem.id)
                  .then(() => Alert.alert("Saved", "Question saved to your bookmarks."))
                  .catch((err) => Alert.alert("Could Not Bookmark", err?.response?.data?.message || 'Please try again.'));
              }
            }}
          >
            <Text style={styles.detailsOutlineActionButtonWhiteCapsuleTextString}>Save to Bookmark</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
    return (
    <SafeAreaView style={styles.mainContainerWrapperCanvas}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {currentScreen === 'landing' && RenderPracticeLanding()}
      {currentScreen === 'setup1' && RenderPracticeSetup1()}
      {currentScreen === 'setup2' && RenderPracticeSetup2()}
      {currentScreen === 'quiz' && RenderQuizPage()}
      {currentScreen === 'summary' && RenderPracticeSummary()}
      {currentScreen === 'review_list' && RenderAnswerReviewList()}
      {currentScreen === 'review_detail' && RenderAnswerExplanationDetailPanel()}

      {/**
      // EXAM YEAR OVERLAY MODAL
      <Modal visible={isYearModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBackdropOverlay} activeOpacity={1} onPress={() => setIsYearModalVisible(false)}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalHeadingTitle}>Select Exam Year</Text>
            <FlatList data={EXAM_YEARS_LIST} keyExtractor={(item) => item} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalListItemRow} onPress={() => { setExamYear(item); setIsYearModalVisible(false); }}><Text style={[styles.modalItemText, examYear === item && styles.modalItemTextActive]}>{item}</Text></TouchableOpacity>
            )}/>
          </View>
        </TouchableOpacity>
      </Modal>
      */}

      {/* QUESTIONS COUNT OVERLAY MODAL */}
      <Modal visible={isCountModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBackdropOverlay} activeOpacity={1} onPress={() => setIsQuestionModalVisible(false)}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalHeadingTitle}>Number of Questions per Subject</Text>
            <FlatList data={QUESTION_COUNTS_LIST} keyExtractor={(item) => String(item)} renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalListItemRow} onPress={() => { setQuestionCount(item); setIsQuestionModalVisible(false); }}><Text style={[styles.modalItemText, questionCount === item && styles.modalItemTextActive]}>{`${item} Questions`}</Text></TouchableOpacity>
            )}/>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* "+ ADD ANOTHER" SUBJECT MODAL SELECTION FILTER */}
      <Modal visible={isSubjectModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBackdropOverlay} activeOpacity={1} onPress={() => setIsSubjectModalVisible(false)}>
          <View style={[styles.modalContentCard, { maxHeight: '65%' }]}>
            <Text style={styles.modalHeadingTitle}>Add Practice Subjects</Text>
            <ScrollView contentContainerStyle={styles.chipGridWrapperLayout} showsVerticalScrollIndicator={false}>
              {ALL_AVAILABLE_SUBJECTS.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                return (
                  <TouchableOpacity key={subject} onPress={() => toggleSubjectListFromModalRegistry(subject)} style={[styles.setup1SubjectBubbleChip, isSelected && styles.setup1SubjectBubbleChipActive]}>
                    <Text style={[styles.setup1ChipTextLabel, isSelected && styles.setup1ChipTextLabelActive]}>{subject}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.setup1PrimaryBlueSubmitButton} onPress={() => setIsSubjectModalVisible(false)}><Text style={styles.setup1PrimarySubmitButtonText}>Done</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainerWrapperCanvas: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollSpacing: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 110 },
  searchIconGap: { marginRight: 10 },
  sectionSalutation: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  screenHeading: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 4, marginBottom: 24 },
  screenHeadingCenter: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginTop: 16, marginBottom: 24 },
  searchWrapperRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', height: 46, borderRadius: 10, paddingHorizontal: 14, marginBottom: 28 },
  searchInputField: { flex: 1, height: '100%', color: '#111827', fontSize: 14 },
  globalSectionHeadingTitleText: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  startCustomPracticeBigBlueCard: { backgroundColor: '#2563EB', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  cardLeftContentBlock: { flexDirection: 'row', alignItems: 'flex-start', flex: 0.92 },
  iconCircleWhiteBackplate: { width: 36, height: 38, borderRadius: 10, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardTextMetadataGroup: { flex: 1 },
  cardBigTitleText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  cardSubDescriptionText: { fontSize: 12, color: '#DBEAFE', lineHeight: 18, marginTop: 4 },
  recommendedTopicCardBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 14, padding: 18, marginBottom: 16 },
  topicCardTitleText: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  topicCardBodyText: { fontSize: 12, color: '#6B7280', lineHeight: 18, marginTop: 6, marginBottom: 12 },
  topicCardSpecsBadge: { fontSize: 12, color: '#3B82F6', fontWeight: '500' },
  outlineLaunchTopicButton: { borderWidth: 1, borderColor: '#3B82F6', borderRadius: 8, height: 38, justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  outlineLaunchButtonText: { color: '#3B82F6', fontSize: 14, fontWeight: '600' },
  cleanCanvasScrollPadding: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 110 },
  minimalBackArrowFrame: { width: 40, height: 40, justifyContent: 'center', marginBottom: 12 },
  customizePracticeHeadingText: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 28 },
  wireframeFieldLabelText: { fontSize: 13, fontWeight: 'bold', color: '#374151', marginTop: 18, marginBottom: 12 },
  chipGridWrapperLayout: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%' },
  setup1SubjectBubbleChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  setup1SubjectBubbleChipActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  setup1ChipTextLabel: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  setup1ChipTextLabelActive: { color: '#2563EB', fontWeight: '600' },
  setup1AddAnotherDottedBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderStyle: 'dashed', borderColor: '#2563EB' },
  setup1AddAnotherText: { fontSize: 13, color: '#2563EB', fontWeight: '500' },
  setup1SelectorDropdownRowBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', borderRadius: 8, height: 48, paddingHorizontal: 16 },
  setup1DropdownValueStringText: { fontSize: 14, color: '#111827', fontWeight: '500' },
  setup1DurationTilesRowGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  setup1DurationTileCardBox: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  setup1DurationTileCardBoxActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  durationValueTitleText: { fontSize: 14, fontWeight: 'bold', color: '#374151' },
  durationValueTitleTextActive: { color: '#2563EB' },
  durationValueSubtextLabelText: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  setup1PrimaryBlueSubmitButton: { backgroundColor: '#2563EB', width: '100%', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  setup1PrimarySubmitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  setup2SubjectsListSummaryCardBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 16 },
  setup2RowLabelTitleLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  setup2CardHeadingLabelText: { fontSize: 14, fontWeight: 'bold', color: '#4B5563', marginBottom: 12 },
  setup2VerticalSubjectNameRowText: { fontSize: 14, fontWeight: '500', color: '#111827', marginBottom: 8, marginLeft: 4 },
  setup2MetadataBlockCardRowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  setup2LeftMetaGroup: { flexDirection: 'row', alignItems: 'center' },
  setup2MetaLabelTitleText: { fontSize: 12, color: '#6B7280' },
  setup2MetaValueResultValueText: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  setup2PrimaryBlueSubmitButton: { backgroundColor: '#2563EB', width: '100%', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  setup2PrimarySubmitButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  quizMasterFlexLayoutViewport: { flex: 1, backgroundColor: '#FFFFFF', paddingBottom: 96 },
  quizHeaderBarActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, height: 60, borderBottomWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  quizExitButtonLabelText: { fontSize: 13, color: '#2563EB', fontWeight: '600' },
  quizClockCounterBadgeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quizClockCounterValueText: { fontSize: 14, color: '#111827', fontWeight: 'bold' },
  quizQuestionsScrollPaddingLayer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },quizQuestionNumberTitleText: { fontSize: 13, fontWeight: 'bold', color: '#6B7280', marginBottom: 10 },quizQuestionMainStemContentText: { fontSize: 15, color: '#111827', lineHeight: 22, fontWeight: '500', marginBottom: 24 },quizOptionBubbleRowBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, padding: 16, marginBottom: 12 },quizOptionBubbleRowBoxActive: { borderColor: '#2563EB', borderWidth: 2 },quizOptionMainBodyStringText: { flex: 0.9, fontSize: 13, color: '#374151', lineHeight: 18, fontWeight: '500' },quizRadioOuterCircleRing: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#9CA3AF', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },quizRadioOuterCircleRingActive: { borderColor: '#2563EB' },quizRadioInnerCirclePointDotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563EB' },quizStickyBottomNavBarRow: { position: 'absolute', bottom: 96, left: 0, right: 0, height: 68, borderTopWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24 },quizFooterPageCounterText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },quizNavArrowBtnSquareEdgeButton: { width: 38, height: 38, borderRadius: 6, borderWidth: 1, borderColor: '#DBEAFE', backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },quizNavArrowBtnSquareEdgeButtonActive: { width: 38, height: 38, borderRadius: 6, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },quizSubmitActiveRectangleButton: { width: 90, height: 38, borderRadius: 6, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },quizSubmitTextStringLabelText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },disabledArrowButton: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },disabledArrowButtonActive: { backgroundColor: '#E5E7EB' },disabledSubmitButton: { backgroundColor: '#E5E7EB' },modalBackdropOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },modalContentCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },modalHeadingTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 16, borderBottomWidth: 1, borderColor: '#F3F4F6', paddingBottom: 12 },modalListItemRow: { paddingVertical: 14, borderBottomWidth: 1, borderColor: '#F3F4F6' },modalItemText: { fontSize: 15, color: '#4B5563', fontWeight: '500' },modalItemTextActive: { color: '#2563EB', fontWeight: 'bold' },radialScoreRingCenteringFrame: { alignItems: 'center', marginTop: 8, marginBottom: 32 },radialOuterCircleTrack: { width: width * 0.55, height: width * 0.55, borderRadius: (width * 0.55) / 2, borderWidth: 6, borderColor: '#10B981', backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#10B981', shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },radialScoreBigValueText: { fontSize: 26, fontWeight: '800', color: '#111827' },radialScoreSubCongratsLabelText: { fontSize: 14, fontWeight: 'bold', color: '#10B981', marginTop: 8 },primaryActionButton: { backgroundColor: '#2563EB', width: '100%', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 12 },primaryActionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },reviewHeaderRowStickyBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60, borderBottomWidth: 1, borderColor: '#F3F4F6', backgroundColor: '#FFFFFF' },backTouchPadding: { padding: 4, paddingRight: 12 },reviewMainHeaderTitleText: { fontSize: 16, fontWeight: 'bold', color: '#111827' },filterPillsTrackRow: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, gap: 10, backgroundColor: '#FFFFFF' },filterPillBadge: { paddingHorizontal: 16, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },filterPillBadgeActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },filterPillText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },filterPillTextActive: { color: '#2563EB', fontWeight: '600' },reviewClickHelperHintText: { fontSize: 13, color: '#9CA3AF', paddingHorizontal: 20, marginTop: 14, marginBottom: 6 },reviewListScrollPaddingTrack: { paddingHorizontal: 20, paddingBottom: 110, paddingTop: 8 },reviewQuestionCardTile: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 12 },cardInlineQuestionTextHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' },cardQuestionBodyTruncatedSnippetText: { flex: 1, fontSize: 14, color: '#111827', fontWeight: '500', lineHeight: 20, paddingRight: 8 },cardInlineScoreMetaStatsRow: { flexDirection: 'row', gap: 16, marginTop: 12, borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 10 },cardMetaLabelText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },explanationDeepDetailsScrollTrackPadding: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 160 },detailsQuestionNumberTagTitle: { fontSize: 13, fontWeight: 'bold', color: '#6B7280', marginBottom: 10 },detailsMainQuestionStemBodyText: { fontSize: 15, color: '#111827', lineHeight: 22, fontWeight: '500', marginBottom: 20 },correctAnswerNotificationBannerCellRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },correctAnswerNotificationBannerTextString: { fontSize: 13, fontWeight: 'bold', color: '#15803D' },detailsOptionStaticCoreCardBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 20 },detailsOptionStaticCardContentTextString: { flex: 0.9, fontSize: 13, color: '#1E40AF', fontWeight: '600', lineHeight: 18 },detailsOptionActiveCheckIndicatorDotCircle: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: '#2563EB', justifyContent: 'center', alignItems: 'center' },detailsOptionInnerActiveCheckIndicatorDotCircleCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB' },detailsExplanationTextBodyCardContainerBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, padding: 16, marginBottom: 16 },explanationSectionSubLabelHeadingTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },explanationSectionSubLabelHeadingTitleText: { fontSize: 13, fontWeight: 'bold', color: '#2563EB' },explanationParagraphBodyContentStringText: { fontSize: 13, color: '#374151', lineHeight: 20, fontWeight: '400' },detailsTipAccentContainerEnvelopeCardBox: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, padding: 16 },tipSectionSubLabelHeadingTitleText: { fontSize: 13, fontWeight: 'bold', color: '#1D4ED8' },tipParagraphBodyContentStringText: { fontSize: 13, color: '#1E40AF', lineHeight: 18, fontWeight: '500' },  // 🔑 THE EXACT STYLE CONTAINER PIXEL-PERFECT LIFT FIX
  detailsStickyActionFooterRowContainer: { 
    position: 'absolute', 
    bottom: 96,             // 🌟 Lifts the buttons exactly 96px above your absolute tab bar
    left: 0, 
    right: 0, 
    height: 130,            // Room for both buttons stacked vertically 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderColor: '#F3F4F6', 
    paddingHorizontal: 20, 
    paddingTop: 14 
  },
    // 🎨 STYLING PARITY MATRIX matching your sent image file attachment layout
  detailsPrimaryActionButtonBlueCapsule: { 
    backgroundColor: '#3B82F6', // Clear Royal Blue matching your button image background
    width: '100%', 
    height: 48, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  detailsPrimaryActionButtonBlueCapsuleTextString: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '600' 
  },
  detailsOutlineActionButtonWhiteCapsule: { 
    backgroundColor: '#FFFFFF', 
    width: '100%', 
    height: 48, 
    borderRadius: 8, 
    borderWidth: 1.5, 
    borderColor: '#6393F1', // Dark Indigo outline border edge frame
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 16
  },
  detailsOutlineActionButtonWhiteCapsuleTextString: { 
    color: '#2563EB', // Centered Blue text matching your button image exactly
    fontSize: 15, 
    fontWeight: '600',
  },

   mockSelectorDropdownRowBox: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', borderRadius: 8, height: 48, paddingHorizontal: 16},
   setup1SelectorDropdownRowBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', borderRadius: 8, height: 48, paddingHorizontal: 16 },
detailsPrimaryActionButtonBlueCapsule: { backgroundColor: '#2563EB', width: '100%', height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },detailsPrimaryActionButtonBlueCapsuleTextString: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },summarySubjectsMetersCardContainer: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 14, padding: 16, marginTop: 12, marginBottom: 20 },summaryBarRowLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, width: '100%' },summaryBarLabel: { width: 85, fontSize: 12, fontWeight: '500', color: '#374151' },summaryTrackBg: { flex: 1, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, marginHorizontal: 12, overflow: 'hidden' },summaryFillFg: { height: '100%', borderRadius: 3 },summaryBarPct: { width: 90, fontSize: 12, fontWeight: 'bold', color: '#111827', textAlign: 'right' },radialFinishedDescriptionText: { fontSize: 11, color: '#9CA3AF', marginTop: 4, textAlign: 'center', paddingHorizontal: 12 }});