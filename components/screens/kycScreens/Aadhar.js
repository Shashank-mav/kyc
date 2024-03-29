import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


const Aadhar = ({ navigation }) => {
  const [aadharName, setAadharName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const handleVerificationSubmit = async () => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const db = getFirestore(app);
      const userDocRef = doc(db, 'Users', user.uid);

      await updateDoc(userDocRef, {
        aadharName: aadharName,
        aadharNumber: aadharNumber,
        contactNumber: contactNumber,
      });

      navigation.navigate('Home', {
        aadharDetails: {
          aadharName,
          aadharNumber,
          contactNumber,
        },
      });
    } catch (error) {
      console.error('Error submitting verification:', error);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync();
      setPhoto(uri);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>

    <View style={styles.formContainer}>
      <Text style={styles.heading}>Aadhar Verification</Text>

      <View style={styles.cameraContainer}>
        {!photo && (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => setCamera(ref)}
          />
        )}

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
          disabled={photo !== null}
        >
          <Text style={styles.captureButtonText}>
            {photo ? 'Photo Taken' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
        {photo && (
          <Image source={{ uri: photo }} style={styles.photoPreview} />
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={aadharName}
        onChangeText={(text) => setAadharName(text)}

      />
      <TextInput
        style={styles.input}
        placeholder="Aadhar Number"
        value={aadharNumber}
        onChangeText={(text) => setAadharNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={(text) => setContactNumber(text)}
        keyboardType="numeric"
      />
      <TouchableOpacity
         style={[styles.button, { backgroundColor: !photo || !aadharName || !aadharNumber || !contactNumber ? '#CCCCCC' : '#f37e0b' }]}
        onPress={handleVerificationSubmit}
        disabled={!photo || !aadharName || !aadharNumber || !contactNumber}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,

  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#333333',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#f37e0b',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#333333',
  },
  button: {
    backgroundColor: '#f37e0b',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 4 / 4,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    backgroundColor: '#f37e0b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  captureButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  photoPreview: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default Aadhar;
