import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from "../lib/supabase";

type Props = StackScreenProps<RootStackParamList, "Inscription">;

export default function InscriptionScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !username) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Utilisateur introuvable après l'inscription.");

      const userId = data.user.id;

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            email: email,
            username: username,
            avatar_url: null,
            score: 0,
            updated_at: new Date(),
          },
        ]);

      if (profileError) throw profileError;

      Alert.alert(
        "Succès",
        "Compte créé avec succès ! Veuillez vérifier votre email pour confirmer votre inscription."
      );
      navigation.navigate("Connexion");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>📝 Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Créer un compte</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate("Connexion")}
      >
        <Text style={styles.linkButtonText}>Déjà un compte ? Se connecter</Text>
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
    backgroundColor: "#6200ee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
  },
  linkButtonText: {
    color: "#6200ee",
    fontSize: 16,
  },
});
