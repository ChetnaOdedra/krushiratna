// Import libraries
import React, { useState, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { ms } from "react-native-size-matters";
import IMAGES from '../Util/Images';
import metrics from '../Util/Metrics';
import Fonts from '../Util/Fonts';
import ComButton from '../components/ComButton';
import COLORS from '../Util/Colors';
import Api from '../Services/Api';
import { justAnAlert } from '../Util/alert';
import UesrMob from "../Services/Mobxstate/UesrMob";
import showToast from '../screenComponents/showToast';
import { useTranslation } from 'react-i18next';
const OtpScreen = (props) => {
     const { t } = useTranslation();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    
    const api = Api.create();

    // Create references for OTP input fields
    const otpInputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    // Handle OTP change
    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
    
        if (value) {
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].current.focus();
            }
        } else {
            // If user clears input manually, we update it
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };
    
    const btnClickOnSendRegisterBuyer = async (userData) =>
    {
      console.log(`btnClickOnSendRegisterBuyer`)
      api.BuyerRegisterAPI(userData.name,userData.owner_name,otp.join(''),userData.mobile_number,userData.state_id,userData.city_id,userData.taluka_id
      ,userData.address,userData.village,userData.zipcode,userData.subcategory_id,userData.aadhar_photo)
      .then((response) => {
        setLoading(false);
        if (response?.ok) {
            UesrMob.updateUserMobx(response.data);
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [{ name: 'BuyerHome' }],
                })
            );
        } else {
            justAnAlert("Error", response.data.message);
        }
      })
      .catch((err) => {
          console.log(err);
          setLoading(false);
      });
    }
    const btnClickOnSendRegisterUser = async (name, surname, mobile_number, state_id, city_id, taluka_id, village, zipcode, address) => {
        setLoading(true);
        api.userRegister(name, surname, mobile_number, state_id, city_id, taluka_id, address, village, zipcode, otp.join(''))
            .then((response) => {
                setLoading(false);
                if (response?.ok) {
                    UesrMob.updateUserMobx(response.data);
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: 'MainTabs' }],
                        })
                    );
                } else {
                    justAnAlert("Error", response.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };
    function ResendOTP(params) {
        if (props.route.params.isfrom === "Reg") {
            api.RegisterSendOTP(params).then((response)=>{
                if (response.ok)
                {
                    showToast(t("OTP Resend successfully"))
                }

            }).catch(()=>{

            })
        } else if (props.route.params.isfrom === "CompanyReg") {
            api.RegisterSendOTP(params).then((response)=>{
                if (response.ok)
                {
                    showToast(t("OTP Resend successfully"))
                }

            }).catch(()=>{

            })
            console.log("Company Registration Process");
        } else {
            api.authenticateSendOTP(params).then((response)=>{
                if (response.ok)
                {
                    showToast(t("OTP Resend successfully"))
                }
             }).catch(()=>{

            })
           
        }
    }
    const btnClickOnSendAuthenticate = async (otp, mobileNo) => {
        setLoading(true);
        api.authenticate(mobileNo, otp)
            .then((response) => {
                console.log("btnClickOnSendAuthenticate",response);
                setLoading(false);
                if (response?.ok) {
                   if (response?.data.user.role == "company")
                   {
                    UesrMob.updateUserMobx(response.data);
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: 'BuyerHome' }],
                        })
                    );
                   }
                   else
                   {
                    UesrMob.updateUserMobx(response.data);
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: 'MainTabs' }],
                        })
                    );
                   }
                    
                } else {
                    justAnAlert("Error", response.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const handleVerify = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length > 3) {
            if (props.route.params.isfrom === "Reg") {
                const { Name, Surname, StateID, CityID, TalukaID, Vilage, Pincode, PhoneNo, Address } = props.route.params.data;
                btnClickOnSendRegisterUser(Name, Surname, PhoneNo, StateID, CityID, TalukaID, Vilage, Pincode, Address);
            } else if (props.route.params.isfrom === "CompanyReg") {
                console.log("Company Registration Process");
                btnClickOnSendRegisterBuyer(props.route.params.data)
                console.log(props.route.params.data);
            } else {
                btnClickOnSendAuthenticate(enteredOtp, props.route.params.phoneNumber);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={IMAGES.krushi_icon} />
            </View>

            <Text style={styles.MainTitle}>{t('Verify Phone')}</Text>
            <Text style={{ ...Fonts.FontStyle.otpSubTitle, textAlign: 'center' }}>
                {`+91${props.route.params.phoneNumber} ${t('Code sent to')}`}
            </Text>

            <View style={styles.otpWrapper}>
                <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                    key={index}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={otpInputs[index]}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            if (otp[index] === '' && index > 0) {
                                const newOtp = [...otp];
                                newOtp[index - 1] = '';
                                setOtp(newOtp);
                                otpInputs[index - 1].current.focus();
                            }
                        }
                    }}
                />
                ))}
                </View>
            </View>

            <Text style={{ ...Fonts.FontStyle.otpSubTitle, textAlign: 'center' }}>{t('Didn’t_otp')}</Text>
            <TouchableOpacity onPress={() => ResendOTP(props.route.params.phoneNumber)}>
                <Text style={{ ...Fonts.FontStyle.otpSubTitle, textAlign: 'center', color: COLORS.greenText }}>{t('Resend')}</Text>
            </TouchableOpacity>

            <ComButton title={t('Verify')} CustomeStyle={styles.btnContainer} onPress={handleVerify} />
        </View>
    );
};

// Define styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoContainer: {
        height: '30%',
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 250,
        height: 120,
        resizeMode: 'contain',
        position: 'absolute'
    },
    MainTitle: {
        ...Fonts.FontStyle.Logintitle,
        width: '100%',
        textAlign: 'center',
        marginTop: -10,
    },
    btnContainer: {
        backgroundColor: COLORS.newbuttonColor,
        marginHorizontal: metrics.marginHorizontal,
        marginTop: ms(36)
    },
    otpWrapper: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent:'space-evenly',
        width: '65%',
        marginBottom: 20,
    },
    otpInput: {
        fontFamily: Fonts.fontTypes.base,
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        borderColor: COLORS.newBorderColor,
    },
});

export default OtpScreen;
