import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, Switch, Text, View } from "react-native";

export default function LanguageToggle() {
  const { i18n: i18nextInstance } = useTranslation();
  const isArabic = i18nextInstance.language === "ar";

  const toggleLanguage = async () => {
    const newLang = isArabic ? "en" : "ar";

    await i18nextInstance.changeLanguage(newLang);

    await AsyncStorage.setItem("userLanguage", newLang);

    await I18nManager.forceRTL(newLang === "ar");

    if (Updates.reloadAsync) {
      await Updates.reloadAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isArabic ? "العربية" : "English"}</Text>
      <Switch
        onValueChange={toggleLanguage}
        value={isArabic}
        trackColor={{ false: "#767577", true: "#767577" }}
        thumbColor={isArabic ? "#552900" : "#552900"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
});
