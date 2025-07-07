import { signOut } from "firebase/auth";
import { Button, StyleSheet, Text, View, Alert } from "react-native";
import { auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  const uploadRecipe = () => {
    navigation.navigate("UploadRecipe");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Button title="Upload Recipe" onPress={uploadRecipe} />
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff6eb",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});
