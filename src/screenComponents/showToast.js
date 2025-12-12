import { ToastAndroid } from 'react-native';

const showToast = (message) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
};

export default showToast;
