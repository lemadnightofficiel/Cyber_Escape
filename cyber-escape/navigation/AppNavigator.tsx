import { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConnexionScreen from "../screens/ConnexionScreen";
import InscriptionScreen from "../screens/InscriptionScreen";
import MainScreen from "../screens/MainScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import DefisScreen from "../screens/DefisScreen";
import ProfilScreen from "../screens/ProfilScreen";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { View, ActivityIndicator } from "react-native";
import DetailDefiScreen from "../screens/DetailDefiScreen";

export type RootStackParamList = {
  Main: undefined;
  Leaderboard: undefined;
  Defis: undefined;
  Profil: undefined;
  Connexion: undefined;
  Inscription: undefined;
  DetailDefi: { id: number };
};

export type BottomTabParamList = {
  Main: undefined;
  Defis: undefined;
  Leaderboard: undefined;
  Profil: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: { [key in keyof BottomTabParamList]: keyof typeof MaterialCommunityIcons.glyphMap } = {
            Main: "home",
            Defis: "bullseye-arrow",
            Leaderboard: "trophy",
            Profil: "account",
          };
          return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Main" component={MainScreen} options={{ title: "Accueil" }} />
      <Tab.Screen name="Defis" component={DefisScreen} options={{ title: "Défis" }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: "Leaderboard" }} />
      <Tab.Screen name="Profil" component={ProfilScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="DetailDefi" component={DetailDefiScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
          <Stack.Screen name="Inscription" component={InscriptionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
