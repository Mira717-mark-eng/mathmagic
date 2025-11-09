# 📚 Claude用カリキュラム調査プロンプト

以下のプロンプトをClaude（最上位プラン）に入力してください。

---

## プロンプト

```
あなたは教育カリキュラム設計の専門家です。日本の小学校・中学校の算数・数学カリキュラムを詳細に調査し、ゲーム化に適したワールド設計を提案してください。

# 調査対象

1. **文部科学省学習指導要領**（2017年告示、現行版）
   - 小学1年〜6年の算数
   - 中学1年〜3年の数学

2. **主要学習塾のカリキュラム**
   - 公文式
   - 学研
   - 栄光ゼミナール
   - その他有名塾（可能であれば）

# 調査内容

各学年について以下を調査してください：

## 1. 主要単元
- 単元名（例：「掛け算（九九）」「分数の計算」「一次方程式」）
- 学習内容の詳細
- 難易度レベル（入門・基礎・標準・応用）

## 2. 学習順序
- 単元の学習順序
- 前提知識（この単元を学ぶ前に必要な知識）
- 発展内容（この単元の後に学ぶ内容）

## 3. 重要度
- 必修レベル（全員が習得すべき）
- 標準レベル（多くの生徒が習得）
- 発展レベル（得意な生徒向け）

# 出力形式

以下の3つのJSONファイルとして出力してください：

## ファイル1: elementary-curriculum.json

\`\`\`json
{
  "小学1年": {
    "units": [
      {
        "id": "elem1_addition_basic",
        "name": "たし算（1桁）",
        "description": "1桁の数のたし算（1+1〜9+9）",
        "difficulty": "basic",
        "order": 1,
        "prerequisites": ["数の概念（1〜10）"],
        "nextUnits": ["たし算（繰り上がり）"],
        "importance": "必修",
        "estimatedProblems": 30,
        "keywords": ["たし算", "1桁", "合成"]
      },
      {
        "id": "elem1_subtraction_basic",
        "name": "ひき算（1桁）",
        "description": "1桁の数のひき算（9-1〜10-9）",
        "difficulty": "basic",
        "order": 2,
        "prerequisites": ["たし算（1桁）"],
        "nextUnits": ["ひき算（繰り下がり）"],
        "importance": "必修",
        "estimatedProblems": 30,
        "keywords": ["ひき算", "1桁", "分解"]
      }
      // ... 以下、小学1年のすべての単元
    ]
  },
  "小学2年": {
    "units": [
      // ... 小学2年のすべての単元
    ]
  },
  // ... 小学6年まで
}
\`\`\`

## ファイル2: junior-high-curriculum.json

\`\`\`json
{
  "中学1年": {
    "units": [
      {
        "id": "jh1_positive_negative",
        "name": "正負の数",
        "description": "正の数・負の数の概念と四則演算",
        "difficulty": "basic",
        "order": 1,
        "prerequisites": ["小学算数の四則演算"],
        "nextUnits": ["文字式"],
        "importance": "必修",
        "estimatedProblems": 50,
        "keywords": ["正負", "整数", "加法", "減法", "乗法", "除法"]
      }
      // ... 以下、中学1年のすべての単元
    ]
  },
  "中学2年": {
    "units": [
      // ... 中学2年のすべての単元
    ]
  },
  "中学3年": {
    "units": [
      // ... 中学3年のすべての単元
    ]
  }
}
\`\`\`

## ファイル3: world-design.json

上記のカリキュラムをもとに、RPG風教育ゲームの「ワールド」を設計してください。
各ワールドは特定の単元をカバーし、100問程度の問題を含むことを想定しています。

\`\`\`json
{
  "worlds": [
    {
      "worldId": "addition-meadow",
      "worldName": "たし算の草原",
      "icon": "🌱",
      "targetGrades": ["小1", "小2"],
      "targetUnits": ["elem1_addition_basic", "elem2_addition_carryover"],
      "description": "たし算の基礎を学ぶ草原。1桁から2桁の繰り上がりまでマスターしよう！",
      "difficulty": 1,
      "totalProblems": 100,
      "problemBreakdown": {
        "basic": 40,
        "standard": 40,
        "advanced": 20
      },
      "prerequisites": [],
      "recommendedAfter": null,
      "estimatedCompletionTime": "2-4時間",
      "learningGoals": [
        "1桁のたし算を瞬時に解けるようになる",
        "繰り上がりのあるたし算を理解する",
        "文章題でたし算を使えるようになる"
      ]
    },
    {
      "worldId": "multiplication-forest",
      "worldName": "掛け算の森",
      "icon": "🌲",
      "targetGrades": ["小2", "小3", "小4"],
      "targetUnits": ["elem2_multiplication_table", "elem3_multiplication_2digit"],
      "description": "九九をマスターし、2桁の掛け算まで学ぶ深い森。掛け算の真の力を手に入れよう！",
      "difficulty": 2,
      "totalProblems": 100,
      "problemBreakdown": {
        "basic": 30,
        "standard": 50,
        "advanced": 20
      },
      "prerequisites": ["addition-meadow"],
      "recommendedAfter": "subtraction-mountain",
      "estimatedCompletionTime": "3-5時間",
      "learningGoals": [
        "九九を完全に暗記する",
        "2桁×1桁の掛け算を解けるようになる",
        "掛け算の文章題を理解する"
      ]
    }
    // ... 以下、15-20個のワールドを設計
  ],
  "worldProgression": {
    "elementary": [
      "addition-meadow",
      "subtraction-mountain",
      "multiplication-forest",
      "division-cave",
      "fraction-tower",
      "decimal-sea",
      "area-plaza"
      // ... 小学生向けワールド
    ],
    "juniorHigh": [
      "positive-negative-realm",
      "equation-battlefield",
      "function-temple",
      "geometry-universe"
      // ... 中学生向けワールド
    ]
  },
  "designPrinciples": {
    "gameFirst": "ゲーム性を最優先し、勉強感を出さない",
    "curriculumAligned": "文科省指導要領と塾カリキュラムに準拠",
    "progressiveChallenge": "段階的に難易度が上がる設計",
    "diverseProblems": "計算・式選択・逆算・文章題など多様な問題形式",
    "familyFriendly": "小学生2人・中学生1人の家族で楽しめる"
  }
}
\`\`\`

# 重要な注意事項

1. **網羅性**: すべての学年・すべての主要単元を漏れなく調査してください
2. **正確性**: 文科省の公式資料を参照し、正確な情報を提供してください
3. **実用性**: ゲーム設計に使えるよう、具体的で詳細な情報を含めてください
4. **ワールド設計**: 15-20個のワールドを設計し、各ワールドが100問程度をカバーできるようにしてください
5. **難易度バランス**: 簡単すぎず難しすぎず、子供が楽しめる適切な難易度配分を考慮してください
6. **多様性**: 単なる計算問題だけでなく、文章題・式選択・逆算など多様な問題タイプを想定してください

# 出力方法

3つのJSONファイルの内容を順番に出力してください。
各ファイルは完全な形式で、そのままコピー&ペーストして使えるようにしてください。

それでは、調査を開始してください！
```

---

## 📁 ファイル保存先

調査が完了したら、以下のファイルをこのフォルダ（`curriculum-research/`）に保存してください：

1. `elementary-curriculum.json`
2. `junior-high-curriculum.json`
3. `world-design.json`

## 次のステップ

ファイル保存後、元のClaude Code（このプロジェクト）に戻って、以下のように伝えてください：

```
カリキュラム調査が完了しました。curriculum-research/ フォルダにファイルを保存しました。
```

その後、私が調査結果を読み込んで、問題データベースとワールド設計を実装します。
