export type DiaryCreate = {
  title: string;
  content: string;
  diary_date: string;
  mood: string | null;
  weather: string | null;
};

export type Diary = DiaryCreate & {
  id: number;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};