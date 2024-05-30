import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {getBundleId} from 'react-native-device-info';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ModalView from '../../Components/ShortCodeConfirmModal';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
// import store from '../../redux/store';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {appIds, shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import {requestUserPermission} from '../../utils/notificationServices';
import {getItem, getUserData} from '../../utils/utils';
import styles from './styles';
import store from '../../redux/store';
import types from '../../redux/types';

export default function ShortCode({route, navigation}) {
  const shortCodeParam = route?.params?.shortCodeParam;

  const [state, setState] = useState({
    isLoading: false,
    shortCode: null,
    shortCodeShow: '',
    changeInShortCode: false,
    shortCodeDataInfo: null,
    isModalVisibleForShortCodeDetail: false,
    isShortcodePrefilled: true,
    viewWidth: null,
  });

  const {
    isLoading,
    shortCode,
    shortCodeShow,
    changeInShortCode,
    shortCodeDataInfo,
    isModalVisibleForShortCodeDetail,
    isShortcodePrefilled,
    viewWidth,
  } = state;
  const updateState = data => setState(state => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const {defaultLanguage, internetConnection} = useSelector(
    state => state?.initBoot,
  );

  const {userData} = useSelector(state => state?.auth);

  useEffect(() => {
    requestUserPermission();
  }, []);

  const checkAsynStorageData = async () => {
    const {dispatch} = store;
    const userData = await getUserData();
    const defaultLanguage = await getItem('defaultLanguage');
    console.log(userData, 'userdata in app.js');
    console.log(defaultLanguage, 'defaultLanguage in app.js');
    if (userData && !!userData?.access_token) {
      dispatch({
        type: types.LOGIN,
        payload: userData,
      });
    }
    if (defaultLanguage?.value) {
      strings.setLanguage(defaultLanguage?.value);
      dispatch({
        type: types.DEFAULTLANGUAGE,
        payload: defaultLanguage,
      });
    }
    const getClientInfo = await getItem('clientInfo');
    console.log('clientInfoclientInfo', getClientInfo);
    dispatch({
      type: types.APP_INIT,
      payload: getClientInfo,
    });

    if (!userData && !userData?.access_token) {
      navigation.navigate(navigationStrings.LOGIN);
    }
    return;
  };

  useEffect(() => {
    (async () => {
      const saveShortCode = await getItem('saveShortCode');
      console.log(saveShortCode, 'this is short code');
      switch (getBundleId()) {
       
        case appIds.fawaz:
          updateState({
            shortCode: shortCodes.fawaz,
            isShortcodePrefilled: true,
          });
          break;
        
      }
    })();
  }, [internetConnection]);

  //Process init when code update
  useEffect(() => {
    console.log(shortCode,isShortcodePrefilled,'shortCode isShortcodePrefilled')
    // if (shortCode && isShortcodePrefilled) {
      checkScreen();
    // }
  }, [shortCode, isShortcodePrefilled, internetConnection]);

  const checkScreen = () => {
    initApiHit();
  };

  //Opt input function
  const onOtpInput = code => {
    (async () => {
      updateState({
        isLoading: true,
        shortCode: code,
        changeInShortCode: true,
        // isShortcodePrefilled: true,
      });
      //
    })();
  };

  useEffect(() => {
    console.log(changeInShortCode,'changeInShortCode')
    if (changeInShortCode) {
      initApiHit();
    }
  }, [changeInShortCode]);

  //On click login button
  const _onSubmitShortCode = () => {
    updateState({isLoading: true});
    initApiHit();
  };

  //short code And init api hit
  const initApiHit = () => {
    (async () => {
     // const saveShortCode = await getItem('saveShortCode');
     const saveShortCode = 'b3e0fe';
      console.log(defaultLanguage?.value, 'Language in init screen');
      let header = {};
      if (defaultLanguage?.id) {
        header = {
          language: defaultLanguage?.value,
          client:'fawaz'
        };
      } else {
        header = {
          language: 'en',
          client:'fawaz'
        };
      }

      // let updatedShortCode = shortCode;
      let updatedShortCode ='b3e0fe';
      // updatedShortCode = '1da2e9';
      //  let updatedShortCode = '1fdd1d';

      actions
        .initApp({shortCode: updatedShortCode}, header)
        .then(res => {
          if (getBundleId() == appIds.royoorder && res?.data) {
            actions.saveShortCode(updatedShortCode);
          }
          actions.saveShortCode(updatedShortCode);
          console.log(res, 'res>res>res');
          updateState({
            changeInShortCode: false,
            isLoading: false,
            shortCodeDataInfo: res?.data,
          });

          if (getBundleId() == appIds.royoorder) {
            if (saveShortCode && !shortCodeParam) {
              _redirectToLogin(res?.data);
            } else {
              updateState({
                isModalVisibleForShortCodeDetail: true,
              });
            }
          } else {
            _redirectToLogin(res?.data);
          }
        })
        .catch(errorMethod);
    })();
  };

  //Error handling in screen
  const errorMethod = error => {
    console.log(error, 'short code error');
    updateState({
      isLoading: false,
      shortCode: '',
      shortCodeShow: '',
      changeInShortCode: false,
      isLoadingB: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  const _redirectToLogin = async shortCodeDataInfo => {
    updateState({isModalVisibleForShortCodeDetail: false});
    checkAsynStorageData();
    const userData = await getUserData();
    console.log(userData, 'userDataInShortcode');
    userData && userData?.access_token
      ? navigation.push(navigationStrings.DRAWER_ROUTES)
      : moveToNewScreen(navigationStrings.LOGIN, shortCodeDataInfo)();
  };

  //Modal main component
  const modalMainContent = () => {
    return (
      <View
        onLayout={event => {
          updateState({viewWidth: event.nativeEvent.layout.width});
        }}>
        <View style={styles.imageView}>
          <Image
            source={{uri: shortCodeDataInfo?.logo}}
            style={{height: 100, width: 100, borderRadius: 100 / 2}}
            resizeMode={'contain'}
          />
        </View>
        <View
          style={{
            marginTop: moderateScale(75),
            marginHorizontal: moderateScale(10),
          }}>
          <Text style={styles.company_address}>
            <Text>{`${shortCodeDataInfo?.company_name} ,`}</Text>
            {shortCodeDataInfo?.company_address}
          </Text>
          <Text style={styles.name}>{shortCodeDataInfo?.name}</Text>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            activeOpacity={0}
            onPress={() =>
              updateState({isModalVisibleForShortCodeDetail: false})
            }
            style={[
              styles.cancelButtonView,
              {width: viewWidth ? viewWidth / 2 : width - (width / 1.5 - 20)},
            ]}>
            <Text style={styles.cancel}>{strings.CANCEL}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => _redirectToLogin(shortCodeDataInfo)}
            style={[
              styles.confirmButtonView,
              {width: viewWidth ? viewWidth / 2 : width - (width / 1.5 - 20)},
            ]}>
            <Text style={styles.confirm}>{strings.CONFIRM}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      {isShortcodePrefilled ? (
        <View style={{flex: 1}}></View>
      ) : (
        <>
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 0.4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={imagePath.logo} />
            </View>
            <View style={{flex: 0.6, marginHorizontal: moderateScale(20)}}>
              <Text style={styles.loginUsing}>{strings.LOGINUSING}</Text>
              <Text style={styles.loginUsing}>{strings.COMPANYCODE}</Text>
              <Text style={styles.weneedCompany}>
                {strings.WENEDDCOMPNAYCODE}
              </Text>
              <View style={{marginTop: moderateScale(20)}}>
                <SmoothPinCodeInput
                  containerStyle={{alignSelf: 'center'}}
                  password
                  mask={<View style={styles.maskStyle} />}
                  cellSize={width / 8}
                  codeLength={6}
                  cellSpacing={10}
                  editable={true}
                  cellStyle={styles.cellStyle}
                  cellStyleFocused={styles.cellStyleFocused}
                  textStyle={styles.textStyleCodeInput}
                  textStyleFocused={styles.textStyleFocused}
                  inputProps={{
                    autoCapitalize: 'none',
                  }}
                  value={shortCodeShow}
                  autoFocus={false}
                  keyboardType={'default'}
                  onTextChange={shortCodeShow => updateState({shortCodeShow})}
                  onFulfill={code => onOtpInput(code)}
                />
              </View>
              <View
                style={{
                  marginTop: moderateScaleVertical(20),
                  justifyContent: 'flex-end',
                }}>
                <ButtonWithLoader
                  color={colors.black}
                  btnStyle={styles.buttonStyle}
                  onPress={_onSubmitShortCode}
                  btnText={strings.LOGIN}
                  btnTextStyle={{
                    color: colors.white,
                  }}
                />

                {/* <Text style={styles.whereCanIhelp}>
                  {strings.WHEREICANSIGNUP}
                </Text> */}
              </View>
            </View>
          </View>

          <ModalView
            data={shortCodeDataInfo}
            isVisible={isModalVisibleForShortCodeDetail}
            onClose={() =>
              updateState({isModalVisibleForShortCodeDetail: false})
            }
            mainViewStyle={{
              // minHeight: height / 3,
              maxHeight: height,
              marginHorizontal: moderateScale(20),
            }}
            modalMainContent={modalMainContent}
            // modalBottomContent={modalBottomContent}
          />
        </>
      )}
    </WrapperContainer>
  );
}
