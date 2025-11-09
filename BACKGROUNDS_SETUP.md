# 🎨 マスマジ！背景画像セットアップガイド

このガイドでは、提供された4つの背景画像の配置方法を説明します。

## 📁 ファイル構成

以下のように画像を配置してください：

```
mathmagic/
├── assets/
│   └── images/
│       ├── fantasy-start-bg.jpg         # スタート画面背景（マスマジロゴ入り）
│       ├── character-select-bg.jpg      # キャラクター選択背景（5人のヒーロー）
│       ├── world-map-bg.jpg             # ワールドマップ背景（The Realm of Aetheria）
│       └── battle-bg.jpg                # バトル画面背景（ドラゴンアリーナ）
├── css/
│   └── style.css                        # 背景スタイル設定済み
├── index.html                           # スタート画面（fantasy-start-bg.jpg使用）
├── character-select.html                # キャラクター選択（character-select-bg.jpg使用）
├── world-map.html                       # ワールドマップ（world-map-bg.jpg使用）
└── quest.html                           # バトル画面（battle-bg.jpg使用）
```

## 🖼️ 背景画像の詳細

### 1. スタート画面背景（fantasy-start-bg.jpg）

- **使用場所**: index.html
- **クラス名**: `.fantasy-start-screen`
- **特徴**: 「マスマジ」ロゴが統合された背景
- **透明度**: なし（`<img>` タグで表示）
- **詳細ガイド**: [START_SCREEN_SETUP.md](START_SCREEN_SETUP.md)

**配置コマンド**:
```bash
# 画像を配置
cp fantasy-start-bg.jpg assets/images/
```

---

### 2. ワールドマップ背景（world-map-bg.jpg）

- **使用場所**: world-map.html
- **クラス名**: `.world-map-bg`
- **特徴**: 「The Realm of Aetheria」古地図風ファンタジーマップ
- **透明度**: 85%（`opacity: 0.85`）
- **詳細ガイド**: [WORLD_MAP_SETUP.md](WORLD_MAP_SETUP.md)

**配置コマンド**:
```bash
# 画像を配置
cp world-map-bg.jpg assets/images/
```

---

### 3. キャラクター選択背景（character-select-bg.jpg）

- **使用場所**: character-select.html
- **クラス名**: `.character-select-bg`
- **特徴**: 5人のヒーローポートレート、夕暮れの幻想風景
- **透明度**: 80%（`opacity: 0.80`）
- **詳細ガイド**: [CHARACTER_SELECT_SETUP.md](CHARACTER_SELECT_SETUP.md)

**配置コマンド**:
```bash
# 画像を配置
cp character-select-bg.jpg assets/images/
```

---

### 4. バトル画面背景（battle-bg.jpg）

- **使用場所**: quest.html
- **クラス名**: `.battle-bg`
- **特徴**: ドラゴンアリーナの魔法バトルシーン
- **透明度**: 75%（`opacity: 0.75`）
- **詳細ガイド**: [BATTLE_SCREEN_SETUP.md](BATTLE_SCREEN_SETUP.md)

**配置コマンド**:
```bash
# 画像を配置
cp battle-bg.jpg assets/images/
```

---

## 🚀 クイックセットアップ（すべての画像を一度に配置）

### Windows（PowerShell）
```powershell
# assets/imagesディレクトリが存在することを確認
New-Item -ItemType Directory -Force -Path "assets\images"

# 4つの画像をコピー（画像が現在のディレクトリにある場合）
Copy-Item fantasy-start-bg.jpg assets\images\
Copy-Item character-select-bg.jpg assets\images\
Copy-Item world-map-bg.jpg assets\images\
Copy-Item battle-bg.jpg assets\images\

# 確認
Get-ChildItem assets\images\*.jpg
```

### macOS/Linux（Bash）
```bash
# assets/imagesディレクトリが存在することを確認
mkdir -p assets/images

# 4つの画像をコピー（画像が現在のディレクトリにある場合）
cp fantasy-start-bg.jpg assets/images/
cp character-select-bg.jpg assets/images/
cp world-map-bg.jpg assets/images/
cp battle-bg.jpg assets/images/

# 確認
ls -lh assets/images/*.jpg
```

---

## ✅ 動作確認チェックリスト

すべての画像を配置したら、以下を確認してください：

- [ ] **スタート画面**: `index.html` を開いて「マスマジ」ロゴ入り背景が表示される
- [ ] **キャラクター選択**: `character-select.html` を開いて5人のヒーロー背景が表示される
- [ ] **ワールドマップ**: `world-map.html` を開いて古地図風の背景が表示される
- [ ] **バトル画面**: `quest.html` を開いてドラゴンアリーナの背景が表示される
- [ ] **透明度**: 各画面で文字やカードが読みやすい
- [ ] **レスポンシブ**: スマホサイズでも背景が適切に表示される

---

## 🎨 透明度の調整

各背景の透明度は、UI要素の視認性に合わせて調整済みです。

| 画面 | 透明度 | 理由 |
|------|--------|------|
| スタート画面 | 100% | ロゴが統合されているため |
| キャラクター選択 | 80% | ポートレートとカードのバランス |
| ワールドマップ | 85% | カードとのバランス |
| バトル画面 | 75% | 派手なエフェクトがあるため低め |

### 透明度を変更する場合

`css/style.css` を編集：

```css
/* キャラクター選択背景 */
.character-select-bg::before {
    opacity: 0.80;  /* ← ここを変更 */
}

/* ワールドマップ背景 */
.world-map-bg::before {
    opacity: 0.85;  /* ← ここを変更 */
}

/* バトル背景 */
.battle-bg::before {
    opacity: 0.75;  /* ← ここを変更 */
}
```

---

## 🔧 トラブルシューティング

### 画像が表示されない

1. **ファイルパスを確認**
   ```
   mathmagic/assets/images/fantasy-start-bg.jpg  ✓
   mathmagic/assets/fantasy-start-bg.jpg         ✗
   ```

2. **ファイル名を確認**（大文字小文字を区別）
   ```
   fantasy-start-bg.jpg  ✓
   Fantasy-Start-BG.jpg  ✗
   ```

3. **ブラウザのキャッシュをクリア**
   - Windows: `Ctrl + Shift + R`
   - macOS: `Cmd + Shift + R`

4. **開発者ツールでエラー確認**
   - `F12` → Console タブ
   - 404エラーがないか確認

### 画像の拡張子が違う場合

JPGではなくPNGの場合、CSS/HTMLを修正：

**index.html（Line 34）**:
```html
<img src="assets/images/fantasy-start-bg.png" alt="">
```

**css/style.css（Line 41, 1242）**:
```css
background-image: url('../assets/images/battle-bg.png');
background-image: url('../assets/images/world-map-bg.png');
```

---

## 📊 画像の推奨仕様

| 項目 | 推奨値 |
|------|--------|
| **解像度** | 1920x1080px 以上 |
| **フォーマット** | JPG（軽量）または PNG（高品質） |
| **ファイルサイズ** | 500KB〜2MB（最適化推奨） |
| **アスペクト比** | 16:9（ワイドスクリーン） |

---

## 🎯 デザインコンセプト

### 統一されたファンタジーRPG世界観

4つの背景は、以下のストーリーフローを表現しています：

1. **スタート画面**: 魔法の世界への入口（壮大なタイトル）
2. **キャラクター選択**: ヒーローの選択と旅立ち（夕暮れの決意）
3. **ワールドマップ**: 冒険の舞台（探検する世界）
4. **バトル画面**: 実際の戦い（緊張感のあるアリーナ）

### カラーパレットの統一

- **メインカラー**: 青・紫・金（魔法の雰囲気）
- **アクセント**: オレンジ・シアン（エネルギー感）
- **ベース**: ダーク系（ファンタジー世界観）

---

## 📚 関連ドキュメント

- [START_SCREEN_SETUP.md](START_SCREEN_SETUP.md) - スタート画面の詳細
- [CHARACTER_SELECT_SETUP.md](CHARACTER_SELECT_SETUP.md) - キャラクター選択画面の詳細
- [WORLD_MAP_SETUP.md](WORLD_MAP_SETUP.md) - ワールドマップの詳細
- [BATTLE_SCREEN_SETUP.md](BATTLE_SCREEN_SETUP.md) - バトル画面の詳細

---

## 🌐 ブラウザ対応

- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+
- ✓ iOS Safari 14+
- ✓ Android Chrome 90+

---

**最終更新**: 2024-11-08
**デザイナー**: Claude Code
**プロジェクト**: マスマジ！～魔法数学冒険記～
