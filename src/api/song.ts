import { API_BASE_URL } from '@env';

export interface Song {
  songId: number;
  tj_number: number;
  ky_number: number;
  title_kr: string;
  title_en: string;
  title_jp: string;
  artist: string;
  artist_kr: string;
}

export interface SongListResponse {
  dtoList: Song[];
  next: boolean;
}

export async function fetchSongs(
  page: number,
  size: number,
  signal?: AbortSignal,
): Promise<SongListResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/song/list?page=${page}&size=${size}`,
    { signal },
  );
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function searchSongs(
  query: string,
  page: number,
  size: number,
  target: string = 'ALL',
  signal?: AbortSignal,
): Promise<SongListResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/es/song/search?keyword=${encodeURIComponent(
      query,
    )}&target=${target}&page=${page}&size=${size}`,
    { signal },
  );
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function fetchSongsByIds(songIds: string[]): Promise<Song[]> {
  const res = await fetch(`${API_BASE_URL}/api/song/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(songIds),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

interface RecommendationResponseFromPythonDTO {
  recommendation: string;
}

export const requestRecommendation = async (
  message: string,
): Promise<RecommendationResponseFromPythonDTO> => {
  const res = await fetch(`${API_BASE_URL}/api/recommendation/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
};
