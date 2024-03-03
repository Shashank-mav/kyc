import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

const Success = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.successHeading}>Success !</Text>
        <View style={styles.header}>
          <LottieView
            autoPlay
            loop={true}
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'transparent',
            }}
            source={require('../../../assets/s.json')}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.successText}>Verification Successful!</Text>
          <Text style={styles.successDetailsText}>
            Your Aadhar and PAN details have been successfully verified.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => {
            navigation.navigate('Home', { verificationStatus: 'Success' });
          }}
        >
          <Text style={styles.returnButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  successHeading: {
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"green",
  },
  successDetailsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  returnButton: {
    backgroundColor: '#AD40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  returnButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Success;
