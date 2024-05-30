import AsyncStorage from '@react-native-async-storage/async-storage';
 import messaging from '@react-native-firebase/messaging';

 import PushNotification, {Importance} from 'react-native-push-notification';
import {navigate} from '../navigation/NavigationService';
import navigationStrings from '../navigation/navigationStrings';
import actions from '../redux/actions';

export async function requestUserPermission(callback = () => {}) {
  // if (Platform.OS === 'ios') {
  //   await messaging().registerDeviceForRemoteMessages();
  //   await messaging().registerForRemoteNotifications()
  // }
  // const authStatus = await messaging().requestPermission();
  // const enabled =
  //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  // if (enabled) {
  //   console.log('Authorization status:', enabled);
  //   getFcmToken();
  //   callback(false);
  // } else callback(true);
}

// const romoveToken = () => {
//  getMessaging()
//     .unsubscribeFromTopic(fcmToken, 'highScores')
//     .then(response => {
//       // See the MessagingTopicManagementResponse reference documentation
//       // for the contents of response.
//       console.log('Successfully unsubscribed from topic:', response);
//     })
//     .catch(error => {
//       console.log('Error unsubscribing from topic:', error);
//     });
// };

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (fcmToken != null) {
    actions.saveFcmToken(fcmToken);
  }

  console.log(fcmToken, 'the old token');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'the new genrated token');
        actions.saveFcmToken(fcmToken);
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error in fcmToken');
      // showError(error.message)
    }
  }
};

export const notificationListener = async () => {
  PushNotification.configure({
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    requestPermissions: true,
    popInitialNotification: true,
  });

  createDefaultChannels();

  function createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: `Default channel`, // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: 'Royo-Delivery', // (required)
        channelName: `Royo Delivery`, // (required)
        channelDescription: 'A sound channel 2', // (optional) default: undefined.
        soundName: 'notification.mp3', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  //Backgorund
  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log(
      'Notification caused app to open from background state bla bla:',
      JSON.stringify(remoteMessage),
    );
    const {notification} = remoteMessage;
    if (
      notification?.sound == 'notification.mp3' ||
      notification?.android?.sound == 'notification'
    ) {
      if (
        notification?.data?.callback_url != '' &&
        notification?.data?.callback_url != null
      ) {
        navigate(navigationStrings.ORDERDETAIL, {
          data: {
            item: notification?.data?.callback_url,
            fromNotification: true,
          },
        });
      } else {
        console.log('here>>1');
        actions.isModalVisibleForAcceptReject({
          isModalVisibleForAcceptReject: true,
          notificationData: remoteMessage,
        });
      }
    }
  });

  //Kill or inactive
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'remote message inital notification',
          JSON.stringify(remoteMessage),
        );
        const {notification} = remoteMessage;
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        if (
          notification?.sound == 'notification.mp3' ||
          notification?.android?.sound == 'notification'
        ) {
          if (
            notification?.data?.callback_url != '' &&
            notification?.data?.callback_url != null
          ) {
            navigate(navigationStrings.ORDERDETAIL, {
              data: {
                item: notification?.data?.callback_url,
                fromNotification: true,
              },
            });
          } else {
            console.log('here>>2');
            actions.isModalVisibleForAcceptReject({
              isModalVisibleForAcceptReject: true,
              notificationData: remoteMessage,
            });
          }
        }
      }
    });

  return null;
};
