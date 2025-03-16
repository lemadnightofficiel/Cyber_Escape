import React, { useState, useEffect } from 'react';
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
 SafeAreaView,
 View,
 Text,
 TouchableOpacity,
 TextInput,
 StyleSheet,
 Alert,
 ScrollView,
} from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";


type BinaryConversionScreenRouteProp = RouteProp<RootStackParamList, 'BinaryConversion'>;


type Props = {
 route: BinaryConversionScreenRouteProp;
};


export default function AlgoHoleScreen({ route }: Props) {
  const navigation = useNavigation();
  const [difficultyLevel, setDifficultyLevel] = useState(0); // Start at "Easy" which is index 1
  const [level, setLevel] = useState(1); // 1-5
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState('');
  const [answerType, setAnswerType] = useState<'binary' | 'decimal'>(
    'decimal'
  );
  const [userAnswer, setUserAnswer] = useState('');
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);


  interface LevelResult {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }


  const difficulties = [
  { name: 'Very Easy', min: 0, max: 15 },
  { name: 'Easy', min: 16, max: 31 },
  { name: 'Medium', min: 32, max: 63 },
  { name: 'Hard', min: 64, max: 127 },
  { name: 'Very Hard', min: 128, max: 255 },
  ];


  useEffect(() => {
    if (!isGameOver) {
      generateQuestion();
    }
  }, [difficultyLevel, level, isGameOver]);


  const generateQuestion = () => {
    const { min, max } = difficulties[difficultyLevel];
    let newNumber: number;


    // Generate a new number that hasn't been used yet
    do {
      newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (usedNumbers.includes(newNumber));


    setUsedNumbers([...usedNumbers, newNumber]);


    // Randomly choose to convert to binary or decimal
    if (Math.random() < 0.5) {
      // Convert decimal to binary
      setQuestion(newNumber.toString());
      setAnswerType('binary');
    } else {
      // Convert binary to decimal
      setQuestion(newNumber.toString(2));
      setAnswerType('decimal');
    }
  };

  const difficultyScores = [1, 2, 3, 4, 5]; // Corresponding to Very Easy, Easy, Medium, Hard, Very Hard

  const validateAnswer = () => {
    let correctAnswer: string;
    let isCorrect: boolean;


    if (answerType === 'binary') {
      correctAnswer = parseInt(question).toString(2);
      const normalizedUserAnswer = String(userAnswer).replace(/^0+/, '');
      isCorrect = normalizedUserAnswer === correctAnswer;
    } else {
      correctAnswer = parseInt(question, 2).toString();
      isCorrect = String(userAnswer) === correctAnswer;
    }


    setLevelResults([...levelResults,{
      question: question,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
    },]);


    if (isCorrect) {
      setScore(score + difficultyScores[difficultyLevel]);
      Alert.alert('Correct!', '', [{ text: 'OK' }]);
    } else {
      Alert.alert('Incorrect!', `The correct answer is ${correctAnswer}`, [
      { text: 'OK' },
      ]);
    }


    if (level < 5) {
      setLevel(level + 1);
      setUserAnswer('');
      generateQuestion();
    } else {
      // Move to the next difficulty or end the game
      if (difficultyLevel < difficulties.length - 1) {
        setDifficultyLevel(difficultyLevel + 1);
        setLevel(1);
        setUsedNumbers([]);
        setUserAnswer('');
      } else {
        setIsGameOver(true);
      }
    }
 };

 const goBackToMainMenu = () => {
 navigation.goBack(); // Navigate back to the previous screen
 };

 return (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={goBackToMainMenu}
      >
        <Text style={styles.backButtonText}> Go Back </Text>
      </TouchableOpacity>
      <Text style={styles.gameName}>Binary Conversion</Text>
    </View>
    {/* Difficulty Indicators */}
    <View style={styles.difficultyContainer}>
      {difficulties.map((diff, index) => (
        <View 
          key={index} 
          style={[
            styles.difficultyButton, 
            index === difficultyLevel && styles.selectedDifficulty
          ]}
        >
          <Text style={[
            styles.difficultyText,
            index === difficultyLevel && styles.selectedDifficultyText
          ]}>
            {diff.name}
          </Text>
        </View>
      ))}
    </View>
    <View style={styles.gameContent}>
      

      {!isGameOver ? (
        <>
          <Text style={styles.levelText}>
            Level: {level} / 5
          </Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.questionText}>Convert: {question}</Text>
          <Text style={styles.answerTypeText}>
            Answer in: {answerType === 'binary' ? 'Binary' : 'Decimal'}
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Enter your answer"
          />
          <TouchableOpacity style={styles.submitButton} onPress={validateAnswer}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScoreText}>Final Score: {score}</Text>
          <Text style={styles.resultsTitle}>Results:</Text>
          <ScrollView style={styles.resultsScrollView}>
            {levelResults.map((result, index) => (
              <View key={index} style={[
                styles.resultItem,
                result.isCorrect ? styles.correctResult : styles.incorrectResult
              ]}>
                <Text>
                  Question: {result.question} Convert to:{' '}
                  {isNaN(Number(result.question)) ? 'Decimal' : 'Binary'}
                </Text>
                <Text>Your Answer: {result.userAnswer}</Text>
                <Text>
                  Correct Answer: {result.correctAnswer}
                </Text>
                <Text style={result.isCorrect ? styles.correctText : styles.incorrectText}>
                  {result.isCorrect ? 'Correct!' : 'Incorrect!'}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  gameContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  difficultyButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  selectedDifficulty: {
    backgroundColor: '#6200ee',
  },
  difficultyText: {
    fontSize: 12,
    color: '#333',
  },
  selectedDifficultyText: {
    color: '#fff',
  },
  levelText: {
    fontSize: 18,
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerTypeText: {
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    width: '80%',
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
  gameOverContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  gameOverText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  finalScoreText: {
    fontSize: 22,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultsScrollView: {
    flex: 1,
    width: '100%',
  },
  resultItem: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  correctResult: {
    borderColor: 'green',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  incorrectResult: {
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  correctText: {
    color: 'green',
    fontWeight: 'bold',
  },
  incorrectText: {
    color: 'red',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
  },
});