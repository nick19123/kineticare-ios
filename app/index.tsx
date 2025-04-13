import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Animated,
  Modal,
  TouchableOpacity,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  Alert,
  Linking,
} from "react-native";
import styles from "./styles";
import { Plan, Exercise, loadPlansFromStorage } from "./plans";
import initialPlans from "./db";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import Icon from "react-native-vector-icons/Ionicons";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdvancedImage } from "cloudinary-react-native";
import { Cloudinary } from "@cloudinary/url-gen";
import { decode } from "base64-arraybuffer";
import "../global.css";
import Footer from "@/components/Footer";

const screenWidth = Dimensions.get("window").width;

const Index = () => {
  const [planData, setPlanData] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  //camera
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const isScanningRef = useRef(true);
  const isProcessingScan = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  //settings
  const [settingsVisible, setSettingsVisible] = useState(false);

  //images
  const cld = new Cloudinary({
    cloud: { cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME },
    url: { secure: true },
  });

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
  if (!fontsLoaded) {
    return null;
  }

  const removePlan = async (planToRemove: Plan) => {
    try {
      const existingPlans = await AsyncStorage.getItem("plans");
      let plans: Plan[] = existingPlans ? JSON.parse(existingPlans) : [];

      const indexToRemove = plans.findIndex(
        (plan) => plan.p === planToRemove.p
      );
      if (indexToRemove !== -1) {
        plans.splice(indexToRemove, 1);
      }

      const hasExercises = plans.some(
        (plan) => Array.isArray(plan.e) && plan.e.length > 0
      );

      const finalPlans = hasExercises ? plans : Object.values(initialPlans);

      await AsyncStorage.setItem("plans", JSON.stringify(finalPlans));
      setPlanData(finalPlans);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error removing plan:", error);
    }
  };

  const openModal = () => {
    setIsScanning(true);
    setModalVisible(true);
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

  const clearStorage = () => {
    Alert.prompt(
      "Reset Data",
      'Type "confirm" to remove all plans. This action cannot be undone and will require you to add plans again via the camera.',
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async (input) => {
            if (input?.toLowerCase() === "confirm") {
              try {
                await AsyncStorage.clear();
                console.log("AsyncStorage cleared successfully!");
                setPlanData([]);
                Alert.alert(
                  "Storage Cleared",
                  "All saved data has been cleared."
                );
                fetchPlans();
              } catch (error) {
                console.error("Error clearing AsyncStorage:", error);
                Alert.alert("Error", "Failed to clear storage.");
              }
            } else {
              Alert.alert("Cancelled", "Plan was not removed.");
            }
          },
          style: "destructive",
        },
      ],
      "plain-text"
    );
  };

  const showRemovePlan = (plan: Plan) => {
    Alert.alert(
      "Remove Plan",
      "Are you sure you want to remove this plan? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => removePlan(plan),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { alignItems: "center" }]}>
          <Image
            source={require("./assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {selectedExercise ? (
          // Display selected exercise details
          <View className="flex flex-column justify-center items-center mt-20">
            <AdvancedImage
              cldImg={cld
                .image(selectedExercise.i)
                .format("auto")
                .quality("auto")}
              style={{
                width: screenWidth * 0.5,
                height: screenWidth * 0.5,
                resizeMode: "contain",
              }}
            />
            <View className="flex items-center h-screen">
              <Text className="font-bold text-3xl text-[#7076af] text-left self-start ml-[5%] mb-[3%]">
                {selectedExercise.n}
              </Text>
              <View className="flex-row w-full mb-2">
                <View className="flex-row justify-center w-full mb-2">
                  <View className="flex-row items-center rounded-2xl overflow-hidden bg-[#74ac85] w-[45%]">
                    <Text className="w-[50%] p-2 bg-[#5e9670] text-white text-lg text-center font-semibold">
                      Reps
                    </Text>
                    <Text className="w-[50%] p-2 text-white font-bold text-lg text-center">
                      {selectedExercise.r}
                    </Text>
                  </View>

                  <View className="ml-[2%] flex-row items-center rounded-2xl overflow-hidden bg-[#cf935c] w-[45%]">
                    <Text className="w-[50%] p-2 bg-[#b77b4b] text-white text-lg text-center font-semibold">
                      Sets
                    </Text>
                    <Text className="w-[50%] p-2 text-white font-bold text-lg text-center">
                      {selectedExercise.s}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex flex-row justify-center items-center rounded-2xl overflow-hidden bg-[#00768c] mb-3 w-[92%]">
                <Text className="w-[50%] p-2 bg-[#006070] text-white text-lg text-center font-semibold">
                  Duration:
                </Text>
                <Text className="w-[50%] p-2 text-white font-bold text-lg text-center">
                  {selectedExercise.d}
                </Text>
              </View>

              <View className="flex flex-row justify-center items-center rounded-2xl overflow-hidden bg-[#b9633a] mb-3 w-[92%]">
                <Text className="w-[50%] p-2 bg-[#a2542f] text-white text-lg text-center font-semibold">
                  Time:
                </Text>
                <Text className="w-[50%] p-2 text-white font-bold text-lg text-center">
                  {selectedExercise.t}
                </Text>
              </View>

              <View className="flex flex-col justify-center items-center rounded-2xl overflow-hidden mb-2 w-[92%]">
                <Text className="flex p-2 italic text-white bg-gray-400 font-bold text-xl text-center rounded-2xl">
                  " {selectedExercise.de} "
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedExercise(null)}>
                <View className="flex flex-row justify-right items-center rounded-2xl overflow-hidden bg-[#793339] mb-3 w-[25%]">
                  <Text className="p-2 text-white font-bold text-lg">
                    Close
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : selectedPlan ? (
          // Display selected plan details
          <View>
            {selectedPlan.e.map((exercise, index) => {
              console.log(cld.image(exercise.i).toURL());
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedExercise(exercise)}
                >
                  <View className="flex flex-row justify-center items-center rounded-2xl overflow-hidden bg-[#74ac85] mb-2">
                    <View className="flex-1 p-2 bg-[#5e9670]">
                      <Text className="text-xl font-semibold text-white text-center">
                        {exercise.sn}
                      </Text>
                    </View>
                    <View className="flex-[2] p-2">
                      <Text className="text-xl font-semibold text-white text-center">
                        {exercise.n.length > 20
                          ? exercise.n.slice(0, 17) + "..."
                          : exercise.n}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : // Display list of plans or "No plans available" message
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
              <Text style={styles.cardTitle}>{plan.p}</Text>
              <Text style={styles.cardDescription}>
                {plan.e.length} exercises
              </Text>
            </TouchableOpacity>
          ))
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
              <Icon
                name="close-circle"
                size={screenWidth * 0.105}
                color="#7874ac"
              />
            </TouchableOpacity>
            <CameraView
              style={styles.cameraView}
              facing="back"
              onBarcodeScanned={async ({ data }) => {
                if (isProcessingScan.current) return;

                isProcessingScan.current = true;

                try {
                  const urlDecodedData = decodeURIComponent(data);
                  const decodedData = new TextDecoder().decode(
                    decode(urlDecodedData)
                  );
                  const parsedData = JSON.parse(decodedData);

                  const ValidatePlan =
                    parsedData &&
                    typeof parsedData.p === "string" &&
                    Array.isArray(parsedData.e) &&
                    parsedData.e.every(
                      (exercise: any) =>
                        (typeof exercise.i === "string" ||
                          exercise.i === null) &&
                        typeof exercise.eid === "number" &&
                        typeof exercise.n === "string" &&
                        typeof exercise.sn === "number" &&
                        (typeof exercise.r === "number" ||
                          exercise.r === null) &&
                        (typeof exercise.s === "number" ||
                          exercise.s === null) &&
                        (typeof exercise.d === "string" ||
                          exercise.d === null) &&
                        (typeof exercise.t === "string" ||
                          exercise.t === null) &&
                        (typeof exercise.de === "string" ||
                          exercise.de === null)
                    );

                  if (ValidatePlan) {
                    const existingPlans = await AsyncStorage.getItem("plans");
                    const plans = existingPlans
                      ? JSON.parse(existingPlans)
                      : [];

                    if (plans.length >= 5) {
                      Alert.alert(
                        "Plan Limit Reached",
                        "You can only have up to 5 plans."
                      );
                      return;
                    }

                    plans.push(parsedData);
                    await AsyncStorage.setItem("plans", JSON.stringify(plans));
                    setPlanData(plans);
                    setModalVisible(false);
                  } else {
                    Alert.alert(
                      "Invalid QR Code",
                      "The scanned QR code does not contain valid plan data."
                    );
                  }
                } catch (error) {
                  console.error("Error parsing QR code data:", error);
                  Alert.alert(
                    "Invalid QR Code",
                    "The scanned QR code does not contain valid plan data."
                  );
                } finally {
                  setTimeout(() => {
                    isProcessingScan.current = false;
                  }, 3000); // gives time before next scan can trigger
                }
              }}
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.scanningBox}>
                  <Image
                    source={require("./assets/images/iosicon.png")} // Ensure the path to the image is correct
                    style={styles.scanningBoxImage}
                  />
                </View>
              </View>
            </CameraView>
          </View>
          {/* Footer */}
          <Footer
            isPermissionGranted={isPermissionGranted}
            requestPermission={requestPermission}
            openModal={openModal}
            setSelectedPlan={setSelectedPlan}
            setSelectedExercise={setSelectedExercise}
            setModalVisible={setModalVisible}
            settingsVisible={settingsVisible}
            setSettingsVisible={setSettingsVisible}
          />
        </SafeAreaView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <SafeAreaView className="flex justify-center items-center h-screen bg-[#f8f8f8]">
          <View className="flex flex-row justify-center items-center mb-5">
            <TouchableOpacity
              className="flex flex-row bg-[#7076af] rounded-2xl max-w-fit h-[100%]"
              onPress={() => Linking.openURL("https://kineticare.org/about")}
            >
              <Icon
                name="information-circle"
                size={25}
                color="#ffffff"
                className="max-w-[30%] text-center ml-2 mt-2 mb-2 rounded-2xl"
              />
              <Text className="max-w-[100%] text-white font-bold text-lg mr-2 text-center p-2">
                Kineticare Info
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row justify-center items-center mb-5">
            <TouchableOpacity
              className="flex flex-row bg-[#74ac85] rounded-2xl max-w-fit h-[100%]"
              onPress={() => {}}
            >
              <Icon
                name="contrast-outline"
                size={25}
                color="#ffffff"
                className="max-w-[30%] text-center ml-2 mt-2 mb-2 rounded-2xl"
              />
              <Text className="max-w-[100%] text-white font-bold text-lg mr-2 text-center p-2">
                High Constrast
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row justify-center items-center mb-5">
            <TouchableOpacity
              className="flex flex-row bg-[#00768c] rounded-2xl max-w-fit h-[100%]"
              onPress={() => {}}
            >
              <Icon
                name="logo-apple-appstore"
                size={25}
                color="#ffffff"
                className="max-w-[30%] text-center ml-2 mt-2 mb-2 rounded-2xl"
              />
              <Text className="max-w-[100%] text-white font-bold text-lg mr-2 text-center p-2">
                Leave A Review
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row justify-center items-center mb-5">
            <TouchableOpacity
              className="flex flex-row bg-[#793339] rounded-2xl max-w-fit h-[100%]"
              onPress={clearStorage}
            >
              <Icon
                name="trash"
                size={25}
                color="#ffffff"
                className="max-w-[30%] text-center ml-2 mt-2 mb-2 rounded-2xl"
              />
              <Text className="max-w-[100%] text-white font-bold text-lg mr-2 text-center p-2">
                Reset Data
              </Text>
            </TouchableOpacity>
          </View>
          <Footer
            isPermissionGranted={isPermissionGranted}
            requestPermission={requestPermission}
            openModal={openModal}
            setSelectedPlan={setSelectedPlan}
            setSelectedExercise={setSelectedExercise}
            setModalVisible={setModalVisible}
            settingsVisible={settingsVisible}
            setSettingsVisible={setSettingsVisible}
          />
        </SafeAreaView>
      </Modal>
      <Footer
          isPermissionGranted={isPermissionGranted}
          requestPermission={requestPermission}
          openModal={openModal}
          setSelectedPlan={setSelectedPlan}
          setSelectedExercise={setSelectedExercise}
          setModalVisible={setModalVisible}
          settingsVisible={settingsVisible}
          setSettingsVisible={setSettingsVisible}
      />
    </SafeAreaView>
  );
};

export default Index;
