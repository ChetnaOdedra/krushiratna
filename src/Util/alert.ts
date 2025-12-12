import { Alert } from "react-native";
export const justAnAlert = (Title:String,Description:String) => {
    Alert.alert(`${Title}`, `${Description}`, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
 };