import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  I18nManager,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import LanguageToggle from "../../components/LanguageToggle";
import { auth } from "../config/firebase";
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in!");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/HBlogo.png")}
          style={styles.image}
        ></Image>
        <Text style={styles.header}>{t("loginToYourAccount")}</Text>

        <TextInput
          style={[
            styles.input,
            {
              textAlign: I18nManager.isRTL ? "right" : "left",
              writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
              direction: I18nManager.isRTL ? "rtl" : "ltr",
            },
          ]}
          placeholder={t("email")}
          placeholderTextColor="#888"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[
            styles.input,
            {
              textAlign: I18nManager.isRTL ? "right" : "left",
              writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
              direction: I18nManager.isRTL ? "rtl" : "ltr",
            },
          ]}
          placeholder={t("password")}
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title={t("logIn")} onPress={handleLogin} />

        <Button
          title={t("noAccount")}
          onPress={() => navigation.navigate("Signup")}
        />
        <LanguageToggle />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFF6EB",
    alignItems: "center",
  },
  header: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width: 250,
  },
  image: { width: 210, height: 200, resizeMode: "contain", top: -50 },
});
