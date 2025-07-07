import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

export default function RecipeDetailsScreen({ route }) {
  const { id, recipe } = route.params || {};
  const [data, setData] = useState(recipe || null);

  useEffect(() => {
    const fetchById = async () => {
      if (!recipe && id) {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const json = await res.json();
        setData(json.meals?.[0]);
      }
    };

    fetchById();
  }, [recipe, id]);

  if (!data) return <Text>Loading...</Text>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = data[`strIngredient${i}`];
    const measure = data[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure || ""} ${ingredient}`.trim());
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: data.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{data.strMeal}</Text>

      <Text style={styles.subtitle}>Ingredients:</Text>
      {ingredients.map((item, index) => (
        <Text key={index} style={styles.ingredient}>
          • {item}
        </Text>
      ))}

      <Text style={styles.subtitle}>Instructions:</Text>
      <Text style={styles.instructions}>{data.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  ingredient: { fontSize: 16, marginBottom: 4 },
  instructions: { fontSize: 16, lineHeight: 22, marginTop: 8 },
});
