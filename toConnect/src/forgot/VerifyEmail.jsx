import React, {useState, createRef} from 'react';

import axiosInstance from '../AxiosConfig';
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

const VerifyEmail = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const [errortext, setErrortext] = useState('');

  const {data} = route.params;

  const handleSubmitPress = async () => {
    setErrortext('');
    if (!otp) {
      Alert('Please fill Email');
      return;
    }

    const formData = {
      email: data.email,
      otp: otp,
    };
    console.log(formData);
    try {
      // Replace with your actual computer's IP address and backend port
      // const response = await axios.post(
      //   'http://192.168.46.68:5000/api/forgot/user/verifyemail', // Change the IP address if necessary
      //   formData,
      //   {timeout: 10000}, // Timeout set to 10 seconds
      // );
      const response = await axiosInstance.post(
        '/forgot/user/verifyemail',
        formData,
      );
      // Handle successful response
      if (response.status === 200) {
        Alert.alert(
          'Success',
          response.data.message || 'OTP Verify successfully!',
        );
        navigation.navigate('NewPassword', {data});
      } else {
        setErrortext(
          response.data.message || 'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
      if (error.response) {
        const {status, data} = error.response;

        switch (status) {
          case 400: // Incorrect OTP
            setErrortext(
              data.error ||
                'The OTP you entered is incorrect. Please try again.',
            );
            break;
          case 404: // Email not found
            setErrortext(
              data.error ||
                'No user with this email exists. Please check your email.',
            );
            break;
          case 500: // Server error
            setErrortext(
              data.error ||
                'Something went wrong on the server. Please try again later.',
            );
            break;
          default:
            setErrortext(
              data.error || 'An unexpected error occurred. Please try again.',
            );
        }
      } else if (error.request) {
        setErrortext(
          'No response from the server. Please check your network connection.',
        );
      } else {
        setErrortext('An unexpected error occurred. Please try again.');
      }
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainBody}>
        {/* <Loader loading={loading} /> */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <View>
            <KeyboardAvoidingView enabled>
              <Image
                source={require('../assets/image/otp.png')}
                style={styles.logo}
              />
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="O T P"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>Verify OTP</Text>
              </TouchableOpacity>

              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate('Login')}>
                {/* onPress={() => navigation.navigate('NewPassword')}> */}
                Back to Login
              </Text>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    alignContent: 'center',
  },
  logo: {
    height: 330,
    width: 330,
    marginBottom: 20,
    margin: 'auto',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#EEEEEE',
    borderColor: '#222831',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#EEEEEE',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputStyle: {
    flex: 1,
    color: '#222831',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  forgotTextStyle: {
    color: '#222831',
    textAlign: 'center',
    fontSize: 15,
    alignSelf: 'center',
    paddingBottom: 15,
  },
  registerTextStyle: {
    color: '#222831',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
