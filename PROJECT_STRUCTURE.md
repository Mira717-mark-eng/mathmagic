# プロジェクト構造

マスマジ！のファイル構成と各ファイルの役割を説明します。

---

## 📂 ディレクトリ構造

```
mathmagic/
│
├── index.html                          # トップ画面
├── player-create.html                  # プレイヤー作成画面
├── world-map.html                      # ワールドマップ
├── quest.html                          # クエスト画面
├── result.html                         # 結果画面
├── parent-dashboard.html               # 保護者ダッシュボード
│
├── manifest.json                       # PWA manifest
├── service-worker.js                   # Service Worker
├── netlify.toml                        # Netlify設定
├── .env.example                        # 環境変数テンプレート
│
├── css/
│   └── style.css                       # カスタムCSS
│
├── js/
│   ├── main.js                         # 共通関数・ユーティリティ
│   ├── player.js                       # プレイヤー管理
│   ├── world-map.js                    # ワールドマップ処理
│   ├── quest.js                        # クエスト処理（AI統合）
│   ├── result.js                       # 結果処理（AI解説）
│   ├── worlds.js                       # ワールドデータベース
│   ├── figure-drawer.js                # 図形描画（Canvas）
│   ├── hint-system.js                  # ヒントシステム
│   └── parent-stats.js                 # 保護者ダッシュボード統計
│
├── netlify/
│   └── functions/
│       ├── generate-problem.js         # AI問題生成Function
│       ├── generate-hint.js            # AIヒント生成Function
│       └── generate-explanation.js     # AI解説生成Function
│
└── docs/                               # ドキュメント
    ├── README.md                       # プロジェクト概要
    ├── SETUP_GUIDE.md                  # セットアップ手順
    ├── DEPLOYMENT_CHECKLIST.md         # デプロイチェックリスト
    ├── ADD_WORLD_GUIDE.md              # ワールド追加ガイド
    ├── CURRICULUM_RESEARCH.md          # カリキュラム調査
    ├── WORLD_DESIGN.md                 # ワールド設計書
    ├── PHASE2_PLAN.md                  # Phase 2計画
    ├── PHASE2_COMPLETE.md              # Phase 2完了レポート
    └── REDESIGN_SUMMARY.md             # 再設計まとめ
```

---

## 📄 HTMLファイル

### index.html
- **役割**: トップ画面、プレイヤー選択
- **機能**: 
  - プレイヤー選択ボタン（3人分）
  - プレイヤー作成リンク
  - PWA Service Worker登録
- **遷移先**: player-create.html, world-map.html

### player-create.html
- **役割**: 新規プレイヤー作成
- **機能**:
  - 名前入力
  - 学年選択（1〜9年）
  - キャラクタータイプ選択
  - プレイヤーIDの自動割り当て
- **遷移先**: world-map.html

### world-map.html
- **役割**: ワールド選択画面
- **機能**:
  - プレイヤー情報表示
  - 経験値バー
  - 学年別ワールドフィルタリング
  - レベル要件によるロック
  - 保護者ダッシュボードリンク
- **遷移先**: quest.html, parent-dashboard.html

### quest.html
- **役割**: 問題画面
- **機能**:
  - AI問題生成ローディング
  - ストーリー表示
  - 問題文表示
  - 図形表示エリア（Canvas）
  - 回答入力
  - ヒント表示エリア
  - エラーメッセージエリア
  - タイマー、進捗表示
- **遷移先**: result.html, world-map.html

### result.html
- **役割**: 結果画面
- **機能**:
  - 正解/不正解判定表示
  - 経験値獲得表示
  - レベルアップ演出
  - AI解説表示
  - 統計情報
  - 次の問題 / クエスト完了ボタン
- **遷移先**: quest.html, world-map.html

### parent-dashboard.html
- **役割**: 保護者用ダッシュボード
- **機能**:
  - 3人のプレイヤー統計
  - 総問題数、平均正答率
  - プレイヤー詳細（レベル、正答率）
  - グラフ表示（Chart.js）
  - 活動履歴
  - プレイヤー切り替え
- **遷移先**: index.html, world-map.html

---

## 🎨 CSSファイル

### css/style.css
- **役割**: カスタムスタイル
- **内容**:
  - カード共通スタイル
  - アニメーション定義
  - プレイヤーカードスタイル
  - 経験値バーアニメーション
  - レスポンシブ調整

---

## 🧩 JavaScriptファイル

### js/main.js
- **役割**: 共通関数・ユーティリティ
- **主な機能**:
  - `MathMagic` グローバルオブジェクト
  - LocalStorageラッパー（`getItem`, `setItem`, `removeItem`）
  - 経験値計算（`getExpForLevel`）
  - メッセージ表示（`showMessage`）
  - デバッグモード判定
  - プレイヤー取得（`getCurrentPlayer`）

### js/player.js
- **役割**: プレイヤー管理
- **主な機能**:
  - `PlayerManager` オブジェクト
  - プレイヤー作成（`createPlayer`）
  - プレイヤー更新（`updatePlayer`）
  - 回答記録（`recordAnswer`）
  - 統計取得（`getStats`, `getAccuracy`）
  - データ検証

### js/world-map.js
- **役割**: ワールドマップ処理
- **主な機能**:
  - `WorldMap` オブジェクト
  - プレイヤー情報表示
  - ワールドリスト表示（学年フィルタリング）
  - ワールドカード動的生成
  - クエスト開始処理
  - レベル要件チェック

### js/quest.js
- **役割**: クエスト画面処理（AI統合）
- **主な機能**:
  - 問題取得（AI生成またはフォールバック）
  - AI問題生成API呼び出し
  - ローディング表示
  - 回答判定（リトライ機能）
  - ヒントシステム統合
  - 図形描画統合
  - タイマー管理
  - 進捗管理

### js/result.js
- **役割**: 結果画面処理（AI解説）
- **主な機能**:
  - 結果表示（正解/不正解）
  - 経験値加算
  - レベルアップ判定
  - AI解説生成・表示
  - 統計更新
  - ナビゲーション制御

### js/worlds.js
- **役割**: ワールドデータベース
- **主な機能**:
  - `WORLD_DATABASE` 配列
  - 各ワールドの定義（5ワールド）
  - AI生成設定
  - フォールバック問題
  - 図形設定

### js/figure-drawer.js
- **役割**: 図形描画（Canvas API）
- **主な機能**:
  - `FigureDrawer` オブジェクト
  - 各種図形描画メソッド:
    - `drawRectangle` - 長方形
    - `drawSquare` - 正方形
    - `drawCircle` - 円
    - `drawTriangle` - 三角形
    - `drawLShape` - L字型
    - `drawBarChart` - 棒グラフ
    - `drawLineChart` - 折れ線グラフ
  - 寸法ラベル表示
  - High DPI対応

### js/hint-system.js
- **役割**: ヒントシステム
- **主な機能**:
  - `HintSystem` オブジェクト
  - 3段階ヒント管理
  - 確認ダイアログ
  - AIヒント生成API呼び出し
  - フォールバックヒント
  - 経験値修正値計算

### js/parent-stats.js
- **役割**: 保護者ダッシュボード統計処理
- **主な機能**:
  - `ParentStats` オブジェクト
  - 全プレイヤー取得
  - 統計計算（総問題数、平均正答率）
  - プレイヤー詳細表示
  - グラフ描画（Chart.js）
  - 活動履歴表示
  - プレイヤー切り替え

---

## ⚡ Netlify Functions

### netlify/functions/generate-problem.js
- **役割**: AI問題生成
- **入力**:
  - `grade` - 学年
  - `worldId` - ワールドID
  - `difficulty` - 難易度
- **出力**:
  - `story` - ストーリー文
  - `question` - 問題文
  - `answer` - 答え
  - `unit` - 単位
  - `hints` - ヒント配列
  - `figure` - 図形データ（オプション）
- **API**: OpenAI GPT-4o-mini

### netlify/functions/generate-hint.js
- **役割**: AIヒント生成
- **入力**:
  - `question` - 問題文
  - `answer` - 答え
  - `level` - ヒントレベル（1〜3）
- **出力**:
  - `hint` - ヒントテキスト
- **API**: OpenAI GPT-4o-mini

### netlify/functions/generate-explanation.js
- **役割**: AI解説生成
- **入力**:
  - `question` - 問題文
  - `answer` - 答え
  - `unit` - 単位
- **出力**:
  - `explanation` - 解説テキスト（150-200字）
- **API**: OpenAI GPT-4o-mini

---

## ⚙️ 設定ファイル

### netlify.toml
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

### .env.example
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### manifest.json
- **役割**: PWA manifest
- **内容**:
  - アプリ名、短縮名
  - 説明文
  - アイコン設定
  - テーマカラー
  - 表示モード（standalone）

### service-worker.js
- **役割**: PWA Service Worker
- **機能**:
  - キャッシュ戦略
    - 静的リソース: Cache First
    - API呼び出し: Network First
    - CDNリソース: Network First
  - オフライン対応
  - 自動更新通知

---

## 📚 ドキュメント

### README.md
- プロジェクト概要
- 実装済み機能
- セットアップ方法概要
- コスト見積もり
- Phase 3計画

### SETUP_GUIDE.md
- 詳細なセットアップ手順
- OpenAI APIキー取得方法
- Netlifyデプロイ手順
- 環境変数設定
- トラブルシューティング

### DEPLOYMENT_CHECKLIST.md
- デプロイ前チェックリスト
- 動作確認項目
- エラーチェック項目

### ADD_WORLD_GUIDE.md
- 新ワールド追加手順
- AIプロンプトのカスタマイズ
- 図形付き問題の作成
- テスト方法

### CURRICULUM_RESEARCH.md
- 文部科学省学習指導要領分析
- 主要学習塾カリキュラム調査
- 40ワールド候補リスト

### WORLD_DESIGN.md
- ワールド設計の詳細
- 学年別ワールドマッピング
- データ構造定義

### PHASE2_PLAN.md
- Phase 2実装計画
- ファイル別実装ガイド
- コード例とパターン

### PHASE2_COMPLETE.md
- Phase 2完了レポート
- 実装統計
- 技術的ハイライト
- Phase 3への移行計画

### REDESIGN_SUMMARY.md
- 再設計の経緯
- 研究成果まとめ
- 実装スコープ確認

---

## 🔗 依存関係

### CDN（外部ライブラリ）
- **Tailwind CSS**: UIフレームワーク
- **Font Awesome**: アイコン
- **Google Fonts**: Noto Sans JP
- **Chart.js**: グラフ描画（保護者ダッシュボード）

### API
- **OpenAI GPT-4o-mini**: AI問題生成、ヒント、解説

### ホスティング
- **Netlify**: 静的サイトホスティング、Functions

---

## 📊 データフロー

### 1. プレイヤー作成
```
index.html 
  → player-create.html 
  → PlayerManager.createPlayer() 
  → LocalStorage
  → world-map.html
```

### 2. クエスト開始
```
world-map.html 
  → WorldMap.startQuest() 
  → questSession作成 
  → LocalStorage
  → quest.html
```

### 3. 問題生成
```
quest.html 
  → getCurrentProblem() 
  → generateAIProblem() 
  → /api/generate-problem
  → OpenAI API
  → 問題データ返却
```

### 4. ヒント表示
```
quest.html 
  → HintSystem.showHint() 
  → 確認ダイアログ
  → /api/generate-hint
  → OpenAI API
  → ヒント表示
```

### 5. 回答判定
```
quest.html 
  → handleAnswer() 
  → 判定処理
  → lastResult作成
  → LocalStorage
  → result.html
```

### 6. 解説表示
```
result.html 
  → displayExplanation() 
  → /api/generate-explanation
  → OpenAI API
  → 解説表示
```

### 7. 保護者ダッシュボード
```
world-map.html 
  → parent-dashboard.html
  → ParentStats.displayDashboard()
  → 全プレイヤーデータ取得
  → 統計計算
  → グラフ描画
```

---

## 🎯 今後の拡張ポイント

### 簡単に追加できる
- ✅ 新ワールド（`js/worlds.js`）
- ✅ フォールバック問題
- ✅ アイコン画像

### 中程度の工数
- ⚙️ 効果音・BGM
- ⚙️ アニメーション強化
- ⚙️ キャラクターイラスト

### 大規模な工数
- 🔧 アイテムシステム
- 🔧 苦手分野分析
- 🔧 ランキング機能

---

## 🔐 セキュリティ

### 保護されているもの
- ✅ OpenAI APIキー（Netlify環境変数）
- ✅ Netlify Functions（サーバーサイド実行）

### クライアントサイド（注意）
- ⚠️ プレイヤーデータ（LocalStorage）
  - ブラウザローカルに保存
  - バックアップ機能なし
  - ブラウザキャッシュクリアで消失

---

## 📞 サポート情報

問題が発生した場合:
1. ブラウザのコンソール（F12）でエラー確認
2. **SETUP_GUIDE.md** のトラブルシューティングを参照
3. Netlifyのデプロイログを確認
4. OpenAIのAPIログを確認

---

**最終更新**: 2024年11月3日（Phase 2完了）
