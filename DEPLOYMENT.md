# マスマジ！～魔法数学冒険記～ デプロイメントガイド

## 📋 目次

1. [概要](#概要)
2. [前提条件](#前提条件)
3. [Netlifyへのデプロイ手順](#netlifyへのデプロイ手順)
4. [環境変数の設定](#環境変数の設定)
5. [AI機能のテスト](#ai機能のテスト)
6. [トラブルシューティング](#トラブルシューティング)

---

## 概要

このアプリケーションは以下の技術スタックを使用しています：

- **フロントエンド**: HTML, CSS (Tailwind), JavaScript (バニラJS)
- **バックエンド**: Netlify Functions (Serverless)
- **AI**: OpenAI GPT-4o-mini API
- **データストレージ**: localStorage (クライアントサイド)
- **ホスティング**: Netlify

---

## 前提条件

デプロイ前に以下を準備してください：

### 1. Netlifyアカウント
- [Netlify](https://www.netlify.com/) でアカウントを作成（無料プランで OK）

### 2. OpenAI APIキー
- [OpenAI Platform](https://platform.openai.com/) でアカウント作成
- API Keys ページから API キーを生成
- **重要**: API キーは秘密にし、絶対に Git にコミットしないでください

### 3. Gitリポジトリ（推奨）
- GitHub, GitLab, または Bitbucket でリポジトリを作成
- プロジェクトをプッシュ

---

## Netlifyへのデプロイ手順

### 方法1: Git連携（推奨）

#### ステップ1: リポジトリをNetlifyに接続

1. [Netlify Dashboard](https://app.netlify.com/) にログイン
2. 「Add new site」→「Import an existing project」をクリック
3. Git プロバイダー（GitHub/GitLab/Bitbucket）を選択
4. リポジトリを選択

#### ステップ2: ビルド設定

デプロイ設定画面で以下を入力：

```
Build command: (空白のまま)
Publish directory: .
```

**説明**: このプロジェクトは静的サイトなので、ビルドコマンドは不要です。`netlify.toml` が自動的に読み込まれます。

#### ステップ3: デプロイ

「Deploy site」ボタンをクリックして初回デプロイを実行します。

---

### 方法2: 手動デプロイ（Netlify CLI）

#### ステップ1: Netlify CLI をインストール

```bash
npm install -g netlify-cli
```

#### ステップ2: ログイン

```bash
netlify login
```

ブラウザが開き、Netlify アカウントで認証します。

#### ステップ3: 初期化

プロジェクトディレクトリで以下を実行：

```bash
netlify init
```

プロンプトに従って設定：
- Create & configure a new site
- チーム/サイト名を選択
- Build command: (空白)
- Directory to deploy: .

#### ステップ4: デプロイ

```bash
netlify deploy --prod
```

---

### 方法3: ドラッグ&ドロップ

1. Netlify Dashboard で「Add new site」→「Deploy manually」
2. プロジェクトフォルダ全体をドラッグ&ドロップ

**注意**: この方法では環境変数の設定が別途必要です。

---

## 環境変数の設定

AI機能を有効にするために、OpenAI APIキーを環境変数として設定します。

### ステップ1: Netlify Dashboardで設定

1. サイトの「Site settings」→「Environment variables」に移動
2. 「Add a variable」をクリック
3. 以下を入力：

```
Key: OPENAI_API_KEY
Value: sk-xxxxxxxxxxxxxxxxxxxxxxxxxx（あなたのAPIキー）
```

4. 「Create variable」をクリック

### ステップ2: 再デプロイ

環境変数を追加した後、サイトを再デプロイ：

1. 「Deploys」タブに移動
2. 「Trigger deploy」→「Clear cache and deploy site」をクリック

または、Netlify CLI で：

```bash
netlify deploy --prod
```

---

## AI機能のテスト

### テストページにアクセス

デプロイが完了したら、以下の URL でテストページを開きます：

```
https://your-site-name.netlify.app/test-ai-functions.html
```

### テスト手順

#### 1. 問題生成テスト

- 学年と難易度を選択
- 「問題を生成」ボタンをクリック
- 結果が JSON 形式で表示されることを確認

**期待される出力例**:
```json
{
  "id": 1699999999999,
  "story": "魔法の森で冒険者が...",
  "question": "3 × 4",
  "answer": 12,
  "unit": "個",
  "difficulty": "easy",
  "hints": [
    "ヒント1...",
    "ヒント2...",
    "ヒント3..."
  ],
  "xp": 50,
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 2. ヒント生成テスト

- 問題生成テスト実行後、ヒントレベルを選択
- 「ヒントを生成」ボタンをクリック
- 選択したレベルに応じたヒントが表示されることを確認

#### 3. 解説生成テスト

- 問題生成テスト実行後、「解説を生成」ボタンをクリック
- 問題に対する詳しい解説が表示されることを確認

---

## トラブルシューティング

### 問題1: 「OPENAI_API_KEY not configured」エラー

**原因**: 環境変数が正しく設定されていません。

**解決方法**:
1. Netlify Dashboard の環境変数設定を確認
2. 変数名が `OPENAI_API_KEY` と完全一致しているか確認
3. サイトを再デプロイ

---

### 問題2: 「Failed to generate problem」エラー

**原因**: OpenAI API キーが無効、または API クォータ超過。

**解決方法**:
1. [OpenAI Dashboard](https://platform.openai.com/account/usage) で使用状況を確認
2. API キーが有効か確認
3. 残高があるか確認（API 使用にはクレジット購入が必要）

---

### 問題3: 「CORS エラー」

**原因**: Netlify Functions が正しく設定されていません。

**解決方法**:
1. `netlify.toml` ファイルが正しく配置されているか確認
2. Functions ディレクトリが `netlify/functions` であることを確認
3. Netlify Dashboard の「Functions」タブで関数が認識されているか確認

---

### 問題4: ローカル開発でテストしたい

**方法**: Netlify Dev を使用

```bash
netlify dev
```

これで `http://localhost:8888` でローカルサーバーが起動し、Netlify Functions もローカルで実行されます。

**環境変数の設定**:

プロジェクトルートに `.env` ファイルを作成：

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**注意**: `.env` ファイルは `.gitignore` に追加してください。

---

## デプロイ後の確認事項

### ✅ チェックリスト

- [ ] サイトが正常に表示される
- [ ] プレイヤー作成が動作する
- [ ] ワールドマップが表示される
- [ ] 問題を解答できる
- [ ] ヒント機能が動作する（AI）
- [ ] レベルアップ演出が動作する
- [ ] 保護者ダッシュボードが表示される
- [ ] PWA としてインストールできる
- [ ] 音声が再生される
- [ ] ストリークシステムが動作する

---

## カスタムドメインの設定（オプション）

### ステップ1: ドメインを追加

1. Netlify Dashboard の「Domain settings」に移動
2. 「Add custom domain」をクリック
3. ドメイン名を入力

### ステップ2: DNS設定

1. ドメインレジストラで DNS 設定を変更
2. Netlify が指示する CNAME または A レコードを追加
3. DNS 伝播を待つ（最大48時間）

### ステップ3: HTTPS有効化

Netlify が自動的に Let's Encrypt で SSL 証明書を発行します。

---

## パフォーマンス最適化

### 1. 画像最適化

- 画像を WebP 形式に変換
- 適切なサイズにリサイズ

### 2. キャッシュ設定

`netlify.toml` にキャッシュヘッダーを追加：

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. CDN活用

Netlify は自動的にグローバル CDN を使用します。

---

## セキュリティ

### API キーの管理

- **絶対に** API キーをコードにハードコーディングしない
- 環境変数のみを使用
- `.env` ファイルを `.gitignore` に追加

### CORS設定

`netlify.toml` で適切な CORS 設定を確認：

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

**本番環境では特定のドメインのみを許可することを推奨**:

```toml
    Access-Control-Allow-Origin = "https://your-domain.com"
```

---

## サポート

問題が解決しない場合：

1. [Netlify サポートフォーラム](https://answers.netlify.com/)
2. [OpenAI サポート](https://help.openai.com/)
3. プロジェクトの GitHub Issues

---

## まとめ

これで「マスマジ！～魔法数学冒険記～」のデプロイが完了しました！

**次のステップ**:
1. test-ai-functions.html でAI機能をテスト
2. 実際にゲームをプレイして動作確認
3. 保護者ダッシュボードで進捗を確認

楽しい算数学習を！ 🎮✨
