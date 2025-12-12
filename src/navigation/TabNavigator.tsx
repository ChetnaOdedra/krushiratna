import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import BuysellScreen from '../screens/BuysellScreen';
import DiseaseScreen from '../screens/DiseaseScreen';
import WeatherScreen from '../screens/WeatherScreen';
import IMAGES from '../Util/Images';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import NewDashboard from '../screens/NewDashboard';
import KShopScreen from '../screens/KShop/KShopScreen';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { t } = useTranslation();
  return (
      <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false, // Hide the header
          tabBarStyle: {
          height: 70, // 🔼 Increase tab bar height
          paddingBottom: 10, // Optional: adjust spacing
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: 'green',   // ✅ Selected text color
        tabBarInactiveTintColor: 'black',  //
          tabBarIcon: ({ focused }) => {
            let iconSource;
            // console.log(route.name)
            if (route.name === 'HomeScreen') {
              iconSource = focused
                ? IMAGES.home  // Active icon
                : IMAGES.tabhome; // Inactive icon (can be different)
            } else if (route.name === 'KShopScreen') {
              iconSource = focused
              ? IMAGES.active_kshop  // Active icon
                : IMAGES.tab_kshop; // Inactive icon (can be different)
            }else if (route.name === 'DiseaseScreen') {
              iconSource = focused
                ? IMAGES.taborganic
                :  IMAGES.active_organic   ;  
            }else if (route.name === 'BuysellScreen') {
              iconSource = focused
                 ? IMAGES.active_cropsell  // Active icon
                : IMAGES.cropsell; // Inactive icon (can be different)
            }

            return <Image source={iconSource} style={{ width: 30, height: 24 }} resizeMode="center"/>;
          },
        })}
      >
        <Tab.Screen name="HomeScreen" component={NewDashboard} options={ {headerShown: false,
          title: t('home')
        }}/>
        <Tab.Screen name="BuysellScreen" component={HomeScreen} options={ {headerShown: false,
          title: t('crop_sell')
        }}/>
        <Tab.Screen name="DiseaseScreen" component={DiseaseScreen} options={ {headerShown: false,
          title: t('Organic')
        }}/>
        <Tab.Screen name="KShopScreen" component={KShopScreen} options={ {headerShown: false,
          title: t('K Shop')
        }}/>
      </Tab.Navigator>
  );
};

export default TabNavigator;
