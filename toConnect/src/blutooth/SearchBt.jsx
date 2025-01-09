import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  StyleSheet,
} from 'react-native';
import BluetoothClassic from 'react-native-bluetooth-classic';

const SearchBt = ({navigation}) => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false); // To track if the scan has completed

  // Function to request permission to access location (required for Bluetooth scanning)
  const requestBluetoothPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth Permission',
          message: 'App needs access to Bluetooth for scanning nearby devices',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Function to check if Bluetooth is enabled
  const checkBluetoothEnabled = async () => {
    try {
      const isEnabled = await BluetoothClassic.isBluetoothEnabled();
      if (!isEnabled) {
        Alert.alert(
          'Bluetooth is not enabled',
          'Please enable Bluetooth to continue.',
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking Bluetooth status: ', error);
      return false;
    }
  };

  // Function to start scanning for Bluetooth devices
  const scanForDevices = async () => {
    const permissionGranted = await requestBluetoothPermission();
    const bluetoothEnabled = await checkBluetoothEnabled();

    if (!permissionGranted || !bluetoothEnabled) {
      return;
    }

    setIsScanning(true);
    setScanComplete(false); // Reset scan status before scanning

    try {
      const availableDevices = await BluetoothClassic.startDiscovery();
      setDevices(availableDevices);
    } catch (error) {
      // console.error('Error scanning devices: ', error);
      Alert.alert('Error', 'Failed to scan for devices.');
    } finally {
      setIsScanning(false);
      setScanComplete(true); // Mark scan as completed
    }
  };

  const connectDevice = async device => {
    try {
      // Check if the device is already connected
      const connectedDevices = await BluetoothClassic.getConnectedDevices();
      const isAlreadyConnected = connectedDevices.some(d => d.id === device.id);

      if (isAlreadyConnected) {
        Alert.alert(
          'Already Connected',
          `You are already connected to ${device.name || 'Unknown Device'}`,
        );
        navigation.navigate('Home', {
          deviceId: device.id,
          deviceName: device.name,
        });
        return;
      }

      // Set a timeout for the connection (30 seconds = 30000ms)
      const connectionTimeout = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 30000); // 30 seconds timeout
      });

      // Try connecting to the device
      const connectToDevice = BluetoothClassic.connectToDevice(device.id);

      // Wait for either connection or timeout
      const connection = await Promise.race([
        connectToDevice,
        connectionTimeout,
      ]);

      if (connection) {
        Alert.alert(
          'Connected',
          `Successfully connected to ${device.name || 'Unknown Device'}`,
        );

        // Set the connected device (optional step if you need to manage state)
        setConnectedDevice(device); // Assuming setConnectedDevice is a part of your component's state management

        // Navigate to the new component after successful connection
        navigation.navigate('Home', {
          deviceId: device.id,
          deviceName: device.name,
        });

        console.log(device);
      }
    } catch (error) {
      if (error.message === 'Connection timeout') {
        Alert.alert(
          'Timeout',
          'Connection attempt timed out. Please try again.',
        );
      } else {
        Alert.alert(
          'Connection failed',
          `Failed to connect to ${device.name || 'Unknown Device'}. Error: ${
            error.message
          }`,
        );
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clean up by disconnecting from the device if connected
      if (connectedDevice) {
        BluetoothClassic.disconnectFromDevice();
      }
    };
  }, [connectedDevice]);
  // useEffect(() => {
  //   console.log(Object.keys(BluetoothClassic));
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bluetooth Device Scanner</Text>

      {/* <Button
        title="Scan for Devices"
        onPress={scanForDevices}
        disabled={isScanning}
        style={styles.buttonstyle}
      /> */}
      <TouchableOpacity
        style={[styles.buttonStyle, isScanning && styles.disabledButton]}
        onPress={scanForDevices}
        disabled={isScanning}>
        <Text style={styles.buttonText}>Scan for Devices</Text>
      </TouchableOpacity>

      {isScanning && (
        <Text style={styles.devicesText}>Scanning for devices...</Text>
      )}

      {!isScanning && scanComplete && devices.length === 0 && (
        <Text style={styles.noDevicesText}>No devices found</Text> // Show message if no devices found
      )}

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => connectDevice(item)}
            style={styles.deviceItem}>
            <Text style={styles.devicesText}>
              {item.name && item.name !== item.id
                ? item.name
                : 'Unknown Device'}
            </Text>
            <Text style={styles.devicesText}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />

      {connectedDevice && (
        <View style={styles.connectedContainer}>
          <Text>Connected to: {connectedDevice.name}</Text>
        </View>
      )}
    </View>
  );
};

export default SearchBt;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  buttonStyle: {
    backgroundColor: '#7de24e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {fontSize: 24, marginBottom: 20, color: '#222831'},
  deviceItem: {padding: 10, borderBottomWidth: 1, color: '#222831'},
  connectedContainer: {marginTop: 20},
  devicesText: {color: '#222831'},
  noDevicesText: {marginTop: 20, fontSize: 14, color: 'red'}, // Styling for  "No devices found" message
});
