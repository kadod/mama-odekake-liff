# クイックスタート - 3ステップで開始

このガイドでは、最短でLIFFアプリをローカルで起動する手順を説明します。

## 前提条件

- Node.js 18以上
- `.env`ファイルに以下が設定済み：
  - `LINE_LOGIN_CHANNEL_ID`
  - `LINE_LOGIN_CHANNEL_SECRET`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## ステップ1: 依存関係をインストール

```bash
npm install
```

これで`@line/liff-cli`を含むすべての依存関係がインストールされます。

## ステップ2: SSL証明書を作成

LIFFはHTTPSが必須です。mkcertで証明書を作成します：

```bash
# macOS
brew install mkcert
mkcert -install
mkcert localhost

# Windows (Chocolatey)
choco install mkcert
mkcert -install
mkcert localhost
```

これで`localhost.pem`と`localhost-key.pem`が作成されます。

## ステップ3: LIFFセットアップと起動

```bash
# 対話式セットアップ（初回のみ）
npm run liff:setup

# 開発サーバーとLIFFプロキシを起動
npm start
```

## アクセス方法

1. `npm start`実行時に表示されるLIFF URLをコピー
   ```
   →  LIFF URL: https://liff.line.me/2008214089-AbcdEfgh
   ```

2. このURLをLINEで送信（例：KEEPメモ）

3. LINEアプリでURLをタップして起動

4. 位置情報の許可を求められたら「許可」

## トラブルシューティング

### エラー: "LIFF ID is not configured"
→ `npm run liff:setup`を実行してLIFFアプリを作成してください

### エラー: "SSL証明書が見つかりません"
→ `mkcert localhost`でプロジェクトルートに証明書を作成してください

### スマホで位置情報が取得できない
→ LINEアプリの位置情報許可を確認してください

### スポットが表示されない
→ Supabaseの`spots`テーブルにデータがあるか確認してください
→ `supabase/seed.sql`を実行してサンプルデータを投入できます

## 次のステップ

- `supabase/seed.sql`でサンプルデータを追加
- スポットのフィルター機能を実装
- UI/UXの改善
