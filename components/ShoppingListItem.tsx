import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { themes } from "../themes";

type Props = {
  name: string;
  isCompleted?: boolean;
};

export function ShoppingListItem({ name, isCompleted }: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      "It will be gone for good",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log("Yes Pressed");
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedItemContainer : undefined,
      ]}
    >
      <Text
        style={[
          styles.itemText,
          isCompleted ? styles.completedItemText : undefined,
        ]}
      >
        {name}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          isCompleted ? styles.completedButton : undefined,
        ]}
        onPress={() => {
          handleDelete();
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderBottomColor: themes.colorCerulean,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completedItemContainer: {
    backgroundColor: themes.colorLightGrey,
    borderBottomColor: themes.colorGrey,
  },
  button: {
    backgroundColor: themes.colorBlack,
    borderRadius: 6,
    padding: 8,
  },
  completedButton: {
    backgroundColor: themes.colorGrey,
  },
  buttonText: {
    color: themes.colorWhite,
    letterSpacing: 1,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "200",
  },
  completedItemText: {
    color: themes.colorGrey,
    textDecorationLine: "line-through",
    textDecorationColor: themes.colorGrey,
  },
});
