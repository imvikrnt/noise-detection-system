import React, {useEffect, useState} from 'react';
// import {PermissionsAndroid, Platform} from 'react-native';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

const TurnOnOff = ({navigation}) => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  requestBluetoothPermission();

  // Function to check if Bluetooth is already enabled on component mount
  const checkBluetoothEnabled = async () => {
    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      setIsBluetoothEnabled(enabled);
      if (enabled) {
        navigation.navigate('SearchBt');
      }
    } catch (error) {
      Alert.alert('Error checking Bluetooth status', error.message);
    }
  };

  // Enable Bluetooth and navigate to next screen
  const enableBluetoothAndNavigate = async () => {
    try {
      await requestBluetoothPermission();
      const enabled = await RNBluetoothClassic.requestBluetoothEnabled();
      if (enabled) {
        setIsBluetoothEnabled(true);
        navigation.navigate('SearchBt');
      } else {
        Alert.alert('Bluetooth failed to enable!');
      }
    } catch (error) {
      Alert.alert('Error enabling Bluetooth', error.message);
    }
  };

  useEffect(() => {
    checkBluetoothEnabled();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../assets/image/ble.png')}
          style={styles.logo}
        />
        <Text style={styles.text1}>Connect</Text>
        <Text style={styles.text}>to any Bluetooth device nearby you</Text>
        {isBluetoothEnabled ? (
          <Text style={[styles.buttonText, styles.button]}>
            Bluetooth is already on
          </Text>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={enableBluetoothAndNavigate}>
            <Text style={styles.buttonText}>Turn On Bluetooth</Text>
          </TouchableOpacity>
        )}
        {/* {!isBluetoothEnabled && ( 
          <TouchableOpacity
            style={styles.button}
            onPress={enableBluetoothAndNavigate}
          >
            <Text style={styles.buttonText}>Turn On Bluetooth</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </SafeAreaView>
  );
};

export default TurnOnOff;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  text1: {
    marginTop: 30,
    fontSize: 24,
    color: '#222831',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    color: '#222831',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#EEEEEE',
    borderColor: '#222831',
    height: 40,
    width: 300,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 70,
    marginBottom: 25,
  },
  buttonText: {
    color: '#EEEEEE',
    paddingVertical: 10,
    fontSize: 16,
    margin: 'auto',
    padding: 50,
  },
});
