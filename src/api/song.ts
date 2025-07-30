import { fetchWithAuth } from './fetchWithAuth';

export interface Song {
  songId: number;
  tj_number: number;
  ky_number: number;
  title_kr: string;
  title_en: string;
  title_jp: string;
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
): Promise<RecommendationResponse> => {
  const requestBody = {
    favorite_song_ids: favoriteSongIds,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetchWithAuth('/api/recommendation/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 30 seconds');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
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
  return data.filter((song: any) => song && song.songId !== undefined);
}
