import React, { useState, useEffect } from 'react';
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from '../lib/supabase';

type ProtoQuizScreenRouteProp = RouteProp<RootStackParamList, 'ProtoQuiz'>;

type Props = {
  route: ProtoQuizScreenRouteProp;
};

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface LevelResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function ProtoQuizScreen({ route }: Props) {
  const navigation = useNavigation();
  const [difficultyLevel, setDifficultyLevel] = useState(0);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [levelResults, setLevelResults] = useState<LevelResult[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const difficulties = [
    { name: 'Very Easy', protocol: 'Basic Network Protocols' },
    { name: 'Easy', protocol: 'Application Layer Protocols' },
    { name: 'Medium', protocol: 'Transport Layer Protocols' },
    { name: 'Hard', protocol: 'Network Layer Protocols' },
    { name: 'Very Hard', protocol: 'Advanced Network Protocols' },
  ];

  const questions: { [key: string]: Question[] } = {
    'Basic Network Protocols': [
      {
        question: 'What does HTTP stand for?',
        options: ['High-Tech Transfer Protocol', 'Hyperlink Text Transfer Protocol', 'Home Transfer Protocol', 'Hypertext Transfer Protocol'],
        correctAnswer: 'Hypertext Transfer Protocol'
      },
      {
        question: 'Which protocol is used for sending emails?',
        options: ['FTP', 'HTTP', 'TCP', 'SMTP'],
        correctAnswer: 'SMTP'
      },
      {
        question: 'What protocol is used to translate domain names to IP addresses?',
        options: ['DHCP', 'ARP', 'NAT', 'DNS'],
        correctAnswer: 'DNS'
      },
      {
        question: 'Which protocol is used for remote terminal access?',
        options: ['SSH', 'RDP', 'VNC', 'Telnet'],
        correctAnswer: 'Telnet'
      },
      {
        question: 'What does FTP stand for?',
        options: ['Fast Transfer Protocol', 'File Transmission Process', 'Frequent Transfer Protocol', 'File Transfer Protocol'],
        correctAnswer: 'File Transfer Protocol'
      },
      {
        question: 'What is the purpose of the TCP/IP model?',
        options: ['Encrypt data', 'Manage hardware', 'Create websites', 'Standardize communication'],
        correctAnswer: 'Standardize communication'
      },
      {
        question: 'Which layer of the OSI model is responsible for routing?',
        options: ['Transport', 'Data Link', 'Physical', 'Network'],
        correctAnswer: 'Network'
      },
      {
        question: 'What is the function of a MAC address?',
        options: ['Route packets', 'Translate URLs', 'Encrypt data', 'Identify a device'],
        correctAnswer: 'Identify a device'
      },
      {
        question: 'What is the difference between TCP and UDP?',
        options: ['TCP is faster, UDP is slower', 'TCP is for small packets, UDP is for large packets', 'TCP is insecure, UDP is secure', 'TCP is connection-oriented, UDP is connectionless'],
        correctAnswer: 'TCP is connection-oriented, UDP is connectionless'
      },
      {
        question: 'What is a port number used for?',
        options: ['Identify a device', 'Encrypt data', 'Route packets', 'Identify a process'],
        correctAnswer: 'Identify a process'
      },
      {
        question: 'What is the purpose of a firewall?',
        options: ['Speed up internet', 'Block ads', 'Share files', 'Protect network'],
        correctAnswer: 'Protect network'
      },
      {
        question: 'What does VPN stand for?',
        options: ['Very Personal Network', 'Video Processing Network', 'Volume Protected Network', 'Virtual Private Network'],
        correctAnswer: 'Virtual Private Network'
      },
      {
        question: 'What is the function of a router?',
        options: ['Store data', 'Translate URLs', 'Encrypt data', 'Route data packets'],
        correctAnswer: 'Route data packets'
      },
      {
        question: 'What is the purpose of an IP address?',
        options: ['Encrypt data', 'Translate URLs', 'Manage hardware', 'Identify network device'],
        correctAnswer: 'Identify network device'
      },
      {
        question: 'What does LAN stand for?',
        options: ['Large Area Network', 'Limited Area Network', 'Line Access Network', 'Local Area Network'],
        correctAnswer: 'Local Area Network'
      },
      {
        question: 'What is the function of a DNS server?',
        options: ['Store website files', 'Encrypt data', 'Route packets', 'Translate domain names'],
        correctAnswer: 'Translate domain names'
      },
      {
        question: 'What is the purpose of DHCP?',
        options: ['Encrypt data', 'Translate URLs', 'Manage hardware', 'Assign IP addresses'],
        correctAnswer: 'Assign IP addresses'
      },
      {
        question: 'What is the function of ICMP?',
        options: ['Route packets', 'Encrypt data', 'Manage hardware', 'Send error messages'],
        correctAnswer: 'Send error messages'
      },
      {
        question: 'What is the purpose of ARP?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Resolve IP to MAC'],
        correctAnswer: 'Resolve IP to MAC'
      },
      {
        question: 'What is network topology?',
        options: ['Network speed', 'Network security', 'Network size', 'Physical/logical arrangement'],
        correctAnswer: 'Physical/logical arrangement'
      }
    ],
    'Application Layer Protocols': [
      {
        question: 'Which protocol is used for secure web browsing?',
        options: ['FTP', 'SMTP', 'Telnet', 'HTTPS'],
        correctAnswer: 'HTTPS'
      },
      {
        question: 'What protocol is used for file transfers?',
        options: ['HTTP', 'SMTP', 'SNMP', 'FTP'],
        correctAnswer: 'FTP'
      },
      {
        question: 'Which protocol is used for sending and receiving emails?',
        options: ['HTTP', 'FTP', 'SSH', 'SMTP/POP3/IMAP'],
        correctAnswer: 'SMTP/POP3/IMAP'
      },
      {
        question: 'What protocol is used for real-time messaging and presence information?',
        options: ['IRC', 'SMTP', 'HTTP', 'XMPP'],
        correctAnswer: 'XMPP'
      },
      {
        question: 'Which protocol is used for voice communication over the Internet?',
        options: ['HTTP', 'FTP', 'SMTP', 'VoIP'],
        correctAnswer: 'VoIP'
      },
      {
        question: 'What does MIME do?',
        options: ['Encrypts data', 'Routes packets', 'Manages hardware', 'Describes email content'],
        correctAnswer: 'Describes email content'
      },
      {
        question: 'What is the function of the HTTP GET method?',
        options: ['Send data', 'Update data', 'Delete data', 'Retrieve data'],
        correctAnswer: 'Retrieve data'
      },
      {
        question: 'What is the function of the HTTP POST method?',
        options: ['Retrieve data', 'Update data', 'Delete data', 'Send data'],
        correctAnswer: 'Send data'
      },
      {
        question: 'What is the purpose of cookies in HTTP?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Track user sessions'],
        correctAnswer: 'Track user sessions'
      },
      {
        question: 'What is the function of the HTTP DELETE method?',
        options: ['Retrieve data', 'Send data', 'Update data', 'Delete data'],
        correctAnswer: 'Delete data'
      },
      {
        question: 'What is the purpose of the HTTP PUT method?',
        options: ['Retrieve data', 'Send data', 'Delete data', 'Update data'],
        correctAnswer: 'Update data'
      },
      {
        question: 'What is the purpose of the HTTP HEAD method?',
        options: ['Retrieve data', 'Send data', 'Delete data', 'Retrieve header'],
        correctAnswer: 'Retrieve header'
      },
      {
        question: 'What is the function of the SIP protocol?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Manage multimedia'],
        correctAnswer: 'Manage multimedia'
      },
      {
        question: 'What is the function of the RTSP protocol?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Control streaming media'],
        correctAnswer: 'Control streaming media'
      },
      {
        question: 'What is the purpose of the SNMP protocol?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Manage network devices'],
        correctAnswer: 'Manage network devices'
      },
      {
        question: 'What is the function of the TFTP protocol?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Simple file transfer'],
        correctAnswer: 'Simple file transfer'
      },
      {
        question: 'What is the function of the LDAP protocol?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Directory services'],
        correctAnswer: 'Directory services'
      },
      {
        question: 'What is the function of the POP3 protocol?',
        options: ['Send emails', 'Encrypt data', 'Manage hardware', 'Retrieve emails'],
        correctAnswer: 'Retrieve emails'
      },
      {
        question: 'What is the function of the IMAP protocol?',
        options: ['Send emails', 'Encrypt data', 'Manage hardware', 'Manage emails'],
        correctAnswer: 'Manage emails'
      },
      {
        question: 'What is the function of the SMTP protocol?',
        options: ['Retrieve emails', 'Encrypt data', 'Manage hardware', 'Send emails'],
        correctAnswer: 'Send emails'
      }
    ],
    'Transport Layer Protocols': [
      {
        question: 'Which protocol provides reliable, ordered, and error-checked delivery of a stream of octets?',
        options: ['UDP', 'IP', 'ARP', 'TCP'],
        correctAnswer: 'TCP'
      },
      {
        question: 'What is the main advantage of UDP over TCP?',
        options: ['Reliability', 'Order', 'Error-checking', 'Speed'],
        correctAnswer: 'Speed'
      },
      {
        question: 'Which protocol is connectionless and unreliable?',
        options: ['TCP', 'SCTP', 'DCCP', 'UDP'],
        correctAnswer: 'UDP'
      },
      {
        question: 'What does TCP stand for?',
        options: ['Transfer Control Protocol', 'Transport Connection Protocol', 'Timed Control Protocol', 'Transmission Control Protocol'],
        correctAnswer: 'Transmission Control Protocol'
      },
      {
        question: 'Which protocol is used for congestion control in networks?',
        options: ['UDP', 'ICMP', 'ARP', 'TCP'],
        correctAnswer: 'TCP'
      },
      {
        question: 'What is the purpose of a TCP handshake?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Establish connection'],
        correctAnswer: 'Establish connection'
      },
      {
        question: 'What is the purpose of a TCP window?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Control flow'],
        correctAnswer: 'Control flow'
      },
      {
        question: 'What is the function of TCP sequence numbers?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Order packets'],
        correctAnswer: 'Order packets'
      },
      {
        question: 'What is the function of TCP acknowledgement numbers?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Confirm receipt'],
        correctAnswer: 'Confirm receipt'
      },
      {
        question: 'What is the purpose of the TCP FIN flag?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Close connection'],
        correctAnswer: 'Close connection'
      },
      {
        question: 'What is the purpose of the TCP RST flag?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Reset connection'],
        correctAnswer: 'Reset connection'
      },
      {
        question: 'What is the purpose of the TCP URG flag?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Urgent data'],
        correctAnswer: 'Urgent data'
      },
      {
        question: 'What is the purpose of the TCP PSH flag?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Push data'],
        correctAnswer: 'Push data'
      },
      {
        question: 'What is the purpose of the TCP SYN flag?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Synchronize'],
        correctAnswer: 'Synchronize'
      },
      {
        question: 'What is the function of a port in TCP/UDP?',
        options: ['Identify device', 'Encrypt data', 'Route packets', 'Identify application'],
        correctAnswer: 'Identify application'
      },
      {
        question: 'What is the range of port numbers?',
        options: ['0-1023', '1024-49151', '49152-65535', '0-65535'],
        correctAnswer: '0-65535'
      },
      {
        question: 'What are well-known ports?',
        options: ['1024-49151', '49152-65535', '0-65535', '0-1023'],
        correctAnswer: '0-1023'
      },
      {
        question: 'What are registered ports?',
        options: ['0-1023', '49152-65535', '0-65535', '1024-49151'],
        correctAnswer: '1024-49151'
      },
      {
        question: 'What are dynamic ports?',
        options: ['0-1023', '1024-49151', '0-65535', '49152-65535'],
        correctAnswer: '49152-65535'
      },
      {
        question: 'What is multiplexing in transport layer?',
        options: ['Encrypting data', 'Routing Packets', 'Managing Hardware', 'Multiple apps use same port'],
        correctAnswer: 'Multiple apps use same port'
      }
    ],
    'Network Layer Protocols': [
      {
        question: 'What is the primary function of IP?',
        options: ['Data encryption', 'Flow control', 'Error correction', 'Addressing and routing'],
        correctAnswer: 'Addressing and routing'
      },
      {
        question: 'Which protocol is used to send error messages and operational information?',
        options: ['ARP', 'RARP', 'IGMP', 'ICMP'],
        correctAnswer: 'ICMP'
      },
      {
        question: 'What protocol is used to map IP addresses to MAC addresses?',
        options: ['RARP', 'ICMP', 'IGMP', 'ARP'],
        correctAnswer: 'ARP'
      },
      {
        question: 'Which protocol is used for multicast group management?',
        options: ['ICMP', 'ARP', 'RARP', 'IGMP'],
        correctAnswer: 'IGMP'
      },
      {
        question: 'What does OSPF stand for in networking?',
        options: ['Open System Path Finder', 'Optimized Shortest Path Forward', 'Operational System Path Finder', 'Open Shortest Path First'],
        correctAnswer: 'Open Shortest Path First'
      },
      {
        question: 'What is the purpose of subnetting?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Divide network'],
        correctAnswer: 'Divide network'
      },
      {
        question: 'What is the function of a routing table?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Store best paths'],
        correctAnswer: 'Store best paths'
      },
      {
        question: 'What is CIDR?',
        options: ['Encrypting data', 'Routing Packets', 'Managing Hardware', 'Classless Addressing'],
        correctAnswer: 'Classless Addressing'
      },
      {
        question: 'What is the difference between IPv4 and IPv6?',
        options: ['Speed', 'Security', 'Reliability', 'Address length'],
        correctAnswer: 'Address length'
      },
      {
        question: 'What is NAT?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Network Address Translation'],
        correctAnswer: 'Network Address Translation'
      },
      {
        question: 'What is the function of a TTL?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Prevent loops'],
        correctAnswer: 'Prevent loops'
      },
      {
        question: 'What is the purpose of ICMP Echo Request?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Ping'],
        correctAnswer: 'Ping'
      },
      {
        question: 'What is the function of Traceroute?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Trace path'],
        correctAnswer: 'Trace path'
      },
      {
        question: 'What is the purpose of a default gateway?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Exit network'],
        correctAnswer: 'Exit network'
      },
      {
        question: 'What is the function of BGP?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Route between networks'],
        correctAnswer: 'Route between networks'
      },
      {
        question: 'What is the function of RIP?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Routing protocol'],
        correctAnswer: 'Routing protocol'
      },
      {
        question: 'What is the function of EIGRP?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Cisco routing'],
        correctAnswer: 'Cisco routing'
      },
      {
        question: 'What is the purpose of MPLS?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Speed packet forwarding'],
        correctAnswer: 'Speed packet forwarding'
      },
      {
        question: 'What is the function of a VPN tunnel?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Secure connection'],
        correctAnswer: 'Secure connection'
      },
      {
        question: 'What is the purpose of SDN?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Centralize network control'],
        correctAnswer: 'Centralize network control'
      }
    ],
    'Advanced Network Protocols': [
      {
        question: 'Which protocol is used for real-time communication over the Internet?',
        options: ['SMTP', 'HTTP', 'FTP', 'RTP'],
        correctAnswer: 'RTP'
      },
      {
        question: 'What protocol is used for network management and monitoring?',
        options: ['SSH', 'SSL', 'TLS', 'SNMP'],
        correctAnswer: 'SNMP'
      },
      {
        question: 'Which protocol provides secure remote access to network devices?',
        options: ['Telnet', 'HTTP', 'FTP', 'SSH'],
        correctAnswer: 'SSH'
      },
      {
        question: 'What protocol is used for secure communication over the Internet?',
        options: ['HTTP', 'FTP', 'SMTP', 'SSL/TLS'],
        correctAnswer: 'SSL/TLS'
      },
      {
        question: 'Which protocol is used for dynamic routing in large networks?',
        options: ['RIP', 'OSPF', 'EIGRP', 'BGP'],
        correctAnswer: 'BGP'
      },
      {
        question: 'What is the function of DiffServ?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Prioritize traffic'],
        correctAnswer: 'Prioritize traffic'
      },
      {
        question: 'What is the function of MPLS TE?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Traffic engineering'],
        correctAnswer: 'Traffic engineering'
      },
      {
        question: 'What is the function of VXLAN?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Overlay networks'],
        correctAnswer: 'Overlay networks'
      },
      {
        question: 'What is the function of GRE?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Tunneling protocol'],
        correctAnswer: 'Tunneling protocol'
      },
      {
        question: 'What is the function of IPsec?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Secure IP'],
        correctAnswer: 'Secure IP'
      },
      {
        question: 'What is the purpose of a DMZ?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Isolate servers'],
        correctAnswer: 'Isolate servers'
      },
      {
        question: 'What is the function of a reverse proxy?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Protect server'],
        correctAnswer: 'Protect server'
      },
      {
        question: 'What is the purpose of a WAF?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Protect web apps'],
        correctAnswer: 'Protect web apps'
      },
      {
        question: 'What is the function of a load balancer?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Distribute traffic'],
        correctAnswer: 'Distribute traffic'
      },
      {
        question: 'What is the purpose of a SIEM?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Security information'],
        correctAnswer: 'Security information'
      },
      {
        question: 'What is the function of network segmentation?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Isolate networks'],
        correctAnswer: 'Isolate networks'
      },
      {
        question: 'What is the function of port mirroring?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Copy traffic'],
        correctAnswer: 'Copy traffic'
      },
      {
        question: 'What is the function of NetFlow?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Monitor traffic'],
        correctAnswer: 'Monitor traffic'
      },
      {
        question: 'What is the purpose of a honeypot?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Attract attackers'],
        correctAnswer: 'Attract attackers'
      },
      {
        question: 'What is the purpose of a NAC?',
        options: ['Encrypt data', 'Route packets', 'Manage hardware', 'Control network access'],
        correctAnswer: 'Control network access'
      }
    ]
  };

  // Function to shuffle array elements
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

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
    const protocolType = difficulties[difficultyLevel].protocol;
    let availableQuestions = questions[protocolType].filter(q => !usedQuestions.includes(q.question));
    
    if (availableQuestions.length === 0) {
      setIsGameOver(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    let selectedQuestion = availableQuestions[randomIndex];

    // Shuffle the options
    const shuffledOptions = shuffleArray(selectedQuestion.options);
    
    // Find the new index of the correct answer after shuffling
    const correctIndex = shuffledOptions.findIndex(option => option === selectedQuestion.correctAnswer);

    //Update correct answer to make sure it is still the same
    selectedQuestion = {...selectedQuestion, 
      options: shuffledOptions,
      correctAnswer: shuffledOptions[correctIndex]
    };

    setCurrentQuestion(selectedQuestion);
    setUsedQuestions([...usedQuestions, selectedQuestion.question]);
  };

  const validateAnswer = (selectedAnswer: string) => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setLevelResults([...levelResults, {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
    }]);

    if (isCorrect) {
      setScore(score + difficultyLevel + 1);
      Alert.alert('Correct!', '', [{ text: 'OK', onPress: handleNextLevel }]);
    } else {
      Alert.alert('Incorrect!', `The correct answer is ${currentQuestion.correctAnswer}`, [
        { text: 'OK', onPress: handleNextLevel },
      ]);
    }
  };

  const handleNextLevel = () => {
    if (level < 5) {
      setLevel(level + 1);
      generateQuestion();
    } else {
      if (difficultyLevel < difficulties.length - 1) {
        setDifficultyLevel(difficultyLevel + 1);
        setLevel(1);
        setUsedQuestions([]);
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
        game_id: 3,
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
        <Text style={styles.gameName}>ProtoQuiz</Text>
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
            <Text style={styles.levelText}>
              Level: {level} / 5
            </Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>
            {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => validateAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
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
                  <Text>Question: {result.question}</Text>
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
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '80%',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
