import React, { createContext, useContext } from 'react';
import { supabase } from '../supabaseConfig';
import { useAuth } from './authContext';

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  const { user } = useAuth();

  // Fetch all exercises
  const getAllExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise')
        .select('*');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return (
    <DatabaseContext.Provider value={{ getAllExercises }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export const useDatabase = () => useContext(DatabaseContext);
