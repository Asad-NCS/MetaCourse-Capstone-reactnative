import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeHeader from './HomeHeader';

const MENU_API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images';

const categoriesList = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export default function HomeScreen({ navigation }) {
  const [fullMenu, setFullMenu] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const storedMenu = await AsyncStorage.getItem('menuItems');
        if (storedMenu) {
          const menu = JSON.parse(storedMenu);
          setFullMenu(menu);
          setMenuItems(menu);
        } else {
          const response = await fetch(MENU_API_URL);
          const json = await response.json();
          const menu = json.menu;
          setFullMenu(menu);
          setMenuItems(menu);
          await AsyncStorage.setItem('menuItems', JSON.stringify(menu));
        }
      } catch (error) {
        console.error('Error loading menu:', error);
      }
    };
    loadMenu();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedImageUri = await AsyncStorage.getItem('imageUri');
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedImageUri) setImageUri(storedImageUri);
      } catch (e) {
        console.warn('Failed to load user data');
      }
    };
    loadUserData();
  }, []);

  const toggleCategory = (category) => {
  const lowerCategory = category.toLowerCase();
  setSelectedCategories((prev) =>
    prev.includes(lowerCategory)
      ? prev.filter((c) => c !== lowerCategory)
      : [...prev, lowerCategory]
  );
};


  useEffect(() => {
  let filtered = fullMenu;

  if (selectedCategories.length > 0) {
    filtered = filtered.filter((item) =>
      selectedCategories.includes(item.category.toLowerCase())
    );
  }

  if (searchText.trim() !== '') {
    const lowerSearch = searchText.toLowerCase();
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(lowerSearch)
    );
  }

  setMenuItems(filtered);
}, [searchText, selectedCategories, fullMenu]);

  const renderCategory = category => {
    const isSelected = selectedCategories.includes(category);
    return (
      <TouchableOpacity
        key={category}
        onPress={() => toggleCategory(category)}
        style={[
          styles.categoryItem,
          isSelected && styles.categoryItemSelected,
        ]}
      >
        <Text
          style={[styles.categoryText, isSelected && styles.categoryTextSelected]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.menuItem} key={`${item.name}-${index}`}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}/${item.image}` }}
        style={styles.menuImage}
      />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
        <Text style={styles.menuPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <HomeHeader
        navigation={navigation}
        imageUri={imageUri}
        firstName={firstName}
        lastName={lastName}
      />

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroTextBox}>
          <Text style={styles.heroTitle}>Little Lemon</Text>
          <Text style={styles.heroSubtitle}>Chicago</Text>
          <Text style={styles.heroDescription}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={require('../assets/images/Heroimage.png')}
          style={styles.heroImage}
        />
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search dishes..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* Category buttons */}
      <View style={styles.categoryList}>{categoriesList.map(renderCategory)}</View>

      {/* Menu */}
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    backgroundColor: '#495E57',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextBox: {
    flex: 1,
    marginRight: 10,
  },
  heroTitle: {
    color: '#F4CE14',
    fontSize: 28,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  heroDescription: {
    color: 'white',
    fontSize: 14,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  categoryItem: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 4,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  categoryItemSelected: {
    backgroundColor: '#F4CE14',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  menuImage: {
    width: 100,
    height: 100,
  },
  menuInfo: {
    flex: 1,
    padding: 10,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuDescription: {
    fontSize: 12,
    color: '#555',
    marginVertical: 4,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
