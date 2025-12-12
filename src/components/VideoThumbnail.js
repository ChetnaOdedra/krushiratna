import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';
import IMAGES from '../Util/Images'; // make sure this points to your image assets

const FIXED_HEIGHT = 200;

const VideoThumbnail = ({ videoUrl, onPress }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSize, setImageSize] = useState({ width: 170, height: FIXED_HEIGHT });

  useEffect(() => {
    createThumbnail({
      url: videoUrl,
    })
      .then((response) => {
        const { path } = response;

        Image.getSize(
          path,
          (width, height) => {
            const ratio = width / height;
            setImageSize({ width: FIXED_HEIGHT * ratio, height: FIXED_HEIGHT });
            setThumbnail(path);
            setLoading(false);
          },
          (error) => {
            console.error('Failed to get image size:', error);
            setThumbnail(path);
            setLoading(false);
          }
        );
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [videoUrl]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.thumbnailWrapper, { width: imageSize.width, height: imageSize.height }]}>
      <Image
        source={{ uri: thumbnail }}
        style={[styles.thumbnailImage, { width: imageSize.width, height: imageSize.height }]}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.playButton}
        onPress={onPress} // optional callback on play press
      >
        <Image
          source={IMAGES.play_btn}
          style={{ width: 30, height: 30, borderRadius: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
   justifyContent: 'center',
    alignItems: 'center', 
    height: 150,
  },
  thumbnailWrapper: {
    // position: 'relative',
    justifyContent: 'center',
    marginBottom: -15,
  },
  thumbnailImage: {
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default VideoThumbnail;
