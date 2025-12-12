import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from './TabNavigator';
import RegisterScreen from '../screens/RegisterScreen';
import COLORS from '../Util/Colors';
import LoginScreen from '../screens/LoginScreen';
import SplashScr from '../screens/SplashScr';
import OtpScreen from '../screens/OtpScreen';
import PriceingScreen from '../screens/PriceingScreen';
import CropForm from '../screens/CropForm';
import RunningOrderedScreen from '../screens/RunningOrderedScreen';
import CropFormDetail from '../screens/CropFormDetail';
import BuyerSelectionScreen from '../screens/BuyerSelection';
import SellingStatusScreen from '../screens/SellingStatusScreen';
import SettingScreen from '../screens/SettingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageScreen from '../screens/LanguageScreen';
import BuyerRegister from '../screens/company/BuyerRegister';
import BuyerHome from '../screens/company/BuyerHome';
import MediaScreen from '../components/MediaScreen';
import SubmitProductPriceDetail from '../screens/company/SubmitProductPriceDetail';
import BuyerSellingStatus from '../screens/company/BuyerSellingStatus';
import BuyerOrderStatus from '../screens/company/BuyerOrderStatus';
import BuyerOrderHistory from '../screens/company/BuyerOrderHistory';
import FarmarOrderHistory from '../screens/FarmarOrderHistory';
import NotificationList from '../screens/NotificationList';
import NewsSection from '../screens/NewsSection';
import NewDashboard from '../screens/NewDashboard';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import YardPriceDetailScreen from '../screens/YardPriceDetailScreen';
import SubmitProductPrice from '../screens/company/SubmitProductPrice';
import KShopScreen from '../screens/KShop/KShopScreen';
import ProductDetailScreen from '../screens/KShop/ProductDetailScreen';
import ViewMoreProductsScreen from '../screens/KShop/ViewMoreProductsScreen';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#ffffffff" barStyle="dark-content" />
      <Stack.Navigator initialRouteName='SplashScr' screenOptions={{headerShown: false}}>  
        <Stack.Screen name="MainTabs" component={TabNavigator} options={ {headerShown: false}}/>
        <Stack.Screen name="SplashScr" component={SplashScr} options={ {headerShown: false}}/> 
        <Stack.Screen name="Login" component={LoginScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="OtpScreen" component={OtpScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="PriceingScreen" component={PriceingScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="CropForm" component={CropForm} options={ {headerShown: false}}/> 
        <Stack.Screen name="CropFormDetail" component={CropFormDetail} options={ {headerShown: false}}/> 
        <Stack.Screen name="RunningOrderedScreen" component={RunningOrderedScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="BuyerSelectionScreen" component={BuyerSelectionScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="SellingStatusScreen" component={SellingStatusScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="SettingScreen" component={SettingScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={ {headerShown: false}}/> 
        <Stack.Screen name="LanguageScreen" component={LanguageScreen} options={ {headerShown: false}}/>
        <Stack.Screen name="FarmarOrderHistory" component={FarmarOrderHistory} options={ {headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={ {headerShown: false}}/>
        {/* <Stack.Screen name="Media" component={MediaScreen} /> */}
        {/* company */}
        <Stack.Screen name="BuyerRegister" component={BuyerRegister} options={ {headerShown: false}}/>
        <Stack.Screen name="BuyerHome" component={BuyerHome} options={ {headerShown: false}}/>
        <Stack.Screen name="SubmitProductPriceDetail" component={SubmitProductPriceDetail} options={ {headerShown: false}}/>
        <Stack.Screen name="BuyerOrderStatus" component={BuyerOrderStatus} options={ {headerShown: false}}/>
        <Stack.Screen name="BuyerSellingStatus" component={BuyerSellingStatus} options={ {headerShown: false}}/>
        <Stack.Screen name="BuyerOrderHistory" component={BuyerOrderHistory} options={ {headerShown: false}}/>
        <Stack.Screen name="NotificationList" component={NotificationList} options={ {headerShown: false}}/>
        <Stack.Screen name="NewsSection" component={NewsSection} options={ {headerShown: false}}/>
        <Stack.Screen name="NewDashboard" component={NewDashboard} options={ {headerShown: false}}/>
        <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} options={ {headerShown: false}}/>
        <Stack.Screen name="YardPriceDetailScreen" component={YardPriceDetailScreen} options={ {headerShown: false}}/>
        <Stack.Screen name="SubmitProductPrice" component={SubmitProductPrice} options={ {headerShown: false}}/>
        <Stack.Screen name="KShopScreen" component={KShopScreen} options={ {headerShown: false}}/>
        <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={ {headerShown: false}}/>
        <Stack.Screen name="ViewMoreProductsScreen" component={ViewMoreProductsScreen} options={ {headerShown: false}}/>
    
    
        
        
       </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
