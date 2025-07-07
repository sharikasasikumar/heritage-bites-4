import {
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Button,
  Image,
  View,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function UploadRecipe() {
  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const handleSubmit = async () => {
    if (!recipeName || !ingredients || !instructions) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "user_uploads"), {
        userId: auth.currentUser.uid,
        recipeName,
        ingredients,
        instructions,
        imageUrl: image || null,
        createdAt: serverTimestamp(),
      });
      Alert.alert("Success", "Recipe uploaded!");
      setRecipeName("");
      setIngredients("");
      setInstructions("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading recipe:", error);
      Alert.alert("Error", "Failed to upload recipe.");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Recipe Name</Text>
      <TextInput
        value={recipeName}
        onChangeText={setRecipeName}
        placeholder="Eg: Chicken Curry"
        style={styles.input}
      />

      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="List ingredients..."
        multiline
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        value={instructions}
        onChangeText={setInstructions}
        placeholder="Describe how to cook it..."
        multiline
        style={[styles.input, styles.textarea]}
      />

      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Pick Image" onPress={pickImage} />

      <View style={styles.submitButton}>
        <Button title="Upload Recipe" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff6eb",
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  multiline: {
    height: 100,
    textAlignVertical: "top",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  submitButton: {
    marginTop: 20,
  },
});
