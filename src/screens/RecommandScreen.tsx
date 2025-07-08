import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { requestRecommendation } from '../api/song';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './RecommandScreenStyles';
import { useFavorites } from '../hooks/FavoritesContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const RecommandScreen = () => {
  const { favorites } = useFavorites();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'user',
      };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInputText('');

      try {
        const payload = JSON.stringify({
          text: newUserMessage.text,
          favorites,
        });
        const response = await requestRecommendation(payload);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.recommendation,
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      } catch (error) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: '추천을 가져오는 데 실패했습니다.',
          sender: 'bot',
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RecommandScreen;
