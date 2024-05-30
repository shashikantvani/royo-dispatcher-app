import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
// import { AppearanceProvider } from 'react-native-appearance';
import {Appearance} from 'react-native';
import {useSelector} from 'react-redux';
import ShortCode from '../Screens/ShortCode/ShortCode';
import {navigationRef} from './NavigationService';
import navigationStrings from './navigationStrings';
import AuthStack from './AuthStack';
import DrawerRoutes from './DrawerStack';
import ProfileStack from './ProfileStack';

const Stack = createNativeStackNavigator();

export function shortCode(Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.SHORT_CODE}
        component={ShortCode}
        options={{headerShown: false}}
      />
    </>
  );
}

export function drawer(Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.DRAWER_ROUTES}
        component={DrawerRoutes}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </>
  );
}

export default function Routes() {
  const userData = useSelector(state => state?.auth?.userData);

  console.log('routes userData', userData);
  const {shortCodeStatus, appStyle} = useSelector(state => state?.initBoot);
  const colorScheme = Appearance.getColorScheme();

  return (
    <>
      {console.log(userData?.access_token,'userData?.access_token')}
     {/* <AppearanceProvider> */}
    <NavigationContainer
      // theme={scheme == 'dark' ? DarkTheme : DefaultTheme}
      ref={navigationRef}>
      <Stack.Navigator>
        {userData && userData?.access_token ? (
          <Stack.Screen
            name={navigationStrings.DRAWER_ROUTES}
            component={DrawerRoutes}
            options={{headerShown: false, gestureEnabled: false}}
          />
        ) : (
          AuthStack(Stack)
        )}
      </Stack.Navigator>
    </NavigationContainer>
     {/* </AppearanceProvider> */}
    </>
  );
}
