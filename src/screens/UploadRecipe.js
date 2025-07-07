import { Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";

export default function UploadRecipe() {
  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Recipe Name</Text>
      <TextInput
        value={recipeName}
        onChangeText={setRecipeName}
        placeholder="Eg: Chicken Curry"
        style={styles.input}
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        value={instructions}
        onChangeText={setInstructions}
        placeholder="Describe how to cook it..."
        multiline
        style={[styles.input, styles.textarea]}
      />
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
});
