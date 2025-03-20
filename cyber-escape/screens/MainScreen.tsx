import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

interface GameHistoryEntry {
    id: string;
    game_id: number;
    score: number;
    updated_at: string;
    game_name: string;
}

export default function HomeScreen() {
    const [totalScore, setTotalScore] = useState(0);
    const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
    const [numberOfGamesPlayed, setNumberOfGamesPlayed] = useState(0);
    const [selectedGameId, setSelectedGameId] = useState<string>('all');
    const [games, setGames] = useState<{ id: number; name: string }[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isMounted = useRef(true);

    useEffect(() => {
        fetchGames();
        fetchCurrentUserId();

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedGameId, currentUserId]);

    const fetchCurrentUserId = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) throw error;
            if (user && isMounted.current) {
                setCurrentUserId(user.id);
            } else {
                setError("Vous devez être connecté pour voir votre profil.");
                console.log("🚫 No user found, connexion requise...");
            }
        } catch (error: any) {
            setError("Vous devez être connecté pour voir votre profil.");
            console.error("⚠️ Erreur lors de la récupération de l'utilisateur :", error.message);
        }
    };

    const fetchGames = async () => {
        try {
            const { data, error } = await supabase
                .from('games')
                .select('id, name');

            if (error) {
                throw error;
            }

            if (data && isMounted.current) {
                setGames([{ id: 0, name: 'All Games' }, ...data]);
            }
        } catch (error: any) {
            console.error('Error fetching games:', error.message);
        }
    };

    const fetchData = useCallback(async () => {
        if (!isMounted.current || !currentUserId) return;

        try {
            let query = supabase
                .from('leaderboard')
                .select(
                    `
                    id,
                    game_id,
                    score,
                    updated_at,
                    games (name)
                    `
                )
                .eq('user_id', currentUserId)
                .order('updated_at', { ascending: false });

            if (selectedGameId !== 'all') {
                query = query.eq('game_id', selectedGameId);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            if (data && isMounted.current) {
                let formattedHistory = data.map((item: any) => ({
                    id: item.id,
                    game_id: item.game_id,
                    score: item.score,
                    updated_at: item.updated_at,
                    game_name: item.games?.name || 'Unknown Game',
                }));

                if (formattedHistory.length > 10) {
                    formattedHistory = formattedHistory.slice(0, 10);
                }

                setGameHistory(formattedHistory as GameHistoryEntry[]);
                setNumberOfGamesPlayed(data.length);

                const total = data.reduce((acc, item) => acc + item.score, 0);
                setTotalScore(total);
            } else {
                setTotalScore(0);
                setGameHistory([]);
                setNumberOfGamesPlayed(0);
            }
        } catch (err: any) {
            setError("Erreur lors du chargement des données. Réessayez.");
            console.error("❌ Erreur lors du chargement des données :", err.message);
        }
    }, [selectedGameId, currentUserId]);

    // Fetch data on focus
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    // Refresh data every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Your Profile</Text>
            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by Game:</Text>
                <ScrollView horizontal={true} style={styles.gameList}>
                    <TouchableOpacity
                        key="all"
                        style={[
                            styles.gameButton,
                            selectedGameId === 'all' && styles.selectedGameButton,
                        ]}
                        onPress={() => setSelectedGameId('all')}
                    >
                        <Text style={[
                            styles.gameButtonText,
                            selectedGameId === 'all' && styles.selectedGameButtonText
                        ]}>All Games</Text>
                    </TouchableOpacity>
                    {games.filter(game => game.id !== 0).map((game) => (
                        <TouchableOpacity
                            key={game.id}
                            style={[
                                styles.gameButton,
                                selectedGameId === game.id.toString() && styles.selectedGameButton,
                            ]}
                            onPress={() => setSelectedGameId(game.id.toString())}
                        >
                            <Text style={[
                                styles.gameButtonText,
                                selectedGameId === game.id.toString() && styles.selectedGameButtonText
                            ]}>{game.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
            <ScrollView>
                <View style={styles.totalScoreContainer}>
                    <Text style={styles.totalScoreLabel}>Total Score:</Text>
                    <Text style={styles.totalScoreValue}>{totalScore}</Text>
                    <Text style={styles.gamesPlayedLabel}>Games Played: {numberOfGamesPlayed}</Text>
                </View>
                <Text style={styles.historyTitle}>Game History (Last 10 Games):</Text>
                {gameHistory.length > 0 ? (
                    gameHistory.map((entry, index) => (
                        <View style={styles.historyItem} key={`${entry.id}-${index}`}>
                            <Text style={styles.historyGameName}>{entry.game_name}</Text>
                            <Text style={styles.historyScore}>Score: {entry.score}</Text>
                            <Text style={styles.historyDate}>{formatDate(entry.updated_at)}</Text>
                        </View>
                    ))
                ) : (
                    <View>
                        <Text style={styles.noHistory}>No game history available.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 25,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    filterContainer: {
        marginBottom: 10,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    gameList: {
        flexDirection: 'row',
    },
    gameButton: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 5,
        marginBottom: 5,
    },
    selectedGameButton: {
        backgroundColor: '#6200ee',
        borderColor: '#6200ee',
    },
    gameButtonText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    selectedGameButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    totalScoreContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    totalScoreLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    totalScoreValue: {
        fontSize: 24,
        color: '#6200ee',
        fontWeight: 'bold',
    },
    gamesPlayedLabel: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    historyItem: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
    },
    historyGameName: {
        fontSize: 16,
        color: '#444',
        fontWeight: 'bold',
    },
    historyScore: {
        fontSize: 14,
        color: '#666',
    },
    historyDate: {
        fontSize: 12,
        color: '#777',
    },
    noHistory: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
    }
});
