import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
    id: string;
    user_id: string;
    game_id: number;
    score: number;
    updated_at: string;
    username: string;
    game_name: string;
}

export default function LeaderboardScreen() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
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
        fetchLeaderboardData();
    }, [selectedGameId, currentUserId]);

    const fetchCurrentUserId = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) throw error;
            if (user && isMounted.current) {
                setCurrentUserId(user.id);
            } else {
                setError("Vous devez être connecté pour voir le leaderboard.");
                console.log("🚫 No user found, connexion requise...");
            }
        } catch (error: any) {
            setError("Vous devez être connecté pour voir le leaderboard.");
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

    const fetchLeaderboardData = useCallback(async () => {
        if (!isMounted.current) return;

        try {
            let query = supabase
                .from('leaderboard')
                .select(
                    `
          id,
          user_id,
          game_id,
          score,
          updated_at,
          profiles (username),
          games (name)
        `
                )
                .order('score', { ascending: false })
                .limit(100);

            if (selectedGameId !== 'all') {
                query = query.eq('game_id', selectedGameId);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            if (data && isMounted.current) {
                const formattedData = data.map((item: any) => ({
                    id: item.id,
                    user_id: item.user_id,
                    game_id: item.game_id,
                    score: item.score,
                    updated_at: item.updated_at,
                    username: item.profiles?.username || 'Unknown User',
                    game_name: item.games?.name || 'Unknown Game',
                }));
                setLeaderboardData(formattedData as LeaderboardEntry[]);
            } else {
                setLeaderboardData([]);
            }
        } catch (err: any) {
            setError("Erreur lors du chargement du leaderboard. Réessayez.");
            console.error("❌ Erreur leaderboard :", err.message);
        }
    }, [selectedGameId]);

    // Fetch leaderboard data on focus
    useFocusEffect(
        useCallback(() => {
            fetchLeaderboardData();
        }, [fetchLeaderboardData])
    );

    // Refresh the leaderboard every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(fetchLeaderboardData, 5000);

        return () => clearInterval(intervalId);
    }, [fetchLeaderboardData]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getRowStyle = (index: number, entry: LeaderboardEntry): any => {
        let rowStyle = {};

        if (index === 0) {
            rowStyle = { ...rowStyle, ...styles.goldRow };
        } else if (index === 1) {
            rowStyle = { ...rowStyle, ...styles.silverRow };
        } else if (index === 2) {
            rowStyle = { ...rowStyle, ...styles.bronzeRow };
        }
        return rowStyle;
    };

    const getRankText = (index: number): string => {
        return (index + 1).toString();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>🏆 Leaderboard</Text>
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
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, styles.rankColumn]}>Rank</Text>
                    <Text style={styles.headerCell}>User</Text>
                    <Text style={styles.headerCell}>Game</Text>
                    <Text style={[styles.headerCell, styles.scoreColumn]}>Score</Text>
                    <Text style={styles.headerCell}>Date</Text>
                </View>
                {leaderboardData.map((entry, index) => {
                    const rowStyle = getRowStyle(index, entry);

                    return (
                        <View
                            style={[
                                styles.tableRow,
                                styles.roundedCorners,
                                rowStyle,
                                styles.rowSpacing,
                            ]}
                            key={`${entry.id}-${index}`}
                        >
                            <Text style={[styles.rowCell, styles.rankColumn]}>
                                {getRankText(index)}
                            </Text>
                            <Text style={[styles.rowCell, entry.user_id === currentUserId && styles.currentUserText]}>
                                {entry.username}
                            </Text>
                            <Text style={styles.rowCell}>{entry.game_name}</Text>
                            <Text style={[styles.rowCell, styles.scoreColumn]}>{entry.score}</Text>
                            <Text style={styles.rowCell}>{formatDate(entry.updated_at)}</Text>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 12,
        color: '#444',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rowCell: {
        flex: 3,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        overflow: 'hidden',
    },
    rankColumn: {
        flex: 0.7,
    },
    scoreColumn: {
        flex: 0.7,
    },
    goldRow: {
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
    },
    silverRow: {
        backgroundColor: 'rgba(192, 192, 192, 0.7)',
    },
    bronzeRow: {
        backgroundColor: 'rgba(205, 127, 50, 0.7)',
    },
    currentUserText: {
        color: '#6200ee',
        fontWeight: 'bold',
    },
    roundedCorners: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    rowSpacing: {
        marginTop: 4,
        marginBottom: 4,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    }
});
