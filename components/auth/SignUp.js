import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import InputField from '../InputField';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import GoogleSVG from '../../assets/google.svg';
import FacebookSVG from '../../assets/facebook.svg';
import TwitterSVG from '../../assets/twitter.svg';
import CustomButton from '../CustomButton';
import { signUp } from './auth';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {app} from '../../firebaseConfig'
import { getFirestore } from 'firebase/firestore';



const SignUp = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState('Date of Birth');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const auth = getAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // todo:

  const handleSignUp = async () => {
    setIsProcessing(true);
    try {
      if (password !== confirmPassword) {
        // Passwords do not match, show an alert
        alert("Password and Confirm Password do not match");
        return;
      }
      if (!email || !password || !confirmPassword || !fullName || dobLabel === 'Date of Birth') {
        alert("Please fill in all the details");
        return;
      }

      // Sign up the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      if (!currentUser) {
        console.error('User not authenticated');
        return;
      }

      // Store user data in the "Users" collection in Firestore using the user's UID as the document ID
      const db = getFirestore(app);
      const userDocRef = doc(db, 'Users', currentUser.uid);

      await setDoc(userDocRef, {
        name: fullName,
        email: email,
        dob: dobLabel,
      });

      // Navigate to the IntroSlider or perform any other actions
      navigation.navigate('IntroSlider');
    } catch (error) {
      // Handle signup error
      alert(`Error signing up: ${error.message}`);
    } finally{
      setIsProcessing(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDobLabel(selectedDate.toDateString());
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 25 }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}
        >
          Register
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/login.png')}
            style={{
              width: 200,
              height: 200,
              transform: [{ rotate: '-5deg' }],
            }}
          />
        </View>

        <Text style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>
          register with email ...
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TextInput
            style={{
              flex: 1,
              paddingVertical: 0,

              borderColor: 'gray',

              padding: 10,
              borderRadius: 5,
            }}
            placeholder="Full Name"
            onChangeText={(text) => setFullName(text)}
            value={fullName}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}
        >
          <MaterialIcons
            name="alternate-email"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />

          <TextInput
            style={{
              flex: 1,
              paddingVertical: 0,

              borderColor: 'gray',

              padding: 10,
              borderRadius: 5,
            }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email ID"
            keyboardType="email-address"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}
        >
          <MaterialCommunityIcons
            name="form-textbox-password"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />

          <TextInput
            style={{
              flex: 1,
              paddingVertical: 0,

              borderColor: 'gray',

              padding: 10,
              borderRadius: 5,
            }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 25,
          }}
        >
          <MaterialCommunityIcons
            name="form-textbox-password"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />

          <TextInput
            style={{
              flex: 1,
              paddingVertical: 0,

              borderColor: 'gray',

              padding: 10,
              borderRadius: 5,
            }}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={true}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: '#666', marginLeft: 5, marginTop: 5 }}>
              {dobLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date('2025-01-01')}
            minimumDate={new Date('1980-01-01')}
          />
        )}

<TouchableOpacity
  onPress={handleSignUp}
  disabled={!email || !password || !confirmPassword || !fullName || dobLabel === 'Date of Birth'}
  style={{
    backgroundColor: !email || !password || !confirmPassword || !fullName || dobLabel === 'Date of Birth' ? '#ccc' : '#AD40AF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    marginHorizontal: 5,
    // Add more inline styles as needed
  }}>
     {isProcessing ? (
        <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
      ) : <Text
      style={{
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
      }}>
      Register
    </Text>}

</TouchableOpacity>


        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}
        >
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: '#AD40AF', fontWeight: '700' }}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
