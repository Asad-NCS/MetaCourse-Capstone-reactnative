import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import HomeScreen from './screens/HomeScreen';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Example: check if user token exists to consider logged in
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (e) {
        console.error('Error checking login status:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
            />
            <Stack.Screen
              name="Profile"
              // Pass logout handler to Profile
              children={(props) => (
                <Profile {...props} setIsLoggedIn={setIsLoggedIn} />
              )}
            />
          </>
        ) : (
          <Stack.Screen
            name="Onboarding"
            // Pass login handler to Onboarding to set isLoggedIn true on successful login
            children={(props) => (
              <Onboarding {...props} setIsLoggedIn={setIsLoggedIn} />
            )}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
