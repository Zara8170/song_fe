import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const favoriteIds = favorites
        .map(id => Number(id))
        .filter(id => !Number.isNaN(id));

      const { message } = await requestRecommendation(
        userMsg.text,
        favoriteIds,
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: message,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: '추천을 가져오는 데 실패했습니다.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
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
      />
      {isLoading && (
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          <ActivityIndicator size="small" color="#4FC3F7" />
          <Text style={{ color: '#888', marginTop: 4 }}>추천 생성중...</Text>
        </View>
      )}
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
