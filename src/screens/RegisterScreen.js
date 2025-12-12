//import liraries
import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { View, Text, StyleSheet,Image, ScrollView, StatusBar } from 'react-native';
import { ms, s  } from "react-native-size-matters";
import IMAGES from '../Util/Images';
import metrics from '../Util/Metrics';
import Fonts from '../Util/Fonts';
import ComInput from '../components/ComInput';
import ComButton from '../components/ComButton';
import COLORS from '../Util/Colors';
import StateDropdown from '../components/StateDropdown';
import CityDropdown from '../components/CityDropdown';
import TalukaDropdown from '../components/TalukaDropdown';
import { justAnAlert } from "../Util/alert";
import Api from '../Services/Api'
import { useTranslation } from 'react-i18next';
import showToast from '../screenComponents/showToast';
import MinimalHeader from '../components/MinimalHeader';
// create a component

const RegisterScreen = (props) => {
  const { t } = useTranslation();
  const api = Api.create()
  const [Loding,setLoding] = useState(false)
    const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTaluka, setselectedTaluka] = useState(null);
    const [inputs,setInputs] = useState({
        Name:'',
        Surname:'',
        StateID:'',
        CityID:'',
        TalukaID:'',
        Vilage:'',
        Pincode:'',
        PhoneNo:'',
        Address:'',
      });
      const handleOnChange = (newtext,inputtxt) => {
        setInputs(preStat => ({...preStat,[inputtxt]:newtext}))
      };

  const isValidate = () => {
        const fields = [
          { key: 'Name', message: t('Please enter your Name') },
          { key: 'Surname', message: t('Please enter your Surname') },
          {
            key: 'PhoneNo',
            message: t('Please enter your Mobile Number'),
            pattern: /^\d{10}$/,
            invalidMessage: t('Mobile Number must be exactly 10 digits'),
          },
          { key: 'StateID', message: t('Please select your State') },
          { key: 'CityID', message: t('Please select your City') },
          { key: 'TalukaID', message: t('Please select your Taluka') },
          { key: 'Vilage', message: t('Please enter your Village') },
          {
            key: 'Pincode',
            message: t('Please enter your Pincode'),
            pattern: /^\d{6}$/,
            invalidMessage: t('Pincode must be exactly 6 digits'),
          },
          { key: 'Address', message: t('Please enter your Address') },
        ];

        console.log('--- Validating Fields ---');
        for (const field of fields) {
          const value = inputs[field.key];
          console.log(`Checking field [${field.key}]:`, value);

          if (!value) {
            console.warn(`Missing field: ${field.key}`);
            showToast(field.message);
            return false;
          }

          if (field.pattern && !field.pattern.test(String(value))) {
            console.warn(`Invalid pattern for: ${field.key}`, value);
            showToast(field.invalidMessage);
            return false;
          }
        }

        console.log('---1---');

        console.log("selectedState:", selectedState);
        console.log("selectedCity:", selectedCity);
        console.log("selectedTaluka:", selectedTaluka);
        const selections = [
          { key: selectedState, message: t('Please select a State'), name: 'selectedState' },
          { key: selectedCity, message: t('Please select a City'), name: 'selectedCity' },
          { key: selectedTaluka, message: t('Please select a Taluka'), name: 'selectedTaluka' },
        ];

        console.log('--- Checking Selections ---');
        for (const selection of selections) {
          console.log(`Checking selection [${selection.name}]:`, selection.key);

          if (
            selection.key === undefined ||
            selection.key === null ||
            selection.key === '' ||
            (Array.isArray(selection.key) && selection.key.length === 0)
          ) {
            console.warn(`Missing selection: ${selection.name}`);
            showToast(selection.message);
            return false;
          }
        }

        console.log('--- Validation Passed ---');
        return true;
      };



      const btnClickOnSendAuthenticate = async () =>
        {
         
          if (isValidate())
          {
                api.RegisterSendOTP(inputs.PhoneNo)
                .then((response) => {
                  console.log(`------${response}`)
                  setLoding(false)
                if (response?.ok) {
                  console.log("Data Stored in mobx -",response.data)
                  NextScreen(inputs)
                } else {
                  setLoding(false)
                  const validationMessage = extractValidationMessages(response.data);
                  console.log("RegisterSendOTP -",validationMessage)
                  justAnAlert(response.data.message,validationMessage)
                }
              })
              .catch((err) => {
                  console.log(err)
                setLoding(false)
              });
          }
          else
          {
            // showToast(t("Please fill all Required detail"));
          }
        
        }
    const extractValidationMessages = (errorResponse) => {
      if (!errorResponse.errors) return "Unknown error occurred.";

      return Object.values(errorResponse.errors)
          .flat() // Flatten the array (in case multiple messages exist for one field)
          .join("\n"); // Join messages with a new line
    };  
  function NextScreen(params) {
    props.navigation.navigate('OtpScreen', { 
      data: params,
      isfrom:'Reg',
      phoneNumber: inputs.PhoneNo // Pass phoneNumber as a parameter
    });
  }
    return (
        <View style={styles.container}>
          
        {/* <StatusBar hidden={false} backgroundColor="#ffffff" barStyle="dark-content" /> */}
        <MinimalHeader title={t("create_account")} onBackPress={() => props.navigation.goBack()} />
            <ScrollView style={{backgroundColor:COLORS.backgroundColor}}>
            <ComInput lblcolor={"#ABB0B8"} lable={t("name")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'Name')} placeholder={t("name")} />
            <ComInput lblcolor={"#ABB0B8"} lable={t("surname")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'Surname')} placeholder={t("surname")} />
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
                handleOnChange(selectedTaluka.id, 'TalukaID');
                setselectedTaluka(selectedTaluka)
                  console.log('Selected Talukas:', selectedTaluka);
                  // Access: selectedState.id, selectedState.name, etc.
              }}/>
              <ComInput lblcolor={"#ABB0B8"} lable={t("village")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'Vilage')} placeholder={t("village")} />
              <ComInput lblcolor={"#ABB0B8"} lable={t("pincode")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'Pincode')} placeholder={t("pincode")} />
              <ComInput lblcolor={"#ABB0B8"} lable={t("address")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'Address')} placeholder={t("address")} />
              <ComInput lblcolor={"#ABB0B8"} Ktype={'Code'} lable={t("phone_number")} error={inputs.erroremail} onChangeText={text => handleOnChange(text, 'PhoneNo')} placeholder={t("enter_your_phone_number")} />
              <ComButton title={t("get_otp")} CustomeStyle={styles.btnContainer} onPress={() => btnClickOnSendAuthenticate()} />
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
        marginTop:ms(20),
        marginBottom:ms(20),
        backgroundColor:'white', 
      },
      btnContainer:{
        backgroundColor:COLORS.newbuttonColor,
        marginHorizontal:metrics.marginHorizontal,
        marginTop:ms(36)
      },
    container: {
        flex: 1,
        backgroundColor:COLORS.white

    },
});

//make this component available to the app
export default RegisterScreen;
