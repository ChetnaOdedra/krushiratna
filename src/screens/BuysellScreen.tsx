import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import IMAGES from '../Util/Images';
import IncomingFeatures from '../screenComponents/IncomingFeatures';
import HeaderSwitcher from '../screenComponents/HeaderSwitcher';
import COLORS from '../Util/Colors';

const { width } = Dimensions.get('window');
const imageWidth = width - 20;

const BuysellScreen = () => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
       <HeaderSwitcher />
       <View style={styles.container}>
       <IncomingFeatures />
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.newBGcolor,
    flex:1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  image: {
    width: imageWidth,
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
    alignSelf: 'center',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletIcon: {
    fontSize: 18,
    color: 'green',
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  featureDesc: {
    fontSize: 15,
    color: '#444',
  },
  step: {
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  download: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#006400',
    marginTop: 16,
  },
});

export default BuysellScreen;
