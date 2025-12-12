import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import IMAGES from '../Util/Images';
import COLORS from '../Util/Colors';
import ComButton from '../components/ComButton';
import UesrMob from '../Services/Mobxstate/UesrMob';
import {
  useNavigation,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Api from '../Services/Api';
import showToast from '../screenComponents/showToast';
import MinimalHeader from '../components/MinimalHeader';

const SettingScreen = (props) => {
  const api = Api.create();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = UesrMob.user?.user || {};
  const [refreshKey, setRefreshKey] = useState(0);
  const [profileUri, setProfileUri] = useState(user.profile_media);
  const [loading, setLoading] = useState(false); // 👈 Added loading state

  useFocusEffect(
    useCallback(() => {
      console.log('SettingScreen focused', UesrMob.user);
      const latestUser = UesrMob.user?.user || {};
      setProfileUri(latestUser.profile_media);
      // StatusBar.setBackgroundColor(COLORS.newbuttonColor);
      // StatusBar.setBarStyle('light-content');
      return () => {
        StatusBar.setBackgroundColor('#ffffff');
        StatusBar.setBarStyle('dark-content');
      };
    }, [])
  );

  const SettingData = [
    { id: '0', title: t('My Profile'), image: IMAGES.user_octagon },
    { id: '1', title: t('Order History'), image: IMAGES.empty_wallet },
    // { id: '2', title: t('Change Language'), image: IMAGES.language_switch },
    { id: '3', title: t('Delete Account'), image: IMAGES.delete_account },
  ];

  const logoutHandler = () => {
    UesrMob.removeUserMobx();
    props.navigation.dispatch(
      CommonActions.reset({ index: 1, routes: [{ name: 'Login' }] })
    );
    showToast(t('Logout successfully'));
    setLoading(true); // 👈 Start loading
    api.LogoutUser().then((res) => {
      console.log('Logout response:', res);
      setLoading(false); // 👈 Stop loading
      if (res.ok) {
        // UesrMob.removeUserMobx();
        // props.navigation.dispatch(
        //   CommonActions.reset({ index: 1, routes: [{ name: 'Login' }] })
        // );
        // showToast(t('Logout successfully'));
      } else {
        // showToast(t('Logout failed'));
      }
    }).catch((err) => {
      setLoading(false); // 👈 Stop loading on error
      showToast(t('Something went wrong'));
    });
  };

  const capitalizeFirstChar = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const confirmDelete = () => {
    Alert.alert(
      t('Delete Account'),
      t('Are you sure you want to delete your account?'),
      [
        { text: t('Cancel'), style: 'cancel' },
        {
          text: t('Delete Account'),
          onPress: handleAccountDelete,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleAccountDelete = () => {
    const deleteMethod =
      user.role === 'farmer'
        ? api.DeleteFarmerUser
        : api.DeleteCompanyUser;

    deleteMethod().then((res) => {
      if (res.ok) {
        showToast(t('Account deleted successfully'));
        logoutHandler();
      } else {
        showToast(t('DeleteAccount failed'));
      }
    });
  };

  const renderItem = ({ item }) => {
    const handlePress = () => {
      switch (item.id) {
        case '0':
          navigation.navigate('ProfileScreen');
          break;
        case '1':
          navigation.navigate(
            user.role === 'farmer'
              ? 'FarmarOrderHistory'
              : 'BuyerOrderHistory'
          );
          break;
        case '2':
          navigation.navigate('LanguageScreen');
          break;
        case '3':
          confirmDelete();
          break;
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.settingItem}>
        <Image source={item.image} style={styles.settingIcon} />
        <Text style={styles.settingText}>{item.title}</Text>
        <Image source={IMAGES.arrow_right} style={styles.arrowIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} key={refreshKey}>
      <View style={styles.container}>
        <MinimalHeader title={t('Profile Details')} onBackPress={() => props.navigation.goBack()} />
        <View
          style={{
            height: '85%',
            backgroundColor: '#fff',
            width: '100%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ flex: 1, top: -80 }}>
            <View style={styles.profileContainer}>
              <Image
                style={styles.profileImage}
                source={{ uri: user?.profile_media }}
                resizeMode="cover"
                key={refreshKey}
              />
              <Text style={styles.userName}>
                {`${user.name ?? ''}`}
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {capitalizeFirstChar(t(user.role ?? ''))}
                </Text>
              </View>
            </View>

            <FlatList
              data={SettingData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            
          </View>
          <ComButton
              title={loading ? t('Logging out...') : t('Logout')}
              CustomeStyle={styles.logoutButton}
              onPress={logoutHandler}
              disabled={loading} // 👈 Disable button while loading
            />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 0,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  roleBadge: {
    backgroundColor: "#5D9A2326",
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginVertical: 5,
  },
  roleText: {
    fontSize: 12,
    color: '#5D9A23',
    fontWeight: '700',
    marginTop: -2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingIcon: {
    height: 30,
    width: 30,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  arrowIcon: {
    height: 20,
    width: 20,
    tintColor: '#aaa',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  logoutButton: {
    // marginVertical: 20
    position:'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default SettingScreen;
