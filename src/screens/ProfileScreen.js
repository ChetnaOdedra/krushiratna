import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Linking } from 'react-native';
import { ms, s } from 'react-native-size-matters';
import IMAGES from '../Util/Images';
import COLORS from '../Util/Colors';
import UesrMob from '../Services/Mobxstate/UesrMob';
import { useTranslation } from 'react-i18next';
import MinimalHeader from '../components/MinimalHeader';
import ProfileComInput from '../components/ProfileComInput';
import { launchImageLibrary } from 'react-native-image-picker';
import ComButton from '../components/ComButton';
import metrics from '../Util/Metrics';
import Api from '../Services/Api';
import showToast from '../screenComponents/showToast';
import { Keyboard } from 'react-native';
import { Video, Image as CompressorImage } from 'react-native-compressor';
import { requestCameraAndMediaPermissions } from '../Util/permission';


const ProfileScreen = (props) => {
  const api = Api.create();
  const { t } = useTranslation();
  const user = UesrMob?.user?.user || {};
  const [MidiaImageID, setMidiaImageID] = useState();
  const [profileUri, setProfileUri] = useState(user.profile_media);

  const [form, setForm] = useState({
    name: user.name || '',
    surname: user.surname || '',
    mobile_number: user.mobile_number || '',
    companyName: user.owner_name || '',
    address: user.address || '',
  });

  const [errors, setErrors] = useState({});

  const handleOnChange = (text, key) => {
    setForm(prev => ({ ...prev, [key]: text }));
  };

  // ===========================================
  // 🔥 HANDLE UPLOAD (ALERT FIXED)
  // ===========================================
  const handleUpload = async () => {

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

    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        if (response.assets) ProcessImageUrl(response.assets[0].uri);
        setProfileUri(response.assets[0].uri);
      }
    });
  };

  // ===========================================
  // SAME IMAGE PROCESS FUNCTION (NOT TOUCHED)
  // ===========================================
  const ProcessImageUrl = async (params) => {
    const originalUri = params;
    try {
      const compressedUri = await CompressorImage.compress(originalUri, {
        compressionMethod: 'auto',
        quality: 0.6,
        maxSize: 15 * 1024 * 1024,
      });

      api.uploadMedia(
        compressedUri || '',
        user.role === "company" ? 'company_profile_image' : 'farmer_profile_image'
      ).then((res) => {
        if (res.data.data?.length > 0) {
          const img = res.data.data[0];
          setMidiaImageID(img.id);
        }
      });

    } catch (error) {
      console.log("Compression Error:", error);
    }
  };

  // ===========================================
  // REST OF YOUR ORIGINAL CODE (UNCHANGED)
  // ===========================================
  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Unknown error');
      } else {
        const asset = response.assets?.[0];
        if (asset) {
          setProfileUri(asset.uri);
        }
      }
    });
  };

  const APIUpdateProfile = async () => {
    try {
      if (user.role === "company") {
        let params = {
          name: form.name,
          address: form.address,
          media_id: MidiaImageID,
          owner_name: form.companyName
        };

        const response = await api.CompanyProfileUpdate(params);
        if (response.status === 200) {
          let params2 = { user: response.data, token: UesrMob.user.token };
          UesrMob.updateUserMobx(params2);
          Keyboard.dismiss();
          showToast(t("Profile updated successfully!"));
        }
      } else {
        let params = {
          name: form.name,
          address: form.address,
          surname: form.surname,
          media_id: MidiaImageID
        };

        const response = await api.farmerProfileUpdate(params);
        if (response.status === 200) {
          let params2 = { user: response.data, token: UesrMob.user.token };
          UesrMob.updateUserMobx(params2);
          showToast(t("Profile updated successfully!"));
          Keyboard.dismiss();
        }
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <MinimalHeader title={t('Profile Details')} onBackPress={() => props.navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Profile Image */}
        <View style={styles.profileImageWrapper}>
          <View style={{ width: 120, height: 120 }}>
            <TouchableOpacity
             onPress={()=>handleUpload()} 
             style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
              <Image style={styles.profileImage} source={{ uri: profileUri }} />
              <Image style={styles.editIcon} source={IMAGES.imageedit} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name & Surname */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <ProfileComInput
              lblcolor="#ABB0B8"
              lable={t(user.role === "company" ? "full name" : "name")}
              value={form.name}
              onChangeText={text => handleOnChange(text, 'name')}
              placeholder={t(user.role === "company" ? "full name" : "name")}
              error={errors.name}
            />
          </View>
        </View>

        {/* Mobile number */}
        <ProfileComInput
          lblcolor="#ABB0B8"
          lable="Mobile Number"
          value={form.mobile_number}
          editable={false}
          placeholder={t("Mobile Number")}
          error={errors.mobile_number}
        />

        {/* Company info */}
        {user.role === "company" && (
          <>
            <Text style={styles.sectionTitle}>{t('Company Info')}</Text>
            <ProfileComInput
              lblcolor="#ABB0B8"
              lable="Company Name"
              value={form.companyName}
              onChangeText={text => handleOnChange(text, 'companyName')}
              placeholder={t("Company Name")}
              error={errors.companyName}
            />
          </>
        )}

        {/* Address */}
        <ProfileComInput
          inputHeight={ms(100)}
          lblcolor="#ABB0B8"
          lable={user.role === "company" ? "Company Address" : "address"}
          value={form.address}
          onChangeText={text => handleOnChange(text, 'address')}
          placeholder={t(user.role === "company" ? "Company Address" : "address")}
          error={errors.address}
        />

      </ScrollView>

      <ComButton
        title={t('Update Details')}
        CustomeStyle={styles.btnContainer}
        onPress={() => APIUpdateProfile()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, paddingBottom: 30 },
  profileImageWrapper: { alignItems: 'center', marginVertical: ms(30) },
  profileImage: {
    width: 120, height: 120, borderRadius: 60,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editIcon: {
    height: 30, width: 30,
    position: 'absolute', bottom: 6, right: 6,
  },
  sectionTitle: {
    fontSize: 18, color: 'black', marginTop: 20,
    left: 10, fontWeight: '700',
  },
  btnContainer: {
    backgroundColor: COLORS.newbuttonColor,
    marginTop: ms(20),
    marginHorizontal: metrics.marginHorizontal,
    bottom: ms(20),
  },
});

export default ProfileScreen;
