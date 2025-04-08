import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Animated, Modal, TouchableOpacity, Text, View, Image, SafeAreaView, Dimensions, Linking, Alert } from 'react-native';
import styles from './styles';
import { Plan, Exercise, loadPlansFromStorage } from './plans';
import initialPlans from './db';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import Icon from 'react-native-vector-icons/Ionicons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const Index = () => {
  const [planData, setPlanData] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  //camera
  const[permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [isScanning, setIsScanning] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  //settings
  const [settingsVisible, setSettingsVisible] = useState(false);


  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const memoizedPlanData = useMemo(() => planData, [planData]);

  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await loadPlansFromStorage();
      setPlanData(plans);
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (fontsLoaded && planData.length > 0) {
      // SplashScreen.hideAsync(); // Hide splash screen once data and fonts are loaded
    }
  }, [fontsLoaded, planData]);

  // If fonts aren't loaded, return null to keep the splash screen visible
  if (!fontsLoaded || planData.length === 0) {
    return null; // Splash screen remains visible
  }

  const removeExercise = (exerciseToRemove: Exercise) => {
    if (selectedPlan) {
      const updatedExercises = selectedPlan.exercises.filter(
        (exercise) => exercise.exerciseID !== exerciseToRemove.exerciseID
      );
      if (updatedExercises.length === 0) {
        // Remove the plan if there are no exercises left
        const updatedPlanData = planData.filter((plan) => plan.planName !== selectedPlan.planName);
        setPlanData(updatedPlanData);
        setSelectedPlan(null);
      } else {
        // Update the plan with the remaining exercises
        const updatedPlan = { ...selectedPlan, exercises: updatedExercises };
        const updatedPlanData = planData.map((plan) =>
          plan.planName === selectedPlan.planName ? updatedPlan : plan
        );
        setPlanData(updatedPlanData);
        setSelectedPlan(updatedPlan);
      }
    }
  };

  const removePlan = (planToRemove: Plan) => {
    const updatedPlanData = planData.filter((plan) => plan.planName !== planToRemove.planName);
    if (updatedPlanData.length === 0) {
      // Reload the default plan if no plans are left
      setPlanData(Object.values(initialPlans));
    } else {
      setPlanData(updatedPlanData);
    }
    setSelectedPlan(null);
  };

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setSelectedPlan(null);
      setModalVisible(false);
    });
  };

  const fetchPlans = async () => {
    const plans = await loadPlansFromStorage();
    setPlanData(plans);
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully!');
      setPlanData([]); // Clear the plan data from the state
      Alert.alert('Storage Cleared', 'All saved data has been cleared.');
      fetchPlans(); // Fetch plans again to ensure the UI is updated
      
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      Alert.alert('Error', 'Failed to clear storage.');
    }
  };

  const showRemovePrompt = (exercise: Exercise) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise from the plan? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removeExercise(exercise),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const showRemovePlan = (plan: Plan) => {
    Alert.alert(
      'Remove Plan',
      'Are you sure you want to remove this plan? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => removePlan(plan),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { alignItems: 'center' }]}>
          <Image source={require('./assets/images/logo.png')} style={styles.logo} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedExercise ? (
          // Display selected exercise details
          <View style={styles.nestedModalContent}>
            <Image
              source={
                typeof selectedExercise.exerciseImage === 'string'
                  ? { uri: selectedExercise.exerciseImage }
                  : selectedExercise.exerciseImage
              }
              style={styles.nestedModalImage}
            />
            <View style={styles.nestedModalDetails}>
              <Text style={styles.nestedModalTitle}>{selectedExercise.exerciseName}</Text>
              <Text style={styles.nestedModalDetailText}>{selectedExercise.description}</Text>
              <Text style={styles.nestedModalDetailText}>
                Reps: {selectedExercise.reps}, Sets: {selectedExercise.sets}
              </Text>
              <Text style={styles.nestedModalDetailText}>
                Duration: {selectedExercise.duration} seconds
              </Text>
            </View>
          </View>
        ) : selectedPlan ? (
          // Display selected plan details
          <View>
            {selectedPlan.exercises.map((exercise, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedExercise(exercise)}
                onLongPress={() => showRemovePrompt(exercise)}
              >
                <View style={styles.exerciseItem}>
                  <Image
                    source={
                      typeof exercise.exerciseImage === 'string'
                        ? { uri: exercise.exerciseImage }
                        : exercise.exerciseImage
                    }
                    style={styles.exerciseImage}
                  />
                  <Text style={styles.exerciseTitle}>{exercise.exerciseName}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Display list of plans or "No plans available" message
          memoizedPlanData.length === 0 ? (
            <Text>No plans available</Text>
          ) : (
            memoizedPlanData.map((plan, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => setSelectedPlan(plan)}
                onLongPress={() => showRemovePlan(plan)}
              >
                <Text style={styles.cardTitle}>{plan.planName}</Text>
                <Text style={styles.cardDescription}>
                  {plan.exercises.length} exercises
                </Text>
              </TouchableOpacity>
            ))
          )
        )}
      </View>
      
      {/* QR Code Scanner Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)} // Close modal on button press
            >
              <Icon name="close-circle" size={screenWidth * 0.105} color="#7874ac" />
            </TouchableOpacity>
            <CameraView
              style={styles.cameraView}
              facing='back'
              onBarcodeScanned={async ({ data }) => {
                try {
                  setIsScanning(false);
                  console.log('Scanned data:', data);
                  const parsedData = JSON.parse(data);

                  const ValidatePlan = parsedData 
                  && typeof parsedData.planName === 'string'
                  && Array.isArray(parsedData.exercises) 
                  && parsedData.exercises.every((exercise: any) =>
                    typeof exercise.exerciseImage === 'string' &&
                    typeof exercise.exerciseID === 'number' &&
                    typeof exercise.exerciseName === 'string' &&
                    typeof exercise.sequenceNum === 'number' &&
                    typeof exercise.reps === 'number' &&
                    typeof exercise.sets === 'number' &&
                    typeof exercise.duration === 'number' &&
                    typeof exercise.time === 'number' &&
                    typeof exercise.description === 'string'
                  );

                  if(ValidatePlan) {
                    const existingPlans = await AsyncStorage.getItem('plans');
                    const plans = existingPlans ? JSON.parse(existingPlans) : [];
                    plans.push(parsedData);
                    await AsyncStorage.setItem('plans', JSON.stringify(plans));
                    console.log('Plan added successfully:', parsedData);
                    setPlanData(plans);
                    Alert.alert('Plan Added', 'The scanned plan has been added successfully.');
                    setModalVisible(false);
                  } else {
                    setIsScanning(true);
                    Alert.alert('Invalid QR Code', 'The scanned QR code does not contain valid plan data.');
                  }
                } catch (error) {
                  console.error('Error parsing QR code data:', error);
                }
              }}
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.scanningBox}>
                <Image
                  source={require('./assets/images/iosicon.png')} // Ensure the path to the image is correct
                  style={styles.scanningBoxImage}
                />
                </View>
              </View>
            </CameraView>
          </View>
          
        </SafeAreaView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        transparent={true}
        visible={settingsVisible}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSettingsVisible(false)} // Close modal on button press
            >
              <Icon name="close-circle" size={screenWidth * 0.105} color="#7874ac" />
            </TouchableOpacity>
            <Text>Settings</Text>
            <TouchableOpacity
              style={[styles.barButton, { backgroundColor: '#ff4d4d', padding: 10, borderRadius: 5 }]}
              onPress={clearStorage}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Clear All Data</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.barButton} onPress={() => { setSelectedPlan(null); setSelectedExercise(null); }}>
          <Icon name="home" size={screenWidth * 0.075} color="#7874ac" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.barButton, {opacity: !isPermissionGranted ? 0.5 : 1}]}
          onPress={async () => {
            if(isPermissionGranted) {
              setModalVisible(!modalVisible);
            } else {
              const permissionResponse = await requestPermission();
              if (permissionResponse.granted) {
                setModalVisible(!modalVisible);
              } else {
                Alert.alert('Camera Permission Required', 'Please grant camera permission to use this feature.');
              }
            }
          }}
        >
          <Icon name="qr-code" size={screenWidth * 0.075} color="#7874ac" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.barButton} onPress={() => setSettingsVisible(!settingsVisible)}>
          <Icon name="construct" size={screenWidth * 0.075} color="#7874ac" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;