import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import IMAGES from '../Util/Images';
import IncomingFeatures from '../screenComponents/IncomingFeatures';
import HeaderSwitcher from '../screenComponents/HeaderSwitcher';
import COLORS from '../Util/Colors';

const { width } = Dimensions.get('window');
const imageWidth = width - 30;

const DiseaseScreen = () => {
  const { t } = useTranslation();

  return (
 <View style={{flex: 1, backgroundColor: '#fff'}}>
  <HeaderSwitcher />
   <ScrollView style={styles.container}>
    <IncomingFeatures />
    </ScrollView>
 </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.newBGcolor, padding: 10 },
  imageScroll: { marginBottom: 16 },
  image: {
    width: imageWidth,
    height: 250,
    borderRadius: 10,
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f2f2f',
    textAlign: 'center',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 18,
    color: 'green',
    marginRight: 10,
    marginTop: 2,
  },
  pointText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  footer: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  viewMore: {
    fontSize: 15,
    color: '#006400',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default DiseaseScreen;
