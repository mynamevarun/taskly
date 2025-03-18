import { Stack } from "expo-router";

export default function IndexLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Shopping List" }}
      ></Stack.Screen>
    </Stack>
  );
}
