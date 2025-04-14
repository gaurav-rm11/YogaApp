import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Timer from '../components/Timer';
import { SafeAreaView } from 'react-native';


const poseData = {
  'Cobra Pose': {
    image: require('../assets/cobra pose.png'),
    steps: ['Lie face down', 'Place hands under shoulders', 'Lift chest up while keeping pelvis down'],
    benefits: ['Strengthens spine', 'Stretches chest and lungs', 'Relieves stress'],
  },
  'Pyramid Pose': {
    image: require('../assets/pyramid pose.png'),
    steps: ['Stand tall', 'Step one leg back', 'Bend forward over front leg'],
    benefits: ['Stretches hamstrings', 'Improves posture', 'Stimulates abdominal organs'],
  },
  // Add more poses as needed...
};

export default function ExerciseScreen() {
  const { pose } = useLocalSearchParams();
  const [showCamera, setShowCamera] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const data = poseData[pose as string];
  if (!data) return <Text>Pose not found</Text>;

  const handleStartAI = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setShowCamera(true);
  };

  if (showCamera && permission?.granted) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{pose}</Text>
        <Image source={data.image} style={styles.image} resizeMode="contain" />

        <Text style={styles.sectionTitle}>Steps</Text>
        {data.steps.map((step, idx) => (
          <Text style={styles.step} key={idx}>• {step}</Text>
        ))}

        <Text style={styles.sectionTitle}>Benefits</Text>
        {data.benefits.map((benefit, idx) => (
          <Text style={styles.benefit} key={idx}>✓ {benefit}</Text>
        ))}

        {showTimer && <Timer />}

        {/* These buttons are inside ScrollView now so they scroll too */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.timerButton} onPress={() => setShowTimer(true)}>
            <Ionicons name="time-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Start Timer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aiButton} onPress={handleStartAI}>
            <FontAwesome5 name="robot" size={20} color="white" />
            <Text style={styles.buttonText}>Start AI</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
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
    marginTop: 16,
    marginBottom: 6,
    color: '#444',
  },
  step: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  benefit: {
    fontSize: 16,
    color: '#4caf50',
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  timerButton: {
    backgroundColor: '#a910ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  aiButton: {
    backgroundColor: '#5e35b1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
