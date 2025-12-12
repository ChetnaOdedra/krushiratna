import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image as RNImage,ActivityIndicator, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomHeader from "../screenComponents/CustomHeader";
import IMAGES from "../Util/Images";
import { ScrollView } from "react-native-gesture-handler";
import ComInput3 from "../components/ComInput3";
import { ms } from "react-native-size-matters";
import { useTranslation } from 'react-i18next';
import UesrMob from "../Services/Mobxstate/UesrMob";
import ComButton from "../components/ComButton";
import COLORS from "../Util/Colors";
import Api from "../Services/Api";
import { launchImageLibrary } from 'react-native-image-picker';
import showToast from '../screenComponents/showToast';
import { Video, Image as CompressorImage } from 'react-native-compressor';
import Fonts from "../Util/Fonts";
import MinimalHeader from "../components/MinimalHeader";
import LottieView from 'lottie-react-native';
import { requestCameraAndMediaPermissions } from "../Util/permission";
import { PermissionsAndroid, Linking, Alert } from "react-native";


interface Inputs {
  name: string;
  phonenumber: string;
  address: string;
  errorpassword: string;
}

interface WeightType {
  id: string;
  name: string;
}

interface ApiResponse {
  ok: boolean;
  data: {
    data: WeightType[];
    message?: string;
  };
}

const CropForm: React.FC = (props) => {
  const [weightType, setWeightType] = useState<WeightType[]>([]);
  const [approxWeight, setApproxWeight] = useState<string | undefined>();
  const [weightId, setweightId] = useState<string | undefined>();
  const [seedSelection, setSeedSelection] = useState<string>("");
  const [productionTime, setProductionTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [imageArr, setimageArr] = useState<[]>([]); 
  const [loadingImage1, setloadingImage1] = useState<boolean>(false);
  const [loadingImage2, setloadingImage2] = useState<boolean>(false);
  const [loadingVideo, setloadingVideo] = useState<boolean>(false);
  const [videoUrl, setVideourl] = useState<string>("");
  const [SelectVideoIDs, setSelectVideoIDs] = useState<number | null>(null);
  const [isWeightInvalid, setIsWeightInvalid] = useState(false);
  const [isVideoInvalid, setIsVideoInvalid] = useState(false);
  const [isImage1Invalid, setIsImage1Invalid] = useState(false);
  const [isImage2Invalid, setIsImage2Invalid] = useState(false);
  const [showGujaratiPopup, setShowGujaratiPopup] = useState(false);
  const { seed } = props.route.params;
  const api = Api.create();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleOnChange = (newtext: string, inputtxt: string) => {
    setInputs(preStat => ({ ...preStat, [inputtxt]: newtext }));
  };
  const [inputs, setInputs] = useState<Inputs>({
    name: '',
    phonenumber: '',
    address: '',
    errorpassword: ''
  });
  const getWeight = async () => {
    try {
      console.log("Fetching categories...");
      const response: ApiResponse = await api.getWeights();
      setLoading(false);

      if (response?.ok && response.data && response.data.data) {
        console.log("response:", response.data.data);
        setWeightType(response.data.data);
      } else {
        console.error("API Error:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };


 
  const selectImage = async (ImageSelect: string) => {

    const granted = await requestCameraAndMediaPermissions();

    if (!granted) {
         Alert.alert(
          "Permission Blocked",
          "You have permanently denied camera permission. Please enable it manually from settings.",
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
   
    const options = {
      mediaType: 'photo',
      quality: 1, // Highest quality (compression happens later)
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        return;
      }
  
      if (response.assets && response.assets.length > 0) {
        
        if (ImageSelect === "Image1") {
          setloadingImage1(true)
        } else {
          setloadingImage2(true)
        }
        
        console.log('ImagePicker Selected:', ImageSelect);
        
        const originalUri = response.assets[0].uri;
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
          api.uploadMedia(compressedUri || '', 'farmer_order').then((res) => {
            console.log("Full Response:", res); // Log full response
            console.log("Response Data:", res.data.data); // Log data from response
            
            if (ImageSelect === "Image1") {
              setloadingImage1(false)
            } else {
              setloadingImage2(false)
            }
            if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
              const firstItem = res.data.data[0]; // Get the first item from the response
              console.log("First Item Data:", firstItem);
              console.log("Image URL:", firstItem.url);
              console.log("Image ID:", firstItem.id);
  
              const newImage = {
                uri: firstItem.url,
                name: ImageSelect,
                id: firstItem.id,
                localuri: compressedUri,
              };
  
              console.log("New Image Object:", newImage);
  
              if (ImageSelect === "Image1") {
                setIsImage2Invalid(false); // Reset Image2 error state
                setimageArr([newImage, imageArr[1]]);
              } else {
                setIsImage1Invalid(false); // Reset Image1 error state
                setimageArr([imageArr[0], newImage]);
              }
            } else {
              console.warn("No valid data received.");
            }
          });
        } catch (error) {
          console.log('Compression Error:', error);
        }
      }
    });
  };

  const selectVideo = async () => {
    
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

    const options = {
      mediaType: 'video',
      quality: 1, // Highest quality, will be compressed later
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setloadingVideo(true)
        const videoUri = response.assets[0].uri;
        console.log('Original Video Path:', videoUri);
  
        try {
          // Compress Video Under 15MB
          const compressedVideoUri = await Video.compress(videoUri, {
            compressionMethod: 'auto', // Auto compression
            quality: 0.6, // Adjust quality (lower for better compression)
            maxSize: 15 * 1024 * 1024, // 15MB limit
          });
  
          console.log('Compressed Video Path:', compressedVideoUri);
  
          // Upload Compressed Video
          api.uploadVideo(compressedVideoUri || '', 'farmer_order_video').then((res) => {
            setloadingVideo(false)
            console.log('Upload Successful:', res.data);
            setSelectVideoIDs(res.data.data[0].id);
            setIsVideoInvalid(false);
            setVideourl(compressedVideoUri);
          });
  
        } catch (error) {
          console.log('Compression Error:', error);
        }
      }
    });
  };
  useEffect(() => {
   getWeight();
   setSeedSelection("-");
   setProductionTime("1 Month")
  }, []);

  useEffect(() => {
    if (UesrMob?.user?.user) {
      setName(`${UesrMob.user.user.name} ${UesrMob.user.user.surname}`);
      setPhone(UesrMob.user.user.mobile_number);
      setAddress(UesrMob.user.user.address);
    }
    getWeight();
  }, [UesrMob]);


  const handleWeightChange = (text: string) => {
    setApproxWeight(text);
  };
  const isValidate = () => {
    const fields = [
      { key: weightType, message: t('Please enter Weight Type'), isArray: true },
      { key: approxWeight, message: t('Please enter Approx Weight') },
      { key: weightId, message: t('Please enter Weight ID') },
      { key: seedSelection, message: t('Please enter Seed Selection') },
      { key: productionTime, message: t('Please enter Production Time') },
      { key: name, message: t('Please enter your Name') },
      { key: phone, message: t('Please enter your Mobile Number') },
      { key: address, message: t('Please enter your Address') },
      { key: SelectVideoIDs, message: t('Please provide a Video URL') }
    ];
  
    // 🔹 Log all field values
    console.log("Validation Data:", {
      weightType,
      approxWeight,
      weightId,
      seedSelection,
      productionTime,
      name,
      phone,
      address,
      SelectVideoIDs,
      imageArr,
    });
  
      // Example for weight validation
    if (!approxWeight || String(approxWeight).trim() === '') {
      showToast(t('Please enter Approx Weight'));
      setIsWeightInvalid(true);  // 👈 set red border
      return false;
    } else {
      setIsWeightInvalid(false); // ✅ reset on success
    }

     if (SelectVideoIDs === null) {
      setIsVideoInvalid(true); // 👈 set red border
      showToast(t('Please provide a Video'));
      return false;
    }
    
          // ✅ Safely check Image 1
        if (!imageArr || !imageArr[0]) {
          setIsImage1Invalid(true);
          showToast(t('Please upload Image 1'));
          return false;
        } else {
          setIsImage1Invalid(false);
        }

        // ✅ Safely check Image 2
        if (!imageArr || !imageArr[1]) {
          setIsImage2Invalid(true);
          showToast(t('Please upload Image 2'));
          return false;
        } else {
          setIsImage2Invalid(false);
        }


    // Validate all required fields
    for (const field of fields) {
      if (!field.key || (field.isArray && field.key.length === 0)) {
        showToast(field.message);
        return false;
      }
    }
  
    // // ✅ Ensure `imageArr` has at least 2 images
    // if (!imageArr || imageArr.length < 2) {
    //   showToast(t('Please upload at least 2 images'));
    //   return false;
    // }
  
    return true;
  };
  
  
    const SubmitFormAPI = async () => {
      // Start loading
      setLoading(true);

      // ✅ Run validation
      const isValid = isValidate();
      if (!isValid) {
        setLoading(false); // stop loading if invalid
        return;
      }

      console.log(JSON.stringify(props.route.params.id));

      // ✅ Build request body
      const farmerOrderRequest = {
        subcategory_id: `${props.route.params.id}`,
        weight_id: weightId,
        approx_weight: approxWeight,
        seed: seedSelection,
        production_time: productionTime,
        name: name,
        mobile_no: phone,
        address: address,
        product_name: props.route.params.name,
        media_id: imageArr.map(item => item?.id), // only send IDs
        media_video_id: SelectVideoIDs,
      };

      console.log("farmerOrderRequest", farmerOrderRequest);

      // ✅ Make API call
      try {
        const res = await api.farmerOrderAPI(farmerOrderRequest);
        console.log('farmerOrderAPI', res.data);

        if (res.ok) {
          setShowGujaratiPopup(true); // Show confirmation popup
          console.log('Order submitted successfully', res.data);
          setTimeout(() => {
            props.navigation.navigate('RunningOrderedScreen');
            showToast(t('Order submitted successfully'));
          }, 2000);
          showToast(t('Order submitted successfully'));
        } else {
          console.log('Order submission failed', res.data);
          showToast(t('Order submission failed'));
        }
      } catch (error) {
        console.log('farmerOrderAPI', error);
        showToast(t('Order submission failed'));
      } finally {
        setLoading(false);
      }
    };


  return (
    <View style={{ backgroundColor: COLORS.white }}>
      <MinimalHeader title={t('Selling Form')} onBackPress={() => props.navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ paddingHorizontal :20, paddingVertical: 0, backgroundColor: COLORS.white }}>
   
          {/* Weight Type Dropdown */}
          <View style={{ height: 80, width: '100%', flexDirection: 'column', marginTop: 15 }}>
            <View style={{ flex: 1, justifyContent: 'center',marginBottom: 10  }}>
              <Text>{t('Weight Type:')}</Text>
            </View>
            <View style={{ flex: 2,borderColor:COLORS.newLightGray, justifyContent: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 5 ,borderWidth:1}}>
              <Picker
                selectedValue={weightType}
                onValueChange={(itemValue) => setweightId(itemValue)}
                style={{ fontSize: 14, fontFamily: 'Inter_Regular'}}>
                <Picker.Item label={t("-- Select Weight --")} value="" enabled={true} color="gray"/>
                {weightType.map((type, index) => (
                  <Picker.Item key={index} label={type.name} value={type.id} />
                ))}
              </Picker>
            </View>
          </View>
          {/* Approx Weight */}
          <View style={{ height: 80, width: '100%', flexDirection: 'column', marginTop: 10, }}>
            <View style={{ flex: 1, justifyContent: 'center',marginBottom: 10 }}>
              <Text>{t('Approx Weight:')}</Text>
            </View>
            <View style={{ flex: 2, justifyContent: 'center',borderColor: isWeightInvalid ? 'red' : COLORS.newLightGray, borderWidth: 1, borderRadius: 5, height: 40 }}>
              <TextInput
                style={{ flex: 1, color: 'black', height: 30,fontSize:15}}
                keyboardType="numeric"
                onChangeText={(text) => {
                handleWeightChange(text);
                if (text.trim() !== '') setIsWeightInvalid(false); // ✅ auto clear error when user types
              }}
                placeholder={t('Enter weight')}
              />
            </View>
          </View>
          {/* Seed Selection Dropdown */}
          {
            seed.length > 0 && (
            <View style={{ height: 80, width: '100%', flexDirection: 'column', marginTop: 10 }}>
              <View style={{ flex: 1, justifyContent: 'center',marginBottom: 10  }}>
                <Text>{t('Seed Selection:')}</Text>
              </View>
              <View style={{ flex: 2, justifyContent: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 5 ,borderColor:COLORS.newLightGray,borderWidth:1}}>
                <Picker
                    selectedValue={seedSelection}
                    onValueChange={(itemValue) => setSeedSelection(itemValue)}
                    style={{
                      fontSize: 12,
                      fontFamily: 'Inter_Regular'}}
                  >
                    <Picker.Item
                      label={t("-- Select Seed --")}
                      value=""
                      color="gray"
                    />

                    {seed.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </Picker>
              </View>
            </View>
            )
          }
         
          {/* Production Time Dropdown */}
          <View style={{ height: 80, width: '100%', flexDirection: 'column', marginTop: 10 }}>
            <View style={{ flex: 1, justifyContent: 'center',marginBottom: 10  }}>
              <Text>{t('Production Time:')}</Text>
            </View>
            <View style={{ flex: 2, justifyContent: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 5 ,borderColor:COLORS.newLightGray,borderWidth:1}}>
              <Picker
                selectedValue={productionTime}
                onValueChange={(itemValue) => setProductionTime(itemValue)}
              >
                <Picker.Item label={t("-- Select Month --")} value="" color="gray" />
                <Picker.Item label={"૧ "+t("Month")} value={"૧ "+t("Month")} />
                <Picker.Item label={"૨ "+t("Months")} value={"૨ "+t("Months")} />
                <Picker.Item label={"૩ "+t("Months")} value={"૩ "+t("Months")} />
                <Picker.Item label={"૪ "+t("Months")} value={"૪ "+t("Months")} />
                <Picker.Item label={"૫ "+t("Months")} value={"૫ "+t("Months")} />
                <Picker.Item label={"૬ "+t("Months")} value={"૬ "+t("Months")} />
                <Picker.Item label={"૬ "+t("Months above")} value={"૬ "+t("Months above")} />
              </Picker>
            </View>
          </View>
          {/* Upload Pictures NEW */}
          <View style={{ width: '100%', height: 300, marginTop: 30, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text>{t('Upload Pictures:')}</Text>
              <TouchableOpacity onPress={() => selectImage("Image1")}
                disabled={loadingImage1 || loadingImage2 || loadingVideo}>
                <View style={{ height: 110, width: '90%', backgroundColor: '#fff',borderWidth:1,borderColor:isImage1Invalid ? 'red' : COLORS.newLightGray, borderRadius: 20, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                    {loadingImage1 ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                    ) : imageArr.length > 0 && imageArr[0].name === "Image1" ? (
                    <RNImage source={{ uri: imageArr[0].localuri }} style={{ height: '100%', width: '100%', borderRadius: 20 }} resizeMode={'cover'} />
                    ) : (
                    <RNImage source={IMAGES.uploadImage} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                    )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectImage("Image2")}
                disabled={loadingImage1 || loadingImage2 || loadingVideo}>
                <View style={{ height: 110, width: '90%', backgroundColor: '#fff',borderWidth:1,borderColor:isImage2Invalid ? 'red' : COLORS.newLightGray ,borderRadius: 20, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                  {loadingImage2 ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                  ) : imageArr.length > 0 && imageArr[1] && imageArr[1].name === "Image2" ? (
                  <RNImage source={{ uri: imageArr[1].localuri }} style={{ height: '100%', width: '100%', borderRadius: 20 }} resizeMode={'cover'} />
                  ) : (
                  <RNImage source={IMAGES.uploadImage} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text>{t('Upload Video:')}</Text>
                <TouchableOpacity onPress={() => selectVideo()}
                  disabled={loadingImage1 || loadingImage2 || loadingVideo}>
                <View style={{height: '85%', width: '95%', backgroundColor: '#fff', borderRadius: 20, marginTop: 10, justifyContent: 'center', alignItems: 'center',borderWidth:1, borderColor:isVideoInvalid ? 'red' : COLORS.newLightGray}}>
                  {loadingVideo ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                  ) : videoUrl != "" ? (
                  <RNImage source={{ uri: videoUrl }} style={{ height: '100%', width: '100%', borderRadius: 20 }} resizeMode={'cover'} />
                  ) : (
                  <RNImage source={IMAGES.uploadImage} style={{ height: 30, width: 30 }} resizeMode={'contain'} />
                  )}
                </View>
                </TouchableOpacity>
            </View>
            
          </View>
          
          {/* Personal Info */}
          {/* <Text style={{ fontSize: 22, color: COLORS.newGreenColor, marginTop: 0 ,fontWeight:'700',left:10}}>{t('Personal Info')}</Text>
            <View style={styles.TextboxView}>
            <ComInput3 lblcolor={"#ABB0B8"} lable={t("name")} value={name || `${UesrMob.user.user.name} ${UesrMob.user.user.surname}`} onChangeText={text => setName(text)} placeholder={t("name")} />
            </View>
            <View style={styles.TextboxView}>
            <ComInput3 lblcolor={"#ABB0B8"} lable={t("phone_number")} value={phone || `${UesrMob.user.user.mobile_number}`} onChangeText={text => setPhone(text)} placeholder={t("phone_number")} />
            </View>
            <View style={{ height: ms(100), marginTop: ms(15), }}>
            <ComInput3 lblcolor={"#ABB0B8"} lable={t("address")} value={address || `${UesrMob.user.user.address}`} onChangeText={text => setAddress(text)} placeholder={t("address")} />
            </View> */}
          {/* Submit Button */}
          
        </View>
        <ComButton
              title={t('Submit')}
              CustomeStyle={styles.btnContainer}
              onPress={SubmitFormAPI}
              disabled={loading}
        />
        <View style={{height:80}}></View>
      </ScrollView>
            {/* Confirmation Modal */}
             <Modal
                     transparent
                     visible={showGujaratiPopup}
                     animationType="fade"
                     onRequestClose={() => setShowGujaratiPopup(false)}
                   >
                     <View style={styles.modalContainer}>
                       <View style={styles.modalCard}>
                         <LottieView
                           source={IMAGES.Success}
                           autoPlay
                           style={{ width: 300, height: 300  }}
                         />
                         <Text style={styles.modalTitle}>તમારો ઓર્ડર તમારા ક્ષેત્રના ખરીદદારો ને મોકલવામાં આવ્યો છે</Text>
                         <Text style={{ textAlign: 'center', fontSize: 16, color: '#444' }}>
                           ટૂક સમય માં ' ભાવ જુઓ ' બટન પરથી ભાવ જોઈ શકાશે
                         </Text>
                       </View>
                     </View>
                   </Modal>
    </View>
  );
};

export default CropForm;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1, // allows ScrollView content to expand full height
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  uploadBox: {
    height: 120,
    borderWidth: 2,
    borderColor: '#000000ff',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
  },
  placeholderText: {
    color: '#999',
    textAlign: 'center',
  },
  fileText: {
    color: '#333',
    fontWeight: 'bold',
  },
  TextboxView:{
    height:ms(60),
    marginTop:ms(15)
},btnContainer:{
marginHorizontal:ms(20)
},
modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
});