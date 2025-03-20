import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import { Avatar } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Profil">;

interface UserData {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
}

const theme = {
  primary: '#6200ee',
  background: '#F0F4F8',
  text: '#333333',
  error: '#FF4D4F',
};

export default function ProfilScreen({ navigation }: Props) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData?.user) throw new Error("Utilisateur non trouvé.");
  
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, email, username, avatar_url")
        .eq("id", authData.user.id)
        .single();
      if (userError) throw userError;
  
      setUser(userData);
      setNewUsername(userData.username);
      setNewEmail(userData.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  async function updateProfile(field: string, value: string) {
    if (!user) return;
    try {
      setUpdating(true);
      let updateData: any = { [field]: value };
      if (field === 'email' || field === 'password') {
        if (field === 'password' && value !== confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        const { data, error } = await supabase.auth.updateUser(updateData);
        if (error) throw error;
        if (field === 'email') {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ email: value })
            .eq('id', user.id);
          if (profileError) throw profileError;
        }
      } else {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
        if (error) throw error;
      }
      setUser((prevUser) => ({ ...prevUser!, ...updateData }));
      Alert.alert("Succès", `${field} mis à jour !`);
      fetchUser();
      if (field === 'email' || field === 'password') {
        const { data: session } = await supabase.auth.getSession();
        if (!session) {
          navigation.replace("Connexion");
        }
      }
    } catch (error: any) {
      Alert.alert("Erreur", `Impossible de mettre à jour ${field}: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  }
  
  async function updateAvatar() {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });    
    if (result.canceled) return;
  
    const file = result.assets[0];
    const filePath = `avatars/${user.id}.jpg`;
    
    const response = await fetch(file.uri);
    const blob = await response.blob();
  
    try {
      setUpdating(true);
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, { upsert: true });
      
      if (uploadError) throw uploadError;
  
      const { data: avatarData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await updateProfile("avatar_url", avatarData.publicUrl);
      fetchUser();
    } catch (error: any) {
      Alert.alert("Erreur", `Impossible de mettre à jour l'avatar: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigation.replace("Connexion");
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>👤 Profil</Text>
        <TouchableOpacity onPress={updateAvatar} style={styles.avatarContainer}>
          {user?.avatar_url ? (
            <Avatar.Image 
              size={120} 
              source={{ uri: user.avatar_url }} 
            />
          ) : (
            <Avatar.Icon size={120} icon="account" style={{ backgroundColor: theme.primary }} />
          )}
        </TouchableOpacity>
        <TextInput 
          style={styles.input} 
          value={newEmail} 
          onChangeText={setNewEmail} 
          placeholder="Nouvel email" 
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => updateProfile("email", newEmail)}
          disabled={updating}
        >
          <Text style={styles.buttonText}>
            {updating ? "Mise à jour..." : "Modifier l'email"}
          </Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.input} 
          value={newPassword} 
          onChangeText={setNewPassword} 
          placeholder="Nouveau mot de passe" 
          secureTextEntry 
        />
        <TextInput 
          style={styles.input} 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
          placeholder="Confirmer le mot de passe" 
          secureTextEntry 
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => updateProfile("password", newPassword)}
          disabled={updating || newPassword !== confirmPassword}
        >
          <Text style={styles.buttonText}>
            {updating ? "Mise à jour..." : "Changer le mot de passe"}
          </Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.input} 
          value={newUsername} 
          onChangeText={setNewUsername} 
          placeholder="Nouveau pseudo" 
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => updateProfile("username", newUsername)}
          disabled={updating}
        >
          <Text style={styles.buttonText}>
            {updating ? "Mise à jour..." : "Enregistrer le pseudo"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background,
    paddingTop: 25,
    padding: 20,
  },
  scrollView: { 
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: theme.text, 
    marginBottom: 30,
    textAlign: 'center',
  },
  avatarContainer: { 
    alignItems: 'center', 
    marginBottom: 30,
  },
  input: { 
    width: '100%', 
    borderWidth: 1, 
    borderColor: theme.primary, 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: { 
    backgroundColor: theme.error, 
    marginTop: 30, 
  },
  errorText: { 
    color: theme.error, 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 10 
  },
});
