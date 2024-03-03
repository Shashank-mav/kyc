import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { getFirestore, collection, getDoc, doc,updateDoc  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Progress from 'react-native-progress';

const Verify = ({ navigation }) => {

  const [countdown, setCountdown] = useState(10);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [aadharDetails, setAadharDetails] = useState({
    aadharName: '',
    aadharNumber: '',
    contactNumber: '',
    dob: '',
  });

  const [panDetails, setPanDetails] = useState({
    panName: '',
    panNumber: '',
  });
  const auth = getAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const db = getFirestore();
        const userUID = auth.currentUser.uid; 

        const userDocRef = doc(db, 'Users', userUID);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const data = userDocSnapshot.data();

          setAadharDetails({
            aadharName: data.aadharName || '',
            aadharNumber: data.aadharNumber || '',
            contactNumber: data.contactNumber || '',
            dob: data.dob || '',
          });

          setPanDetails({
            panName: data.panName || '',
            panNumber: data.panNumber || '',
          });
          console.log('Aadhar Name:', data.aadharName);
          console.log('PAN Name:', data.panName);
        } else {
          console.warn('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };

    fetchUserDetails();
  }, [auth]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);

      if (aadharDetails.aadharName.trim().toLowerCase() === panDetails.panName.trim().toLowerCase()) {
        console.log('Verification Success');
        setVerificationStatus('Success');
        navigation.navigate('Success');
      } else {
        console.log('Verification Failed');
        setVerificationStatus('failed');
        navigation.navigate('Failed');
      }



    }

    return () => clearInterval(timer);
  }, [countdown, navigation, aadharDetails.aadharName, panDetails.panName]);

  useEffect(() => {
    const updateVerificationStatus = async () => {
      try {
        const db = getFirestore();
        const userUID = auth.currentUser.uid;

        const userDocRef = doc(db, 'Users', userUID);
        await updateDoc(userDocRef, { verificationStatus });
      } catch (error) {
        console.error('Error updating verification status:', error.message);
      }
    };

    if (verificationStatus !== 'pending') {
      updateVerificationStatus();
    }
  }, [auth, verificationStatus]);

  const progress = 1 - countdown / 10;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.verifyingText}>Verify Details</Text>
          <LottieView
            autoPlay
            loop
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'transparent',
            }}
            source={require('../../../assets/a1.json')}
          />
        </View>
        <View style={styles.content}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Verifying...</Text>
          <Progress.Bar progress={progress} width={300} color="#59b45c" />
        </View>
          <Text style={styles.explanationHeading}>How Aadhar and PAN Verification Works</Text>
          <Text style={styles.explanationText}>
            Aadhar verification involves validating the details present in your Aadhar card with the
            information provided during registration.
          </Text>
        </View>

        <View style={styles.card}>
          <Image source={require('../../../assets/aadhaarc.png')} style={styles.cardImage} />
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>Aadhar Details</Text>
            <Text style={styles.cardText}>Name: {aadharDetails.aadharName}</Text>
            <Text style={styles.cardText}>Aadhar Number: {aadharDetails.aadharNumber}</Text>
            <Text style={styles.cardText}>Contact Number: {aadharDetails.contactNumber}</Text>
            <Text style={styles.cardText}>Date of Birth: {aadharDetails.dob}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Image source={require('../../../assets/panc.png')} style={styles.cardImage} />
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>PAN Details</Text>
            <Text style={styles.cardText}>Name: {panDetails.panName}</Text>
            <Text style={styles.cardText}>PAN Number: {panDetails.panNumber}</Text>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',

    marginBottom:50,

  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  verifyingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  explanationHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign:"center",
  },
  explanationText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: 14,
    color:"#4caf50",
    marginBottom: 10,
  },
});

export default Verify;
