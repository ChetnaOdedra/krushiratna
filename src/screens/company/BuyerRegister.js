//import liraries
import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { View, Text, StyleSheet,Image, ScrollView,TouchableOpacity,ToastAndroid, StatusBar } from 'react-native';
import { ms, s  } from "react-native-size-matters";
import IMAGES from '../../Util/Images';
import metrics from '../../Util/Metrics';
import Fonts from '../../Util/Fonts';
import ComInput from '../../components/ComInput';
import ComButton from '../../components/ComButton';
import COLORS from '../../Util/Colors';
import StateDropdown from '../../components/StateDropdown';
import CityDropdown from '../../components/CityDropdown';
import TalukaDropdown from '../../components/TalukaDropdown';
import ProductDropdown from '../../components/ProductDropdown';
import { justAnAlert } from "../../Util/alert";
import Api from '../../Services/Api'
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-simple-toast';
import showToast from '../../screenComponents/showToast';
import MinimalHeader from '../../components/MinimalHeader';
// create a component

const BuyerRegister = (props) => {
  const { t } = useTranslation();
  const api = Api.create()
  const [Loding,setLoding] = useState(false)
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedProducts, setSelectedProduct] = useState([]);
  const [selectedTaluka, setselectedTaluka] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  
    const [inputs,setInputs] = useState({
        name:'',
        phoneNumber:'',
        aadharNumber:'',
        companyName:'',
        companyAddress:'',
      });
      const handleOnChange = (newtext,inputtxt) => {
        setInputs(preStat => ({...preStat,[inputtxt]:newtext}))
      };

      const isValidate = () => {
          const fields = [
            {
              key: 'name',
              message: t('Please enter your Name'),
            },
            {
              key: 'phoneNumber',
              message: t('Please enter your Mobile Number'),
              pattern: /^\d{10}$/,  // Accept any 10-digit number
              invalidMessage: t('Please enter a valid 10-digit Mobile Number'),
            },
            {
              key: 'companyName',
              message: t('Please enter your Company Name'),
            },
            {
              key: 'companyAddress',
              message: t('Please enter your Company Address'),
            },
          ];

          for (const field of fields) {
            if (!inputs[field.key]) {
              showToast(field.message);
              return false;
            }
            if (field.pattern && !field.pattern.test(inputs[field.key])) {
              showToast(field.invalidMessage);
              return false;
            }
          }

          const selections = [
            { key: selectedState, message: t('Please select a State') },
            { key: selectedCity, message: t('Please select a City') },
            { key: selectedTaluka, message: t('Please select a Taluka') },
            { key: selectedProducts, message: t('Please select a Product') },
            // { key: imageUri, message: t('Please upload Aadharcard') },
          ];

          for (const selection of selections) {
            if (!selection.key) {
              showToast(selection.message);
              return false;
            }
          }

          return true;
        };


      
      const btnClickOnRegisterBuyer = async () =>
        {
          console.log("----------")
          console.log(selectedTaluka)
          if (isValidate())
          {
            const userData = {
              name: inputs.name,
              mobile_number: inputs.phoneNumber,
              aadhar_number: inputs.aadharNumber,
              aadhar_photo:imageUri,
              owner_name: inputs.companyName,
              address: inputs.companyAddress,
              state_id: selectedState.id,
              city_id: selectedCity.id,
              taluka_id: selectedTaluka,
              subcategory_id: selectedProducts.map(model => model.id),
              code_for:"sign_up",
              zipcode:"3",
              village:"x"
            }
              setLoding(true)
              api.RegisterSendOTP(inputs.phoneNumber)
              .then((response) => {
                console.log(`------${JSON.stringify(response.data)}`)
                setLoding(false)
              if (response?.ok) {
                console.log("RegisterSendOTP -",response.data)
                NextScreen(userData)
              } else {
                const validationMessage = extractValidationMessages(response.data);
                console.log("RegisterSendOTP -",validationMessage)
                justAnAlert(response.data.message,validationMessage)
                // console.log("API REJECT",response.data.message)
              }
            })
            .catch((err) => {
                console.log(err)
              setLoding(false)
            });
          }
          else
          {
            // Toast.show(t('Please fill all Required detail'))
          }
        
        }
        
      function NextScreen(formData) {
        props.navigation.navigate('OtpScreen', { 
          data: formData,
          isfrom:'CompanyReg',
          phoneNumber: inputs.phoneNumber // Pass phoneNumber as a parameter
        });
      }
    
      const extractValidationMessages = (errorResponse) => {
        if (!errorResponse.errors) return "Unknown error occurred.";
    
        return Object.values(errorResponse.errors)
            .flat() // Flatten the array (in case multiple messages exist for one field)
            .join("\n"); // Join messages with a new line
    };
    return (
        <View style={styles.container}>
          {/* <StatusBar hidden={false} backgroundColor="#ffffff" barStyle="dark-content" /> */}
            <MinimalHeader title={t('create_account')} onBackPress={() => props.navigation.goBack()} />
            <ScrollView style={{backgroundColor:COLORS.backgroundColor}}>
            
            <Text style={{fontSize:22,color:'black',marginTop:20,left:20,fontWeight:'600'}}>{t('Owner Info')}</Text>
            <ComInput lblcolor={"#ABB0B8"} lable={t("name")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'name')} placeholder={t("name")} />
            <ComInput lblcolor={"#ABB0B8"} Ktype={'Code'} lable={t("phone_number")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'phoneNumber')} placeholder={t("enter_your_phone_number")} />
            {/* <ComInput lblcolor={"#ABB0B8"} Ktype={'Code'} lable={t("Aadhar Number")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'aadharNumber')} placeholder={t("Aadhar Number")} />
            <TouchableOpacity onPress={handleImagePick} activeOpacity={0.7}>
             <View style={{height:180,backgroundColor:'#E7F0FF',marginTop:20,marginHorizontal:20,borderRadius:10}}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    resizeMode='contain'
                  />
                ) : (
                  <Image
                    source={IMAGES.uploadImage}
                    style={{ height: 50, width: 50 ,position:'absolute',alignSelf:'center',top:'40%'}}
                    resizeMode='center'
                  />
                )}
                <Text style={{fontWeight:600,top:-15,borderRadius:15,left:15,height:30,color:'#ABB0B8',backgroundColor:COLORS.white,paddingVertical:'5',width:150,alignContent:'center',justifyContent:'center',textAlign:'center'}}>{t('Upload Aadhar Card')}</Text>
                </View>
                </TouchableOpacity> */}
                <Text style={{fontSize:22,color:'black',marginTop:20,left:20,fontWeight:'600'}}>{t('Company Info')}</Text>
                <ComInput lblcolor={"#ABB0B8"} lable={t("name")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'companyName')} placeholder={t("name")} />
                <ComInput lblcolor={"#ABB0B8"} lable={t("address")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'companyAddress')} placeholder={t("address")} />
                <Text style={{fontSize:22,color:'black',marginTop:20,left:20,fontWeight:'600'}}>{t("Buying Info")}</Text>

                <StateDropdown  onSelect={(selectedState) => { 
                    setSelectedState(selectedState)
                    handleOnChange(selectedState.id, 'StateID');
                    console.log('Selected State:', selectedState);
                    // Access: selectedState.id, selectedState.name, etc.
                }}/>
              <CityDropdown value={selectedCity} selectedState={selectedState} onSelectCity={(selectedCity) => {
                handleOnChange(selectedCity.id, 'CityID');
                setSelectedCity(selectedCity)
                  console.log('Selected City:', selectedCity);
                  // Access: selectedState.id, selectedState.name, etc.
              }} />
              <TalukaDropdown selectedCity={selectedCity}
               onSelectTaluka={(selectedTaluka) => {
                setselectedTaluka(selectedTaluka.id)
                console.log('Selected Talukas:', selectedTaluka);
                  // Access: selectedState.id, selectedState.name, etc.
              }}/>
              <ProductDropdown
                lblcolor="black"
                onSelect={(product) => setSelectedProduct(product)}
              />
              <ComButton title={t('get_otp')} CustomeStyle={styles.btnContainer} onPress={() => btnClickOnRegisterBuyer()} />
              <View style={{height:100}}></View>
             </ScrollView>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    MainTitle: {
        ...Fonts.FontStyle.Logintitle,
        width:'100%',
       textAlign:'center',
        marginTop:0,
        },
      btnContainer:{
        backgroundColor:COLORS.newbuttonColor,
        marginHorizontal:metrics.marginHorizontal,
        marginTop:ms(36)
      },
    container: {
        flex: 1,

    },
});

//make this component available to the app
export default BuyerRegister;
