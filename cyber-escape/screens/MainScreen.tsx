import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Card, Title, Paragraph, Button, Avatar, Text } from "react-native-paper";
import { supabase } from "../lib/supabase";

interface UserData {
  username: string;
  score: number;
}

export default function MainScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      setError(null);

      // Récupération de l'utilisateur authentifié
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        throw new Error("Utilisateur non connecté.");
      }

      const userId = authData.user.id;
      console.log("✅ Utilisateur connecté :", userId);

      // Requête pour récupérer les infos du profil
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username, score")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        console.error("❌ Aucun profil utilisateur trouvé.");
        throw new Error("Aucun profil utilisateur trouvé. Contactez le support.");
      }

      setUser(profile);
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Erreur:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("👋 Déconnexion réussie !");
    } catch (err: any) {
      console.error("❌ Erreur de déconnexion :", err.message);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Button mode="contained" onPress={fetchUserData} style={styles.retryButton}>
          Réessayer
        </Button>
        <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
          Se déconnecter
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Card style={styles.profileCard}>
          <Card.Title
            title={`Bienvenue, ${user?.username || "Invité"}`}
            subtitle={`Points: ${user?.score ?? 0}`}
            left={(props) => <Avatar.Icon {...props} icon="account" />}
          />
        </Card>

        <Title style={styles.sectionTitle}>Défis du jour</Title>
        <Card style={styles.challengeCard}>
          <Card.Content>
            <Title>Défi Cryptographie</Title>
            <Paragraph>Déchiffrez le code secret</Paragraph>
          </Card.Content>
        </Card>

        <Title style={styles.sectionTitle}>Défis hebdomadaires</Title>
        <Card style={styles.challengeCard}>
          <Card.Content>
            <Title>Quiz Réseau</Title>
            <Paragraph>Testez vos connaissances en réseau</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 10,
    borderColor: "#6200ee",
    borderWidth: 1,
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  challengeCard: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
});
