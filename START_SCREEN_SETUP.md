# スタート画面セットアップガイド

## 背景画像の配置

提供された背景画像（マスマジのロゴ入り）を以下の場所に配置してください：

```
mathmagic/
  assets/
    images/
      fantasy-start-bg.jpg  ← ここに配置
```

### 画像ファイル名

- **ファイル名**: `fantasy-start-bg.jpg` （または `.png`）
- **推奨サイズ**: 1920x1080px 以上
- **フォーマット**: JPG または PNG

### 画像が異なるファイル名の場合

もし画像のファイル名が異なる場合は、`index.html` の以下の行を修正してください：

```html
<!-- Line 34 付近 -->
<img src="assets/images/fantasy-start-bg.jpg" alt="" class="w-full h-full object-cover">
```

例：`your-image.png` の場合
```html
<img src="assets/images/your-image.png" alt="" class="w-full h-full object-cover">
```

## デザイン概要

### フォント
- **サブタイトル**: Cinzel（中世ファンタジー風セリフ体）
- **本文**: Noto Sans JP（日本語）

### カラーパレット
- **ゴールド**: `#fbbf24`（ボタン、タイトル）
- **パープル**: `#584687`（パネル背景）
- **ブルー**: `#3b82f6`（セカンダリボタン）
- **クリーム**: `#fef3c7`（テキスト）

### エフェクト
- パーティクルアニメーション（魔法のきらめき）
- ボタンホバー時の光エフェクト
- グローパルスアニメーション（サブタイトル）
- ボーダーシマーエフェクト（パネル枠）

## カスタマイズ

### サブタイトルの変更
`index.html` の Line 54-56:
```html
<p class="fantasy-subtitle-main text-4xl md:text-5xl mb-6 drop-shadow-2xl">
    ～魔法数学冒険記～
</p>
```

### タグラインの変更
`index.html` の Line 59-61:
```html
<p class="fantasy-tagline text-xl md:text-2xl drop-shadow-lg">
    数学の魔法で世界を救おう！
</p>
```

### ボタンテキストの変更
- **新しい冒険**: Line 73 `新しい冒険を始める`
- **冒険を再開**: Line 82 `冒険を再開する`

## トラブルシューティング

### 画像が表示されない
1. ファイルパスが正しいか確認
2. ファイル名の大文字小文字を確認
3. ブラウザのキャッシュをクリア（Ctrl + Shift + R）

### フォントが表示されない
- Google Fontsの読み込みを確認（Line 25）
- インターネット接続を確認

### スタイルが適用されない
1. `css/style.css` が正しく読み込まれているか確認
2. ブラウザの開発者ツールでCSSエラーを確認
3. Tailwind CDNが読み込まれているか確認（Line 19）

## ブラウザ対応

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**更新日**: 2024-11-08
**デザイナー**: Claude Code
