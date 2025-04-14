import React from "react";
import { View, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

export default function Footer({
  isPermissionGranted,
  requestPermission,
  openModal,
  setSelectedPlan,
  setSelectedExercise,
  setModalVisible,
  settingsVisible,
  setSettingsVisible,
}: {
  isPermissionGranted: boolean;
  requestPermission: () => Promise<{ granted: boolean }>;
  openModal: () => void;
  setSelectedPlan: (value: any) => void;
  setSelectedExercise: (value: any) => void;
  setModalVisible: (value: boolean) => void;
  settingsVisible: boolean;
  setSettingsVisible: (value: boolean) => void;
}) {
  const handleQrPress = async () => {
    if (isPermissionGranted) {
      openModal();
    } else {
      const permissionResponse = await requestPermission();
      if (permissionResponse.granted) {
        openModal();
      } else {
        Alert.alert(
          "Camera Permission Required",
          "Please grant camera permission to use this feature."
        );
      }
    }
  };

  return (
    <View
    style={{
      position: "absolute",
      bottom: 0, // Position it at the bottom of the screen
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: "#f8f8f8",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    }}
    >
      <TouchableOpacity
        className="px-2.5 py-0 rounded-[5px]"
        onPress={() => {
          setSelectedPlan(null);
          setSelectedExercise(null);
          setModalVisible(false);
          setSettingsVisible(false);
        }}
      >
        <Ionicons name="home" size={screenWidth * 0.075} color="#7874ac" />
      </TouchableOpacity>

      <TouchableOpacity
        className={`px-2.5 py-0 rounded-[5px] ${
          !isPermissionGranted ? "opacity-50" : "opacity-100"
        }`}
        onPress={() => {
          setSelectedPlan(null);
          setSelectedExercise(null);
          setSettingsVisible(false);
          handleQrPress();
        }}
      >
        <Ionicons name="qr-code" size={screenWidth * 0.075} color="#7874ac" />
      </TouchableOpacity>

      <TouchableOpacity
        className="px-2.5 py-0 rounded-[5px]"
        onPress={() => {
          setSelectedPlan(null);
          setSelectedExercise(null);
          setModalVisible(false);
          setSettingsVisible(true);
        }}
      >
        <Ionicons name="construct" size={screenWidth * 0.075} color="#7874ac" />
      </TouchableOpacity>
    </View>
  );
}
