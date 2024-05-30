import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {cloneDeep, isEmpty} from 'lodash';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import TextInputWithlabel from '../../Components/TextInputWithlabel';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {showError, showSuccess} from '../../utils/helperFunctions';
import {
  default as validations,
  default as validator,
} from '../../utils/validations';
import stylesFun from './styles';
export default function AddMoney({navigation}) {
  const {userData} = useSelector(state => state?.auth);
  const {clientInfo} = useSelector(state => state?.initBoot);
  console.log(clientInfo?.database_name, 'clientInfoclientInfo');
  const [state, setState] = useState({
    isPayoutModal: false,
    isLoading: true,
    payoutAmount: '',
    payoutDetails: [],
    isRefreshing: false,
    selectedPayoutOption: {},
    beneficiaryName: '',
    beneficiaryAcNum: '',
    beneficiaryISFC: '',
    beneficiaryBankName: '',
    agentPayoutList: [],
    pageNo: 1,
    limit: 10,
    stripeExistOrNot: false,
    razorPayExistOrNot: {},
    razorPayConnect: false,
    connectWithBank: false,
    name: '',
    ifsc: '',
    accountNumber: '',
    reenterAccountNumber: '',
    createContactData: '',
    isLoadingA: false,
    isLoadingB: false,
    isLoadingB: false,
    razorPayConnectedOrNot: false,
  });

  const styles = stylesFun();
  const {
    stripeExistOrNot,
    isPayoutModal,
    isLoading,
    payoutAmount,
    payoutDetails,
    isRefreshing,
    selectedPayoutOption,
    beneficiaryName,
    beneficiaryAcNum,
    beneficiaryISFC,
    beneficiaryBankName,
    agentPayoutList,
    pageNo,
    limit,
    razorPayExistOrNot,
    razorPayConnect,
    connectWithBank,
    name,
    ifsc,
    accountNumber,
    reenterAccountNumber,
    createContactData,
    isLoadingA,
    isLoadingB,
    razorPayConnectedOrNot,
  } = state;
  const updateState = data => setState(state => ({...state, ...data}));

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['0%', '50%', '70%'], []);
  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  useFocusEffect(
    React.useCallback(() => {
      getPayoutDetails();
      getBankDetails();
    }, [userData?.id, razorPayConnectedOrNot]),
  );

  useEffect(() => {
    if (isRefreshing || pageNo != 1) {
      getPayoutDetails();
    }
  }, [isRefreshing, pageNo]);

  const getBankDetails = () => {
    actions
      .agentBankDetails(
        {},
        {
          client: clientInfo?.database_name,
        },
      )
      .then(res => {
        console.log(res, '>>> Bank Details res ');
        updateState({
          beneficiaryName: !!res?.data?.agent_bank_details
            ? res?.data?.agent_bank_details?.beneficiary_name
            : '',
          beneficiaryAcNum: !!res?.data?.agent_bank_details
            ? res?.data?.agent_bank_details?.beneficiary_account_number
            : '',
          beneficiaryISFC: !!res?.data?.agent_bank_details
            ? res?.data?.agent_bank_details?.beneficiary_ifsc
            : '',
          beneficiaryBankName: !!res?.data?.agent_bank_details
            ? res?.data?.agent_bank_details?.beneficiary_bank_name
            : '',
        });
      })
      .catch(errorMethod);
  };

  const getPayoutDetails = () => {
    actions
      .agentPayoutDetails(
        `?page=${pageNo}&limit=${limit}`,
        {},
        {
          client: clientInfo?.database_name,
        },
      )
      .then(res => {
        console.log(res, 'resFromServer');
        updateState({
          payoutDetails: res?.data,
          stripeExistOrNot: res?.data?.payout_options.find(
            x => x?.code == 'stripe',
          ),
          razorPayExistOrNot: res?.data?.payout_options.find(
            x => x?.code == 'razorpay',
          ),
          agentPayoutList:
            pageNo === 1
              ? res?.data?.agent_payout_list?.data
              : [...agentPayoutList, ...res?.data?.agent_payout_list?.data],
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  const renderPayoutBox = (numberTxt = 0, descTitle = '') => {
    return (
      <View style={styles.payoutBlockSubView}>
        <Text style={styles.payoutNumbersTxt}>
          {' '}
          {userData?.client_preference?.currency?.symbol}
          {numberTxt}
        </Text>
        <Text style={styles.payoutTitlesTxt}>{descTitle}</Text>
      </View>
    );
  };

  const isValidData = () => {
    const error = validator({
      payoutAmount: payoutAmount,
      selectedPayoutOption: selectedPayoutOption,
    });
    if (error) {
      alert(error);
      return;
    }
    return true;
  };

  const isValidBankData = () => {
    const error = validator({
      beneficiaryName: beneficiaryName,
      beneficiaryAcNum: beneficiaryAcNum,
      beneficiaryISFC: beneficiaryISFC,
      beneficiaryBankName: beneficiaryBankName,
    });
    if (error) {
      alert(error);
      return;
    }
    return true;
  };
  const isRazorpayFund = () => {
    const error = validations({
      name: name,
      beneficiaryISFC: ifsc,
      accountNumber: accountNumber,
      confirmAccountNumber: reenterAccountNumber,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const _onContinuePayout = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    if (selectedPayoutOption?.id == 2 && !selectedPayoutOption?.is_connected) {
      alert(strings.STRIPENOTCONNECTED);
      return;
    }
    const data = {};
    if (selectedPayoutOption.id == 4) {
      const checkValid = isValidBankData();
      if (!checkValid) {
        return;
      }
      data['amount'] = payoutAmount;
      data['beneficiary_name'] = beneficiaryName;
      data['beneficiary_account_number'] = beneficiaryAcNum;
      data['beneficiary_ifsc'] = beneficiaryISFC;
      data['beneficiary_bank_name'] = beneficiaryBankName;
      data['payout_option_id'] = selectedPayoutOption?.id;
    } else {
      data['amount'] = payoutAmount;
      data['payout_option_id'] = selectedPayoutOption?.id;
    }
    console.log(data, 'selectedPayoutOption>>>DATA');
    console.log(selectedPayoutOption, 'selectedPayoutOption');
    updateState({isRefreshing: true});

    actions
      .agentPayoutCreate(`/${userData?.id}`, data, {
        client: clientInfo?.database_name,
      })
      .then(res => {
        console.log(res, 'responseFromServer');
        updateState({isPayoutModal: false, isRefreshing: false});
        getBankDetails();
        getPayoutDetails();
        showSuccess(res?.message, 2000);
      })
      .catch(err => {
        console.log(err, 'err>>>');
      });
  };

  const errorMethod = error => {
    updateState({isLoading: false, isRefreshing: false, isPayoutModal: false});
    setTimeout(() => {
      showError(error?.message || error?.error || error?.description, 2000);
    }, 500);
  };

  const renderPayoutDetails = ({item, index}) => {
    return (
      <View style={styles.mainViewPayoutDetail}>
        <View style={{flex: 0.2}}>
          <View
            style={[
              styles.circleView,
              {
                backgroundColor:
                  item?.status_id == '0'
                    ? colors.blueB
                    : item?.status_id == '1'
                    ? colors.green
                    : colors.redB,
              },
            ]}>
            <Text style={styles.messageInitial}>
              {item?.status_id == '0'
                ? 'P'
                : item?.status_id == '1'
                ? 'C'
                : 'F'}
            </Text>
          </View>
        </View>

        <View style={{flex: 0.6, justifyContent: 'center'}}>
          <Text style={styles.message}>
            {strings.PAYOUT_REQUEST}{' '}
            {item?.status_id == '0'
              ? strings.PENDING
              : item?.status_id == '1'
              ? strings.CREATED
              : strings.FAILD}
          </Text>
          <Text numberOfLines={1} style={styles.dateTime}>
            {moment(item?.created_at).format('lll')}
          </Text>
        </View>

        <View
          style={{
            flex: 0.2,
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.amount,
              {
                color: colors.black,
              },
            ]}>
            {userData?.client_preference?.currency?.symbol}{' '}
            {currencyNumberFormatter(Number(item?.amount).toFixed(2))}
          </Text>
          <View
            style={{
              ...styles.statusView,
              backgroundColor:
                item?.status_id == '0'
                  ? colors.blueB
                  : item?.status_id == '1'
                  ? colors.green
                  : colors.redB,
            }}>
            <Text
              style={[
                styles.amount,
                {
                  color: colors.white,
                },
              ]}>
              {item?.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  const getBankForm = () => {
    return (
      <View>
        <TextInputWithlabel
          label={strings.BENEFICIARY_NAME}
          value={beneficiaryName}
          mainStyle={{
            marginTop: moderateScale(10),
          }}
          onChangeText={text => updateState({beneficiaryName: text})}
          editable
        />

        <TextInputWithlabel
          label={strings.BENEFICIARY_AC_NUMBER}
          value={beneficiaryAcNum}
          mainStyle={{
            marginTop: moderateScale(5),
          }}
          keyboardType="number-pad"
          onChangeText={text => updateState({beneficiaryAcNum: text})}
          editable
        />

        <TextInputWithlabel
          label={strings.BENEFICIARY_IFSC}
          value={beneficiaryISFC}
          mainStyle={{
            marginTop: moderateScale(5),
          }}
          onChangeText={text => updateState({beneficiaryISFC: text})}
          editable
        />
        <TextInputWithlabel
          label={strings.BENEFICIARY_BANK_NAME}
          value={beneficiaryBankName}
          mainStyle={{
            marginTop: moderateScale(5),
          }}
          onChangeText={text => updateState({beneficiaryBankName: text})}
          editable
        />
      </View>
    );
  };

  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  const _connectStipe = () => {
    moveToNewScreen(navigationStrings.WEBCONNECTIONS, stripeExistOrNot)();
  };

  // ---------------------RajorPay-----------------------

  const _createContact = useCallback(() => {
    if (createContactData || payoutDetails?.agent?.razorpay_contact_json) {
      alert(strings?.ALLREADYCONNECTED);
    } else {
      const data = {};
      data['aid'] = userData?.id;
      updateState({isLoadingA: true});
      actions
        ?.createContact(data, {
          client: clientInfo?.database_name,
        })
        .then(res => {
          console.log(res, 'resresresresres');
          updateState({
            createContactData: res?.data,

            isLoadingA: false,
          });
          showSuccess(strings?.ACCOUNTCREATEDSUCESS);
        })
        .catch(errorMethod);
    }
  });
  const _connectRajorPayBottomSheet = inx => {
    if (inx == 0) {
      updateState({
        razorPayConnect: false,
        connectWithBank: false,
      });
      return;
    }
    return;
  };

  const _handleComponent = () => {
    return (
      <View>
        <Header
          leftIcon={imagePath.backArrow}
          centerTitle={
            !connectWithBank
              ? strings.RAZORPAYCONNECTBANKDETAILS
              : strings?.RAZORPAYFUNDDETAIL
          }
          headerStyle={styles?.handleHeaderStyle}
          leftIconStyle={{tintColor: colors.themeColor}}
          onPressLeft={() => {
            connectWithBank
              ? updateState({connectWithBank: false})
              : updateState({razorPayConnect: false});
          }}
        />
      </View>
    );
  };
  const _razorPayConnectSubmit = useCallback(() => {
    const checkValid = isRazorpayFund();
    if (!checkValid) {
      return;
    }
    const data = {};
    data['name'] = name;
    data['aid'] = userData?.id;
    data['ifsc'] = ifsc;
    data['acc_no'] = accountNumber;
    data['re_acc_no'] = reenterAccountNumber;
    updateState({isLoadingB: true});
    actions
      ?.createRazorpayFund(data, {
        client: clientInfo?.database_name,
      })
      .then(res => {
        console.log(res, 'res>>>>>>>>>>');
        if (res?.status == '200') {
          updateState({
            razorPayConnect: false,
            connectWithBank: false,
            name: '',
            ifsc: '',
            accountNumber: '',
            reenterAccountNumber: '',
            isLoadingB: false,
            razorPayConnectedOrNot: true,
          });
          showSuccess(res?.message);
        }
      })
      .catch(errorMethod);
  });
  return (
    <WrapperContainer
      bgColor={colors.white}
      statusBarColor={colors.white}
      isLoading={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={imagePath.backArrow}
        centerTitle={strings.PAYOUT}
        headerStyle={{
          backgroundColor: colors.white,
          paddingHorizontal: moderateScale(10),
        }}
        leftIconStyle={{tintColor: colors.themeColor}}
        onPressLeft={() => {
          updateState({pageNo: 1});
          navigation.goBack();
        }}
      />
      <View
        style={{
          height: 1,
          backgroundColor: colors.lightGreyBgColor,
          opacity: 0.26,
        }}
      />
      <View style={styles.payoutBlockView}>
        {renderPayoutBox(payoutDetails?.past_payout_value, strings.PAST_PAYOUT)}
        {renderPayoutBox(
          payoutDetails?.available_funds,
          strings.AVAILABLE_FUNDS,
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: moderateScale(10),
        }}>
        {!!(stripeExistOrNot && !stripeExistOrNot?.is_connected) && (
          <View style={styles.mainViewStripe}>
            <TouchableOpacity
              onPress={_connectStipe}
              style={styles.stripeuttonLayout}>
              <Text style={styles.stipeText}>{strings.CONNECTSTRIPE}</Text>
            </TouchableOpacity>
            {/* payoutDetails.payout_options */}
          </View>
        )}
        {console.log(razorPayExistOrNot)}
        {isEmpty(razorPayExistOrNot) ? null : (
          <View style={styles.mainViewStripe}>
            <TouchableOpacity
              onPress={() => updateState({razorPayConnect: true})}
              style={styles.stripeuttonLayout}>
              <Text style={styles.stipeText} numberOfLines={1}>
                {payoutDetails?.agent?.razorpay_contact_json &&
                payoutDetails?.agent?.razorpay_bank_json
                  ? strings.RAZORPAYCONNECTED
                  : strings.CONNECTRAZORPAY}
              </Text>
            </TouchableOpacity>
            {/* payoutDetails.payout_options */}
          </View>
        )}
      </View>

      <View style={{flex: 1, marginHorizontal: moderateScale(15)}}>
        <View
          style={{
            marginVertical: moderateScale(10),
          }}>
          <Text style={styles.transactionHistory}>
            {strings.TRANSACTIONHISTORY}
          </Text>
        </View>
        <FlatList
          data={agentPayoutList}
          extraData={agentPayoutList}
          keyExtractor={(item, index) => String(index)}
          showsVerticalScrollIndicator={false}
          renderItem={renderPayoutDetails}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.themeColor}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => (
            <View
              style={{
                height: moderateScaleVertical(65),
              }}
            />
          )}
        />
      </View>

      <View style={styles.bottomButtonStyle}>
        <GradientButton
          containerStyle={{marginTop: moderateScaleVertical(40)}}
          onPress={() => updateState({isPayoutModal: true})}
          textStyle={{color: colors.black}}
          btnText={strings.PAYOUT}
          colorsArray={[colors.themeColor, colors.themeColor]}
        />
      </View>

      <Modal
        isVisible={isPayoutModal}
        status
        style={{
          margin: 0,
          justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-end',
        }}
        onBackdropPress={() => updateState({isPayoutModal: false})}>
        <View
          style={{
            backgroundColor: colors.white,
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(10),
            borderRadius: moderateScale(10),
            maxHeight: height - moderateScale(100),
            paddingBottom:
              Platform.OS === 'ios'
                ? moderateScaleVertical(40)
                : moderateScaleVertical(10),
          }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            extraScrollHeight="0"
            // extraScrollHeight={ Platform.OS == 'ios' ? '0' : '48'}
          >
            <Text
              style={{
                fontFamily: fontFamily.bold,
                fontSize: textScale(18),
              }}>
              {strings.PAYOUT}
            </Text>
            <TextInputWithlabel
              label={strings.AMOUNT}
              value={payoutAmount}
              mainStyle={{
                marginTop: moderateScale(10),
              }}
              keyboardType="number-pad"
              onChangeText={text => updateState({payoutAmount: text})}
              editable
            />

            {!isLoading && !!payoutDetails?.available_funds ? (
              <TextInputWithlabel
                label={strings.AVAILABLE_FUNDS}
                placeholder={Number(payoutDetails?.available_funds).toFixed(2)}
                mainStyle={{
                  marginTop: moderateScale(5),
                }}
              />
            ) : (
              <></>
            )}
            {!isLoading &&
              !!payoutDetails.payout_options &&
              payoutDetails.payout_options.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => updateState({selectedPayoutOption: item})}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: moderateScale(15),
                    }}>
                    <Image
                      source={imagePath.icRadio}
                      style={{
                        tintColor:
                          selectedPayoutOption.id == item.id
                            ? colors.blueB
                            : colors.blackB,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: textScale(13),
                        marginLeft: moderateScale(10),
                      }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}

            {selectedPayoutOption.id == 4 ? getBankForm() : <></>}

            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginTop: moderateScale(35),
              }}>
              <GradientButton
                containerStyle={{width: '45%'}}
                onPress={() => updateState({isPayoutModal: false})}
                textStyle={{color: colors.black}}
                btnText={strings.CANCEL}
                colorsArray={[colors.themeColor, colors.themeColor]}
              />
              <GradientButton
                containerStyle={{width: '45%'}}
                onPress={_onContinuePayout}
                textStyle={{color: colors.black}}
                btnText={strings.CONTINUE}
                colorsArray={[colors.themeColor, colors.themeColor]}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

      {razorPayConnect ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          // key={isOpen}
          snapPoints={['0%', connectWithBank ? '100%' : '30%']}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          onChange={_connectRajorPayBottomSheet}
          handleComponent={_handleComponent}>
          <BottomSheetScrollView
            style={{
              paddingHorizontal: moderateScale(20),
              backgroundColor: colors?.whiteSmokeColor,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {!connectWithBank ? (
              <View>
                <GradientButton
                  containerStyle={{marginTop: moderateScaleVertical(30)}}
                  textStyle={{color: colors.black}}
                  btnText={
                    createContactData ||
                    payoutDetails?.agent?.razorpay_contact_json
                      ? strings.CONTACTCREATED
                      : strings.CREATECONTACT
                  }
                  onPress={_createContact}
                  indicator={isLoadingA}
                  colorsArray={[colors.themeColor, colors.themeColor]}
                />
                <GradientButton
                  containerStyle={{marginTop: moderateScaleVertical(30)}}
                  textStyle={{color: colors.black}}
                  onPress={() =>
                    createContactData ||
                    payoutDetails?.agent?.razorpay_contact_json
                      ? updateState({connectWithBank: true})
                      : alert(strings?.PLEASECREATECONTACT)
                  }
                  btnText={
                    payoutDetails?.agent?.razorpay_bank_json
                      ? strings.BANKCONNECTED
                      : strings.CONNECTWITHBANK
                  }
                  colorsArray={[colors.themeColor, colors.themeColor]}
                />
              </View>
            ) : null}
            {connectWithBank ? (
              <View style={{height: height}}>
                <TextInputWithlabel
                  editable={true}
                  label={strings?.NAME}
                  labelStyle={{color: colors.black}}
                  onChangeText={text => updateState({name: text})}
                />
                <TextInputWithlabel
                  editable={true}
                  label={strings?.IFSC}
                  labelStyle={{color: colors.black}}
                  onChangeText={text => updateState({ifsc: text})}
                />
                <TextInputWithlabel
                  editable={true}
                  label={strings?.ACCOUNTNUMBER}
                  labelStyle={{color: colors.black}}
                  value={accountNumber}
                  onChangeText={text =>
                    updateState({
                      accountNumber: text.replace(/[^0-9]/g, ''),
                    })
                  }
                  keyboardType={'number-pad'}
                />
                <TextInputWithlabel
                  editable={true}
                  label={strings?.REENTERACCOUNTNUMBER}
                  labelStyle={{color: colors.black}}
                  value={reenterAccountNumber}
                  onChangeText={text =>
                    updateState({
                      reenterAccountNumber: text.replace(/[^0-9]/g, ''),
                    })
                  }
                  keyboardType={'number-pad'}
                />

                <GradientButton
                  containerStyle={{marginTop: moderateScaleVertical(30)}}
                  textStyle={{color: colors.black}}
                  onPress={_razorPayConnectSubmit}
                  indicator={isLoadingB}
                  btnText={strings.SUBMIT}
                  colorsArray={[colors.themeColor, colors.themeColor]}
                />
              </View>
            ) : null}
          </BottomSheetScrollView>
        </BottomSheet>
      ) : null}
    </WrapperContainer>
  );
}
