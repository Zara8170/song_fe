import { fetchWithAuth } from './fetchWithAuth';
import { Song } from './song';

// 플레이리스트 기본 정보
export interface Playlist {
  playlistId: number;
  title: string;
  description?: string;
  isPublic: boolean;
  memberId: number;
  memberEmail: string;
  createdAt: string;
  modifiedAt: string;
  songCount: number;
}

// 플레이리스트 상세 정보 (곡 목록 포함)
export interface PlaylistDetail extends Playlist {
  songs: PlaylistSong[];
}

// 플레이리스트 내 곡 정보
export interface PlaylistSong {
  id: number;
  playlistId: number;
  order: number;
  song: Song;
}

// 플레이리스트 생성 DTO
export interface PlaylistCreateDTO {
  title: string;
  description?: string;
  isPublic?: boolean;
}

// 플레이리스트 수정 DTO
export interface PlaylistUpdateDTO {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

// 플레이리스트에 곡 추가 DTO
export interface PlaylistAddSongDTO {
  songId: number;
  order?: number;
}

// 페이징 응답 형식
export interface PagedResponse<T> {
  dtoList: T[];
  pageNumList: number[];
  pageRequestDTO: {
    page: number;
    size: number;
    sort: string;
  };
  prev: boolean;
  next: boolean;
  totalCount: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
}

// 1. 플레이리스트 CRUD

/**
 * 플레이리스트 생성
 */
export async function createPlaylist(
  data: PlaylistCreateDTO,
): Promise<Playlist> {
  const res = await fetchWithAuth('/api/playlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * 플레이리스트 상세 조회
 */
export async function getPlaylistDetail(
  playlistId: number,
): Promise<PlaylistDetail> {
  const res = await fetchWithAuth(`/api/playlist/${playlistId}`);
  return res.json();
}

/**
 * 플레이리스트 수정
 */
export async function updatePlaylist(
  playlistId: number,
  data: PlaylistUpdateDTO,
): Promise<Playlist> {
  const res = await fetchWithAuth(`/api/playlist/${playlistId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * 플레이리스트 삭제
 */
export async function deletePlaylist(playlistId: number): Promise<void> {
  await fetchWithAuth(`/api/playlist/${playlistId}`, {
    method: 'DELETE',
  });
}

// 2. 플레이리스트 목록 조회

/**
 * 내 플레이리스트 목록 조회
 */
export async function getMyPlaylists(): Promise<Playlist[]> {
  const res = await fetchWithAuth('/api/playlist/my');
  const playlists = await res.json();

  // 생성일 기준으로 오름차순 정렬 (오래된 것부터)
  return playlists.sort((a: Playlist, b: Playlist) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

/**
 * 내 플레이리스트 목록 조회 (페이징)
 */
export async function getMyPlaylistsPaged(
  page: number = 1,
  size: number = 10,
  sort: string = 'desc',
): Promise<PagedResponse<Playlist>> {
  const res = await fetchWithAuth(
    `/api/playlist/my/paging?page=${page}&size=${size}&sort=${sort}`,
  );
  return res.json();
}

/**
 * 공개 플레이리스트 목록 조회
 */
export async function getPublicPlaylists(
  page: number = 1,
  size: number = 10,
  sort: string = 'desc',
): Promise<PagedResponse<Playlist>> {
  const res = await fetchWithAuth(
    `/api/playlist/public?page=${page}&size=${size}&sort=${sort}`,
  );
  return res.json();
}

/**
 * 플레이리스트 검색
 */
export async function searchPlaylists(title: string): Promise<Playlist[]> {
  const res = await fetchWithAuth(
    `/api/playlist/search?title=${encodeURIComponent(title)}`,
  );
  const playlists = await res.json();

  // 생성일 기준으로 오름차순 정렬 (오래된 것부터)
  return playlists.sort((a: Playlist, b: Playlist) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

// 3. 플레이리스트 곡 관리

/**
 * 플레이리스트에 곡 추가
 */
export async function addSongToPlaylist(
  playlistId: number,
  data: PlaylistAddSongDTO,
): Promise<PlaylistSong> {
  const res = await fetchWithAuth(`/api/playlist/${playlistId}/songs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * 플레이리스트에서 곡 삭제
 */
export async function removeSongFromPlaylist(
  playlistId: number,
  songId: number,
): Promise<void> {
  await fetchWithAuth(`/api/playlist/${playlistId}/songs/${songId}`, {
    method: 'DELETE',
  });
}

/**
 * 플레이리스트 곡 목록 조회
 */
export async function getPlaylistSongs(
  playlistId: number,
): Promise<PlaylistSong[]> {
  const res = await fetchWithAuth(`/api/playlist/${playlistId}/songs`);
  return res.json();
}

/**
 * 플레이리스트 곡 순서 변경
 */
export async function updateSongOrder(
  playlistId: number,
  songId: number,
  newOrder: number,
): Promise<void> {
  await fetchWithAuth(
    `/api/playlist/${playlistId}/songs/${songId}/order?newOrder=${newOrder}`,
    {
      method: 'PUT',
    },
  );
}

// 유틸리티 함수

/**
 * "좋아요 표시한 음악" 플레이리스트 생성 또는 조회
 */
export async function getOrCreateLikedSongsPlaylist(): Promise<Playlist> {
  try {
    // 먼저 기존 플레이리스트 중 "좋아요 표시한 음악" 찾기
    const playlists = await getMyPlaylists();
    const likedSongsPlaylist = playlists.find(
      playlist => playlist.title === '좋아요 표시한 음악',
    );

    if (likedSongsPlaylist) {
      return likedSongsPlaylist;
    }

    // 없으면 새로 생성
    return await createPlaylist({
      title: '좋아요 표시한 음악',
      description: '좋아요를 표시한 모든 노래들',
      isPublic: false,
    });
  } catch (error) {
    console.error('Failed to get or create liked songs playlist:', error);
    throw error;
  }
}

/**
 * 좋아요 표시한 음악 플레이리스트에 곡 추가
 */
export async function addSongToLikedPlaylist(songId: number): Promise<void> {
  try {
    const likedSongsPlaylist = await getOrCreateLikedSongsPlaylist();
    await addSongToPlaylist(likedSongsPlaylist.playlistId, { songId });
  } catch (error) {
    console.error('Failed to add song to liked playlist:', error);
    throw error;
  }
}

/**
 * 좋아요 표시한 음악 플레이리스트에서 곡 삭제
 */
export async function removeSongFromLikedPlaylist(
  songId: number,
): Promise<void> {
  try {
    const likedSongsPlaylist = await getOrCreateLikedSongsPlaylist();
    await removeSongFromPlaylist(likedSongsPlaylist.playlistId, songId);
  } catch (error) {
    console.error('Failed to remove song from liked playlist:', error);
    throw error;
  }
}
