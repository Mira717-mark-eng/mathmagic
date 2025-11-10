/**
 * マスマジ！- ワールドマップ管理
 * world-map.html用のJavaScript
 * v2: 学年ベース・単元(クエスト)ベースの設計
 */

let worldDesignData = null;

const WorldMap = {
    /**
     * World Design v2のデータを読み込み
     */
    loadWorldDesign: async function() {
        try {
            const response = await fetch('js/problems/world-design-v2.json');
            if (!response.ok) {
                throw new Error(`Failed to load world-design-v2.json: ${response.status}`);
            }
            worldDesignData = await response.json();
            console.log('✅ World Design v2 読み込み完了:', worldDesignData.totalWorlds, 'ワールド,', worldDesignData.totalQuests, 'クエスト');
            return worldDesignData;
        } catch (error) {
            console.error('❌ World Design v2 読み込みエラー:', error);
            throw error;
        }
    },

    /**
     * プレイヤー情報を表示
     */
    displayPlayerInfo: function() {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            console.error('プレイヤーが見つかりません');
            window.location.href = 'index.html';
            return;
        }

        // キャラクターアイコン
        const characterIcons = {
            wizard: '🧙‍♂️',
            knight: '🗡️',
            archer: '🏹',
            healer: '⚕️'
        };

        document.getElementById('character-icon').textContent = characterIcons[player.character] || characterIcons[player.characterType] || '👤';
        document.getElementById('player-name').textContent = player.name;
        document.getElementById('player-level').textContent = player.level;

        // 学年表示
        const gradeElement = document.getElementById('player-grade');
        if (gradeElement) {
            gradeElement.textContent = player.grade;
        }

        // 経験値バー
        const expForNextLevel = MathMagic.getExpForLevel(player.level + 1);
        const expPercentage = (player.exp / expForNextLevel) * 100;

        const expBar = document.getElementById('exp-bar');
        if (expBar) {
            expBar.style.width = `${Math.min(expPercentage, 100)}%`;
        }

        document.getElementById('current-exp').textContent = player.exp;
        document.getElementById('next-level-exp').textContent = expForNextLevel;

        // 統計情報
        const accuracy = PlayerManager.getAccuracy();
        document.getElementById('total-problems').textContent = player.totalProblems || 0;
        document.getElementById('accuracy-rate').textContent = accuracy;
    },

    /**
     * ワールドリストを表示（学年ベース）
     */
    displayWorlds: function() {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            console.error('プレイヤー情報がありません');
            return;
        }

        if (!worldDesignData) {
            console.error('World Design データが読み込まれていません');
            return;
        }

        // プレイヤーの学年に合ったワールドを取得
        // 学年は「小1」「小2」...「小6」「中1」「中2」「中3」の形式
        const gradeMap = {
            '小1': 'grade1',
            '小2': 'grade2',
            '小3': 'grade3',
            '小4': 'grade4',
            '小5': 'grade5',
            '小6': 'grade6',
            '中1': 'junior-high1',
            '中2': 'junior-high2',
            '中3': 'junior-high3'
        };

        const worldId = gradeMap[player.grade];
        const world = worldDesignData.worlds.find(w => w.worldId === worldId);

        console.log(`${player.grade}向けワールド:`, world ? world.worldName : '見つかりません');

        // ワールドカードを生成
        const worldContainer = document.getElementById('worlds-container');

        if (!worldContainer) {
            console.warn('ワールドコンテナが見つかりません');
            return;
        }

        worldContainer.innerHTML = '';

        if (world) {
            const worldCard = this.createWorldCard(world, player);
            worldContainer.appendChild(worldCard);
        } else {
            worldContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-6xl mb-4">🔒</div>
                    <p class="text-xl text-white font-bold">あなたの学年向けのワールドは準備中です</p>
                    <p class="text-white/80 mt-2">もうしばらくお待ちください</p>
                </div>
            `;
        }
    },

    /**
     * ワールドカードを生成（クエストリスト付き）
     */
    createWorldCard: function(world, player) {
        const card = document.createElement('div');
        card.className = 'col-span-full';

        const questsHtml = world.quests.map((quest, index) => {
            // 進捗状況を取得（未実装の場合は0%）
            const progress = this.getQuestProgress(player, quest.questId);
            const isCompleted = progress >= 100;
            const isLocked = index > 0 && this.getQuestProgress(player, world.quests[index-1].questId) < 100;

            return `
                <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition ${isLocked ? 'opacity-50' : 'cursor-pointer'}"
                     data-quest-id="${quest.questId}"
                     data-world-id="${world.worldId}">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="text-3xl">${isCompleted ? '✅' : isLocked ? '🔒' : '📝'}</div>
                            <div>
                                <h4 class="text-lg font-bold text-white">${quest.questName}</h4>
                                <p class="text-white/70 text-sm">${quest.description}</p>
                                <div class="flex items-center space-x-2 mt-1">
                                    <span class="text-xs text-white/60">問題数: ${quest.problemCount}問</span>
                                    <span class="text-xs text-white/60">•</span>
                                    <span class="text-xs text-white/60">難易度: ${quest.difficulty === 'basic' ? '基礎' : quest.difficulty === 'standard' ? '標準' : '応用'}</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            ${isLocked ? `
                                <div class="text-white/70 text-sm">前のクエストをクリア</div>
                            ` : `
                                <button class="start-quest-btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-2 rounded-full shadow-lg transition transform hover:scale-105">
                                    ${isCompleted ? '再挑戦' : '開始'}
                                </button>
                            `}
                            <div class="mt-2 bg-white/20 rounded-full h-2 w-32">
                                <div class="bg-green-400 h-full rounded-full" style="width: ${progress}%"></div>
                            </div>
                            <div class="text-white/70 text-xs mt-1">${progress}%</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        card.innerHTML = `
            <div class="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl">
                <div class="text-center mb-6">
                    <div class="text-8xl mb-4">${world.icon}</div>
                    <h2 class="text-4xl font-bold text-white mb-2">${world.worldName}</h2>
                    <p class="text-white/90 text-lg">${world.description}</p>
                    <div class="flex items-center justify-center space-x-4 mt-4">
                        <span class="bg-white/20 text-white px-4 py-2 rounded-full text-sm">
                            📚 ${world.totalQuests}クエスト
                        </span>
                        <span class="bg-white/20 text-white px-4 py-2 rounded-full text-sm">
                            📝 約${world.estimatedProblems}問
                        </span>
                    </div>
                </div>

                <div class="space-y-3">
                    ${questsHtml}
                </div>
            </div>
        `;

        // クエスト開始ボタンにイベントリスナーを追加
        card.querySelectorAll('.start-quest-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const questCard = btn.closest('[data-quest-id]');
                const questId = questCard.getAttribute('data-quest-id');
                const worldId = questCard.getAttribute('data-world-id');
                this.startQuest(worldId, questId);
            });
        });

        return card;
    },

    /**
     * クエストの進捗状況を取得（0-100%）
     */
    getQuestProgress: function(player, questId) {
        if (!player || !player.questProgress) {
            return 0;
        }

        const progress = player.questProgress[questId];
        if (!progress) {
            return 0;
        }

        // クリア済みなら100%、未クリアならbestScoreを返す
        return progress.completed ? 100 : (progress.bestScore || 0);
    },

    /**
     * クエストを開始
     */
    startQuest: function(worldId, questId) {
        console.log('==================');
        console.log('クエスト開始:', worldId, '/', questId);

        try {
            const player = MathMagic.getCurrentPlayer();
            const world = worldDesignData.worlds.find(w => w.worldId === worldId);
            const quest = world?.quests.find(q => q.questId === questId);

            if (!world || !quest) {
                console.error('ワールドまたはクエストが見つかりません');
                MathMagic.showMessage('クエストが見つかりません', 'error');
                return;
            }

            // 既存のセッションをチェック
            const existingSession = MathMagic.getItem('questSession');

            if (existingSession && existingSession.questId === questId && existingSession.results && existingSession.results.length > 0) {
                // 同じクエストの途中セッションがある
                if (confirm('前回の続きから始めますか？\n「キャンセル」を選ぶと最初からになります。')) {
                    window.location.href = 'quest.html';
                    return;
                } else {
                    MathMagic.removeItem('questSession');
                }
            } else if (existingSession) {
                // 別のクエストのセッションがある
                MathMagic.removeItem('questSession');
            }

            // 新しいセッションを作成
            const newSession = {
                worldId: worldId,
                worldName: world.worldName,
                questId: questId,
                questName: quest.questName,
                unitId: quest.unitId,
                difficulty: quest.difficulty,
                grade: world.grade,
                startTime: new Date().toISOString(),
                currentIndex: 0,
                totalProblems: quest.problemCount,
                problemTypes: quest.problemTypes,
                results: []
            };

            console.log('作成されたセッション:', newSession);
            MathMagic.setItem('questSession', newSession);

            // クエスト画面へ
            window.location.href = 'quest.html';
            console.log('==================');

        } catch (error) {
            console.error('==================');
            console.error('❌ エラーが発生しました:', error);
            console.error('==================');
            alert(`エラーが発生しました:\n${error.message}`);
        }
    },

    /**
     * ホームに戻る
     */
    goHome: function() {
        if (confirm('トップ画面に戻りますか？')) {
            window.location.href = 'index.html';
        }
    },

    /**
     * ログアウト
     */
    logout: function() {
        if (confirm('本当にログアウトしますか？\nデータは保存されています。')) {
            // セッションデータをクリア（プレイヤーデータは保持）
            MathMagic.removeItem('questSession');
            MathMagic.removeItem('lastResult');

            window.location.href = 'index.html';
        }
    },

    /**
     * 保護者ダッシュボードへ
     */
    goToParentDashboard: function() {
        window.location.href = 'parent-dashboard.html';
    },

    /**
     * インベントリへ
     */
    goToInventory: function() {
        window.location.href = 'inventory.html';
    },

    /**
     * ショップへ
     */
    goToShop: function() {
        window.location.href = 'shop.html';
    }
};

/**
 * 初期化
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('ワールドマップを初期化中...');

    // プレイヤー情報がない場合はトップへ
    const player = MathMagic.getCurrentPlayer();
    if (!player) {
        console.log('プレイヤー情報がありません。トップ画面へリダイレクトします。');
        window.location.href = 'index.html';
        return;
    }

    try {
        // World Design v2 を読み込み
        await WorldMap.loadWorldDesign();

        // プレイヤー情報を表示
        WorldMap.displayPlayerInfo();

        // ワールド情報を表示
        WorldMap.displayWorlds();

    } catch (error) {
        console.error('初期化エラー:', error);
        alert('ワールドマップの読み込みに失敗しました。\nページをリロードしてください。');
        return;
    }

    // イベントリスナー
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => WorldMap.goHome());
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => WorldMap.logout());
    }

    const parentDashboardBtn = document.getElementById('parent-dashboard-btn');
    if (parentDashboardBtn) {
        parentDashboardBtn.addEventListener('click', () => WorldMap.goToParentDashboard());
    }

    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });
    }

    // デバッグモード
    if (MathMagic.isDebugMode()) {
        window.WorldMap = WorldMap;
        console.log('🐛 WorldMapをグローバルに公開しました');
    }

    console.log('ワールドマップの初期化完了');
});

console.log('✅ world-map.js ロード完了');
