import React, {useState, useEffect} from 'react';
import FlashMessage from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';
 import SplashScreen from 'react-native-splash-screen';

import {SafeAreaProvider} from 'react-native-safe-area-context';
// import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import NoInternetModal from './src/Components/NoInternetModal';
import Container from './src/library/toastify-react-native';
import Routes from './src/navigation/Routes';
import store from './src/redux/store';
import {
  setDefaultLanguage,
  updateInternetConnection,
} from './src/redux/actions/init';
import {moderateScaleVertical, width} from './src/styles/responsiveSize';
import types from './src/redux/types';
import {getItem, getUserData} from './src/utils/utils';
import useInterval from './src/utils/useInterval';
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationServices';
import ShowNotificationForeground from './src/utils/ShowNotificationForeground';
import NotificationModal from './src/Components/NotificationModal';
import strings from './src/constants/lang';
 import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import {appIds} from './src/utils/constants/DynamicAppKeys';
import Modal from 'react-native-modal';
// import codePush from 'react-native-code-push';
import * as Progress from 'react-native-progress';
import colors from './src/styles/colors';
import fontFamily from './src/styles/fontFamily';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
// let CodePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};
if (!firebase.apps.length) {
  firebase.initializeApp({ apiKey: 'AIzaSyAKxlO9OKIncFrbcb1tSpQgbfnY64Ou6sk',
  authDomain: 'royo-order-version2.firebaseapp.com',
  databaseURL: 'https://royo-order-version2.firebaseio.com',
  projectId: 'royo-order-version2',
  storageBucket: 'royo-order-version2.appspot.com',
  appId: '1:1073948422654:ios:dc0471afc0e5c629c410af',
  messagingSenderId: '1073948422654' });
}
const App = () => {
  const [internetConnection, setInternet] = useState(true);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    // codePush.sync(
    //   {
    //     installMode: codePush.InstallMode.IMMEDIATE,
    //     updateDialog: true,
    //   },
    //   codePushStatusDidChange,
    //   codePushDownloadDidProgress,
    // );
  }, []);

  // function codePushStatusDidChange(syncStatus) {
  //   switch (syncStatus) {
  //     case codePush.SyncStatus.CHECKING_FOR_UPDATE:
  //       console.log('status Checking for update');
  //       break;
  //     case codePush.SyncStatus.DOWNLOADING_PACKAGE:
  //       console.log(' status Downloading package');
  //       break;
  //     case codePush.SyncStatus.AWAITING_USER_ACTION:
  //       console.log('codepush status Awaiting user action');
  //       break;
  //     case codePush.SyncStatus.INSTALLING_UPDATE:
  //       console.log('codepush status Installing update');
  //       setProgress(false);
  //       break;
  //     case codePush.SyncStatus.UP_TO_DATE:
  //       console.log('codepush status App up to date');
  //       setProgress(false);
  //       break;
  //     case codePush.SyncStatus.UPDATE_IGNORED:
  //       console.log('codepush status Update cancelled by user');
  //       setProgress(false);
  //       break;
  //     case codePush.SyncStatus.UPDATE_INSTALLED:
  //       console.log(
  //         'codepush status Update installed and will be applied on restart',
  //       );
  //       setProgress(false);
  //       break;
  //     case codePush.SyncStatus.UNKNOWN_ERROR:
  //       console.log('codepush status An unknown error occurred.');
  //       setProgress(false);
  //       break;
  //   }
  // }

  function codePushDownloadDidProgress(progress) {
    // console.log('codepush status progress status', progress);
    setProgress(progress);
  }

  const setInitialLanguage = () => {
    if (appIds.bluebolt == DeviceInfo.getBundleId()) {
      setDefaultLanguage({
        id: 9,
        label: 'Vietnamese',
        value: 'vi',
      });
    }
  };

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      console.log(value, 'valuevaluevaluevalue');
      // const data = true;
      if (value == null) {
        data = JSON.stringify({data: true});
        AsyncStorage.setItem('alreadyLaunched', data); // No need to wait for `setItem` to finish, although you might want to handle errors
        setInitialLanguage();
      } else {
      }
    }); // Add some error handling, also you can simply do this.setState({fistLaunch: value == null})
  }, []);

  const notificationConfig = () => {
    console.log('shashsisis');
    requestUserPermission();
    notificationListener();
  };

  useEffect(() => {
    checkExistChannel();
    notificationConfig();
    setTimeout(() => {
      // SplashScreen.hide();
    }, 1500);
  }, []);

  //rest of code will be performing for iOS on background too

  // BackgroundTimer.stopBackgroundTimer();

  const checkExistChannel = () => {
    // PushNotification.getChannels(function (channel_ids) {
    //   console.log('exist channels', channel_ids); // ['channel_id_1']
    // });
  };

  //Check internet connection
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const netStatus = state.isConnected;
      setInternet(netStatus);
      updateInternetConnection(netStatus);
    });

    return () => removeNetInfoSubscription();
  }, []);

  const progressView = () => {
    return (
      <View>
        <Modal isVisible={true}>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: moderateScale(8),
              padding: moderateScale(16),
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: fontFamily.medium,
                color: colors.textGreyOpcaity7,
                fontSize: textScale(14),
              }}>
              In Progress...
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(12),
                marginBottom: moderateScaleVertical(4),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  color: colors.textGreyOpcaity7,
                  fontSize: textScale(12),
                }}>{`${(Number(progress?.receivedBytes) / 1048576).toFixed(
                2,
              )}MB/${(Number(progress.totalBytes) / 1048576).toFixed(
                2,
              )}MB`}</Text>

              <Text
                style={{
                  color: colors.black,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(12),
                }}>
                {(
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0)}
                %
              </Text>
            </View>

            <Progress.Bar
              progress={
                (
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0) / 100
              }
              width={width / 1.2}
              color={colors.black}
            />
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ShowNotificationForeground />
        {progress ? progressView() : null}
        {console.log('ssssssss')}
        <Routes />
        <NotificationModal />
      </Provider>
      <Container
        width={width - 20}
        position="top"
        duration={2000}
        positionValue={moderateScaleVertical(20)}
      />
      <FlashMessage position="top" />
      <NoInternetModal show={!internetConnection} />
    </SafeAreaProvider>
  );
};

export default App;
