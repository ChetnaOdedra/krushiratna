// components/BannerCarousel.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Api from '../Services/Api';
import { use } from 'i18next';
import KShopApi from '../Services/KShopApi';

const { width } = Dimensions.get('window');

interface BannerCarouselProps {
  banners: string[];
}

const KshopBannerCarousel: React.FC<BannerCarouselProps> = () => {
  const [banners, setBanners] = useState<string[]>([]);
  const api = Api.create();
  const Kapi = KShopApi.create()
  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerRef = useRef<FlatList>(null);
  const bannerIndex = useRef(0);

  function GetBanners() {
    Kapi.KshopFarmersbanners().then((response) => {
      if (response.status === 200) {  
        console.log("KshopFarmersbanners")
           console.log(response.data)
        const urls = response.data.data.map(item => item.url);
        setBanners(urls);
        console.log(urls);
      } else {
        console.error('Error fetching banners:', response.status);
      }
    }
    ).catch((error) => {
      console.error('Error fetching banners:', error);
    }
    );
  }
  useEffect(() => {
    GetBanners();
  },
  []);  
  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current && banners.length > 0) {
        bannerIndex.current = (bannerIndex.current + 1) % banners.length;
        bannerRef.current.scrollToIndex({ index: bannerIndex.current, animated: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  return (
    <>
      <Animated.FlatList
        ref={bannerRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} // disables swipe
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => console.log('Tapped on banner:', item)}>
              <Image source={{ uri: item }} style={styles.banner} resizeMode="cover" />
            </TouchableOpacity>
          </View>
        )}
        style={{ marginBottom: 10 }}
      />



      <View style={styles.indicatorContainer}>
        {banners.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1.2, 0.7],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: width - 30,
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    height: 4,
    width: 15,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginHorizontal: 2,
  },
});

export default KshopBannerCarousel;
