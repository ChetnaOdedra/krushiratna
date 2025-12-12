import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Api from '../Services/Api';
import COLORS from '../Util/Colors';
import IMAGES from '../Util/Images';
import { t } from '../translations/translationHelper';
const features = [
  {
    category: 'Buy agri products',
    title: 'Agree Premium Organic Compost Fertilizer for Sustainable Farming and Soil Enrichment',
    image: 'https://www.youtube.com/embed/UNr77pG5MaA',
  },
  {
    category: 'Organic',
    title: 'Agree Advanced Drip Irrigation System Kit for Efficient Water Management in Small & Large Farms',
    image: 'https://www.youtube.com/embed/UNr77pG5MaA',
  },
];

const IncomingFeatures = () => {
  const [features, setFeatures] = useState([]);
  const api = Api.create();
  useEffect(() => {
    api.Incomeingfeature()
      .then((response) => {
        console.log('Incoming Features: ', response);  
        if (response.status === 200) {
          
           setFeatures(response.data.data);
        } else {
          console.error('Error fetching features:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching features:', error);
      });
  }, []);
  const openVideo = (videoUrl) => {
    Linking.openURL(videoUrl);
  };

  return (
  <View style={styles.container}>
    <Text style={styles.heading}>
      <Text style={styles.bold}>{t('Incoming Features')}</Text>
    </Text>

{features.map((item, index) => {
  if (!item.video) return <></>; // Skip rendering if video is null or empty

  console.log('Feature item:', item);

      return (
        <View key={index} style={{ marginBottom: 15 }}>
          <Text style={styles.subHeading}>{item.title}</Text>
          <ImageBackground
            source={{ uri: item.thumb_url }}
            style={styles.imageCard}
            imageStyle={{ borderRadius: 10 }}
          >
            <TouchableOpacity style={styles.playIcon} onPress={() => openVideo(item.video)}>
              <Image
                source={IMAGES.play_btn}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
            </TouchableOpacity>
            <View style={styles.overlay}>
              <Text numberOfLines={2} style={styles.title}>{item.description}</Text>
            </View>
          </ImageBackground>
        </View>
      );
    })}
  </View>
);
};

const styles = StyleSheet.create({
  container: { padding: 0 ,marginHorizontal: 15,marginVertical: 10},
  heading: { fontSize: 18, fontWeight: 'bold' },
  bold: { fontWeight: 'bold', color: 'Black' },
  underline: {
    borderBottomWidth: 3,
    borderBottomColor: 'green',
    paddingBottom: 2,
  },
  subHeading: {
    fontSize: 14,
    marginVertical: 5,
    fontWeight: '700',
    color: COLORS.LoginsubTitle,
  },
  imageCard: {
    height: 140,
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  playIcon: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 2,
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    borderRadius: 10,
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default IncomingFeatures;
