import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CustomHeader from "../screenComponents/CustomHeader";
import ComButton from '../components/ComButton';
import COLORS from '../Util/Colors';
import { ms } from 'react-native-size-matters';
import Api from '../Services/Api';
import showToast from '../screenComponents/showToast';
import { t } from '../translations/translationHelper';
import MinimalHeader from '../components/MinimalHeader';

const BuyerSelectionScreen = (props) => {
  const {navigation,route} = props
  const {params} = route
   const api = Api.create();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Loader state
  const [BuyerList, setBuyerList] = useState([]);
  const [SelectBtnTitle, setSelectBtnTitle] = useState("");
  const [isSell, setisSell] = useState(null);
  
  const enhancedBuyerList = params.is_sell
  ? 
  BuyerList:[
    ...BuyerList,
    { id: 'none', user: { name: t('None of the above') }, sample_request: null, price: null }
  ];
 const renderItem = ({ item, index }) => {
  const isLastItem = index === BuyerList.length;
  const toGujaratiNumber = (num) => {
    const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
    return num
        .toString()
        .split('')
        .map((digit) =>
          gujaratiDigits[parseInt(digit, 10)] ?? digit
        )
        .join('');
  };
  return (
    <TouchableOpacity 
      style={styles.row} 
      onPress={() => handleSelect(item)} 
      activeOpacity={0.7}
    >
      <View style={styles.radioCircle}>
        {selectedId === item.id && <View style={styles.selectedRadio} />}
      </View>
      <Text style={[styles.buyerName, selectedId === item.id && styles.boldText]}>
        {isLastItem ? t('None of the above') : `${t('Buyer')} - ${toGujaratiNumber(index + 1)}`}
      </Text>
      {item.id !== 'none' && item.sample_request === 1 ? (
        <Text style={styles.sampleRequest}>{t('Sample Request')}</Text>
      ) : item.id !== 'none' && item.price !== null ? (
        <View style={[styles.priceBox, selectedId === item.id && styles.priceBoxActive]}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
  const handleSelect = (item) => {

    console.log("Selected item:", item);
    if (item.price == "0")
    {
      showToast(t('Selected Buyer will update the price soon'))
      return
    }
    setSelectedId(item.id);
    setSelectedCompanyId(item.user.id);
    if (item.id === 'none') {
      setSelectBtnTitle(t('Close'));
    } else {   
      setSelectBtnTitle(item.sample_request === 1 ? t('Confirm') : t('Sell'));
    }
  };
  useEffect(() => {
    GetActiveAllBuyer();
  }, []);
  function GetActiveAllBuyer() {
    console.log("GetActiveAllBuyer categories...",);
    setLoading(true); // Start loading
    let param = {
      'id': props.route.params.id,
    }
    api.farmerGetAllBuyer(param)
      .then((response) => {
        console.log("farmerGetAllBuyer response",response.data);
        if (Array.isArray(response.data.companyOrders) && response.data.companyOrders.length > 0) {
          setBuyerList(response.data.companyOrders);
          setisSell(response.data.is_sell)
          // setSelectedId(response.data.companyOrders[0].id);
          setSelectBtnTitle(response.data.companyOrders[0].sample_request === 1 ? t('Confirm') : t('Sell'));
        } else {
          setBuyerList([]);
        }
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false); // Stop loading in case of error
      });
  }
  function SubmitOrderConfirm() {
    console.log(params);
    console.log("GetActiveAllBuyer categories...",);
    setLoading(true); // Start loading
    
    let param = { };
    if (selectedId === 'none') {
      param = {
        'id': props.route.params.id,
        'other': 1
      }
    }
    else 
    {
      param = {
        'id': props.route.params.id,
        'company_id': selectedCompanyId
      }
    }
    console.log("FarmerConfirmSellOrder param",param);
    api.farmerConfirmSellOrder(param)
      .then((response) => {
        console.log("farmerConfirmSellOrder response",response.data);
        props.navigation.navigate('RunningOrderedScreen',{item:response.data});
        showToast(t('Your Order Sell is Confirm Wait for Company Confirmation'))
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false); // Stop loading in case of error
      });
  }
  return (
    <View style={{flex:1}}>
            {/* Profile Section */}
            <MinimalHeader title={t('Buyer Selection')} onBackPress={() => props.navigation.goBack()} />
            <View style={styles.container}>
            {/* Product Title */}
             <Text style={{fontSize:22,color:'black',marginTop:10,fontWeight:'600'}}>{params.product_name}</Text>

            {/* Buyer List */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText,{left:60}]}>{t('Buyer')}</Text>
              <Text style={[styles.tableHeaderText,{right:60}]}>{t('Price')}</Text>
            </View>

            <FlatList data={enhancedBuyerList} keyExtractor={(item) => item.id} renderItem={renderItem} extraData={selectedId}
              ListFooterComponent={
                <View style={{ padding: 16 }}>
                   <View
                    style={{
                      height: ms(25),
                      backgroundColor:'black',
                      width: '25%',
                      marginLeft: ms(30),
                      borderTopLeftRadius: ms(5),
                      borderTopRightRadius: ms(5),
                      zIndex: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                  <Text style={{ color: 'white', fontSize: ms(14) }}>{t('Note')}</Text>
                  </View>
                  <View
                    style={{
                  
                      backgroundColor: '#fff',
                      zIndex: 1,
                      borderRadius: ms(15),
                      borderWidth: 1,
                      borderColor: COLORS.newLightGray,
                      padding: ms(10),
                    }}
                  >
                    <Text style={{fontSize:14,lineHeight:18}}>{t('BuyerSelectionInfo')}</Text>
                  </View>
                      </View>
              }/>
            
            <ComButton
                title={SelectBtnTitle}
                CustomeStyle={[
                  styles.btnContainer,
                  !selectedId && { backgroundColor: COLORS.newLightGray }, // dimmed color
                ]}
                onPress={SubmitOrderConfirm}
                disabled={!selectedId || isSell}
              />

          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  farmerTag: {
    backgroundColor: 'green',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
    marginTop: 3,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop:20
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadio: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  buyerName: {
    flex: 1,
    fontSize: 16,
    left:30
  },
  boldText: {
    fontWeight: 'bold',
  },
  priceBox: {
    height: 30,
    width: 60,
    borderWidth: 1,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    right:50,
    backgroundColor: '#e0f2e9',
  },
  priceBoxActive: {
    borderColor: 'black',
  },
  priceText: {
    fontSize: 14,
    color: 'black',
    color: 'green',
    
  },
  sampleRequest: {
    fontSize: 14,
    color: 'gray',
    right:30
  },
  noteContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
  noteLabel: {
    backgroundColor: 'green',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 14,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },btnContainer:{
    backgroundColor:COLORS.newbuttonColor,
    marginHorizontal:ms(10),
    marginTop:ms(20),
    marginBottom:ms(40)
  },
});

export default BuyerSelectionScreen;
