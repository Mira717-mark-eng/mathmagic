/**
 * マスマジ！- 学習統計ダッシュボード
 * 詳細な学習データの可視化と分析
 */

const DashboardStats = {
    /**
     * 学習カレンダーデータを取得（過去30日間）
     */
    getStudyCalendar: function(days = 30) {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.studyStats) {
            return [];
        }

        const studyDays = player.studyStats.studyDays || [];
        const calendar = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            calendar.push({
                date: dateStr,
                studied: studyDays.includes(dateStr),
                dayOfWeek: date.getDay(),
                formatted: `${date.getMonth() + 1}/${date.getDate()}`
            });
        }

        return calendar;
    },

    /**
     * 単元別正答率を取得
     */
    getUnitAccuracy: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.studyStats || !player.studyStats.unitProgress) {
            return [];
        }

        const unitProgress = player.studyStats.unitProgress;
        const unitStats = [];

        for (const [unitId, progress] of Object.entries(unitProgress)) {
            const accuracy = progress.total > 0
                ? Math.round((progress.correct / progress.total) * 100)
                : 0;

            unitStats.push({
                unitId: unitId,
                correct: progress.correct,
                total: progress.total,
                accuracy: accuracy,
                lastStudied: progress.lastStudied
            });
        }

        // 正答率でソート（低い順）
        unitStats.sort((a, b) => a.accuracy - b.accuracy);

        return unitStats;
    },

    /**
     * 得意・苦手分野を分析
     */
    analyzeStrengthsWeaknesses: function() {
        const unitStats = this.getUnitAccuracy();

        if (unitStats.length === 0) {
            return {
                strengths: [],
                weaknesses: []
            };
        }

        // 正答率80%以上を得意分野
        const strengths = unitStats
            .filter(u => u.accuracy >= 80)
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, 5);

        // 正答率60%未満を苦手分野
        const weaknesses = unitStats
            .filter(u => u.accuracy < 60 && u.total >= 3) // 3問以上解いている
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 5);

        return {
            strengths: strengths,
            weaknesses: weaknesses
        };
    },

    /**
     * 学習時間の統計
     */
    getStudyTimeStats: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.studyStats) {
            return {
                total: 0,
                average: 0,
                today: 0
            };
        }

        const totalSeconds = player.studyStats.totalStudyTime || 0;
        const studyDays = player.studyStats.studyDays?.length || 0;
        const averageSeconds = studyDays > 0 ? Math.floor(totalSeconds / studyDays) : 0;

        return {
            total: this.formatTime(totalSeconds),
            totalSeconds: totalSeconds,
            average: this.formatTime(averageSeconds),
            averageSeconds: averageSeconds,
            studyDays: studyDays
        };
    },

    /**
     * 秒を「○時間○分」形式に変換
     */
    formatTime: function(seconds) {
        if (seconds < 60) {
            return `${seconds}秒`;
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}時間${minutes}分`;
        }

        return `${minutes}分`;
    },

    /**
     * クエスト達成状況
     */
    getQuestStats: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.questProgress) {
            return {
                total: 0,
                completed: 0,
                threeStars: 0,
                inProgress: 0
            };
        }

        const questProgress = player.questProgress;
        const total = Object.keys(questProgress).length;
        const completed = Object.values(questProgress).filter(p => p.completed).length;
        const threeStars = Object.values(questProgress).filter(p => p.stars === 3).length;
        const inProgress = total - completed;

        return {
            total: total,
            completed: completed,
            threeStars: threeStars,
            inProgress: inProgress,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    },

    /**
     * 最近の学習活動
     */
    getRecentActivity: function(limit = 10) {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.questProgress) {
            return [];
        }

        const activities = [];

        // クエスト進捗から最近の活動を抽出
        for (const [questId, progress] of Object.entries(player.questProgress)) {
            if (progress.lastPlayedAt) {
                activities.push({
                    type: 'quest',
                    questId: questId,
                    timestamp: progress.lastPlayedAt,
                    completed: progress.completed,
                    score: progress.bestScore,
                    stars: progress.stars
                });
            }
        }

        // 時間順にソート（新しい順）
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return activities.slice(0, limit);
    },

    /**
     * 学習の一貫性スコア（連続学習日数など）
     */
    getConsistencyScore: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.studyStats || !player.studyStats.studyDays) {
            return {
                score: 0,
                currentStreak: 0,
                longestStreak: 0
            };
        }

        const studyDays = player.studyStats.studyDays.map(d => new Date(d)).sort((a, b) => a - b);

        if (studyDays.length === 0) {
            return {
                score: 0,
                currentStreak: 0,
                longestStreak: 0
            };
        }

        // 現在の連続日数を計算
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 100; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const checkDateStr = checkDate.toISOString().split('T')[0];

            if (player.studyStats.studyDays.includes(checkDateStr)) {
                currentStreak++;
            } else {
                if (i === 0) {
                    // 今日学習していない場合は昨日から数える
                    continue;
                }
                break;
            }
        }

        // 最長連続日数を計算
        let longestStreak = 0;
        let tempStreak = 1;

        for (let i = 1; i < studyDays.length; i++) {
            const diffDays = Math.floor((studyDays[i] - studyDays[i - 1]) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 1;
            }
        }

        longestStreak = Math.max(longestStreak, tempStreak);

        // 一貫性スコア（0-100）
        const totalDays = studyDays.length;
        const possibleDays = Math.floor((today - studyDays[0]) / (1000 * 60 * 60 * 24)) + 1;
        const consistency = possibleDays > 0 ? Math.round((totalDays / possibleDays) * 100) : 0;

        return {
            score: Math.min(consistency, 100),
            currentStreak: currentStreak,
            longestStreak: longestStreak
        };
    },

    /**
     * 成長トレンド（レベル上昇率など）
     */
    getGrowthTrend: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player) {
            return {
                level: 1,
                expToNextLevel: 100,
                expProgress: 0,
                problemsSolved: 0,
                accuracy: 0
            };
        }

        const expForNextLevel = MathMagic.getExpForLevel(player.level + 1);
        const expProgress = expForNextLevel > 0
            ? Math.round((player.exp / expForNextLevel) * 100)
            : 0;

        return {
            level: player.level,
            exp: player.exp,
            expForNextLevel: expForNextLevel,
            expProgress: expProgress,
            problemsSolved: player.totalProblems || 0,
            accuracy: PlayerManager.getAccuracy()
        };
    },

    /**
     * おすすめの学習プラン
     */
    getRecommendations: function() {
        const recommendations = [];
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            return recommendations;
        }

        const analysis = this.analyzeStrengthsWeaknesses();
        const consistency = this.getConsistencyScore();
        const questStats = this.getQuestStats();

        // 苦手分野の復習を推奨
        if (analysis.weaknesses.length > 0) {
            recommendations.push({
                type: 'weakness',
                priority: 'high',
                title: '苦手分野を復習しよう',
                description: `${analysis.weaknesses[0].unitId} の問題を重点的に解いてみましょう`,
                icon: '📝',
                actionUrl: `quest.html?unitId=${analysis.weaknesses[0].unitId}`
            });
        }

        // 学習の一貫性が低い場合
        if (consistency.currentStreak === 0) {
            recommendations.push({
                type: 'consistency',
                priority: 'high',
                title: '毎日の学習を習慣化しよう',
                description: '1日5分でも続けることが大切です',
                icon: '📅'
            });
        }

        // 未完了のクエストがある場合
        if (questStats.inProgress > 0) {
            recommendations.push({
                type: 'completion',
                priority: 'medium',
                title: '挑戦中のクエストを完了しよう',
                description: `${questStats.inProgress}個のクエストが未完了です`,
                icon: '🎯'
            });
        }

        // 得意分野をさらに伸ばす
        if (analysis.strengths.length > 0 && analysis.strengths[0].accuracy === 100) {
            recommendations.push({
                type: 'advancement',
                priority: 'low',
                title: '次のステップに挑戦！',
                description: '得意分野を活かして、より難しい問題に挑戦してみましょう',
                icon: '🚀'
            });
        }

        return recommendations;
    },

    /**
     * ダッシュボード用の総合データを取得
     */
    getDashboardData: function() {
        return {
            studyCalendar: this.getStudyCalendar(30),
            unitAccuracy: this.getUnitAccuracy(),
            strengthsWeaknesses: this.analyzeStrengthsWeaknesses(),
            studyTime: this.getStudyTimeStats(),
            questStats: this.getQuestStats(),
            recentActivity: this.getRecentActivity(10),
            consistency: this.getConsistencyScore(),
            growth: this.getGrowthTrend(),
            recommendations: this.getRecommendations()
        };
    }
};

// グローバルに公開
window.DashboardStats = DashboardStats;

console.log('✅ dashboard-stats.js ロード完了');
