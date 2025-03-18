import { Tabs } from "expo-router";

export default function IndexLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "Shopping List" }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="counter"
        options={{
          title: "Counter",
        }}
      ></Tabs.Screen>
      <Tabs.Screen name="idea" options={{ title: "Idea" }}></Tabs.Screen>
    </Tabs>
  );
}
