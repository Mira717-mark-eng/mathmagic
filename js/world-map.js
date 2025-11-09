/**
 * マスマジ！- ワールドマップ管理
 * world-map.html用のJavaScript
 * Phase 2: 複数ワールド対応、学年フィルタリング
 */

const WorldMap = {
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
        
        document.getElementById('character-icon').textContent = characterIcons[player.characterType] || '👤';
        document.getElementById('player-name').textContent = player.name;
        document.getElementById('player-level').textContent = player.level;
        
        // 学年表示
        const gradeElement = document.getElementById('player-grade');
        if (gradeElement) {
            gradeElement.textContent = PlayerManager.getGradeName(player.grade);
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
        document.getElementById('total-problems').textContent = player.totalProblems;
        document.getElementById('accuracy-rate').textContent = accuracy;
    },
    
    /**
     * ワールドリストを表示（学年フィルタリング付き）
     */
    displayWorlds: function() {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            console.error('プレイヤー情報がありません');
            return;
        }

        // プレイヤーの学年に合ったワールドを取得
        const availableWorlds = WORLD_DATABASE.filter(world => {
            // targetGradeが設定されている場合はそれを優先、なければminGrade/maxGradeを使用
            if (world.targetGrade) {
                return player.grade === world.targetGrade;
            }
            return player.grade >= world.minGrade && player.grade <= world.maxGrade;
        });

        console.log(`${player.grade}年生向けワールド:`, availableWorlds.length, '個');
        console.log('利用可能なワールド:', availableWorlds.map(w => w.name));
        
        // ワールドカードを生成
        const worldContainer = document.getElementById('worlds-container');
        
        if (!worldContainer) {
            console.warn('ワールドコンテナが見つかりません');
            return;
        }
        
        worldContainer.innerHTML = '';
        
        availableWorlds.forEach((world, index) => {
            const worldCard = this.createWorldCard(world, player, index);
            worldContainer.appendChild(worldCard);
        });

        // ワールドがない場合のメッセージ
        if (availableWorlds.length === 0) {
            worldContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-6xl mb-4">🔒</div>
                    <p class="text-xl text-white font-bold">あなたの学年向けのワールドは準備中です</p>
                    <p class="text-white/80 mt-2">もうしばらくお待ちください</p>
                </div>
            `;
        }

        // クエスト開始ボタンにイベントリスナーを追加
        this.attachQuestButtonListeners();
    },
    
    /**
     * ワールドカードを生成
     */
    createWorldCard: function(world, player, index) {
        const card = document.createElement('div');
        card.className = 'world-card transform transition-all duration-300 hover:scale-105 hover:shadow-2xl';
        
        // 難易度によって色を変える
        const difficultyColors = {
            1: 'from-green-400 to-green-600',
            2: 'from-blue-400 to-blue-600',
            3: 'from-purple-400 to-purple-600',
            4: 'from-pink-400 to-pink-600',
            5: 'from-red-400 to-red-600'
        };
        
        const gradientClass = difficultyColors[world.difficulty] || 'from-gray-400 to-gray-600';
        
        // ロック状態の判定（レベル要件）
        const isLocked = player.level < world.requiredLevel;
        const lockClass = isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
        
        card.innerHTML = `
            <div class="bg-gradient-to-br ${gradientClass} rounded-xl p-6 relative overflow-hidden ${lockClass}">
                ${isLocked ? '<div class="absolute top-4 right-4 text-4xl">🔒</div>' : ''}
                
                <!-- ワールドアイコン -->
                <div class="text-center mb-4">
                    <div class="text-6xl mb-2">${world.icon}</div>
                    <h3 class="text-2xl font-bold text-white drop-shadow-lg">${world.name}</h3>
                    <p class="text-white/90 text-sm mt-1">${world.description}</p>
                </div>
                
                <!-- ワールド情報 -->
                <div class="bg-white/20 rounded-lg p-3 backdrop-blur-sm mb-4">
                    <div class="flex justify-between items-center text-white text-sm mb-2">
                        <span>対象学年</span>
                        <span class="font-bold">${world.minGrade}〜${world.maxGrade}年生</span>
                    </div>
                    <div class="flex justify-between items-center text-white text-sm mb-2">
                        <span>難易度</span>
                        <span class="font-bold">${'⭐'.repeat(world.difficulty)}</span>
                    </div>
                    <div class="flex justify-between items-center text-white text-sm">
                        <span>必要レベル</span>
                        <span class="font-bold">Lv.${world.requiredLevel}</span>
                    </div>
                </div>
                
                <!-- 開始ボタン -->
                ${isLocked ? `
                    <div class="text-center text-white text-sm py-3">
                        Lv.${world.requiredLevel}で解放されます
                    </div>
                ` : `
                    <button
                        data-world-id="${world.id}"
                        class="start-quest-btn w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-lg shadow-lg transition transform hover:scale-105"
                    >
                        🗡️ 冒険に出発！
                    </button>
                `}
            </div>
        `;
        
        return card;
    },
    
    /**
     * クエスト開始ボタンにイベントリスナーを追加
     */
    attachQuestButtonListeners: function() {
        const questButtons = document.querySelectorAll('.start-quest-btn');
        console.log('クエストボタンを検出:', questButtons.length, '個');

        questButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const worldId = button.getAttribute('data-world-id');
                console.log('クエストボタンがクリックされました:', worldId);
                this.startQuest(worldId);
            });
        });
    },

    /**
     * クエストを開始
     */
    startQuest: function(worldId) {
        console.log('==================');
        console.log('クエスト開始関数が呼ばれました');
        console.log('ワールドID:', worldId);

        try {
            const player = MathMagic.getCurrentPlayer();
            console.log('プレイヤー情報:', player);

            // ワールド情報を取得
            console.log('ワールドデータベースを検索中...');
            const world = WORLD_DATABASE.find(w => w.id === worldId);
            console.log('見つかったワールド:', world);

            if (!world) {
                console.error('エラー: ワールドが見つかりません');
                MathMagic.showMessage('ワールドが見つかりません', 'error');
                return;
            }

            // レベル要件チェック
            console.log('レベル要件チェック: プレイヤーLv', player.level, '必要Lv', world.requiredLevel);
            if (player.level < world.requiredLevel) {
                console.warn('レベル不足');
                MathMagic.showMessage(`Lv.${world.requiredLevel}以上が必要です`, 'warning');
                return;
            }

            // 既存のセッションをチェック
            console.log('既存セッションをチェック中...');
            const existingSession = MathMagic.getItem('questSession');
            console.log('既存セッション:', existingSession);

            if (existingSession && existingSession.worldId === worldId && existingSession.results && existingSession.results.length > 0) {
                // 同じワールドの途中セッションがある
                console.log('同じワールドの途中セッションが見つかりました');
                if (confirm('前回の続きから始めますか？\n「キャンセル」を選ぶと最初からになります。')) {
                    // そのまま継続
                    console.log('継続を選択 → quest.htmlへ遷移');
                    window.location.href = 'quest.html';
                    return;
                } else {
                    // 新しく始める
                    console.log('新規開始を選択 → セッションクリア');
                    MathMagic.removeItem('questSession');
                }
            } else if (existingSession && existingSession.worldId !== worldId) {
                // 別のワールドのセッションがある
                console.log('別のワールドのセッションをクリア');
                MathMagic.removeItem('questSession');
            }

            // 新しいセッションを作成
            console.log('新しいセッションを作成中...');
            const newSession = {
                worldId: worldId,
                worldName: world.name,
                difficulty: world.difficulty,
                targetGrade: world.targetGrade || player.grade,  // targetGradeが未定義の場合はプレイヤーの学年を使用
                useAI: world.aiGeneration?.enabled || false,
                startTime: new Date().toISOString(),
                currentIndex: 0,
                totalProblems: 10,  // 1ワールドあたり10問
                results: []
            };

            console.log('作成されたセッション:', newSession);
            MathMagic.setItem('questSession', newSession);
            console.log('セッションを保存しました');

            // クエスト画面へ
            console.log('quest.htmlへ遷移します');
            console.log('==================');
            window.location.href = 'quest.html';

        } catch (error) {
            console.error('==================');
            console.error('❌ エラーが発生しました:');
            console.error('エラー内容:', error);
            console.error('エラーメッセージ:', error.message);
            console.error('スタックトレース:', error.stack);
            console.error('==================');
            alert(`エラーが発生しました:\n${error.message}\n\nコンソールを確認してください。`);
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
     * デバッグ情報を表示
     */
    showDebugInfo: function() {
        const player = MathMagic.getCurrentPlayer();
        const questSession = MathMagic.getItem('questSession');
        const stats = PlayerManager.getStats();
        
        console.group('🗺️ ワールドマップ - デバッグ情報');
        console.log('プレイヤー:', player);
        console.log('統計:', stats);
        console.log('クエストセッション:', questSession);
        console.log('利用可能ワールド数:', WORLD_DATABASE.filter(w => 
            player.grade >= w.minGrade && player.grade <= w.maxGrade
        ).length);
        console.groupEnd();
        
        MathMagic.showMessage('デバッグ情報をコンソールに出力しました', 'info');
    }
};

/**
 * 初期化
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('ワールドマップを初期化中...');
    
    // プレイヤー情報がない場合はトップへ
    const player = MathMagic.getCurrentPlayer();
    if (!player) {
        console.log('プレイヤー情報がありません。トップ画面へリダイレクトします。');
        window.location.href = 'index.html';
        return;
    }
    
    // プレイヤー情報を表示
    WorldMap.displayPlayerInfo();
    
    // ワールド情報を表示
    WorldMap.displayWorlds();
    
    // イベントリスナー
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            WorldMap.goHome();
        });
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            WorldMap.logout();
        });
    }
    
    const parentDashboardBtn = document.getElementById('parent-dashboard-btn');
    if (parentDashboardBtn) {
        parentDashboardBtn.addEventListener('click', () => {
            WorldMap.goToParentDashboard();
        });
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
