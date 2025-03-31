import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialPlans } from './db';

export interface Exercise {
  image: string | { uri: string };
  title: string;
  description: string;
  reps: string;
  hold: string;
  complete: string;
  perform: string;
  link: string | null;
}

export interface Plan {
  id: number;
  pName: string;
  pInfo: string;
  exercises: Exercise[];
}

export const loadPlansFromStorage = async () => {
  if (typeof window === 'undefined') return initialPlans;

  try {
    const plansData = await AsyncStorage.getItem('plans');
    return plansData ? JSON.parse(plansData) : initialPlans;
  } catch (error) {
    console.error('Error loading plans from storage', error);
    return {};
  }
};

export const clearStorage = async () => {
  if (typeof window !== 'undefined') {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage', error);
    }
  }
};

export const useClearStorage = () => {
  useEffect(() => {
    clearStorage();
  }, []);
};

export default {
  loadPlansFromStorage,
  clearStorage,
  useClearStorage,
};