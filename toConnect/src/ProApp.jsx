import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcome from './Welcome';
import TurnOnOff from './blutooth/TurnOnOff';
import SearchBt from './blutooth/SearchBt';
import Home from './Home';
import Login from './login/Login';
import SignUp from './login/SignUp';
import ForgotPassword from './forgot/ForgotPassword';
import VerifyEmail from './forgot/VerifyEmail';
import NewPassword from './forgot/NewPassword';
import Profile from './components/Profile';
import ChangePassword from './components/ChnagePassword';
import History from './components/History';
import DashHeader from './components/DashHeader';

const Stack = createNativeStackNavigator();

const ProApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          gestureEnabled: true,
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{title: 'Connect Pro'}}
        />
        <Stack.Screen name="TurnOnOff" component={TurnOnOff} />
        <Stack.Screen name="SearchBt" component={SearchBt} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="NewPassword" component={NewPassword} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="DashHeader" component={DashHeader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProApp;
