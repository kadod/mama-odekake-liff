-- ママ向けお出かけスポット検索アプリ
-- Supabaseデータベーススキーマ

-- スポット情報テーブル
CREATE TABLE IF NOT EXISTS spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,

  -- 設備情報
  parking TEXT CHECK (parking IN ('無料', '有料', 'なし')),
  stroller_friendly BOOLEAN DEFAULT false,
  nursing_room BOOLEAN DEFAULT false,
  diaper_change BOOLEAN DEFAULT false,
  restroom_types TEXT[], -- ['子ども用', '洋式', 'おむつ台'] など

  -- 混雑状況
  congestion_level TEXT CHECK (congestion_level IN ('low', 'medium', 'high')),

  -- メディア
  photos TEXT[], -- 画像URL配列

  -- 口コミ・説明
  reviews_ai TEXT, -- AI生成の要約
  description TEXT,

  -- メタデータ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- インデックス作成（位置情報検索用）
CREATE INDEX IF NOT EXISTS spots_location_idx ON spots (lat, lng);

-- 更新日時自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_spots_updated_at
  BEFORE UPDATE ON spots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 有効化
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "スポット情報は全ユーザーが閲覧可能"
  ON spots FOR SELECT
  USING (true);

-- 管理者のみ編集可能（将来的にロール管理を追加）
-- CREATE POLICY "管理者のみスポット編集可能"
--   ON spots FOR ALL
--   USING (auth.role() = 'admin');
