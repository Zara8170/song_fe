import { fetchWithAuth } from './fetchWithAuth';

export interface Song {
  songId: number;
  tj_number: number;
  ky_number: number;
  title_kr: string;
  title_en: string;
  title_jp: string;
  title_yomi?: string;
  artist: string;
  artist_kr: string;
  likedByMe: boolean;
}

export interface SongListResponse {
  dtoList: Song[];
  next: boolean;
}

export interface RecommendationSong {
  title_jp: string;
  title_kr: string;
  title_en: string;
  title_yomi?: string;
  artist: string;
  artist_kr: string;
  tj_number: string;
  ky_number: string;
}

export interface RecommendationGroup {
  label: string;
  tagline: string;
  songs: RecommendationSong[];
}

export interface RecommendationCandidate {
  song_id: number;
  title_jp: string;
  title_kr: string;
  title_en: string;
  title_yomi?: string;
  artist: string;
  artist_kr: string;
  genre: string;
  mood: string;
  tj_number: string;
  ky_number: string;
  recommendation_type: 'preference' | 'random';
  matched_criteria: string[];
}

export interface RecommendationResponse {
  groups: RecommendationGroup[];
  candidates: RecommendationCandidate[];
}

export interface CachedRecommendationSong {
  id: number;
  title: string;
  artist: string;
  similarity_score?: number;
  score?: number;
  reason?: string;
}

export interface CachedRecommendationGroup {
  name: string;
  songs: CachedRecommendationSong[];
}

export interface CachedRecommendationResponse {
  favorite_song_ids: number[];
  groups: CachedRecommendationGroup[];
  candidates: CachedRecommendationSong[];
  generated_date: string;
  cached: boolean;
}

// 요청 상태 응답 타입
export interface RecommendationStatusResponse {
  status: string;
  message: string;
  generatedDate: string;
}

export async function fetchSongs(
  page: number,
  size: number,
  signal?: AbortSignal,
): Promise<SongListResponse> {
  const res = await fetchWithAuth(`/api/song/list?page=${page}&size=${size}`, {
    signal,
  });
  return res.json();
}

export async function searchSongs(
  query: string,
  page: number,
  size: number,
  target: string = 'ALL',
  signal?: AbortSignal,
): Promise<SongListResponse> {
  const res = await fetchWithAuth(
    `/api/es/song/search?keyword=${encodeURIComponent(
      query,
    )}&target=${target}&page=${page}&size=${size}`,
    { signal },
  );
  return res.json();
}

export async function fetchSongsByIds(songIds: string[]): Promise<Song[]> {
  const res = await fetchWithAuth(`/api/song/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(songIds),
  });
  return res.json();
}

// 새로운 비동기 추천 요청 API
export const requestRecommendation = async (
  favoriteSongIds: number[],
): Promise<RecommendationStatusResponse> => {
  const requestBody = {
    favoriteSongIds: favoriteSongIds,
  };

  const res = await fetchWithAuth('/api/recommendation/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

// 캐시된 추천 결과 조회 API
export const getCachedRecommendation =
  async (): Promise<CachedRecommendationResponse> => {
    const res = await fetchWithAuth('/api/recommendation/cached', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  };

export async function toggleLike(songId: number) {
  const res = await fetchWithAuth(`/api/likes/songs/${songId}`, {
    method: 'POST',
  });
  return res.json() as Promise<{ songId: number; liked: boolean }>;
}

export async function fetchMyLikes(): Promise<Song[]> {
  const res = await fetchWithAuth('/api/likes');
  const data = await res.json();

  // 백엔드 응답이 배열이 아닌 경우 빈 배열 반환
  if (!Array.isArray(data)) {
    console.warn('fetchMyLikes: Backend response is not an array:', data);
    return [];
  }

  return data.filter((song: any) => song && song.songId !== undefined);
}
