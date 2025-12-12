import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,ActivityIndicator
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Api from '../../../Services/Api';
import { t } from 'i18next';

const YardPriceTable = ({ onEditPress, refreshKey,onToggleStatus }) => {

  const api = Api.create();
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
        <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center',height: 40 }}>
            <Text style={styles.cellText}>{item.subcategory.name}</Text>
        </View>
        <View style={{ flex: 1.4, flexDirection: 'row', width: '10%',height: 40}}>
        <Switch
        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],marginLeft: 10 }}
                value={item.status == "1"}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                thumbColor={'#fff'}
                onValueChange={() => {
                  updateStatus(item);
                  onToggleStatus(item);
                  
                }}
        />
       </View>
        <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', width: '10%',height: 40, justifyContent: 'center' }}>
          <View style={[styles.priceBox, { backgroundColor: '#DFF5E1' ,flex: 1,alignItems: 'center'}]}>
              <Text style={[styles.priceText, { color: '#4CAF50' }]}  numberOfLines={1}>{item.max_price}</Text>
          </View>
        </View>
        <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', width: '10%',height: 40, justifyContent: 'center' }}>
        <View style={[styles.priceBox, { backgroundColor: '#fce8e6' ,flex: 1,alignItems: 'center'}]}>
            <Text style={[styles.priceText, { color: 'red' }]}  numberOfLines={1}>{item.min_price}</Text>
        </View>
        </View>
        <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center', width: '10%',height: 40, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => {
                onEditPress(item);
            }}>
             <FontAwesome5 name="edit" size={18} color="#555" />
             </TouchableOpacity>
        </View>

    </View>
  );

useEffect(() => {
  console.log("useEffect: YardPriceTable ");
  GetActiveProduct();
}, [refreshKey]); // ✅ using destructured value directly
const updateStatus = async (item) => {
  const newStatus = item.status === "1" ? "0" : "1";
  const updatedList = productList.map((p) =>
        p.id === item.id ? { ...p, status: newStatus } : p
      );
      setProductList(updatedList); // ✅ update locally after confirmation
      
};

function GetActiveProduct() {
    setLoading(true);
    api.companyuserProducts()
    .then((response) => {
        console.log("companyuserProducts",response);
    setProductList(response.data.data);
    setLoading(false);
    })
    .catch((error) => {
    console.log("Error:", error);
    setLoading(false);
    });
  }
  return (
  <View style={styles.container}>
    {loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    ) : (
      <>
        <View style={styles.headerRow}>
          <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', height: 20 }}>
            <Text style={[styles.headerText, { left: 5 }]}>{t('Product')}</Text>
          </View>
          <View style={{ flex: 1.4, flexDirection: 'row', width: '10%', height: 20 }}>
            <Text style={[styles.headerText, { textAlign: 'center' }]}>{t('Status')}</Text>
          </View>
          <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', height: 20 }}>
            <Text style={[styles.headerText, { textAlign: 'center' }]}>{t('High')}</Text>
          </View>
          <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', width: '10%', height: 20, justifyContent: 'center' }}>
            <Text style={[styles.headerText, { textAlign: 'center' }]}>{t('Low')}</Text>
          </View>
          <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center', width: '10%', height: 20, justifyContent: 'center' }} />
        </View>

        <View style={styles.Line} />

        <FlatList
          data={productList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </>
    )}
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    top: -5,
  },loaderContainer: {
  paddingVertical: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
  Line: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
    marginHorizontal: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    marginBottom: 8,

  },
  headerText: {
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
    color: '#000000',
    justifyContent:'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 5,
  },
  cellText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    left: 5,
    fontWeight: '500',
  },
  priceBox: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginHorizontal: 5,
    height: 30,
  },
  priceText: {
    fontSize: 14,
    flex: 1,
  },
});

export default YardPriceTable;
