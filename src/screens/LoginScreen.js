import React, { useState,useEffect } from "react";
import StateDropdown from '../components/StateDropdown';
import CityDropdown from '../components/CityDropdown';
import TalukaDropdown from '../components/TalukaDropdown';
import ProductDropdown from '../components/ProductDropdown';
import { CommonActions } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Easing,
  StatusBar
} from "react-native";
import OtpInput from "../components/OtpInput";
import Api from "../Services/Api";
import { justAnAlert } from "../Util/alert";
import { t } from "i18next";
import UesrMob from "../Services/Mobxstate/UesrMob";
import { set } from "mobx";
import showToast from "../screenComponents/showToast";
import { Image } from "react-native";
import IMAGES from "../Util/Images";

const LoginScreen = (props) => {
  const api = Api.create();
  const [selectedProducts, setSelectedProduct] = useState([]);
  const [selectedTab, setSelectedTab] = useState("login");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [companyname, setcompanyname] = useState("");
  const [VilageName, setVilageName] = useState("");
  const [address, setaddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [registerRole, setRegisterRole] = useState(null); // "farmer" or "company"
  const [registerStep, setRegisterStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTaluka, setselectedTaluka] = useState(null);
  const [loginStep, setLoginStep] = useState(1); // step 1: enter mobile, step 2: enter OTP
  const [focusedInput, setFocusedInput] = useState(null);
  const [errors,setErrors] = useState({
          mobileerr:false,
          Fregname:false,
          Fregmobile:false,
          Fregvilage:false,
          Fregaddress:false,
          Fregstate:false,
          Fregcity:false,
          Fregstaluka:false,
          Cregcompany:false,
          Cregname:false,
          Cregmobile:false,
          Cregvilage:false,
          Cregaddress:false,
          Cregstate:false,
          Cregcity:false,
          Cregstaluka:false,
          Cregproduct:false,
        });
  useEffect(() => {
  if (registerStep === 4) {
    const timer = setTimeout(() => {
      GototheDashboard();
    }, 1500);

    return () => clearTimeout(timer);
  }
}, [registerStep]);
useEffect(() => {
    // Change bottom nav bar color when screen is focused
    changeNavigationBarColor("#E8F5E9", true); // black nav bar, light icons
  }, []);
  const GototheDashboard = () => {
    if (registerRole === "company" && registerStep === 4) {
       props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [{ name: 'BuyerHome' }],
            })
        );
    } 
    else if (registerRole === "farmer" && registerStep === 4) {
      props.navigation.dispatch(
          CommonActions.reset({
              index: 1,
              routes: [{ name: 'MainTabs' }],
          })
      );
    }
  };
  const sendOTP = () => {
    if (mobile.length !== 10) {
      setErrors((prevErrors) => ({ ...prevErrors, mobileerr: true}));
      showToast('કૃપા કરીને 10-અંકનો નંબર દાખલ કરો')
      // alert("કૃપા કરીને માન્ય મોબાઇલ નંબર દાખલ કરો");
      return;
    }
    setErrors((prevErrors) => ({ ...prevErrors, mobileerr: false }));
    setLoading(true);
    api.authenticateSendOTP(mobile).then((response) => {
      setLoading(false);
      if (response?.ok && response.data) {
        console.log("Data Stored in MobX -", response.data);
        setLoading(false);
        // alert("OTP મોકલવામાં આવ્યો છે");
        setLoginStep(2); // Go to OTP entry screen
      } else {
        justAnAlert("Error", response?.data?.message || t('Something went wrong'));
        console.log("API REJECT", response.data);
        setLoading(false);
      }
    }).catch((error) => {
      setLoading(false);
      justAnAlert("Error", t('Something went wrong'));
      console.error("API Error:", error);
    });
  };

  const RegisterFarmer = () => {
      
      api.userRegister(name, "-", mobile, selectedState?.id, selectedCity?.id, selectedTaluka?.id, address, VilageName, 123456, otp.join(''))
      .then((response) => {
        console.log("userRegister ", response);
          setLoading(false);
          if (response?.ok) {
              UesrMob.updateUserMobx(response.data);
              setRegisterStep(4)
          } else {
              justAnAlert("Error", response.data.message);
          }
      })
      .catch((err) => {
          console.log(err);
          setLoading(false);
      });
  }
  const extractValidationMessages = (errorResponse) => {
      if (!errorResponse.errors) return "Unknown error occurred.";

      return Object.values(errorResponse.errors)
          .flat() // Flatten the array (in case multiple messages exist for one field)
          .join("\n"); // Join messages with a new line
  };
  const finalRegisterCompany = () => {
   api.BuyerRegisterAPI(name,companyname,otp.join(''),mobile,selectedState?.id,selectedCity?.id,selectedTaluka?.id
         ,address,VilageName,123456,selectedProducts.map(model => model.id),"")
         .then((response) => {
           setLoading(false);
           console.log("finalRegisterCompany", response);
           if (response?.ok) {
             UesrMob.updateUserMobx(response.data);
              setRegisterStep(4)
           } else {
               justAnAlert("Error", response.data.message);
           }
         })
         .catch((err) => {
             console.log(err);
             setLoading(false);
         });         

  }
  const btnClickOnRegisterSendOTP = async () =>
    {

      setLoading(true);
       api.RegisterSendOTP(mobile)
        .then((response) => {
          console.log(`------${response}`)
          setLoading(false);
        if (response?.ok) {
            setRegisterStep(3)
        } else {
          setLoading(false);
          const validationMessage = extractValidationMessages(response.data);
          console.log("RegisterSendOTP -",validationMessage)
          justAnAlert(response.data.message,validationMessage)
        }
      })
      .catch((err) => {
          console.log(err)
        setLoading(false);
      });
    
  }
 const StepIndicator = () => {
  const steps = [
    { id: 1, label: registerRole == "farmer" ? "માહિતી" : "કંપની" },
    { id: 2, label: registerRole == "farmer" ? "ખેતર" : "વ્યવસાય"},
    { id: 3, label: registerRole == "farmer" ? "ચકાસણી" : "ચકાસણી" },
  ];

  return (
    <View style={styles.stepRow}>
      {steps.map((step, index) => {
        const isCompleted = step.id < registerStep;
        const isActive = step.id === registerStep;

        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.stepCircleCompleted,
                  isActive && styles.stepCircleActive,
                ]}
              >
                <Text style={isActive ? styles.stepCircleTextActive : isCompleted ? styles.stepCircleTextCompleted : styles.stepCircleText}>
                  {isCompleted ? "✓" : step.id}
                </Text>
              </View>

              {/* Label below circle */}
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>

            {/* Add connecting line except after the last circle */}
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  step.id < registerStep
                    ? styles.stepLineCompleted
                    : styles.stepLinePending,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

  const renderLogin = () => {
    if (loginStep === 1) {
      return (
        <View style={{ paddingHorizontal: 20,marginTop:10 }}>
           <View style={{ marginBottom: 30 }}></View>
          <Text style={styles.label}>મોબાઇલ નંબર</Text>
          <View style={styles.inputRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
            style={[
              styles.input,
              focusedInput === "mobile" && styles.focusedInput,
              errors.mobileerr && styles.errorInput
            ]}
            placeholder="10-અંકનો નંબર દાખલ કરો"
            keyboardType="number-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
            onFocus={() => setFocusedInput("mobile")}
            onBlur={() => setFocusedInput("")}
            placeholderTextColor="#9da4b0"
          />
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setRemember(!remember)}
          >
            {/* <View style={[styles.checkbox, remember && styles.checkboxChecked]} />
            <Text style={styles.checkboxText}>આ ડિવાઇસ પર મને યાદ રાખો</Text> */}
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={sendOTP}>
            <Text style={styles.primaryBtnText}>OTP મોકલો</Text>
          </TouchableOpacity>
          <View style={{ marginBottom: 20 }}></View>
        </View>
      );
    } else if (loginStep === 2) {
      return renderLoginStep2();
    }
  };

  const renderLoginStep2 = () => (
  <View style={{ flex: 1, padding: 20 }}>
    <OtpInput
    otp={otp}
    setOtp={setOtp}
    title="મોબાઇલ ચકાસણી"
    onBack={() => setLoginStep(1)}
    onSubmit={() => btnClickOnSendAuthenticate(otp.join(""), mobile)}
    onResend={sendOTP}
    backText="પાછળ"
    submitText="લોગિન કરો"
    mobileNumber={mobile}
  />
  </View>
  
);

  const renderRegisterOptions = () => (
    <View style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}></View>
      <Text style={styles.label1}>હું એક:</Text>
      <View style={{ flexDirection: 'column', marginTop: 20, gap: 10}}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => {
            setRegisterRole("farmer");
            setRegisterStep(1);
          }}
        >
          <Image source={IMAGES.farmer_icon} style={{ width: 30, height: 30 ,marginTop: 2,resizeMode: "contain"}} />
          <Text style={styles.optionText}>ખેડૂત</Text>
          <Text style={styles.optionText2}>પાક માહિતી, બજાર ભાવ અને વધુ માટે ખેડૂત તરીકે નોંધણી કરો</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => {
            setRegisterRole("company");
            setRegisterStep(1);
          }}
        >
          <Image source={IMAGES.company_icon} style={{ width: 30, height: 30 ,marginTop: 2,resizeMode: "contain"}} />
          <Text style={styles.optionText}>કંપની</Text>
          <Text style={styles.optionText2}>ખેડૂતો સાથે જોડાવા અને તમારી પહોંચ વધારવા માટે કૃષિ-વ્યવસાય તરીકે નોંધણી કરો</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  const renderFarmerStep1 = () => (
    <View style={{ paddingHorizontal: 20 ,marginTop: 0 }}>
      <StepIndicator />
      <Text style={styles.titleview}>મૂળભૂત માહિતી</Text>
      <Text style={[styles.label, { marginTop: 10 }]}>પુરુ નામ</Text>
      <TextInput
        style={[styles.inputFull, errors.Fregname && styles.errorInput, focusedInput === "txtFregname" && styles.focusedInput]}
        placeholder="તમારું નામ દાખલ કરો"
        value={name}
        onChangeText={setName}
        onFocus={() => setFocusedInput("txtFregname")}
        onBlur={() => setFocusedInput("")}
        placeholderTextColor="#9da4b0"
      />

      <Text style={[styles.label, { marginTop: 20 }]}>મોબાઇલ નંબર</Text>
      <View style={styles.inputRow}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>+91</Text>
        </View>

        <TextInput
          style={[styles.input, errors.Fregmobile && styles.errorInput, focusedInput === "txtFregmobile" && styles.focusedInput]}
          placeholder="10-અંકનો નંબર દાખલ કરો"
          keyboardType="number-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
          onFocus={() => setFocusedInput("txtFregmobile")}
          onBlur={() => setFocusedInput("")}
          placeholderTextColor="#9da4b0"
        />
      </View>
      <View style={{ marginBottom: 80 }}></View>
      <TouchableOpacity
        style={[styles.primaryFirstbtn, { marginRight: 12 }]}
        onPress={() => FvalidateStep1()}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.primaryBtnText1}>આગળ</Text>
        <Image source={IMAGES.Right} style={{ width: 18, height: 18, marginLeft: 8 ,marginTop: 2}} />
        {/* <Icon name="arrow-right" size={20} color="#ffffffff" style={{ marginLeft: 8 }} /> */}
      </View>
      </TouchableOpacity>
    </View>
  );
  const FvalidateStep1 = () => {
     if (!name) {
       setErrors((prevErrors) => ({ ...prevErrors, Fregname: true }));
     }
     else {
       setErrors((prevErrors) => ({ ...prevErrors, Fregname: false }));
     }
     if (!mobile) {
       setErrors((prevErrors) => ({ ...prevErrors, Fregmobile: true }));     
     }
     else {
       setErrors((prevErrors) => ({ ...prevErrors, Fregmobile: false }));
     }
      if (mobile.length !== 10) {
        setErrors((prevErrors) => ({ ...prevErrors, Fregmobile: true }));
      }
      else {
        setErrors((prevErrors) => ({ ...prevErrors, Fregmobile: false }));
      }
      if (!name || !mobile || mobile.length !== 10) {
      showToast("બધી વિગતો ભરીને આગળ નું બટન દબાવો ");
      return;
     }
     setVilageName("")
     setaddress("")
     setselectedTaluka(null)
     setSelectedCity(null)
     setSelectedState(null)
     setRegisterStep(2);
  }
  const renderFarmerStep2 = () => (
    <View style={{ paddingHorizontal: 20 ,marginBottom: 20 }}>
      <StepIndicator />
      <Text style={styles.titleview}>ખેતરની વિગતો</Text>
     <Text style={[styles.label, { marginTop: 5 }]}>
         ગામ 
      </Text>
      <TextInput style={[styles.inputFull
        , focusedInput === "txtFregvilagename" && styles.focusedInput
        , errors.Fregvilage && styles.errorInput]} placeholder="તમારા ગામ અથવા શહેરનું નામ દાખલ કરો" onChangeText={setVilageName} onFocus={() => setFocusedInput("txtFregvilagename")} onBlur={() => setFocusedInput("")}
        placeholderTextColor="#9da4b0"/>
       <Text style={[styles.label, { marginTop: 10 }]}>
         સરનામું
      </Text>
      <TextInput style={[styles.inputFull,
        focusedInput === "txtFregaddress" && styles.focusedInput
        , errors.Fregaddress && styles.errorInput]} placeholder="સરનામું" onChangeText={setaddress} onFocus={() => setFocusedInput("txtFregaddress")} onBlur={() => setFocusedInput("")}
        placeholderTextColor="#9da4b0"/>
     <View>
     <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { marginTop: 10 }]}>
         {t("select_state")}
      </Text>
        <StateDropdown  
          onSelect={(selectedState) => { 
            setSelectedState(selectedState);
            console.log('Selected State:', selectedState);
            setErrors((prevErrors) => ({ ...prevErrors, Fregstate: false }));
          }} 
          validationerr={errors.Fregstate}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { marginTop: 10 }]}>
         {t('select_city')}
      </Text>
        <CityDropdown
          value={selectedCity}
          selectedState={selectedState}
          onSelectCity={(selectedCity) => {
            setSelectedCity(selectedCity);
            console.log('Selected City:', selectedCity);
             setErrors((prevErrors) => ({ ...prevErrors, Fregcity: false }));
          }}
          validationerr={errors.Fregcity}
        />
      </View>
    </View>
      <Text style={[styles.label, { marginTop: 10 }]}>
         તાલુકો પસંદ કરો
      </Text>
      <TalukaDropdown selectedCity={selectedCity}
        onSelectTaluka={(selectedTaluka) => {
        // handleOnChange(selectedTaluka.id, 'TalukaID');
        setselectedTaluka(selectedTaluka)
          console.log('Selected Talukas:', selectedTaluka);
           setErrors((prevErrors) => ({ ...prevErrors, Fregstaluka: false }));
          // Access: selectedState.id, selectedState.name, etc.
      }}
      validationerr={errors.Fregstaluka}
      />
      
     
    <View style={styles.buttonRow1}>
      <TouchableOpacity
        style={styles.secondaryBtn1}
        onPress={() => setRegisterStep(1)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
         <Image source={IMAGES.Left} style={{ width: 18, height: 18, marginRight: 10 ,marginTop: 2}} />
         <Text style={styles.secondaryBtnText1}>પાછળ</Text>
      </View>
        {/* <Text style={styles.secondaryBtnText1}>પાછળ</Text> */}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryBtn1}
        onPress={() => FvalidateStep2()}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.primaryBtnText1}>આગળ</Text>
        <Image source={IMAGES.Right} style={{ width: 18, height: 18, marginLeft: 10 ,marginTop: 2}} />
      </View>
      </TouchableOpacity>
    </View>
     
    </View>
    </View>
  );
  const FvalidateStep2 = () => {
    console.log("FvalidateStep2",selectedState,selectedCity,selectedTaluka,VilageName,address)
    if (!VilageName) {
       setErrors((prevErrors) => ({ ...prevErrors, Fregvilage: true }));
     }
     else
     {
       setErrors((prevErrors) => ({ ...prevErrors, Fregvilage: false }));
     }
     if (!address) {
       setErrors((prevErrors) => ({ ...prevErrors, Fregaddress: true }));
     }
     else
     {
       setErrors((prevErrors) => ({ ...prevErrors, Fregaddress: false }));
     }
    if (!selectedState) {
       setErrors((prevErrors) => ({ ...prevErrors, Fregstate: true }));
    }
    else
    {
      setErrors((prevErrors) => ({ ...prevErrors, Fregstate: false }));
    }
    if (!selectedCity) {
       setErrors((prevErrors) => ({ ...prevErrors, Fregcity: true }));
    }
    else
    {
      setErrors((prevErrors) => ({ ...prevErrors, Fregcity: false }));
    }
    if (!selectedTaluka) {
       setErrors((prevErrors) => ({ ...prevErrors, Fregtaluka: true }));
    }
    else
    {
      setErrors((prevErrors) => ({ ...prevErrors, Fregtaluka: false }));
    }
     console.log("FvalidateStep2",!selectedState,!selectedCity,!selectedTaluka,VilageName,address)
    if (!VilageName || !address || !selectedState || !selectedCity || !selectedTaluka) {
      showToast("બધી વિગતો ભરીને આગળ નું બટન દબાવો ");
      return;
    }
    btnClickOnRegisterSendOTP()
  }
  const renderFarmerStep3 = () => {
  return (
      <View style={{ flex: 1, backgroundColor: '#ffffffff', paddingHorizontal: 25 }}>
        <StepIndicator />        {/* Step Title */}
        <Text style={styles.titleview}>મોબાઇલ ચકાસણી</Text>
        <OtpInput
          otp={otp}
          setOtp={setOtp}
          title="મોબાઇલ ચકાસણી"
          onBack={() => setRegisterStep(2)}
          onSubmit={() => RegisterFarmer()}
          onResend={sendOTP}
          backText="પાછળ"
          submitText="નોંધણી પૂર્ણ કરો"
          mobileNumber={mobile}
        />
        <View style={{ marginBottom: 30 }}></View>

      </View>
    );
  };
  const renderCompanyStep1 = () => (
  <View style={{ paddingHorizontal: 20 }}>
    <StepIndicator />
     <Text style={styles.titleview}>કંપની માહિતી</Text>
    <Text style={[styles.label, { marginTop: 10 }]}>કંપનીનું નામ</Text>
    <TextInput
      style={[styles.inputFull, focusedInput === "txtCregcompanyname" && styles.focusedInput]}
      placeholder="કંપનીનું નામ દાખલ કરો"
      value={companyname}
      onChangeText={setcompanyname}
      onFocus={() => setFocusedInput("txtCregcompanyname")}
      onBlur={() => setFocusedInput("")}
      placeholderTextColor="#9da4b0"
    />

    <Text style={[styles.label, { marginTop: 10 }]}>સંપર્ક વ્યક્તિ</Text>
    <TextInput
      style={[styles.inputFull, focusedInput === "txtCregcontactperson" && styles.focusedInput]}
      placeholder="સંપર્ક વ્યક્તિનું નામ દાખલ કરો"
      value={name}
      onChangeText={setName}
      onFocus={() => setFocusedInput("txtCregcontactperson")}
      onBlur={() => setFocusedInput("")}
      placeholderTextColor="#9da4b0"
    />

    <Text style={[styles.label, { marginTop: 10 }]}>સંપર્ક નંબર</Text>
    <View style={styles.inputRow}>
      <View style={styles.countryCode}>
        <Text style={styles.countryCodeText}>+91</Text>
      </View>
      <TextInput
        style={[styles.input, focusedInput === "txtCregmobile" && styles.focusedInput]}
        placeholder="10-અંકનો નંબર દાખલ કરો"
        keyboardType="number-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
        onFocus={() => setFocusedInput("txtCregmobile")}
        onBlur={() => setFocusedInput("")}
        placeholderTextColor="#9da4b0"
      />
    </View>

    <View style={{ marginBottom: 80 }}></View>
    <TouchableOpacity
      style={styles.primaryFirstbtn}
      onPress={() => CValidationStep1()}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.primaryBtnText1}>આગળ</Text>
          <Image source={IMAGES.Right} style={{ width: 18, height: 18, marginLeft: 8 ,marginTop: 2}} />
        </View>
    </TouchableOpacity>
  </View>
  );
  const CValidationStep1 = () => {
      if (!name) {
        setErrors((prevErrors) => ({ ...prevErrors, Cregname: true }));
      }
      else {
        setErrors((prevErrors) => ({ ...prevErrors, Cregname: false }));
      }
      if (!companyname) {
        setErrors((prevErrors) => ({ ...prevErrors, Cregcompanyname: true }));
      }
      else {
        setErrors((prevErrors) => ({ ...prevErrors, Cregcompanyname: false }));
      }
      if (!mobile) {
        setErrors((prevErrors) => ({ ...prevErrors, Cregmobile: true }));
      }
      else {
        setErrors((prevErrors) => ({ ...prevErrors, Cregmobile: false }));
      }
      if (mobile.length !== 10) {
        setErrors((prevErrors) => ({ ...prevErrors, Cregmobile: true }));
      }
      else {
        setErrors((prevErrors) => ({ ...prevErrors, Cregmobile: false }));
      }
     
      if (!companyname || !name || !mobile || mobile.length !== 10) {
        showToast("બધી વિગતો ભરીને આગળ નું બટન દબાવો ");
        return;
      }
    setRegisterStep(2);
  };
  const renderCompanyStep2 = () => (
    <View style={{ paddingHorizontal: 20,paddingBottom:20 }}>
      <StepIndicator />
      <Text style={styles.titleview}>વ્યવસાયની વિગતો</Text>
      <Text style={[styles.label, { marginTop: 10 }]}>
       ગામ દાખલ કરો
      </Text>
      <TextInput style={[styles.inputFull, focusedInput === "txtCregvillage" && styles.focusedInput]} placeholder="તમારા ગામ અથવા શહેરનું નામ દાખલ કરો" onChangeText={setVilageName}
        onFocus={() => setFocusedInput("txtCregvillage")}
        onBlur={() => setFocusedInput("")}
        placeholderTextColor="#9da4b0"
      />
      <Text style={[styles.label, { marginTop: 10 }]}>
         સરનામું
      </Text>
      <TextInput style={[styles.inputFull, focusedInput === "txtCregaddress" && styles.focusedInput]} placeholder="સરનામું" onChangeText={setaddress}
        onFocus={() => setFocusedInput("txtCregaddress")}
        onBlur={() => setFocusedInput("")}
        placeholderTextColor="#9da4b0"
      />
     
        <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}>
         <Text style={[styles.label, { marginTop: 10 }]}>
       {t("select_state")}
      </Text>
        <StateDropdown  
          onSelect={(selectedState) => { 
            setSelectedState(selectedState);
            console.log('Selected State:', selectedState);
          }}
          validationerr={errors.Cregstate} 
        />
      </View>

      <View style={{ flex: 1 }}>
          <Text style={[styles.label, { marginTop: 10 }]}>
       {t("select_city")}
      </Text>
        <CityDropdown
          value={selectedCity}
          selectedState={selectedState}
          onSelectCity={(selectedCity) => {
            setSelectedCity(selectedCity);
            console.log('Selected City:', selectedCity);
          }}
        />
      </View>
    </View>
          <Text style={[styles.label, { marginTop: 10 }]}>
       તાલુકો પસંદ કરો
      </Text>
      <TalukaDropdown selectedCity={selectedCity}
        onSelectTaluka={(selectedTaluka) => {
        // handleOnChange(selectedTaluka.id, 'TalukaID');
        setselectedTaluka(selectedTaluka)
          console.log('Selected Talukas:', selectedTaluka);
          // Access: selectedState.id, selectedState.name, etc.
      }}/>
          <Text style={[styles.label, { marginTop: 10 }]}>
       {t('Select Product')}
      </Text>
      <ProductDropdown
        lblcolor="black"
        onSelect={(product) => setSelectedProduct(product)}
      />
    
      <View style={styles.buttonRow1}>
      <TouchableOpacity
        style={styles.secondaryBtn1}
        onPress={() => setRegisterStep(1)}
      >
       <View style={{ flexDirection: "row", alignItems: "center" }}>
         <Image source={IMAGES.Left} style={{ width: 18, height: 18, marginRight: 8 ,marginTop: 2}} />
         <Text style={styles.secondaryBtnText1}>પાછળ</Text>
      </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryBtn1}
        onPress={() => btnClickOnRegisterSendOTP()}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.primaryBtnText1}>આગળ</Text>
          <Image source={IMAGES.Right} style={{ width: 18, height: 18, marginLeft: 8 ,marginTop: 2}} />
        </View>
      </TouchableOpacity>
    </View>
    </View>
  );
  const renderCompanyStep3 = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffffff', padding: 25 }}>
          <StepIndicator />        {/* Step Title */}
          <Text style={styles.titleview}>મોબાઇલ ચકાસણી</Text>
          <OtpInput
            otp={otp}
            setOtp={setOtp}
            title="મોબાઇલ ચકાસણી"
            onBack={() => setRegisterStep(2)}
            onSubmit={() => finalRegisterCompany()}
            onResend={sendOTP}
            backText="પાછળ"
            submitText="નોંધણી પૂર્ણ કરો"
            mobileNumber={mobile}
          />
        </View>
      );
    };
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
  const SuccessScreen = () => {
  return (
    <View style={styles.container}>
      {/* Circle with tick */}
      <View style={styles.iconCircle}>
        <Icon name="check" size={40} color="green" />
      </View>

      {/* Success Text */}
      <Text style={styles.title}>નોંધણી સફળ!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        તમારું કંપની ખાતું સફળતાપૂર્વક બનાવવામાં આવ્યું છે.
      </Text>

      {/* Button */}
      {/* <TouchableOpacity style={styles.button} onPress={() => GototheDashboard()}>
        <Text style={styles.buttonText}>ડેશબોર્ડ પર જાઓ</Text>
      </TouchableOpacity> */}
    </View>
  );
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor="#E8F5E9" barStyle="dark-content" />
     <ScrollView
          style={{ flex: 1, backgroundColor: "#E8F5E9" }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center", // centers vertically
            // alignItems: "center",     // centers horizontally
            padding: 20, // adds padding around the content
          }}
        >
      <View style={{ alignItems: 'center', paddingBottom: 0 ,marginBottom: 0,marginTop:0}}>
        <Image source={IMAGES.ic_title_logo} style={{ width: '80%', height: 150 }} resizeMode='contain'/>
      </View>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>કૃષિરત્નમાં આપનું સ્વાગત છે</Text>
          <Text style={styles.headerSubtitle}>તમારું સંપૂર્ણ કૃષિ સમાધાન</Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              setSelectedTab("login");
              setRegisterRole(null);
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "login" && styles.tabTextActive,
              ]}
            >
              લોગિન
            </Text>
            {selectedTab === "login" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              setSelectedTab("register");
              setRegisterRole(null);
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "register" && styles.tabTextActive,
              ]}
            >
              રજીસ્ટર
            </Text>
            {selectedTab === "register" && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {selectedTab === "login" && renderLogin()}
        {selectedTab === "register" &&
          (registerRole === null
            ? renderRegisterOptions()
            : registerRole === "farmer" && registerStep === 1
            ? renderFarmerStep1()
            : registerRole === "farmer" && registerStep === 2
            ? renderFarmerStep2()
            : registerRole === "farmer" && registerStep === 3
            ? renderFarmerStep3()
             : registerRole === "farmer" && registerStep === 4
            ? SuccessScreen()
            : registerRole === "company" && registerStep === 1
            ? renderCompanyStep1()
            : registerRole === "company" && registerStep === 2
            ? renderCompanyStep2()
            : registerRole === "company" && registerStep === 3
            ? renderCompanyStep3()
            : registerRole === "company" && registerStep === 4
            ? SuccessScreen()
            : null)}
      </View>

      {selectedTab === "login" && 
            <Text style={[styles.countryCodeText,{marginVertical:10,textAlign:'center'}]}>
             અકાઉન્ટ નથી? લૉગિન માટે પહેલા રજીસ્ટ્રેશન કરો.
            </Text>
      }
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
  
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  header: {
    backgroundColor: "#1B5E20",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#E0E0E0",
    fontSize: 14,
    marginTop: 4,
  },
  titleview: {
    color: "#1B5E20",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "700",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#f0f2f8",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#757575",
  },
  tabTextActive: {
    color: "#1B5E20",
    fontWeight: "700",
  },
  tabUnderline: {
    marginTop: -2,
    bottom: -10,
    height: 4,
    width: "100%",
    backgroundColor: "#1B5E20",
  },
  label: {
    fontSize: 14,
    color: "#333",
    // fontWeight: "700",
    // textAlign:'center'
  },
  label1: {
    fontSize: 20,
    color: "#333",
    fontWeight: "700",
    textAlign:'center'
  },
  inputRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#f0f2f8",
    
  },
  inputFull: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    marginTop: 8,
    backgroundColor: "#f0f2f8",
    
  },
  countryCode: {
    backgroundColor: "#dbe5f696",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  countryCodeText: {
    fontSize: 16,
    color: "#333",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#1B5E20",
    borderColor: "#1B5E20",
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
  },
  primaryBtn: {
    height: 50,
    backgroundColor: "#1B5E20",
    borderRadius: 6,
    alignItems: "center",
    justifyContent:'center',
    marginTop: 10
  },
  primaryFirstbtn: {
    // height: 50,
    position:'absolute',
    backgroundColor: "#1B5E20",
    paddingVertical: 10,
    paddingHorizontal: 20, // so it has space on sides
    borderRadius: 6,
    alignItems: "center",
    bottom: 18,
    right:8,
    marginRight: 10

  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    // fontWeight: "700",
  },
  secondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 25, // so it has space on sides
    borderRadius: 6,
    alignItems: "center",
    borderWidth:1,
    borderColor:"#1B5E20",
    marginVertical:10
    
  },
  secondaryBtnText: {
    color: "#1B5E20",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  optionCard: {
    flex: 1,
    // backgroundColor: "#F1F8E9",
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  optionIcon: {
    fontSize: 30,
  },
  optionText: {
    fontSize: 18, 
    marginTop: 8,
    fontWeight: "700",
    color: "#000000ff",
  },
  optionText2: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "500",
    color: "#000000ff",
    textAlign: "center",
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  stepCircleActive: {
    borderColor: "#1B5E20",
    backgroundColor: "#1B5E20",
  },
  stepText: {
    fontWeight: "700",
    color: "#fff",
  },
  stepRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
},

stepContainer: {
  alignItems: "center",
  zIndex: 2,
},

stepCircle: {
  width: 30,
  height: 30,
  borderRadius: 15,
  borderWidth: 2.5,
  borderColor: "#ccc",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  zIndex: 1,
},

stepCircleActive: {
  backgroundColor: "#1B5E20",
  borderColor: "#a3c89cff",
},

stepCircleCompleted: {
  backgroundColor: "#1B5E20",
  borderColor: "#1B5E20",
},

stepCircleText: {
  color: "#222222",
  fontWeight: "bold",
},
  stepCircleTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  stepCircleTextCompleted: {
    color: "#fff",
    fontWeight: "bold",
  },
stepLine: {
  height: 2,
  flex: 1,
  marginHorizontal: 4,
  marginTop: -28,
  // zIndex: 1,
  marginHorizontal: -8,
  // width: "120%",
},

stepLineCompleted: {
  backgroundColor: "#1B5E20",
},

stepLinePending: {
  backgroundColor: "#ccc",
},
focusedInput: {
    borderColor: "green",
    borderWidth: 1,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  buttonRow1: {
    flexDirection: "row",
    justifyContent: "space-between", // Left & Right
    marginTop: 20,
  },
  secondaryBtn1: {
    // flex: 0.5,
    width: "35%",
    marginRight: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#1B5E20",
    borderWidth: 1,
  },
  primaryBtn1: {
    // flex: 0.5,
    width: "35%",
    marginLeft: 10,
    padding: 12,
    backgroundColor: "#1B5E20",
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryBtnText1: {
    color: "#1B5E20",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryBtnText1: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  stepContainer: {
  alignItems: "center", // centers label below the circle
},
stepLabel: {
  marginTop: 10,
  fontSize: 14,
  color: "#333",
},
container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6F5EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1B5E20",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  
});

export default LoginScreen;
