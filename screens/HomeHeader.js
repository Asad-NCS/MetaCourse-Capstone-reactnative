import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HomeHeader = ({ navigation, imageUri, firstName, lastName }) => {
  return (
    <View style={styles.header}>
      {/* Empty left spacer to keep logo centered */}
      <View style={{ width: 40 }} />

      {/* Logo in center */}
      <Text style={styles.logoText}>🍋 Little Lemon</Text>

      {/* Avatar on right */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.avatarText}>
              {firstName?.[0] || ''}{lastName?.[0] || ''}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeHeader;
