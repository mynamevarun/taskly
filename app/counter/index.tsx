import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { registerForPushNotificationAsync } from "../../utils/registerForPushNotificationAsync";
import { themes } from "../../themes";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";

// 10 seconds from now
const frequency = 10 * 1000;

const countDownStorageKey = "tasklyCountDown";

type PersistedCountDownStatus = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

type CountDownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [countDownState, setCountDownState] =
    useState<PersistedCountDownStatus>();
  const [status, setStatus] = useState<CountDownStatus>({
    isOverdue: false,
    distance: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const lastCompletedTimestamp = countDownState?.completedAtTimestamps[0];

  useEffect(() => {
    const init = async () => {
      const countDownState = await getFromStorage(countDownStorageKey);

      setCountDownState(countDownState);
      setIsFetching(false);
    };

    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeStamp = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now() + 1;

      setIsLoading(false);

      const isOverdue = isBefore(timeStamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timeStamp, end: Date.now() }
          : { start: Date.now(), end: timeStamp }
      );

      setStatus({
        isOverdue,
        distance,
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    let pushNotificationId;
    const status = await registerForPushNotificationAsync();

    if (status === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "This thing is due. 📨",
        },
        trigger: {
          seconds: frequency / 1000,
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

    if (countDownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countDownState?.currentNotificationId
      );
    }

    const newCountDownState: PersistedCountDownStatus = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countDownState
        ? [Date.now(), ...countDownState.completedAtTimestamps]
        : [Date.now()],
    };

    await saveToStorage(countDownStorageKey, newCountDownState);

    setCountDownState(newCountDownState);
  };

  {
    if (isLoading || isFetching) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      );
    }
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {status.isOverdue ? (
        <Text style={[styles.heading, styles.whiteText]}>
          Things is overdue by...
        </Text>
      ) : (
        <Text style={styles.heading}>Things will overdue in...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          number={status.distance.days ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
        <TimeSegment
          unit="Hours"
          number={status.distance.hours ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
        <TimeSegment
          unit="Minutes"
          number={status.distance.minutes ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
        <TimeSegment
          unit="Seconds"
          number={status.distance.seconds ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        ></TimeSegment>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={scheduleNotification}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>I've done the thing!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themes.colorWhite,
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
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  containerLate: {
    backgroundColor: themes.colorRed,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 24,
  },
  whiteText: {
    color: themes.colorWhite,
  },
  activityIndicator: {
    backgroundColor: themes.colorWhite,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
