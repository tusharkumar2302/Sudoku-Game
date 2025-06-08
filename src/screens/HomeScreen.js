// screens/HomeScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const spinValue = new Animated.Value(0);

  // Animation for the logo
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const difficulties = [
    {
      level: 'Easy',
      icon: 'smile-o',
      iconType: FontAwesome,
      color: theme.colors.difficultyEasy,
    },
    {
      level: 'Medium',
      icon: 'meh-o',
      iconType: FontAwesome,
      color: theme.colors.difficultyMedium,
    },
    {
      level: 'Hard',
      icon: 'frown-o',
      iconType: FontAwesome,
      color: theme.colors.difficultyHard,
    },
    {
      level: 'Expert',
      icon: 'flask',
      iconType: FontAwesome,
      color: theme.colors.difficultyExpert,
    },
  ];

  return (
    <ImageBackground
      source={theme.darkMode 
        ? require('../../assets/dark-bg.png') 
        : require('../../assets/light-bg.png')}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      resizeMode="cover">
      
      <View style={styles.overlay} />

      {/* Header */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon 
            name="grid-on" 
            size={60} 
            color={theme.colors.primary} 
            style={styles.logo}
          />
        </Animated.View>
        <Text style={[
          styles.title, 
          theme.typography.h1, 
          { color: theme.colors.text, marginTop: theme.spacing.medium }
        ]}>
          Sudoku Pro
        </Text>
        <Text style={[
          styles.subtitle, 
          { color: theme.colors.text }
        ]}>
          Challenge your mind
        </Text>
      </View>

      {/* Difficulty Selection */}
      <ScrollView 
        contentContainerStyle={[
          styles.difficultyContainer,
          { paddingBottom: theme.spacing.xlarge }
        ]}
        showsVerticalScrollIndicator={false}>
        {difficulties.map((item, index) => {
          const IconComponent = item.iconType;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.difficultyButton,
                { 
                  backgroundColor: item.color,
                  marginBottom: theme.spacing.medium,
                  borderRadius: theme.borderRadius.large,
                  padding: theme.spacing.large,
                }
              ]}
              onPress={() => navigation.navigate('Game', { difficulty: item.level })}
              activeOpacity={0.8}>
              <View style={styles.buttonContent}>
                <IconComponent 
                  name={item.icon} 
                  size={32} 
                  color="white" 
                  style={styles.buttonIcon}
                />
                <Text style={[
                  styles.difficultyText,
                  theme.typography.button,
                  { color: 'white' }
                ]}>
                  {item.level}
                </Text>
              </View>
              <Icon 
                name="chevron-right" 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Theme Toggle */}
      <TouchableOpacity
        style={[
          styles.themeToggle,
          { 
            backgroundColor: theme.colors.card,
            borderRadius: 50,
            padding: theme.spacing.small,
            elevation: 5,
          }
        ]}
        onPress={theme.toggleDarkMode}>
        <Icon
          name={theme.darkMode ? 'wb-sunny' : 'nights-stay'}
          size={28}
          color={theme.colors.icon}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

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
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 10,
  },
  title: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
  },
  difficultyContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  difficultyButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 15,
  },
  difficultyText: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default HomeScreen;