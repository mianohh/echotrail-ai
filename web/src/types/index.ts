export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  mood: string;
  energy_level: number;
  image_data?: string;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  title: string;
  content: string;
  mood?: string;
  energy_level?: number;
  image_data?: string;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  mood?: string;
  energy_level?: number;
  image_data?: string;
}

export interface Moment {
  id: number;
  title: string;
  summary: string;
  emotional_tone: 'Positive' | 'Neutral' | 'Negative';
  emotional_score: number;
  keywords: string[];
  reflection_prompt: string;
  start_date: string;
  end_date: string;
  note_count: number;
  note_ids: number[];
  created_at: string;
}

export interface AnalysisRequest {
  start_date?: string;
  end_date?: string;
  min_cluster_size?: number;
}

export interface AnalysisResponse {
  moments: Moment[];
  total_notes_analyzed: number;
  analysis_time: number;
}

export interface InsightsStats {
  total_notes: number;
  total_moments: number;
  mood_distribution: Record<string, number>;
  energy_trends: Array<{
    date: string;
    average_energy: number;
    note_count: number;
  }>;
  recent_activity: number;
  date_range: {
    start: string | null;
    end: string | null;
  };
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}