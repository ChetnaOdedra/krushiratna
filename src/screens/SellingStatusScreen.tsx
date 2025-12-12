import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert 
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import CustomHeader from "../screenComponents/CustomHeader";
import Api from "../Services/Api";
import { Video, Image as CompressorImage } from 'react-native-compressor';
import { CommonActions } from "@react-navigation/native";
import { t } from "../translations/translationHelper";
import Fonts from "../Util/Fonts";

import { requestCameraAndMediaPermissions } from "../Util/permission";

const SellingStatusScreen = (Props) => {
  const api = Api.create();
  const [weight, setWeight] = useState(Props.route.params.item.approx_weight);
  const [price, setPrice] = useState(Props.route.params.item.total_amount);
  const [billImage, setBillImage] = useState<string | null>(null);
  const [MidiaImageID, setMidiaImageID] = useState();
  const{navigation,route} = Props;
  // Function to handle image selection
  const selectImage = () => {
    Alert.alert("Upload Bill", "Choose an option", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" }
    ]);
  };
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
        api.uploadMedia(compressedUri || '', 'farmer_order_bill').then((res) => {
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
    console.log("ComplateOrder",Props.route.params.item);
    const {id} = Props.route.params.item;
    console.log("ComplateOrder",Props.route.params.item);

    if (!weight || !price  || !id) {
      console.log("ComplateOrder ",weight,price,billImage,id);
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!MidiaImageID) {
      Alert.alert("Error", "Please select bill image");
      return;
    }
    let params = {final_price: price, final_weight: Number(weight), media_id: MidiaImageID, order_id: id};
    console.log("farmerComplateOrder Params:", params);
    api.farmerComplateOrder(params).then((res) => {
      console.log("Full Response:", res); // Log full response
      console.log("farmerComplateOrder Response Data:", res.data); // Log data from response
      console.log("ok:", res.ok); // Log data from response
      if (res.ok) {
        Props.navigation.dispatch(
          CommonActions.reset({
              index: 1,
              routes: [{ name: 'MainTabs' }],
          })
      );
      }
      else
      {
        Alert.alert("Error", res.data.message);
      }
    }); 
  }
  // Open camera
  const openCamera =async () => {

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
    launchCamera({ mediaType: "photo", quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.assets) ProcessImageUrl(response.assets[0].uri || null);
    });
  };
  // Open gallery
  const openGallery = async() => {

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

    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (response.didCancel) return;
      if (response.assets) ProcessImageUrl(response.assets[0].uri || null);
    });
  };

  return (
    <View style={{flex:1}}>
         <CustomHeader name="Rajesh Patel" role="Farmer" />
        <View style={styles.container}>
      {/* Title */}
       <Text style={{fontSize:22,color:'black',marginTop:10,fontWeight:'600',marginBottom:20}}>{t('Selling Status')}</Text>
      {/* Final Weight */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('Final Weight (kg):')}</Text>
        <TextInput
          style={styles.input}
          value={weight}
          keyboardType="numeric"
          onChangeText={setWeight}
        />
      </View>

      {/* Final Price */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('Final Price:')}</Text>
        <TextInput
          style={styles.input}
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
      </View>

      {/* Upload Bill */}
      <TouchableOpacity style={styles.uploadContainer} onPress={selectImage}>
        <Text style={styles.uploadText}>{t('Upload Bill')}</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Show selected image */}
      {billImage && (
        <Image source={{ uri: billImage }} style={styles.image} resizeMode="contain" />
      )}

      {/* Complete Order Button */}
      <TouchableOpacity style={styles.button} onPress={() => ComplateOrder()}>
        <Text style={styles.buttonText}>{t('Complete Order')}</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  status: { color: "green", textDecorationLine: "underline" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  label: { flex: 1, fontSize: 16, fontWeight: "bold" },
  input: {
    fontFamily: Fonts.fontTypes.base,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 80,
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  uploadText: { fontSize: 16, flex: 1 },
  arrow: { fontSize: 18, fontWeight: "bold" },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});

export default SellingStatusScreen;
