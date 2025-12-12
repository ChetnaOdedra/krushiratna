import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import IMAGES from '../Util/Images';

const DashboardImage = ({ onFirstImagePress, onSecondImagePress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onFirstImagePress}>
        <Image source={IMAGES.bannercropsell} style={styles.image} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onSecondImagePress}>
        <Image source={IMAGES.bannerkstore} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
});

export default DashboardImage;
