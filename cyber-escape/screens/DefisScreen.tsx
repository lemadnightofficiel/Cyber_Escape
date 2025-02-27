import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from "../lib/supabase";
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, "Defis">;

type Challenge = {
  id: number;
  title: string;
  category: string;
  difficulty: number;
};

export default function DefisScreen({ navigation }: Props) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const { data, error } = await supabase.from("defis").select("*");
      if (error) throw error;
      setChallenges(data as Challenge[]);
    } catch (error: any) {
      console.error("❌ Erreur lors du chargement des défis :", error.message);
    } finally {
      setLoading(false);
    }
  }

  const renderDifficultyStars = (difficulty: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Ionicons 
        key={index} 
        name={index < difficulty ? "star" : "star-outline"} 
        size={16} 
        color={index < difficulty ? "#FFD700" : "#BDC3C7"} 
      />
    ));
  };

  const renderItem = ({ item }: { item: Challenge }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate("DetailDefi", { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="flag" size={24} color="#FF5733" />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <Text style={styles.cardCategory}>📌 {item.category}</Text>
      <View style={styles.difficultyContainer}>
        {renderDifficultyStars(item.difficulty)}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔥 Défis Disponibles</Text>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F3F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F0F3F5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FF5733",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#2C3E50",
  },
  cardCategory: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
