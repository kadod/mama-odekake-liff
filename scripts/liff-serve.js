#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const envPath = join(rootDir, '.env');

function main() {
  console.log('\n🚀 LIFF プロキシサーバー起動中...\n');

  // .envファイルからLIFF IDを読み込む
  const envContent = readFileSync(envPath, 'utf-8');
  const liffIdMatch = envContent.match(/VITE_LIFF_ID=(\S+)/);

  if (!liffIdMatch || liffIdMatch[1] === 'your_liff_id_here') {
    console.error('❌ LIFF IDが設定されていません');
    console.error('まず npm run liff:setup を実行してください\n');
    process.exit(1);
  }

  const liffId = liffIdMatch[1];
  console.log(`📱 LIFF ID: ${liffId}`);

  // 証明書ファイルの確認
  const { existsSync } = await import('fs');
  const certPath = join(rootDir, 'localhost.pem');
  const keyPath = join(rootDir, 'localhost-key.pem');

  if (!existsSync(certPath) || !existsSync(keyPath)) {
    console.error('\n❌ SSL証明書が見つかりません');
    console.error('mkcertで証明書を作成してください:\n');
    console.error('  brew install mkcert  # macOS');
    console.error('  mkcert -install');
    console.error('  mkcert localhost\n');
    process.exit(1);
  }

  console.log('✅ SSL証明書を確認しました');
  console.log('\n⚙️  プロキシサーバー起動中...\n');

  // LIFF CLIを起動
  const proc = spawn('npx', [
    'liff-cli',
    'serve',
    '--liff-id', liffId,
    '--url', 'http://localhost:5173/'
  ], {
    stdio: 'inherit',
    shell: true,
    cwd: rootDir
  });

  proc.on('error', (error) => {
    console.error('❌ エラー:', error.message);
    process.exit(1);
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`\n❌ プロキシサーバーが終了しました (code: ${code})`);
      process.exit(code);
    }
  });

  // Ctrl+Cでクリーンに終了
  process.on('SIGINT', () => {
    console.log('\n\n👋 プロキシサーバーを停止しています...');
    proc.kill('SIGINT');
    process.exit(0);
  });
}

main();
