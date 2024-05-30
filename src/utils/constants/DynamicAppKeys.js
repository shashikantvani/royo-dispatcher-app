import {Platform} from 'react-native';
import {getBundleId} from 'react-native-device-info';

const shortCodes = {

  fawaz: 'b3e0fe',
 
};

const appIds = {

  fawaz: Platform.select({
    ios: 'com.FawazDriverApp',
    android: 'com.Fawaz.royodispatcher',
  }),
 
};

export {appIds, shortCodes};
