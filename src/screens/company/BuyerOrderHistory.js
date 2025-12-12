import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Linking,
} from 'react-native';
import Api from '../../Services/Api';
import showToast from '../../screenComponents/showToast';
import MinimalHeader from '../../components/MinimalHeader';
import COLORS from '../../Util/Colors';
import { t } from 'i18next';
import IMAGES from '../../Util/Images';

const BuyerOrderHistory = (props) => {
  const api = Api.create();
  const [activeTab, setActiveTab] = useState('Completed');
  const [data, setData] = useState([]);

  useEffect(() => {
    GetListOrderHistory();
  }, [activeTab]);

  function GetListOrderHistory() {
    let params = {
      status: activeTab,
      order_status_id: activeTab === 'Completed' ? 4 : 3,
    };

    api.CompanyGetOrderHistory(params)
      .then((res) => {
        if (res.ok) {
          setData(res.data.data);
          if (res.data.data.length === 0) {
            showToast(t('No Data Found'));
          }
        } else {
          showToast(t('GetOrderHistory failed'));
        }
      })
      .catch(() => {
        showToast(t('GetOrderHistory failed'));
      });
  }

  const handleInvoice = (item) => {
    if (item.bill?.url) {
      Linking.openURL(item.bill.url);
    } else {
      showToast(t('Invoice not available'));
    }
  };
   const handleViewDetails = (item) => {

    props.navigation.navigate('CropFormDetail',item)
    // alert(`Viewing details for ${item.name}`);
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
  const renderItem = ({ item }) => (
      <View style={styles.card}>
       <TouchableOpacity onPress={() => handleViewDetails(item)}>
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
              <Text style={styles.label}>{t('Weight')}</Text>
              <Text style={styles.value}>{item.approx_weight} {item.weight.display_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Seed')}</Text>
              <Text style={styles.value}>{item.seed}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>{t('Production')}</Text>
              <Text style={styles.value}>{item.production_time}</Text>
            </View>
          </View>
        </View>
      </View>
     
       {activeTab === "Completed" && (
        
      <View style={styles.btnRow}>
        <View style={styles.Line}>
       </View>
         <TouchableOpacity style={styles.acceptBtn}onPress={() => handleInvoice(item)}>
           <Image source={IMAGES.download} style={{ width: 15, height: 15,marginRight:10, marginTop:2}} />
            <Text style={styles.labelGreen}>{t('Download Invoice')}</Text>  
         </TouchableOpacity>
       </View> 
        )}
         {/* {activeTab === "Cancellednew" && (
            // <TouchableOpacity onPress={() => console.log(item)}>
            <View style={styles.footerRow}>
            <Text style={styles.priceRed}>{item.price === "0" ? "" : `\u20B9${item.price}/-`}</Text>
            <Text style={styles.priceRed}>{item.price === "0" ? t(`Reject`) : t(`Low Price`)}</Text>
            </View>  
          // </TouchableOpacity>  
          )} */}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <MinimalHeader title={t('Order History')} onBackPress={() => props.navigation.goBack()} />

      <View style={{ padding: 10 }}>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          {['Completed', 'Cancellednew'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {t(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order List */}
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    marginBottom: 15,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: COLORS.newbuttonColor,
  },
  tabText: {
    color: COLORS.newbuttonColor,
    fontWeight: '600',
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
  headerRow: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#222',
  },
  downloadBtn: {
    color: COLORS.newbuttonColor,
    marginTop: 8,
    fontWeight: '600',
  },
   row: {
    flexDirection: 'row',
  },
  photo: {
    width: 50,
    margin: 4,
    borderRadius: 5,
    flex:0.5
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
   period: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  Line:{
    height: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 5,
    
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
   acceptBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 5,
    alignItems: 'center',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f1faed',
  },
  labelGreen: {
    fontSize: 14,
    color: '#5D9A23',
  },
   priceRed: {
    color: COLORS.newRedColor,
    fontWeight: 'bold',
    fontSize: 16
  },
   footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center'
  },
});

export default BuyerOrderHistory;
