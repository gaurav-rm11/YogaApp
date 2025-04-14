// app/_layout.js
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/authContext';
import { DatabaseProvider } from '../context/DatabaseContext';
import { useLocalSearchParams } from 'expo-router';

export default function RootLayout() {
  const params = useLocalSearchParams();
  return (
    <AuthProvider>
      <DatabaseProvider>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="index" options={{ headerTitle: "Home" , headerRight: params.headerRight ? () => params.headerRight : undefined,}} />
          <Stack.Screen name="signup" options={{ headerTitle: "Sign Up" }} />
          <Stack.Screen name="signin" options={{ headerTitle: "Sign In" }} />
          <Stack.Screen name="user" options={{ headerTitle: "My Profile" }} />
          <Stack.Screen name="exercise-screen" options={{headerTitle: "exercise"}}/>
        </Stack>
      </DatabaseProvider>
    </AuthProvider>
  );
}