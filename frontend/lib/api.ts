import type { Diary, DiaryCreate } from "../types/diary";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_BACKEND_HOST ||
  "http://localhost:8000"
).replace(/\/$/, "");

// APIのエラー情報を管理するクラス
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// FastAPIから返されるエラー内容を取得
async function getErrorMessage(
  response: Response
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map(
          (error: { msg?: string }) =>
            error.msg || "入力内容に誤りがあります"
        )
        .join("\n");
    }
  } catch {
    // JSON形式のエラーでない場合
  }

  if (response.status === 404) {
    return "指定された日記が見つかりません";
  }

  return `通信に失敗しました (${response.status})`;
}

// 共通のAPI通信処理
async function request(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        cache: "no-store",
        ...options,
      }
    );
  } catch {
    throw new Error(
      "バックエンドに接続できませんでした。サーバーの起動状態を確認してください。"
    );
  }

  if (!response.ok) {
    throw new ApiError(
      await getErrorMessage(response),
      response.status
    );
  }

  return response;
}

// 日記一覧の取得
export async function fetchDiaries(): Promise<Diary[]> {
  const response = await request("/diaries");

  return response.json();
}

// 日記詳細の取得
export async function fetchDiary(
  id: number | string
): Promise<Diary> {
  const response = await request(
    `/diaries/${encodeURIComponent(String(id))}`
  );

  return response.json();
}

// 日記の新規登録
export async function createDiary(
  diary: DiaryCreate
): Promise<Diary> {
  const response = await request("/diaries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(diary),
  });

  return response.json();
}

// 日記の編集
export async function updateDiary(
  id: number | string,
  diary: DiaryCreate
): Promise<Diary> {
  const response = await request(
    `/diaries/${encodeURIComponent(String(id))}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(diary),
    }
  );

  return response.json();
}

// 日記の削除
export async function deleteDiary(
  id: number | string
): Promise<void> {
  await request(
    `/diaries/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
    }
  );
}