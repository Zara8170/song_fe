import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Song } from '../api/song';
import FavoriteButton from './FavoriteButton';
import styles from './SongListItem.styles';
import { Marquee } from '@animatereactnative/marquee';
import { useFavorites } from '../hooks/FavoritesContext';

interface SongListItemProps {
  item: Song;
  showFilter?: 'ALL' | 'TJ' | 'KY';
  onFavoriteAdd?: () => void;
  onFavoriteRemove?: () => void;
}

const SongListItem: React.FC<SongListItemProps> = ({
  item,
  showFilter = 'ALL',
  onFavoriteAdd,
  onFavoriteRemove,
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // View와 텍스트 크기 측정을 위한 상태
  const [songInfoWidth, setSongInfoWidth] = useState(0);
  const [mainTitleWidth, setMainTitleWidth] = useState(0);
  const [subTitleWidth, setSubTitleWidth] = useState(0);

  const isCurrentlyFavorite = isFavorite(item.songId);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite(item.songId);
      onFavoriteRemove?.();
    } else {
      addFavorite(item);
      onFavoriteAdd?.();
    }
  };

  const shouldShowTJ = showFilter === 'ALL' || showFilter === 'TJ';
  const shouldShowKY = showFilter === 'ALL' || showFilter === 'KY';

  // 곡 정보 텍스트
  const mainTitle = item.title_jp || item.title_en;
  const subTitle = item.artist;

  const shouldShowMainTitleMarquee =
    mainTitleWidth > songInfoWidth && songInfoWidth > 0;
  const shouldShowSubTitleMarquee =
    subTitleWidth > songInfoWidth && songInfoWidth > 0;

  return (
    <View style={styles.resultItem}>
      {/* 번호 박스 */}
      <View style={styles.numberColumn}>
        {shouldShowTJ && item.tj_number ? (
          <View style={styles.tjBox}>
            <Text style={styles.songTitle}>{item.tj_number}</Text>
          </View>
        ) : null}
        {shouldShowKY && item.ky_number ? (
          <View style={styles.kyBox}>
            <Text style={styles.songTitle}>{item.ky_number}</Text>
          </View>
        ) : null}
      </View>

      {/* 곡 정보 */}
      <View
        style={styles.songInfo}
        onLayout={event => {
          setSongInfoWidth(event.nativeEvent.layout.width);
        }}
      >
        {shouldShowMainTitleMarquee ? (
          <Marquee speed={0.3} spacing={150} style={{ width: '100%' }}>
            <Text style={styles.songTitle}>{mainTitle}</Text>
          </Marquee>
        ) : (
          <Text
            style={styles.songTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
            onTextLayout={event => {
              const textWidth = event.nativeEvent.lines[0]?.width || 0;
              setMainTitleWidth(textWidth);
            }}
          >
            {mainTitle}
          </Text>
        )}
        {shouldShowSubTitleMarquee ? (
          <Marquee speed={0.3} spacing={150} style={{ width: '100%' }}>
            <Text style={styles.songSub}>{subTitle}</Text>
          </Marquee>
        ) : (
          <Text
            style={styles.songSub}
            numberOfLines={1}
            ellipsizeMode="tail"
            onTextLayout={event => {
              const textWidth = event.nativeEvent.lines[0]?.width || 0;
              setSubTitleWidth(textWidth);
            }}
          >
            {subTitle}
          </Text>
        )}
      </View>

      {/* 즐겨찾기 버튼 */}
      <FavoriteButton
        isFavorite={isCurrentlyFavorite}
        onPress={handleToggleFavorite}
      />
    </View>
  );
};

export default SongListItem;
