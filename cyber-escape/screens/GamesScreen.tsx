import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Adjust the import path as needed

type GamesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface GameCategory {
  name: string;
  games: { name: string; route: keyof RootStackParamList }[];
}

const gameCategories: GameCategory[] = [
  {
    name: "Dev",
    games: [
      { name: "Debugger", route: "Debugger" },
      { name: "AlgoHole", route: "AlgoHole" },
    ],
  },
  {
    name: "Cyber",
    games: [
      { name: "Decipher", route: "Decipher" },
      { name: "Go Fish", route: "GoFish" },
    ],
  },
  {
    name: "Net",
    games: [
      { name: "ProtoLink", route: "ProtoLink" },
      { name: "OSI", route: "OSI" },
    ],
  },
  {
    name: "IT",
    games: [
      { name: "Binary Conversion", route: "BinaryConversion" },
      { name: "Linux Quiz", route: "LinuxQuiz" },
    ],
  },
];

export default function GamesScreen() {
  const navigation = useNavigation<GamesScreenNavigationProp>();

  const navigateToGame = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  return (
    <ScrollView style={styles.container}>
      {gameCategories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          {category.games.map((game, gameIndex) => (
            <TouchableOpacity
              key={gameIndex}
              style={styles.gameButton}
              onPress={() => navigateToGame(game.route)}
            >
              <Text style={styles.gameButtonText}>{game.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  categoryContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  gameButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  gameButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});
