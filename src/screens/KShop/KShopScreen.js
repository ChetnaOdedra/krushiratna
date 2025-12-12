    // HomeScreen.js
import React from 'react';

import { View, Text, Button, ScrollView } from 'react-native';
import CategoryGrid from './Component/CategoryGrid';
import RandomProductGrid from './Component/RandomProductGrid';
import HeaderSwitcher from '../../screenComponents/HeaderSwitcher';
import KshopBannerCarousel from '../../screenComponents/KshopBannerCarousel';


    const KShopScreen = ({ navigation }) => {
   return (
        <View style={{ flex: 1 ,backgroundColor: '#fff'}}>
        <HeaderSwitcher/>
        <ScrollView nestedScrollEnabled={true} style={{ flex: 1}}>
         <KshopBannerCarousel/>     
         <CategoryGrid/>
         <RandomProductGrid/>
        </ScrollView>
        </View>
      );
    };

    export default KShopScreen;