import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, StatusBar,Switch } from 'react-native';
import PriceModal from '../../screenComponents/PriceModal';
import Api from '../../Services/Api';


import { useTranslation } from 'react-i18next';

import showToast from '../../screenComponents/showToast';
import HeaderSwitcher from '../../screenComponents/HeaderSwitcher';
import OrderCard from './component/ComOrderCard';
import ComTodaysOrder from './component/ComTodaysOrder';
import YardPriceTable from './component/YardPriceTable';
import { useFocusEffect } from '@react-navigation/native';


const BuyerHome = () => {
  const { t } = useTranslation();
  const api = Api.create();
  const [productList, setProductList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [MinPrice, setMinPrice] = useState('');
  const [MaxPrice, setMaxPrice] = useState('');
  const [ProductName, setProductName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  function UpdateProductStatus(item) {
    console.log(UpdateProductStatus,item)
    setSelectedProduct(item);
    setProductName(item.subcategory.name);
    setMinPrice(item.min_price.toString());
    setMaxPrice(item.max_price.toString());
    setModalVisible(true);
  }

  function handlePrice(item) {
    const params = {
      id: item.id,
      min_price: item.min_price,
      max_price: item.max_price,
      status: item.status == 0 ? 1 : 0
    };

    api.updateProductStatus(params)
      .then((response) => {
        setRefreshKey(prev => prev + 1); 
        setModalVisible(false);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1); // Forces screen to rerender
    }, [])
  );
  function handleSave(updatedMinPrice, updatedMaxPrice) {
    console.log("-----------------",updatedMinPrice)
    if (!selectedProduct) return;

    const params = {
      id: selectedProduct.id,
      min_price: updatedMinPrice,
      max_price: updatedMaxPrice,
    };

    api.updateProductPrice(params)
      .then((response) => {
        console.log("updateProductPrice",params)
        showToast(t('Price updated successfully'), 'success');
        setModalVisible(false);
        setRefreshKey(prev => prev + 1);  // ⬅️ Trigger re-render
      })
      .catch((error) => {
        console.log("updateProductPrice",params)
        console.log("Error:", error);
      });
  }

  return (
    <View style={{ flex: 1 }} key={refreshKey}>
    {/* <StatusBar hidden={false} backgroundColor="#ffffff" barStyle="dark-content" /> */}
    <HeaderSwitcher/>
      <ScrollView>
      <YardPriceTable onEditPress={UpdateProductStatus} refreshKey={refreshKey} onToggleStatus={handlePrice}/>
      <Text style={[styles.bold,{top:-10}]}>{t('Orders')}</Text>
      <OrderCard/>
      <Text style={[styles.bold,{top:-10}]}>{t('New Orders')}</Text>
      <ComTodaysOrder/>
      </ScrollView>
      <PriceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        MinPrice={MinPrice}
        Maxprice={MaxPrice}
        onSave={handleSave}
        ProductName={ProductName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  productTitleContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    alignItems: 'center',
    marginTop: 10,
    
  },
  productRow: {
    flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      marginHorizontal: 15,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      padding: 10,
      elevation: 1,
  },
  bold: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginHorizontal: 18,
  },
  priceInput: {
    padding: 5,
    width: 80,
    backgroundColor: '#B1D40895',
    textAlign: 'center',
    borderRadius: 5,
    fontWeight: '500',
  },
  sectionHeader: {
    height: 30,
    backgroundColor: '#EEEEEE',
    marginTop: 20,
    justifyContent: 'center',
  },
  productText: {
  flex: 1,
  fontWeight: '500',
},
highBox: {
  backgroundColor: '#d2f2d2',
  borderRadius: 5,
  paddingVertical: 6,
  paddingHorizontal: 10,
  marginHorizontal: 5,
  minWidth: 50,
  alignItems: 'center',
},
lowBox: {
  backgroundColor: '#f9d2d2',
  borderRadius: 5,
  paddingVertical: 6,
  paddingHorizontal: 10,
  marginHorizontal: 5,
  minWidth: 50,
  alignItems: 'center',
},
priceText: {
  fontWeight: '600',
  fontSize: 13,
},
switch: {
  transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  marginHorizontal: 6,
  
},
});

export default BuyerHome;
