/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import './src/debugNativeModules'; // Import the debug file to log NativeModules

// index.js — put this as the first lines
const RN = require('react-native');

if (RN && RN.NativeEventEmitter) {
  const OriginalNativeEventEmitter = RN.NativeEventEmitter;
  RN.NativeEventEmitter = function(nativeModule) {
    if (!nativeModule) {
      // return a fake emitter with safe methods (no-op)
      return {
        addListener: () => ({ remove: () => {} }),
        removeAllListeners: () => {},
        removeListeners: () => {}
      };
    }
    return new OriginalNativeEventEmitter(nativeModule);
  };
}

// Handle background & quit state notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    // Perform any action (e.g., fetching data, updating local storage, etc.)
  });
  // Handle notification when app is in quit state
messaging()
.getInitialNotification()
.then(remoteMessage => {
  if (remoteMessage) {
    console.log('Notification caused app to open from quit state:', remoteMessage);
    // Perform any required action
  }
});
AppRegistry.registerComponent(appName, () => App);
