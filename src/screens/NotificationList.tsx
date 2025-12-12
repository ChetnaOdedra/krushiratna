import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, BackHandler, Image } from 'react-native';
import MinimalHeader from '../components/MinimalHeader'; // Assuming this is your custom header
import Api from '../Services/Api';
import { useFocusEffect } from '@react-navigation/native';
import UesrMob from '../Services/Mobxstate/UesrMob';
import { t } from 'i18next';
import IMAGES from '../Util/Images';

// Notification Item Component
const NotificationItem = ({ item }) => {
  console.log('NotificationItem', item);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const { title, message, time } = item.data;
  const isRead = item.read_at !== null;
  // const date = formatDate(created_at);

  // Determine notification style
  const getTypeStyle = () => {
    switch (item.type) {
      case 'reminder':
        return styles.reminderStyle;
      case 'mention':
        return styles.mentionStyle;
      default:
        return {};
    }
  };
    function formatDateTime(input) {
      const date = new Date(input.replace(' ', 'T'));
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // convert 0 to 12
      const hourStr = String(hours).padStart(2, '0');

      return `${day}-${month}-${year} ${hourStr}:${minutes} ${ampm}`;
    }
  return (
    <View style={[styles.notificationItem, getTypeStyle(),{justifyContent:'center',alignItems:'center'}]}>
      <View style={{height:45,width:45,backgroundColor:'#e0f2e9',marginLeft:10,borderRadius:30,justifyContent:'center',alignItems:'center',bottom:5}}>
          <Image source={IMAGES.greennoti} style={{height: 20, width: 20, borderRadius: 25}} resizeMode='contain'/>
      </View>
      <View style={{ flex: 1, padding: 10 }}>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.time}>{formatDateTime(time)}</Text>
      </View>
    </View>
  );
};

const NotificationList = (props) => {
  const { navigation } = props;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const api = Api.create();

  // Back button handling
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        console.log('Back button pressed');
        if (UesrMob.user.user.role === 'company') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'BuyerHome' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove(); // Clean up back button event listener
    }, [navigation])
  );

  // Fetch notification list
  const GetNotificationList = async (page) => {
    try {
      const response = await api.GetNotificationList({ page });
      setLoading(false);
      if (response?.ok && response.data?.data) {
        setData((prevData) => {
          const newData = response.data.data;
          // Filter out items that already exist
          const uniqueData = newData.filter(
            (newItem) => !prevData.some((existingItem) => existingItem.id === newItem.id)
          );
          return [...prevData, ...uniqueData];
        });
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetNotificationList(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setData([]);
    GetNotificationList(1).then(() => setRefreshing(false));
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <MinimalHeader title={t('Notifications')} onBackPress={() => props.navigation.goBack()} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={loading && <Text style={{ textAlign: 'center', padding: 10 }}>{t('Loading...')}</Text>}
        ListEmptyComponent={!loading && <Text style={styles.noDataText}>{t('No data found')}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  notificationItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
  },
  reminderStyle: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  mentionStyle: {
    borderLeftWidth: 5,
    borderLeftColor: '#FFEB3B',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  message: {
    fontSize: 12,
    color: '#555',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 20,
  },
});

export default NotificationList;
