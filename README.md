# ママのおでかけスポット検索 LIFF アプリ

LINE LIFFを使った、ママ向けお出かけスポット検索アプリのMVPです。

## 機能

- 現在地から近くの子連れスポットを検索
- ベビーカー・駐車場・授乳室などの設備情報を一目で確認
- Google Mapsと連携してルート案内
- LINEアカウントで簡単ログイン

## 技術スタック

- **フロントエンド**: React + Vite
- **LIFF SDK**: LINE LIFF
- **データベース**: Supabase (PostgreSQL)
- **地図連携**: Google Maps API

## セットアップ手順

### 1. 環境変数の設定

`.env.example`を`.env`にコピーして、必要な値を設定してください。

```bash
cp .env.example .env
```

`.env`ファイルに以下の値を設定:

```env
VITE_LIFF_ID=your_liff_id_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseデータベースのセットアップ

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. SQL Editorで`supabase/schema.sql`を実行してテーブルを作成
3. `supabase/seed.sql`を実行してサンプルデータを投入

### 4. LINE Developersの設定

1. [LINE Developers Console](https://developers.line.biz/)でチャネルを作成
2. LIFF アプリを追加
3. LIFF IDを`.env`に設定

### 5. 開発サーバーの起動

```bash
npm run dev
```

## デプロイ

### Vercelへのデプロイ

```bash
npm run build
```

ビルドした`dist`ディレクトリをVercelにデプロイしてください。

環境変数も忘れずに設定してください。

## プロジェクト構成

```
mama-odekake-liff/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── SpotCard.jsx    # スポット表示カード
│   │   └── SpotDetail.jsx  # 詳細画面
│   ├── hooks/
│   │   └── useLiff.js      # LIFF SDKフック
│   ├── services/
│   │   └── supabase.js     # Supabaseクライアント
│   ├── App.jsx             # メインアプリ
│   └── main.jsx
├── supabase/
│   ├── schema.sql          # データベーススキーマ
│   └── seed.sql            # サンプルデータ
├── .env.example
└── README.md
```

## データベーススキーマ

### `spots`テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー |
| name | TEXT | 施設名 |
| address | TEXT | 住所 |
| lat | DECIMAL | 緯度 |
| lng | DECIMAL | 経度 |
| parking | TEXT | 駐車場（無料/有料/なし） |
| stroller_friendly | BOOLEAN | ベビーカーOK |
| nursing_room | BOOLEAN | 授乳室あり |
| diaper_change | BOOLEAN | おむつ台あり |
| restroom_types | TEXT[] | トイレの種類 |
| congestion_level | TEXT | 混雑状況 |
| photos | TEXT[] | 写真URL |
| reviews_ai | TEXT | AI生成の口コミ要約 |
| description | TEXT | 説明 |

## 今後の拡張予定

- [ ] フィルター機能（駐車場・授乳室など）
- [ ] 混雑状況のリアルタイム表示
- [ ] ユーザー投稿機能
- [ ] お気に入り機能
- [ ] プッシュ通知（雨の日のおすすめスポット等）

## ライセンス

MIT
