import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

const Profile = ({ navigation, setIsLoggedIn }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [imageUri, setImageUri] = useState(null);

  const [emailNotif, setEmailNotif] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  const loadData = async () => {
    try {
      const values = await AsyncStorage.multiGet([
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'imageUri',
        'emailNotif',
        'newsletter',
        'userFirstName',
        'userEmail',
      ]);
      const data = Object.fromEntries(values);

      setFirstName(data.firstName || data.userFirstName || '');
      setLastName(data.lastName || '');
      setEmail(data.email || data.userEmail || '');
      setPhoneNumber(data.phoneNumber || '');
      setImageUri(data.imageUri || null);
      setEmailNotif(data.emailNotif === 'true');
      setNewsletter(data.newsletter === 'true');
    } catch (e) {
      console.warn('Failed to load profile data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveChanges = async () => {
    try {
      await AsyncStorage.multiSet([
        ['firstName', firstName],
        ['lastName', lastName],
        ['email', email],
        ['phoneNumber', phoneNumber],
        ['imageUri', imageUri],
        ['emailNotif', emailNotif.toString()],
        ['newsletter', newsletter.toString()],
      ]);
      alert('Changes saved!');
    } catch (e) {
      alert('Failed to save data.');
    }
  };

  const discardChanges = () => {
    loadData();
    alert('Changes discarded.');
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Logo */}
        <Text style={styles.logoText}>🍋 Little Lemon</Text>

        {/* Avatar */}
        <TouchableOpacity onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.avatarText}>
                {firstName?.[0] || ''}
                {lastName?.[0] || ''}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarLarge} />
        ) : (
          <View style={styles.placeholderAvatarLarge}>
            <Text style={styles.avatarText}>
              {firstName?.[0] || ''}
              {lastName?.[0] || ''}
            </Text>
          </View>
        )}

        <View style={styles.avatarButtons}>
          <Button title="Change" onPress={pickImage} />
          <Button title="Remove" onPress={() => setImageUri(null)} color="red" />
        </View>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <View style={styles.phoneRow}>
          <CountryPicker
            withCallingCode
            withFilter
            withFlag
            countryCode={countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Phone number"
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
          />
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.switchRow}>
          <Text>Email Notifications</Text>
          <Switch value={emailNotif} onValueChange={setEmailNotif} />
        </View>
        <View style={styles.switchRow}>
          <Text>Special Newsletter</Text>
          <Switch value={newsletter} onValueChange={setNewsletter} />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <Button title="Logout" color="crimson" onPress={handleLogout} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Button title="Discard" onPress={discardChanges} color="grey" />
        <Button title="Save Changes" onPress={saveChanges} />
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#333',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  logoutContainer: {
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  paddingHorizontal: 10,
},

backButton: {
  padding: 5,
},

backButtonText: {
  fontSize: 20,
  color: 'black',
},

logoText: {
  fontSize: 24,
  fontWeight: 'bold',
},

avatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
},

placeholderAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#ccc',
  alignItems: 'center',
  justifyContent: 'center',
},

avatarText: {
  fontWeight: 'bold',
  fontSize: 16,
  color: '#fff',
},
avatarSection: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  justifyContent: 'space-between',
},

avatarLarge: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#ccc',
},

placeholderAvatarLarge: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
},

avatarButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: 150, // adjust width to your liking
},


});
