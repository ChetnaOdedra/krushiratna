import { Image, ImageBackground, StatusBar, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import UesrMob from '../Services/Mobxstate/UesrMob';
import { CommonActions } from '@react-navigation/native';
import IMAGES from '../Util/Images';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const SplashScr = (props) => {

  // Retrieve the string
const getString = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('Retrieved string:', value);
      return value;
    }
  } catch (e) {
    console.log('Reading error:', e);
  }
};
  useEffect(()=>{
    getString("selectedLanguage").then((res)=>{ 
      console.log("selectedLanguage",res)
      if (res !== null) {
        i18n.changeLanguage(res);
      }
    }
    )
    // Check if the user is logged in
    setTimeout(() => {
      // Navigate to the main screen after 3 seconds
      console.log("Checking in splash",UesrMob)
      if (UesrMob.isLogin === true)
      {
        console.log("User is logged in",UesrMob.user);
        if (UesrMob.user.user.role === "company")
        {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'BuyerHome' },
              ],
            })
          );
        }
        else
        {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'MainTabs' },
              ],
            })
          );
        }
        
        // props.navigation.navigate('HomeTab');
      }
      else 
      {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Login' },
            ],
          })
        );
        // props.navigation.navigate('Login');
      }
      
    }, 1000);
  },[]);
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} backgroundColor="#ffffff" barStyle="dark-content" />
      <LottieView
        source={IMAGES.tractor}
        autoPlay
        loop
        style={{ width: 300, height: 300 ,position:'absolute', zIndex:1,alignSelf:'center',bottom:100 }}
      />
      <ImageBackground source={IMAGES.splash_icon} resizeMode="cover" style={styles.image}></ImageBackground>
    </View>
  )
}

export default SplashScr

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  image:{
    flex:1
  }
})