import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import lang from './language/lang.json';

const langWithIndexSignature: {
  [key: string]: { WelcomeMessage: string };
} = lang;

const resources: Record<string, typeof langWithIndexSignature> = {};

Object.keys(langWithIndexSignature).forEach((key) => {
  resources[key] = {
    translation: langWithIndexSignature[key],
  };
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
