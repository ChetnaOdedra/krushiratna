import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import BuyerCustomHeader from '../screenComponents/BuyerCustomHeader';
import CustomHeader from '../screenComponents/CustomHeader';
import UesrMob from '../Services/Mobxstate/UesrMob';
import Api from '../Services/Api';
import CityDropdown from '../components/CityDropdown';
import TalukaDropdown from '../components/TalukaDropdown';
import COLORS from '../Util/Colors';
import MinimalHeader from '../components/MinimalHeader';
import { t } from 'i18next';
import ComButton from '../components/ComButton';

const { width: deviceWidth } = Dimensions.get('window');

const YardPriceDetailScreen = (props) => {
const api = Api.create();
const [selectedCity, setSelectedCity] = useState(null);
const [selectedTaluka, setSelectedTaluka] = useState(null);
const [yardData, setYardData] = useState([]);
const [talukaName, setYardName] = useState('');
const [createdDate, setCreateDate] = useState('');
const [showFilterModal, setShowFilterModal] = useState(false);
const [selectedState, setSelectedState] = useState(null);

// Default state object with ID 1
const defaultState = { id: 1, name: 'Default State' };
  useEffect(() => {
    api
      .NewYardPrice()
      .then((response) => {
        if (response.status === 200) {
          setYardData(response.data.data);
          const talukaName = response.data.data[0]?.taluka_name;
          const createDate = response.data.data[0]?.created_at;
         const date = new Date(createDate * 1000);

            const formattedDate =
              date.getDate().toString().padStart(2, "0") + "-" +
              (date.getMonth() + 1).toString().padStart(2, "0") + "-" +
              date.getFullYear();

            console.log(formattedDate);

            setYardName(talukaName);
            setCreateDate(formattedDate)
        
        } else {
          console.error('Error fetching yard price:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching yard price:', error);
      });
  }, []);

  const renderRow = ({ item }: { item: any }) => {
    const isUp = item.is_up === 1;
    return (
      <View style={styles.row}>
        <Text style={styles.cellCrop}>{item.subcategory_name}</Text>
        <Text style={[styles.cell, styles.greenBox]}>{item.max_price}</Text>
        <View style={{ width:10, alignItems: 'center' }}/>
        <Text style={[styles.cell, styles.redBox]}>{item.min_price}</Text>
        <View style={{ width:10, alignItems: 'center' }}/>
        <Icon
          name={isUp ? 'trending-up' : 'trending-down'}
          size={20}
          color={isUp ? 'green' : 'red'}
          style={{ marginRight: 8 ,flex: 0.2,marginLeft: 10}}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
       <MinimalHeader title={t('Marketing Yard')} onBackPress={() => props.navigation.goBack()} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* <Text style={styles.title}>
          <Text style={styles.titleUnderline}>{t('Yard Price')}</Text>
        </Text> */}
        <View>
              <Text style={styles.title}>{talukaName}</Text>
              <Text style={{fontSize:14,marginStart:15}}>{createdDate}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setShowFilterModal(true)}>
          <Text style={styles.buttonText}>{t('Change Yard')}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.title}>Change Yard</Text>
        <Icon
          name={'filter-list-alt'}
          size={30}
          color={'green'}
          style={{ marginHorizontal:20 }}
        />
    </TouchableOpacity>  */}
        </View>

        


      <ScrollView horizontal>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.cellCropHeader}>{t('Crop')}</Text>
            <View style={{ width:20, alignItems: 'center' }}/>
            <Text style={styles.cellHeader}>{t('High')}</Text>
            <View style={{ width:20, alignItems: 'center' }}/>
            <Text style={styles.cellHeader}>{t('Low')}</Text>
            <View style={{ width:20, alignItems: 'center' }}/>
            <Text style={styles.cellHeader}>{t('Trend')}</Text>
          </View>
          <FlatList
            data={yardData}
            renderItem={renderRow}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
  <Pressable style={styles.bottomModalOverlay} onPress={() => setShowFilterModal(false)}>
    <Pressable style={styles.bottomSheetContainer}>
      <Text style={styles.modalTitle}>{t('Filter')}</Text>
      {/* <View style={{padding: 10,backgroundColor:'red',margin:10}}>

      </View> */}
        <CityDropdown
          selectedState={defaultState}
          onSelectCity={(city) => setSelectedCity(city)}
          value={selectedCity}
          lblcolor="#333"
          lable="Select District"
        />
       <TalukaDropdown selectedCity={selectedCity}
          onSelectTaluka={(selectedTaluka1) => {
            setSelectedTaluka(selectedTaluka1);
        }}/>
      <ComButton
              title={t('Submit')}
              CustomeStyle={styles.btnContainer}
              onPress={() => {
          setShowFilterModal(false);
          // Add filter logic here
          api
              .NewYardPriceWithID(selectedTaluka.id)
              .then((response) => {
                if (response.status === 200) {
                  setYardData(response.data.data);
                
                } else {
                  console.error('Error fetching yard price:', response.status);
                }
              })
              .catch((error) => {
                console.error('Error fetching yard price:', error);
              });
        }}
        />
   
    </Pressable>
  </Pressable>
</Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  titleUnderline: {
    borderBottomColor: 'green',
    borderBottomWidth: 2,
  },

  table: {
    margin: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    width: deviceWidth - 24,
    paddingBottom: 10,
    
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  headerRow: {
    backgroundColor: '#f6f6f6',
  },
  cellCrop: {
    flex: 0.5,
    fontSize: 14,
    color: '#333',
  },
  cellCropHeader: {
    flex: 1.5,
    fontWeight: 'bold',
  },
  cell: {
    flex: 0.5,
    fontSize: 14,
    textAlign: 'center',
    borderRadius: 4,
    paddingVertical: 4,
  },
  cellHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  greenBox: {
    backgroundColor: '#e0f2e9',
    color: 'green',
  },
  redBox: {
    backgroundColor: '#fce8e6',
    color: 'red',
  },

  // Filter Button
  filterButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 0,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'red',
  },
  dropdownText: {
    color: '#888',
  },
  btnContainer: {
    backgroundColor: COLORS.newbuttonColor,
    height: 50,
    // borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    // marginHorizontal: 16,
    // width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 0,
    paddingBottom: 30,
    width: '100%',
    paddingHorizontal: 16,
  },
   button: {
    backgroundColor: COLORS.newbuttonColor,
    marginRight: 20,
    borderRadius: 6,
    paddingVertical:5,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default YardPriceDetailScreen;
