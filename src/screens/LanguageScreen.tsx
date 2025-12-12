import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../screenComponents/CustomHeader';
import UesrMob from '../Services/Mobxstate/UesrMob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import MinimalHeader from '../components/MinimalHeader';
const LanguageScreen = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'gu'); // Default to Gujarati

  const languages = [
    { code: 'gu', label: 'Gujarati' },
    { code: 'en', label: 'English' },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
    storeString('selectedLanguage', lang);
  };
  const SaveHandler = () => {
    navigation.goBack()
  }
// Store a string
const storeString = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('String saved!');
  } catch (e) {
    console.log('Saving error:', e);
  }
};
  return (
    <View style={{flex:1}}>
      <MinimalHeader title={t('Language Change')} onBackPress={() => props.navigation.goBack()} />
      <View style={styles.container}>
      <Text style={styles.title}>{t('select_language')}</Text>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={styles.option}
          onPress={() => changeLanguage(lang.code)}
        >
          <View style={styles.radioCircle}>
            {selectedLang === lang.code && <View style={styles.selectedCircle} />}
          </View>
          <Text style={styles.label}>{lang.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={SaveHandler}>
        <Text style={styles.saveText}>{t('save')}</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#28a745',
  },
  label: { fontSize: 16 },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default LanguageScreen;
