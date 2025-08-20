import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './SearchTypeDropdown.styles';

export type SearchTargetType = 'ALL' | 'TITLE' | 'ARTIST' | 'ANIME';

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
  ANIME: '애니, 드라마, 영화 검색',
};

const SEARCH_TYPE_ICONS: Record<SearchTargetType, string> = {
  ALL: 'search',
  TITLE: 'musical-notes',
  ARTIST: 'person',
  ANIME: 'tv',
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

  const adjustedPosition = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const dropdownWidth = 200;
    const padding = 16;

    let left = position.x;

    // 화면 오른쪽 경계를 벗어나는 경우 조정
    if (left + dropdownWidth > screenWidth - padding) {
      left = screenWidth - dropdownWidth - padding;
    }

    // 화면 왼쪽 경계를 벗어나는 경우 조정
    if (left < padding) {
      left = padding;
    }

    return {
      x: left,
      y: position.y,
    };
  }, [position]);

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
      <View
        style={[
          styles.dropdown,
          { top: adjustedPosition.y, left: adjustedPosition.x },
        ]}
      >
        {(['ALL', 'TITLE', 'ARTIST', 'ANIME'] as SearchTargetType[]).map(
          (type, index) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                currentType === type && styles.optionSelected,
                index === 0 && styles.optionFirst,
                index === 3 && styles.optionLast,
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
