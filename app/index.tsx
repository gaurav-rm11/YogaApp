import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Link, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/authContext';
import { useDatabase } from '../context/DatabaseContext'; // 👈 your DB logic

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { getAllExercises } = useDatabase(); // 👈 use the db context method
  const router = useRouter();
  const navigation = useNavigation();

  const [greeting, setGreeting] = useState('Welcome');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const headerRight = useCallback(() => {
    if (isAuthenticated) {
      return (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/user')}
        >
          <Ionicons name="person-circle-outline" size={32} color="#a910ff" />
        </TouchableOpacity>
      );
    } else {
      return (
        <Link href="/signup" style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </Link>
      );
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    navigation.setOptions({ headerRight });

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchExercises();
  }, [headerRight, navigation]);

  const fetchExercises = async () => {
    setLoading(true);
    const { data, error } = await getAllExercises();

    if (error) {
      console.error('Error fetching exercises:', error.message);
    } else {
      setExercises(data || []);
    }

    setLoading(false);
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>
          {greeting}, {user?.user_metadata?.username || 'Yogi'} 👋
        </Text>
        <Text style={styles.subtitle}>
          Ready to align your body and mind? Pick a pose below to begin!
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#a910ff" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.exerciseGrid}>
            {exercises.map((exercise, index) => (
              <View style={styles.card} key={index}>
                <Image
                  source={{ uri: exercise.image_url }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>{exercise.name}</Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() =>
                    router.push({
                      pathname: '/exercise-screen',
                      params: { pose: exercise.name },
                    })
                  }
                >
                  <Text style={styles.startButtonText}>Start Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdfdfd',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: '#a910ff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  signupButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileButton: {
    marginRight: 10,
    padding: 5,
    borderRadius: 20,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#222',
  },
  startButton: {
    backgroundColor: '#a910ff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
