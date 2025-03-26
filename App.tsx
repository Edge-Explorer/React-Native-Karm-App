import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Switch
} from 'react-native';

const { width, height } = Dimensions.get('window');

const QAScreen = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Replace this with your actual server address
  const SERVER_URL = 'http://10.0.2.2:5000'; // Change as needed for your environment

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${SERVER_URL}/api/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }
      
      const data = await response.json();
      
      if (data && data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer('Sorry, could not get an answer.');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setAnswer('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => {
    setQuestion('');
    setAnswer('');
  };

  // Colors for light and dark modes
  const colors = {
    light: {
      background: '#6a11cb',
      gradient: ['#6a11cb', '#2575fc'],
      text: '#FFFFFF',
      subtitleText: '#e0e0e0',
      inputBackground: 'rgba(255,255,255,0.9)',
      inputText: '#333',
      answerBackground: 'rgba(255,255,255,0.9)',
      answerText: '#333'
    },
    dark: {
      background: '#121212',
      gradient: ['#1a1a1a', '#333333'],
      text: '#e0e0e0',
      subtitleText: '#a0a0a0',
      inputBackground: 'rgba(50,50,50,0.9)',
      inputText: '#e0e0e0',
      answerBackground: 'rgba(50,50,50,0.9)',
      answerText: '#e0e0e0'
    }
  };

  // Get current theme colors
  const currentColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { 
      backgroundColor: currentColors.background 
    }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "light-content"} 
        backgroundColor={currentColors.background}
      />
      
      {/* Theme Toggle */}
      <View style={styles.themeToggleContainer}>
        <Text style={[styles.themeToggleText, { color: currentColors.text }]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch 
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: currentColors.text }]}>Karm AI</Text>
            <Text style={[styles.subtitle, { color: currentColors.subtitleText }]}>
              Your Intelligent Q&A Companion
            </Text>
          </View>

          {/* Input Container */}
          <View style={[
            styles.inputContainer, 
            { 
              backgroundColor: currentColors.inputBackground,
              borderColor: isDarkMode ? '#555' : '#fff'
            },
            isFocused && styles.inputContainerFocused
          ]}>
            <TextInput
              style={[
                styles.input,
                { color: currentColors.inputText }
              ]}
              placeholder="What would you like to know?"
              placeholderTextColor="#a0a0a0"
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={4}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {question.length > 0 && (
              <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (loading || !question.trim()) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonText}>Ask Karm AI</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Answer Container */}
          <View style={[
            styles.answerContainer,
            { backgroundColor: currentColors.answerBackground }
          ]}>
            <Text style={[
              styles.answerLabel,
              { color: currentColors.text }
            ]}>
              AI Response:
            </Text>
            <ScrollView 
              style={styles.answerScrollView}
              contentContainerStyle={styles.answerBox}
            >
              {answer ? (
                <Text style={[
                  styles.answerText,
                  { color: currentColors.answerText }
                ]}>
                  {answer}
                </Text>
              ) : (
                <Text style={styles.placeholderText}>
                  Your answer will appear here...
                </Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
    paddingTop: 10,
  },
  themeToggleText: {
    marginRight: 10,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainerFocused: {
    borderWidth: 2,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    maxHeight: 120,
  },
  clearButton: {
    padding: 10,
    marginRight: 10,
  },
  clearButtonText: {
    color: '#888',
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#c0c0c0',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#6a11cb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerContainer: {
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  answerLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  answerScrollView: {
    maxHeight: 200,
  },
  answerBox: {
    minHeight: 120,
  },
});

export default QAScreen;
