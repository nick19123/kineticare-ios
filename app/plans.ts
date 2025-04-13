import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialPlans } from './db';

export interface Exercise {
  eid: string;
  n: string;
  sn: number;
  r: number | null;
  s: number | null;
  d: string | null;
  t: string | null;
  de: string | null;
  i: string | undefined;
}

export interface Plan {
  p: string;
  e: Exercise[];
}

export const loadPlansFromStorage = async (): Promise<Plan[]> => {
  if (typeof window === 'undefined') {
    // Use initialPlans directly when not in a browser environment
    return Object.values(initialPlans || {}).map((plan: any) => ({
      p: plan.p || "",
      e: plan.e.map((exercise: any) => ({
        eid: exercise.eid,
        n: exercise.n,
        sn: exercise.sn,
        r: exercise.r,
        s: exercise.s,
        d: exercise.d,
        t: exercise.t,
        de: exercise.de,
        i: exercise.i,
      })),
    }));
  }

  try {
    const plansData = await AsyncStorage.getItem('plans');
    const parsedPlans = plansData ? JSON.parse(plansData) : null;

    if (!parsedPlans || !Array.isArray(parsedPlans)) {
      console.warn('Plans data is missing or invalid. Falling back to initialPlans.');
      return Object.values(initialPlans || {}).map((plan: any) => ({
        p: plan.p || "",
        e: plan.e.map((exercise: any) => ({
          eid: exercise.eid,
          n: exercise.n,
          sn: exercise.sn,
          r: exercise.r,
          s: exercise.s,
          d: exercise.d,
          t: exercise.t,
          de: exercise.de,
          i: exercise.i,
        })),
      }));
    }

    return parsedPlans.map((plan: any) => ({
      p: plan.p,
      e: plan.e.map((exercise: any) => ({
        eid: exercise.eid,
        n: exercise.n,
        sn: exercise.sn,
        r: exercise.r,
        s: exercise.s,
        d: exercise.d,
        t: exercise.t,
        de: exercise.de,
        i: exercise.i,
      })),
    }));
  } catch (error) {
    console.error('Error loading plans from storage:', error);
    // Fall back to initialPlans in case of an error
    return Object.values(initialPlans || {}).map((plan: any) => ({
      p: plan.p || "",
      e: plan.e.map((exercise: any) => ({
        eid: exercise.eid,
        n: exercise.n,
        sn: exercise.sn,
        r: exercise.r,
        s: exercise.s,
        d: exercise.d,
        t: exercise.t,
        de: exercise.de,
        i: exercise.i,
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