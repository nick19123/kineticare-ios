import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialPlans } from './db';

export interface Exercise {
  exerciseImage: string | { uri: string }; // Updated to match "exerciseImage"
  exerciseID: number; // Added "exerciseID"
  exerciseName: string; // Updated to match "exerciseName"
  sequenceNum: number; // Added "sequenceNum"
  reps: number; // Updated to match "reps" as a number
  sets: number; // Added "sets"
  duration: number; // Added "duration"
  time: number; // Added "time"
  description: string; // Updated to match "description"
}

export interface Plan {
  planName: string; // Updated to match "planName"
  exercises: Exercise[]; // Array of exercises
}

export const loadPlansFromStorage = async (): Promise<Plan[]> => {
  if (typeof window === 'undefined') {
    // Return initialPlans if running in a non-browser environment
    return Object.values(initialPlans).map((plan: any) => ({
      planName: plan.planName,
      exercises: plan.exercises.map((exercise: any) => ({
        exerciseImage: exercise.exerciseImage,
        exerciseID: exercise.exerciseID,
        exerciseName: exercise.exerciseName,
        sequenceNum: exercise.sequenceNum || 0,
        reps: parseInt(exercise.reps, 10) || 0,
        sets: parseInt(exercise.sets, 10) || 0,
        duration: parseInt(exercise.duration, 10) || 0,
        time: parseInt(exercise.time, 10) || 0,
        description: exercise.description,
      })),
    }));
  }

  try {
    const plansData = await AsyncStorage.getItem('plans');
    const parsedPlans = plansData ? JSON.parse(plansData) : null;

    // If parsedPlans is null or not an array, fall back to initialPlans
    if (!parsedPlans || !Array.isArray(parsedPlans)) {
      console.warn('Plans data is missing or invalid. Falling back to initialPlans.');
      return Object.values(initialPlans).map((plan: any) => ({
        planName: plan.planName,
        exercises: plan.exercises.map((exercise: any) => ({
          exerciseImage: exercise.exerciseImage,
          exerciseID: exercise.exerciseID,
          exerciseName: exercise.exerciseName,
          sequenceNum: exercise.sequenceNum || 0,
          reps: parseInt(exercise.reps, 10) || 0,
          sets: parseInt(exercise.sets, 10) || 0,
          duration: parseInt(exercise.duration, 10) || 0,
          time: parseInt(exercise.time, 10) || 0,
          description: exercise.description,
        })),
      }));
    }

    // Transform the data if necessary
    return parsedPlans.map((plan: any) => ({
      planName: plan.planName,
      exercises: plan.exercises.map((exercise: any) => ({
        exerciseImage: exercise.exerciseImage,
        exerciseID: exercise.exerciseID,
        exerciseName: exercise.exerciseName,
        sequenceNum: exercise.sequenceNum,
        reps: exercise.reps,
        sets: exercise.sets,
        duration: exercise.duration,
        time: exercise.time,
        description: exercise.description,
      })),
    }));
  } catch (error) {
    console.error('Error loading plans from storage:', error);
    // Fall back to initialPlans in case of an error
    return Object.values(initialPlans).map((plan: any) => ({
      planName: plan.planName,
      exercises: plan.exercises.map((exercise: any) => ({
        exerciseImage: exercise.exerciseImage,
        exerciseID: exercise.exerciseID,
        exerciseName: exercise.exerciseName,
        sequenceNum: exercise.sequenceNum || 0,
        reps: parseInt(exercise.reps, 10) || 0,
        sets: parseInt(exercise.sets, 10) || 0,
        duration: parseInt(exercise.duration, 10) || 0,
        time: parseInt(exercise.time, 10) || 0,
        description: exercise.description,
      })),
    }));
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