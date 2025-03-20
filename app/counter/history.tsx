import { View, Text, StyleSheet, FlatList } from "react-native";
import { countDownStorageKey, PersistedCountDownStatus } from ".";
import { useEffect, useState } from "react";
import { getFromStorage } from "../../utils/storage";
import { format } from "date-fns";
import { themes } from "../../themes";

const fullDateFormat = `LLL d yyyy, h:mm aaa`;

export default function HistoryScreen() {
  const [countDownState, setCountDownState] =
    useState<PersistedCountDownStatus>();

  useEffect(() => {
    const init = async () => {
      const data = await getFromStorage(countDownStorageKey);

      setCountDownState(data);
    };

    init();
  });

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={countDownState?.completedAtTimestamps}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>No items in the list.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.dateText}>{format(item, fullDateFormat)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 8,
  },
  list: {
    flex: 1,
    backgroundColor: themes.colorWhite,
  },
  listItem: {
    padding: 12,
    backgroundColor: themes.colorLightGrey,
    borderWidth: 1,
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
