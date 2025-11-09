# デプロイチェックリスト

このチェックリストに従って、マスマジ！をセットアップしてください。

---

## ✅ Phase 1: アカウント作成

### OpenAI
- [ ] OpenAIアカウント作成（https://platform.openai.com/signup）
- [ ] APIキー取得（`sk-proj-...` で始まる文字列）
- [ ] 支払い情報登録
- [ ] 利用上限設定（$5/月推奨）

### Netlify
- [ ] Netlifyアカウント作成（https://app.netlify.com/signup）
- [ ] GitHubアカウントと連携（推奨）

---

## ✅ Phase 2: コードの準備

### ローカルファイル確認
- [ ] すべてのファイルが揃っているか確認
  - [ ] index.html
  - [ ] player-create.html
  - [ ] world-map.html
  - [ ] quest.html
  - [ ] result.html
  - [ ] parent-dashboard.html
  - [ ] css/style.css
  - [ ] js/ フォルダ（8ファイル）
  - [ ] netlify/functions/ フォルダ（3ファイル）
  - [ ] netlify.toml
  - [ ] manifest.json
  - [ ] service-worker.js

### 設定ファイル確認
- [ ] `.env.example` が存在する
- [ ] `netlify.toml` の内容を確認
  ```toml
  [build]
    functions = "netlify/functions"
  ```

---

## ✅ Phase 3: デプロイ

### 方法A: GitHub経由（推奨）

#### GitHubリポジトリ作成
- [ ] GitHubで新規リポジトリ作成
- [ ] ローカルでGit初期化
  ```bash
  git init
  git add .
  git commit -m "Initial commit - Phase 2 complete"
  ```
- [ ] GitHubにプッシュ
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/mathmagic.git
  git branch -M main
  git push -u origin main
  ```

#### Netlifyでインポート
- [ ] Netlifyで「Import from GitHub」を選択
- [ ] リポジトリを選択
- [ ] ビルド設定:
  - Build command: (空欄)
  - Publish directory: `.`
  - Functions directory: `netlify/functions`
- [ ] 「Deploy site」をクリック

### 方法B: 手動デプロイ

#### Netlify CLI
- [ ] Netlify CLIをインストール
  ```bash
  npm install -g netlify-cli
  ```
- [ ] ログイン
  ```bash
  netlify login
  ```
- [ ] デプロイ
  ```bash
  netlify deploy --prod
  ```

---

## ✅ Phase 4: 環境変数設定

### Netlify環境変数
- [ ] Netlifyダッシュボードにアクセス
- [ ] Site configuration → Environment variables
- [ ] 変数を追加:
  - **Key**: `OPENAI_API_KEY`
  - **Value**: 取得したAPIキー（`sk-proj-...`）
  - **Scopes**: すべてチェック
- [ ] 「Create variable」をクリック
- [ ] サイトを再デプロイ（Deploys → Trigger deploy）

---

## ✅ Phase 5: 動作確認

### 基本機能テスト
- [ ] デプロイされたサイトにアクセス
- [ ] トップ画面が表示される
- [ ] 「プレイヤー作成」をクリック
- [ ] プレイヤー1を作成（名前、学年、キャラクター）
- [ ] ワールドマップが表示される
- [ ] 学年に合ったワールドが表示される

### AI機能テスト
- [ ] ワールドを選択して「冒険に出発！」
- [ ] 「魔法使いが問題を作っているよ...」ローディング表示
- [ ] AI生成された問題が表示される
- [ ] 問題に回答する

### ヒント機能テスト
- [ ] 「ヒントを見る」ボタンをクリック
- [ ] 確認ダイアログが表示される
- [ ] OKをクリックしてヒント表示
- [ ] 最大3回までヒント表示可能

### リトライ機能テスト
- [ ] わざと間違った答えを入力
- [ ] 「惜しい！もう一度考えてみよう」が表示される
- [ ] 答えは表示されない
- [ ] 再度回答できる

### 解説機能テスト
- [ ] 正解する
- [ ] 結果画面でAI解説が表示される
- [ ] 経験値が加算される
- [ ] レベルアップ演出（該当する場合）

### 図形表示テスト
- [ ] 面積問題などで図形が表示される
- [ ] 寸法ラベルが正しく表示される

### 保護者ダッシュボードテスト
- [ ] プレイヤー2、プレイヤー3を作成
- [ ] 各プレイヤーで数問解く
- [ ] ワールドマップで「チャートアイコン」をクリック
- [ ] 3人の統計が表示される
- [ ] グラフが描画される

### PWAテスト
- [ ] スマートフォンでサイトにアクセス
- [ ] ブラウザメニューから「ホーム画面に追加」
- [ ] アプリアイコンが追加される
- [ ] アプリとして起動できる

---

## ✅ Phase 6: エラーチェック

### ブラウザコンソール確認
- [ ] F12キーでデベロッパーツールを開く
- [ ] Consoleタブを確認
- [ ] エラーメッセージがないか確認

### よくあるエラーと解決方法

#### 「魔法使いが問題を作っているよ...」で止まる
- [ ] Netlifyの環境変数を確認
- [ ] APIキーが正しいか確認
- [ ] サイトを再デプロイ

#### "API error" が表示される
- [ ] OpenAIの残高を確認
- [ ] APIキーが有効か確認
- [ ] 利用上限に達していないか確認

#### 図形が表示されない
- [ ] ブラウザのコンソールでエラーを確認
- [ ] ページをリロード

#### PWAがインストールできない
- [ ] HTTPSで接続されているか確認（NetlifyはHTTPS）
- [ ] manifest.jsonが読み込めるか確認
- [ ] ブラウザのキャッシュをクリア

---

## ✅ Phase 7: 家族で利用開始

### プレイヤー作成
- [ ] プレイヤー1（小学生）を作成
- [ ] プレイヤー2（小学生）を作成
- [ ] プレイヤー3（中学生）を作成

### 初回プレイ
- [ ] 各プレイヤーで1ワールドずつプレイ
- [ ] 動作を確認
- [ ] 問題なければ本格利用開始！

---

## 📝 メモ

### サイトURL
```
https://YOUR-SITE-NAME.netlify.app
```

### OpenAI APIキー（安全に保管）
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### デプロイ日
```
____年____月____日
```

---

## 🎉 完了！

すべてのチェックが完了したら、マスマジ！を楽しんでください！

### 次のステップ
- [ ] 毎日10分プレイする習慣をつける
- [ ] 保護者ダッシュボードで週1回進捗確認
- [ ] 1ヶ月後にフィードバック収集
- [ ] 新ワールド追加を検討

### サポート
問題が発生した場合は **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** のトラブルシューティングを参照してください。

Happy Learning! 🎓✨
