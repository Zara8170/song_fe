import { API_BASE_URL } from '@env';

export interface Song {
  songId: number;
  tj_number: number;
  ky_number: number;
  title_kr: string;
  title_en: string;
  title_jp: string;
  artist: string;
}

export interface SongListResponse {
  dtoList: Song[];
  next: boolean;
}

export async function fetchSongs(
  page: number,
  size = 20,
  signal?: AbortSignal,
): Promise<SongListResponse> {
  const url = `${API_BASE_URL}/api/song/list?page=${page}&size=${size}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(`API error ${res.status} ${message}`);
  }

  return res.json() as Promise<SongListResponse>;
}
