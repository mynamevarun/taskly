import { Stack, Link } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable } from "react-native";
import { themes } from "../../themes";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => {
            return (
              <Link href="/counter/history" asChild>
                <Pressable>
                  <MaterialIcons
                    name="history"
                    size={32}
                    color={themes.colorGrey}
                  />
                </Pressable>
              </Link>
            );
          },
        }}
      />
      <Stack.Screen name="history" options={{ title: "History" }} />
    </Stack>
  );
}
