import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import BluetoothClassic from 'react-native-bluetooth-classic';
import {useSelector} from 'react-redux';
import DashHeader from './components/DashHeader';
import axiosInstance from './AxiosConfig';

const Home = ({navigation}) => {
  const loginData = useSelector(state => state.login.user);
  const [threshold, setThreshold] = useState(0); // Threshold value
  const [currentThreshold, setCurrentThreshold] = useState(0); // Threshold value
  const [noiseLevel, setNoiseLevel] = useState(0); // Current noise level from Arduino
  const [deviceState, setDeviceState] = useState(false); // Buzzer/LED on or off
  const [connectedDevice, setConnectedDevice] = useState(null); // Bluetooth device object
  const [noiseLevels, setNoiseLevels] = useState([]);
  const [errortext, setErrortext] = useState('');
  const [msgtext, setMsgtext] = useState('');
  // const [lastEmailSent, setLastEmailSent] = useState(null);
  console.log(loginData);
  const lastEmailSentRef = useRef(null);

  // useEffect(() => {
  //   const initializeConnection = async () => {
  //     await new Promise(resolve => setTimeout(resolve, 1000)); // Adding a delay
  //     await checkConnectedDevice();
  //   };

  //   initializeConnection();

  //   const interval = setInterval(() => {
  //     if (connectedDevice) {
  //       readNoiseLevel(); // Automatically read noise level ev
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval); // Clean up interval on component unmount
  // }, []);
  // Ensure that the device is already connected

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adding a delay
        await checkConnectedDevice();

        if (connectedDevice) {
          console.log('Device is connected. Starting to read noise levels...');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeConnection();

    const interval = setInterval(() => {
      if (connectedDevice) {
        readNoiseLevel(); // Automatically read noise level every second
      }
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [connectedDevice]); // Ensure `connectedDevice` is a dependency

  const checkConnectedDevice = async () => {
    try {
      const connectedDevices = await BluetoothClassic.getConnectedDevices();
      if (connectedDevices.length > 0) {
        setConnectedDevice(connectedDevices[0]);
      } else {
        Alert.alert('No Bluetooth devices connected.');
      }
    } catch (error) {
      console.error('Error checking connected devices:', error);
    }
  };
  // Send threshold value to the Arduino
  const sendThreshold = async () => {
    setCurrentThreshold(threshold);
    if (connectedDevice) {
      try {
        await connectedDevice.write(`T${threshold}\n`);
        console.log('Threshold sent to device:', threshold);
      } catch (error) {
        console.error('Error sending threshold:', error);
      }
    } else {
      Alert.alert('No device connected hold1');
    }
  };
  // Turn on the device (Buzzer/LED)
  const turnOnDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.write('1\n');
        setDeviceState(true);
        console.log('Device turned ON');
      } catch (error) {
        console.error('Error turning on device:', error);
      }
    } else {
      Alert.alert('No device connected on2');
    }
  };
  // Turn off the device (Buzzer/LED)
  const turnOffDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.write('0\n');
        setDeviceState(false);
        console.log('Device turned OFF');
      } catch (error) {
        console.error('Error turning off device:', error);
      }
    } else {
      Alert.alert('No device connected offs3');
    }
  };
  // Read noise level data from the Arduino

  const readNoiseLevel = async () => {
    if (connectedDevice) {
      try {
        const data = await connectedDevice.read();
        console.log('Raw data received:', data); // Log the exact data received

        // Remove any unwanted characters or whitespace
        const cleanedData = data.replace(/[^0-9]/g, ''); // Retain only numbers

        if (cleanedData) {
          const parsedNoiseLevel = parseInt(cleanedData, 10); // Parse as an integer

          if (!isNaN(parsedNoiseLevel)) {
            setNoiseLevel(parsedNoiseLevel); // Set noise level state if valid
            updateNoiseLevels(parsedNoiseLevel); // Set array of noise level state if valid
            console.log('Parsed Noise Level:', parsedNoiseLevel);
          } else {
            console.warn(
              'Parsed noise level is NaN after cleaning:',
              cleanedData,
            );
          }
        }
        // else {
        //   console.warn('No numeric data found in received string:', data);
        // }
      } catch (error) {
        console.error('Error reading noise level:', error);
      }
    } else {
      Alert.alert('No device connected to read noise level.');
    }
  };
  const updateNoiseLevels = newLevel => {
    setNoiseLevels(prevLevels => {
      const updatedLevels = [newLevel, ...prevLevels].slice(0, 3);
      return updatedLevels;
    });
  };

  // // const sendEmailNotification = async () => {
  // //   const now = new Date();
  // //   const fiveMinutes = 5 * 60 * 1000;

  // //   if (!lastEmailSent || now - lastEmailSent >= fiveMinutes) {
  // //     try {
  // //       const formData = {
  // //         email: loginData?.email,
  // //         noiseValue: noiseLevel,
  // //         threshhold: currentThreshold,
  // //       };

  // //       // const response = await axios.post(
  // //       //   'http://192.168.46.68:5000/api/notification/user/sendmail',
  // //       //   formData,
  // //       //   {timeout: 10000},
  // //       // );
  // //       const response = await axiosInstance.post(
  // //         '/notification/user/sendmail',
  // //         formData,
  // //       );
  // //       if (response.status === 200) {
  // //         Alert.alert(
  // //           'Success',
  // //           response.data.message || 'Email sent successfully!',
  // //         );
  // //         setLastEmailSent(new Date()); // Update last email sent timestamp
  // //       } else {
  // //         console.error('Error sending email:', response.data);
  // //       }
  // //     } catch (error) {
  // //       console.error('Failed to send email:', error);
  // //     }
  // //   } else {
  // //     console.log('Email not sent. Waiting for the 5-minute interval.');
  // //   }
  // // };

  // // useEffect(() => {
  // //   const interval = setInterval(() => {
  // //     if (noiseLevel < currentThreshold) {
  // //       sendEmailNotification();
  // //     }
  // //   }, 1000); // Check every second

  // //   return () => clearInterval(interval); // Clean up interval on component unmount
  // // }, [noiseLevel, currentThreshold, lastEmailSent]);

  // // Function to send email notifications
  // const sendEmailNotification = async () => {
  //   const now = new Date();
  //   const fiveMinutes = 5 * 60 * 1000;

  //   if (
  //     !lastEmailSentRef.current ||
  //     now - lastEmailSentRef.current >= fiveMinutes
  //   ) {
  //     try {
  //       const formData = {
  //         email: loginData?.email,
  //         noiseValue: noiseLevel,
  //         threshhold: currentThreshold,
  //       };

  //       const response = await axiosInstance.post(
  //         '/notification/user/sendmail',
  //         formData,
  //       );

  //       if (response.status === 200) {
  //         Alert.alert(
  //           'Success',
  //           response.data.message || 'Email sent successfully!',
  //         );
  //         lastEmailSentRef.current = now; // Update the last email sent time
  //       } else {
  //         console.error('Error sending email:', response.data);
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         console.error(
  //           'Response Error:',
  //           error.response.status,
  //           error.response.data,
  //         );
  //       } else if (error.request) {
  //         console.error('Request Error:', error.request);
  //       } else {
  //         console.error('Unexpected Error:', error.message);
  //       }
  //     }
  //   } else {
  //     console.log('Email not sent. Waiting for the 5-minute interval.');
  //   }
  // };

  // Effect to monitor noise levels and trigger email notifications

  const sendEmailNotification = async () => {
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (
      !lastEmailSentRef.current ||
      now - lastEmailSentRef.current >= fiveMinutes
    ) {
      try {
        const formData = {
          email: loginData?.user.email,
          noiseValue: noiseLevel,
          threshhold: currentThreshold,
        };

        const response = await axiosInstance.post(
          '/notification/user/sendmail',
          formData,
        );

        if (response.status === 200) {
          Alert.alert('Success', 'Email sent successfully!');
          lastEmailSentRef.current = now; // Update the last email sent time
        } else {
          Alert.alert('Error', 'Failed to send email. Please try again.');
        }
      } catch (error) {
        if (error.response) {
          const {status, data} = error.response;

          switch (status) {
            case 400:
              setErrortext(
                data.Error || 'Incorrect data. Please check the inputs.',
              );
              break;
            case 404:
              setErrortext(
                data.Error || 'Email not found. Please register first.',
              );
              break;
            case 500:
              setErrortext(
                data.Error || 'Server error. Please try again later.',
              );
              break;
            default:
              setErrortext(
                data.Error || 'Something went wrong. Please try again.',
              );
          }
        } else if (error.request) {
          setErrortext('No response from server. Please check your network.');
        } else {
          setErrortext('An unexpected error occurred. Please try again.');
        }
      }
      setTimeout(() => {
        setErrortext('');
      }, 5000);
    }
    // else {
    //   setMsgtext(`Email not send !!
    //      Waiting for the 5-minute interval.`);
    //   // Alert.alert('Email not send  Waiting for the 5-minute interval.');
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (noiseLevel < currentThreshold) {
        sendEmailNotification();
      }
    }, 1000); // Check every second

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [noiseLevel, currentThreshold]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <DashHeader /> */}
        <DashHeader navigation={navigation} />

        {/* <Text style={styles.title}>Control Pannel</Text> */}
        {/* {msgtext ? <Text style={{color: '#222831'}}>{msgtext}</Text> : null} */}
        <View>
          <Text style={styles.textColor}>
            Current Threshold: {currentThreshold}
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Set Threshold"
            value={isNaN(threshold) ? '' : threshold.toString()}
            onChangeText={value => {
              const parsedValue = parseInt(value, 10);
              if (!isNaN(parsedValue)) {
                setThreshold(parsedValue);
              } else {
                setThreshold('');
              }
            }}
          />
        </View>

        <View>
          <TouchableOpacity onPress={sendThreshold} style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Send Threshold</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deviceState ? turnOffDevice : turnOnDevice}
            style={styles.buttonStyle}>
            <Text style={styles.buttonText}>
              {deviceState ? 'Turn Off Device' : 'Turn On Device'}
            </Text>
          </TouchableOpacity>
        </View>

        {errortext ? <Text style={{color: 'red'}}>{errortext}</Text> : null}
        {/* <View style={styles.container}> */}

        <View>
          <Text style={styles.textColor}>Noise Level: {noiseLevel}</Text>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.firstColumn]}>Sr. No.</Text>
            <Text style={[styles.headerCell, styles.secondColumn]}>
              Noise Level (Latest on Top)
            </Text>
          </View>
          {/* Noise Data Rows */}
          {noiseLevels.map((level, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, styles.firstColumn]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.secondColumn]}>{level}</Text>
            </View>
          ))}
          {/* Fill empty rows if less than 3 values are available */}
          {Array(3 - noiseLevels.length)
            .fill('')
            .map((_, index) => (
              <View key={`empty-${index}`} style={styles.row}>
                <Text style={styles.cell}>-</Text>
              </View>
            ))}
        </View>
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    // overflow: 'visible',
    backgroundColor: '#EEEEEE',
  },
  container: {
    margin: 10,
    flex: 1,
    flexDirection: 'column',
    gap: 40,
    marginBottom: 170,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#222831',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#222831',
  },
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
  textColor: {
    color: '#222831',

    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',

    backgroundColor: '#7de24e',
    padding: 10,
    marginTop: 10,
  },
  firstColumn: {
    flex: 2, // 20% width
  },
  secondColumn: {
    flex: 8, // 80% width
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#EEE1ff',
    padding: 10,
    gap: 2,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#222831',
  },
});

export default Home;
