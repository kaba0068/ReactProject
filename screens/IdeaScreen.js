import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PeopleContext from "../PeopleContext";
import { Icon } from "react-native-elements";
import ModalComponent from "../components/Modal";

export default function IdeaScreen({ route }) {
  const { id } = route.params;
  const { addIdea } = useContext(PeopleContext);
  const { getIdeasForPerson, deleteIdea, getPersonById, setPeopleId } =
    useContext(PeopleContext);
  const navigation = useNavigation();

  const [ideas, setIdeas] = useState([]);
  const [name, setName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const ratio = 2 / 3;
  const thumbnailW = Dimensions.get("window").width * 0.3;
  const thumbnailH = thumbnailW * ratio;

  useEffect(() => {
    const loadData = async () => {
      const person = await getPersonById(id);
      setName(person.name);
      const ideas = await getIdeasForPerson(id);
      setIdeas(ideas);
      await setPeopleId(id);
    };

    loadData();
  }, []);

  const handleIdeaDelete = async (ideaId) => {
    try {
      await deleteIdea(ideaId);
    } catch (e) {
      setError(`Error: ${e}`);
      setModalVisible(!modalVisible);
    }
  };

  const renderItem = ({ item }) => {
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={{ width: thumbnailW, height: thumbnailH }}
      />
      <View
        style={{
          flex: 1,
          marginLeft: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
          }}
        >
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => handleIdeaDelete(item.id)}>
          <Icon name="delete" type="material" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>;
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Heading with person's name */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        {name}'s Gift Ideas
      </Text>
      <ModalComponent
        visible={modalVisible}
        setVisible={setModalVisible}
        message={error}
      />

      {/* Display message if there are no ideas */}
      {ideas.length === 0 ? (
        <Text>No gift ideas found. Add your first idea!</Text>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      {/* FAB to add a new idea */}
      {Platform.OS === "android" && (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            backgroundColor: "#5885e1",
            borderRadius: 30,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            return navigation.navigate("AddIdeaScreen", { id });
          }}
        >
          <Icon name="add" type="material" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
