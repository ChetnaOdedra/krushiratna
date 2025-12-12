import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import IMAGES from '../Util/Images';

const OrderCard = ({ item }) => {
  const formatTimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
  };
  return (
    <View style={styles.card}>
      <Image
        source={
          item?.product?.img?.[0]?.url
            ? { uri: item.product.img[0].url }
            : IMAGES.placeholder // Use your fallback image
        }
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.product_name}{` (${item.weight})`}</Text>

        <View style={styles.row}>
          <Text style={styles.price}>{`₹${item.price}`}</Text>
          <Text style={styles.dot}> • </Text>
          <Text style={styles.qty}>{`Qty: ${item.qty}`}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.statusBadge,{backgroundColor:item.orderStatus.colour_code}]}>
            <Text style={styles.statusText}>{item.orderStatus.display_name}</Text>
          </View>
          <Text style={styles.dateText}> Order Date : {formatTimestampToDate(item.created_at)}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 10,
  },
  image: {
    width: 60,
    height: 80,
    borderRadius: 8,
    resizeMode: 'contain',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: 'green',
  },
  dot: {
    fontSize: 18,
    color: '#888',
  },
  qty: {
    fontSize: 14,
    color: '#555',
  },
  statusBadge: {
    // backgroundColor: '#FDEFCF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#f2f2f2ff',
    fontWeight: '700',
    fontSize: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
});
