import React, { useState,useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView,ActivityIndicator, TextInput } from "react-native";
import { useTranslation } from 'react-i18next';
import COLORS from "../Util/Colors";
import MinimalHeader from "../components/MinimalHeader";
import VideoThumbnail from "../components/VideoThumbnail";
import { Linking } from 'react-native';
const IMAGE_HEIGHT = 200;
const MAX_WIDTH = 300;
const CropFormDetail = (props) => {
  const{navigation,route} = props;
  const{product_name,approx_weight,seed,production_time,images,video,weight} = route.params;
  const { t } = useTranslation();
  const [imageSizes, setImageSizes] = useState([]);
useEffect(() => {
  console.log('Route Params:', route.params);
}, []);
useEffect(() => {
  const fetchSizes = async () => {
    const promises = images.map((img) => {
      return new Promise((resolve) => {
        Image.getSize(
          img.url,
          (width, height) => {
            const ratio = width / height;
            const calculatedWidth = IMAGE_HEIGHT * ratio;
            const finalWidth = Math.min(calculatedWidth, MAX_WIDTH); // ⛳️ apply max width cap
            resolve({ width: finalWidth, height: IMAGE_HEIGHT });
          },
          () => resolve({ width: IMAGE_HEIGHT, height: IMAGE_HEIGHT }) // fallback
        );
      });
    });

    const sizes = await Promise.all(promises);
    setImageSizes(sizes);
  };
  fetchSizes();
}, []);
 if (imageSizes.length !== images.length) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }
  return (
    <View style={{backgroundColor:COLORS.newBGcolor}}>
     <MinimalHeader title={t('Orders Details')} onBackPress={() => props.navigation.goBack()} />
      <ScrollView >
        <View style={styles.card}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {images.map((img, index) => (
            <TouchableOpacity onPress={() =>  Linking.openURL(img.url)}>
            <Image
              key={index}
              source={{ uri: img.url }}
              style={{
                width: imageSizes[index].width,
                height: imageSizes[index].height,
                marginRight: 10,
                borderRadius: 10,
                backgroundColor: '#ccc',
              }}
              resizeMode="cover"
            />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() =>  Linking.openURL(video.url)}>
                <View
                  style={{
                    height: '82%',
                    width: '95%',
                    backgroundColor: '#E7F0FF',
                    borderRadius: 20,
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {video?.url ? (
                    <VideoThumbnail videoUrl={video.url} />
                  ) : (
                    <></>// You can replace this with a placeholder or a default UI
                  )}
                </View>
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.title}>{product_name || 'Product'}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.label}>{t('Weight')}</Text>
          <Text style={styles.value}>{approx_weight}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>{t('Seed')}</Text>
          <Text style={styles.value}>{seed}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>{t('Production Time')}</Text>
          <Text style={styles.value}>{production_time}</Text>
        </View>
      </View>
      </ScrollView>
    </View>
    
  );
};

export default CropFormDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
 card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
    imageScroll: {
    height: IMAGE_HEIGHT,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
    detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontWeight: '500',
    color: '#555',
  },
  value: {
    color: '#333',
  },
});