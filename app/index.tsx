import { StyleSheet, ScrollView, TextInput } from "react-native";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { themes } from "../themes";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
};

const initialList: ShoppingListItemType[] = [
  { id: "1", name: "Coffee" },
  { id: "2", name: "Tea" },
  { id: "3", name: "Milk" },
];

export default function App() {
  const [value, setValue] = useState<string>("");
  const [shoppingList, setShoppingList] =
    useState<ShoppingListItemType[]>(initialList);

  const handleSubmit = () => {
    const newShoppingList = [
      { id: new Date().toTimeString(), name: value },
      ...shoppingList,
    ];

    setShoppingList(newShoppingList);
    setValue("");
  };

  return (
    <ScrollView
      style={styles.container}
      stickyHeaderIndices={[0]}
      contentContainerStyle={styles.contentContainer}
    >
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={setValue}
        placeholder="E.g. Coffee"
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />

      {shoppingList.map(({ id, name }) => {
        return <ShoppingListItem name={name} key={id} />;
      })}
    </ScrollView>
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
});
