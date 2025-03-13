import React, { useState, useEffect } from 'react';
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, FlatList } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from '@react-navigation/native';

type LinuxQuizScreenRouteProp = RouteProp<RootStackParamList, 'LinuxQuiz'>;

type Props = {
  route: LinuxQuizScreenRouteProp;
};

type Difficulty = 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Very Hard';

interface QuestionResult {
  difficulty: Difficulty;
  level: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function BinaryConversionScreen({ route }: Props) {
  const navigation = useNavigation();
  const difficulties: Difficulty[] = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
  const [currentDifficultyIndex, setCurrentDifficultyIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isBinaryToDecimal, setIsBinaryToDecimal] = useState(true);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateQuestion();
  }, [currentDifficultyIndex, level]);

  const generateQuestion = () => {
    let num: number;
    const currentDifficulty = difficulties[currentDifficultyIndex];

    do {
      switch (currentDifficulty) {
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
    } while (usedQuestions.has(num.toString()));

    setUsedQuestions(new Set(usedQuestions).add(num.toString()));
    setIsBinaryToDecimal(Math.random() < 0.5);

    if (isBinaryToDecimal) {
      setQuestion(num.toString(2).padStart(8, '0'));
      setAnswer(num.toString());
    } else {
      setQuestion(num.toString());
      setAnswer(num.toString(2).padStart(8, '0'));
    }
  };

  const checkAnswer = () => {
    let isCorrect: boolean;
    if (isBinaryToDecimal) {
      isCorrect = parseInt(userInput.trim(), 10) === parseInt(answer, 10);
    } else {
      isCorrect = parseInt(userInput.trim(), 2) === parseInt(question, 10);
    }
    const currentDifficulty = difficulties[currentDifficultyIndex];
    
    setResults([...results, {
      difficulty: currentDifficulty,
      level,
      question,
      userAnswer: userInput.trim(),
      correctAnswer: answer,
      isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
      Alert.alert("Correct!", "Great job!");
    } else {
      Alert.alert("Incorrect", `The correct answer was ${answer}`);
    }

    if (level < 5) {
      setLevel(level + 1);
    } else if (currentDifficultyIndex < difficulties.length - 1) {
      setCurrentDifficultyIndex(currentDifficultyIndex + 1);
      setLevel(1);
    } else {
      setIsGameOver(true);
    }

    setUserInput('');
    if (!isGameOver) {
      generateQuestion();
    }
  };

  if (isGameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.gameContainer}>
          <Text style={styles.endTitle}>Game Over</Text>
          <Text style={styles.finalScore}>Final Score: {score} / 25</Text>
          <FlatList
            data={results}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <Text>Difficulty: {item.difficulty}, Level: {item.level}</Text>
                <Text>Question: {item.question}</Text>
                <Text>Your Answer: {item.userAnswer}</Text>
                <Text>Correct Answer: {item.correctAnswer}</Text>
                <Text style={{ color: item.isCorrect ? 'green' : 'red' }}>
                  {item.isCorrect ? 'Correct' : 'Incorrect'}
                </Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Main Menu</Text>
      </TouchableOpacity>
      <View style={styles.difficultyContainer}>
        {difficulties.map((diff, index) => (
          <View 
            key={index} 
            style={[
              styles.difficultyButton, 
              index === currentDifficultyIndex && styles.selectedDifficulty
            ]}
          >
            <Text style={[
              styles.difficultyText,
              index === currentDifficultyIndex && styles.selectedDifficultyText
            ]}>
              {diff}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.gameContainer}>
        <Text style={styles.levelText}>Level: {level} / 5</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.questionText}>Convert: {question}</Text>
        <Text style={styles.answerFormatText}>
          Answer in: {isBinaryToDecimal ? 'Decimal' : 'Binary'}
        </Text>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
          keyboardType="numeric"
          placeholder="Enter your answer"
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
  backButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
    color: '#333',
  },
  selectedDifficultyText: {
    color: '#fff',
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
  answerFormatText: {
    fontSize: 16,
    marginBottom: 10,
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
  endTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  finalScore: {
    fontSize: 18,
    marginBottom: 20,
  },
  resultItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});