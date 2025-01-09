import React from 'react';

import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width: W, height: H} = Dimensions.get('window');

const Welcome = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('./assets/image/welcome1.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to Connect Pro</Text>
        <Text style={styles.subtitle}> connect and control</Text>
        <View style={styles.btncontainer}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')} // Navigate to the 'Connect' screen
          >
            <Text style={styles.buttonTextStyle}> Lets Go.. </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonTextStyle}>Lets Go.. </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  container: {
    width: W,
    height: H,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222831',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#222831',
    marginBottom: 20,
  },

  btncontainer: {
    marginTop: 50,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#EEEEEE',
    borderColor: '#222831',
    height: 40,
    width: 200,
    alignItems: 'center',
    borderRadius: 30,

    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#EEEEEE',
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#31363F',
  },
  buttonText: {
    fontSize: 18,
    color: '#31363F',
    fontWeight: 'bold',
  },
  logo: {
    height: 300,
    width: 300,
    marginBottom: 20,
  },
});
