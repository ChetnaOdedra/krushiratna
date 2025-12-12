import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import QuantitySelector from './Component/QuantitySelector';
import MinimalHeader from '../../components/MinimalHeader';
import { t } from 'i18next';
import KShopApi from '../../Services/KShopApi';
import ImageSwiper from '../../components/ImageSwiper';
import COLORS from '../../Util/Colors';
import IMAGES from '../../Util/Images';
import LottieView from 'lottie-react-native';

const ProductDetailScreen = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGujaratiPopup, setShowGujaratiPopup] = useState(false);
  const product = props.route.params?.product || {};
  const KshopApi = KShopApi.create();

  useEffect(() => {
    console.log('Product details loaded:', props.route.params?.product || product);
  }, []);

  const handleBuyNow = () => {
    setShowPopup(true);
  };

  const confirmPurchase = async () => {
    setIsLoading(true);

    let params = {
      kshop_product_id: product.id,
      qty: quantity,
    };

    try {
      const response = await KshopApi.KshopsubmitOrder(params);

      if (response.status === 200) {
        console.log('Purchase successful:', response);
        setShowPopup(false);
        setShowGujaratiPopup(true);
        setTimeout(() => {
          setShowGujaratiPopup(false);
          props.navigation.navigate('RunningOrderedScreen', { from: 'ProductDetailScreen' });
        }, 2500);
      } else {
        console.log('Purchase failed:', response);
        alert(t('Something went wrong!'));
        setShowPopup(false);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(t('Something went wrong!'));
      setShowPopup(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MinimalHeader title={t('Product Detail')} onBackPress={() => props.navigation.goBack()} />
      <ScrollView style={styles.container}>
        <ImageSwiper images={product.img} />
        <View style={styles.content}>
          {product.category && product.category.name ? (
            <Text style={{ fontSize: 12, color: '#888', marginBottom: 2, fontWeight: '900', marginTop: 2 }}>
              {product.category.name}
            </Text>
          ) : null}
          <Text style={styles.title}>{product.name}</Text>
          <View style={styles.row}>
            <Image source={{ uri: product.company?.img }} style={styles.imageCompany} />
              <Text style={[styles.company,{flex:1}]}>{product.company?.name || ''}</Text>

            <Text style={styles.free}>Free delivery</Text>

          </View>

          <View style={styles.rowBetween}>
            <View style={styles.priceRow}>

              { product.discount_price && product.discount_price != '' &&
                  <Text style={styles.discountPrice}>₹{product.discount_price.toLocaleString('en-US')}</Text>
              }   
              { product.price && product.price != '' &&
                  <Text style={styles.originalPrice}>₹{product.price.toLocaleString('en-US')}</Text>
              }   
            </View>
            <View style={styles.qty}>
              <Text style={{ marginRight: 6 }}>{t('Quantity')}:</Text>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity(prev => Math.max(prev - 1, 1))}
                onIncrease={() => setQuantity(prev => prev + 1)}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t('Product Overview')}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
            <Text style={styles.buttonText}>{t('Buy Now')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        transparent
        visible={showPopup}
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalContainer}>
           {isLoading ? (
              <></>
            ) : (
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('Confirm Your Purchase')}</Text>
              <View style={styles.productInfo}>
                  <Text style={styles.label}>{t('Product')}:</Text>
                  <Text style={styles.value}>{product.name}</Text>

                  <Text style={styles.label}>{t('Quantity')}:</Text>
                  <Text style={styles.value}>{quantity}</Text>
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={confirmPurchase} style={styles.confirmBtn}>
                    <Text style={styles.confirmText}>{t('Yes, Buy')}</Text>
                  </TouchableOpacity>
                </View>
            </View>
            )}
          </View>
      </Modal>

      {/* Gujarati Confirmation Popup */}
        {/* Gujarati Confirmation Popup */}
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
              <Text style={styles.modalTitle}>તમારો ઓર્ડર અમને મળી ગયો છે</Text>
              <Text style={{ textAlign: 'center', fontSize: 16, color: '#444' }}>
                કૃપા કરીને પુષ્ટિ માટે રાહ જુઓ.
              </Text>
            </View>
          </View>
        </Modal>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'contain',
    backgroundColor: '#f8f8f8',
  },
  imageCompany: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  company: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginRight: 8,
  },
  free: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    alignSelf:'center',
    justifyContent:'center'
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.newbuttonColor,
    height: 52,
    width: '100%',
    justifyContent:'center',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
    justifyContent:'flex-end',
    textAlign:'center',

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
  productInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelBtn: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmBtn: {
    backgroundColor: COLORS.newbuttonColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
