import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Home from '../screens/Home';

const slides = [
  {
    key: 'one',
    title: 'Getting Started',
    desc:"Your Step-by-Step Guide to SecureKYC",
    text: 'Follow these simple steps to complete your identity verification."',
    image: require('../../assets/s1.png'),
    backgroundColor: '#375e97',
  },
  {
    key: 'two',
    title: 'Enter Aadhar Details',
    desc:"Begin with Your Aadhar Information",
    text: 'Enter your Aadhar details. Double-check for accuracy',
    image: require('../../assets/s2.png'),
    backgroundColor: '#fb6542',
  },
  {
    key: 'three',
    title: 'Enter PAN Card',
    desc:"Completing the Process with PAN Card",
    text: 'Add your PAN card details. Its a crucial step to ensure comprehensive verification.',
    image: require('../../assets/s4.png'),
    backgroundColor: '#c21d39',
  },
  {
    key: 'four',
    title: 'Final Verification',
    desc:"Check and Submit",
    text: 'Once satisfied, hit the submit button. SecureKYC will swiftly process your details.',
    image: require('../../assets/s3.png'),
    backgroundColor: '#ffbb00',
  }
];

export default class IntroSlider extends React.Component {
  state = {
    showRealApp: false
  }

  _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }

  _onDone = () => {
    this.props.navigation.navigate('Home');
  }

  render() {
    if (this.state.showRealApp) {
      return <Home />;
    } else {
      return <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this._onDone} />;
    }
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  desc: {
    fontSize: 14,
  fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
