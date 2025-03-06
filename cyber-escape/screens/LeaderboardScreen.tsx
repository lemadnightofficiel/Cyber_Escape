import React, { useCallback, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from "../lib/supabase";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, "Leaderboard">;

interface Player {
  id: string;
  user_id: string;
  score: number;
  last_updated: string;
  username: string;
  avatar_url?: string;
  rank?: number;
}

export default function LeaderboardScreen({ navigation }: Props) {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [userRank, setUserRank] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeoutError, setTimeoutError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [])
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutError(true);
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  async function fetchLeaderboard() {
    try {
      setLoading(true);
      setError(null);
      setTimeoutError(false);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Vous devez être connecté pour voir le leaderboard.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("leaderboard")
        .select(`
          id,
          user_id,
          score,
          last_updated,
          profiles!inner(username, avatar_url)
        `)
        .order("score", { ascending: false });

      if (error) throw error;

      const formattedData = data.map((player, index) => ({
        id: player.id,
        user_id: player.user_id,
        score: player.score,
        last_updated: player.last_updated,
        username: player.profiles && player.profiles[0]?.username || "Joueur inconnu",
        avatar_url: player.profiles && player.profiles[0]?.avatar_url || null,
        rank: index + 1,
      }));

      setLeaderboard(formattedData);

      const currentUserRank = formattedData.findIndex(player => player.user_id === user.id);
      if (currentUserRank !== -1) {
        setUserRank({
          ...formattedData[currentUserRank],
          rank: currentUserRank + 1,
        });
      }
    } catch (err: any) {
      setError("Erreur lors du chargement du leaderboard. Réessayez.");
      console.error("❌ Erreur leaderboard :", err.message);
    } finally {
      setLoading(false);
    }
  }

  const renderPlayerItem = ({ item, index }: { item: Player; index: number }) => (
    <View style={[styles.playerContainer, index < 3 && styles.topPlayer]}>
      <Text style={styles.rank}>
        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
      </Text>
      <Image 
        style={styles.avatar}
        source={item.avatar_url ? { uri: item.avatar_url } : require('../assets/default-avatar.png')}
      />
      <Text style={styles.playerName}>{item.username}</Text>
      <Text style={styles.score}>{item.score} pts</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" />
      ) : timeoutError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Le chargement a pris trop de temps. Veuillez réessayer.</Text>
          <TouchableOpacity onPress={fetchLeaderboard} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#FF5733" />
          </TouchableOpacity>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchLeaderboard} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#FF5733" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={leaderboard}
            keyExtractor={(item) => item.id}
            renderItem={renderPlayerItem}
            contentContainerStyle={styles.list}
          />
          {userRank && userRank.rank !== undefined && (
            <View style={styles.userRankContainer}>
              <Text style={styles.userRankTitle}>Votre classement</Text>
              {renderPlayerItem({ item: userRank, index: userRank.rank - 1 })}
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F3F5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FFD700",
  },
  errorContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  errorText: {
    color: "#FF5733",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  refreshButton: {
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topPlayer: {
    backgroundColor: "#FFF9C4",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  playerName: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    fontWeight: "500",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  userRankContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 20,
  },
  userRankTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});
