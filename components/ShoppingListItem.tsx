import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { themes } from "../themes";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

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
      <View style={styles.row}>
        <Entypo
          name={isCompleted ? "check" : "circle"}
          size={24}
          color={isCompleted ? themes.colorGrey : themes.colorCerulean}
        />
        <Text
          style={[
            styles.itemText,
            isCompleted ? styles.completedItemText : undefined,
          ]}
        >
          {name}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          handleDelete();
        }}
        hitSlop={20}
      >
        <AntDesign
          name="delete"
          size={24}
          color={isCompleted ? themes.colorGrey : themes.colorRed}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 8,
    paddingVertical: 18,
    borderBottomColor: themes.colorCerulean,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completedItemContainer: {
    borderBottomColor: themes.colorGrey,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "200",
    marginLeft: 8,
    flex: 1,
  },
  completedItemText: {
    color: themes.colorGrey,
    textDecorationLine: "line-through",
    textDecorationColor: themes.colorGrey,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
