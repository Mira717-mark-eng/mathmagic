# 📐 図形システム使用ガイド

## 概要

マスマジ！の図形システムは、中学1年生向けの**体験型図形問題**を動的に生成し、視覚的に表示するシステムです。

参考資料の「6つの問題タイプ」を完全実装しており、単なる計算問題ではなく「仕組みを理解する」問題を提供します。

## 🎯 実装された6つの問題タイプ

### 1. 理解型問題（Understanding Type）
**目的**: 答えではなく「なぜそうなるか」を理解させる

**例**:
- 対頂角の発見
- 補角の理解

**特徴**:
- 「なぜ？」で終わる質問
- 視覚化で概念を体感
- 自分の言葉で説明させる

### 2. 生活応用型問題（Real-Life Type）
**目的**: 数学と実生活をつなげる

**例**:
- 三角形の屋根の角度
- 三角形の種類を見分ける

**特徴**:
- 実生活の場面（屋根、道路標識など）
- 実感できる題材
- 「身の回りで見つけられる？」

### 3. 比較・推理型問題（Logic Type）
**目的**: 計算よりも「関係性」をつかむ

**例**:
- 面積の比較
- 三角形の面積計算

**特徴**:
- 複数の情報を組み合わせる
- 推理して答えを導く
- 答えが複数ある場合もある

### 4. 間違い探し型問題（Error Finding Type）
**目的**: ミスの理由を自分で説明できるようにする

**例**:
- よくある間違いを提示
- どこが違うかを考えさせる

**特徴**:
- 典型的な間違いパターン
- 「なぜ間違えたと思う？」
- 理解の定着に効果的

### 5. 創造型問題（Creative Type）
**目的**: 数学を「使うもの」として捉える

**例**:
- 指定された角度を作る
- 条件に合う三角形を設計

**特徴**:
- 自分で作る・描く
- 正解が複数ある
- 発想を褒める

### 6. 分解・構造型問題（Structure Type）
**目的**: 図形の仕組みを感覚的に理解

**例**:
- 図形を分解する
- 長方形の中の三角形

**特徴**:
- 操作的・体感的
- 「式 → 体験 → 言葉」
- 視覚化で理解を深める

## 🎨 実装されたファイル

### 1. `js/geometry-generator.js`
**動的問題生成エンジン**

- 毎回異なる数値・シナリオで問題を生成
- 6つの問題タイプに対応
- パターン暗記不可能

**主な機能**:
```javascript
// ランダムな問題を生成
const problem = GeometryGenerator.angleUnderstanding.verticalAngles();

// バランスの取れた15問セットを生成
const problems = GeometryGenerator.generateBalancedSet(15);

// 特定のカテゴリの問題を生成
const angleProblems = GeometryGenerator.generateByCategory('angles', 10);
```

### 2. `js/geometry-visualizer.js`
**Canvas描画システム**

- 図形を視覚的に表示
- インタラクティブな要素
- カラフルで分かりやすい

**対応している描画タイプ**:
- `intersecting-lines` - 交わる直線（対頂角）
- `supplementary-angles` - 補角
- `triangle-angles` - 三角形の内角
- `area-comparison` - 面積の比較
- `triangle-area` - 三角形の面積
- `shape-decomposition` - 図形の分解
- `triangle-in-rectangle` - 長方形の中の三角形

### 3. `js/problems/jh1-geometry-test.json`
**テスト用問題ファイル**

10問の体験型図形問題が含まれています。

### 4. `test-geometry.html`
**テストページ**

図形システムの動作を簡単に確認できます。

## 🚀 使い方

### 方法1: テストページで確認

1. ブラウザで `test-geometry.html` を開く
2. ボタンをクリックして問題を生成
3. 図形を見ながら問題を解く

### 方法2: クエストシステムで使用

1. 問題ファイル（JSON）を作成
2. クエストとして起動

**例**: 図形クエストを起動
```javascript
// ワールドマップから
const session = {
    questId: 'jh1-geometry-test',
    questName: '図形の冒険',
    totalProblems: 10,
    difficulty: 'standard',
    startTime: new Date().toISOString(),
    results: [],
    currentIndex: 0
};

MathMagic.setItem('questSession', session);
window.location.href = 'quest.html';
```

### 方法3: 動的生成を使用

**将来的な拡張**:
```javascript
// クエスト開始時に動的生成
const problems = GeometryGenerator.generateBalancedSet(15);

// 問題をクエスト形式に変換
const questData = {
    questId: 'dynamic-geometry',
    questName: '動的図形クエスト',
    problems: problems.map((p, index) => ({
        id: index + 1,
        ...p,
        question: p.questions[0].text,
        answer: p.questions[0].answer,
        unit: p.questions[0].type === 'number' ? '度' : '',
        hint: p.questions[0].hint || ''
    }))
};
```

## 📊 問題の構造

### 問題データの形式

```javascript
{
    "id": 1,
    "type": "geometry-understanding",
    "category": "angles",
    "title": "📐 角度の不思議を発見しよう",
    "story": "2本の直線が交わったとき、向かい合う角度には秘密があるよ！",
    "question": "角①は50度です。向かい合っている角③は何度？",
    "answer": 50,
    "unit": "度",
    "difficulty": "standard",
    "hint": "対頂角はいつも等しいんだよ",
    "visualizationType": "intersecting-lines",
    "visualData": {
        "angle1": 50,
        "angle2": 130,
        "showLabels": true
    }
}
```

### 重要なフィールド

- **type**: 問題タイプ（geometry-understanding など）
- **category**: カテゴリ（angles, triangles, area など）
- **title**: 問題のタイトル（絵文字付き）
- **story**: ストーリー文（状況説明）
- **question**: 問題文
- **answer**: 正解
- **visualizationType**: 描画タイプ
- **visualData**: 描画に必要なデータ

## 🎮 システムの特徴

### ✅ 実装済み

1. **6つの問題タイプ** - 参考資料を完全実装
2. **動的生成** - 毎回異なる問題
3. **視覚化** - Canvas で図形を描画
4. **体験型学習** - 単なる計算ではない
5. **quest.js統合** - 既存システムと完全統合

### 🔄 今後の拡張可能性

1. **インタラクティブ操作**
   - ドラッグで角度を変える
   - クリックで点を動かす
   - アニメーション効果

2. **適応的難易度**
   - プレイヤーの理解度に応じて数値を調整
   - 苦手な分野を重点的に出題

3. **他の単元への展開**
   - 比例・反比例（グラフ）
   - 方程式（天秤モデル）
   - 正負の数（温度計・数直線）

## 💡 設計のポイント

### 問題生成のバリエーション

参考資料２の「問題生成のバリエーションが重要」という指摘を実現：

```javascript
// ❌ 従来型（固定問題）
{
    "question": "角Aが50度のとき、対頂角は？",
    "answer": 50
}

// ⭕ 新方式（動的生成）
verticalAngles: function() {
    const angle1 = random(30, 150);  // 毎回異なる
    return {
        question: `角①は${angle1}度です。向かい合っている角③は？`,
        answer: angle1,
        visualData: { angle1, angle2: 180 - angle1 }
    };
}
```

### 概念の理解を重視

参考資料の「仕組みを理解する」を実現：

```javascript
// ❌ 単なる計算
"3 × 6 = ?"

// ⭕ 概念の理解
{
    story: "長方形を対角線で切ると...",
    question: "三角形の面積は長方形の半分だよね。だから？",
    visualData: { width: 8, height: 5, showDiagonal: true },
    learningPoint: "三角形は長方形の半分！だから÷2するんだ！"
}
```

## 🔧 トラブルシューティング

### 図形が表示されない

1. `geometry-generator.js` と `geometry-visualizer.js` が読み込まれているか確認
2. Console で `GeometryVisualizer` と `GeometryGenerator` が存在するか確認
3. Canvas要素のIDが `geometry-canvas` になっているか確認

### 問題が生成されない

1. Console でエラーメッセージを確認
2. 問題タイプと メソッド名が正しいか確認
3. `GeometryGenerator.generateBalancedSet()` を試す

### 回答判定が正しくない

1. `answer` フィールドのデータ型を確認（数値 vs 文字列）
2. 単位が正しく設定されているか確認
3. 全角/半角の正規化が機能しているか確認（quest.js の `normalizeAnswer` 関数）

## 📝 まとめ

このシステムは、お子さんが「数学の仕組みを理解する」ことを目的としています。

**重要なポイント**:
1. 単なる計算問題ではない
2. 毎回異なる問題で飽きない
3. 視覚化で理解しやすい
4. 6つの問題タイプでバランスよく学べる
5. ゲーム感覚で楽しめる

参考資料の理念を完全に実装した、お子さんのための特別な学習システムです！

---

**制作**: Claude + あなた
**目的**: お子さんが数学を楽しく理解できるように
**理念**: 「答えを出す」ではなく「仕組みを理解する」
