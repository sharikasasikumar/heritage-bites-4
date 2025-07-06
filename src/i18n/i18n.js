import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar.json";
import en from "./en.json";

const fallbackLng = "en";

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    try {
      const storedLang = await AsyncStorage.getItem("userLanguage");

      if (storedLang) {
        callback(storedLang);
      } else {
        const deviceLang =
          Localization.getLocales()[0]?.languageCode || fallbackLng;
        callback(deviceLang === "ar" ? "ar" : "en");
      }
    } catch (e) {
      console.warn("Language detection error:", e);
      callback(fallbackLng);
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng,
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
