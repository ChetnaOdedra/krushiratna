import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';

import YardPriceSection from '../screenComponents/YardPriceSection';
import WeatherCard from '../screenComponents/WeatherCard';
import IncomingFeatures from '../screenComponents/IncomingFeatures';
import BannerCarousel from '../screenComponents/BannerCarousel';
import Api from '../Services/Api';
import HeaderSwitcher from '../screenComponents/HeaderSwitcher';
import COLORS from '../Util/Colors';
import DashboardImage from '../components/DashboardImage';
import { t } from '../translations/translationHelper';
import { useFocusEffect } from '@react-navigation/native';
import DashboardRandomProductGrid from '../screenComponents/DashboardRandomProductGrid';
import changeNavigationBarColor from "react-native-navigation-bar-color";
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.55;

const NewDashboard = (props) => {
  const api = Api.create();
  const [banners, setBanners] = useState<string[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerRef = useRef<FlatList>(null);
  const bannerIndex = useRef(0);

  useEffect(() => {
    fetchData();
  }, []);
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1); // Forces screen to rerender
    }, [])
  );
  useFocusEffect(
    useCallback(() => {
      changeNavigationBarColor("#ffffffff", true); // green nav bar
    }, [])
  );
  useEffect(() => {
    const interval = setInterval(() => {
      if (bannerRef.current && banners && banners.length > 0) {
        bannerIndex.current = (bannerIndex.current + 1) % banners.length;
        try {
          bannerRef.current.scrollToIndex({ index: bannerIndex.current, animated: true });
        } catch (e) {
          console.warn('Banner scroll error:', e);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [banners]);

  const fetchData = async () => {
    const startTime = Date.now();
    try {
      const response = await api.NewsAPI();
      if (response?.status === 200 && Array.isArray(response?.data?.data)) {
        setNews(response.data.data);
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(3000 - elapsed, 0); // ensure 3 seconds
      setTimeout(() => setLoading(false), delay);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderNewsItem = ({ item }: { item: any }) => {
    if (!item?.img?.url) return null;

    const imageUrl = item?.img?.url ?? 'https://via.placeholder.com/150';
    const title = item?.title ?? 'No Title';
    const description = item?.description ?? 'No Description';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          props.navigation?.navigate?.('NewsDetailScreen', {
            title,
            text: description,
            image: imageUrl,
          })
        }
      >
        <Image source={{ uri: imageUrl }} style={styles.newsImage} />
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{description}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ fontSize: 16, marginBottom: 10, color: '#333' }}>Loading...</Text>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container} key={refreshKey}>
      <HeaderSwitcher />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BannerCarousel banners={banners ?? []} />
        <WeatherCard />
        <View style={styles.newsHeader}>
          <Text style={styles.newsTitle}>{t("news")}</Text>
          <TouchableOpacity onPress={() => props.navigation?.navigate?.('NewsSection')}>
            <Text style={styles.viewAll}>{t("view_all")}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={news ?? []}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 10 }}
        />
        <Text style={styles.bold}>{t("marketing_yard")}</Text>
        <YardPriceSection />
        <DashboardImage
          onFirstImagePress={() => props.navigation.navigate('BuysellScreen')}
          onSecondImagePress={() => props.navigation.navigate('KShopScreen')}
        />
        <DashboardRandomProductGrid/>
        <IncomingFeatures key={refreshKey}/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.newBGcolor,
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 15,
    marginHorizontal: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: 'green',
    fontWeight: '700',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 0,
    marginHorizontal: 5,
  },
  newsImage: {
    width: '100%',
    height: CARD_WIDTH * 0.6,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#363636',
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#666',
  },
  bold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 15,
    marginTop: 10,
  },
});

export default NewDashboard;
