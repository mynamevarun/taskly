import { StyleSheet, FlatList, TextInput, Text, View } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { themes } from "../themes";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
};



export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>([]);

  const handleSubmit = () => {
    const newShoppingList = [
      { id: new Date().toTimeString(), name: value },
      ...shoppingList,
    ];

    setShoppingList(newShoppingList);
    setValue("");
  };

  return (
    <FlatList
      data={shoppingList}
      style={styles.container}
      stickyHeaderIndices={[0]}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={setValue}
          placeholder="E.g. Coffee"
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>No items in the list.</Text>
        </View>
      }
      renderItem={({ item }) => <ShoppingListItem name={item.name} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colorWhite,
    padding: 12,
  },
  textInput: {
    borderColor: themes.colorGrey,
    borderWidth: 2,
    marginHorizontal: 12,
    padding: 12,
    marginBottom: 12,
    borderRadius: 50,
    fontSize: 18,
    backgroundColor: themes.colorWhite,
  },
  contentContainer: {
    paddingBottom: 12,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
