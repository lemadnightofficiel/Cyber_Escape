import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = StackScreenProps<RootStackParamList, "Connexion">;

export default function ConnexionScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        console.log("✅ Session restaurée avec succès");
        await updateLastLogin(session.user.id);
        navigation.replace("Main");
        return;
      }

      console.log("🚫 Aucune session trouvée, connexion requise...");
    } catch (error: any) {
      console.error("⚠️ Erreur lors de la récupération de la session :", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLastLogin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ last_login: new Date().toISOString() })
        .eq("id", userId);

      if (error) throw error;
      console.log("✅ last_login mis à jour pour l'utilisateur :", userId);
    } catch (error: any) {
      console.error("❌ Erreur mise à jour de last_login :", error.message);
    }
  };

  const signInWithEmail = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez entrer un email et un mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      console.log("✅ Connexion réussie :", data.session?.user.id);
      await AsyncStorage.setItem("userSession", JSON.stringify(data.session));
      await updateLastLogin(data.session?.user.id);
      navigation.replace("Main");
    } catch (error: any) {
      console.error("❌ Erreur de connexion :", error.message);
      Alert.alert("Erreur", "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };
  
  const createGuestAccount = async () => {
    console.log("➡️ Connexion en tant qu'invité...");
  
    setLoading(true);
    try {
      const randomId = Math.random().toString(36).substring(2, 10);
      const guestEmail = `guest_${randomId}@example.com`;
      const guestPassword = `Guest@${Math.random().toString(36).slice(-4)}1A`;
  
      const { data, error } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
      });
  
      if (error) throw error;
  
      if (!data.user) throw new Error("Aucun utilisateur créé");
  
      console.log("✅ Compte invité créé :", data.user.id);
  
      const { error: insertError } = await supabase.from("profiles").insert({
        id: data.user.id,
        username: `Invité_${randomId}`,
        avatar_url: null,
        is_guest: true,
        updated_at: new Date().toISOString(),
      });
  
      if (insertError) throw insertError;
  
      console.log("✅ Profil invité ajouté à la base de données");
  
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: guestEmail,
        password: guestPassword,
      });
  
      if (signInError) throw signInError;
  
      console.log("✅ Invité connecté avec succès");
  
      navigation.replace("Main");
    } catch (error: any) {
      console.error("❌ Erreur lors de la création du compte invité :", error.message);
      Alert.alert("Erreur", "Impossible de créer un compte invité.");
    } finally {
      setLoading(false);
    }
  };  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>🔐 Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("Inscription")}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.guestButton}
        onPress={createGuestAccount}
        disabled={loading}
      >
        <Text style={styles.guestButtonText}>Continuer en tant qu'invité</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#6200ee",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6200ee",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#6200ee",
  },
  guestButton: {
    marginTop: 20,
  },
  guestButtonText: {
    color: "#6200ee",
    fontSize: 16,
  },
});
