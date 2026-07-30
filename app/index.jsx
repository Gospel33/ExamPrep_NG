import React, { useEffect } from 'react';
import { StyleSheet, View, Image, StatusBar, Dimensions } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const logoAsset = require("../assets/images/examPrep_logo.png");

export default function SplashScreen() {

  useEffect(() => {
    // 2000 milliseconds = 2 full seconds of screen delay time for splash screen display before routing into onboarding
    const splashTimer = setTimeout(() => {
      // Clears memory history track and slides forward into onboarding screen, preventing back navigation to splash screen
      router.replace('/(onboard)');
    }, 2000); 

    // A safety clear to prevent memory leaks if the user force-closes the app quickly
    return () => clearTimeout(splashTimer);
  }, []);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.logoWrapper}>
        <Image 
          source={logoAsset} 
          style={styles.logoImageStyle}
          resizeMode="contain" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: width * 0.55,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImageStyle: {
    width: '100%',
    height: '100%',
  },
});

