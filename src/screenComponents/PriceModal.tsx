import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useTranslation } from 'react-i18next';
import Fonts from "../Util/Fonts";
import showToast from "./showToast";

const PriceModal = ({ visible, onClose, MinPrice, Maxprice, onSave, ProductName }) => {
  const { t } = useTranslation();
  const [Minpricenew, setMinPriceNew] = useState(MinPrice);
  const [Maxpricenew, setMaxPriceNew] = useState(Maxprice);

  useEffect(() => {
    if (visible) {
      setMinPriceNew(MinPrice || "");
      setMaxPriceNew(Maxprice || "");
    }
  }, [visible, MinPrice, Maxprice]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{ProductName}</Text>

              <Text style={styles.label}>{t('Lowest Price')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                keyboardType="numeric"
                value={Minpricenew}
                onChangeText={setMinPriceNew}
              />

              <Text style={styles.label}>{t('Highest Price')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                keyboardType="numeric"
                value={Maxpricenew}
                onChangeText={setMaxPriceNew}
              />

              <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    const min = Minpricenew.trim();
                    const max = Maxpricenew.trim();

                    const isValidFormat = /^\d{1,5}$/.test(min) && /^\d{1,5}$/.test(max);
                    if (!isValidFormat) {
                      showToast(t('Please enter valid numeric prices up to 5 digits.'), 'error');
                      return;
                    }

                    const minValue = parseInt(min, 10);
                    const maxValue = parseInt(max, 10);

                    if (minValue >= maxValue) {
                      showToast(t('Minimum price must be less than maximum price..'), 'error');
                      return;
                    }

                    onSave(min, max);
                  }}
                >
                  <Text style={styles.saveText}>{t('Save')}</Text>
                </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10
  },
  input: {
    fontFamily: Fonts.fontTypes.base,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 5
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center"
  },
  saveText: {
    color: "white",
    fontWeight: "bold"
  }
});

export default PriceModal;
