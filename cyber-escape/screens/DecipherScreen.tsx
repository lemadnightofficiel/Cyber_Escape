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
  Modal,
} from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from '../lib/supabase';

type DecipherScreenRouteProp = RouteProp<RootStackParamList, 'Decipher'>;

type Props = {
  route: DecipherScreenRouteProp;
};

interface HelpModalProps {
  isVisible: boolean;
  onClose: () => void;
  cipherType: string;
  caesarShift: number;
}

const HelpModal: React.FC<HelpModalProps> = ({ isVisible, onClose, cipherType, caesarShift }) => {
  const [customShift, setCustomShift] = useState(caesarShift);

  const getCipherHelp = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    switch (cipherType) {
      case 'Numbers to Letters':
        return alphabet.split('').reduce((acc: string[][], char, index) => {
          const mapping = `${char.toUpperCase()}: ${index + 1}`;
          const column = index % 4; // Distribute across 4 columns
          acc[column].push(mapping);
          return acc;
        }, [[], [], [], []]); // Initialize 4 columns
      case 'Reverse Alphabet':
        return alphabet.split('').reduce((acc: string[][], char, index) => {
          const mapping = `${char.toUpperCase()}: ${alphabet[25 - index].toUpperCase()}`;
          const column = index % 4;
          acc[column].push(mapping);
          return acc;
        }, [[], [], [], []]);
      case 'ROT13':
        return alphabet.split('').reduce((acc: string[][], char, index) => {
          const mapping = `${char.toUpperCase()}: ${alphabet[(index + 13) % 26].toUpperCase()}`;
          const column = index % 4;
          acc[column].push(mapping);
          return acc;
        }, [[], [], [], []]);
      case 'Morse Code':
        const morseAlphabet: {[key: string]: string} = {
          'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
          'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
          'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
          's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
          'y': '-.--', 'z': '--..'
        };
        return Object.entries(morseAlphabet).reduce((acc: string[][], [char, code], index) => {
          const mapping = `${char.toUpperCase()}: ${code}`;
          const column = index % 4;
          acc[column].push(mapping);
          return acc;
        }, [[], [], [], []]);
      case 'Caesar Cipher':
        return alphabet.split('').reduce((acc: string[][], char, index) => {
          const mapping = `${char.toUpperCase()}: ${alphabet[(index + Number(customShift)) % 26].toUpperCase()}`;
          const column = index % 4;
          acc[column].push(mapping);
          return acc;
        }, [[], [], [], []]);
      default:
        return [[], [], [], []];
    }
  };

  const cipherHelp = getCipherHelp();

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{cipherType} Help</Text>
          {cipherType === 'Caesar Cipher' && (
            <>
              <TextInput
                style={styles.shiftInput}
                keyboardType="number-pad"
                value={customShift.toString()}
                onChangeText={(text) => setCustomShift(parseInt(text) || 0)}
                placeholder="Enter shift"
              />
              <Text>Shift Value: {customShift}</Text>
            </>
          )}
          <ScrollView contentContainerStyle={styles.helpScroll}>
            {cipherHelp.map((column, columnIndex) => (
              <View key={columnIndex} style={styles.helpColumn}>
                {column.map((mapping, index) => (
                  <Text key={index} style={styles.helpText}>{mapping}</Text>
                ))}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function DecipherScreen({ route }: Props) {
  const navigation = useNavigation();
  const [difficultyLevel, setDifficultyLevel] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [cipherType, setCipherType] = useState('');
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [caesarShift, setCaesarShift] = useState(0);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

  interface LevelResult {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    cipherType: string;
  }

  const difficulties = [
    { name: 'Very Easy', cipher: 'Numbers to Letters' },
    { name: 'Easy', cipher: 'Reverse Alphabet' },
    { name: 'Medium', cipher: 'ROT13' },
    { name: 'Hard', cipher: 'Morse Code' },
    { name: 'Very Hard', cipher: 'Caesar Cipher' },
  ];

  const sentences = ["homme", "mari", "femme", "jour", "mer", "temps", "main", "chose", "vie", "yeux", "heure", "monde", "enfant", "fois", "moment", "tete", "pere", "fille", "coeur", "an", "terre", "dieu", "monsieur", "voix", "maison", "coup", "air", "mot", "nuit", "eau", "ami", "porte", "amour", "pied", "gens", "nom", "pays", "ciel", "frere", "regard", "cote", "mort", "esprit", "ville", "rue", "soir", "chambre", "pas", "soleil", "roi", "etat", "corps", "bras", "place", "parti", "annee", "visage", "bruit", "lettre", "franc", "fond", "force", "effet", "milieu", "saint", "idee", "travail", "lumiere", "mois", "fils", "raison", "point", "personne", "peuple", "fait", "parole", "guerre", "pensee", "affaire", "matin", "pierre", "vent", "doute", "front", "ombre", "part", "maitre", "besoin", "question", "peine", "tour", "famille", "madame", "sorte", "figure", "droit", "bout", "lieu", "silence", "chef", "bois", "histoire", "feu", "partie", "face", "mouvement", "fin", "route", "livre", "arbre", "cas", "mur", "ordre", "est", "bonheur", "interet", "argent", "cause", "travers", "grand", "instant", "facon", "oeil", "forme", "chemin", "cheveu", "plaisir", "suite", "sang", "sentiment", "fleur", "service", "table", "paix", "moyen", "lit", "voiture", "etre", "nature", "or", "pouvoir", "nouveau", "joie", "president", "bouche", "petit", "sens", "cri", "espece", "cheval", "loi", "ministre", "societe", "politique", "oreille", "fenetre", "fortune", "compte", "champ", "manier", "action", "garcon", "exemple", "couleur", "papier", "mal", "piece", "montagne", "sol", "oeuvre", "cours", "desir", "cour", "douleur", "salle", "premier", "projet", "etude", "journal", "geste", "situation", "oiseau", "siecle", "million", "prix", "groupe", "centre", "malheur", "honneur", "garde", "probleme", "larme", "chien", "peau", "reste", "nombre", "mesure", "article", "vue", "age", "systeme", "long", "effort", "reve", "passion", "rapport", "soldat", "levre", "signe", "verite", "mariage", "plan", "dos", "marche", "souvenir", "dame", "conseil", "sou", "coin", "jardin", "doigt", "objet", "fer", "lendemain", "train", "papa", "valeur", "jeu", "secret", "haut", "vieillard", "docteur", "ton", "jambe", "endroit", "minute", "nuage", "presence", "epaule", "feuille", "liberte", "journee", "avenir", "sourire", "resultat", "hotel", "semaine", "foret", "qualite", "prince", "bien", "medecin", "volonte", "seigneur", "art", "foule", "ligne", "interieur", "beaute", "soin", "hasard", "condition", "classe", "voyage", "present"];
  
  useEffect(() => {
    if (!isGameOver) {
      generateQuestion();
    }
  }, [difficultyLevel, level, isGameOver]);

  const restoreSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        console.log("✅ Session restored successfully");
        return session.user.id; 
      }

      console.log("🚫 No session found. Login required.");
      Alert.alert("Error", "No active session found. Please log in again.");
      return null;
    } catch (error: any) {
      console.error("⚠️ Error restoring session:", error.message);
      Alert.alert("Error", "Failed to restore session.");
      return null;
    } finally {

    }
  };

  const generateQuestion = () => {
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)].toLowerCase();
    setCipherType(difficulties[difficultyLevel].cipher);
    
    let encryptedSentence = '';
    switch (difficultyLevel) {
      case 0: // Very Easy: Numbers to Letters
        encryptedSentence = numbersToLetters(randomSentence).toUpperCase();
        break;
      case 1: // Easy: Reverse Alphabet
        encryptedSentence = reverseAlphabet(randomSentence).toUpperCase();
        break;
      case 2: // Medium: ROT13
        encryptedSentence = rot13(randomSentence).toUpperCase();
        break;
      case 3: // Hard: Morse Code
        encryptedSentence = morseCode(randomSentence).toUpperCase();
        break;
      case 4: // Very Hard: Caesar Cipher
        const shift = Math.floor(Math.random() * 25) + 1;
        setCaesarShift(shift);
        encryptedSentence = caesarCipher(randomSentence, shift).toUpperCase();
        break;
    }
    
    setQuestion(encryptedSentence);
  };

  const numbersToLetters = (text: string) => {
    return text.split('').map(char => char === ' ' ? ' ' : (char.charCodeAt(0) - 96).toString()).join(' ');
  };

  const reverseAlphabet = (text: string) => {
    return text.split('').map(char => {
      if (char === ' ') return ' ';
      const code = char.charCodeAt(0);
      return String.fromCharCode(219 - code);
    }).join('');
  };

  const rot13 = (text: string) => {
    return text.split('').map(char => {
      if (char === ' ') return ' ';
      const code = char.charCodeAt(0);
      return String.fromCharCode(((code - 97 + 13) % 26) + 97);
    }).join('');
  };

  const morseCode = (text: string) => {
    const morseAlphabet: {[key: string]: string} = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
      'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
      'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
      's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..', ' ': '/'
    };
    return text.split('').map(char => morseAlphabet[char] || char).join(' ');
  };

  const caesarCipher = (text: string, shift: number) => {
    return text.split('').map(char => {
      if (char === ' ') return ' ';
      const code = char.charCodeAt(0);
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }).join('');
  };

  const validateAnswer = () => {
    const normalizedUserAnswer = userAnswer.toLowerCase().replace(/[^a-z ]/g, '');
    const normalizedCorrectAnswer = question.toLowerCase().replace(/[^a-z ]/g, '');
    
    let isCorrect = false;
    let correctAnswer = '';

    switch (difficultyLevel) {
      case 0: // Very Easy: Numbers to Letters
        const sentenceIndex = sentences.findIndex(sentence => numbersToLetters(sentence.toLowerCase()).toUpperCase() === question);
        correctAnswer = sentences[sentenceIndex].toLowerCase();
        isCorrect = normalizedUserAnswer === correctAnswer;
        break;
      case 1: // Easy: Reverse Alphabet
        correctAnswer = reverseAlphabet(normalizedCorrectAnswer).toLowerCase();
        isCorrect = normalizedUserAnswer === correctAnswer;
        break;
      case 2: // Medium: ROT13
        correctAnswer = rot13(normalizedCorrectAnswer).toLowerCase();
        isCorrect = normalizedUserAnswer === correctAnswer;
        break;
      case 3: // Hard: Morse Code
        correctAnswer = question.split(' ').map(code => {
            const morseAlphabetReverse: {[key: string]: string} = {
              '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f',
              '--.': 'g', '....': 'h', '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l',
              '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p', '--.-': 'q', '.-.': 'r',
              '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x',
              '-.--': 'y', '--..': 'z', '/': ' '
            };
            return morseAlphabetReverse[code] || '';
          }).join('').toLowerCase();
        isCorrect = normalizedUserAnswer === correctAnswer;
        break;
      case 4: // Very Hard: Caesar Cipher
        correctAnswer = caesarCipher(normalizedCorrectAnswer, 26 - caesarShift).toLowerCase();
        isCorrect = normalizedUserAnswer === correctAnswer;
        break;
    }

    setLevelResults([...levelResults, {
      question: question,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
      cipherType: cipherType,
    }]);

    if (isCorrect) {
      setScore(score + difficultyLevel + 1);
      Alert.alert('Correct!', '', [{ text: 'OK', onPress: handleNextLevel }]);
    } else {
      Alert.alert('Incorrect!', `The correct answer is: ${correctAnswer}`, [{ text: 'OK', onPress: handleNextLevel }]);
    }
  };

  const handleNextLevel = () => {

    if (level < 5) {
      setLevel(level + 1);
      setUserAnswer('');
      generateQuestion();
    } else {
      if (difficultyLevel < difficulties.length - 1) {
        setDifficultyLevel(difficultyLevel + 1);
        setLevel(1);
        setUserAnswer('');
      } else {
        setIsGameOver(true);
      }
    }
  };

  const handleGameCompletion = async () => {
    try {
      // Restore session to get user ID
      const userId = await restoreSession();

      if (!userId) throw new Error("No active session found.");

      // Save score in leaderboard table
      const { error: insertError } = await supabase.from("leaderboard").insert({
        user_id: userId,
        game_id: 2,
        score: score,
        updated_at: new Date().toISOString(),
        id: userId,
        last_updated: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      console.log("✅ Score saved successfully!");
      Alert.alert("Success", "Your score has been saved!");
    } catch (error: any) {
      console.error("❌ Error saving score:", error.message);
      Alert.alert("Error", "Failed to save your score.");
    }
  };

  const goBackToMainMenu = () => {
    navigation.goBack();
  };

  if(isGameOver){
    handleGameCompletion();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBackToMainMenu}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
        <Text style={styles.gameName}>Decipher</Text>
      </View>
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
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => setIsHelpModalVisible(true)}
            >
              <Text style={styles.helpButtonText}>Help</Text>
            </TouchableOpacity>
            <Text style={styles.levelText}>Level: {level} / 5</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.cipherTypeText}>Cipher Type: {cipherType}</Text>
            <Text style={styles.questionText}>Decrypt: {question}</Text>
            <TextInput
              style={styles.input}
              value={userAnswer}
              onChangeText={setUserAnswer}
              placeholder="Enter your answer"
              multiline
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
                  <Text>Cipher Type: {result.cipherType}</Text>
                  <Text>Encrypted: {result.question}</Text>
                  <Text>Your Answer: {result.userAnswer}</Text>
                  <Text>Correct Answer: {result.correctAnswer}</Text>
                  <Text style={result.isCorrect ? styles.correctText : styles.incorrectText}>
                    {result.isCorrect ? 'Correct!' : 'Incorrect!'}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.resetButtonText}>Return to Main Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <HelpModal
        isVisible={isHelpModalVisible}
        onClose={() => setIsHelpModalVisible(false)}
        cipherType={cipherType}
        caesarShift={caesarShift}
      />
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
  helpButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  helpButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  helpScroll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helpColumn: {
    flex: 1,
    paddingHorizontal: 5, // Reduced padding for more columns
  },
  helpText: {
    fontSize: 14, // Reduced font size to fit more content
    marginBottom: 3, // Reduced margin
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  closeButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  shiftInput: {
    width: '50%',
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  cipherTypeText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
