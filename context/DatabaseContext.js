import React, { createContext, useContext } from 'react';
import { supabase } from '../supabaseConfig';
import { useAuth } from './authContext';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const { user } = useAuth();

  // Fetch all exercises (not specific to a user)
  const getAllExercises = async () => {
    try {
      const { data, error } = await supabase.from('exercise').select('*');
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  // Add exercise history for a user
  const addExerciseHistory = async ({ userId, exerciseName, duration, completedAt }) => {
    try {
      if (!userId) throw new Error('User not authenticated');
      const { data, error } = await supabase.from('exercise_history').insert([
        {
          user_id: userId, // Use userId passed as a parameter
          exercise_name: exerciseName, // Use exerciseName passed as a parameter
          duration,
          // completed_at: completedAt, // Use completedAt passed as a parameter
        },
      ]);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  };
  

  // Fetch exercise history specific to the logged-in user
  const getExerciseHistory = async () => {
    try {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('exercise_history')
        .select('*')
        .eq('user_id', user.id) // Fetch history based on the user's ID
        .order('created_at', { ascending: false }); // Sort by creation date, most recent first
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return (
    <DatabaseContext.Provider
      value={{ getAllExercises, addExerciseHistory, getExerciseHistory }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

// Custom hook to use the database context in any component
export const useDatabase = () => useContext(DatabaseContext);
