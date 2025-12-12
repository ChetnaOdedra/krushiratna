import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import UesrMob from '../Mobxstate/UesrMob';
import { DeviceEventEmitter } from 'react-native';
const usePushNotification = () => {
  const requestUserPermission = async () => { 
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }

  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      UesrMob.updateFCMToken(fcmToken);
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const listenToForegroundNotifications = () => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Notification channel created: ${created}`)
    );
    
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage.data.type);
      if (remoteMessage.data.type === 'company_order_arrived') {
        console.log('Order notification received:', remoteMessage);
        DeviceEventEmitter.emit('refreshTodaysOrder');
      } 
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: remoteMessage.notification?.title || 'Notification',
        message: remoteMessage.notification?.body || 'You have a new message!',
        playSound: true,
        soundName: 'default',
      });
    });
  };
  
  useEffect(() => {
    listenToForegroundNotifications();
  }, []);

  // const listenToForegroundNotifications = async () => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log(
  //       'A new message arrived! (FOREGROUND)',
  //       JSON.stringify(remoteMessage),
  //     );
  //   });
  //   return unsubscribe;
  // }

  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        console.log(
          'A new message arrived! (BACKGROUND)',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  }

  const onNotificationOpenedAppFromBackground = async () => {
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        console.log(
          'App opened from BACKGROUND by tapping notification:',
          JSON.stringify(remoteMessage),
        );
      },
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromQuit = async () => {
    const message = await messaging().getInitialNotification();

    if(message) {
      console.log('App opened from QUIT by tapping notification:', JSON.stringify(message));
    }
  };

  return {
    requestUserPermission,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  };
};

export default usePushNotification;