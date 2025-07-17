import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

//Code below

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#1a1a2e',
    minHeight: '100vh',
  },
  lightContainer: {
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  lightText: {
    color: '#2d3748',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 22,
  },
  lightSubtext: {
    color: '#718096',
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
    maxWidth: 320,
    alignSelf: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonWithFeedback: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  lightCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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
    flex: 1,
  },
  gameDate: {
    color: '#a0aec0',
    fontSize: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    marginTop: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  shareButton: {
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsIconButton: {
    padding: 12,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    borderRadius: 8,
    minWidth: 44,
    alignItems: 'center',
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
    maxWidth: 320,
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
    minHeight: 56,
  },
  infoBox: {
    marginTop: 24,
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
    color: '#a0aec0',
    marginBottom: 4,
    lineHeight: 20,
  },
  gameNameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 48,
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
    color: '#a0aec0',
  },
  controlsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  controlButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: 12,
    justifyContent: 'space-between',
  },
  playerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 160,
  },
  playerCardLarge: {
    padding: 20,
    minHeight: 200,
  },
  playerCardMedium: {
    padding: 16,
    minHeight: 180,
  },
  playerCardSmall: {
    padding: 12,
    minHeight: 160,
  },
  playerCardCompact: {
    padding: 10,
    minHeight: 140,
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
    padding: 4,
    borderRadius: 4,
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
  removeButtonContainer: {
    padding: 4,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 1,
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
    textAlign: 'center',
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
    textAlign: 'center',
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
    minHeight: 44,
    justifyContent: 'center',
  },
  playerButtonLarge: {
    padding: 16,
    minHeight: 48,
  },
  playerButtonMedium: {
    padding: 12,
    minHeight: 44,
  },
  playerButtonSmall: {
    padding: 10,
    minHeight: 40,
  },
  playerButtonCompact: {
    padding: 8,
    minHeight: 36,
  },
  playerButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
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
    textAlign: 'center',
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
    padding: 8,
  },
  statLabel: {
    color: '#a0aec0',
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 20,
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
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: '#a0aec0',
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
    color: '#a0aec0',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 6,
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
  lightModal: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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
    marginBottom: 8,      {gameStarted && (
        <View styleimport React, { useState, useEffect, useRef } from 'react';
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
  color: string;
}

interface GameData {
  id: number;
  name: string;
  date: string;
  players: {
    name: string;
    time: number;
    formattedTime: string;
    color: string;
  }[];
  timerMode: string;
  totalTime: number;
  averageTurnTime: number;
  longestTurn: number;
  shortestTurn: number;
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
type Theme = 'dark' | 'light';

// 50 distinct colors for players
const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#F9E79F', '#D7BDE2',
  '#A3E4D7', '#FAD7A0', '#D5A6BD', '#AED6F1', '#A9DFBF', '#F5B7B1', '#D2B4DE', '#A9CCE3',
  '#ABEBC6', '#F9C74F', '#F8AD9D', '#C39BD3', '#7FB3D3', '#73C6B6', '#FFB347', '#DDA0DD',
  '#87CEEB', '#98FB98', '#F0E68C', '#DDA0DD', '#FFB6C1', '#20B2AA', '#87CEFA', '#98FB98',
  '#F5DEB3', '#FFB347', '#FF7F50', '#6495ED', '#9370DB', '#32CD32', '#FF6347', '#4682B4',
  '#DC143C', '#00CED1'
];

// Auto-sizing logic that ensures no scrolling
const getOptimalLayout = (playerCount: number) => {
  if (playerCount <= 1) return { cols: 1, size: 'large' };
  if (playerCount === 2) return { cols: 2, size: 'large' };
  if (playerCount <= 4) return { cols: 2, size: 'medium' };
  if (playerCount <= 6) return { cols: 3, size: 'small' };
  if (playerCount <= 9) return { cols: 3, size: 'compact' };
  return { cols: 4, size: 'compact' }; // For 10+ players
};

const BoardGameTimer = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', time: 0, isActive: false, color: PLAYER_COLORS[0] },
    { id: 2, name: 'Player 2', time: 0, isActive: false, color: PLAYER_COLORS[1] }
  ]);
  const [activePlayerId, setActivePlayerId] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<TimerMode>('countup');
  const [initialTime, setInitialTime] = useState<number>(600);
  const [gameHistory, setGameHistory] = useState<GameData[]>([]);
  const [currentGameName, setCurrentGameName] = useState<string>('');
  const [localGameName, setLocalGameName] = useState<string>(''); // Local input state
  const [localPlayerNames, setLocalPlayerNames] = useState<{[key: number]: string}>({}); // Local player name states
  const [gameId, setGameId] = useState<string>('');
  const [joinGameId, setJoinGameId] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [connectedPlayers, setConnectedPlayers] = useState<ConnectedPlayer[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('offline');
  const [playerBoxSize, setPlayerBoxSize] = useState<PlayerBoxSize>('auto');
  const [theme, setTheme] = useState<Theme>('dark');
  const [customTurnSound, setCustomTurnSound] = useState<string>('');
  const [playTurnSounds, setPlayTurnSounds] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const gameNameTimeoutRef = useRef<NodeJS.Timeout>();
  const playerNameTimeouts = useRef<{[key: number]: NodeJS.Timeout}>({});
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

  // Initialize local states when game data changes (but not during typing)
  useEffect(() => {
    setLocalGameName(currentGameName);
    const newLocalNames: {[key: number]: string} = {};
    players.forEach(player => {
      newLocalNames[player.id] = player.name;
    });
    setLocalPlayerNames(newLocalNames);
  }, [gameId]); // Only on game change, not on every update

  // Debounced Firebase sync - exclude text fields that are being edited
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (gameId && isHost && isOnline && gameRef.current && firebase) {
      // Clear any existing timeout
      clearTimeout(debounceTimerRef.current);
      
      // Debounce the Firebase update
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
      }, 300); // Reduced to 300ms for faster non-text updates
    }
    
    return () => clearTimeout(debounceTimerRef.current);
  }, [players, activePlayerId, isRunning, gameStarted, currentGameName, gameId, isHost, isOnline]);

  // Handle game name changes with proper debouncing
  const handleGameNameChange = (newName: string) => {
    setLocalGameName(newName);
    
    // Clear existing timeout
    clearTimeout(gameNameTimeoutRef.current);
    
    // Set new timeout to commit the change
    gameNameTimeoutRef.current = setTimeout(() => {
      setCurrentGameName(newName);
    }, 1000); // Wait 1 second after user stops typing
  };

  // Handle player name changes with proper debouncing
  const handlePlayerNameChange = (playerId: number, newName: string) => {
    setLocalPlayerNames(prev => ({
      ...prev,
      [playerId]: newName
    }));
    
    // Clear existing timeout for this player
    clearTimeout(playerNameTimeouts.current[playerId]);
    
    // Set new timeout to commit the change
    playerNameTimeouts.current[playerId] = setTimeout(() => {
      setPlayers(prev => prev.map(player => 
        player.id === playerId ? { ...player, name: newName } : player
      ));
    }, 1000); // Wait 1 second after user stops typing
  };

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
      isActive: false,
      color: getNextPlayerColor()
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
    // This is now handled by handlePlayerNameChange
    handlePlayerNameChange(id, name);
  };

  const startPlayerTurn = (playerId: number) => {
    setActivePlayerId(playerId);
    setIsRunning(true);
    setGameStarted(true);
    setPlayers(prev => prev.map(player => ({
      ...player,
      isActive: player.id === playerId
    })));
    
    // Play turn notification sound
    playTurnNotification();
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
    
    const stats = calculateGameStats();
    const gameData: GameData = {
      id: Date.now(),
      name: currentGameName || `Game ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      players: players.map(p => ({
        name: p.name,
        time: p.time,
        formattedTime: formatTime(p.time),
        color: p.color
      })),
      timerMode,
      totalTime: stats?.totalTime || 0,
      averageTurnTime: stats?.averageTime || 0,
      longestTurn: stats?.longestTurn || 0,
      shortestTurn: stats?.shortestTurn || 0
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
      const layout = getOptimalLayout(players.length);
      return layout.size.charAt(0).toUpperCase() + layout.size.slice(1);
    }
    return playerBoxSize.charAt(0).toUpperCase() + playerBoxSize.slice(1);
  };

  const getPlayerGridCols = (): number => {
    if (playerBoxSize === 'auto') {
      return getOptimalLayout(players.length).cols;
    }
    
    const size = getPlayerBoxSize().toLowerCase();
    if (size === 'large') return players.length === 1 ? 1 : 2;
    if (size === 'medium') return 2;
    if (size === 'small') return 3;
    return 4; // compact
  };

  // Play turn notification sound
  const playTurnNotification = () => {
    if (!playTurnSounds) return;
    
    if (customTurnSound) {
      // Play custom recorded sound
      const audio = new Audio(customTurnSound);
      audio.play().catch(() => {
        // Fallback to system beep if custom sound fails
        playSystemBeep();
      });
    } else {
      playSystemBeep();
    }
  };

  const playSystemBeep = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Get next available color for new players
  const getNextPlayerColor = (): string => {
    const usedColors = new Set(players.map(p => p.color));
    return PLAYER_COLORS.find(color => !usedColors.has(color)) || PLAYER_COLORS[0];
  };

  // Calculate advanced game statistics
  const calculateGameStats = () => {
    if (!gameStarted || players.length === 0) return null;
    
    const playerTimes = players.map(p => p.time).filter(t => t > 0);
    const totalTime = playerTimes.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / playerTimes.length;
    const longestTurn = Math.max(...playerTimes);
    const shortestTurn = Math.min(...playerTimes);
    
    return {
      totalTime,
      averageTime,
      longestTurn,
      shortestTurn,
      activePlayers: playerTimes.length
    };
  };

  // Screen Components
  const HomeScreen = () => (
    <ScrollView contentContainerStyle={[styles.container, theme === 'light' && styles.lightContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, theme === 'light' && styles.lightText]}>🎲 Board Game Timer</Text>
        <Text style={[styles.subtitle, theme === 'light' && styles.lightSubtext]}>Track time for every player in your board games</Text>
        {firebase && database && (
          <Text style={styles.firebaseStatus}>🔥 Firebase Connected</Text>
        )}
        {!firebase && (
          <Text style={styles.localStatus}>📱 Local Mode</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, styles.buttonWithFeedback]} 
          onPress={createNewGame}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>🎮 Create New Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton, styles.buttonWithFeedback]} 
          onPress={() => setCurrentScreen('join')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>📱 Join Existing Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.tertiaryButton, styles.buttonWithFeedback]} 
          onPress={() => setCurrentScreen('history')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>🏆 Game History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.settingsButton, styles.buttonWithFeedback]} 
          onPress={() => setShowSettings(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      {gameHistory.length > 0 && (
        <View style={[styles.recentGames, theme === 'light' && styles.lightCard]}>
          <Text style={[styles.sectionTitle, theme === 'light' && styles.lightText]}>Recent Games</Text>
          {gameHistory.slice(0, 3).map(game => (
            <View key={game.id} style={styles.gameHistoryItem}>
              <Text style={[styles.gameName, theme === 'light' && styles.lightText]}>{game.name}</Text>
              <Text style={[styles.gameDate, theme === 'light' && styles.lightSubtext]}>{new Date(game.date).toLocaleDateString()}</Text>
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
        value={localGameName} // Use local state
        onChangeText={handleGameNameChange} // Use debounced handler
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
                  value={localPlayerNames[player.id] || player.name} // Use local state
                  onChangeText={(text) => handlePlayerNameChange(player.id, text)} // Use debounced handler
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
        <View style={[styles.statsContainer, theme === 'light' && styles.lightCard]}>
          <Text style={[styles.statsTitle, theme === 'light' && styles.lightText]}>📊 Advanced Game Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, theme === 'light' && styles.lightSubtext]}>Total Time</Text>
              <Text style={[styles.statValue, theme === 'light' && styles.lightText]}>
                {formatTime(players.reduce((sum, p) => sum + p.time, 0))}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, theme === 'light' && styles.lightSubtext]}>Active Player</Text>
              <Text style={[styles.statValue, theme === 'light' && styles.lightText]}>
                {activePlayerId ? players.find(p => p.id === activePlayerId)?.name : 'None'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, theme === 'light' && styles.lightSubtext]}>Players</Text>
              <Text style={[styles.statValue, theme === 'light' && styles.lightText]}>{players.length}</Text>
            </View>
            {(() => {
              const stats = calculateGameStats();
              return stats ? (
                <>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, theme === 'light' && styles.lightSubtext]}>Average Turn</Text>
                    <Text style={[styles.statValue, theme === 'light' && styles.lightText]}>
                      {formatTime(Math.round(stats.averageTime))}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, theme === 'light' && styles.lightSubtext]}>Longest Turn</Text>
                    <Text style={[styles.statValue, theme === 'light' && styles.lightText]}>
                      {formatTime(stats.longestTurn)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, theme === 'light' && styles.lightSubtext]}>Shortest Turn</Text>
                    <Text style={[styles.statValue, theme === 'light' && styles.lightText]}>
                      {formatTime(stats.shortestTurn)}
                    </Text>
                  </View>
                </>
              ) : null;
            })()}
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
          <View style={[styles.modalContent, theme === 'light' && styles.lightModal]}>
            <Text style={[styles.modalTitle, theme === 'light' && styles.lightText]}>⚙️ Settings</Text>
            
            <View style={styles.settingSection}>
              <Text style={[styles.settingLabel, theme === 'light' && styles.lightText]}>Theme</Text>
              <View style={styles.settingOptions}>
                <TouchableOpacity
                  style={[
                    styles.settingOption,
                    theme === 'dark' && styles.settingOptionActive,
                    theme === 'light' && styles.lightSettingOption
                  ]}
                  onPress={() => setTheme('dark')}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.settingOptionText,
                    theme === 'dark' && styles.settingOptionTextActive,
                    theme === 'light' && styles.lightText
                  ]}>🌙 Dark</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.settingOption,
                    theme === 'light' && styles.settingOptionActive,
                    theme === 'light' && styles.lightSettingOption
                  ]}
                  onPress={() => setTheme('light')}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.settingOptionText,
                    theme === 'light' && styles.settingOptionTextActive,
                    theme === 'light' && styles.lightText
                  ]}>☀️ Light</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={[styles.settingLabel, theme === 'light' && styles.lightText]}>Player Box Size</Text>
              <View style={styles.settingOptions}>
                {(['auto', 'large', 'medium', 'small', 'compact'] as PlayerBoxSize[]).map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.settingOption,
                      playerBoxSize === size && styles.settingOptionActive,
                      theme === 'light' && styles.lightSettingOption
                    ]}
                    onPress={() => setPlayerBoxSize(size)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.settingOptionText,
                      playerBoxSize === size && styles.settingOptionTextActive,
                      theme === 'light' && styles.lightText
                    ]}>
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.settingDescription, theme === 'light' && styles.lightSubtext]}>
                Auto: Optimizes layout to fit all players on screen without scrolling
              </Text>
            </View>

            <View style={styles.settingSection}>
              <Text style={[styles.settingLabel, theme === 'light' && styles.lightText]}>Turn Notifications</Text>
              <TouchableOpacity
                style={[
                  styles.settingToggle,
                  playTurnSounds && styles.settingToggleActive,
                  theme === 'light' && styles.lightSettingOption
                ]}
                onPress={() => setPlayTurnSounds(!playTurnSounds)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.settingToggleText,
                  playTurnSounds && styles.settingToggleTextActive,
                  theme === 'light' && styles.lightText
                ]}>
                  🔊 {playTurnSounds ? 'Sound On' : 'Sound Off'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingSection}>
              <Text style={[styles.settingLabel, theme === 'light' && styles.lightText]}>Timer Mode</Text>
              <View style={styles.settingOptions}>
                <TouchableOpacity
                  style={[
                    styles.settingOption,
                    timerMode === 'countup' && styles.settingOptionActive,
                    theme === 'light' && styles.lightSettingOption
                  ]}
                  onPress={() => setTimerMode('countup')}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.settingOptionText,
                    timerMode === 'countup' && styles.settingOptionTextActive,
                    theme === 'light' && styles.lightText
                  ]}>Count Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.settingOption,
                    timerMode === 'countdown' && styles.settingOptionActive,
                    theme === 'light' && styles.lightSettingOption
                  ]}
                  onPress={() => setTimerMode('countdown')}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.settingOptionText,
                    timerMode === 'countdown' && styles.settingOptionTextActive,
                    theme === 'light' && styles.lightText
                  ]}>Count Down</Text>
                </TouchableOpacity>
              </View>
            </View>

            {timerMode === 'countdown' && (
              <View style={styles.settingSection}>
                <Text style={[styles.settingLabel, theme === 'light' && styles.lightText]}>Initial Time (minutes)</Text>
                <TextInput
                  style={[styles.settingInput, theme === 'light' && styles.lightInput]}
                  value={String(initialTime / 60)}
                  onChangeText={(text) => setInitialTime(parseInt(text) * 60 || 600)}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={theme === 'light' ? "#666" : "#999"}
                />
              </View>
            )}
            
            <TouchableOpacity
              style={[styles.modalCloseButton, styles.buttonWithFeedback]}
              onPress={() => setShowSettings(false)}
              activeOpacity={0.8}
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
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 4,
    lineHeight: 16,
  },
  settingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  settingOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightSettingOption: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingOptionActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  settingOptionText: {
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  settingOptionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  settingToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    minHeight: 48,
  },
  settingToggleActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  settingToggleText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '500',
  },
  settingToggleTextActive: {
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
    minHeight: 48,
  },
  lightInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    color: '#2d3748',
  },
  modalCloseButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 48,
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BoardGameTimer;