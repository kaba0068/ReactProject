import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import PeopleContext from "../PeopleContext";
import ModalComponent from "../components/Modal";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-modern-datepicker";

export default function AddPersonScreen() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const { addPerson } = useContext(PeopleContext);
  const navigation = useNavigation();

  const savePerson = () => {
    if (name && dob) {
      addPerson(name, dob);
      navigation.goBack();
    } else {
      setError("Error: Please be sure to fill in all the details");
      setModalVisible(!modalVisible);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        alignContent: "center",
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/*Inputs*/}
          <View style={styles.inputsContainer}>
            {/*Name Input*/}
            <Text>{"Name: "}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            {/*Date Input*/}
            <Text>{"Date of Birth:"}</Text>
            <DatePicker
              onSelectedChange={(selectedDate) => {
                setDob(selectedDate);
              }}
              options={{
                backgroundColor: "white",
                textHeaderColor: "black",
                textDefaultColor: "black",
                selectedTextColor: "white",
                mainColor: "#71d5eb", //arrows
                textSecondaryColor: "#777", //dow
                borderColor: "#db7d12",
              }}
              style={{
                width: "85%",
                alignSelf: "center",
                borderRadius: 10,
                padding: 20,
                marginTop: 5,
              }}
              current={"1990-01-01"}
              selected={"1990-01-15"}
              maximumDate={new Date().toDateString()}
              mode="calendar"
            ></DatePicker>
          </View>
          {/*ModalComp*/}
          <ModalComponent
            visible={modalVisible}
            setVisible={setModalVisible}
            message={error}
          />
          {/*Buttons*/}
          <View
            style={
              Platform.OS === "ios"
                ? styles.buttonsContainerIOS
                : styles.buttonsContainerAndroid
            }
          >
            <Button title="Save" color={"#5885e1"} onPress={savePerson} />
            <Button
              title="Cancel"
              color={"#8b1a10"}
              onPress={() => navigation.navigate("People")}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputsContainer: {
    flex: 1,
    padding: 5,
    gap: 5,
  },
  nameContainer: {
    flex: 1,
  },
  dateContainer: {
    flex: 1,
  },
  buttonsContainerAndroid: {
    gap: 20,
    padding: 10,
  },
  buttonsContainerIOS: {
    gap: 20,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
