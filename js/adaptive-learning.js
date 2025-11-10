/**
 * マスマジ！- 適応学習システム
 * プレイヤーの学習状況に応じて問題の難易度を自動調整
 */

const AdaptiveLearning = {
    /**
     * 問題の難易度を調整
     */
    adjustDifficulty: function(questId, currentResults) {
        const player = MathMagic.getCurrentPlayer();
        if (!player) {
            return 'normal';
        }

        // 現在のクエストの結果を分析
        const recentResults = currentResults.slice(-5); // 直近5問
        const recentCorrect = recentResults.filter(r => r.isCorrect).length;
        const recentAccuracy = recentResults.length > 0
            ? (recentCorrect / recentResults.length) * 100
            : 50;

        // 全体の正答率
        const overallAccuracy = PlayerManager.getAccuracy();

        // 現在の難易度
        const currentDifficulty = player.currentDifficulty || 'normal';

        // 難易度調整ロジック
        let newDifficulty = currentDifficulty;

        if (recentAccuracy >= 80 && overallAccuracy >= 75) {
            // 正答率が高い → 難易度を上げる
            if (currentDifficulty === 'easy') {
                newDifficulty = 'normal';
            } else if (currentDifficulty === 'normal' && recentAccuracy >= 90) {
                newDifficulty = 'hard';
            }
        } else if (recentAccuracy < 40 || overallAccuracy < 50) {
            // 正答率が低い → 難易度を下げる
            if (currentDifficulty === 'hard') {
                newDifficulty = 'normal';
            } else if (currentDifficulty === 'normal' && recentAccuracy < 30) {
                newDifficulty = 'easy';
            }
        }

        // プレイヤーの難易度設定を更新
        if (newDifficulty !== currentDifficulty) {
            player.currentDifficulty = newDifficulty;
            PlayerManager.updatePlayer(player);
            console.log(`難易度を調整しました: ${currentDifficulty} → ${newDifficulty}`);
        }

        return newDifficulty;
    },

    /**
     * 次に学習すべき単元を推奨
     */
    recommendNextUnit: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player) {
            return null;
        }

        const analysis = DashboardStats.analyzeStrengthsWeaknesses();

        // 優先順位:
        // 1. 苦手分野（正答率60%未満）
        // 2. 未学習の単元
        // 3. 最近学習していない単元

        // 苦手分野を優先
        if (analysis.weaknesses.length > 0) {
            return {
                unitId: analysis.weaknesses[0].unitId,
                reason: 'weakness',
                priority: 'high',
                message: `苦手な「${analysis.weaknesses[0].unitId}」を復習しましょう`
            };
        }

        // 未学習の単元を探す（world-design-v2.json から取得）
        // ここでは簡易実装
        return {
            unitId: null,
            reason: 'new',
            priority: 'medium',
            message: '新しい単元に挑戦してみましょう'
        };
    },

    /**
     * 問題の出題順序を最適化
     */
    optimizeProblemOrder: function(problems, unitId) {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.studyStats) {
            return problems;
        }

        const unitProgress = player.studyStats.unitProgress?.[unitId];

        if (!unitProgress) {
            // 初回の場合は順番通り
            return problems;
        }

        // 正答率が低い場合は、基礎問題を増やす
        const accuracy = unitProgress.total > 0
            ? (unitProgress.correct / unitProgress.total) * 100
            : 50;

        if (accuracy < 60) {
            // 基礎問題（difficulty: 'basic'）を優先
            const basicProblems = problems.filter(p => p.difficulty === 'basic');
            const otherProblems = problems.filter(p => p.difficulty !== 'basic');

            return [
                ...this.shuffle(basicProblems),
                ...this.shuffle(otherProblems)
            ];
        } else if (accuracy >= 80) {
            // 応用問題（difficulty: 'advanced'）を優先
            const advancedProblems = problems.filter(p => p.difficulty === 'advanced');
            const otherProblems = problems.filter(p => p.difficulty !== 'advanced');

            return [
                ...this.shuffle(advancedProblems),
                ...this.shuffle(otherProblems)
            ];
        }

        // 通常の場合はランダム
        return this.shuffle(problems);
    },

    /**
     * 配列をシャッフル
     */
    shuffle: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * ヒントの表示タイミングを調整
     */
    shouldShowHint: function(attemptCount, timeElapsed) {
        const player = MathMagic.getCurrentPlayer();
        if (!player) {
            return false;
        }

        const difficulty = player.currentDifficulty || 'normal';

        // 難易度に応じてヒント表示のタイミングを調整
        const hintThresholds = {
            easy: { attempts: 2, time: 30 },    // 2回失敗 or 30秒
            normal: { attempts: 3, time: 45 },  // 3回失敗 or 45秒
            hard: { attempts: 4, time: 60 }     // 4回失敗 or 60秒
        };

        const threshold = hintThresholds[difficulty] || hintThresholds.normal;

        return attemptCount >= threshold.attempts || timeElapsed >= threshold.time;
    },

    /**
     * 学習効果の予測
     */
    predictLearningOutcome: function(unitId, proposedDifficulty) {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.studyStats) {
            return {
                successProbability: 50,
                recommendedPracticeTime: 10
            };
        }

        const unitProgress = player.studyStats.unitProgress?.[unitId];

        if (!unitProgress) {
            // 初回の場合
            return {
                successProbability: 60,
                recommendedPracticeTime: 15,
                confidence: 'low'
            };
        }

        // 過去の実績から成功確率を予測
        const historicalAccuracy = unitProgress.total > 0
            ? (unitProgress.correct / unitProgress.total) * 100
            : 50;

        // 難易度による調整
        const difficultyModifier = {
            easy: 20,
            normal: 0,
            hard: -20
        };

        const modifier = difficultyModifier[proposedDifficulty] || 0;
        const successProbability = Math.max(0, Math.min(100, historicalAccuracy + modifier));

        // 推奨練習時間（分）
        const recommendedPracticeTime = successProbability < 60 ? 20 : 10;

        return {
            successProbability: Math.round(successProbability),
            recommendedPracticeTime: recommendedPracticeTime,
            confidence: unitProgress.total >= 10 ? 'high' : 'medium'
        };
    },

    /**
     * 間隔反復学習のスケジュール計算
     */
    calculateReviewSchedule: function(unitId, lastMastery) {
        // 間隔反復学習（Spaced Repetition）のアルゴリズム
        // 習熟度に応じて復習のタイミングを決定

        const intervals = {
            1: 1,    // 1日後
            2: 3,    // 3日後
            3: 7,    // 1週間後
            4: 14,   // 2週間後
            5: 30,   // 1ヶ月後
            6: 60    // 2ヶ月後
        };

        const mastery = Math.min(Math.max(lastMastery || 1, 1), 6);
        const daysUntilReview = intervals[mastery];

        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilReview);

        return {
            nextReviewDate: nextReviewDate.toISOString(),
            daysUntilReview: daysUntilReview,
            masteryLevel: mastery
        };
    },

    /**
     * 学習パターンを分析
     */
    analyzeLearningPattern: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player || !player.studyStats) {
            return {
                preferredTime: null,
                averageSessionLength: 0,
                learningStyle: 'unknown'
            };
        }

        const studyDays = player.studyStats.studyDays || [];

        // 学習傾向を分析（仮実装）
        return {
            totalSessions: studyDays.length,
            averageSessionLength: this.formatTime(
                Math.floor((player.studyStats.totalStudyTime || 0) / Math.max(studyDays.length, 1))
            ),
            consistency: DashboardStats.getConsistencyScore().score,
            preferredDifficulty: player.currentDifficulty || 'normal'
        };
    },

    /**
     * 時間を○分形式に変換
     */
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}分`;
    }
};

// グローバルに公開
window.AdaptiveLearning = AdaptiveLearning;

console.log('✅ adaptive-learning.js ロード完了');
