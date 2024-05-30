import {useEffect} from 'react';
import {Platform} from 'react-native';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
 import messaging from '@react-native-firebase/messaging';
 import PushNotification from 'react-native-push-notification';
import actions from '../redux/actions';
import {navigate} from '../navigation/NavigationService';
import navigationStrings from '../navigation/navigationStrings';

const ShowNotificationForeground = props => {
  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('remote message foreground', JSON.stringify(remoteMessage));
    //   const {data, messageId, notification} = remoteMessage;
    //   console.log(remoteMessage.data, notification, 'datadatadatadata');
    //   let notificationType = data?.type || data?.notificationType;
    //   // {
    //   //   Platform.OS == 'ios'
    //   //     ? PushNotificationIOS.addNotificationRequest({
    //   //         id: messageId,
    //   //         body: data?.message || '',
    //   //         title: notificationType || '',
    //   //         sound:
    //   //           notification.sound == 'notification.mp3'
    //   //             ? 'notification.mp3'
    //   //             : 'default',
    //   //       })
    //   //     : PushNotification.localNotification({
    //   //         channelId: notification.android.channelId,
    //   //         id: messageId,
    //   //         body: data?.message || '',
    //   //         title: notificationType || '',
    //   //         soundName: notification.android.sound,
    //   //         vibrate: true,
    //   //         playSound: true,
    //   //       });
    //   // }
    //   if (
    //     Platform.OS == 'android' &&
    //     notification.android.sound == 'notification'
    //   ) {
    //     console.log('here>>2');
    //     if (data && notificationType && notificationType != 'N') {
    //       actions.isModalVisibleForAcceptReject({
    //         isModalVisibleForAcceptReject: true,
    //         notificationData: remoteMessage,
    //       });
    //     }
    //     if (data?.callback_url != '' && data?.callback_url != null) {
    //       navigate(navigationStrings.ORDERDETAIL, {
    //         data: {item: data?.callback_url, fromNotification: true},
    //       });
    //     }
    //   }
    //   if (Platform.OS == 'ios' && notification.sound == 'notification.mp3') {
    //     console.log('here>>3');
    //     if (data && notificationType && notificationType != 'N') {
    //       actions.isModalVisibleForAcceptReject({
    //         isModalVisibleForAcceptReject: true,
    //         notificationData: remoteMessage,
    //       });
    //     }
    //     if (data?.callback_url != '' && data?.callback_url != null) {
    //       navigate(navigationStrings.ORDERDETAIL, {
    //         data: {item: data?.callback_url, fromNotification: true},
    //       });
    //     }
    //   }
    // });
    // return unsubscribe;
  }, []);
  return null;
};

export default ShowNotificationForeground;
