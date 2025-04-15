import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/authContext';
import { useLocalSearchParams } from 'expo-router';

export default function ExerciseScreen() {
  const { pose } = useLocalSearchParams(); // ✅ Grab pose param from URL
  const { getAllExercises, addExerciseHistory } = useDatabase(); // Ensure addExerciseHistory is available in your context
  const { user } = useAuth();

  const [exerciseData, setExerciseData] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null); // Track start time

  const timerInterval = useRef<any>(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      const { data, error } = await getAllExercises();
      if (error) {
        console.error('Error fetching exercises:', error);
      } else {
        const selectedExercise = data.find((exercise) => exercise.name === pose);
        setExerciseData(selectedExercise);
      }
    };

    if (pose) {
      fetchExerciseData();
    }
  }, [pose, getAllExercises]);

  const handleStartAI = () => {
    // launch camera logic here
  };

  const startTimer = () => {
    if (!isTimerActive) {
      setStartTime(Date.now()); // Track start time when the timer starts
      timerInterval.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      setIsTimerActive(true);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerInterval.current);
    setIsTimerActive(false);
    // Save the exercise history when the user pauses the timer
    if (seconds > 0) {
      addExerciseHistory({
        userId: user.id,
        exerciseName: pose,
        duration: seconds,
        completedAt: new Date().toISOString(),
      });
      console.log("added to db successfully")
    }
  };

  const resetTimer = () => {
    setSeconds(0);
    setStartTime(null);
    clearInterval(timerInterval.current);
    setIsTimerActive(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        {exerciseData ? (
          <>
            <Text style={styles.header}>{pose}</Text>
            <Image
              source={{ uri: exerciseData.image_url }}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.sectionTitle}>Steps</Text>
            {exerciseData.steps.map((step, idx) => (
              <Text style={styles.step} key={idx}>
                • {step}
              </Text>
            ))}

            <Text style={styles.sectionTitle}>Benefits</Text>
            {exerciseData.benefits.map((benefit, idx) => (
              <Text style={styles.benefit} key={idx}>
                ✓ {benefit}
              </Text>
            ))}

            {showTimer && (
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{seconds}s</Text>
                <View style={styles.timerButtons}>
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={isTimerActive ? pauseTimer : startTimer}
                  >
                    <Text style={styles.buttonText}>
                      {isTimerActive ? 'Pause Timer' : 'Start Timer'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={resetTimer}
                  >
                    <Text style={styles.buttonText}>Reset Timer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => setShowTimer(true)}
              >
                <Ionicons name="time-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Start Timer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aiButton}
                onPress={handleStartAI}
              >
                <FontAwesome5 name="robot" size={20} color="white" />
                <Text style={styles.buttonText}>Start AI</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>Loading exercise data...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 12,
  },
  step: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  benefit: {
    fontSize: 16,
    color: '#4caf50',
    marginBottom: 6,
  },
  timerContainer: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiButton: {
    backgroundColor: '#ff4081',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
