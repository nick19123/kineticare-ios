import React from "react";
import { View, TouchableOpacity, Alert, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

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
    <View className="absolute bottom-2 left-0 right-0 px-5 py-5 flex-row justify-around items-center bg-[#f8f8f8]">
      <TouchableOpacity
        className="px-2.5 py-0 rounded-[5px]"
        onPress={() => {
          setSelectedPlan(null);
          setSelectedExercise(null);
          setModalVisible(false);
          setSettingsVisible(false);
        }}
      >
        <Icon name="home" size={screenWidth * 0.075} color="#7874ac" />
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
        <Icon name="qr-code" size={screenWidth * 0.075} color="#7874ac" />
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
        <Icon name="construct" size={screenWidth * 0.075} color="#7874ac" />
      </TouchableOpacity>
    </View>
  );
}
