import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Image, Pressable, Alert } from 'react-native';
import Api from '../Services/Api';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useCallback } from 'react';
import { t } from '../translations/translationHelper';
import COLORS from '../Util/Colors';
import MinimalHeader from '../components/MinimalHeader';
import {  Image as CompressorImage } from 'react-native-compressor';
import IMAGES from '../Util/Images';
import RunningOrderUpload from '../components/RunningOrderUpload';
import KShopApi from '../Services/KShopApi';
import OrderCard from '../components/OrderCard';


const RunningOrderedScreen = (props) => {
  const{navigation,route} = props;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const api = Api.create();
  const Kapi = KShopApi.create();
  // Bottom popup states+++
  const [showModal, setShowModal] = useState(false);
  const [SelectedConfirmOrder, SetSelectedConfirmOrder] = useState(null);
  const [KshopOrders, setKshopOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Completed');
  const handleViewDetails = (item) => {
    props.navigation.navigate('CropFormDetail',item)
    // alert(`Viewing details for ${item.name}`);
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove(); // Correct way to remove event listener
    }, [navigation])
  );
  const handleViewPrice = (item) => {
    if (item.is_ready_for_complete == true) {
      SetSelectedConfirmOrder(item.id)
      setShowModal(true);
      console.log("SelectedConfirmOrder",item.id);
    }
    else 
    {
      props.navigation.navigate('BuyerSelectionScreen',item)
    }
    
    console.log('View Price  Clicked:', item.name);
    // alert(`Viewing price for ${item.name}`);
  };
  const GetRunningOrder = async (page) => {
    try {
      console.log("Fetching RunningOrder...",props.route.params);
      const response = await api.GetRunningOrder({ page });
      setLoading(false);
      if (response?.ok && response.data?.data) {
        console.log("RunningOrder:", response.data.data);
        setData(prevData => {
          const newData = response.data.data;
          // Filter out items that already exist
          const uniqueData = newData.filter(
            newItem => !prevData.some(existingItem => existingItem.id === newItem.id)
          );
        
          return [...prevData, ...uniqueData];
        });
      } else {
        console.error("API Error:", response);
      }
    } catch (error) {
      console.error("Error fetching RunningOrder:", error);
      setLoading(false);
    }
  };
  const GetKshopOrder = async (page) => 
  {
    Kapi.KshopOrderList().then(response => {
      if (response.ok) {
        console.log("KshopOrder:", response.data.data);
        setKshopOrders(response.data.data)
      } else {
        
      }
    });
  }
  useEffect(() => {
    if (props.route?.params?.from === "ProductDetailScreen") {
        setActiveTab(t('K Store'));
      } else {
        setActiveTab(t('Crop Sell'));
      }
    
  }, []);
  useEffect(() => {
    console.log(activeTab === t('Crop Sell'));
      if (activeTab === t('Crop Sell')) {
        GetRunningOrder(0);
      }
      else if (activeTab === t('K Store')) {
        GetKshopOrder(0);
      }
      
   }, [page,activeTab]);
const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
};
const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setData([]);
    GetRunningOrder(1).then(() => setRefreshing(false));
};
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
const ItemCard = ({ item, onViewDetails, onViewPrice }) => {
  const {is_ready_for_complete} = item;
  console.log('is_ready_for_complete:', is_ready_for_complete);
  return (
     <View style={styles.card}>
      <TouchableOpacity onPress={() => onViewDetails(item)}>
      <View style={styles.row}>
       {item.images[0] && (
        <>
          {console.log("Image URL:", item.images[0].url)}
          <Image source={{ uri: item.images[0].url }} style={styles.photo} />
        </>
      )}
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <View style={styles.detailRow}>
              <Text style={styles.productName}>{item.product_name}</Text>
              {/* <Text style={styles.price}>{`\u20B9${item.price}/-`}</Text> */}
          </View>
          <Text style={styles.period}>{formatOrderPeriod(item.created_at)} </Text>
          <View style={styles.Line}>
           </View>
          {/* Fixed info row layout */}
          <View style={styles.detailsWrapper}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Approx Weight')}</Text>
              <Text style={styles.value}>{item.approx_weight} {item.weight.display_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Seed')}</Text>
              <Text style={styles.value}>{item.seed}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Production Time')}</Text>
              <Text style={styles.value}>{item.production_time}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.Line}>
       </View>
       {is_ready_for_complete === true ? (
            <View style={styles.btnRow}>
             <TouchableOpacity style={styles.viewBtn} onPress={() => onViewDetails(item)}>
                {/* <Image
                  source={IMAGES.download}
                  style={{ width: 15, height: 15, marginRight: 10, marginTop: 2 }}
                /> */}
                <Text style={styles.labelGreen}>{t('View Detail')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ReadyBtn} onPress={() => onViewPrice(item)}>
                {/* <Image
                  source={IMAGES.download}
                  style={{ width: 15, height: 15, marginRight: 10, marginTop: 2 }}
                /> */}
                <Text style={styles.labelred}>{t('Ready for Complete')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => onViewDetails(item)}>
                {/* <Image
                  source={IMAGES.download}
                  style={{ width: 15, height: 15, marginRight: 10, marginTop: 2 }}
                /> */}
                <Text style={styles.labelGreen}>{t('View Detail')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => onViewPrice(item)}>
                {/* <Image
                  source={IMAGES.download}
                  style={{ width: 15, height: 15, marginRight: 10, marginTop: 2 }}
                /> */}
                <Text style={styles.labelGreen}>{t('View Price')}</Text>
              </TouchableOpacity>
            </View>
          )}
      </TouchableOpacity>
    </View>
  );
};
const KshopOrderCard = ({ item, onViewDetails, onViewPrice }) => {

  console.log('is_ready_for_complete:', item);
  return (
     <OrderCard
       item={item}
     />
  );
};
  
  return (
    <View style={{backgroundColor:'white',flex:1}}>
      <MinimalHeader title={t('My Orders')} onBackPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          })
        } />
      
      {/* Tabs */}
      <View style={styles.tabsRow}>
        {[t('Crop Sell'), t('K Store')].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
            onPress={() => setActiveTab(t(tab))}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {t(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <Text style={{fontSize:20,color:'black',marginTop:10,fontWeight:'700',left:10,marginBottom:20}}>{String(t('Running Orders'))}</Text> */}
      <FlatList
          data={activeTab === t('Crop Sell') ? data : KshopOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            if (activeTab === t('Crop Sell')) {
              return (
                <ItemCard
                  item={item}
                  onViewDetails={handleViewDetails}
                  onViewPrice={handleViewPrice}
                />
              );
            } else if (activeTab === t('K Store')) {
              return (
                <KshopOrderCard
                  item={item}
                  onViewDetails={handleViewDetails}
                  onViewPrice={handleViewPrice}
                />
              );
            } else {
              return (
                <ItemCard
                  item={item}
                  onViewDetails={handleViewDetails}
                  onViewPrice={handleViewPrice}
                />
              );
            }
          }}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={
            loading ? (
              <Text style={{ textAlign: 'center', padding: 10 }}>{t('Loading...')}</Text>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.noDataText}>{t('No data found')}</Text>
            ) : null
          }
        />

        {/* Bottom Modal */}
          <RunningOrderUpload
            visible={showModal}
            onClose={() => setShowModal(false)}
            SelectedConfirmOrder={SelectedConfirmOrder}
            api={api}
            navigation={navigation}
          />

    </View>
    
  );
};

const styles = StyleSheet.create({
   tabText: {
    color: COLORS.newbuttonColor,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    marginBottom: 15,
    marginHorizontal: 10,
    marginTop: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: COLORS.newbuttonColor,
  },
  list: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  id: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5D9A23',
    marginRight: 10,
    height:20,
    width:20,
    alignItems:'center',
    justifyContent:'center',
    lineHeight:20,
    textAlign:'center',
    borderWidth:1,
    borderRadius:10,
    borderColor:'#5D9A23',
    marginTop: -15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewDetails: {
    color: COLORS.newbuttonColor,
    marginTop: 0,
    textDecorationLine: 'underline',
    fontWeight:'bold'
  },
  viewPriceButton: {
    backgroundColor: COLORS.newbuttonColor,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  viewPriceCompleted: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  viewPriceText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  inputUpload: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  modalButton: {
    backgroundColor: COLORS.newbuttonColor,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
   activeTabText: {
    color: '#fff',
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
  photo: {
    width: 50,
    margin: 4,
    borderRadius: 5,
    flex: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  period: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  Line: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 5,
  },
  detailsWrapper: {
    marginTop: 4,
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
  acceptBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 5,
    alignItems: 'center',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f1faed',
  },
    viewBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 5,
    alignItems: 'center',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#d1eac0',
  },
   ReadyBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 5,
    alignItems: 'center',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fce8e6',
  },
  labelGreen: {
    fontSize: 15,
    color: '#5D9A23',
    fontWeight: '700',
  },
  labelred: {
    fontSize: 15,
    color: '#D32F2F',
  },
  priceRed: {
    color: COLORS.newRedColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});

export default RunningOrderedScreen;


