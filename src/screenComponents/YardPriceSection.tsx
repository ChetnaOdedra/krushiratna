import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Api from '../Services/Api';
import { t } from '../translations/translationHelper';
import { set } from 'mobx';
const samplePrices = [
  { crop: 'Kapas', high: 1650, low: 1400, trend: 'up' },
  { crop: 'Shing', high: 2400, low: 2560, trend: 'up' },
  { crop: 'Tomato', high: 980, low: 1000, trend: 'down' },
  { crop: 'Wheat', high: 590, low: 850, trend: 'up' },
  { crop: 'Bajra', high: 700, low: 680, trend: 'up' },
  { crop: 'Maize', high: 1300, low: 1250, trend: 'down' },
];

const YardPriceSection = (props) => {
const [YardData, setYardData] = useState([]);
const [TalukaName, setTalukaName] = useState('');
const [date, setDate] = useState('');

const api = Api.create();
  
const { width: deviceWidth } = Dimensions.get('window');
const navigation = useNavigation();
const renderRow = (item: typeof YardData[0], index: number) => {
    const isUp = item.is_up === 1 ? true : false;
    return (
      
      // <View key={index} style={styles.row}>
        <TouchableOpacity key={index} style={styles.row} onPress={() => navigation.navigate('YardPriceDetailScreen')}>
        <Text style={styles.crop}>{item.subcategory_name}</Text>
        <Text style={[styles.price, styles.greenBox]}>{item.max_price}</Text>
        <Text style={[styles.price, styles.redBox]}>{item.min_price}</Text>
        <View style={{ flex: 1, alignItems: 'center' }}>
        <Icon
            name={isUp ? 'trending-up' : 'trending-down'}
            size={20}
            color={isUp ? 'green' : 'red'}
            style={{right:20}}
        />
        </View>
        </TouchableOpacity>
      // </View>
    );
};
useEffect(() => {
    api.NewYardPrice()
      .then((response) => {
        if (response.status === 200) {
          console.log('Yard Price Data:---------------', response.data.data);
          setYardData(response.data.data);
          if (response?.data?.data?.length > 1) {
            const talukaName = response.data.data[0]?.taluka_name;
            const createDate = response.data.data[0]?.created_at;


            const date = new Date(createDate * 1000);

            const formattedDate =
              date.getDate().toString().padStart(2, "0") + "-" +
              (date.getMonth() + 1).toString().padStart(2, "0") + "-" +
              date.getFullYear();

            console.log(formattedDate);

            setTalukaName(talukaName);
            setDate(formattedDate)

            console.log('Taluka Name:', talukaName);
          } else {
            console.log('Data has one or no item.');
          }
        } else {
          console.error('Error fetching weather:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching weather:', error);
      });
}, []);
  return (
    <View style={styles.container}>


      <View style={styles.headerRow}>

        <Text style={styles.headerTitle}>{TalukaName}</Text>
       
        <TouchableOpacity onPress={() => navigation.navigate('YardPriceDetailScreen')}>
          <Text style={styles.viewAll}>{t("view_all")}</Text>
        </TouchableOpacity>
      </View>

              <Text style={{ fontSize: 14}}>{date}</Text>



      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled = {false}>
        <View style={{ width: deviceWidth - 20 }}>
          {/* Table Header */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.crop, styles.headerText]}>{t("Crop")}</Text>
            <Text style={[styles.price, styles.headerText]}>{t("High")}</Text>
            <Text style={[styles.price, styles.headerText]}>{t("Low")}</Text>
            <Text style={[styles.headerText, { flex: 1,textAlign:'center',right:10 }]}>{t("trend")}</Text>
          </View>
          {/* Table Rows */}
          {YardData.slice(0, 5).map(renderRow)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      borderRadius: 10,
      backgroundColor: '#fff',
      margin: 10,
      padding: 10,
      elevation: 2,marginHorizontal: 15,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    viewAll: {
      color: 'green',
      fontWeight: '700',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingRight: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
      width: '100%',    
      marginBottom: 6,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: '#aaa',
      marginBottom: 5,
    },
    crop: {
      flex: 1,
      fontWeight: '500',
      paddingRight: 10,
    },
    price: {
      flex: 1,
      textAlign: 'center',
      padding: 4,
      borderRadius: 5,
      marginRight: 10, // 👈 space b
    },
    greenBox: {
      backgroundColor: '#e0f2e9',
      color: 'green',
    },
    redBox: {
      backgroundColor: '#fce8e6',
      color: 'red',
    },
    headerText: {
      fontWeight: 'bold',
    },
});
  

export default YardPriceSection;
