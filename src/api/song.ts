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
  tj_number: number;
  ky_number: number;
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
  tj_number: number;
  ky_number: number;
  recommendation_type: 'preference' | 'random';
  matched_criteria: string[];
  match_score?: number;
  reason?: string;
}

export interface RecommendationResponse {
  favorite_song_ids: number[];
  groups: RecommendationGroup[];
  candidates: RecommendationCandidate[];
  generated_date: string;
}

export interface CachedRecommendationSong {
  id: number;
  title: string;
  title_kr?: string;
  title_jp?: string;
  title_en?: string;
  title_yomi?: string;
  artist: string;
  artist_kr?: string;
  similarity_score?: number;
  score?: number;
  tj_number?: number;
  ky_number?: number;
  genre?: string;
  mood?: string;
  match_score?: number;
  reason?: string;
}

export interface CachedRecommendationGroup {
  name: string;
  tagline?: string;
  songs: CachedRecommendationSong[];
}

export interface CachedRecommendationResponse {
  favorite_song_ids: number[];
  groups: CachedRecommendationGroup[];
  candidates: CachedRecommendationSong[];
  generated_date: string;
  cached: boolean;
}

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

    const data: RecommendationResponse = await res.json();

    // 새로운 API 응답을 기존 화면 구조에 맞게 변환
    const transformedData: CachedRecommendationResponse = {
      favorite_song_ids: data.favorite_song_ids,
      generated_date: data.generated_date,
      cached: true,
      groups: data.groups.map(group => ({
        name: group.label,
        tagline: group.tagline,
        songs: group.songs.map(song => ({
          id: 0, // API에 id가 없으므로 임시값
          title: song.title_kr || song.title_en || song.title_jp || '',
          title_kr: song.title_kr,
          title_jp: song.title_jp,
          title_en: song.title_en,
          title_yomi: song.title_yomi,
          artist: song.artist_kr || song.artist || '',
          artist_kr: song.artist_kr,
          tj_number: song.tj_number,
          ky_number: song.ky_number,
        })),
      })),
      candidates: data.candidates.map(candidate => ({
        id: candidate.song_id,
        title:
          candidate.title_kr || candidate.title_en || candidate.title_jp || '',
        title_kr: candidate.title_kr,
        title_jp: candidate.title_jp,
        title_en: candidate.title_en,
        title_yomi: candidate.title_yomi,
        artist: candidate.artist_kr || candidate.artist || '',
        artist_kr: candidate.artist_kr,
        tj_number: candidate.tj_number,
        ky_number: candidate.ky_number,
        genre: candidate.genre,
        mood: candidate.mood,
        match_score: candidate.match_score,
        reason: candidate.reason,
      })),
    };

    return transformedData;
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

  if (!Array.isArray(data)) {
    console.warn('fetchMyLikes: Backend response is not an array:', data);
    return [];
  }

  return data.filter((song: any) => song && song.songId !== undefined);
}
