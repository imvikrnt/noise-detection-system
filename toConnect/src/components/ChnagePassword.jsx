import React, {useState} from 'react';

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
import {useSelector} from 'react-redux';

const ChangePassword = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errortext, setErrortext] = useState('');
  // const loginData = useSelector(state => state.login.loginData);
  const loginData = useSelector(state => state.login.user);
  // const handleChangePassword = () => {
  //   if (newPassword === confirmPassword) {
  //     Alert.alert('Password Changed Successfully');
  //     // You can add API call here to change the password
  //     navigation.goBack();
  //   } else {
  //     Alert.alert('Passwords do not match');
  //   }
  // };
  const handleChangePassword = async () => {
    setErrortext('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert('Please fill all Inputs');
      return;
    }

    const formData = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      email: loginData?.user.email,
      confirmPassword: confirmPassword,
    };

    try {
      // Replace with your actual computer's IP address and backend port
      // const response = await axios.post(
      //   'http://192.168.46.68:5000/api/forgot/user/changepassword', // Change the IP address if necessary
      //   formData,
      //   {timeout: 10000}, // Timeout set to 10 seconds
      // );
      const response = await axiosInstance.post(
        '/forgot/user/changepassword',
        formData,
      );
      // Handle successful response
      if (response.status === 200) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        Alert.alert(
          'Success',
          response.data.message || 'Password Change successfully!',
        );
        // navigation.navigate('Login');
      } else {
        setErrortext(
          response.data.message || 'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
      if (error.response) {
        const {status, data} = error.response;

        switch (status) {
          case 400:
            setErrortext(data.message || 'Current password is incorrect');
            break;
          case 401:
            setErrortext(data.message || 'New passwords do not match');
            break;
          case 404:
            setErrortext(data.error || 'User not found.');
            break;
          case 500:
            setErrortext(
              data.error ||
                'An error occurred on the server. Please try again later.',
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
                source={require('../assets/image/rb_3875.png')}
                style={styles.logo}
              />
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="current Password"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="New Password"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="confirm Password"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleChangePassword}>
                <Text style={styles.buttonTextStyle}>Chnage Password</Text>
              </TouchableOpacity>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate('Home')}>
                Back to Login
              </Text>
              {/* <Text
              style={styles.registerTextStyle}
              // onPress={() => navigation.navigate('Login')}>
              onPress={() => navigation.navigate('NewPassword')}>
              NewPassword
            </Text> */}
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
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
    height: 320,
    width: 320,
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
  registerTextStyle: {
    color: '#222831',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
});
