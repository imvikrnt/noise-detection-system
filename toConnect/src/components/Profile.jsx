import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axiosInstance from '../AxiosConfig';
import {useSelector} from 'react-redux';
const Profile = ({navigation}) => {
  const loginData = useSelector(state => state.login.user);
  console.log(loginData);
  const [userData, setUserData] = useState(null);
  const [errortext, setErrortext] = useState('');
  const email = loginData?.user.email;



  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        setErrortext('Email is missing or not available!');
        return;
      }

      try {
        const response = await axiosInstance.post('/user/getdata', {email});
        if (response.status === 200 && response.data) {
          setUserData(response.data); // Update state with user data

          setErrortext(''); // Clear any previous errors
        } else {
          setErrortext('Failed to fetch user data. Please try again later.');
        }
      } catch (err) {
        setErrortext(
          err.message || 'Something went wrong while fetching data!',
        );
      }
    };

    fetchUserData();
  }, [email]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <Image
          source={require('../assets/image/profilebg2.png')}
          style={styles.logo}
        />
        <Image
          source={require('../assets/image/profile.png')} // The image will be passed as a prop
          style={styles.profileImage2}
        />
      </View>
      <View style={styles.headerContainer}>
      

        <View>
          <Text style={styles.title}>User Profile</Text>
          {userData ? (
            <>
              <Text style={styles.textColor}>Name: {userData.data.name}</Text>
              <Text style={styles.textColor}>Email: {userData.data.email}</Text>
              <Text style={styles.textColor}>
                Phone No.: {userData.data.phone}
              </Text>
              <Text style={styles.textColor}>
                Date of Birth: {userData.data.dob}
              </Text>
            </>
          ) : (
            <Text style={styles.textColor}>
              {errortext || 'Loading user data...'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.container}>
        {errortext !== '' && (
          <Text style={styles.errorTextStyle}>{errortext}</Text>
        )}

        <Text
          style={styles.registerTextStyle}
          onPress={() => navigation.navigate('Home')}>
          Back to Login
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  logo: {
    height: 300,
    width: 400,
    marginTop: 20,
    marginBottom: 20,
    margin: 'auto',
    borderWidth: 1,
    paddingTop: 20,
    // borderColor: '#7DE24E',
    borderRadius: 10,
  },
  profileImage2: {
    marginTop: -45,
    marginLeft: 40,
    borderWidth: 1,
    borderColor: '#7DE24E',
    width: 90, // Adjust width and height as needed
    height: 100,
    borderRadius: 10, // Makes the image circular
  },
  container: {
    flex: 1,
    padding: 20,
    color: '#222831',
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  profileIcon: {
    padding: 8,
  },

  profileImage: {
    width: 75, // Adjust width and height as needed
    height: 75,
    borderRadius: 5, // Makes the image circular
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222831',
  },
  textColor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222831',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: '#222831',
  },
  backButton: {
    marginTop: 20,
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
  registerTextStyle: {
    color: '#222831',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
});

export default Profile;
