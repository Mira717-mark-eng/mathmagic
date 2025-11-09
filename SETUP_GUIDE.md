# マスマジ！セットアップガイド

このガイドでは、マスマジ！をNetlifyにデプロイし、OpenAI APIを設定する手順を説明します。

## 📋 目次

1. [必要なアカウント](#必要なアカウント)
2. [OpenAI APIキーの取得](#openai-apiキーの取得)
3. [Netlifyへのデプロイ](#netlifyへのデプロイ)
4. [環境変数の設定](#環境変数の設定)
5. [動作確認](#動作確認)
6. [トラブルシューティング](#トラブルシューティング)

---

## 必要なアカウント

以下の2つのアカウントを作成してください：

### 1. OpenAI アカウント
- URL: https://platform.openai.com/signup
- 料金: 従量課金制（GPT-4o-miniは非常に安価）
- 予算設定: $5/月程度で十分（家族3人で月40円程度）

### 2. Netlify アカウント
- URL: https://app.netlify.com/signup
- 料金: 無料プラン（月300分のビルド時間、100GBの帯域幅）
- GitHubアカウントでサインアップ可能

---

## OpenAI APIキーの取得

### ステップ1: OpenAIアカウントにログイン

1. https://platform.openai.com にアクセス
2. サインインまたは新規登録

### ステップ2: APIキーを作成

1. 右上のプロフィールアイコン → **API keys** をクリック
2. **Create new secret key** をクリック
3. 名前を入力（例: "MathMagic"）
4. **Create secret key** をクリック
5. ⚠️ **表示されたキーを必ずコピーして保存**（再表示できません）

APIキーの形式: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### ステップ3: 支払い情報を設定

1. 左メニュー → **Settings** → **Billing**
2. **Set up paid account** をクリック
3. クレジットカード情報を入力
4. 利用上限を設定（推奨: $5/月）

### コスト見積もり

GPT-4o-mini の料金（2024年11月現在）:
- 入力: $0.150 / 1M tokens
- 出力: $0.600 / 1M tokens

**家族利用の想定コスト**:
- 1問生成あたり: 約0.13円
- 1日10問 × 30日 = 約39円/月
- **非常に安価です！**

---

## Netlifyへのデプロイ

### 方法1: GitHubを使う（推奨）

#### ステップ1: GitHubリポジトリを作成

1. https://github.com にアクセス
2. **New repository** をクリック
3. リポジトリ名を入力（例: "mathmagic"）
4. **Create repository** をクリック

#### ステップ2: コードをGitHubにプッシュ

ローカルのプロジェクトフォルダで以下のコマンドを実行:

```bash
# Gitを初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit - Phase 2 complete"

# GitHubリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/mathmagic.git

# プッシュ
git branch -M main
git push -u origin main
```

#### ステップ3: NetlifyでGitHubリポジトリをインポート

1. https://app.netlify.com にログイン
2. **Add new site** → **Import an existing project** をクリック
3. **GitHub** を選択
4. リポジトリ **mathmagic** を選択
5. ビルド設定:
   - **Build command**: (空欄)
   - **Publish directory**: `.` (ドット)
   - **Functions directory**: `netlify/functions`
6. **Deploy site** をクリック

### 方法2: 手動デプロイ（Gitなし）

#### ステップ1: Netlify CLIをインストール

```bash
npm install -g netlify-cli
```

#### ステップ2: Netlifyにログイン

```bash
netlify login
```

ブラウザが開くので、Netlifyにログインして認証します。

#### ステップ3: プロジェクトをデプロイ

プロジェクトフォルダで以下のコマンドを実行:

```bash
# 初回デプロイ
netlify deploy

# プロンプトに従って入力:
# - Create & configure a new site を選択
# - Team を選択
# - Site name を入力（例: mathmagic-family）
# - Publish directory: . (ドット)を入力

# 本番デプロイ
netlify deploy --prod
```

---

## 環境変数の設定

Netlify上でOpenAI APIキーを設定します。

### ステップ1: Netlifyサイトダッシュボードにアクセス

1. https://app.netlify.com/sites にアクセス
2. デプロイしたサイト（例: mathmagic-family）をクリック

### ステップ2: 環境変数を設定

1. 左メニュー → **Site configuration** → **Environment variables**
2. **Add a variable** をクリック
3. 以下を入力:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: 先ほど取得したOpenAI APIキー（`sk-proj-...`）
   - **Scopes**: すべてにチェック
4. **Create variable** をクリック

### ステップ3: サイトを再デプロイ

1. 上部メニュー → **Deploys**
2. **Trigger deploy** → **Deploy site** をクリック

環境変数が反映されます。

---

## 動作確認

### 1. サイトにアクセス

NetlifyダッシュボードのURLをクリック（例: https://mathmagic-family.netlify.app）

### 2. プレイヤーを作成

1. トップ画面で **プレイヤー作成** をクリック
2. 名前、学年、キャラクターを選択
3. **冒険を始める！** をクリック

### 3. ワールドを選択

学年に合ったワールドが表示されます。

### 4. AI問題生成をテスト

1. ワールドをクリックして **冒険に出発！**
2. 「魔法使いが問題を作っているよ...」ローディングが表示される
3. AI生成された問題が表示される ✨
4. 問題を解いて正解すると、AI解説が表示される

### 5. ヒント機能をテスト

1. 問題画面で **ヒントを見る** ボタンをクリック
2. 確認ダイアログで **OK** をクリック
3. AI生成されたヒントが表示される

### 6. 保護者ダッシュボードをテスト

1. ワールドマップ画面で **チャートアイコン** ボタンをクリック
2. すべてのプレイヤーの統計が表示される
3. グラフで正答率とレベルが可視化される

---

## トラブルシューティング

### Q1: 「魔法使いが問題を作っているよ...」で止まる

**原因**: OpenAI APIキーが正しく設定されていない

**解決方法**:
1. Netlifyダッシュボード → **Site configuration** → **Environment variables**
2. `OPENAI_API_KEY` が正しく設定されているか確認
3. APIキーの形式: `sk-proj-...`
4. 再デプロイ: **Deploys** → **Trigger deploy**

### Q2: "API error" や "Failed to generate problem"

**原因1**: OpenAI APIの利用上限に達している

**解決方法**:
- https://platform.openai.com/account/billing にアクセス
- 残高を確認し、必要に応じてチャージ

**原因2**: APIキーが無効

**解決方法**:
- 新しいAPIキーを作成
- Netlifyの環境変数を更新

### Q3: Netlify Functionsが動作しない

**原因**: Functions directoryが正しく設定されていない

**解決方法**:
1. プロジェクトルートに `netlify.toml` があることを確認
2. 内容を確認:
```toml
[build]
  functions = "netlify/functions"
```
3. 再デプロイ

### Q4: 図形が表示されない

**原因**: Canvas APIの初期化エラー

**解決方法**:
- ブラウザのコンソールを開く（F12）
- エラーメッセージを確認
- ページをリロード

### Q5: PWAがインストールできない

**原因**: HTTPSでないか、manifest.jsonが読み込めない

**解決方法**:
- Netlifyは自動的にHTTPSを有効化します
- `/manifest.json` にアクセスして確認
- ブラウザのキャッシュをクリア

---

## GitHubとは？（補足説明）

### GitHubとは
- コードのバージョン管理サービス
- コードの履歴を保存し、いつでも過去のバージョンに戻せる
- チームでの共同開発に便利

### GitHubを使うメリット
1. **自動デプロイ**: コードをプッシュすると自動的にNetlifyがビルド・デプロイ
2. **バックアップ**: コードが安全に保管される
3. **履歴管理**: いつ何を変更したかが記録される

### GitHubを使わない場合
- Netlify CLIで手動デプロイが必要
- コード変更のたびに `netlify deploy --prod` を実行

---

## セキュリティのベストプラクティス

### ⚠️ 重要事項

1. **APIキーを公開しない**
   - `.env` ファイルは `.gitignore` に追加済み
   - GitHubにAPIキーをコミットしない

2. **Netlifyの環境変数を使う**
   - APIキーは必ずNetlifyの環境変数に設定
   - コード内にハードコーディングしない

3. **利用上限を設定**
   - OpenAIの設定で月額上限を設定（$5推奨）
   - 予期しない課金を防ぐ

4. **家族のみで使用**
   - このアプリは商用利用不可
   - 家族3人での利用を想定
   - 第三者に公開しない

---

## 次のステップ

Phase 2の実装が完了しました！🎉

### 今後の拡張案

1. **ワールド追加**
   - `js/worlds.js` にワールド定義を追加
   - 各学年に3〜5ワールド作成

2. **問題バリエーション追加**
   - AIプロンプトを調整
   - より多様な問題タイプ

3. **アイコン画像の追加**
   - `/images/` フォルダにアイコン画像を配置
   - PWAインストール時に使用

4. **効果音・BGM**
   - Web Audio APIで実装
   - レベルアップ、正解時の効果音

5. **ランキング機能**
   - RESTful Table APIで実装
   - 家族内でスコア競争

---

## サポート

質問や問題が発生した場合:

1. **ブラウザのコンソールを確認**（F12キー）
2. **Netlifyのデプロイログを確認**
3. **OpenAIのAPIログを確認**

Happy Learning! 🎓✨
