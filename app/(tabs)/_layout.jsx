import { Tabs } from 'expo-router';
import { StyleSheet, View, Image } from 'react-native';

// 1. LINK YOUR CUSTOM EXPORTED TAB BAR IMAGE ASSETS HERE
const homeActive = require("../../assets/images/dashboard_active.png");
const homeInactive = require("../../assets/images/dashboard_inactive.png");

const practiceActive = require("../../assets/images/practice_active.png");
const practiceInactive = require("../../assets/images/practice_inactive.png");

const bookmarkActive = require("../../assets/images/bookmark_active.png");
const bookmarkInactive = require("../../assets/images/bookmark_inactive.png");

const settingsActive = require("../../assets/images/settings_active.png");
const settingsInactive = require("../../assets/images/settings_inactive.png");

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, 
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3B82F6',   
        tabBarInactiveTintColor: '#A6A6A6', 
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* 1. DASHBOARD TAB */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {/* 2. DYNAMIC EVALUATION: Swaps image files instantly based on focus state */}
              <Image 
                source={focused ? homeActive : homeInactive} 
                style={styles.tabImageStyle}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* 2. PRACTICE TAB */}
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image 
                source={focused ? practiceActive : practiceInactive} 
                style={styles.tabImageStyle}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* 3. BOOKMARKS TAB */}
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image 
                source={focused ? bookmarkActive : bookmarkInactive} 
                style={styles.tabImageStyle}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      {/* 4. SETTINGS TAB */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image 
                source={focused ? settingsActive : settingsInactive} 
                style={styles.tabImageStyle}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F0F5FE',
    height: 96,
    borderTopWidth: 1, 
    borderColor: '#F3F4F6', 
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
  },
  tabImageStyle: {
    width: '100%',
    height: '100%',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});
