import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const Onboarding = (props) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const isNameValid = /^[a-zA-Z]+$/.test(firstName);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isNameValid && isEmailValid;

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      await AsyncStorage.setItem('userFirstName', firstName);
      await AsyncStorage.setItem('userEmail', email);

      // Update login state instead of navigation.replace
      if (props.setIsLoggedIn) {
        props.setIsLoggedIn(true);
      }
    } catch (e) {
      console.error('Failed to save onboarding info', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Logo centered */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.logoImage}
        />
      </View>

      {/* Title section */}
      <View style={styles.titleSection}>
        <View style={styles.textBlock}>
          <Text style={styles.littleLemonText}>Little Lemon</Text>
          <Text style={styles.cityText}>Chicago</Text>
          <Text style={styles.descriptionText}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={require('../assets/images/Heroimage.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Form Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />
        {!isNameValid && firstName.length > 0 && (
          <Text style={styles.error}>Name must contain only letters.</Text>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {!isEmailValid && email.length > 0 && (
          <Text style={styles.error}>Enter a valid email address.</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={handleNext} disabled={!isFormValid} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },

  titleSection: {
    flexDirection: 'row',
    backgroundColor: '#495E57',
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
  },

  textBlock: {
    flex: 1,
    marginRight: 10,
  },

  littleLemonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4CE14',
    marginBottom: 4,
  },

  cityText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    fontWeight: '600',
  },

  descriptionText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },

  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },

  inputContainer: {
    width: '100%',
  },

  label: {
    fontWeight: '600',
    marginBottom: 4,
  },

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },

  error: {
    color: 'red',
    fontSize: 12,
  },

  buttonContainer: {
    marginTop: 24,
  },
});

export default Onboarding;
