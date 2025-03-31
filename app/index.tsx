import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Animated, Modal, TouchableOpacity, Text, View, Image, SafeAreaView, Dimensions, Linking, Alert } from 'react-native';
import styles from './styles';
import { Plan, Exercise, loadPlansFromStorage } from './plans';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import Icon from 'react-native-vector-icons/Ionicons';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;


const Index = () => {

  const [planData, setPlanData] = useState<{ [key: number]: Plan }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [nestedModalVisible, setNestedVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const nestedAnimation = useRef(new Animated.Value(0)).current;



  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
    if (fontsLoaded && Object.keys(planData).length > 0) {
      //SplashScreen.hideAsync(); // Hide splash screen once data and fonts are loaded
    }
  }, [fontsLoaded, planData]);

  // If fonts aren't loaded, return null to keep the splash screen visible
  if (!fontsLoaded || Object.keys(planData).length === 0) {
    return null; // Splash screen remains visible
  }

  const removeExercise = (exerciseToRemove: Exercise) => {
    if (selectedPlan) {
      const updatedExercises = selectedPlan.exercises.filter(exercise => exercise !== exerciseToRemove);
      if (updatedExercises.length === 0) {
        // Remove the plan if there are no exercises left
        const updatedPlanData = { ...planData };
        delete updatedPlanData[selectedPlan.id];
        setPlanData(updatedPlanData);
        setSelectedPlan(null);
        setModalVisible(false);
      } else {
        // Update the plan with the remaining exercises
        const updatedPlan = { ...selectedPlan, exercises: updatedExercises };
        const updatedPlanData = { ...planData, [selectedPlan.id]: updatedPlan };
        setPlanData(updatedPlanData);
        setSelectedPlan(updatedPlan);
      }
    }
  };

  const removePlan = (planToRemove: Plan) => {
    const updatedPlanData = { ...planData };
    delete updatedPlanData[planToRemove.id];
    setPlanData(updatedPlanData);
    setModalVisible(false);
  };

  const showRemovePrompt = (exercise: Exercise) => {
    Alert.alert(
      "Remove Exercise",
      "Are you sure you want to remove this exercise from the plan? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () => removeExercise(exercise),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const showRemovePlan = (plan: Plan) => {
    Alert.alert(
      "Remove Plan",
      "Are you sure you want to remove this plan? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () => removePlan(plan),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
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

  const openNestedModal = (exercise: Exercise) => {
    console.log('Opening nested modal for exercise:', exercise);
    setSelectedExercise(exercise);
    setModalVisible(false);
    setNestedVisible(true);
    Animated.timing(nestedAnimation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeNestedModal = () => {
    Animated.timing(nestedAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setSelectedExercise(null);
      setNestedVisible(false);
      setModalVisible(true);
    });
  };

  const modalStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight, 0],
        }),
      },
    ],
  };

  const nestedModalStyle = {
    transform: [
      {
        translateY: nestedAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [screenHeight, 0],
        }),
      },
    ],
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.logoContainer, { alignItems: 'center' }]}>
          <Image 
            source={require('./assets/images/logo.png')}
            style={styles.logo}
          />
          <TouchableOpacity style={styles.closeButton}>
              <Icon name="camera-outline" size={screenWidth*0.10} color="#7874ac" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {Object.keys(memoizedPlanData).length === 0 ? (
          <Text>No plans available</Text>
        ) : (
          Object.values(planData).map((plan, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => openModal(plan)} onLongPress={() => showRemovePlan(plan)}>
              <Text style={styles.cardTitle}>{plan.pName}</Text>
              <Text style={styles.cardDescription}>{plan.pInfo}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, modalStyle]}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="chevron-down-circle" size={screenWidth*0.10} color="#7874ac" />
            </TouchableOpacity>
            {selectedPlan && (
              <>
                {selectedPlan.exercises.map((exercise, index) => (
                  <TouchableOpacity key={index} onPress={() => openNestedModal(exercise)} onLongPress={() => showRemovePrompt(exercise)}>
                    <View style={styles.exerciseItem}>
                      <Image source={typeof exercise.image === 'string' ? { uri: exercise.image } : exercise.image} style={styles.exerciseImage} />
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </Animated.View>
        </SafeAreaView>
      </Modal>

      <Modal
        transparent={true}
        visible={nestedModalVisible}
        onRequestClose={closeNestedModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, nestedModalStyle]}>
            <TouchableOpacity style={styles.closeButton} onPress={closeNestedModal}>
              <Icon name="chevron-down-circle" size={screenWidth*0.10} color="#7874ac" />
            </TouchableOpacity>
            {selectedExercise && (
              <View style={styles.nestedModalContent}>
                {selectedExercise.link ? (
                  <TouchableOpacity onPress={() => selectedExercise.link && handleLinkPress(selectedExercise.link)}>
                    <Image 
                      source={typeof selectedExercise.image === 'string' ? { uri: selectedExercise.image } : selectedExercise.image} 
                      style={styles.nestedModalImage} 
                    />
                    <View style={styles.grayBlob}>
                      <Text style={styles.grayBlobText}>Press to watch a demo!</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Image 
                    source={typeof selectedExercise.image === 'string' ? { uri: selectedExercise.image } : selectedExercise.image} 
                    style={styles.nestedModalImage} 
                  />
                )}
                <View style={styles.nestedModalDetails}>
                  <Text style={styles.nestedModalTitle}>{selectedExercise.title}</Text>
                  <View style={styles.nestedModalDetailBox}>
                    <Text style={styles.nestedModalDetailText}>{selectedExercise.description}</Text>
                  </View>
                  <View style={styles.nestedModalDetail}>
                    <Text style={styles.nestedModalDetailText}>Number of repetitions to perform: </Text>
                    <Text style={styles.nestedModalDetailReps}>{selectedExercise.reps}</Text>
                  </View>
                  <View style={styles.nestedModalDetail}>
                    <Text style={styles.nestedModalDetailText}>How long to hold the exercise: </Text>
                    <Text style={styles.nestedModalDetailReps}>{selectedExercise.hold}</Text>
                  </View>
                  <View style={styles.nestedModalDetail}>
                    <Text style={styles.nestedModalDetailText}>How many sets of this exercise: </Text>
                    <Text style={styles.nestedModalDetailReps}>{selectedExercise.complete}</Text>
                  </View>
                  <View style={styles.nestedModalDetail}>
                    <Text style={styles.nestedModalDetailText}>How many times to do this exercise: </Text>
                    <Text style={styles.nestedModalDetailReps}>{selectedExercise.perform}</Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </SafeAreaView>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>www.kineticare.org</Text>
      </View>
    </SafeAreaView>
  );
};

export default Index;