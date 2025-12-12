import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Api from '../Services/Api';
import UesrMob from '../Services/Mobxstate/UesrMob';
import BuyerCustomHeader from '../screenComponents/BuyerCustomHeader';
import CustomHeader from '../screenComponents/CustomHeader';
import { ms } from 'react-native-size-matters';
import HeaderSwitcher from '../screenComponents/HeaderSwitcher';
import MinimalHeader from '../components/MinimalHeader';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 40) / 2; // 2 cards per row with padding

const NewsSection = (props) => {
  const api = Api.create();
  const [news, setNews] = useState<any[]>([]);

  const renderItem = ({ item }) => {
        const imageUrl = item?.img?.url ?? '';
        const hasImage = imageUrl !== '';

        return (
          <View style={[styles.card, !hasImage && styles.cardNoImage]}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('NewsDetailScreen', {
                  title: item?.title ?? 'No Title',
                  text: item?.description ?? 'No Description',
                  image: imageUrl,
                })
              }
            >
              {hasImage && (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
              <View style={[styles.content, !hasImage && styles.contentNoImage]}>
                <Text numberOfLines={2} style={styles.title}>
                  {item?.title ?? 'No Title'}
                </Text>
                <Text numberOfLines={3} style={[styles.text, !hasImage && styles.textNoImage]}>
                  {item?.description ?? 'No Description'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.NewsAPI();
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        setNews(response.data.data);
      } else {
        console.error('Error fetching news:', response.status);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
       <MinimalHeader title={'સમાચાર'} onBackPress={() => props.navigation.goBack()} />
      <View style={styles.container}>
        <FlatList
          data={news}
          keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: ms(100) }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  card: {
    width: cardWidth,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    marginTop: 10,
    marginHorizontal: 5,
  },
  image: {
    height: 100,
    width: '100%',
  },
  content: {
    padding: 8,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
  },
  text: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default NewsSection;

