import { StyleSheet, FlatList, TextInput, Text, View } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { themes } from "../themes";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  const handleSubmit = () => {
    const newShoppingList = [
      {
        id: new Date().toTimeString(),
        name: value,
        lastUpdatedTimestamp: Date.now(),
      },
      ...shoppingList,
    ];

    setShoppingList(newShoppingList);
    setValue("");
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);

    setShoppingList(newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) =>
      item.id === id
        ? {
            ...item,
            completedAtTimestamp: item.completedAtTimestamp
              ? undefined
              : Date.now(),
            lastUpdatedTimestamp: Date.now(),
          }
        : item
    );

    setShoppingList(newShoppingList);
  };

  const orderShoppingList = (
    shoppingList: ShoppingListItemType[],
  ): ShoppingListItemType[] => {
    return shoppingList.sort((item1, item2): number => {
      if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
        return item2.completedAtTimestamp - item1.completedAtTimestamp;
      } else if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
        return 1;
      } else if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
        return -1;
      } else if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) {
        return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
      }

      return 1;
    });
  };

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
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
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
          isCompleted={Boolean(item.completedAtTimestamp)}
        />
      )}
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
