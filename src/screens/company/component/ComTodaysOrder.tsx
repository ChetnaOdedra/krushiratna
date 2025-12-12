import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Api from "../../../Services/Api";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import showToast from "../../../screenComponents/showToast";
import { DeviceEventEmitter } from 'react-native';

interface Item {
  id: string;
  name: string;
  weight: number;
  seed: string;
  photos: string[];
}

const ComTodaysOrder = ({ onActionCompleted, refreshKey }) => {
  const { t } = useTranslation();
  const api = Api.create();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const getTodaysOrder = async () => {
    setLoading(true);
    try {
      const response = await api.companyTodaysOrders();
      console.log("getTodaysOrder  Response:", response);
      setData(response?.data?.data ?? []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodaysOrder();
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('refreshTodaysOrder', () => {
      console.log('Received refreshTodaysOrder event');
      getTodaysOrder();
    });

    return () => {
      subscription.remove(); // Clean up
    };
  }, []);

  function AcceptTapped(item) {
    if (!item) return;
    console.log("Accept Tapped", item);
    navigation.navigate("SubmitProductPrice", {
      item,
      onGoBack: () => {
        if (onActionCompleted) onActionCompleted();
      },
    });
  }

  function RejectTapped(item) {
    if (!item) return;
    setLoading(true);
    api
      .RejectOrder(item)
      .then((response) => {
        console.log("RejectOrder", response);
        getTodaysOrder();
        showToast(t("Order rejected successfully!"));
        if (onActionCompleted) onActionCompleted();
      })
      .catch((error) => {
        console.log("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
const formatOrderPeriod = (startTimestamp: number) => {
  const endTimestamp = startTimestamp + 48 * 60 * 60; // Add 48 hours in seconds

  const format = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return `${t('Order Period')}: ${format(startTimestamp)} - ${format(endTimestamp)}`;
};
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={{flex:1}} onPress={() => AcceptTapped(item)}>
    <View style={styles.card}>
      <View style={styles.row}>
        {item?.images?.[0]?.url ? (
          <>
            {console.log("Image URL:", item.images[0].url)}
            <Image source={{ uri: item.images[0].url }} style={styles.photo} />
          </>
        ) : (
          <View style={[styles.photo, { backgroundColor: '#ccc' }]} />
        )}
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={styles.productName}>{item?.product_name ?? 'N/A'}</Text>
          <Text style={styles.period}>{formatOrderPeriod(item?.created_at)}</Text>
          <View style={styles.Line}></View>
          <View style={styles.detailsWrapper}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Weight')}</Text>
              <Text style={styles.value}>{item?.approx_weight ?? 'N/A'}  {item.weight.display_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Seed')}</Text>
              <Text style={styles.value}>{item?.seed ?? 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Production')}</Text>
              <Text style={styles.value}>{item?.production_time ?? 'N/A'}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.Line}></View>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => AcceptTapped(item)}>
          <Text style={styles.acceptText}>{t('Accept')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => RejectTapped(item)}>
          <Text style={styles.rejectText}>{t('Reject')}</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ margin: 15, top: -15 }}>
      <FlatList
        data={data ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
        scrollEnabled={false}
        ListEmptyComponent={
        !loading && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 16 }}>{t("No data found")}</Text>
          </View>
        )
      }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  Line:{
    height: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 5,
    
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 6,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  period: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  detailsWrapper: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  label: {
    fontSize: 13,
    color: '#444',
  },
  value: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#DFF5E1',
    borderRadius: 6,
    marginRight: 5,
    alignItems: 'center',
  },
  acceptText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#FEE1E1',
    borderRadius: 6,
    marginLeft: 5,
    alignItems: 'center',
  },
  rejectText: {
    color: '#E53935',
    fontWeight: '600',
  },
  photo: {
    width: 50,
    margin: 4,
    borderRadius: 5,
    flex:0.5
  },
});


export default ComTodaysOrder;
