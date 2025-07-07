import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BarCodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation();

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);
    setScannedData(`Type: ${type}\nData: ${data}`);

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${data}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      const recipe = json.meals?.[0];

      if (recipe) {
        navigation.navigate("RecipeDetails", { recipe });
      } else {
        alert("No recipe found for this ID.");
        setScanned(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong.");
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Text onPress={requestPermission}>Grant Camera Permission</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanned && !loading && (
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "code128"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.result}>Fetching recipe...</Text>
        </View>
      )}

      {scanned && !loading && (
        <View style={styles.overlay}>
          <Text style={styles.result}>{scannedData}</Text>
          <Pressable onPress={() => setScanned(false)}>
            <Text style={{ color: "#007AFF", marginTop: 10 }}>Scan Again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  result: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
  },
});
