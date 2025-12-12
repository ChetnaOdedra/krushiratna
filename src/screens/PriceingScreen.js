import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,Dimensions } from 'react-native';
import COLORS from '../Util/Colors';
import ComButton from '../components/ComButton';
import { ms } from 'react-native-size-matters';
import Api from '../Services/Api';
import { t } from '../translations/translationHelper';
import MinimalHeader from '../components/MinimalHeader';
const { width } = Dimensions.get('window');
const PriceingScreen = (props) => {
  
  const api = Api.create();
  const [priceData, setPriceData] = useState([]);
  const [buyerData, setbuyerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMarketingYard = async () => {
    try {
      const subcategory = props.route.params.id;
      const response = await api.getMarketingYardData(subcategory);
      setLoading(false);
      if (response?.ok && response.data?.data) {
        setPriceData(response.data.data);
      }

      const Krushiresponse = await api.getMarketingKrushiRatnaData(subcategory);
      if (Krushiresponse?.ok && Krushiresponse.data?.data) {
        setbuyerData(Krushiresponse.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching categories:", error);
    }
  };
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
  useEffect(() => {
    getMarketingYard();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MinimalHeader title={t('Pricing')} onBackPress={() => props.navigation.goBack()} />
      <View style={styles.container}>
        <Text style={{ fontSize: ms(18), color: 'black', marginTop: ms(10) ,marginBottom: ms(10),fontWeight:'700'}}>
          {props.route.params.name}
        </Text>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          
          <View style={styles.card}>
            <View style={styles.listcontainer}>
            <View style={{ flex: 0.9 ,backgroundColor:'#fff',padding:ms(5),borderRadius:ms(3)}}>
              <Text style={{ fontWeight: '800', color: COLORS.black,left:-5 }}>{t('Marketing Yard')}</Text>
            </View>
            <View style={{width:8}}></View>
            <View style={{ flex: 1 ,backgroundColor:"#fff",padding:ms(5),borderRadius:ms(5)}}>
              <Text style={{ fontWeight: '800', color: COLORS.newDarkGreenHeanding,textAlign:'center' }}>{t('Highest Price')}</Text>
            </View>
            <View style={{width:10}}></View>
            <View style={{ flex: 1 ,backgroundColor:"#fff",padding:ms(5),borderRadius:ms(5)}}>
              <Text style={{ fontWeight: '800', color: COLORS.newDarkGreenHeanding,textAlign:'center'}}>{t('Lowest Price')}</Text>
            </View>
          </View>
          {/* <View style={styles.listcontainer1}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: 'black' }}>{t('')}</Text>
            </View>
          </View> */}
          {priceData.length > 0 ? (
            priceData.map((digit, index) => (
              <View
                key={digit.id || index}
                style={{
                  height: ms(40),
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
  
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text >{digit.yard.name}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: ms(5),
                    margin: ms(5),
                    backgroundColor: '#e0f2e9',
                    height: ms(25),
                    
                  }}
                >
                <Text style={{color:'green'}}>{toGujaratiNumber(digit.max_price)}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderRadius: ms(5),
                    margin: ms(5),
                    justifyContent: 'center',
                    backgroundColor: '#fce8e6',
                    height: ms(25),
                  }}
                >
                  <Text style={{color:'red'}}>{toGujaratiNumber(digit.min_price)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text>{t('No data found')}</Text>
          )}
          </View>
       <View style={styles.card}>
        <View style={styles.listcontainer}>
            <View style={{ flex: 0.9 ,backgroundColor:'#fff',padding:ms(5),borderRadius:ms(3)}}>
              <Text style={{ fontWeight: '800', color: COLORS.black,left:-5 }}>{t('KrushiRatna Price')}</Text>
            </View>
            <View style={{width:8}}></View>
            <View style={{ flex: 1 ,backgroundColor:"#fff",padding:ms(5),borderRadius:ms(5)}}>
              <Text style={{ fontWeight: '800', color: COLORS.newDarkGreenHeanding,textAlign:'center' }}>{t('Highest Price')}</Text>
            </View>
            <View style={{width:10}}></View>
            <View style={{ flex: 1 ,backgroundColor:"#fff",padding:ms(5),borderRadius:ms(5)}}>
              <Text style={{ fontWeight: '800', color: COLORS.newDarkGreenHeanding,textAlign:'center'}}>{t('Lowest Price')}</Text>
            </View>
          </View>
          {/* <View style={styles.listcontainer1}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', color: 'black' }}>{t('KrushiRatna Price')}</Text>
            </View>
          </View> */}
          
          {buyerData.length > 0 ? (
            buyerData.map((digit, index) => (
              <View
                key={index}
                style={{
                  height: ms(30),
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text>{`${t('Buyer')} - ${toGujaratiNumber(index + 1)}`}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderRadius: ms(5),
                    justifyContent: 'center',
                    margin: ms(5),
                    backgroundColor: '#e0f2e9',
                    height: ms(25),
                  }}
                >
                  <Text style={{color:'green'}}>{toGujaratiNumber(digit.max_price)}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: ms(5),
                    margin: ms(5),
                    backgroundColor: '#fce8e6',
                    height: ms(25),
                  }}
                >
                  <Text style={{color:'green'}}>{toGujaratiNumber(digit.min_price)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text>{t('No data found')}</Text>
          )}
        </View>
          <View
            style={{
              height: ms(150),
              flex: 1,
              flexDirection: 'column',
              marginVertical: ms(20),
              
            }}
          >
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
                flex: 1,
                backgroundColor: '#fff',
                zIndex: 1,
                borderRadius: ms(15),
                borderWidth: 1,
                borderColor: COLORS.newLightGray,
                padding: ms(10),
              }}
            >
              <Text style={{fontSize:14,lineHeight:18}}>{t('Pricing Note')}</Text>
            </View>
          </View>
        </ScrollView>

        <ComButton
          title={t('Proceed to Sell')}
          CustomeStyle={styles.btnContainer}
          onPress={() => props.navigation.navigate('CropForm', props.route.params)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listcontainer: {
    height: ms(30),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: ms(5),


  },
   listcontainer1: {
    height: ms(30),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: ms(0),
    marginBottom: ms(5),
  },
  container: {
    flex: 1,
    paddingLeft: ms(20),
    paddingRight: ms(20),
    backgroundColor: COLORS.white,
  },
  btnContainer: {
   marginBottom:20
  },
  card: {
    width: '98%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
    marginHorizontal: 5,
  },
});

export default PriceingScreen;
