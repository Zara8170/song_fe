import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './SearchTypeDropdown.styles';

export type SearchTargetType = 'ALL' | 'TITLE' | 'ARTIST';

interface SearchTypeDropdownProps {
  visible: boolean;
  onClose: () => void;
  currentType: SearchTargetType;
  onSelect: (type: SearchTargetType) => void;
  position: { x: number; y: number };
}

const SEARCH_TYPE_LABELS: Record<SearchTargetType, string> = {
  ALL: '통합 검색',
  TITLE: '제목 검색',
  ARTIST: '가수명 검색',
};

const SEARCH_TYPE_ICONS: Record<SearchTargetType, string> = {
  ALL: 'search',
  TITLE: 'musical-notes',
  ARTIST: 'person',
};

const SearchTypeDropdown: React.FC<SearchTypeDropdownProps> = ({
  visible,
  onClose,
  currentType,
  onSelect,
  position,
}) => {
  const handleSelect = (type: SearchTargetType) => {
    onSelect(type);
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Dropdown Menu */}
      <View style={[styles.dropdown, { top: position.y, left: position.x }]}>
        {(['ALL', 'TITLE', 'ARTIST'] as SearchTargetType[]).map(
          (type, index) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                currentType === type && styles.optionSelected,
                index === 0 && styles.optionFirst,
                index === 2 && styles.optionLast,
              ]}
              onPress={() => handleSelect(type)}
            >
              <Ionicons
                name={SEARCH_TYPE_ICONS[type]}
                size={16}
                color={currentType === type ? '#7ed6f7' : '#aaa'}
                style={styles.optionIcon}
              />
              <Text
                style={[
                  styles.optionText,
                  currentType === type && styles.optionTextSelected,
                ]}
              >
                {SEARCH_TYPE_LABELS[type]}
              </Text>
              {currentType === type && (
                <Ionicons name="checkmark" size={16} color="#7ed6f7" />
              )}
            </TouchableOpacity>
          ),
        )}
      </View>
    </>
  );
};

export default SearchTypeDropdown;
