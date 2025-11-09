/**
 * マスマジ！- アチーブメント/バッジシステム
 * DQ風称号・実績システム
 */

const AchievementSystem = {
    // アチーブメント定義
    achievements: [
        // 初心者向け
        {
            id: 'first_quest',
            name: '冒険の始まり',
            description: '初めてクエストをクリアした',
            icon: '⭐',
            condition: (player) => player.totalProblems >= 1,
            reward: { exp: 50 }
        },
        {
            id: 'level_5',
            name: '駆け出し冒険者',
            description: 'レベル5に到達した',
            icon: '🎖️',
            condition: (player) => player.level >= 5,
            reward: { exp: 100 }
        },
        {
            id: 'level_10',
            name: '熟練冒険者',
            description: 'レベル10に到達した',
            icon: '🏅',
            condition: (player) => player.level >= 10,
            reward: { exp: 200, item: 'power_ring' }
        },
        {
            id: 'level_20',
            name: '伝説の勇者',
            description: 'レベル20に到達した',
            icon: '👑',
            condition: (player) => player.level >= 20,
            reward: { exp: 500, item: 'hero_sword' }
        },

        // 正解数系
        {
            id: 'correct_10',
            name: '算術の才能',
            description: '10問正解した',
            icon: '📚',
            condition: (player) => player.correctProblems >= 10,
            reward: { exp: 100 }
        },
        {
            id: 'correct_50',
            name: '計算マスター',
            description: '50問正解した',
            icon: '🧮',
            condition: (player) => player.correctProblems >= 50,
            reward: { exp: 300, item: 'wisdom_scroll' }
        },
        {
            id: 'correct_100',
            name: '数学の賢者',
            description: '100問正解した',
            icon: '🧙',
            condition: (player) => player.correctProblems >= 100,
            reward: { exp: 500, item: 'sage_staff' }
        },

        // 連続正解系
        {
            id: 'streak_5',
            name: '絶好調',
            description: '5問連続正解した',
            icon: '🔥',
            condition: (player) => player.maxStreak >= 5,
            reward: { exp: 150 }
        },
        {
            id: 'streak_10',
            name: '無敵モード',
            description: '10問連続正解した',
            icon: '⚡',
            condition: (player) => player.maxStreak >= 10,
            reward: { exp: 300, item: 'lightning_ring' }
        },

        // 正答率系
        {
            id: 'accuracy_80',
            name: '正確無比',
            description: '正答率80%以上を達成',
            icon: '🎯',
            condition: (player) => {
                return player.totalProblems >= 10 &&
                       (player.correctProblems / player.totalProblems) >= 0.8;
            },
            reward: { exp: 200 }
        },
        {
            id: 'accuracy_95',
            name: '完璧主義者',
            description: '正答率95%以上を達成',
            icon: '💎',
            condition: (player) => {
                return player.totalProblems >= 20 &&
                       (player.correctProblems / player.totalProblems) >= 0.95;
            },
            reward: { exp: 500, item: 'perfect_gem' }
        },

        // ワールドクリア系
        {
            id: 'world_1',
            name: '森の守護者',
            description: '掛け算の森をクリア',
            icon: '🌲',
            condition: (player) => {
                return player.completedWorlds &&
                       player.completedWorlds.some(w => w.id === 'multiplication_forest' && w.completed);
            },
            reward: { exp: 200 }
        },
        {
            id: 'world_all',
            name: '世界の救世主',
            description: 'すべてのワールドをクリア',
            icon: '🌟',
            condition: (player) => {
                return player.completedWorlds && player.completedWorlds.length >= 6;
            },
            reward: { exp: 1000, item: 'hero_crown' }
        },

        // 特殊系
        {
            id: 'no_hint',
            name: 'ヒント不要',
            description: 'ヒントなしで10問クリア',
            icon: '🧠',
            condition: (player) => player.noHintClears >= 10,
            reward: { exp: 300 }
        },
        {
            id: 'speed_master',
            name: '電光石火',
            description: '10秒以内に問題を5回クリア',
            icon: '⚡',
            condition: (player) => player.quickClears >= 5,
            reward: { exp: 250, item: 'speed_boots' }
        }
    ],

    /**
     * アチーブメントをチェック
     */
    checkAchievements: function(player) {
        if (!player.achievements) {
            player.achievements = [];
        }

        const newAchievements = [];

        this.achievements.forEach(achievement => {
            // 既に獲得済みかチェック
            if (player.achievements.includes(achievement.id)) {
                return;
            }

            // 条件を満たしているかチェック
            if (achievement.condition(player)) {
                player.achievements.push(achievement.id);
                newAchievements.push(achievement);

                // 報酬を付与
                if (achievement.reward.exp) {
                    player.exp += achievement.reward.exp;
                }
                if (achievement.reward.item) {
                    if (!player.inventory) player.inventory = [];
                    player.inventory.push(achievement.reward.item);
                }
            }
        });

        // プレイヤーデータを更新
        if (newAchievements.length > 0) {
            PlayerManager.updatePlayer(player);
        }

        return newAchievements;
    },

    /**
     * アチーブメント獲得演出を表示
     */
    showAchievement: function(achievement) {
        SoundSystem.playSound('fanfare');

        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in';
        notification.innerHTML = `
            <div class="dq-window p-6 max-w-md">
                <div class="text-center">
                    <div class="text-6xl mb-4 animate-bounce">${achievement.icon}</div>
                    <div class="dq-gold-text text-2xl mb-2">称号獲得！</div>
                    <div class="text-white text-xl font-bold mb-2">${achievement.name}</div>
                    <div class="text-blue-100 text-sm mb-4">${achievement.description}</div>
                    ${achievement.reward.exp ? `<div class="text-yellow-300 text-lg">経験値 +${achievement.reward.exp}</div>` : ''}
                    ${achievement.reward.item ? `<div class="text-green-300 text-lg">アイテム獲得: ${this.getItemName(achievement.reward.item)}</div>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50px)';
            notification.style.transition = 'all 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    },

    /**
     * アイテム名を取得
     */
    getItemName: function(itemId) {
        const itemNames = {
            'power_ring': '力の指輪',
            'hero_sword': '勇者の剣',
            'wisdom_scroll': '知恵の巻物',
            'sage_staff': '賢者の杖',
            'lightning_ring': '雷神の指輪',
            'perfect_gem': '完璧の宝石',
            'hero_crown': '勇者の王冠',
            'speed_boots': '俊足のブーツ'
        };
        return itemNames[itemId] || itemId;
    },

    /**
     * 獲得済みアチーブメント一覧を取得
     */
    getUnlockedAchievements: function(player) {
        if (!player.achievements) return [];

        return this.achievements.filter(a =>
            player.achievements.includes(a.id)
        );
    },

    /**
     * 進捗を取得
     */
    getProgress: function(player) {
        const unlocked = player.achievements ? player.achievements.length : 0;
        const total = this.achievements.length;
        return {
            unlocked,
            total,
            percentage: Math.round((unlocked / total) * 100)
        };
    }
};

// グローバルに公開
window.AchievementSystem = AchievementSystem;

console.log('✅ achievement-system.js ロード完了');
