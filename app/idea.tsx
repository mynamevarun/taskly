import { StyleSheet, Text, View } from "react-native";

export default function IdeaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Idea Aaya</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
  },
});
