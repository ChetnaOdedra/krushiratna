import { t } from 'i18next';
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity,Text } from 'react-native';
import Video from 'react-native-video';

const MediaScreen = ({ route,navigation }) => {
  const { type, uri } = route.params;

  return (
    <View style={styles.container}>
      {type === 'image' ? (
        <Image source={{ uri }} style={styles.media} />
      ) : (
        <Video
          source={{ uri }}
          style={styles.media}
          controls={true}
          resizeMode="contain"
          onBuffer={this.onBuffer} // Callback when remote video is buffering
          onError={this.videoError} // Callback when video cannot be loaded
        />
      )}
      <TouchableOpacity onPress={() => setTimeout(navigation.goBack, 0)}>
        <Text style={styles.backButton}>{t('back')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: 300,
  },
  backButton: {
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
  },
});

export default MediaScreen;