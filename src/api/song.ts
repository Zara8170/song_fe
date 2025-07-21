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
  const res = await fetchWithAuth(`/api/song/list?page=${page}&size=${size}`, {
    signal,
  });
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
  const res = await fetchWithAuth(
    `/api/es/song/search?keyword=${encodeURIComponent(
      query,
    )}&target=${target}&page=${page}&size=${size}`,
    { signal },
  );
  if (!res.ok) {
    throw new Error('검색에 실패했습니다');
  }
  return res.json();
}

export async function fetchSongsByIds(songIds: string[]): Promise<Song[]> {
  const res = await fetchWithAuth(`/api/song/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(songIds),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

interface RecommendationResponse {
  message: string;
}

export const requestRecommendation = async (
  text: string,
  favoriteSongIds: number[],
): Promise<RecommendationResponse> => {
  const res = await fetchWithAuth(`/api/recommendation/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      favorite_song_ids: favoriteSongIds,
    }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
};
