import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { Avatar, Card, ProgressBar } from 'react-native-paper';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { signOut } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';

const Home = ({ navigation, route }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [verificationProgress, setVerificationProgress] = useState(0.2);
  const [aadharDetails, setAadharDetails] = useState(null);
  const [panDetails, setPanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [authStateDetermined, setAuthStateDetermined] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState("pending");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };
  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: handleLogout,
        },
      ],
      { cancelable: false }
    );
  };
  useEffect(() => {
    if (route.params && route.params.verificationStatus) {
      setVerificationStatus(route.params.verificationStatus);
    }
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthStateDetermined(true);
      console.log('onAuthStateChanged - User:', user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const db = getFirestore(app);
        const userUID = user ? user.uid : null;

        if (userUID) {
          const userDocRef = doc(db, 'Users', userUID);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserDetails(userDocSnapshot.data());
          } else {
            console.warn('User document does not exist');
          }
        } else {
          // console.warn('User not authenticated');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    if (authStateDetermined && user) {
      fetchUserDetails();
    }
  }, [authStateDetermined, user]);

  useEffect(() => {
    if (route.params && route.params.aadharDetails) {
      setAadharDetails(route.params.aadharDetails);
      // setVerificationProgress(0.5);
    }

    if (route.params && route.params.panDetails) {
      setPanDetails(route.params.panDetails);
      // setVerificationProgress(0.5);
    } else {
      // Fetch Aadhar details only if it's not provided through route params
      fetchAadharDetails();
      // Fetch PAN details only if it's not provided through route params
      fetchPanDetails();
    }
  }, [route.params, user]);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const db = getFirestore(app);
        const userUID = user ? user.uid : null;

        if (userUID) {
          const userDocRef = doc(db, 'Users', userUID);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const status = userData?.verificationStatus || null;

            if (status) {
              setVerificationStatus(status);
              console.log('Verification Status:', status);
            } else {
              // console.warn('Verification status not found in user document');
            }
          } else {
            console.warn('User document does not exist');
          }
        } else {
          // console.warn('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching verification status:', error.message);
      }
    };

    fetchVerificationStatus();
  }, [user]);

  const fetchAadharDetails = async () => {
    try {
      const db = getFirestore(app);
      const userUID = user ? user.uid : null;

      if (userUID) {
        const userDocRef = doc(db, 'Users', userUID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          const aadharDetails = {
            aadharName: userData?.aadharName || '',
            aadharNumber: userData?.aadharNumber || '',
            contactNumber: userData?.contactNumber || '',
            dob: userData?.dob || '',
          };

          if (aadharDetails) {
            setAadharDetails(aadharDetails);
            setVerificationProgress(0.5);
          } else {
            console.warn('Aadhar details not found in user document');
          }
        } else {
          console.warn('User document does not exist');
        }
      } else {
        // console.warn('User not authenticated');
      }
    } catch (error) {
      console.error('Error fetching Aadhar details:', error.message);
    }
  };

  const fetchPanDetails = async () => {
    try {
      const db = getFirestore(app);
      const userUID = user ? user.uid : null;

      if (userUID) {
        const userDocRef = doc(db, 'Users', userUID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();

          const panDetails = {
            panName: userData?.panName || '',
            panNumber: userData?.panNumber || '',
          };

          if (panDetails) {
            setPanDetails(panDetails);
            // setVerificationProgress(0.7);
          } else {
            console.warn('PAN details not found in user document');
          }
        } else {
          console.warn('User document does not exist');
        }
      } else {
        // console.warn('User not authenticated');
      }
    } catch (error) {
      console.error('Error fetching PAN details:', error.message);
    }
  };



  if (!authStateDetermined) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#AD40AF"
          style={styles.loadingIndicator}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome, {userDetails?.name}</Text>
          <TouchableOpacity onPress={confirmLogout}>
        <FontAwesome name="sign-out" size={30} color="red" />
      </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#AD40AF"
            style={styles.loadingIndicator}
          />
        ) : (
          <>
            {userDetails ? (
             <Card >
             <Card.Content>
             <View style={styles.userInfoContainer}>
      <Avatar.Image
        size={100}
        source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Ash' }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.nameText}>{userDetails.name}</Text>
        <Text style={styles.emailText}>{userDetails.email}</Text>
        <Text style={styles.dobText}>
          {userDetails.dob}
        </Text>
      </View>

    </View>


             </Card.Content>
              <View style={{paddingHorizontal:20, marginBottom:10}} >
              <ProgressBar
               progress={verificationStatus === 'Success' ? 1.0 : verificationProgress}
               color={verificationStatus === 'Success' ? "#50d05c" : "#ffb800"}
               style={styles.progressBar}
             />

             {verificationStatus && (
               <View style={styles.verificationStatusContainer}>
                 <Text style={styles.verificationStatusText}>
                   Status: {verificationStatus}
                 </Text>
               </View>
             )}
              </View>

           </Card>

            ) : (
              <Text style={styles.loadingText}>Loading user details...</Text>
            )}

            <View style={{padding:10}}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }} >
                Aadhar and PAN Card KYC
              </Text>
            </View>

            {aadharDetails.aadharName ? (
               <Card style={styles.elevatedCard}>
               <Card.Content style={styles.cardContent}>

                 <Image
                   source={require('../../assets/tick.png')}
                   style={styles.cardImage}
                 />
                 <View style={styles.textContainer}>
                 <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#f37e0b' }}>
        Aadhar Card Details
      </Text>
    </View>
                   <Text style={styles.aadharNameText}>
                     {aadharDetails.aadharName}
                   </Text>
                   <Text style={styles.aadharNumberText}>
                     {aadharDetails.aadharNumber}
                   </Text>
                   {/* Add more Aadhar details if needed */}
                 </View>
               </Card.Content>
             </Card>
            ) : (
              <TouchableOpacity
                style={styles.verificationCard}
                onPress={() => navigation.navigate('Aadhar')}
              >
                <Image
                   source={require('../../assets/aadhaarc.png')}
                  style={styles.verificationCardImage}
                />
                <View style={styles.verificationCardContent}>
                  <Text style={styles.verificationCardHeading}>
                    Start Aadhar Verification
                  </Text>
                  <Text style={styles.verificationCardAbout}>
                    Begin the process to verify your Aadhar card.
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {panDetails.panName  ? (
              <View>
                 <Card style={styles.elevatedCard}>
                <Card.Content style={styles.cardContent}>
                  <Image
                    source={require('../../assets/tick.png')}
                    style={styles.cardImage}
                  />
                  <View style={styles.textContainer}>
                  <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1469a2' }}>
        PAN Card Details
      </Text>
    </View>
                    <Text style={styles.aadharNameText}>
                     {panDetails.panName}
                    </Text>
                    <Text style={styles.aadharNumberText}>
                     {panDetails.panNumber}
                    </Text>
                    {/* Add more Aadhar details if needed */}
                  </View>
                </Card.Content>
              </Card>

              </View>
            ) : (
              <TouchableOpacity
                style={styles.verificationCard}
                onPress={() => navigation.navigate('Pan')}
              >
                <Image
                  source={require('../../assets/panc.png')}
                  style={styles.verificationCardImage}
                />
                <View style={styles.verificationCardContent}>
                  <Text style={styles.verificationCardHeading}>
                    Start PAN Verification
                  </Text>
                  <Text style={styles.verificationCardAbout}>
                    Begin the process to verify your PAN card.
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {aadharDetails?.aadharName && panDetails?.panName ? (
              <>
                {verificationStatus=="pending" &&
                  <TouchableOpacity
                  style={styles.startVerificationButton}
                  onPress={() => navigation.navigate('Verify')}
                >
                   <FontAwesome name="check-circle" size={24} color="#fff" />
                <Text style={styles.startVerificationButtonText}>
                  Start Verification
                </Text>
                </TouchableOpacity>
                }

              </>
            ) : null}


          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    marginTop: 40,
  },
  elevatedCard: {
    elevation: 5,
    borderRadius: 10,
    marginBottom: 20,

  },
  userInfoContainer: {
    width: "100%",
    flexDirection: 'row',
    padding:5,
    alignItems: 'center',
    justifyContent: "flex-start",
    marginBottom: 20,
  },

  card: {
    elevation: 3,
    borderRadius: 10,
    marginBottom: 20,
    padding: 5,
    alignItems: 'center',
    width: "100%",

  },

  startVerificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    elevation: 3,
  },
  startVerificationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",

  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatar: {
    backgroundColor: '#AD40AF',
  },

  userInfo:{
    paddingHorizontal:20,

  },

  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,

  },
  emailText: {
    fontSize: 12,
    color:"gray",
    marginBottom: 5,
  },
  dobText: {
    fontSize: 12,
    color:"gray",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    marginTop: 10,
    borderRadius: 10 ,

  },
  verificationStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#50d05c",
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#AD40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  verificationCardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  verificationCardContent: {
    flex: 1,
  },
  verificationCardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  verificationCardAbout: {
    fontSize: 14,
    color: '#666',
  },
});

export default Home;
