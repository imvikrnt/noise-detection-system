import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Pressable,
} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logout} from '../reduxStore/loginSlice';

const DashHeader = ({navigation}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateTo = screen => {
    setSidebarVisible(false);
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    dispatch(logout());
    navigation.replace('Login');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Control Panel</Text>
        <TouchableOpacity onPress={toggleSidebar} style={styles.profileIcon}>
          <Image
            source={require('../assets/image/man.png')} // Replace with actual path
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {sidebarVisible && (
        <>
          {/* Backdrop */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setSidebarVisible(false)}
          />
          {/* Sidebar */}
          <Animated.View style={[styles.sidebar, {opacity: fadeAnim}]}>
            <TouchableOpacity
              onPress={() => navigateTo('Profile')}
              style={styles.sidebarOption}>
              <Text style={styles.optionText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigateTo('ChangePassword')}
              style={styles.sidebarOption}>
              <Text style={styles.optionText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigateTo('History')}
              style={styles.sidebarOption}>
              <Text style={styles.optionText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLogout()}
              style={styles.sidebarOption}>
              <Text style={styles.optionText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative', // Required for absolute positioning of sidebar/backdrop
    margin: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    // backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    // borderBottomColor: '#e9ecef',
    zIndex: 1, // Keep it above background but below sidebar
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  profileIcon: {
    padding: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    // width: Dimensions.get('window').width,
    width: 200,
    height: 220,
    // height: Dimensions.get('window').height,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    zIndex: 99, // Ensure it's above everything else
  },
  sidebar: {
    position: 'absolute',
    top: 80,
    right: 0,
    width: 200,
    height: 210,
    // height: Dimensions.get('window').height, // Full height
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100, // Above the backdrop
  },
  sidebarOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
});

export default DashHeader;
