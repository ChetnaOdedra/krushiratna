import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import IMAGES from '../Util/Images';
import UesrMob from '../Services/Mobxstate/UesrMob';
import COLORS from '../Util/Colors';

const CustomHeader = () => {
  const navigation = useNavigation();

  const openDialer = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    console.log(UesrMob);
  }, []);

  const handleDocumentPress = () => {
    navigation.navigate('RunningOrderedScreen');
  };

  const handleNotificationPress = () => {
    navigation.navigate('NotificationList');
  };

  const handlePhoto = () => {
    navigation.navigate('SettingScreen');
  };

  const user = UesrMob.user?.user;

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={handlePhoto}
        activeOpacity={0.8}
      >
        <View style={styles.imageWrapper}>
          <Image
           source={{ uri: user?.profile_media }}
            style={styles.profileImage}
          />
          <View style={styles.statusDot} />
        </View>
        <View>
          <Text style={styles.name}>
            {user?.name && user.name.length > 13 
              ? user.name.slice(0, 10) + '...' 
              : user?.name ?? ''}
          </Text>
          {user?.role ? (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{'ખેડૂત'}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {/* Action Icons */}
      <View style={styles.iconSection}>
        <TouchableOpacity
          onPress={() => openDialer('+919824264509')}
          style={styles.iconBox}
        >
          <Image source={IMAGES.call_icon} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNotificationPress}
          style={styles.iconBox}
        >
          <Image source={IMAGES.notification} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDocumentPress}
          style={styles.iconBox}
        >
           <Image source={IMAGES.cart} style={styles.icon} />
          {/* <Image source={IMAGES.note_icon} style={[styles.icon,{ tintColor: '#70a440' }]} /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.newbuttonColor,
  },
  statusDot: {
  
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  roleBadge: {
    backgroundColor: "#5D9A2326",
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 3,
    alignSelf: 'flex-start',

  },
  roleText: {
    fontSize: 12,
    color: '#5D9A23',
    fontWeight: '700',
    marginTop: -2,
  },
  iconSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 8,
    marginLeft: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default CustomHeader;
