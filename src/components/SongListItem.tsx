import React from 'react';
import { View, Text } from 'react-native';
import { Song } from '../api/song';
import FavoriteButton from './FavoriteButton';
import styles from './SongListItem.styles';
import { Marquee } from '@animatereactnative/marquee';

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
  const shouldShowTJ = showFilter === 'ALL' || showFilter === 'TJ';
  const shouldShowKY = showFilter === 'ALL' || showFilter === 'KY';

  // 곡 정보 텍스트
  const mainTitle = [item.title_kr, ' - ', item.artist_kr].join('');
  const subTitle = [item.title_jp || item.title_en, ' - ', item.artist].join(
    '',
  );

  const TITLE_LENGTH_THRESHOLD = 25;
  const SUBTITLE_LENGTH_THRESHOLD = 25;

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
      <View style={styles.songInfo}>
        {mainTitle.length > TITLE_LENGTH_THRESHOLD ? (
          <Marquee speed={1} spacing={20} style={{ width: '100%' }}>
            <Text style={styles.songTitle}>{mainTitle}</Text>
          </Marquee>
        ) : (
          <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">
            {mainTitle}
          </Text>
        )}
        {subTitle.length > SUBTITLE_LENGTH_THRESHOLD ? (
          <Marquee speed={1} spacing={20} style={{ width: '100%' }}>
            <Text style={styles.songSub}>{subTitle}</Text>
          </Marquee>
        ) : (
          <Text style={styles.songSub} numberOfLines={1} ellipsizeMode="tail">
            {subTitle}
          </Text>
        )}
      </View>

      {/* 즐겨찾기 버튼 */}
      <FavoriteButton
        songId={item.songId.toString()}
        onAdd={onFavoriteAdd}
        onRemove={onFavoriteRemove}
      />
    </View>
  );
};

export default SongListItem;
