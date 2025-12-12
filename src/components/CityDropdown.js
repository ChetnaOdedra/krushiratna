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
import Fonts from '../Util/Fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../Util/Colors';
import { useTranslation } from 'react-i18next';

const CityDropdown = (props) => {
  const { t } = useTranslation();
  const { lblcolor, selectedState, onSelectCity, lable, value ,validationerr} = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const borderColor = !!selectedState ? COLORS.focasInputText : COLORS.borderColor;

  useEffect(() => {
    if (selectedState?.id) {
      fetchCities(selectedState.id);
    }
  }, [selectedState]);

  const fetchCities = async (stateId) => {
    console.log(`https://krushiratan.itcc.net.au/api/cities/${stateId}`);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://krushiratan.itcc.net.au/api/states/${stateId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setCities(Array.isArray(result.cities) ? result.cities : []); // ✅ always array
    } catch (err) {
      setError('Failed to fetch cities');
      console.error('Error fetching cities:', err);
      setCities([]); // ✅ fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (city) => {
    onSelectCity?.(city);
    setModalVisible(false);
  };

  if (!selectedState) {
    return (
      <View style={styles.container}>
        <View style={[styles.dropdownButton, styles.disabledButton]}>
          <View style={styles.buttonContent}>
            <Text style={styles.disabledText}>જિલ્લો પસંદ કરો</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#999" />
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0066cc" />
          <Text style={styles.loadingText}>{t('loading_city')}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchCities(selectedState.id)}
          >
            <Text style={styles.retryButtonText}>{t('retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={[styles.label, { color: COLORS.newTxtTitleColor }]}>{t('select_city')}</Text> */}
      <TouchableOpacity
        style={[styles.dropdownButton, { borderColor:"#ABB0B8" },modalVisible && { borderColor: 'green' },validationerr && { borderColor: 'red' }]}
        onPress={() => setModalVisible(true)}
        disabled={!selectedState}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText} numberOfLines={1}>
            {value ? value.name : t('select_city')}
          </Text>
          <MaterialIcons
            name={modalVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
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
              <Text style={styles.modalHeaderText}>
                {t('select_city')}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {Array.isArray(cities) && cities.length > 0 ? (
              <FlatList
                data={cities}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      value?.id === item.id && styles.selectedOption
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value?.id === item.id && styles.selectedOptionText
                      ]}
                    >
                      {item.name}
                    </Text>
                    {value?.id === item.id && (
                      <MaterialIcons name="check" size={20} color="#0066cc" />
                    )}
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <View style={styles.noCitiesContainer}>
                <Text style={styles.noCitiesText}>
                  {t('no_cities_available')}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  loadingContainer: {
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666'
  },
  errorContainer: {
    height: 60,
    backgroundColor: '#fff8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 5
  },
  retryButton: {
    backgroundColor: '#0066cc',
    padding: 5,
    borderRadius: 4,
    marginTop: 5
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14
  },
  dropdownButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor:"#ABB0B8",
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0'
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  disabledText: {
    fontSize: 16,
    color: '#999',
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2'
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1
  },
  closeButton: {
    padding: 5
  },
  optionItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectedOption: {
    backgroundColor: '#f0f8ff'
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  selectedOptionText: {
    color: '#0066cc',
    fontWeight: 'bold'
  },
  separator: {
    height: 1,
    backgroundColor: '#e2e2e2'
  },
  noCitiesContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noCitiesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
  },
  label: {
    ...Fonts.FontStyle.SSinputTitle,
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 1,
    marginLeft: 40,
    top: -12
  }
});

export default CityDropdown;
