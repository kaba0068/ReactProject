import React, { useState } from "react";
import { View, Text, Button, Modal } from "react-native";

export default function ModalComponent({ message, visible, setVisible}) {
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(!visible)}
      >
        <View
          style={{
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)" 
            }}
            >
          <View
            style={{
              top: "70%",
              margin: 10,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: 5,
              alignItems: "center",
              padding: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                marginVertical: 10,
                color: "black",
              }}
            >
              {message}
            </Text>
            <Button title="Close" color={"#5885e1"} onPress={() => setVisible(!visible)}/>
          </View>
        </View>
      </Modal>
  )
}
