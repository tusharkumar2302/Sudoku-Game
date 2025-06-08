// screens/GameScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../context/ThemeContext';
import { generateSudoku, solveSudoku, isSafe } from '../utils/sudoku';

const GameScreen = ({ route, navigation }) => {
  const { difficulty } = route.params;
  const theme = useContext(ThemeContext);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const pulseAnim = new Animated.Value(1);

  // Initialize game
  useEffect(() => {
    startNewGame();
    const timerInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Pulse animation for selected cell
  useEffect(() => {
    if (selectedCell) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [selectedCell]);

  const startNewGame = () => {
    const { puzzle, solution: sol } = generateSudoku(difficulty);
    setBoard(puzzle);
    setSolution(sol);
    setSelectedCell(null);
    setMistakes(0);
    setTimer(0);
    setIsComplete(false);
  };

  const handleCellPress = (row, col) => {
    if (board[row][col].fixed) return;
    setSelectedCell({ row, col });
  };

  const handleNumberPress = (num) => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    const newBoard = [...board];
    
    if (solution[row][col].value === num) {
      newBoard[row][col].value = num;
      newBoard[row][col].isCorrect = true;
      setBoard(newBoard);
      
      if (checkCompletion(newBoard)) {
        setIsComplete(true);
        showCompletionAlert();
      }
    } else {
      newBoard[row][col].value = num;
      newBoard[row][col].isCorrect = false;
      setBoard(newBoard);
      setMistakes(prev => prev + 1);
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const showCompletionAlert = () => {
    Alert.alert(
      '🎉 Congratulations!',
      `You solved the ${difficulty} puzzle in ${formatTime(timer)} with ${mistakes} mistake${mistakes !== 1 ? 's' : ''}!`,
      [
        { 
          text: 'New Game', 
          onPress: startNewGame,
          style: 'default'
        },
        { 
          text: 'Back to Home', 
          onPress: () => navigation.goBack(),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  const checkCompletion = (currentBoard) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col].value === 0 || !currentBoard[row][col].isCorrect) {
          return false;
        }
      }
    }
    return true;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getHint = () => {
    if (!selectedCell || isComplete) return;
    
    const { row, col } = selectedCell;
    const newBoard = [...board];
    newBoard[row][col].value = solution[row][col].value;
    newBoard[row][col].isCorrect = true;
    setBoard(newBoard);
    
    if (checkCompletion(newBoard)) {
      setIsComplete(true);
      showCompletionAlert();
    }
  };

  const getDifficultyColor = () => {
    switch(difficulty) {
      case 'Easy': return theme.colors.difficultyEasy;
      case 'Medium': return theme.colors.difficultyMedium;
      case 'Hard': return theme.colors.difficultyHard;
      case 'Expert': return theme.colors.difficultyExpert;
      default: return theme.colors.primary;
    }
  };

  if (board.length === 0) {
    return (
      <ImageBackground
        source={theme.darkMode ? require('../../assets/dark-bg.png') : require('../../assets/light-bg.png')}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        resizeMode="cover">
        <View style={styles.overlay} />
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={theme.darkMode ? require('../../assets/dark-bg.png') : require('../../assets/light-bg.png')}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      resizeMode="cover">
      <View style={styles.overlay} />

      {/* Header */}
      <View style={[styles.header, { marginTop: theme.spacing.large }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}>
          <Icon name="arrow-back" size={24} color={theme.colors.icon} />
        </TouchableOpacity>
        
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={[styles.difficultyText, theme.typography.button]}>{difficulty}</Text>
        </View>
        
        <View style={styles.stats}>
          <View style={[styles.timerBadge, { backgroundColor: theme.colors.card }]}>
            <Icon name="timer" size={16} color={theme.colors.icon} style={styles.statIcon} />
            <Text style={[styles.statText, { color: theme.colors.text }]}>{formatTime(timer)}</Text>
          </View>
          
          <View style={[styles.mistakesBadge, { 
            backgroundColor: mistakes >= 3 ? theme.colors.accent : theme.colors.card 
          }]}>
            <Icon 
              name={mistakes >= 3 ? "error" : "error-outline"} 
              size={16} 
              color={mistakes >= 3 ? 'white' : theme.colors.icon} 
              style={styles.statIcon} 
            />
            <Text style={[
              styles.statText, 
              { color: mistakes >= 3 ? 'white' : theme.colors.text }
            ]}>
              {mistakes}/3
            </Text>
          </View>
        </View>
      </View>

      {/* Sudoku Board */}
      <View style={styles.boardContainer}>
        <View style={[
          styles.board, 
          { 
            borderColor: getDifficultyColor(),
            shadowColor: getDifficultyColor(),
            backgroundColor: theme.colors.card,
          }
        ]}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => {
                const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;
                const isSameNumber = selectedCell && board[selectedCell.row][selectedCell.col].value !== 0 && 
                  board[selectedCell.row][selectedCell.col].value === cell.value;
                const hasError = cell.value !== 0 && !cell.isCorrect;
                const isHighlighted = isSelected || isSameNumber;
                
                return (
                  <Animated.View
                    key={`${rowIndex}-${colIndex}`}
                    style={[
                      {
                        transform: isSelected ? [{ scale: pulseAnim }] : [{ scale: 1 }],
                      }
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.cell,
                        { 
                          backgroundColor: cell.fixed 
                            ? theme.colors.fixedCell 
                            : isHighlighted
                              ? `${getDifficultyColor()}33`
                              : theme.colors.cellBackground,
                          borderColor: theme.colors.cellBorder,
                        },
                        rowIndex % 3 === 2 && rowIndex !== 8 && styles.bottomBorder,
                        colIndex % 3 === 2 && colIndex !== 8 && styles.rightBorder,
                        isSelected && { borderColor: getDifficultyColor() },
                        hasError && styles.errorCell,
                      ]}
                      onPress={() => handleCellPress(rowIndex, colIndex)}
                    >
                      <Text style={[
                        styles.cellText,
                        theme.typography.body,
                        { 
                          color: hasError
                            ? theme.colors.accent
                            : cell.fixed
                              ? theme.colors.text
                              : getDifficultyColor(),
                          fontWeight: cell.fixed ? 'bold' : 'normal',
                          fontSize: cellSize * 0.5,
                        },
                      ]}>
                        {cell.value !== 0 ? cell.value : ''}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Number Pad */}
      <View style={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.numberButton, 
              { 
                backgroundColor: getDifficultyColor(),
                margin: theme.spacing.small,
                borderRadius: theme.borderRadius.medium,
              }
            ]}
            onPress={() => handleNumberPress(num)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.numberText, 
              theme.typography.button,
              { color: 'white' }
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.numberButton, 
            { 
              backgroundColor: theme.colors.accent,
              margin: theme.spacing.small,
              borderRadius: theme.borderRadius.medium,
            }
          ]}
          onPress={getHint}
          activeOpacity={0.7}
        >
          <Icon name="lightbulb-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get('window');
const cellSize = (width - 60) / 9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  backButton: {
    padding: 10,
    borderRadius: 50,
    elevation: 3,
  },
  difficultyBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
  },
  difficultyText: {
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stats: {
    flexDirection: 'row',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    elevation: 3,
  },
  mistakesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
  },
  statIcon: {
    marginRight: 5,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  board: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  cellText: {
    textAlign: 'center',
  },
  bottomBorder: {
    borderBottomWidth: 2,
  },
  rightBorder: {
    borderRightWidth: 2,
  },
  errorCell: {
    backgroundColor: '#fd79a822',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  numberButton: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  numberText: {
    textAlign: 'center',
  },
});

export default GameScreen;