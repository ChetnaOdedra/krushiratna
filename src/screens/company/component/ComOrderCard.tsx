import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Api from "../../../Services/Api";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface Item {
  id: string;
  name: string;
  orders: number;
}

const OrderCard = () => {
  const { t } = useTranslation();
  const api = Api.create();   
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    companyCountAllOrder();
  }, []);

  function companyCountAllOrder() {
    setLoading(true);
    api.companyCountAllOrder()
      .then((response) => {
        console.log("companyCountAllOrder Response:", response.data.data);
        setData(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Text style={styles.productText}>{item.name}</Text>
      <Text style={styles.orderCount}>{item.count}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>{t('Product')}</Text>
        <Text style={styles.headerText}>{t('Orders')}</Text>
      </View>

      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator size="small" color="#4CAF50" style={{ marginVertical: 10 }} />
      ) : data.length === 0 ? (
        <Text style={styles.emptyText}>{t('No orders available.')}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}

      <View style={styles.divider} />

      <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('BuyerOrderStatus')}>
        <Text style={styles.footerText}>{t('View All Orders')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    top: -15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#444',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  productText: {
    fontSize: 14,
    color: '#222',
  },
  orderCount: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    paddingVertical: 10,
  },
  footer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default OrderCard;
