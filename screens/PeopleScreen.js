import { useContext } from "react";
import { FlatList, View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";
import { Icon } from 'react-native-elements';

export default function PeopleScreen({navigation}) {
  const { people } = useContext(PeopleContext);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text style={styles.title}>People List</Text>
        <FlatList
          style={styles.container}
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.listTitle}>{item.name}</Text>
                  <Text style={styles.listDOB}>{item.dob}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("IdeaScreen", { id: item.id })}
                >
                  <Icon name="lightbulb-outline" type="material" size={24} />
                </TouchableOpacity>
              </View>
          )}
          />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    padding: 10,
  },
  listItem: {
    flex: 1,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor:"#cdcbcc",
    margin: 5,
  },
  listTitle: {
    fontSize: 20,
  },
  listDOB: {
    fontSize: 12,
    color: "#666",
    },
});