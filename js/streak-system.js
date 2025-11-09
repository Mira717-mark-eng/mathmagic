/**
 * マスマジ！- ストリーク(連続正解)ボーナスシステム
 * DQ風コンボシステム
 */

const StreakSystem = {
    /**
     * ストリークを更新
     */
    updateStreak: function(player, isCorrect) {
        if (!player.streak) player.streak = 0;
        if (!player.maxStreak) player.maxStreak = 0;

        if (isCorrect) {
            player.streak++;
            if (player.streak > player.maxStreak) {
                player.maxStreak = player.streak;
            }
        } else {
            player.streak = 0;
        }

        PlayerManager.updatePlayer(player);
        return player.streak;
    },

    /**
     * ストリークボーナスを計算
     */
    getStreakBonus: function(streak) {
        const bonuses = [
            { streak: 3, bonus: 1.2, name: 'いい調子！', icon: '🔥' },
            { streak: 5, bonus: 1.5, name: '絶好調！', icon: '⚡' },
            { streak: 7, bonus: 1.8, name: '素晴らしい！', icon: '✨' },
            { streak: 10, bonus: 2.0, name: '完璧だ！', icon: '🌟' },
            { streak: 15, bonus: 2.5, name: '驚異的！', icon: '💫' },
            { streak: 20, bonus: 3.0, name: '伝説級！', icon: '👑' }
        ];

        // 現在のストリークに対応するボーナスを探す
        let currentBonus = { bonus: 1.0, name: null, icon: null };
        for (let i = bonuses.length - 1; i >= 0; i--) {
            if (streak >= bonuses[i].streak) {
                currentBonus = bonuses[i];
                break;
            }
        }

        return currentBonus;
    },

    /**
     * ストリーク表示を更新
     */
    updateStreakDisplay: function(streak) {
        const existing = document.getElementById('streak-display');
        if (existing) {
            existing.remove();
        }

        if (streak < 3) return; // 3連続未満は表示しない

        const bonus = this.getStreakBonus(streak);

        const display = document.createElement('div');
        display.id = 'streak-display';
        display.className = 'fixed top-4 right-4 z-40 animate-bounce-in';
        display.innerHTML = `
            <div class="dq-window p-4">
                <div class="text-center">
                    <div class="text-5xl animate-pulse mb-2">${bonus.icon}</div>
                    <div class="dq-gold-text text-2xl font-bold mb-1">${streak}連続正解！</div>
                    <div class="text-yellow-300 text-lg">${bonus.name}</div>
                    <div class="text-white text-sm mt-2">経験値 ×${bonus.bonus}</div>
                </div>
            </div>
        `;

        document.body.appendChild(display);

        // アニメーション
        setTimeout(() => {
            display.classList.add('animate-pulse');
        }, 300);
    },

    /**
     * ストリーク終了演出
     */
    showStreakEnd: function(streak) {
        if (streak < 3) return;

        SoundSystem.playSound('wrong');

        const display = document.getElementById('streak-display');
        if (display) {
            display.classList.add('animate-shake');
            setTimeout(() => {
                display.style.opacity = '0';
                display.style.transform = 'scale(0.5)';
                display.style.transition = 'all 0.5s ease';
                setTimeout(() => display.remove(), 500);
            }, 500);
        }

        const message = document.createElement('div');
        message.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50';
        message.innerHTML = `
            <div class="dq-window p-8 text-center animate-zoom-in">
                <div class="text-6xl mb-4">💔</div>
                <div class="text-white text-2xl font-bold mb-2">ストリーク終了...</div>
                <div class="text-blue-200 text-lg">最高${streak}連続正解</div>
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 2000);
    },

    /**
     * ストリークマイルストーン通知
     */
    showStreakMilestone: function(streak) {
        const milestones = [5, 10, 15, 20, 25, 30, 50];

        if (!milestones.includes(streak)) return;

        SoundSystem.playSound('fanfare');

        const notification = document.createElement('div');
        notification.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
        notification.innerHTML = `
            <div class="animate-zoom-in pointer-events-auto">
                <div class="dq-window p-12 text-center transform scale-150">
                    <div class="text-8xl mb-6 animate-bounce">🎊</div>
                    <div class="dq-gold-text text-5xl font-bold mb-4">${streak}連続正解達成！</div>
                    <div class="text-white text-3xl">素晴らしい集中力だ！</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.8s ease';
            setTimeout(() => notification.remove(), 800);
        }, 3000);
    },

    /**
     * デイリーストリークを管理
     */
    updateDailyStreak: function(player) {
        const today = new Date().toDateString();
        const lastPlayed = player.lastPlayedDate;

        if (!player.dailyStreak) player.dailyStreak = 0;

        if (lastPlayed) {
            const lastDate = new Date(lastPlayed).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (lastDate === today) {
                // 今日既にプレイ済み
                return player.dailyStreak;
            } else if (lastDate === yesterday) {
                // 連続ログイン
                player.dailyStreak++;
            } else {
                // ストリーク途切れ
                player.dailyStreak = 1;
            }
        } else {
            player.dailyStreak = 1;
        }

        player.lastPlayedDate = new Date().toISOString();
        PlayerManager.updatePlayer(player);

        // デイリーストリーク通知
        if (player.dailyStreak > 1) {
            this.showDailyStreakNotification(player.dailyStreak);
        }

        return player.dailyStreak;
    },

    /**
     * デイリーストリーク通知
     */
    showDailyStreakNotification: function(days) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in';
        notification.innerHTML = `
            <div class="dq-window p-6">
                <div class="text-center">
                    <div class="text-5xl mb-3">📅</div>
                    <div class="dq-gold-text text-xl font-bold mb-2">${days}日連続ログイン！</div>
                    <div class="text-white">毎日の努力が力になる！</div>
                    <div class="text-yellow-300 text-sm mt-2">ボーナス経験値 +${days * 10}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // ボーナス経験値を付与
        const player = MathMagic.getCurrentPlayer();
        if (player) {
            player.exp += days * 10;
            PlayerManager.updatePlayer(player);
        }

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
};

// シェイクアニメーション用CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .animate-shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// グローバルに公開
window.StreakSystem = StreakSystem;

console.log('✅ streak-system.js ロード完了');
