import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import i18n from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import usePushNotification from './src/Services/Notification/usePushNotification';
import { Appearance, StatusBar, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ correct import
import { SafeAreaView } from 'react-native-safe-area-context';
// Force Light Mode
Appearance.setColorScheme('light');

const App = () => {
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    const init = async () => {
      try {
        await i18n.changeLanguage("gu");
        await AsyncStorage.setItem('selectedLanguage', "gu");

        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (e) {
        console.log(e);
      } finally {
        // ✅ Hide splash only after setup is done
        // SplashScreen.hide();
      }
    };

    init();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert('No Internet', 'Please check your internet connection.');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaView style={{ flex: 1,backgroundColor:'#EEF7FE' }} edges={['top']}>
        <StatusBar hidden={false} backgroundColor="#ffffff" barStyle="dark-content" />
        <AppNavigator />
      </SafeAreaView>
    </I18nextProvider>
  );
};

export default App;
