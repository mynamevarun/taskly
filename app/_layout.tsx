import { Stack } from "expo-router";

export default function IndexLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Shopping List" }}
      ></Stack.Screen>
      <Stack.Screen
        name="counter"
        options={{
          title: "Counter",
          presentation: "modal",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="idea"
        options={{ title: "Idea", presentation: "modal" }}
      ></Stack.Screen>
    </Stack>
  );
}
