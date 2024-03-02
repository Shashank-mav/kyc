import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../../firebaseConfig';

const Pan = ({ navigation }) => {
  const [panName, setPanName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription when the component unmounts
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
        panName: panName,
        panNumber: panNumber,
      });

      // Navigate to home screen or perform any other actions
      navigation.navigate('Home', {
        panDetails: {
          panName,
          panNumber,
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
        <Text style={styles.heading}>PAN Verification</Text>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          {!photo && (
            <Camera
              style={styles.camera}
              type={Camera.Constants.Type.back}
              ref={(ref) => setCamera(ref)}
            />
          )}

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureButtonText}>Take Photo</Text>
          </TouchableOpacity>
          {photo && (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="PAN Name"
          value={panName}
          onChangeText={(text) => setPanName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="PAN Number"
          value={panNumber}
          onChangeText={(text) => setPanNumber(text)}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                !photo || !panName || !panNumber ? '#CCCCCC' : '#1469a2',
            },
          ]}
          onPress={handleVerificationSubmit}
          disabled={!photo || !panName || !panNumber}
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
  input: {
    height: 40,
    width: '100%',
    borderColor: '#1469a2',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#333333',
  },
  button: {
    backgroundColor: '#1469a2',
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
  // Camera styles
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
    backgroundColor: '#1469a2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center', // Center the capture button
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
    alignSelf: 'center', // Center the photo preview
  },
});

export default Pan;
