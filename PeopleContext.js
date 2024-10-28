import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const ideas = useRef({});
  const Id = useRef();

  const PEOPLE_STORAGE_KEY = "people";
  const IDEAS_STORAGE_KEY = "idea";

  // Load people from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      const savedPeople = await AsyncStorage.getItem(PEOPLE_STORAGE_KEY);
      if (savedPeople) setPeople(JSON.parse(savedPeople));

      const savedIdeas = await AsyncStorage.getItem(IDEAS_STORAGE_KEY);
      if (savedIdeas) ideas.current = JSON.parse(savedIdeas);
    };
    loadData();
  }, []);

  const addPerson = async (name, dob) => {
    const newPerson = {
      id: randomUUID(),
      name,
      dob,
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    await AsyncStorage.setItem(
      PEOPLE_STORAGE_KEY,
      JSON.stringify(updatedPeople)
    );
  };

  const addIdea = async (newIdea) => {
    const updatedIdeas = {
      ...ideas.current,
      [newIdea.personId]: [...(ideas.current[newIdea.personId] || []), newIdea],
    };
    ideas.current = updatedIdeas;
    await AsyncStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(updatedIdeas));
  };

  const getPersonById = async (personId) => {
    return people.find((person) => person.id === personId);
  };

  const getIdeasForPerson = async (personId) => {
    return ideas.current[personId] || [];
  };

  const deleteIdea = async (personId, ideaId) => {
    const updatedIdeas = {
      ...ideas.current,
      [personId]: ideas.current[personId].filter((idea) => idea.id !== ideaId),
    };
    ideas.current = updatedIdeas;
    await AsyncStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(updatedIdeas));
  };
  const peopleId = Id.current;

  const setPeopleId = async (id) => {
    return (Id.current = id);
  };

  return (
    <PeopleContext.Provider
      value={{
        people,
        peopleId,
        setPeopleId,
        addPerson,
        addIdea,
        getIdeasForPerson,
        getPersonById,
        deleteIdea,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};

export default PeopleContext;
