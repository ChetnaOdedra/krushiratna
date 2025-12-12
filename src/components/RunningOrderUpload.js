// RunningOrderUpload.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { t } from '../translations/translationHelper';
import IMAGES from '../Util/Images';
import COLORS from '../Util/Colors';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image as CompressorImage } from 'react-native-compressor';
import { CommonActions } from '@react-navigation/native';
import { requestCameraAndMediaPermissions } from '../Util/permission';

const RunningOrderUpload = ({
  visible,
  onClose,
  SelectedConfirmOrder,
  api,
  navigation,
}) => {
  const [finalWeight, setFinalWeight] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [MidiaImageID, setMidiaImageID] = useState(null);

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

    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets) {
        const uri = response.assets[0].uri;
        ProcessImageUrl(uri);
      }
    });
  };

  const ProcessImageUrl = async (originalUri) => {
    try {
      const compressedUri = await CompressorImage.compress(originalUri, {
        compressionMethod: 'auto',
        quality: 0.6,
        maxSize: 15 * 1024 * 1024,
      });

      const res = await api.uploadMedia(compressedUri, 'company_order_bill');
      if (res.data?.data?.length > 0) {
        const firstItem = res.data.data[0];
        setMidiaImageID(firstItem.id);
      } else {
        Alert.alert('Error', 'Failed to upload image.');
      }
    } catch (error) {
      console.log('Compression Error:', error);
    }
  };

  const ComplateOrder = async () => {
    const id = SelectedConfirmOrder;

    if (!finalWeight || !finalAmount || !id) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!MidiaImageID) {
      Alert.alert('Error', 'Please select bill image');
      return;
    }

    const params = {
      final_price: finalWeight,
      final_weight: Number(finalAmount),
      media_id: MidiaImageID,
      order_id: id,
    };

    try {
      const res = await api.farmerComplateOrder(params);
      if (res.ok) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'MainTabs' }],
          })
        );
      } else {
        Alert.alert('Error', res.data.message || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t('Selling Status')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('Final Weight')}
            keyboardType="numeric"
            value={finalWeight}
            onChangeText={setFinalWeight}
          />
          <TextInput
            style={styles.input}
            placeholder={t('Final Amount')}
            keyboardType="numeric"
            value={finalAmount}
            onChangeText={setFinalAmount}
          />

          <TouchableOpacity style={styles.inputUpload} onPress={handleUpload}>
            <Text style={{ color: '#999' }}>
              {MidiaImageID ? t('Image Selected') : t('Upload Bill')}
            </Text>
            <Image source={IMAGES.upload_bill} style={{ width: 20, height: 20, marginRight: 5 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalButton} onPress={ComplateOrder}>
            <Text style={styles.buttonText}>{t('Complete Order')}</Text>
          </TouchableOpacity>

          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>{t('Cancel')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  inputUpload: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.newbuttonColor,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RunningOrderUpload;
