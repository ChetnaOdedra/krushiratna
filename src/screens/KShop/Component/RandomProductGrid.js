import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import KShopApi from '../../../Services/KShopApi';
import COLORS from '../../../Util/Colors';

const RandomProductGrid = (props) => {

  const navigation = useNavigation();
  const Kapi = KShopApi.create();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    Kapi.getRendomProducts().then((response) => {
      setLoading(false);
      if (response.ok) {
        console.log('KShop Products:', response.data);
        setProducts(response.data.data || []);
      } else {
        console.error('Error fetching KShop Products:', response.problem);
      }
    });
  };

  const SkeletonCard = () => (
    <View style={styles.card}>
      <View style={[styles.image, styles.skeleton]} />
      <View style={[styles.skeleton, { height: 14, width: '70%', marginBottom: 6 }]} />
      <View style={[styles.skeleton, { height: 14, width: '60%', marginBottom: 10 }]} />
      <View style={[styles.button, styles.skeleton]} />
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t("No products available right now.")}</Text>
    </View>
  );

  const ProductCard = ({ item }) => (
      <View style={styles.card}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() =>
            navigation.navigate('ProductDetailScreen', { product: item })
          }
        >
          <View style={{ flex: 1, justifyContent: 'space-between' ,backgroundColor:COLORS.white}}>
            <View>
              <Image source={{ uri: item.img[0].url }} style={styles.image} />
                {item.category && item.category.name ? (
                      <Text style={{ fontSize: 12, color: '#888', marginBottom: 2,fontWeight:'900' }}>
                        {item.category.name}
                      </Text>
                  ) : null}
              <Text style={styles.title}>{item.name}</Text>

              <View style={styles.priceRow}>
                <View style={styles.leftPriceGroup}>
                    { item.discount_price && item.discount_price != '' &&
                      <Text style={styles.price}>₹{item.discount_price.toLocaleString('en-US')}</Text>
                    }   
                     { item.price && item.price != '' &&
                      <Text style={styles.strike}>₹{item.price.toLocaleString('en-US')}</Text>
                    }              
                </View>
              </View>
              <Text style={styles.unit}>{item.weight_full_name}</Text>
              <Text style={[styles.title,{fontSize:16}]}>Free Delivery</Text> 
              
           </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('ProductDetailScreen', { product: item })
              }
            >
              <Text style={styles.buttonText}>{t('View Detail')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

    );

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={styles.heading}>{t('Random Products')}</Text>
        {/* <TouchableOpacity onPress={()=> navigation.navigate('ViewMoreProductsScreen')}>
          <Text style={[styles.heading,{fontSize:15,color:COLORS.newbuttonColor}]}>{t('View More')}</Text>
        </TouchableOpacity> */}
      </View>
      

      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item, index) => `skeleton-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          renderItem={() => <SkeletonCard />}
        />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          renderItem={({ item }) => <ProductCard item={item} />}
        />
      )}
    </View>
  );
};

export default RandomProductGrid;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop:15
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    width: '48%',
    elevation: 2,
    marginHorizontal: 5,
    marginVertical: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // height: 220, // fixed height ensures layout consistency
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
    bottom:2
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  skeleton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
   priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  leftPriceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: 'green',
    fontWeight: '700',
    marginRight: 6,
  },

  strike: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 13,
    marginRight: 6,
  },
  button: {
  backgroundColor: COLORS.newbuttonColor,
  paddingVertical: 8,
  borderRadius: 4,
  alignItems: 'center',
  marginTop: 'auto', // pushes it to the bottom
},
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
   unit: {
    fontSize: 13,
    color: '#444',
    marginBottom:5,
  },
});