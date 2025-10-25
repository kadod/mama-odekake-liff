#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const envPath = join(rootDir, '.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

async function main() {
  console.log('\n🚀 LIFF アプリセットアップ\n');

  // .envファイルを読み込む
  let envContent = readFileSync(envPath, 'utf-8');
  const channelIdMatch = envContent.match(/LINE_LOGIN_CHANNEL_ID=(\d+)/);
  const channelSecretMatch = envContent.match(/LINE_LOGIN_CHANNEL_SECRET=([a-f0-9]+)/);

  if (!channelIdMatch || !channelSecretMatch) {
    console.error('❌ .envファイルにLINE_LOGIN_CHANNEL_IDまたはLINE_LOGIN_CHANNEL_SECRETが見つかりません');
    process.exit(1);
  }

  const channelId = channelIdMatch[1];
  const channelSecret = channelSecretMatch[1];

  console.log(`📱 チャネルID: ${channelId}`);
  console.log(`🔑 チャネルシークレット: ${channelSecret.slice(0, 8)}...`);

  // ステップ1: チャネルを追加
  console.log('\n📝 ステップ1: チャネルを追加');
  try {
    await runCommand('npx', [
      'liff-cli',
      'channel',
      'add',
      channelId,
      '--channel-secret',
      channelSecret
    ]);
    console.log('✅ チャネルを追加しました');
  } catch (error) {
    console.log('⚠️  チャネルは既に追加されている可能性があります');
  }

  // ステップ2: デフォルトチャネルを設定
  console.log('\n📝 ステップ2: デフォルトチャネルを設定');
  try {
    await runCommand('npx', ['liff-cli', 'channel', 'use', channelId]);
    console.log('✅ デフォルトチャネルを設定しました');
  } catch (error) {
    console.error('❌ デフォルトチャネルの設定に失敗:', error.message);
  }

  // ステップ3: 既存のLIFFアプリを確認
  console.log('\n📝 ステップ3: 既存のLIFFアプリを確認');
  const existingLiffId = envContent.match(/VITE_LIFF_ID=(\S+)/)?.[1];

  if (existingLiffId && existingLiffId !== 'your_liff_id_here') {
    console.log(`✅ 既存のLIFF ID: ${existingLiffId}`);
    const useExisting = await question('既存のLIFF IDを使用しますか？ (y/n): ');

    if (useExisting.toLowerCase() === 'y') {
      console.log('✅ 既存のLIFF IDを使用します');
      rl.close();
      return;
    }
  }

  // ステップ4: 新しいLIFFアプリを作成
  console.log('\n📝 ステップ4: 新しいLIFFアプリを作成');
  const appName = await question('LIFFアプリ名 [ママのおでかけスポット検索]: ') || 'ママのおでかけスポット検索';
  const viewType = await question('画面サイズ (full/tall/compact) [full]: ') || 'full';

  console.log('\n⚙️  LIFFアプリを作成中...');

  try {
    const createProc = spawn('npx', [
      'liff-cli',
      'app',
      'create',
      '--channel-id', channelId,
      '--name', appName,
      '--endpoint-url', 'https://localhost:9000',
      '--view-type', viewType
    ], { shell: true });

    let output = '';

    createProc.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    createProc.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    await new Promise((resolve, reject) => {
      createProc.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Failed with code ${code}`));
      });
    });

    // LIFF IDを抽出
    const liffIdMatch = output.match(/(\d+-[A-Za-z0-9]+)/);

    if (liffIdMatch) {
      const liffId = liffIdMatch[1];
      console.log(`\n✅ LIFF ID: ${liffId}`);

      // .envファイルを更新
      envContent = envContent.replace(
        /VITE_LIFF_ID=.*/,
        `VITE_LIFF_ID=${liffId}`
      );
      writeFileSync(envPath, envContent);
      console.log('✅ .envファイルにLIFF IDを保存しました');
    }

    console.log('\n✨ セットアップ完了！\n');
    console.log('次のコマンドで開発を開始できます:');
    console.log('  npm install          # 依存関係をインストール');
    console.log('  npm run start        # 開発サーバーとLIFFプロキシを起動\n');

  } catch (error) {
    console.error('❌ LIFFアプリの作成に失敗:', error.message);
    process.exit(1);
  }

  rl.close();
}

main().catch(console.error);
