import React, { useState, useEffect } from 'react';
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";

type DebuggerScreenRouteProp = RouteProp<RootStackParamList, 'Debugger'>;

type Props = {
  route: DebuggerScreenRouteProp;
};

type Difficulty = 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

export default function DebuggerScreen({ route }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, [difficulty, level]);

  const generateQuestion = () => {
    const isBinaryToDecimal = Math.random() < 0.5;
    let num: number;

    switch (difficulty) {
      case 'Very Easy':
        num = Math.floor(Math.random() * 16); // 0-15
        break;
      case 'Easy':
        num = Math.floor(Math.random() * 32); // 0-31
        break;
      case 'Medium':
        num = Math.floor(Math.random() * 64); // 0-63
        break;
      case 'Hard':
        num = Math.floor(Math.random() * 128); // 0-127
        break;
      case 'Very Hard':
        num = Math.floor(Math.random() * 256); // 0-255
        break;
    }

    if (isBinaryToDecimal) {
      setQuestion(num.toString(2).padStart(8, '0'));
      setAnswer(num.toString());
    } else {
      setQuestion(num.toString());
      setAnswer(num.toString(2).padStart(8, '0'));
    }
  };

  const checkAnswer = () => {
    if (userInput === answer) {
      setScore(score + 1);
      setLevel(level + 1);
      setUserInput('');
      generateQuestion();
    } else {
      // Handle incorrect answer
    }
  };

  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setLevel(1);
    setScore(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.difficultyContainer}>
        {['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'].map((diff) => (
          <TouchableOpacity
            key={diff}
            style={[styles.difficultyButton, difficulty === diff && styles.selectedDifficulty]}
            onPress={() => changeDifficulty(diff as Difficulty)}
          >
            <Text style={styles.difficultyText}>{diff}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.gameContainer}>
        <Text style={styles.levelText}>Level: {level}</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.questionText}>Convert: {question}</Text>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.submitButton} onPress={checkAnswer}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  difficultyButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  selectedDifficulty: {
    backgroundColor: '#007AFF',
  },
  difficultyText: {
    fontSize: 12,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 18,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
