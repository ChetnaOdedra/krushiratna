import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Image,
  Modal,
  TextInput,
  Pressable,
  Alert
} from "react-native";
import Api from '../../Services/Api';
import UesrMob from "../../Services/Mobxstate/UesrMob";
import BuyerCustomHeader from "../../screenComponents/BuyerCustomHeader";
import COLORS from "../../Util/Colors";
import { useFocusEffect } from '@react-navigation/native';
import { t } from "../../translations/translationHelper";
import showToast from "../../screenComponents/showToast";
import IMAGES from "../../Util/Images";
import {  launchImageLibrary } from 'react-native-image-picker';
import { Video, Image as CompressorImage } from 'react-native-compressor';
import MinimalHeader from "../../components/MinimalHeader";
  const BuyerOrderStatus = (props) => {
  const api = Api.create();
  const { navigation } = props;
  const [activeTab, setActiveTab] = useState("Confirm");
  const [OrderStatusdata, setOrderStatusdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [MidiaImageID, setMidiaImageID] = useState(); 
  // Bottom popup states
  const [showModal, setShowModal] = useState(false);
  const [finalWeight, setFinalWeight] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [billImage, setBillImage] = useState(null);
  const [SelectedConfirmOrder, SetSelectedConfirmOrder] = useState(null);
  
  const handleUpload = async() => {

    const granted = await requestCameraAndMediaPermissions();
    
       if (!granted) {
               Alert.alert(
                "પરવાનગી જરૂરી",
                "તમે કેમેરાની પરવાનગી કાયમ માટે નકારી છે. કૃપા કરીને સેટિંગ્સમાં જઈને તેને હાથેથી સક્રિય કરો.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings(),
                  },
                ]
              );
            return;
            
          }
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
      if (response.assets) ProcessImageUrl(response.assets[0].uri || null);
      }
    });
  };
  // Image upload login
  const ProcessImageUrl = async (params: string) => {
    console.log(params);
    console.log("ProcessImageUrl");
    setBillImage(params || null)
    const originalUri = params;
      console.log('Original Image URI:', originalUri);

      try {
        // Compress Image Under 15MB
        const compressedUri = await CompressorImage.compress(originalUri, {
          compressionMethod: 'auto', // Uses auto optimization
          quality: 0.6, // Adjust quality (lower for better compression)
          maxSize: 15 * 1024 * 1024, // 15MB limit
        });
        console.log('Compressed Image URI:', compressedUri);

        // Upload Compressed Image
        api.uploadMedia(compressedUri || '', 'company_order_bill').then((res) => {
          console.log("Full Response:", res); // Log full response
          console.log("Response Data:", res.data.data); // Log data from response

          if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
            const firstItem = res.data.data[0]; // Get the first item from the response
            console.log("First Item Data:", firstItem);
            console.log("Image URL:", firstItem.url);
            console.log("Image ID:", firstItem.id);
            setMidiaImageID(firstItem.id);
            const newImage = {
              uri: firstItem.url,
              id: firstItem.id,
              localuri: compressedUri,
            };
            console.log("New Image Object:", newImage);
        } else {
            console.warn("No valid data received.");
          }
        });
      } catch (error) {
        console.log('Compression Error:', error);
      }
  }
  function ComplateOrder() {
    console.log("ComplateOrder ",SelectedConfirmOrder);
    let id = SelectedConfirmOrder;
    if (!finalWeight || !finalAmount  || !id) {
      console.log("ComplateOrder ",finalWeight,finalAmount,billImage,id);
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!MidiaImageID) {
      Alert.alert("Error", "Please select bill image");
      return;
    }
    let params = {final_price: finalAmount, final_weight: finalWeight, media_id: MidiaImageID, order_id: id};
    console.log("BuyerComplateOrder Params:", params);
    api.BuyerComplateOrder(params).then((res) => {
    if (res.ok) {
        showToast(t("Order Completed Successfully!"));
        setShowModal(false);
        setFinalWeight('');
        setFinalAmount('');
        setBillImage(null);
        setMidiaImageID(null);
        SetSelectedConfirmOrder(null);
        GetOrderFromStatus();
      }
      else
      {
        Alert.alert("Error", res.data.message);
      }
    }); 
  }
  function clickToAddPrice(item) {
    navigation.navigate('SubmitProductPrice', { item });
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
  const GetOrderFromStatus = () => {
    console.log("--------------------GetOrderFromStatus------------------------");
    console.log("GetOrderFromStatus called with activeTab:", activeTab);
    let params = {};
    if (activeTab === "Confirm") params = { status: "Confirm", id: 6 };
    else if (activeTab === "Pending") params = { status: "Pending", id: 2 };
    else if (activeTab === "Rejectednew") params = { status: "Rejected", id: 5 };
    setLoading(true);
    console.log("GetOrderFromStatus", params);
    api.GetOrderFromStatus(params).then((response) => {
      setOrderStatusdata(response.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { GetOrderFromStatus(); }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({ index: 0, routes: [{ name: 'BuyerHome' }] });
        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => backHandler.remove();
    }, [navigation])
  );

  const OrderCard = ({ order }) => {
    const { created_at,id,images, approx_weight, seed, production_time, price, sample_request, product_name,weight } = order;
    // console.log("------------------------OrderCard Data:------------------------", order);
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          {images[0] && <Image source={{ uri: images[0].url }} style={styles.image} />}
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.productName}>{product_name}</Text>
            <Text style={styles.orderPeriod}>{formatOrderPeriod(created_at)}</Text>
            <View style={{ height: 0.8, backgroundColor: '#E2E2E2', marginVertical: 5 }} />
            <View style={styles.infoRow}><Text style={styles.label}>{t('Weight')}</Text><Text style={styles.detail}>{approx_weight} {weight.display_name}</Text></View>
            <View style={styles.infoRow}><Text style={styles.label}>{t('Seed')}</Text><Text style={styles.detail}>{seed}</Text></View>
            <View style={styles.infoRow}><Text style={styles.label}>{t('Production')}</Text><Text style={styles.detail}>{production_time}</Text></View>
          </View>
        </View>
        <View style={{ height: 0.8, backgroundColor: '#E2E2E2', marginTop: 10 }} />
        {
          console.log("OrderCard activeTab:", activeTab ,"````", "Sample Request:", sample_request)
        }
     {activeTab === "Confirm" && (
            <View style={styles.footerRow}>
              <Text style={styles.price}>{`\u20B9${price}/-`}</Text>
                <TouchableOpacity style={styles.confirmButton} onPress={() => {
                  console.log("Order Confirmed:", id);
                  SetSelectedConfirmOrder(id)
                  setShowModal(true)
                  
                }}>
                <Text style={styles.confirmButtonText}>{t('Confirmed Buy')}</Text>
              </TouchableOpacity>
            </View>     
        )}
        {activeTab === "Pending" && sample_request == "1" && (
           <View style={styles.footerRow}>
              <Text style={styles.price}>{`Sample requested`}</Text>
              <TouchableOpacity style={styles.confirmButton} onPress={() => clickToAddPrice(order)}>
                <Text style={styles.confirmButtonText}>{t('Add Price')}</Text>
              </TouchableOpacity>
            </View>    
       )}
       {activeTab === "Pending" && sample_request == "0" && (
           <View style={styles.footerRow}>
              <Text style={styles.price}>{`\u20B9${price}/-`}</Text>
              {/* <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>{t('Add Price')}</Text>
              </TouchableOpacity> */}
            </View>    
       )}
        {activeTab === "Rejectednew" && (
          // <TouchableOpacity onPress={() => navigation.navigate('BuyerOrderHistory', { order })}>
          <View style={styles.footerRow}>
          <Text style={styles.priceRed}>{price === "0" ? "" : `\u20B9${price}/-`}</Text>
          <Text style={styles.priceRed}>{price === "0" ? t(`Reject`) : t(`Low Price`)}</Text>
          </View>  
        // </TouchableOpacity>  
      )}
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: COLORS.newBGcolor, flex: 1 }}>
      <MinimalHeader title={t('Orders')} onBackPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'BuyerHome' }],
          })
        } />
      <View style={{ padding: 10 }}>
        <View style={styles.tabsRow}>
          {['Confirm', 'Pending', 'Rejectednew'].map((tab, index, arr) => (
            <React.Fragment key={tab}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {t(tab)}
                </Text>
              </TouchableOpacity>
              {index < arr.length - 1 && <View style={{ width: 1, backgroundColor: '#E2E2E2' }} />}
            </React.Fragment>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={OrderStatusdata}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OrderCard order={item} />}
            contentContainerStyle={{ paddingBottom: 100 }} // adjust as needed
          />
        )}
      </View>

      {/* Bottom Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>{t('Selling Status')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("Final Weight")}
              keyboardType="numeric"
              value={finalWeight}
              onChangeText={setFinalWeight}
            />
            <TextInput
              style={styles.input}
              placeholder={t("Final Amount")}
              keyboardType="numeric"
              value={finalAmount}
              onChangeText={setFinalAmount}
            />
            <TouchableOpacity style={styles.inputUpload} onPress={handleUpload}>
              <Text style={{ color: '#999' }}>{MidiaImageID ? t('Image Selected') : t('Upload Bill')}</Text>
              <Image source={IMAGES.upload_bill} style={{ width: 20, height: 20,marginRight:5,}} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => {
              ComplateOrder()
            }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('Complete Order')}</Text>
            </TouchableOpacity>
            <Pressable onPress={() => setShowModal(false)}>
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{t('Cancel')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  detail: {
    fontSize: 12,
    color: '#333',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E2E2E2'
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 0,
    alignItems: 'center'
  },
  activeTabBtn: {
    backgroundColor: COLORS.newbuttonColor
  },
  tabText: {
    color: COLORS.newbuttonColor,
    fontWeight: '600'
  },
  activeTabText: {
    color: 'white'
  },
  card: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 5
  },
  row: {
    flexDirection: 'row'
  },
  image: {
    width: 80,
    borderRadius: 10
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  orderPeriod: {
    fontSize: 12,
    color: '#555',
    marginVertical: 4
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center'
  },
  price: {
    color: COLORS.newbuttonColor,
    fontWeight: 'bold',
    fontSize: 16
  },
  confirmButton: {
    backgroundColor: COLORS.newbuttonColor,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
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
  priceRed: {
    color: COLORS.newRedColor,
    fontWeight: 'bold',
    fontSize: 16
  },
});

export default BuyerOrderStatus;
