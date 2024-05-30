import {StyleSheet, I18nManager} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({defaultLanguagae}) => {
  const styles = StyleSheet.create({
    cashCollected: {
      fontSize: textScale(12),
      fontFamily: fontFamily.semiBold,
      color: colors.black,
    },
    cashCollected: {
      fontSize: textScale(12),
      fontFamily: fontFamily.semiBold,
      color: colors.black,
    },
    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(14),
      lineHeight: textScale(28),
      textAlign: 'center',
      fontFamily: fontFamily.semiBold,
    },
    reason: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.black,
      marginHorizontal: moderateScale(20),
    },
    attachment: {
      fontSize: textScale(12),
      fontFamily: fontFamily.bold,
      color: colors.lightGreyBg2,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(10),
      textAlign: defaultLanguagae?.value === 'ar' ? 'right' : 'left',
    },
    rowViewTaskCancel: {
      marginHorizontal: moderateScale(20),
      borderBottomColor: colors.iconGrey,
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingVertical: moderateScale(15),
      flexDirection: defaultLanguagae?.value === 'ar' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
    },
    textInputStyle: {
      opacity: 0.7,
      color: colors.black,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(14),
      paddingHorizontal: 8,
      paddingVertical: 0,
      textAlign: defaultLanguagae?.value === 'ar' ? 'right' : 'left',
      marginHorizontal: moderateScale(20),

      backgroundColor: colors.backGround,
      height: moderateScaleVertical(width / 10),
      borderRadius: moderateScale(4),
      marginVertical: moderateScale(10),
      borderBottomColor: colors.themeColor,
      borderBottomWidth: 1,
    },
    titleStyle: {
      fontSize: textScale(10),
      fontFamily: fontFamily.medium,
      color: colors.black,
      textAlign: 'center',
      marginTop: moderateScale(5),
    },
    headerCustomleftView: {
      flexDirection: defaultLanguagae?.value === 'ar' ? 'row-reverse' : 'row',
      alignItems: 'center',
    },
    arrowstyle: {
      transform: [{scaleX: defaultLanguagae?.value == 'ar' ? -1 : 1}],
    },
    otpContainer: {
      marginHorizontal: moderateScale(10),
      marginTop: moderateScale(10),
      alignItems: defaultLanguagae?.value === 'ar' ? 'flex-end' : 'flex-start',
    },
    documentContainer: {
      marginHorizontal: moderateScale(10),
      marginTop: moderateScale(10),
    },

    documentListContainer: {
      flexDirection: defaultLanguagae?.value === 'ar' ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      // justifyContent: 'center',
      marginHorizontal: moderateScale(10),
    },
    documentContainerView: {
      marginRight: moderateScale(10),
      marginBottom: moderateScale(5),
    },
    distanceTimeTitleTextStyle: {
      fontSize: textScale(14),
      fontFamily: fontFamily.bold,
    },
    distanceTimeTextStyle: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      marginVertical: moderateScaleVertical(5),
    },
    modealBottomContainer: {
      height: 0.5,
      backgroundColor: colors.textGreyLight,
      marginTop: moderateScaleVertical(10),
      flexDirection: 'row',
    },
    modalBottomButtonContainer: {
      // marginTop: moderateScaleVertical(16),
      // width: width / 2,
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: moderateScaleVertical(12),
    },
  });

  return styles;
};
