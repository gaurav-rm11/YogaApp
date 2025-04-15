import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useAuth } from '../context/authContext';
import { useDatabase } from '../context/DatabaseContext';

export default function UserScreen() {
  const { user, signOut } = useAuth();
  const { getExerciseHistory } = useDatabase();
  const router = useRouter();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    if (user?.id) {
      setLoading(true);
      const { data, error } = await getExerciseHistory(user.id);  // Pass the user.id to fetch history specific to the logged-in user
      if (!error) {
        setHistory(data);
      } else {
        console.error("Error fetching exercise history:", error);
      }
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Set logout button in header
  const headerRight = useCallback(() => (
    <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={24} color="#a910ff" />
    </TouchableOpacity>
  ), []);

  useEffect(() => {
    navigation.setOptions({ headerRight });
    if (user?.id) {
      fetchHistory();
    }
  }, [user?.id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Ionicons name="person-circle-outline" size={100} color="#a910ff" />
        <Text style={styles.username}>{user?.user_metadata?.username || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Exercise History</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#a910ff" />
        ) : history.length === 0 ? (
          <Text style={styles.noHistoryText}>No exercises found.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.exerciseName}>{item.exercise_name}</Text>
              <Text style={styles.exerciseDetails}>
              Date: {new Date(item.date).toLocaleDateString(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})} | Duration: {item.duration}s
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  historySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noHistoryText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    marginTop: 5,
    color: '#555',
    fontSize: 14,
  },
  logoutButton: {
    marginRight: 15,
  },
});
