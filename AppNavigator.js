import React, { useContext } from "react";
import { Text, Button, StyleSheet, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import PeopleScreen from "./screens/PeopleScreen";
import AddPersonScreen from "./screens/AddPersonScreen";
import IdeaScreen, { handleNavigate } from "./screens/IdeaScreen";
import AddIdeaScreen from "./screens/AddIdeaScreen";
import PeopleContext from "./PeopleContext";

const Stack = createStackNavigator();

export default function AppNavigator({ navigation }) {
  const { peopleId } = useContext(PeopleContext);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="People"
          component={PeopleScreen}
          options={({ navigation }) => ({
            title: "People",
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("AddPerson")}
                title="Add People"
                color="#5885e1"
              />
            ),
          })}
        />
        <Stack.Screen name="AddPerson" component={AddPersonScreen} />
        {Platform.OS === "ios" ? (
          <Stack.Screen
            name="IdeaScreen"
            component={IdeaScreen}
            options={({ navigation }) => ({
              title: "People",
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate("AddIdeaScreen", { peopleId })}
                  title="Add Idea"
                  color="#5885e1"
                />
              ),
            })}
          />
        ) : (
          <Stack.Screen name="IdeaScreen" component={IdeaScreen} />
        )}
        <Stack.Screen name="AddIdeaScreen" component={AddIdeaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

