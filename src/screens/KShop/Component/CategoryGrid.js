import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  ActivityIndicator,
  Easing,
  Dimensions,
} from 'react-native';
import KShopApi from '../../../Services/KShopApi';
import { t } from 'i18next';
import IMAGES from '../../../Util/Images';
import { useNavigation } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';

const CategoryGrid = (props) => {

  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);

  const [mPage, setMPage] = useState(1);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const initialized = useRef(false);


  const animatedHeight = useRef(new Animated.Value(0)).current;
  const spacing = 10;
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width - 20;
  const itemSize = Math.floor((screenWidth - spacing * (numColumns + 1)) / numColumns);
  const rowHeight = itemSize + spacing;
  const kapi = KShopApi.create();

  useEffect(() => {
    KShopCategoryList();
  }, []);

  useEffect(() => {
    if(category.length>0){

      console.log("...category...",category)

    }
  }, [category]);

 const KShopCategoryList = (isLoadMore = false) => {
  if (loading || !hasNextPage) return;

  setLoading(true);

  const params = {
    limit: 9,
    page: mPage,
  };

  kapi.getKShopCategory(params).then(response => {

    setLoading(false);

    if (response.ok) {
      const newData = response.data.data;

      // if load more → append
      if (isLoadMore) {
        setCategory(prev => [...prev, ...newData]);
      } 
      // first load → replace
      else {
        setCategory(newData);
      }

      // check if more pages exist
     const total = response.data.total;

      if ((mPage * params.limit) >= total) {
        setHasNextPage(false);
      } else {
        setMPage(prev => prev + 1);
      }

      if (!initialized.current) {
        const initialRows = 2;
        const initialHeight = rowHeight * initialRows;
        animatedHeight.setValue(initialHeight);
        initialized.current = true;
      }

      // // your animation logic
      // const initialRows = 2;
      // const initialHeight = rowHeight * initialRows;
      // animatedHeight.setValue(initialHeight);

    } else {
      console.error("Error fetching KShop Categories:", response.problem);
    }
  });
};


  const toggleExpand = () => {

    const totalRows = Math.ceil(category.length / numColumns);
    const collapsedRows = 2;

    const toValue = expanded
      ? rowHeight * collapsedRows
      : rowHeight * totalRows;

    Animated.timing(animatedHeight, {
      toValue,
      duration: 400,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();

    setExpanded(!expanded);
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ViewMoreProductsScreen', { category: item })}>
    <View style={[styles.card, { width: itemSize, height: itemSize, margin: spacing / 2 }]}>
      <Image
        source={{ uri: item.img }}
        style={styles.image}
        resizeMode='cover'
      />
      <View style={styles.labelContainer}>
        <Image
          source={IMAGES.placeholderbg}
          style={styles.labelBackground}
          resizeMode='cover'
        />
        {/* Optional overlay text or content */}
        <Text style={styles.label}>{item.name}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Categories')}</Text>

      <Animated.View style={{ height: animatedHeight}}>
        <FlatList
          data={category}
          numColumns={numColumns}
          scrollEnabled={true}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: spacing / 2,
          }}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
          }}
          renderItem={renderItem}
          onEndReached={() => {
          if (hasNextPage && !loading) {
            KShopCategoryList(true);
          }
          }}
          nestedScrollEnabled={true}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ?  <ActivityIndicator size="small" color="#0066cc" />
             : null
          }
        />
      </Animated.View>

      {category.length > 6 && (
        <TouchableOpacity onPress={()=>toggleExpand()}>
          <Text style={styles.viewMore}>
            {expanded ? t('View Less') : t('View More')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CategoryGrid;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    marginHorizontal:10,
    marginTop: -10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
    labelContainer: {
    position: 'absolute',
    bottom: 0,
    height: '50%',
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  labelBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  label: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8, // 👈 This positions it 10 from the bottom
    zIndex: 1, // ensures it's above the background image
    fontWeight:700
  },
  viewMore: {
    marginTop: ms(10),
    color: 'green',
    fontWeight: '600',
    textAlign: 'right',
    marginRight:ms(15)
  },
});
