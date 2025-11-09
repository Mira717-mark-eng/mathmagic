# ワールドマップ背景セットアップガイド

## 背景画像の配置

提供された「The Realm of Aetheria」ワールドマップ画像を以下の場所に配置してください：

```
mathmagic/
  assets/
    images/
      world-map-bg.jpg  ← ここに配置
```

## 画像ファイル詳細

- **ファイル名**: `world-map-bg.jpg` （または `.png`）
- **推奨サイズ**: 1920x1080px 以上（提供画像は適切なサイズ）
- **フォーマット**: JPG または PNG
- **特徴**:
  - ファンタジーRPG風のマップイラスト
  - 「The Realm of Aetheria」というタイトル入り
  - 古地図風の装飾フレーム
  - 中央の山、城、森、海など多彩な地形

## 画像が異なるファイル名の場合

もし画像のファイル名が異なる場合は、`css/style.css` の以下の行を修正してください：

```css
/* Line 1242 付近 */
background-image: url('../assets/images/world-map-bg.jpg');
```

例：`your-worldmap.png` の場合
```css
background-image: url('../assets/images/your-worldmap.png');
```

## デザイン仕様

### 背景の表示方法
- **表示**: `background-size: cover` - 画面全体をカバー
- **位置**: `background-position: center` - 中央配置
- **固定**: `background-attachment: fixed` - スクロール時に背景は固定
- **透明度**: `opacity: 0.85` - 85%の不透明度（ワールドカードが見やすいように調整）

### レスポンシブ対応
- スマホ〜PCまで自動で画面サイズに適応
- 背景は常に中央に配置され、画面をカバー

## カスタマイズ

### 背景の透明度を調整

ワールドカードの視認性を調整したい場合は、`css/style.css` の `opacity` を変更：

```css
.world-map-bg::before {
    opacity: 0.85;  /* 0.5（薄い）〜 1.0（濃い） */
}
```

- **0.5**: 背景が薄く、カードが強調される
- **0.85**: デフォルト（バランス型）
- **1.0**: 背景がくっきり見える

### ヘッダーの調整

ヘッダーの背景をマップに合わせて調整済み：
- 半透明の白背景（`bg-white/10`）
- ぼかしエフェクト（`backdrop-blur-md`）

## ファイル構成

```
mathmagic/
├── assets/
│   └── images/
│       ├── fantasy-start-bg.jpg     # スタート画面背景
│       └── world-map-bg.jpg         # ワールドマップ背景 ← NEW!
├── css/
│   └── style.css                    # 背景スタイル追加済み
├── world-map.html                   # class="world-map-bg" に変更済み
└── WORLD_MAP_SETUP.md              # このファイル
```

## トラブルシューティング

### 背景が表示されない
1. 画像ファイルが正しいパスに配置されているか確認
2. ファイル名の大文字小文字を確認（`world-map-bg.jpg`）
3. ブラウザのキャッシュをクリア（Ctrl + Shift + R）
4. 開発者ツールのコンソールでエラーを確認

### 背景が暗すぎる／明るすぎる
- `opacity` の値を調整（上記「背景の透明度を調整」参照）

### ワールドカードが見づらい
- ワールドカードには既に半透明背景とぼかしが適用済み
- 必要に応じてカードの背景色を調整可能

## ブラウザ対応

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**更新日**: 2024-11-08
**デザイナー**: Claude Code
