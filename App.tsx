import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

// Try different Firebase import approach
let firebase: any = null;
let database: any = null;

try {
  // Alternative Firebase import that should work better
  const firebaseApp = require('firebase/app');
  const firebaseDatabase = require('firebase/database');
  
  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDvUsG3RjdSUH_oDlj9SO5HC5-4onfhV8k",
    authDomain: "bgtimer-fa2c3.firebaseapp.com",
    databaseURL: "https://bgtimer-fa2c3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bgtimer-fa2c3",
    storageBucket: "bgtimer-fa2c3.firebasestorage.app",
    messagingSenderId: "937157472924",
    appId: "1:937157472924:web:5ff1c2c4ccfc3bcd8c7359",
    measurementId: "G-H1NMZLJV74"
  };

  // Initialize Firebase
  const app = firebaseApp.initializeApp(firebaseConfig);
  database = firebaseDatabase.getDatabase(app);
  firebase = { app, database, ...firebaseDatabase };
} catch (error) {
  console.log('Firebase not available, running in local mode');
}

// Types
interface Player {
  id: number;
  name: string;
  time: number;
  isActive: boolean;
}

interface GameData {
  id: number;
  name: string;
  date: string;
  players: {
    name: string;
    time: number;
    formattedTime: string;
  }[];
  timerMode: string;
  totalTime: number;
}

interface ConnectedPlayer {
  id: string;
  joinedAt: number;
  lastSeen: number;
}

type PlayerBoxSize = 'auto' | 'large' | 'medium' | 'small' | 'compact';
type TimerMode = 'countup' | 'countdown';
type Screen = 'home' | 'game' | 'history' | 'join';
type ConnectionStatus = 'offline' | 'connecting' | 'connected' | 'error';

const BoardGameTimer = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', time: 0, isActive: false },
    { id: 2, name: 'Player 2', time: 0, isActive: false }
  ]);
  const [activePlayerId, setActivePlayerId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<TimerMode>('countup');
  const [initialTime, setInitialTime] = useState<number>(600);
  const [gameHistory, setGameHistory] = useState<GameData[]>([]);
  const [currentGameName, setCurrentGameName] = useState<string>('');
  const [gameId, setGameId] = useState<string>('');
  const [joinGameId, setJoinGameId] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [connectedPlayers, setConnectedPlayers] = useState<ConnectedPlayer[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('offline');
  const [playerBoxSize, setPlayerBoxSize] = useState<PlayerBoxSize>('auto');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const gameRef = useRef<any>(null);
  const playerId = useRef(`player_${Date.now()}_${Math.random().toString(36).substring(2)}`);

  // Firebase sync effect
  useEffect(() => {
    if (gameId && isOnline && firebase && database) {
      try {
        gameRef.current = firebase.ref(database, `games/${gameId}`);
        
        // Listen for game state changes
        const unsubscribe = firebase.onValue(gameRef.current, (snapshot: any) => {
          const gameData = snapshot.val();
          if (gameData && !isHost) {
            // Only sync non-text data to avoid interference with typing
            if (gameData.activePlayerId !== undefined) setActivePlayerId(gameData.activePlayerId);
            if (gameData.isRunning !== undefined) setIsRunning(gameData.isRunning);
            if (gameData.gameStarted !== undefined) setGameStarted(gameData.gameStarted);
            if (gameData.timerMode) setTimerMode(gameData.timerMode);
            
            // Only update text fields if they're different and user isn't currently typing
            if (gameData.gameName && gameData.gameName !== currentGameName) {
              setCurrentGameName(gameData.gameName);
            }
            
            // For players, be more careful about updates to preserve typing
            if (gameData.players && JSON.stringify(gameData.players) !== JSON.stringify(players)) {
              setPlayers(gameData.players);
            }
          }
          
          // Update connected players list
          const connectedPlayersList: ConnectedPlayer[] = gameData?.connectedPlayers ? Object.values(gameData.connectedPlayers) : [];
          setConnectedPlayers(connectedPlayersList);
        });

        // Add this player to connected players
        const connectedPlayersRef = firebase.ref(database, `games/${gameId}/connectedPlayers/${playerId.current}`);
        firebase.set(connectedPlayersRef, {
          id: playerId.current,
          joinedAt: Date.now(),
          lastSeen: Date.now()
        });

        // Cleanup on unmount
        return () => {
          unsubscribe();
          firebase.set(connectedPlayersRef, null); // Remove player from connected list
        };
      } catch (error) {
        console.error('Firebase sync error:', error);
      }
    }
  }, [gameId, isOnline, isHost]);

  // Debounced Firebase sync to prevent input interference
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (gameId && isHost && isOnline && gameRef.current && firebase) {
      // Clear any existing timeout
      clearTimeout(debounceTimerRef.current);
      
      // Debounce the Firebase update to prevent interference with typing
      debounceTimerRef.current = setTimeout(() => {
        const gameState = {
          players,
          activePlayerId,
          isRunning,
          gameStarted,
          timerMode,
          initialTime,
          gameName: currentGameName,
          lastUpdated: Date.now(),
          hostId: playerId.current
        };
        
        firebase.update(gameRef.current, gameState).catch((error: any) => {
          console.error('Error updating game state:', error);
        });
      }, 500); // Wait 500ms after last change before syncing
    }
    
    return () => clearTimeout(debounceTimerRef.current);
  }, [players, activePlayerId, isRunning, gameStarted, currentGameName, gameId, isHost, isOnline]);

  // Timer effect
  useEffect(() => {
    if (isRunning && activePlayerId !== null) {
      intervalRef.current = setInterval(() => {
        setPlayers(prev => prev.map(player => {
          if (player.id === activePlayerId) {
            const newTime = timerMode === 'countup' 
              ? player.time + 1 
              : Math.max(0, player.time - 1);
            return { ...player, time: newTime };
          }
          return player;
        }));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, activePlayerId, timerMode]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const generateGameId = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createNewGame = async () => {
    const newGameId = generateGameId();
    setGameId(newGameId);
    setIsHost(true);
    setCurrentScreen('game');
    resetGame();

    if (firebase && database) {
      setIsOnline(true);
      setConnectionStatus('connecting');
      
      try {
        // Create game in Firebase
        const gameData = {
          id: newGameId,
          hostId: playerId.current,
          createdAt: Date.now(),
          players: players.map(p => ({ ...p, time: timerMode === 'countdown' ? initialTime : 0 })),
          activePlayerId: null,
          isRunning: false,
          gameStarted: false,
          timerMode,
          initialTime,
          gameName: '',
          connectedPlayers: {}
        };
        
        await firebase.set(firebase.ref(database, `games/${newGameId}`), gameData);
        setConnectionStatus('connected');
        Alert.alert('Game Created!', `Game ID: ${newGameId}\nShare this ID with other players to join.`);
      } catch (error) {
        console.error('Failed to create game:', error);
        Alert.alert('Game Created!', `Game ID: ${newGameId}\nRunning in local mode.`);
        setConnectionStatus('error');
        setIsOnline(false);
      }
    } else {
      Alert.alert('Game Created!', `Game ID: ${newGameId}\nRunning in local mode.`);
    }
  };

  const joinGame = async () => {
    if (!joinGameId.trim()) return;
    
    const gameIdToJoin = joinGameId.trim().toUpperCase();
    setGameId(gameIdToJoin);
    setIsHost(false);
    setCurrentScreen('game');

    if (firebase && database) {
      setIsOnline(true);
      setConnectionStatus('connecting');
      
      try {
        // Check if game exists
        const gameSnapshot = await firebase.get(firebase.ref(database, `games/${gameIdToJoin}`));
        const gameData = gameSnapshot.val();
        
        if (gameData) {
          // Join existing game
          setPlayers(gameData.players || players);
          setActivePlayerId(gameData.activePlayerId);
          setIsRunning(gameData.isRunning || false);
          setGameStarted(gameData.gameStarted || false);
          setTimerMode(gameData.timerMode || 'countup');
          setCurrentGameName(gameData.gameName || '');
          setConnectionStatus('connected');
          Alert.alert('Joined Game!', `Connected to game: ${gameIdToJoin}`);
        } else {
          throw new Error('Game not found');
        }
      } catch (error) {
        console.error('Failed to join game:', error);
        Alert.alert('Joined Game!', `Playing locally with ID: ${gameIdToJoin}`);
        setConnectionStatus('error');
        setIsOnline(false);
      }
    } else {
      Alert.alert('Joined Game!', `Playing locally with ID: ${gameIdToJoin}`);
    }
  };

  const shareGame = () => {
    if (gameId) {
      const shareText = isOnline 
        ? `Game ID: ${gameId}\n\nShare this ID with other players so they can join your game!`
        : `Game ID: ${gameId}\n\nNote: Running in local mode.`;
      Alert.alert('Share Game', shareText);
    }
  };

  const addPlayer = () => {
    const newId = Math.max(...players.map(p => p.id)) + 1;
    const newPlayer: Player = {
      id: newId,
      name: `Player ${newId}`,
      time: timerMode === 'countdown' ? initialTime : 0,
      isActive: false
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (id: number) => {
    if (players.length > 2) {
      setPlayers(players.filter(p => p.id !== id));
      if (activePlayerId === id) {
        setActivePlayerId(null);
        setIsRunning(false);
      }
    }
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === id ? { ...player, name } : player
    ));
  };

  const startPlayerTurn = (playerId: number) => {
    setActivePlayerId(playerId);
    setIsRunning(true);
    setGameStarted(true);
    setPlayers(prev => prev.map(player => ({
      ...player,
      isActive: player.id === playerId
    })));
  };

  const pauseGame = () => setIsRunning(false);
  const resumeGame = () => { if (activePlayerId !== null) setIsRunning(true); };

  const nextPlayer = () => {
    const currentIndex = players.findIndex(p => p.id === activePlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayerId = players[nextIndex].id;
    startPlayerTurn(nextPlayerId);
  };

  const resetGame = () => {
    setIsRunning(false);
    setActivePlayerId(null);
    setGameStarted(false);
    const resetTime = timerMode === 'countdown' ? initialTime : 0;
    setPlayers(prev => prev.map(player => ({
      ...player,
      time: resetTime,
      isActive: false
    })));
  };

  const saveGame = () => {
    if (!gameStarted) return;
    
    const gameData: GameData = {
      id: Date.now(),
      name: currentGameName || `Game ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      players: players.map(p => ({
        name: p.name,
        time: p.time,
        formattedTime: formatTime(p.time)
      })),
      timerMode,
      totalTime: players.reduce((sum, p) => sum + p.time, 0)
    };
    
    setGameHistory(prev => [gameData, ...prev]);
    Alert.alert('Success', 'Game saved successfully!');
  };

  const getConnectionStatusColor = (): string => {
    switch (connectionStatus) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPlayerBoxSize = (): string => {
    if (playerBoxSize === 'auto') {
      // Auto-size based on number of players
      if (players.length <= 2) return 'Large';
      if (players.length <= 4) return 'Medium'; 
      if (players.length <= 6) return 'Small';
      return 'Compact'; // 7-8 players
    }
    return playerBoxSize.charAt(0).toUpperCase() + playerBoxSize.slice(1);
  };

  const getPlayerGridCols = (): number => {
    const size = getPlayerBoxSize().toLowerCase();
    const numPlayers = players.length;
    
    if (size === 'large') return 1;
    if (size === 'medium') return 2;
    if (size === 'small') return numPlayers <= 6 ? 2 : 3;
    return 3; // compact
  };

  // Screen Components
  const HomeScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎲 Board Game Timer</Text>
        <Text style={styles.subtitle}>Track time for every player in your board games</Text>
        {firebase && database && (
          <Text style={styles.firebaseStatus}>🔥 Firebase Connected</Text>
        )}
        {!firebase && (
          <Text style={styles.localStatus}>📱 Local Mode</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={createNewGame}>
          <Text style={styles.buttonText}>🎮 Create New Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setCurrentScreen('join')}>
          <Text style={styles.buttonText}>📱 Join Existing Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.tertiaryButton]} onPress={() => setCurrentScreen('history')}>
          <Text style={styles.buttonText}>🏆 Game History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.settingsButton]} onPress={() => setShowSettings(true)}>
          <Text style={styles.buttonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      {gameHistory.length > 0 && (
        <View style={styles.recentGames}>
          <Text style={styles.sectionTitle}>Recent Games</Text>
          {gameHistory.slice(0, 3).map(game => (
            <View key={game.id} style={styles.gameHistoryItem}>
              <Text style={styles.gameName}>{game.name}</Text>
              <Text style={styles.gameDate}>{new Date(game.date).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const JoinGameScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Join Game</Text>
        <Text style={styles.subtitle}>Enter the 6-character game ID to join</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Game ID (e.g. ABC123)"
          placeholderTextColor="#999"
          value={joinGameId}
          onChangeText={(text) => setJoinGameId(text.toUpperCase())}
          maxLength={6}
          autoCapitalize="characters"
        />
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, !joinGameId.trim() && styles.disabledButton]} 
          onPress={joinGame}
          disabled={!joinGameId.trim()}
        >
          <Text style={styles.buttonText}>Join Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setCurrentScreen('home')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How to join:</Text>
        <Text style={styles.infoText}>• Get the Game ID from the host</Text>
        <Text style={styles.infoText}>• Enter it above to join the session</Text>
        <Text style={styles.infoText}>• All players see real-time updates</Text>
        <Text style={styles.infoText}>• Host controls the game, others can view</Text>
      </View>
    </ScrollView>
  );

  const GameHistoryScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🏆 Game History</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
          <Text style={styles.backButtonText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>

      {gameHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No games saved yet</Text>
          <Text style={styles.emptySubtitle}>Play a game and save it to see it here!</Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {gameHistory.map(game => (
            <View key={game.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyGameName}>{game.name}</Text>
                <Text style={styles.historyDate}>{new Date(game.date).toLocaleDateString()}</Text>
              </View>
              
              <Text style={styles.historyTotal}>Total Time: {formatTime(game.totalTime)}</Text>
              
              <View style={styles.historyPlayers}>
                {game.players.map((player, idx) => (
                  <Text key={idx} style={styles.historyPlayer}>
                    {player.name}: {player.formattedTime}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const GameScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>
            {gameId ? `Game: ${gameId}` : '🎲 Board Game Timer'}
          </Text>
          {gameId && isOnline && (
            <View style={styles.connectionStatus}>
              <View style={[styles.statusDot, { backgroundColor: getConnectionStatusColor() }]} />
              <Text style={[styles.statusText, { color: getConnectionStatusColor() }]}>
                {connectionStatus === 'connected' ? 
                  `${connectedPlayers.length} player${connectedPlayers.length !== 1 ? 's' : ''} connected` : 
                  connectionStatus}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerButtons}>
          {gameId && (
            <TouchableOpacity style={styles.shareButton} onPress={shareGame}>
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.settingsIconButton} onPress={() => setShowSettings(true)}>
            <Text style={styles.settingsIconText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.backButtonText}>🏠</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.gameNameInput}
        placeholder="Enter game name (optional)"
        placeholderTextColor="#999"
        value={currentGameName}
        onChangeText={setCurrentGameName}
        editable={isHost || !isOnline}
      />

      {isOnline && (
        <View style={styles.roleIndicator}>
          <Text style={[styles.roleText, isHost ? styles.hostRole : styles.clientRole]}>
            {isHost ? '👑 HOST' : '👥 CLIENT'}
          </Text>
          <Text style={styles.roleDescription}>
            {isHost ? 'You control the game' : 'Following host controls'}
          </Text>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, styles.addButton, (!isHost && isOnline) && styles.disabledButton]} 
          onPress={addPlayer}
          disabled={!isHost && isOnline}
        >
          <Text style={styles.controlButtonText}>➕ Add Player</Text>
        </TouchableOpacity>
        
        {!isRunning ? (
          <TouchableOpacity 
            style={[styles.controlButton, styles.playButton, (activePlayerId === null || (!isHost && isOnline)) && styles.disabledButton]} 
            onPress={resumeGame}
            disabled={activePlayerId === null || (!isHost && isOnline)}
          >
            <Text style={styles.controlButtonText}>
              ▶️ {gameStarted ? 'Resume' : 'Start'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.controlButton, styles.pauseButton, (!isHost && isOnline) && styles.disabledButton]} 
            onPress={pauseGame}
            disabled={!isHost && isOnline}
          >
            <Text style={styles.controlButtonText}>⏸️ Pause</Text>
          </TouchableOpacity>
        )}
        
        {gameStarted && (
          <>
            <TouchableOpacity 
              style={[styles.controlButton, styles.nextButton, (!isHost && isOnline) && styles.disabledButton]} 
              onPress={nextPlayer}
              disabled={!isHost && isOnline}
            >
              <Text style={styles.controlButtonText}>⏭️ Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.saveButton]} onPress={saveGame}>
              <Text style={styles.controlButtonText}>💾 Save</Text>
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.resetButton, (!isHost && isOnline) && styles.disabledButton]} 
          onPress={resetGame}
          disabled={!isHost && isOnline}
        >
          <Text style={styles.controlButtonText}>🔄 Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.playersGrid, { 
        flexDirection: getPlayerGridCols() === 1 ? 'column' : 'row',
        flexWrap: getPlayerGridCols() > 1 ? 'wrap' : 'nowrap'
      }]}>
        {players.map((player) => {
          const boxSize = getPlayerBoxSize().toLowerCase();
          const dynamicStyles = {
            playerCard: boxSize === 'large' ? styles.playerCardLarge :
                       boxSize === 'medium' ? styles.playerCardMedium :
                       boxSize === 'small' ? styles.playerCardSmall : styles.playerCardCompact,
            playerNameInput: boxSize === 'large' ? styles.playerNameInputLarge :
                            boxSize === 'medium' ? styles.playerNameInputMedium :
                            boxSize === 'small' ? styles.playerNameInputSmall : styles.playerNameInputCompact,
            removeButton: boxSize === 'large' ? styles.removeButtonLarge :
                         boxSize === 'medium' ? styles.removeButtonMedium :
                         boxSize === 'small' ? styles.removeButtonSmall : styles.removeButtonCompact,
            timeDisplay: boxSize === 'large' ? styles.timeDisplayLarge :
                        boxSize === 'medium' ? styles.timeDisplayMedium :
                        boxSize === 'small' ? styles.timeDisplaySmall : styles.timeDisplayCompact,
            urgentText: boxSize === 'large' ? styles.urgentTextLarge :
                       boxSize === 'medium' ? styles.urgentTextMedium :
                       boxSize === 'small' ? styles.urgentTextSmall : styles.urgentTextCompact,
            playerButton: boxSize === 'large' ? styles.playerButtonLarge :
                         boxSize === 'medium' ? styles.playerButtonMedium :
                         boxSize === 'small' ? styles.playerButtonSmall : styles.playerButtonCompact,
            playerButtonText: boxSize === 'large' ? styles.playerButtonTextLarge :
                             boxSize === 'medium' ? styles.playerButtonTextMedium :
                             boxSize === 'small' ? styles.playerButtonTextSmall : styles.playerButtonTextCompact
          };
          
          return (
            <View
              key={player.id}
              style={[
                styles.playerCard,
                dynamicStyles.playerCard,
                player.isActive && styles.activePlayerCard,
                getPlayerGridCols() > 1 && { 
                  width: getPlayerGridCols() === 2 ? '48%' : '31%',
                  marginBottom: 8
                }
              ]}
            >
              <View style={styles.playerHeader}>
                <TextInput
                  style={[
                    styles.playerNameInput,
                    dynamicStyles.playerNameInput
                  ]}
                  value={player.name}
                  onChangeText={(text) => updatePlayerName(player.id, text)}
                  editable={isHost || !isOnline}
                />
                {players.length > 2 && (
                  <TouchableOpacity 
                    onPress={() => removePlayer(player.id)}
                    disabled={!isHost && isOnline}
                  >
                    <Text style={[
                      styles.removeButton,
                      dynamicStyles.removeButton,
                      (!isHost && isOnline) && styles.disabledText
                    ]}>❌</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.timeContainer}>
                <Text style={[
                  styles.timeDisplay,
                  dynamicStyles.timeDisplay,
                  timerMode === 'countdown' && player.time <= 60 && styles.urgentTime
                ]}>
                  {formatTime(player.time)}
                </Text>
                {timerMode === 'countdown' && player.time <= 60 && player.time > 0 && (
                  <Text style={[
                    styles.urgentText,
                    dynamicStyles.urgentText
                  ]}>TIME RUNNING OUT!</Text>
                )}
              </View>
              
              <TouchableOpacity
                style={[
                  styles.playerButton,
                  dynamicStyles.playerButton,
                  ((player.isActive && isRunning) || (!isHost && isOnline)) && styles.disabledButton
                ]}
                onPress={() => startPlayerTurn(player.id)}
                disabled={(player.isActive && isRunning) || (!isHost && isOnline)}
              >
                <Text style={[
                  styles.playerButtonText,
                  dynamicStyles.playerButtonText
                ]}>
                  {player.isActive && isRunning ? 'Active' : 'Start Turn'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {gameStarted && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Game Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Time</Text>
              <Text style={styles.statValue}>
                {formatTime(players.reduce((sum, p) => sum + p.time, 0))}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Active Player</Text>
              <Text style={styles.statValue}>
                {activePlayerId ? players.find(p => p.id === activePlayerId)?.name : 'None'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Players</Text>
              <Text style={styles.statValue}>{players.length}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.app}>
      {/* Settings Modal */}
      {showSettings && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚙️ Settings</Text>
            
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Player Box Size</Text>
              <View style={styles.settingOptions}>
                {(['auto', 'large', 'medium', 'small', 'compact'] as PlayerBoxSize[]).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.settingOption,
                      playerBoxSize === size && styles.settingOptionActive
                    ]}
                    onPress={() => setPlayerBoxSize(size)}
                  >
                    <Text style={[
                      styles.settingOptionText,
                      playerBoxSize === size && styles.settingOptionTextActive
                    ]}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.settingDescription}>
                Auto: Adjusts size based on player count (recommended)
              </Text>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Timer Mode</Text>
              <View style={styles.settingOptions}>
                <TouchableOpacity
                  style={[
                    styles.settingOption,
                    timerMode === 'countup' && styles.settingOptionActive
                  ]}
                  onPress={() => setTimerMode('countup')}
                >
                  <Text style={[
                    styles.settingOptionText,
                    timerMode === 'countup' && styles.settingOptionTextActive
                  ]}>Count Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.settingOption,
                    timerMode === 'countdown' && styles.settingOptionActive
                  ]}
                  onPress={() => setTimerMode('countdown')}
                >
                  <Text style={[
                    styles.settingOptionText,
                    timerMode === 'countdown' && styles.settingOptionTextActive
                  ]}>Count Down</Text>
                </TouchableOpacity>
              </View>
            </View>

            {timerMode === 'countdown' && (
              <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Initial Time (minutes)</Text>
                <TextInput
                  style={styles.settingInput}
                  value={String(initialTime / 60)}
                  onChangeText={(text) => setInitialTime(parseInt(text) * 60 || 600)}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor="#999"
                />
              </View>
            )}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.modalCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'history' && <GameHistoryScreen />}
      {currentScreen === 'join' && <JoinGameScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  firebaseStatus: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  localStatus: {
    fontSize: 14,
    color: '#f59e0b',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#10b981',
  },
  tertiaryButton: {
    backgroundColor: '#8b5cf6',
  },
  settingsButton: {
    backgroundColor: '#6b7280',
  },
  disabledButton: {
    backgroundColor: '#6b7280',
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentGames: {
    marginTop: 30,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  gameHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  gameName: {
    color: '#ffffff',
    fontSize: 14,
  },
  gameDate: {
    color: '#cccccc',
    fontSize: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  shareButton: {
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsIconButton: {
    padding: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    borderRadius: 8,
  },
  settingsIconText: {
    fontSize: 14,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
  },
  infoBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 4,
  },
  gameNameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  roleIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hostRole: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  clientRole: {
    backgroundColor: '#10b981',
    color: '#ffffff',
  },
  roleDescription: {
    fontSize: 12,
    color: '#cccccc',
  },
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#10b981',
  },
  playButton: {
    backgroundColor: '#3b82f6',
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
  },
  nextButton: {
    backgroundColor: '#8b5cf6',
  },
  saveButton: {
    backgroundColor: '#059669',
  },
  resetButton: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  playersGrid: {
    gap: 16,
    justifyContent: 'space-between',
  },
  playerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  playerCardLarge: {
    padding: 20,
  },
  playerCardMedium: {
    padding: 16,
  },
  playerCardSmall: {
    padding: 12,
  },
  playerCardCompact: {
    padding: 8,
  },
  activePlayerCard: {
    borderColor: '#fbbf24',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerNameInput: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  playerNameInputLarge: {
    fontSize: 18,
  },
  playerNameInputMedium: {
    fontSize: 16,
  },
  playerNameInputSmall: {
    fontSize: 14,
  },
  playerNameInputCompact: {
    fontSize: 12,
  },
  removeButton: {
    fontSize: 16,
  },
  removeButtonLarge: {
    fontSize: 18,
  },
  removeButtonMedium: {
    fontSize: 16,
  },
  removeButtonSmall: {
    fontSize: 14,
  },
  removeButtonCompact: {
    fontSize: 12,
  },
  disabledText: {
    opacity: 0.3,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  timeDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  timeDisplayLarge: {
    fontSize: 36,
  },
  timeDisplayMedium: {
    fontSize: 28,
  },
  timeDisplaySmall: {
    fontSize: 22,
  },
  timeDisplayCompact: {
    fontSize: 18,
  },
  urgentTime: {
    color: '#ef4444',
  },
  urgentText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  urgentTextLarge: {
    fontSize: 14,
  },
  urgentTextMedium: {
    fontSize: 12,
  },
  urgentTextSmall: {
    fontSize: 10,
  },
  urgentTextCompact: {
    fontSize: 8,
  },
  playerButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  playerButtonLarge: {
    padding: 16,
  },
  playerButtonMedium: {
    padding: 12,
  },
  playerButtonSmall: {
    padding: 8,
  },
  playerButtonCompact: {
    padding: 6,
  },
  playerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  playerButtonTextLarge: {
    fontSize: 16,
  },
  playerButtonTextMedium: {
    fontSize: 14,
  },
  playerButtonTextSmall: {
    fontSize: 12,
  },
  playerButtonTextCompact: {
    fontSize: 10,
  },
  statsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: 12,
  },
  statLabel: {
    color: '#cccccc',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#cccccc',
  },
  historyList: {
    gap: 16,
  },
  historyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyGameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  historyDate: {
    fontSize: 12,
    color: '#cccccc',
  },
  historyTotal: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
  },
  historyPlayers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyPlayer: {
    fontSize: 12,
    color: '#cccccc',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 4,
    borderRadius: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#2a2a4e',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  settingSection: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 12,
    color: '#cccccc',
    marginTop: 4,
  },
  settingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  settingOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingOptionActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  settingOptionText: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '500',
  },
  settingOptionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  settingInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalCloseButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BoardGameTimer;
