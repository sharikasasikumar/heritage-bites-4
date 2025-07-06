import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BarCodeScanner from "../screens/BarCodeScanner";
import ProfileScreen from "../screens/ProfileScreen";
import RecipesScreen from "../screens/RecipesScreen";
import SavedScreen from "../screens/SavedScreen";
const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Scanner" component={BarCodeScanner} />
    </Tab.Navigator>
  );
}
