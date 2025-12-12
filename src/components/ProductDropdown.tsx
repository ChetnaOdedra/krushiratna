import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Modal, 
  FlatList,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../Util/Colors';
import Fonts from '../Util/Fonts';
import Api from '../Services/Api';
import { t } from 'i18next';

const ProductDropdown = (props) => {
  const { lblcolor, onSelect, label } = props;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const api = Api.create();

  useEffect(() => {
    getProductList(1);
  }, []);

  const getProductList = async (pageNumber = 1 , isLoadMore = false) => {

    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const params = {
        status: 1,
        page: pageNumber,
        limit,
      };

      const response = await api.getProductList(params);

      if (response.ok) {

        const newData = response.data?.data || [];
        const total = response.data?.meta?.total || 0;

        setProducts(prev =>
          pageNumber === 1 ? newData : [...prev, ...newData]
        );

        if ((page * limit) >= total) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
      }
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    }

    setLoading(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      getProductList(page,true);
    }
  };

  const handleSelect = (product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);
    const updatedSelection = isSelected
      ? selectedProducts.filter((p) => p.id !== product.id)
      : [...selectedProducts, product];

    setSelectedProducts(updatedSelection);
    onSelect?.(updatedSelection);
  };

  const renderSelectedProducts = () => {
    if (selectedProducts.length === 0) return t('Select Product');
    return selectedProducts.map(p => p.name).join(', ');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText} numberOfLines={1}>
            {renderSelectedProducts()}
          </Text>
          <MaterialIcons 
            name={modalVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="#666"
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>પાક પસંદ કરો</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="check" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={products}
              keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
              renderItem={({ item }) => {
                const isSelected = selectedProducts.some((p) => p.id === item.id);
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOption
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText
                    ]}>
                      {item.name}
                    </Text>
                    {isSelected && (
                      <MaterialIcons name="check" size={20} color="#0066cc" />
                    )}
                  </TouchableOpacity>
                );
              }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              nestedScrollEnabled={true}
              ListFooterComponent={
              loading ?  <ActivityIndicator size="small" color="#0066cc" />:null
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:10,
  },
  dropdownButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  optionItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedOptionText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e2e2',
  },
  label: {
    ...Fonts.FontStyle.SSinputTitle, 
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 1,
    marginTop: 10,
    marginLeft: 40,
  },
});

export default ProductDropdown;
