import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { registerForPushNotificationAsync } from "../../utils/registerForPushNotificationAsync";
import { themes } from "../../themes";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";

// 10 seconds from now
const frequency = 14 * 24 * 60 * 60 * 1000;

export const countDownStorageKey = "tasklyCountDown";

export type PersistedCountDownStatus = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};

type CountDownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const confettiRef = useRef<any>();
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
    confettiRef?.current.start();
    let pushNotificationId;
    const status = await registerForPushNotificationAsync();

    if (status === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to wash the car. 🚗",
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
          Car wash is overdue by...
        </Text>
      ) : (
        <Text style={styles.heading}>Car wash will due in...</Text>
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
        <Text style={styles.text}>I've washed the car!</Text>
      </TouchableOpacity>
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: Dimensions.get("window").width / 2, y: -30 }}
        autoStart={false}
        fadeOut={true}
      />
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
