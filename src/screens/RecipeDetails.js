import { Image, ScrollView, StyleSheet, Text } from "react-native";

export default function RecipeDetailsScreen({ route }) {
  const { recipe } = route.params;
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure || ""} ${ingredient}`.trim());
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Text style={styles.subtitle}>Ingredients:</Text>
      {ingredients.map((item, index) => (
        <Text key={index} style={styles.ingredient}>
          • {item}
        </Text>
      ))}
      <Text></Text>
      <Text style={styles.subtitle}>Instructions:</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  category: { fontSize: 16, marginBottom: 16 },
  instructions: { fontSize: 16, lineHeight: 22 },
});
