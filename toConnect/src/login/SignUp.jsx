import React, {useState} from 'react';
import axiosInstance from '../AxiosConfig';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';


const SignUp = ({navigation}) => {
  const [errortext, setErrortext] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');




  const handleSubmitPress = async () => {
    setErrortext('');

    // Validate form fields
    if (!userName || !phoneNumber || !email || !dob || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    const formData = {
      name: userName,
      phone: phoneNumber,
      email: email,
      dob: dob,
      password: password,
    };
    console.log(formData);
    // setLoading(true);

    try {
    
      const response = await axiosInstance.post('/auth/register', formData);
      // Handle successful response
      if (response.status === 200) {
        Alert.alert(
          'Success',
          response.data.message || 'Data submitted successfully!',
        );
        navigation.navigate('Login');
      } else {
        setErrortext(
          response.data.message || 'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
    

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
          case 409:
            setErrortext(data.error || "User already exists!");
              break;
          case 500:
            setErrortext(data.error || "Server error. Please try again later.");
              break;
          default:
            setErrortext(data.error || "Something went wrong. Please try again.");
      }
  } else if (error.request) {
    setErrortext("No response from server. Please check your network.");
  } else {
    setErrortext("An unexpected error occurred. Please try again.");
  }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainBody}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <KeyboardAvoidingView enabled behavior="padding">
            <Image
              source={require('../assets/image/sign_up.png')}
              style={styles.logo}
            />
            <View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Name"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="words"
                  value={userName}
                  onChangeText={setUserName}
                />
              </View>

              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Phone No."
                  placeholderTextColor="#8b9cb5"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

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
                  placeholder="Date of Birth (DD-MM-YYYY)"
                  placeholderTextColor="#8b9cb5"
                  value={dob}
                  onChangeText={setDob}
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

              {errortext ? (
                <Text style={styles.errorTextStyle}>{errortext}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={handleSubmitPress}>
                <Text style={styles.buttonTextStyle}>SIGNUP</Text>
              </TouchableOpacity>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate('Login')}>
                Back to Login
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default SignUp;

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
    color: '#EEEEEE',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
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
