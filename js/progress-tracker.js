/**
 * マスマジ！- 進捗・報酬管理システム
 * クエスト完了時の処理、実績、称号管理
 */

const ProgressTracker = {
    /**
     * クエスト完了処理
     */
    completeQuest: function(questSession) {
        console.log('📊 クエスト完了処理を開始:', questSession.questId);

        const player = MathMagic.getCurrentPlayer();
        if (!player) {
            console.error('プレイヤーが見つかりません');
            return null;
        }

        const results = questSession.results || [];
        const correctCount = results.filter(r => r.isCorrect).length;
        const totalCount = results.length;
        const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

        // 学習時間を計算
        const startTime = new Date(questSession.startTime);
        const endTime = new Date();
        const studyTime = Math.floor((endTime - startTime) / 1000); // 秒

        // クエスト進捗を更新
        const progressResult = PlayerManager.updateQuestProgress(questSession.questId, {
            correctCount: correctCount,
            totalCount: totalCount
        });

        // 学習統計を更新
        if (questSession.unitId) {
            PlayerManager.updateStudyStats(
                questSession.unitId,
                correctCount,
                totalCount,
                studyTime
            );
        }

        // 報酬を計算
        const rewards = this.calculateRewards(questSession, accuracy, progressResult);

        // 経験値とゴールドを付与
        if (rewards.exp > 0) {
            const expResult = PlayerManager.addExp(rewards.exp);
            rewards.leveledUp = expResult.leveledUp;
            rewards.oldLevel = expResult.oldLevel;
            rewards.newLevel = expResult.newLevel;
        }

        if (rewards.gold > 0) {
            const updatedPlayer = MathMagic.getCurrentPlayer();
            updatedPlayer.gold = (updatedPlayer.gold || 0) + rewards.gold;
            PlayerManager.updatePlayer(updatedPlayer);
        }

        // 実績チェック
        this.checkAchievements(player, questSession, accuracy);

        // 称号チェック
        this.checkTitleUnlocks(player, questSession, accuracy);

        console.log('✅ クエスト完了処理完了:', rewards);

        return {
            questId: questSession.questId,
            correctCount: correctCount,
            totalCount: totalCount,
            accuracy: accuracy,
            studyTime: studyTime,
            progressResult: progressResult,
            rewards: rewards
        };
    },

    /**
     * 報酬を計算
     */
    calculateRewards: function(questSession, accuracy, progressResult) {
        const rewards = {
            exp: 0,
            gold: 0,
            items: [],
            firstClear: false,
            perfectClear: false
        };

        const totalProblems = questSession.totalProblems || 10;
        const baseExp = 50;
        const baseGold = 20;

        // 基本報酬（問題数に応じて）
        rewards.exp = baseExp * totalProblems;
        rewards.gold = baseGold * Math.floor(totalProblems / 2);

        // 正答率ボーナス
        if (accuracy >= 90) {
            rewards.exp = Math.floor(rewards.exp * 1.5);
            rewards.gold = Math.floor(rewards.gold * 1.5);
        } else if (accuracy >= 70) {
            rewards.exp = Math.floor(rewards.exp * 1.2);
            rewards.gold = Math.floor(rewards.gold * 1.2);
        }

        // パーフェクトクリアボーナス
        if (accuracy === 100) {
            rewards.exp += 200;
            rewards.gold += 50;
            rewards.perfectClear = true;
            rewards.items.push({
                id: 'perfect_medal',
                name: 'パーフェクトメダル',
                icon: '🥇',
                rarity: 'rare'
            });
        }

        // 初回クリアボーナス
        if (progressResult && progressResult.attempts === 1 && progressResult.completed) {
            rewards.exp += 100;
            rewards.gold += 30;
            rewards.firstClear = true;
        }

        // 難易度ボーナス
        const difficultyMultiplier = {
            'basic': 1.0,
            'standard': 1.3,
            'advanced': 1.6
        };
        const multiplier = difficultyMultiplier[questSession.difficulty] || 1.0;
        rewards.exp = Math.floor(rewards.exp * multiplier);
        rewards.gold = Math.floor(rewards.gold * multiplier);

        return rewards;
    },

    /**
     * 実績チェック
     */
    checkAchievements: function(player, questSession, accuracy) {
        const achievements = [];

        // 初めてのクエストクリア
        if (!player.achievements || player.achievements.length === 0) {
            if (accuracy >= 60) {
                PlayerManager.unlockAchievement('first_quest');
                achievements.push({
                    id: 'first_quest',
                    name: '第一歩',
                    description: '初めてのクエストをクリアした',
                    icon: '🎖️'
                });
            }
        }

        // パーフェクトクリア
        if (accuracy === 100) {
            PlayerManager.unlockAchievement('perfect_clear');
            achievements.push({
                id: 'perfect_clear',
                name: 'パーフェクト',
                description: '全問正解でクリアした',
                icon: '💯'
            });
        }

        // 速解き（仮の実装）
        const results = questSession.results || [];
        const avgTime = results.reduce((sum, r) => sum + (r.elapsedTime || 0), 0) / results.length;
        if (avgTime < 10 && accuracy >= 80) {
            PlayerManager.unlockAchievement('speed_master');
            achievements.push({
                id: 'speed_master',
                name: 'スピードマスター',
                description: '素早く正確に問題を解いた',
                icon: '⚡'
            });
        }

        // 連続正解
        let maxStreak = 0;
        let currentStreak = 0;
        results.forEach(r => {
            if (r.isCorrect) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        if (maxStreak >= 5) {
            PlayerManager.unlockAchievement('five_streak');
            achievements.push({
                id: 'five_streak',
                name: '連続正解5',
                description: '5問連続で正解した',
                icon: '🔥'
            });
        }

        // 学習統計ベースの実績
        if (player.studyStats) {
            const totalStudyDays = player.studyStats.studyDays?.length || 0;

            if (totalStudyDays >= 7) {
                PlayerManager.unlockAchievement('week_warrior');
                achievements.push({
                    id: 'week_warrior',
                    name: '1週間継続',
                    description: '7日間学習を続けた',
                    icon: '📅'
                });
            }

            if (totalStudyDays >= 30) {
                PlayerManager.unlockAchievement('month_master');
                achievements.push({
                    id: 'month_master',
                    name: '1ヶ月継続',
                    description: '30日間学習を続けた',
                    icon: '🏆'
                });
            }
        }

        // クエスト進捗ベースの実績
        if (player.questProgress) {
            const completedQuests = Object.values(player.questProgress).filter(p => p.completed).length;

            if (completedQuests >= 10) {
                PlayerManager.unlockAchievement('ten_quests');
                achievements.push({
                    id: 'ten_quests',
                    name: '10クエスト達成',
                    description: '10個のクエストをクリアした',
                    icon: '🌟'
                });
            }

            if (completedQuests >= 50) {
                PlayerManager.unlockAchievement('fifty_quests');
                achievements.push({
                    id: 'fifty_quests',
                    name: '50クエスト達成',
                    description: '50個のクエストをクリアした',
                    icon: '✨'
                });
            }
        }

        return achievements;
    },

    /**
     * 称号チェック
     */
    checkTitleUnlocks: function(player, questSession, accuracy) {
        const titles = [];

        // パーフェクト称号
        if (accuracy === 100) {
            PlayerManager.unlockTitle('完璧主義者');
            titles.push('完璧主義者');
        }

        // 正答率ベースの称号
        const overallAccuracy = PlayerManager.getAccuracy();
        if (overallAccuracy >= 90) {
            PlayerManager.unlockTitle('天才数学者');
            titles.push('天才数学者');
        } else if (overallAccuracy >= 80) {
            PlayerManager.unlockTitle('数学の達人');
            titles.push('数学の達人');
        }

        // レベルベースの称号
        if (player.level >= 10) {
            PlayerManager.unlockTitle('修練者');
            titles.push('修練者');
        }

        if (player.level >= 25) {
            PlayerManager.unlockTitle('熟練者');
            titles.push('熟練者');
        }

        if (player.level >= 50) {
            PlayerManager.unlockTitle('マスター');
            titles.push('マスター');
        }

        // クエスト数ベースの称号
        if (player.questProgress) {
            const completedQuests = Object.values(player.questProgress).filter(p => p.completed).length;

            if (completedQuests >= 20) {
                PlayerManager.unlockTitle('冒険者');
                titles.push('冒険者');
            }

            if (completedQuests >= 50) {
                PlayerManager.unlockTitle('ベテラン冒険者');
                titles.push('ベテラン冒険者');
            }

            // 星3つ獲得数
            const threeStarCount = Object.values(player.questProgress).filter(p => p.stars === 3).length;

            if (threeStarCount >= 10) {
                PlayerManager.unlockTitle('星集めの名人');
                titles.push('星集めの名人');
            }
        }

        return titles;
    },

    /**
     * 実績リストを取得
     */
    getAllAchievements: function() {
        return [
            { id: 'first_quest', name: '第一歩', description: '初めてのクエストをクリアした', icon: '🎖️', rarity: 'common' },
            { id: 'perfect_clear', name: 'パーフェクト', description: '全問正解でクリアした', icon: '💯', rarity: 'rare' },
            { id: 'speed_master', name: 'スピードマスター', description: '素早く正確に問題を解いた', icon: '⚡', rarity: 'rare' },
            { id: 'five_streak', name: '連続正解5', description: '5問連続で正解した', icon: '🔥', rarity: 'uncommon' },
            { id: 'week_warrior', name: '1週間継続', description: '7日間学習を続けた', icon: '📅', rarity: 'uncommon' },
            { id: 'month_master', name: '1ヶ月継続', description: '30日間学習を続けた', icon: '🏆', rarity: 'epic' },
            { id: 'ten_quests', name: '10クエスト達成', description: '10個のクエストをクリアした', icon: '🌟', rarity: 'uncommon' },
            { id: 'fifty_quests', name: '50クエスト達成', description: '50個のクエストをクリアした', icon: '✨', rarity: 'epic' },
            { id: 'hundred_problems', name: '100問達成', description: '100問を解いた', icon: '📚', rarity: 'uncommon' },
            { id: 'thousand_problems', name: '1000問達成', description: '1000問を解いた', icon: '📖', rarity: 'legendary' }
        ];
    },

    /**
     * プレイヤーの実績進捗を取得
     */
    getAchievementProgress: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player) return [];

        const allAchievements = this.getAllAchievements();
        const unlockedIds = player.achievements || [];

        return allAchievements.map(achievement => ({
            ...achievement,
            unlocked: unlockedIds.includes(achievement.id)
        }));
    }
};

// グローバルに公開
window.ProgressTracker = ProgressTracker;

console.log('✅ progress-tracker.js ロード完了');
