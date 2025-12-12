import React, { useState,useCallback, useEffect } from "react";
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Checkbox } from "react-native-paper";
import Api from '../../Services/Api';
import UesrMob from '../../Services/Mobxstate/UesrMob';
import VideoThumbnail from "../../components/VideoThumbnail";
import { Linking } from 'react-native';
import { t } from "i18next";
import CustomHeader from "../../screenComponents/CustomHeader";
import Fonts from "../../Util/Fonts";
const SubmitProductPriceDetail = (props) => {
  const api = Api.create();
  const{navigation,route} = props;
  const{id,approx_weight,seed,production_time,product_name,images,video} = route.params.item;
  const [submitprice, setSubmitPrice] = useState("0");
  const [data, setData] = useState([]);
  const [sampleRequest, setSampleRequest] = useState(false);
const [loading, setLoading] = useState(true); // <-- Loader state

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BuyerHome' }],
      });
      return true; // Prevent default back action
    };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () => backHandler.remove(); // Correct way to remove event listener
  }, [navigation])
);
 useEffect(() => {
    console.log("SubmitProductPriceDetail",route.params.item)
  }, []);
const handleCheckboxToggle = () => {
    setSampleRequest(!sampleRequest);
    if (!sampleRequest) {
      setSubmitPrice(""); // Clear price when checked
    } else {
      setSubmitPrice(""); // Reset to default value when unchecked
    }
  };
  
  function SubmitOrder() {
    console.log("SubmitOrder",id );
    setLoading(true); // Start loader
    let params = {};

    if (sampleRequest) {
      setSubmitPrice(""); // Clear price when checked
      params = { sample_request: true ? 1 : 0 , id: id};
    } else {
      setSubmitPrice("0"); // Reset to default value when unchecked
      params = { price: submitprice, id: id };
    }
    api.BuyerSubmitPriceORSample(params).then((response) => {
      console.log("CompanyCountAllOrder Response:", response);
      setData(response.data.data);
      props.navigation.navigate('BuyerOrderStatus',response.data.data)
      setLoading(false); // Stop loader
    }).catch((error) => {
      console.log("Error:", error);
      setLoading(false); // Stop loader
    });
  }
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader name="Rajesh Patel" role="Farmer" />
  <ScrollView contentContainerStyle={styles.container}>
      {/* User Info Section */}
      
      <View style={styles.userInfo}>
      
      </View>
      
      {/* Product Details */}
      <View style={styles.productDetails}>
        <Text style={styles.cropText}>{product_name || ""}</Text>
        <Text style={styles.label}>
          <Text style={styles.boldText}>{`${t('Weight')} -`}  </Text>{approx_weight}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.boldText}>{`${t('Seed')} -`}</Text>{seed}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.boldText}>{`${t('Production Time:')} -`}</Text>{production_time}
        </Text>
          {/* Photos and Videos */}
          <View style={styles.mediaSection}>
            <View style={styles.mediaBox}>
              <Text style={styles.mediaTitle}>{`${t('Photos')} -`}</Text>
              <View style={{ width: '100%', height: 300, marginTop: 0, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() =>  Linking.openURL(images[0].url)}>
                  <View
                    style={{
                      height: 110,
                      width: '90%',
                      backgroundColor: '#E7F0FF',
                      borderRadius: 20,
                      marginTop: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{ uri: images[0].url }}
                      style={{ height: '100%', width: '100%', borderRadius: 25 }}
                      resizeMode="center"
                    />
                  </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() =>  Linking.openURL(images[1].url)}>
                  <View
                    style={{
                      height: 110,
                      width: '90%',
                      backgroundColor: '#E7F0FF',
                      borderRadius: 20,
                      marginTop: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {images[1]?.url ? (
                        <Image
                          source={{ uri: images[1].url }}
                          style={{ height: '100%', width: '100%', borderRadius: 25 }}
                          resizeMode="center"
                        />
                      ) : (
                        <Text>{t('No Image Available')}</Text> // You can replace this with a placeholder image
                      )}
                  </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{   flex: 1, marginHorizontal: 5}}>
              <Text style={styles.mediaTitle}>{t('videos')}</Text>
              <TouchableOpacity onPress={() =>  Linking.openURL(video.url)}>
                <View
                  style={{
                    height: '82%',
                    width: '95%',
                    backgroundColor: '#E7F0FF',
                    borderRadius: 20,
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {video?.url ? (
                    <VideoThumbnail videoUrl={video.url} />
                  ) : (
                    <Text>No Video Available</Text> // You can replace this with a placeholder or a default UI
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
  

        {/* Price Input */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>{t('enterPrice')}</Text>
          <TextInput
            style={[styles.priceInput, sampleRequest && styles.disabledInput]}
            value={submitprice}
            onChangeText={setSubmitPrice}
            keyboardType="numeric"
            editable={!sampleRequest} // Disable input when checkbox is checked
          />
        </View>

        {/* Sample Request */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={sampleRequest ? "checked" : "unchecked"}
            onPress={handleCheckboxToggle}
          />
          <Text style={styles.checkboxLabel}>{t('Sample request')}</Text>
        </View>
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={() => SubmitOrder()}>
          <Text style={styles.submitText}>{t('Submit')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  cropText: { fontSize: 25, fontWeight: '500', color: '#333' },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userDetails: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  productDetails: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginVertical: 3,
  },
  boldText: {
    fontWeight: "bold",
    color: "green",
  },
  mediaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    flex:1
  },
  mediaBox: {
    flex: 1,
    marginHorizontal: 5,
  },
  mediaTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "green",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 5,
  },
  videoThumbnail: {
    width: 60,
    height: 60,
    backgroundColor: "#888",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef5e1",
    padding: 10,
    borderRadius: 5,
    marginVertical: 0,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  priceInput: {
    fontFamily:Fonts.fontTypes.base,
    height: 40,
    flex: 1,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  disabledInput: {
    backgroundColor: "#e0e0e0",
    color: "#888",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
});

export default SubmitProductPriceDetail;
