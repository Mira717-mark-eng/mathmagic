# モンスター画像ガイド

## 📁 必要な画像ファイル

このフォルダに以下の画像を配置してください：

### 初級モンスター
- `slime.png` - かわいいスライム
- `bat.png` - かわいいこうもり

### 中級モンスター
- `goblin.png` - かわいいゴブリン
- `skeleton.png` - かわいいスケルトン
- `orc.png` - かわいいオーク

### 上級モンスター
- `dragon_baby.png` - かわいいベビードラゴン
- `demon.png` - かわいいデーモン
- `dragon.png` - かわいいドラゴン

### ボスモンスター
- `forest_king.png` - 森の王
- `ice_giant.png` - アイスジャイアント
- `volcano_lord.png` - 火山の主

## 🎨 推奨画像サイズ
- **サイズ**: 200x200ピクセル または 256x256ピクセル
- **形式**: PNG (透過背景推奨)
- **スタイル**: かわいいデフォルメキャラクター、ピクセルアート

## 🌐 おすすめ無料素材サイト

### 1. Kenney.nl (完全無料・商用OK)
- URL: https://kenney.nl/assets?q=monster
- かわいいピクセルアートのモンスター多数
- ダウンロード後、リサイズして配置

### 2. OpenGameArt.org
- URL: https://opengameart.org/art-search?keys=cute+monster
- 検索: "cute monster", "chibi monster"
- ライセンスを確認して使用

### 3. itch.io
- URL: https://itch.io/game-assets/free/tag-monsters
- 無料フィルタで検索
- かわいいスタイルを選択

### 4. Flaticon (無料プラン)
- URL: https://www.flaticon.com/search?word=monster
- かわいいベクター素材
- 帰属表示が必要

## 🚀 使用方法

### ステップ1: 画像をダウンロード
上記サイトからかわいいモンスター画像をダウンロード

### ステップ2: ファイル名変更
ダウンロードした画像を上記のファイル名にリネーム
例: `cute-slime.png` → `slime.png`

### ステップ3: フォルダに配置
このフォルダ (`assets/images/monsters/`) に配置

### ステップ4: 有効化
`js/monster-database.js` を開いて、使いたいモンスターの
`useImage: false` を `useImage: true` に変更

例:
```javascript
slime: {
    id: 'slime',
    name: 'スライム',
    sprite: '🟢',
    spriteImage: 'assets/images/monsters/slime.png',
    useImage: true, // ← ここをtrueに変更
    // ...
}
```

## 🎯 簡単スタート

まず1つのモンスターで試してみましょう：

1. Kenney.nl で "slime" を検索
2. かわいいスライム画像をダウンロード
3. `slime.png` にリネーム
4. このフォルダに配置
5. `monster-database.js` で `slime` の `useImage: true` に変更
6. ゲームをリロード！

## 💡 ヒント

- 画像がない場合は自動的に絵文字が表示されます
- 透過PNG推奨（背景が透明）
- ピクセルアートは自動で綺麗に表示されます
- 各モンスターごとに個別に有効/無効を切り替え可能

## 🎨 自作する場合

以下のツールで自分で描くこともできます：
- **Piskel** (無料) - ピクセルアート作成
- **GIMP** (無料) - 画像編集
- **Krita** (無料) - デジタルペイント

楽しいモンスターを作ってください！ 🎮
