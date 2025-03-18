import { StyleSheet, View, Text } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { themes } from "../themes";
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Link href="/counter" style={styles.link}>
        <Text>Go to Counter</Text>
      </Link>
      <ShoppingListItem name="Coffee" />
      <ShoppingListItem name="Tea" isCompleted />
      <ShoppingListItem name="Sugar" isCompleted />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colorWhite,
    justifyContent: "center",
  },
  link: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 18,
  },
});
