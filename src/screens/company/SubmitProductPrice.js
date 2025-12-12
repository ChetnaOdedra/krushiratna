import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,TouchableOpacity
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import HeaderSwitcher from '../../screenComponents/HeaderSwitcher';
import { Linking } from 'react-native';
import VideoThumbnail from '../../components/VideoThumbnail';
import { t } from "i18next";
import COLORS from '../../Util/Colors';
import ComInput from '../../components/ComInput';
import ComButton from '../../components/ComButton';
import Api from '../../Services/Api';
import MinimalHeader from '../../components/MinimalHeader';
const IMAGE_HEIGHT = 200;

const SubmitProductPrice = (props) => {
  
  const api = Api.create();
  const { navigation, route } = props;
  const {
    id,
    approx_weight,
    seed,
    production_time,
    product_name,
    images,
    video,
    weight
  } = route.params.item;
  const [data, setData] = useState([]);
  const [imageSizes, setImageSizes] = useState([]);
  const [sampleRequest, setSampleRequest] = useState(false);
  const [submitprice, setSubmitPrice] = useState('0');
  const [loading, setLoading] = useState(true); // <-- Loader state
  const isButtonEnabled = sampleRequest || (submitprice && submitprice !== '0');
  const handleCheckboxToggle = () => {
    setSampleRequest(!sampleRequest);
    setSubmitPrice('');
  };

  useEffect(() => {
    const fetchSizes = async () => {
      const promises = images.map((img) => {
        return new Promise((resolve) => {
          Image.getSize(
            img.url, // ✅ using correct field
            (width, height) => {
              const ratio = width / height;
              resolve({ width: IMAGE_HEIGHT * ratio, height: IMAGE_HEIGHT });
            },
            () => resolve({ width: IMAGE_HEIGHT, height: IMAGE_HEIGHT }) // fallback
          );
        });
      });

      const sizes = await Promise.all(promises);
      setImageSizes(sizes);
    };

    fetchSizes();
  }, []);

  if (imageSizes.length !== images.length) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }
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
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      
      <MinimalHeader title={t("Orders")} onBackPress={() => props.navigation.goBack()} />
      <ScrollView>
      <View style={styles.card}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {images.map((img, index) => (
             <TouchableOpacity onPress={() =>  Linking.openURL(img.url)}>
            <Image
              key={index}
              source={{ uri: img.url }}
              style={{
                width: imageSizes[index].width,
                height: imageSizes[index].height,
                marginRight: 10,
                borderRadius: 10,
                backgroundColor: '#ccc',
              }}
              resizeMode="cover"
            />
            </TouchableOpacity>
          ))}
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
                    <></>// You can replace this with a placeholder or a default UI
                  )}
                </View>
              </TouchableOpacity>
        </ScrollView>

        <Text style={styles.title}>{product_name || 'Product'}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.label}>{t('Weight')}</Text>
          <Text style={styles.value}>{approx_weight} {weight.display_name}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>{t('Seed')}</Text>
          <Text style={styles.value}>{seed}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>{t('Production Time')}</Text>
          <Text style={styles.value}>{production_time}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{t('Enter Price')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('Enter Amount')}
            keyboardType="numeric"
            value={submitprice}
            onChangeText={setSubmitPrice}
          />
          <Text style={styles.or}>{t('Or')}</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={sampleRequest ? 'checked' : 'unchecked'}
                onPress={handleCheckboxToggle}
              />
              <Text style={styles.checkboxLabel}>{t('Sample Request')}</Text>
            </View>
          </View>
        </View>
      </View>
        {/* Submit Button */}
        <ComButton
          title={t('Submit')}
          CustomeStyle={[
            styles.logoutButton,
            !isButtonEnabled && { backgroundColor: '#ccc' } // or any disabled color
          ]}
          onPress={() => SubmitOrder()}
          disabled={!isButtonEnabled}
        />
        </ScrollView>
     </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageScroll: {
    height: IMAGE_HEIGHT,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontWeight: '500',
    color: '#555',
  },
  value: {
    color: '#333',
  },
  inputContainer: {
    marginTop: 16,
    backgroundColor: '#f1faed',
    padding: 12,
    borderRadius: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // center horizontally inside inner container
},
  checkboxLabel: {
  marginLeft: 0,
  color: '#333',
  textAlign: 'center',
},
submitButton: {
    backgroundColor: COLORS.newbuttonColor,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutButton: {
    marginVertical: 20,
    height: 45,
    marginHorizontal: 20,
  },
});

export default SubmitProductPrice;
