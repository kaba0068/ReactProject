import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from "react-native";
import { Camera } from "expo-camera/legacy";
import PeopleContext from "../PeopleContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalComponent from "../components/Modal";

export default function AddIdeaScreen({ navigation, route }) {
  const { id } = route.params;
  const { addIdea } = useContext(PeopleContext);

  const [hasPermissions, setPermissions] = useState(null);
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [ideaText, setIdeaText] = useState("");
  const ratio = 2 / 3;
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setPermissions(status === "granted");
        if (status !== "granted") {
          setError("Error: Permission for media access required.");
        }
      } catch (e) {
        setError(`Error: ${e}`);
        setModalVisible(!modalVisible);
      }
    })();
  }, []);

  useEffect(() => {
    const screenW = Dimensions.get("window").width;
    const dynamicW = screenW * 0.6; // 60% of screen width is dynamic width
    const dynamicH = dynamicW * ratio;

    setWidth(dynamicW);
    setHeight(dynamicH);
  }, []);

  const captureImage = async () => {
    if (camera.current) {
      // Checks if the camera is initialized
      try {
        const sizes = await camera.current.getAvailablePictureSizesAsync(
          "4:3"
        );
        const options = {
          quality: 1,
          pictureSize: sizes ? sizes[1] : "1200x1800",
          imageType: "jpg",
          skipProcessing: false,
        };

        const data = await camera.current.takePictureAsync(options);
        setImage(data.uri);
      } catch (e) {
        setError(`Error: ${e.message || e}`);
        setModalVisible(!modalVisible);
      }
    } else {
      setError("Camera is not initialized or ready.");
      setModalVisible(!modalVisible);
    }
  };

  const handleSave = async () => {
    if (!ideaText || !image) {
      alert("Please provide both a name and an image.");
      return;
    }

    const newIdea = {
      id: Date.now().toString(),
      name: ideaText,
      imageUri: image,
      personId: id,
    };

    addIdea(newIdea);
    await AsyncStorage.setItem(`idea-${newIdea.id}`, JSON.stringify(newIdea));

    navigation.navigate("IdeaScreen", { id });
  };

  const handleCancel = () => {
    navigation.navigate("IdeaScreen", { id });
  };

  if (hasPermissions === null) {
    return <View />;
  }
  if (hasPermissions === false) {
    return (
      <Text>No access to camera. Please allow permissions to the camera.</Text>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          padding: 16,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-evenly",
            paddingVertical: 30,
          }}
        >
          <View style={{ gap: 20 }}>
            {image ? (
              <Image
                style={{ width: width, height: height, alignSelf: "center" }}
                source={{ uri: image }}
              />
            ) : (
              <Camera
                style={{ width: width, height: height, alignSelf: "center" }}
                ref={camera}
              />
            )}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 5,
              }}
              placeholder="Enter idea name"
              value={ideaText}
              onChangeText={setIdeaText}
            />
          </View>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={image ? () => setImage(null) : captureImage}
          >
            <Text style={styles.captureText}>
              {image ? "Retake" : "Take Picture"}
            </Text>
          </TouchableOpacity>
        </View>
        <ModalComponent
          message={error}
          visible={modalVisible}
          setVisible={setModalVisible}
        />
        <View
          style={
            Platform.OS === "ios"
              ? styles.buttonsContainerIOS
              : styles.buttonsContainerAndroid
          }
        >
          <Button title="Save" color={"#5885e1"} onPress={handleSave} />
          <Button title="Cancel" color={"#8b1a10"} onPress={handleCancel} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonsContainerAndroid: {
    gap: 20,
    padding: 10,
  },
  buttonsContainerIOS: {
    gap: 40,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  captureButton: {
    backgroundColor: "#5885e1",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  captureText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
