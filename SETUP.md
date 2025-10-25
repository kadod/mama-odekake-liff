# セットアップ手順

このドキュメントでは、ママのおでかけスポット検索アプリをローカル環境でセットアップし、スマホで確認するまでの手順を説明します。

## 前提条件

- Node.js 18以上
- LINE Developersアカウント
- Supabaseアカウント

## ステップ1: Supabaseのセットアップ

### 1-1. Supabaseプロジェクトにアクセス

1. https://supabase.com/dashboard にアクセス
2. プロジェクト「powrxrjblbxrfrqskvye」を選択
3. 左メニューから「SQL Editor」を選択

### 1-2. データベーススキーマを作成

SQL Editorで`supabase/schema.sql`の内容を実行：

```sql
-- supabase/schema.sql の内容をコピー＆ペースト
```

### 1-3. サンプルデータを投入

SQL Editorで`supabase/seed.sql`の内容を実行：

```sql
-- supabase/seed.sql の内容をコピー＆ペースト
```

### 1-4. API Keyを取得

1. 左メニューから「Settings」→「API」を選択
2. 「Project API keys」セクションから以下をコピー：
   - `anon` `public` キー → `VITE_SUPABASE_ANON_KEY`に設定

## ステップ2: LINE Developersのセットアップ

### 2-1. チャネルの確認

LINE Developersコンソールで以下を確認：
- チャネルID: `2008214089`
- チャネルシークレット: `abab5e09bfb939ef20d58ce99b7dd543`

### 2-2. LIFF CLIのインストール

```bash
npm install -g @line/liff-cli
```

### 2-3. チャネルを追加

```bash
liff-cli channel add 2008214089
# プロンプトが表示されたらチャネルシークレットを入力
# → abab5e09bfb939ef20d58ce99b7dd543
```

### 2-4. LIFFアプリを作成

```bash
cd /Users/kadotani/Documents/開発プロジェクト/GitHub/mama-odekake-liff

liff-cli app create \
  --channel-id 2008214089 \
  --name "ママのおでかけスポット検索" \
  --endpoint-url https://localhost:9000 \
  --view-type full
```

実行すると、LIFF IDが表示されます（例：`2008214089-AbcdEfgh`）。

### 2-5. LIFF IDを.envに設定

```bash
# 表示されたLIFF IDを.envに設定
# 例：VITE_LIFF_ID=2008214089-AbcdEfgh
```

`.env`ファイルを編集して、`VITE_LIFF_ID`に取得したLIFF IDを設定してください。

## ステップ3: ローカル環境のセットアップ

### 3-1. 依存関係のインストール

```bash
npm install
```

### 3-2. mkcertのインストール（HTTPS証明書用）

**macOS:**
```bash
brew install mkcert
mkcert -install
```

**Windows:**
```bash
choco install mkcert
mkcert -install
```

### 3-3. localhost用の証明書を作成

```bash
cd /Users/kadotani/Documents/開発プロジェクト/GitHub/mama-odekake-liff
mkcert localhost
```

これで`localhost.pem`と`localhost-key.pem`が作成されます。

## ステップ4: ローカル開発サーバーの起動

### 4-1. Vite開発サーバーを起動

ターミナル1で実行：

```bash
npm run dev
```

ブラウザで http://localhost:5173 が開きます。

### 4-2. LIFF CLIプロキシサーバーを起動

**新しいターミナル**を開いて実行：

```bash
cd /Users/kadotani/Documents/開発プロジェクト/GitHub/mama-odekake-liff

liff-cli serve \
  --liff-id YOUR_LIFF_ID \
  --url http://localhost:5173/
```

`YOUR_LIFF_ID`は.envで設定したLIFF IDに置き換えてください。

これでローカル環境が https://localhost:9000 で起動します。

## ステップ5: スマホで確認

### 5-1. LIFF URLを確認

LIFF CLIの出力に表示されるLIFF URLをメモ：

```
→  LIFF URL: https://liff.line.me/YOUR_LIFF_ID
```

### 5-2. LINE公式アカウントを友だち追加

1. LINE Developersコンソールで「Messaging API」タブを開く
2. QRコードをスマホで読み取って友だち追加

### 5-3. LIFF URLをLINEで送信

1. 自分宛にLIFF URLを送信（LINEのKEEPメモなど）
2. URLをタップしてLIFFアプリを起動

### 5-4. 位置情報を許可

1. ブラウザの位置情報許可を求められたら「許可」をタップ
2. 現在地周辺のスポットが表示されます

## ステップ6: ngrokで外部公開（オプション）

スマホから直接ローカル環境にアクセスしたい場合：

```bash
# ngrokの認証トークンを設定
export NGROK_AUTHTOKEN=your_ngrok_token

# LIFF CLIでngrokを使用
liff-cli serve \
  --liff-id YOUR_LIFF_ID \
  --url http://localhost:5173/ \
  --proxy-type ngrok
```

ngrokのURLが表示されるので、そのURLをスマホで開けます。

## トラブルシューティング

### エラー: "LIFF ID is not configured"

`.env`ファイルの`VITE_LIFF_ID`が設定されているか確認してください。

### エラー: "Supabase credentials are missing"

`.env`ファイルの以下が正しく設定されているか確認：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### スマホで位置情報が取得できない

1. ブラウザの位置情報許可を確認
2. LINEアプリの位置情報許可を確認
3. HTTPSで接続されているか確認（`https://localhost:9000`または`https://liff.line.me/...`）

### スポットが表示されない

1. Supabaseのspotsテーブルにデータが入っているか確認
2. ブラウザのコンソールでエラーを確認
3. 現在地から20km圏内にサンプルデータがあるか確認

## 次のステップ

- Vercelへデプロイ
- 本番環境のLIFFアプリを作成
- スポットデータを追加
- フィルター機能を実装
