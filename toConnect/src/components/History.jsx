import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
import axiosInstance from '../AxiosConfig';
import {useSelector} from 'react-redux';

const History = () => {
  const loginData = useSelector(state => state.login.user);
  const email = loginData?.user.email;
  const [notificationData, setNotificationData] = useState([]);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const fetchNotificationData = async () => {
      if (!email) {
        setErrorText('Email is missing or not available!');
        return;
      }

      try {
        const response = await axiosInstance.post('/user/getnotificationdata', {
          email,
        });

        if (response.status === 200 && response.data.status === 'Success') {
          setNotificationData(response.data.data); // Set fetched notifications
          setErrorText(''); // Clear any previous errors
        } else {
          setErrorText(response.data.error || 'Failed to fetch notifications.');
        }
      } catch (err) {
        setErrorText(
          err.message || 'Something went wrong while fetching data!',
        );
      }
    };

    fetchNotificationData();
  }, [email]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Notification History</Text>
        </View>

        {errorText !== '' && (
          <Text style={styles.errorTextStyle}>{errorText}</Text>
        )}

        {notificationData.length === 0 && errorText === '' && (
          <Text style={styles.noDataText}>No notifications available!</Text>
        )}

        {notificationData.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.dotIconContainer}>
              <View style={[styles.dot, {backgroundColor: '#2ECC71'}]} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.title}>Noise Level Reminder !!</Text>
              <Text style={styles.subtitle}>
                A high noise level detected{' '}
                <Text style={styles.bold}>{item.noiseLevel}</Text> when
                threshold is <Text style={styles.bold}>{item.threshold}</Text>{' '}
                on date <Text style={styles.bold}>{item.date}</Text> at time{' '}
                <Text style={styles.bold}>{item.time}</Text>.
              </Text>
              <Text style={styles.time}>Thank You</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  headingContainer: {
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dotIconContainer: {
    justifyContent: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  errorTextStyle: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default History;

// import React, {useState, useEffect} from 'react';
// import {SafeAreaView, View, Text, StyleSheet, ScrollView} from 'react-native';
// import axiosInstance from '../AxiosConfig';
// import {useSelector} from 'react-redux';

// const History = () => {
//   const loginData = useSelector(state => state.login.user);
//   const email = loginData?.user.email;
//   const [notificationData, setNotificationData] = useState([]);
//   const [errortext, setErrortext] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!email) {
//         setErrortext('Email is missing or not available!');
//         return;
//       }

//       try {
//         const response = await axiosInstance.post('/user/getnotificationdata', {
//           email,
//         });
//         if (response.status === 200 && response.data) {
//           setNotificationData(response.data); // Update state with user data
//           setErrortext(''); // Clear any previous errors
//         } else {
//           setErrortext('Failed to fetch user data. Please try again later.');
//         }
//       } catch (err) {
//         setErrortext(
//           err.message || 'Something went wrong while fetching data!',
//         );
//       }
//     };

//     fetchUserData();
//   }, [email]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         {errortext !== '' && (
//           <Text style={styles.errorTextStyle}>{errortext}</Text>
//         )}

//         {notificationData.length > 0 ? (
//           notificationData.map((item, index) => (
//             <View key={index} style={styles.card}>
//               <View style={styles.dotIconContainer}>
//                 <View style={[styles.dot, {backgroundColor: '#2ECC71'}]} />
//               </View>
//               <View style={styles.cardContent}>
//                 <Text style={styles.title}>Noise Level Reminder !!</Text>
//                 <Text style={styles.subtitle}>
//                   A high noise level detected{' '}
//                   <Text style={styles.bold}>noiseLevel {item.noiseLevel}</Text>{' '}
//                   when threshold is{' '}
//                   <Text style={styles.bold}>{item.threshold}</Text> on date{' '}
//                   <Text style={styles.bold}>{item.date}</Text> at time{' '}
//                   <Text style={styles.bold}>{item.time}</Text>.
//                 </Text>
//                 <Text style={styles.time}>Thank You</Text>
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={styles.noDataText}>No notifications available.</Text>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#EEEEEE',
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     marginTop: 12,
//     padding: 12,
//     flexDirection: 'row',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   dotIconContainer: {
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#4B5563',
//     marginTop: 4,
//     lineHeight: 20,
//   },
//   time: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 8,
//   },
//   bold: {
//     fontWeight: 'bold',
//   },
//   noDataText: {
//     textAlign: 'center',
//     color: '#6B7280',
//     marginTop: 20,
//     fontSize: 16,
//   },
//   errorTextStyle: {
//     color: '#DC2626',
//     textAlign: 'center',
//     marginVertical: 10,
//     fontSize: 14,
//   },
// });

// export default History;
