import React, { useState, useEffect } from "react";
import {
  I18nManager,
  Alert,
  View,
  Text,
  Switch,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import i18n from "../src/i18n/i18n";

export default function LanguageToggle() {
  const [isArabic, setIsArabic] = useState(i18n.language === "ar");

  useEffect(() => {
    const loadLang = async () => {
      const lang = await AsyncStorage.getItem("userLanguage");
      setIsArabic(lang === "ar");
    };
    loadLang();
  }, []);

  const toggleLanguage = async () => {
    const newLang = isArabic ? "en" : "ar";
    const shouldBeRTL = newLang === "ar";

    try {
      await AsyncStorage.setItem("userLanguage", newLang);
      await i18n.changeLanguage(newLang);
      setIsArabic(!isArabic);
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.forceRTL(shouldBeRTL);

        Alert.alert(
          i18n.t("restartRequired") || "Restart Required",
          i18n.t("restartMessage") ||
            "The app needs to restart to apply changes.",
          [
            {
              text: i18n.t("restartNow") || "Restart Now",
              onPress: () => {
                setTimeout(async () => {
                  await Updates.reloadAsync();
                }, 250);
              },
            },
          ]
        );
      }
    } catch (err) {
      console.error("Language toggle failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isArabic ? "العربية" : "English"}</Text>
      <Switch value={isArabic} onValueChange={toggleLanguage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
  },
  label: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});
