import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { registerForPushNotificationAsync } from "../../utils/registerForPushNotificationAsync";
import { themes } from "../../themes";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export default function CounterScreen() {
  const scheduleNotification = async () => {
    const status = await registerForPushNotificationAsync();

    if (status === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I'm a notification from your app! 📨",
        },
        trigger: {
          seconds: 5,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Notification are not enabled for this app.",
          "Enable the notifications from the settings."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={scheduleNotification}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>Schedule Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontWeight: "bold",
    color: themes.colorWhite,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  button: {
    backgroundColor: themes.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
});
