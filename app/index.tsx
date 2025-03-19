import {
  StyleSheet,
  FlatList,
  TextInput,
  Text,
  View,
  LayoutAnimation,
} from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { themes } from "../themes";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";

const storageKey = "shopping-list";
type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await getFromStorage(storageKey);

      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(data);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = () => {
    const newShoppingList = [
      {
        id: new Date().toTimeString(),
        name: value,
        lastUpdatedTimestamp: Date.now(),
      },
      ...shoppingList,
    ];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, newShoppingList);
    setValue("");
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id === id) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
          lastUpdatedTimestamp: Date.now(),
        };
      }
      return item;
    });

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShoppingList(newShoppingList);
    saveToStorage(storageKey, newShoppingList);
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
