import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';
import IMAGES from '../../../Util/Images';
import COLORS from '../../../Util/Colors';

const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={[styles.image, styles.skeleton]} />
    <View style={[styles.skeletonText, { width: '60%' }]} />
    <View style={[styles.skeletonText, { width: '80%' }]} />
    <View style={[styles.skeletonText, { width: '40%' }]} />
    <View style={[styles.skeletonButton]} />
  </View>
);

const ProductGrid = ({ products, loading }) => {
  const navigation = useNavigation();

  {    console.log("ProductCard...",products)}


  const ProductCard = React.memo(({ item }) => (

   
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}
        style={{ flex: 1 }}
        activeOpacity={0.9}
      >
        <View style={{ flex: 1 ,backgroundColor:COLORS.white}}>
          <Image
            source={item?.img?.[0]?.url ? { uri: item.img[0].url } : IMAGES.placeholder}
            style={styles.image}
            resizeMode="contain"
          />
          {item.category && item.category.name ? (
            <Text style={{ fontSize: 12, color: '#888', marginBottom: 2, fontWeight: '900', marginTop: 2 }}>
              {item.category.name}
            </Text>
          ) : null}
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {item?.name || ''}
          </Text>

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

          <Text style={styles.unit} numberOfLines={1} ellipsizeMode="tail">
            {item?.weight_full_name || ''}
          </Text>

          <Text style={[styles.title,{fontSize:16}]}>Free Delivery</Text> 
          
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}
        >
          <Text style={styles.buttonText}>{t('View Detail')}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  ));

  const renderSkeletons = () => {
    const skeletonItems = Array(6).fill(null); // Show 6 placeholders
    return (
      <FlatList
        data={skeletonItems}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 8, flexGrow: 1 }}
        renderItem={() => <SkeletonCard />}
      />
    );
  };

  return loading ? renderSkeletons() : (
    <FlatList
      data={products}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 8, flexGrow: 1 }}
      renderItem={({ item }) => <ProductCard item={item} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Image source={IMAGES.placeholder} style={styles.emptyImage} resizeMode="contain" />
          <Text style={styles.emptyText}>No products available</Text>
        </View>
      }
    />
  );
};

export default ProductGrid;


const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    flex: 1,
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
  },
  image: {
    width: '100%',
    height: 120,
    marginBottom: 8,
    bottom:2
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
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
  unit: {
    fontSize: 13,
    color: '#444',
    marginBottom: 5,
  },
  button: {
    backgroundColor: COLORS.newbuttonColor,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    tintColor: '#ccc',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },skeleton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  skeletonText: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 4,
  },
  skeletonButton: {
    height: 36,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginTop: 8,
  },
});
