# 📋 Phase 2 実装計画書

**マスマジ！～魔法数学冒険記～**  
**Phase 2: ゲーム要素強化 + 学年対応**

---

## 🎯 Phase 2の目標

### メイン目標
「複数のワールドで遊べる状態にし、学年に応じた適切な学習体験を提供する」

### 達成条件
1. ✅ 4つの新しいワールドが遊べる（小3〜小4対応）
2. ✅ 学年に応じたワールド表示ができる
3. ✅ ヒントシステムが動作する
4. ✅ 報酬システム（コイン・ガチャ）が動作する
5. ✅ キャラクター画面で装備が見られる

---

## 📊 Phase 1との比較

| 項目 | Phase 1 | Phase 2 | 増加 |
|------|---------|---------|------|
| ワールド数 | 1個 | 5個 | +4個 |
| 問題数 | 10問 | 50問 | +40問 |
| 対応学年 | 小3のみ | 小3〜小4 | +1学年 |
| ヒント機能 | なし | 3段階 | 新規 |
| 報酬システム | なし | あり | 新規 |
| 装備システム | データのみ | 表示+管理 | 新規 |
| HTMLファイル | 5個 | 7個 | +2個 |
| JSファイル | 5個 | 8個 | +3個 |

---

## 🗂️ 実装の優先順位

### 優先度：最高（Phase 2必須）
1. **Phase 1改修**
   - ワールドデータベースの再設計
   - 学年判定システム
   - ワールド選択システム

2. **新ワールド実装**
   - 割り算の洞窟（小3）
   - 分数の塔（小3）
   - 小数の海（小4）
   - 面積の広場（小4）

3. **ヒントシステム**
   - 3段階ヒント表示
   - ヒント使用による経験値調整

### 優先度：高（Phase 2推奨）
4. **報酬システム**
   - コイン獲得
   - ガチャシステム
   - アイテム管理

5. **キャラクター画面**
   - character.html作成
   - ステータス表示
   - 装備管理

### 優先度：中（Phase 2.5または3）
6. **デイリーミッション**
7. **サウンドエフェクト**
8. **アニメーション強化**

---

## 📁 実装するファイル

### Phase 1改修ファイル
1. **js/worlds.js** 🆕
   - ワールドデータベース
   - 全ワールド定義
   - 問題データ

2. **js/world-map.js** 🔧
   - 学年判定ロジック追加
   - 複数ワールド表示
   - ワールド選択処理

3. **world-map.html** 🔧
   - 複数ワールドカード表示
   - 学年別フィルタリング

4. **js/quest.js** 🔧
   - ワールドID対応
   - 動的問題読み込み

### Phase 2新規ファイル
5. **js/hint.js** 🆕
   - ヒントシステム
   - 段階的ヒント表示

6. **js/rewards.js** 🆕
   - コイン管理
   - ガチャシステム
   - アイテム管理

7. **character.html** 🆕
   - キャラクター画面

8. **js/character.js** 🆕
   - キャラクター情報表示
   - 装備管理

9. **gacha.html** 🆕
   - ガチャ画面

10. **js/gacha.js** 🆕
    - ガチャ処理
    - アニメーション

---

## 🔧 Phase 1改修詳細

### 1. ワールドデータベース作成（worlds.js）

#### ファイル構成
```javascript
// js/worlds.js

// 全ワールドデータ
const WORLD_DATABASE = [
    {
        id: 'multiplication_forest',
        name: '掛け算の森',
        icon: '🌲',
        targetGrade: 3,
        minGrade: 2,
        difficulty: 2,
        unitName: '掛け算（2桁×1桁）',
        description: '九九の魔法を学ぶ森',
        story: '魔法の森には掛け算の秘密が隠されている...',
        totalProblems: 10,
        xpRange: [50, 80],
        phase: 1,
        status: 'available',
        prerequisite: null,
        problems: MULTIPLICATION_PROBLEMS // 既存データ
    },
    {
        id: 'division_cave',
        name: '割り算の洞窟',
        icon: '⛰️',
        targetGrade: 3,
        minGrade: 3,
        difficulty: 2,
        unitName: '割り算の基礎',
        description: '分け合う力を学ぶ洞窟',
        story: '暗い洞窟で宝物を分け合う冒険が...',
        totalProblems: 10,
        xpRange: [50, 80],
        phase: 2,
        status: 'available',
        prerequisite: 'multiplication_forest',
        problems: DIVISION_PROBLEMS // 新規
    },
    // ... 他のワールド
];

// 問題データ（既存）
const MULTIPLICATION_PROBLEMS = [ /* 既存の10問 */ ];

// 問題データ（新規）
const DIVISION_PROBLEMS = [
    {
        id: 1,
        story: "洞窟で見つけた12個のリンゴを、3人の冒険者で等しく分けます。1人何個もらえるでしょう？",
        question: "12 ÷ 3 = ?",
        answer: 4,
        unit: "個",
        difficulty: "easy",
        xp: 50,
        hints: [
            "割り算は「等しく分ける」計算だよ",
            "12個を3つのグループに分けてみよう",
            "12 ÷ 3 = 4、答えは4個だよ"
        ]
    },
    // ... 残り9問
];

// ワールド取得関数
function getWorldById(worldId) {
    return WORLD_DATABASE.find(w => w.id === worldId);
}

// 学年別ワールド取得
function getAvailableWorlds(playerGrade) {
    return WORLD_DATABASE.filter(world => {
        if (world.status !== 'available') return false;
        if (playerGrade < world.minGrade) return false;
        const gradeRange = 1;
        return Math.abs(playerGrade - world.targetGrade) <= gradeRange;
    }).sort((a, b) => {
        if (a.targetGrade !== b.targetGrade) {
            return a.targetGrade - b.targetGrade;
        }
        return a.difficulty - b.difficulty;
    });
}
```

---

### 2. world-map.js改修

#### 追加機能
```javascript
// 学年に応じたワールド表示
function displayWorlds() {
    const player = MathMagic.getCurrentPlayer();
    const availableWorlds = getAvailableWorlds(player.grade);
    
    const worldsContainer = document.getElementById('worlds-container');
    worldsContainer.innerHTML = '';
    
    availableWorlds.forEach(world => {
        const worldCard = createWorldCard(world, player);
        worldsContainer.appendChild(worldCard);
    });
}

// ワールドカード作成
function createWorldCard(world, player) {
    const isUnlocked = isWorldUnlocked(world, player);
    const progress = getWorldProgress(world.id, player);
    
    const card = document.createElement('div');
    card.className = `world-card ${isUnlocked ? '' : 'locked'}`;
    card.innerHTML = `
        <div class="world-icon">${world.icon}</div>
        <h3>${world.name}</h3>
        <p>${world.description}</p>
        <div class="progress">${progress.completed}/${world.totalProblems}</div>
        <button ${isUnlocked ? '' : 'disabled'}>
            ${isUnlocked ? '冒険する' : 'ロック中'}
        </button>
    `;
    
    if (isUnlocked) {
        card.querySelector('button').addEventListener('click', () => {
            startWorld(world.id);
        });
    }
    
    return card;
}

// ワールド開始
function startWorld(worldId) {
    MathMagic.setItem('currentWorldId', worldId);
    window.location.href = 'quest.html';
}
```

---

### 3. quest.js改修

#### 動的ワールド読み込み
```javascript
// 現在のワールドを取得
function initQuestSession() {
    const worldId = MathMagic.getItem('currentWorldId') || 'multiplication_forest';
    const world = getWorldById(worldId);
    
    if (!world) {
        console.error('ワールドが見つかりません');
        window.location.href = 'world-map.html';
        return;
    }
    
    // ワールドの問題を使用
    CURRENT_PROBLEMS = world.problems;
    
    // セッション初期化
    const session = MathMagic.getItem('questSession');
    if (session && session.worldId === worldId) {
        questSession = session;
        currentProblemIndex = session.currentIndex || 0;
    } else {
        questSession = {
            worldId: worldId,
            worldName: world.name,
            startTime: new Date().toISOString(),
            currentIndex: 0,
            results: []
        };
        MathMagic.setItem('questSession', questSession);
    }
}
```

---

## 🆕 Phase 2新機能実装

### 1. ヒントシステム（hint.js）

#### 機能概要
- 3段階のヒント表示
- ヒント使用回数のカウント
- 経験値の調整

#### 実装
```javascript
// js/hint.js

const HintSystem = {
    maxHints: 3,
    currentHintLevel: 0,
    
    // ヒントを表示
    showHint: function(problem) {
        if (this.currentHintLevel >= this.maxHints) {
            MathMagic.showMessage('これ以上ヒントはありません', 'info');
            return;
        }
        
        this.currentHintLevel++;
        const hint = problem.hints[this.currentHintLevel - 1];
        
        // ヒント表示
        document.getElementById('hint-display').innerHTML = `
            <div class="hint-card animate-fade-in">
                <div class="hint-level">ヒント ${this.currentHintLevel}/3</div>
                <p>${hint}</p>
            </div>
        `;
        
        // ヒントボタンの更新
        this.updateHintButton();
    },
    
    // 経験値調整率を取得
    getExpModifier: function() {
        const modifiers = [1.0, 0.8, 0.6, 0.4];
        return modifiers[this.currentHintLevel];
    },
    
    // リセット
    reset: function() {
        this.currentHintLevel = 0;
        document.getElementById('hint-display').innerHTML = '';
    }
};
```

#### quest.htmlへの追加
```html
<!-- ヒント表示エリア -->
<div id="hint-display" class="mt-4"></div>

<!-- ヒントボタン -->
<button id="hint-btn" class="hint-button">
    <i class="fas fa-lightbulb mr-2"></i>
    ヒントを見る（1/3）
</button>
```

---

### 2. 報酬システム（rewards.js）

#### コイン管理
```javascript
// js/rewards.js

const RewardSystem = {
    // コイン獲得
    earnCoins: function(amount) {
        const player = MathMagic.getCurrentPlayer();
        player.coins = (player.coins || 0) + amount;
        PlayerManager.updatePlayer({ coins: player.coins });
        
        // コイン獲得演出
        this.showCoinAnimation(amount);
    },
    
    // コイン使用
    spendCoins: function(amount) {
        const player = MathMagic.getCurrentPlayer();
        if (player.coins < amount) {
            MathMagic.showMessage('コインが足りません', 'error');
            return false;
        }
        
        player.coins -= amount;
        PlayerManager.updatePlayer({ coins: player.coins });
        return true;
    },
    
    // ガチャを引く
    drawGacha: function() {
        const cost = 100; // コスト100コイン
        
        if (!this.spendCoins(cost)) {
            return null;
        }
        
        // ランダムにアイテムを選択
        const item = this.getRandomItem();
        
        // インベントリに追加
        this.addToInventory(item);
        
        return item;
    },
    
    // ランダムアイテム取得
    getRandomItem: function() {
        const items = ITEM_DATABASE;
        const rarityWeights = {
            common: 60,
            rare: 30,
            epic: 9,
            legendary: 1
        };
        
        // レアリティ決定
        const rarity = this.selectRarity(rarityWeights);
        
        // アイテム選択
        const rarityItems = items.filter(i => i.rarity === rarity);
        return MathMagic.randomChoice(rarityItems);
    }
};
```

#### アイテムデータベース
```javascript
const ITEM_DATABASE = [
    // 武器
    {
        id: 'wooden_sword',
        name: '木の剣',
        type: 'weapon',
        rarity: 'common',
        icon: '🗡️',
        effect: { xpBonus: 5 },
        description: '初心者用の木の剣'
    },
    {
        id: 'steel_sword',
        name: '鋼の剣',
        type: 'weapon',
        rarity: 'rare',
        icon: '⚔️',
        effect: { xpBonus: 15 },
        description: '鋭く光る鋼の剣'
    },
    // ... 他のアイテム
];
```

---

### 3. キャラクター画面（character.html + character.js）

#### character.html
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <!-- 省略 -->
    <title>キャラクター - マスマジ！</title>
</head>
<body>
    <header><!-- ナビゲーション --></header>
    
    <main class="container">
        <!-- キャラクター情報 -->
        <div class="character-info">
            <div class="character-avatar"></div>
            <h2 id="player-name"></h2>
            <div class="level">Lv.<span id="level"></span></div>
        </div>
        
        <!-- ステータス -->
        <div class="stats-card">
            <h3>ステータス</h3>
            <div class="stat-row">
                <span>経験値</span>
                <span id="exp"></span>
            </div>
            <!-- 他のステータス -->
        </div>
        
        <!-- 装備 -->
        <div class="equipment-card">
            <h3>装備</h3>
            <div class="equipment-slots">
                <div class="slot weapon" data-slot="weapon">
                    <div class="slot-icon">🗡️</div>
                    <div class="slot-name">武器</div>
                </div>
                <!-- 他のスロット -->
            </div>
        </div>
        
        <!-- インベントリ -->
        <div class="inventory-card">
            <h3>所持アイテム</h3>
            <div id="inventory-grid" class="grid"></div>
        </div>
    </main>
    
    <script src="js/main.js"></script>
    <script src="js/player.js"></script>
    <script src="js/rewards.js"></script>
    <script src="js/character.js"></script>
</body>
</html>
```

---

## 📊 実装スケジュール

### Week 1: Phase 1改修
- Day 1-2: ワールドデータベース作成
- Day 3-4: world-map.js/html改修
- Day 4-5: quest.js改修
- Day 5: テスト

### Week 2: 新ワールド実装
- Day 1: 割り算の洞窟（問題作成）
- Day 2: 分数の塔（問題作成）
- Day 3: 小数の海（問題作成）
- Day 4: 面積の広場（問題作成）
- Day 5: テスト

### Week 3: Phase 2機能実装
- Day 1-2: ヒントシステム
- Day 3-4: 報酬システム
- Day 5-6: キャラクター画面
- Day 7: 統合テスト

### Week 4: 仕上げ
- Day 1-2: バグ修正
- Day 3-4: ドキュメント作成
- Day 5: 最終テスト
- Day 6-7: リリース準備

---

## ✅ 実装チェックリスト

### Phase 1改修
- [ ] js/worlds.js作成
- [ ] ワールドデータ定義
- [ ] 学年判定ロジック
- [ ] world-map.js改修
- [ ] world-map.html改修
- [ ] quest.js改修
- [ ] 動作テスト

### 新ワールド
- [ ] 割り算の洞窟（10問）
- [ ] 分数の塔（10問）
- [ ] 小数の海（10問）
- [ ] 面積の広場（10問）

### Phase 2機能
- [ ] ヒントシステム
- [ ] 報酬システム
- [ ] ガチャシステム
- [ ] キャラクター画面
- [ ] アイテム管理

### テスト
- [ ] 学年別表示テスト
- [ ] ワールド選択テスト
- [ ] ヒント機能テスト
- [ ] ガチャ機能テスト
- [ ] データ永続化テスト

### ドキュメント
- [ ] Phase 2完成報告
- [ ] ユーザーガイド更新
- [ ] README更新

---

## 🎯 Phase 2完成の定義

以下がすべて動作すること：

1. ✅ 5つのワールドが遊べる
2. ✅ 学年に応じた表示ができる
3. ✅ ヒントが3段階表示される
4. ✅ コインが獲得・使用できる
5. ✅ ガチャでアイテムが手に入る
6. ✅ キャラクター画面で装備が見られる
7. ✅ 全機能がエラーなく動作する

---

**作成日**: 2024年11月2日  
**実装開始**: 準備完了後すぐ  
**予定完了**: 4週間後

---

© 2024 マスマジ！～魔法数学冒険記～
