# 🎨 かわいいモンスター画像の追加方法

## 📝 概要
モンスターバトルシステムに、かわいいモンスター画像を追加できるようになりました！
現在は絵文字ですが、PNG画像に簡単に切り替えられます。

## 🚀 クイックスタート（3ステップ）

### ステップ1: 画像をダウンロード
**おすすめサイト: Kenney.nl** (完全無料・商用OK)

1. https://kenney.nl/assets/monster-kit にアクセス
2. "Download" ボタンをクリック
3. ZIPファイルを解凍

または

1. https://kenney.nl/assets を開く
2. 検索バーで "monster" と入力
3. 好きなモンスターパックをダウンロード

### ステップ2: 画像を配置
ダウンロードした画像を以下のフォルダにコピー：
```
mathmagic/assets/images/monsters/
```

ファイル名は以下のいずれかに変更：
- `slime.png` - スライム
- `bat.png` - こうもり
- `goblin.png` - ゴブリン
- `skeleton.png` - スケルトン
- `orc.png` - オーク
- `dragon_baby.png` - ベビードラゴン
- `demon.png` - デーモン
- `dragon.png` - ドラゴン

### ステップ3: 有効化
`js/monster-database.js` を開いて、該当モンスターの設定を変更：

**変更前:**
```javascript
slime: {
    // ...
    useImage: false,  // ← ここ
    // ...
}
```

**変更後:**
```javascript
slime: {
    // ...
    useImage: true,  // ← trueに変更
    // ...
}
```

保存してブラウザをリロード！ 🎉

## 🎨 画像の推奨仕様

- **サイズ**: 200×200px または 256×256px
- **形式**: PNG（透過背景推奨）
- **スタイル**: かわいいデフォルメ、ピクセルアート、カートゥーン

## 🌐 無料素材サイト一覧

### 1️⃣ Kenney.nl ⭐ 一番おすすめ！
- **URL**: https://kenney.nl/assets?q=monster
- **特徴**: 完全無料、商用OK、クレジット不要
- **スタイル**: ピクセルアート、3D、カートゥーン
- **おすすめパック**:
  - Monster Kit
  - Creature Pack
  - Micro RPG

### 2️⃣ OpenGameArt.org
- **URL**: https://opengameart.org/art-search?keys=cute+monster
- **特徴**: フリー素材、ライセンス確認必要
- **検索ワード**: "cute monster", "chibi enemy"

### 3️⃣ itch.io
- **URL**: https://itch.io/game-assets/free/tag-monsters
- **特徴**: 無料・有料混在、クリエイター支援
- **フィルター**: "Free" をチェック

### 4️⃣ Flaticon
- **URL**: https://www.flaticon.com/search?word=cute%20monster
- **特徴**: ベクター素材、無料プランあり
- **注意**: 帰属表示が必要

### 5️⃣ Game-icons.net
- **URL**: https://game-icons.net/tags/creature.html
- **特徴**: アイコン素材、CC BY 3.0
- **用途**: シンプルなモンスターアイコン

## 🎯 実践例

### 例1: スライムを画像に変更

1. **Kenney.nlでスライムを探す**
   ```
   https://kenney.nl/assets/monster-kit
   → "slime.png" をダウンロード
   ```

2. **ファイルを配置**
   ```
   mathmagic/assets/images/monsters/slime.png
   ```

3. **設定を変更** (`js/monster-database.js`)
   ```javascript
   slime: {
       id: 'slime',
       name: 'スライム',
       sprite: '🟢',
       spriteImage: 'assets/images/monsters/slime.png',
       useImage: true,  // ← 変更
       // ...
   }
   ```

4. **完了！** ブラウザをリロード

### 例2: 全モンスターを一気に変更

1. Kenney.nl から "Monster Kit" をダウンロード
2. 各画像を適切な名前にリネーム
3. すべて `assets/images/monsters/` に配置
4. `monster-database.js` で全モンスターの `useImage: true` に変更

## 🛠️ トラブルシューティング

### Q: 画像が表示されない
**A:** 以下を確認：
1. ファイル名が正確か（大文字小文字も一致）
2. ファイルパスが正しいか
3. 画像形式がPNGか
4. `useImage: true` に設定したか

### Q: 画像が荒く表示される
**A:**
- PNG画像のサイズを200×200px以上に
- ピクセルアートの場合、CSSで自動調整されます

### Q: 一部だけ絵文字のまま
**A:**
- 意図的な設計です
- 画像がないモンスターは自動で絵文字が表示されます
- 好きなモンスターだけ画像にできます

## 🎨 自分で描く場合

### 無料ツール
1. **Piskel** - https://www.piskelapp.com/
   - ピクセルアート作成
   - ブラウザで動作

2. **GIMP** - https://www.gimp.org/
   - Photoshop代替
   - 高機能画像編集

3. **Krita** - https://krita.org/
   - デジタルペイント
   - アニメーション機能

### 描き方のコツ
- シンプルな形から始める
- 目を大きくするとかわいくなる
- 色は3〜4色程度に抑える
- 輪郭線をはっきりさせる

## 📊 現在のモンスター一覧

| ID | 名前 | 難易度 | 推奨スタイル |
|---|---|---|---|
| slime | スライム | 1 | 丸っこい、ぷにぷに |
| bat | こうもり | 1 | 羽が大きい、デフォルメ |
| goblin | ゴブリン | 3 | 小柄、いたずら好き |
| skeleton | スケルトン | 3 | かわいい骸骨 |
| orc | オーク | 4 | 筋肉質だけどかわいい |
| dragon_baby | ベビードラゴン | 5 | 小さい、子供っぽい |
| demon | デーモン | 6 | ツノ、でもかわいい |
| dragon | ドラゴン | 7 | 威厳あるけどかわいい |

## 💡 アドバイス

### 最初は1つから
全部やろうとせず、好きなモンスター1つから試してみましょう！

### 統一感を持たせる
同じ素材サイトから選ぶと、スタイルが統一されて見た目が良くなります。

### テストする
画像を追加したら、実際にゲームをプレイして確認しましょう。

## 🎉 完成したら

モンスターがかわいくなって、ゲームがもっと楽しくなります！
子供たちも喜ぶこと間違いなし 🎮✨

---

**質問があれば、遠慮なく聞いてください！**
Happy Monster Hunting! 🐉
