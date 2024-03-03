import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

const Failed = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.failedHeading}>Failed !</Text>
        <View style={styles.header}>
          <LottieView
            autoPlay
            loop={true}
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'transparent',
            }}
            source={require('../../../assets/f.json')}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.failedText}>Verification Failed!</Text>
          <Text style={styles.failedDetailsText}>
            Your Aadhar and PAN details could not be verified. Because Aadhar and PAN names didn't matched.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => {
            navigation.navigate('Home', { verificationStatus: 'Failed' });
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
  failedHeading: {
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 20,

  },
  failedText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"red",
  },
  failedDetailsText: {
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

export default Failed;
