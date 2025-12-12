import React, { useState, useEffect } from 'react';
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
import Fonts from '../Util/Fonts'
import { useTranslation } from 'react-i18next';
const StateDropdown = (props) => {
  const { t } = useTranslation();
  const {lblcolor,onSelect,lable,validationerr} = props
  const [selectedState, setSelectedState] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const borderColor = !!selectedState ? COLORS.focasInputText : COLORS.borderColor;
  useEffect(() => {
    fetchStates();
  }, []);
    useEffect(() => {
      console.log("Validation error changed:", validationerr);
      }, [validationerr]);
  const fetchStates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://krushiratan.itcc.net.au/api/states');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setStates(result.data);
    } catch (err) {
      setError('Failed to fetch states');
      console.error('Error fetching states:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (state) => {
    setSelectedState(state);
    onSelect?.(state); 
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>{t("Loading_states")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchStates}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={[styles.label,{color:COLORS.newTxtTitleColor}]}>{t("select_state")}</Text> */}
      <TouchableOpacity 
        style={[styles.dropdownButton,{borderColor:"#ABB0B8"},modalVisible && { borderColor: 'green' }, validationerr && { borderColor: 'red' }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>
            {selectedState ? selectedState.name : t("select_state")}
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
              <Text style={styles.modalHeaderText}>{t("select_state")}</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={states}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    selectedState?.id === item.id && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedState?.id === item.id && styles.selectedOptionText
                  ]}>
                    {item.name}
                  </Text>
                  {selectedState?.id === item.id && (
                    <MaterialIcons name="check" size={20} color="#0066cc" />
                  )}
                </TouchableOpacity>
              )}
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
    padding: 0,
    marginTop:10
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  dropdownButton: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
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
  label:{
    ...Fonts.FontStyle.SSinputTitle, 
    position:'absolute',
    backgroundColor:'white',
    zIndex:1,
    marginTop:8,
    marginLeft:40,
 }
});

export default StateDropdown;