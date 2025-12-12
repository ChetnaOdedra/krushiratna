import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import languages
import en from './translations/en.json';
import gu from './translations/gu.json';
import hi from './translations/hi.json';

const resources = { 
  en: { translation: en }, 
  gu: { translation: gu }, 
  hi: { translation: hi } 
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'gu', // Set Gujarati as the default language
    fallbackLng: 'gu', // Default to Gujarati if language is not available
    interpolation: { escapeValue: false },
  });

export default i18n;
