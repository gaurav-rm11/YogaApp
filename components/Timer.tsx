import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.timer}>
      <Text style={styles.timerText}>⏱ {seconds}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    color: '#333',
  },
});
