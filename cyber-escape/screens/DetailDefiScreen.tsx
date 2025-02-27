import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type DetailDefiScreenRouteProp = RouteProp<RootStackParamList, 'DetailDefi'>;

type Props = {
  route: DetailDefiScreenRouteProp;
};

export default function DetailDefiScreen({ route }: Props) {
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails du défi</Text>
      <Text>ID du défi : {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
