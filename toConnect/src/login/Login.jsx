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

import {useDispatch} from 'react-redux';
import {login} from '../reduxStore/loginSlice';
// import {setLoginData} from '../reduxStore/loginSlice';

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const [textMessage, setTextMessage] = useState('');
  const [errortext, setErrortext] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const loginData = {email: email, isLoggedIn: true};

  const handleSubmitPress = async () => {
    setErrortext('');
    if (!email) {
      Alert('Please fill Email');
      return;
    }
    if (!password) {
      Alert('Please fill Password');
      return;
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    const formData = {
      email: email,
      password: password,
    };
    try {
      const response = await axiosInstance.post('/auth/login', formData);

      // Handle successful login
      if (response.status === 200) {
        Alert.alert('Success', 'Logged in successfully!');

        setEmail('');
        setPassword('');

        const {id, user} = response.data;

        // Dispatch data to Redux store
        dispatch(login({id, user}));

        navigation.navigate('TurnOnOff'); // Redirect to TurnOnOff screen
      }
    } catch (error) {
      if (error.response) {
        const {status, data} = error.response;

        switch (status) {
          case 400:
            setErrortext(data.Error || 'Incorrect password. Please try again.');
            break;
          case 404:
            setErrortext(
              data.Error || 'Email not found. Please register first.',
            );
            break;
          case 500:
            setErrortext(data.Error || 'Server error. Please try again later.');
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
                source={require('../assets/image/login.png')}
                style={styles.logo}
              />
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Email"
                  placeholderTextColor="#8b9cb5"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Password"
                  placeholderTextColor="#8b9cb5"
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {textMessage != '' ? (
                <Text style={styles.errorTextStyle}>{textMessage}</Text>
              ) : null}
              {errortext != '' ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>LOGIN</Text>
              </TouchableOpacity>
              <Text
                style={styles.forgotTextStyle}
                onPress={() => navigation.navigate('ForgotPassword')}>
                Forgot your password
              </Text>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate('SignUp')}>
                New Here ? Register
              </Text>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default Login;

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
    height: 300,
    width: 300,
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
