import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import CustomButton from '../CustomButton';
import InputField from '../InputField';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';




const Login = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedPassword = await AsyncStorage.getItem('userPassword');

      if (storedEmail && storedPassword) {
        await signInWithEmailAndPassword(auth, storedEmail, storedPassword);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error checking auto-login:', error.message);
    }
  };



  const handleLogin = async () => {
    try {
      setIsProcessing(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
      if (userCredential.user) {
        navigation.navigate('Home');
      } else {
        alert('Login failed. Please check your email and password.');
      }
    } catch (error) {
      let errorMessage = 'An error occurred while logging in. Please try again.';

    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address. Please check and try again.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found. Please check your credentials and try again.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please check and try again.';
    }

    alert(errorMessage);
    }finally {
      setIsProcessing(false);
    }
  };



  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>

        </View>

        <Text
          style={{

            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
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






        <TouchableOpacity
  onPress={handleLogin}
  disabled={!email || !password || isProcessing}
  style={{
    backgroundColor: !email || !password || isProcessing ? '#ccc' : '#AD40AF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    marginHorizontal: 5,
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
      Login
    </Text>}

</TouchableOpacity>




        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>New to the app?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;