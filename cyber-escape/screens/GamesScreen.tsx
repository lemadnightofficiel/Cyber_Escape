import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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
    ],
  },
  {
    name: "Cyber",
    games: [
      { name: "Decipher", route: "Decipher" },
    ],
  },
  {
    name: "Net",
    games: [
      { name: "ProtoQuiz", route: "ProtoQuiz" },
    ],
  },
  {
    name: "IT",
    games: [
      { name: "Binary Conversion", route: "BinaryConversion" },
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
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Games Menu</Text>
        <Text style={styles.headerSubtitle}>Explore categories and play exciting games!</Text>
      </View>

      {/* Game Categories */}
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
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6200ee',
  },
  gameButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  gameButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
