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
import {getCodeSnippet} from "../lib/CodeSnippets"

type DebuggerScreenRouteProp = RouteProp<RootStackParamList, 'Debugger'>;

type Props = {
    route: DebuggerScreenRouteProp;
};

interface LevelResult {
    question: string;
    userAnswerLine: string;
    userAnswerChar: string;
    correctAnswerLine: number;
    correctAnswerChar: string;
    isCorrect: boolean;
}

export default function DebuggerScreen({ route }: Props) {
    const navigation = useNavigation();
    const [difficultyLevel, setDifficultyLevel] = useState(0); // Very Easy
    const [level, setLevel] = useState(1); // 1-5
    const [score, setScore] = useState(0);
    const [question, setQuestion] = useState('');
    const [correctAnswerLine, setCorrectAnswerLine] = useState<number>(0);
    const [correctAnswerChar, setCorrectAnswerChar] = useState<string>('');
    const [userAnswerLine, setUserAnswerLine] = useState('');
    const [userAnswerChar, setUserAnswerChar] = useState('');
    const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
    const [levelResults, setLevelResults] = useState<LevelResult[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);

    const difficulties = [
        { name: 'Very Easy', language: 'javascript' },
        { name: 'Easy', language: 'golang' },
        { name: 'Medium', language: 'php' },
        { name: 'Hard', language: 'java' },
        { name: 'Very Hard', language: 'c++' },
    ];

    const [currentLanguage, setCurrentLanguage] = useState(difficulties[0].language);

    useEffect(() => {
        if (!isGameOver) {
            generateQuestion();
        }
    }, [difficultyLevel, level, isGameOver]);

    useEffect(() => {
        setCurrentLanguage(difficulties[difficultyLevel].language);
    }, [difficultyLevel]);

    const generateQuestion = () => {
        const language = difficulties[difficultyLevel].language;
        const { code, errorLine, errorChar } = getCodeSnippet(language, usedQuestions);

        setQuestion(code);
        setCorrectAnswerLine(errorLine);
        setCorrectAnswerChar(errorChar);
        setUsedQuestions([...usedQuestions, code]);
    };

    const difficultyScores = [1, 2, 3, 4, 5];

    const validateAnswer = () => {
        const isCorrect =
            parseInt(userAnswerLine, 10) === correctAnswerLine &&
            userAnswerChar === correctAnswerChar;

        setLevelResults([...levelResults, {
            question: question,
            userAnswerLine: userAnswerLine,
            userAnswerChar: userAnswerChar,
            correctAnswerLine: correctAnswerLine,
            correctAnswerChar: correctAnswerChar,
            isCorrect: isCorrect,
        }]);

        if (isCorrect) {
            setScore(score + difficultyScores[difficultyLevel]);
            Alert.alert('Correct!', '', [{ text: 'OK' }]);
        } else {
            Alert.alert(
                'Incorrect!',
                `The correct answer was line ${correctAnswerLine} and character ${correctAnswerChar}`,
                [{ text: 'OK' }]
            );
        }

        if (level < 5) {
            setLevel(level + 1);
            setUserAnswerLine('');
            setUserAnswerChar('');
            generateQuestion();
        } else {
            if (difficultyLevel < difficulties.length - 1) {
                setDifficultyLevel(difficultyLevel + 1);
                setLevel(1);
                setUsedQuestions([]);
                setUserAnswerLine('');
                setUserAnswerChar('');
            } else {
                setIsGameOver(true);
            }
        }
    };

    const goBackToMainMenu = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBackToMainMenu}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
                <Text style={styles.gameName}>Debugger</Text>
            </View>

            {/* Difficulty Indicators */}
            <View style={styles.difficultyContainer}>
                {difficulties.map((diff, index) => (
                    <View
                        key={index}
                        style={[
                            styles.difficultyButton,
                            index === difficultyLevel && styles.selectedDifficulty,
                        ]}
                    >
                        <Text
                            style={[
                                styles.difficultyText,
                                index === difficultyLevel && styles.selectedDifficultyText,
                            ]}
                        >
                            {diff.name}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.gameContent}>
                {!isGameOver ? (
                    <>
                        <Text style={styles.levelText}>Level: {level} / 5</Text>
                        <Text style={styles.scoreText}>Score: {score}</Text>
                        <Text style={styles.languageText}>Language: {currentLanguage}</Text>

                        <ScrollView
                            horizontal={true}
                            style={styles.codeBlock}
                        >
                            <Text selectable style={styles.codeText}>
                                {question}
                            </Text>
                        </ScrollView>

                        <TextInput
                            style={styles.input}
                            keyboardType="number-pad"
                            value={userAnswerLine}
                            onChangeText={setUserAnswerLine}
                            placeholder="Enter line number with the error"
                        />
                        <TextInput
                            style={styles.input}
                            value={userAnswerChar}
                            onChangeText={setUserAnswerChar}
                            placeholder="Enter missing/incorrect character"
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
                                        Question:
                                    </Text>
                                    <Text>{result.question}</Text>
                                    <Text>Your Answer Line: {result.userAnswerLine}</Text>
                                    <Text>Your Answer Char: {result.userAnswerChar}</Text>
                                    <Text>
                                        Correct Answer Line: {result.correctAnswerLine}
                                    </Text>
                                    <Text>
                                        Correct Answer Char: {result.correctAnswerChar}
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
        paddingTop: 20,
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
        languageText: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    levelText: {
        fontSize: 18,
        marginBottom: 5,
    },
    scoreText: {
        fontSize: 18,
        marginBottom: 15,
    },
    codeBlock: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f0f0f0',
    },
    codeText: {
        fontSize: 14,
        fontFamily: 'Courier New',
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
