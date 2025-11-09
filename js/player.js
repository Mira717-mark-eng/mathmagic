/**
 * マスマジ！- プレイヤー管理
 * プレイヤー作成、経験値管理、統計処理
 */

const PlayerManager = {
    /**
     * すべてのプレイヤーを取得
     */
    getAllPlayers: function() {
        return MathMagic.getItem('allPlayers') || [];
    },

    /**
     * すべてのプレイヤーを保存
     */
    saveAllPlayers: function(players) {
        MathMagic.setItem('allPlayers', players);
    },

    /**
     * プレイヤーを作成
     */
    createPlayer: function(name, grade, characterType) {
        const player = {
            id: 'player-' + Date.now(),
            name: name,
            grade: parseInt(grade),
            characterType: characterType,
            level: 1,
            exp: 0,
            totalProblems: 0,
            correctProblems: 0,
            consecutiveCorrect: 0,
            consecutiveWrong: 0,
            currentDifficulty: 'normal',
            weakAreas: [],
            inventory: [],
            equipment: {},
            gradeHistory: [
                {
                    grade: parseInt(grade),
                    promotedAt: new Date().toISOString(),
                    reason: 'initial'
                }
            ],
            createdAt: new Date().toISOString(),
            lastPlayedAt: new Date().toISOString()
        };

        // 現在のプレイヤーとして設定
        MathMagic.setItem('currentPlayer', player);

        // すべてのプレイヤーリストに追加
        const allPlayers = this.getAllPlayers();
        allPlayers.push(player);
        this.saveAllPlayers(allPlayers);

        console.log('プレイヤーを作成しました:', player);
        return player;
    },

    /**
     * プレイヤーを選択
     */
    selectPlayer: function(playerId) {
        const allPlayers = this.getAllPlayers();
        const player = allPlayers.find(p => p.id === playerId);

        if (!player) {
            console.error('プレイヤーが見つかりません:', playerId);
            return null;
        }

        MathMagic.setItem('currentPlayer', player);
        console.log('プレイヤーを選択しました:', player.name);
        return player;
    },

    /**
     * プレイヤーを削除
     */
    deletePlayer: function(playerId) {
        const allPlayers = this.getAllPlayers();
        const index = allPlayers.findIndex(p => p.id === playerId);

        if (index === -1) {
            console.error('プレイヤーが見つかりません:', playerId);
            return false;
        }

        allPlayers.splice(index, 1);
        this.saveAllPlayers(allPlayers);

        // 現在のプレイヤーが削除された場合はクリア
        const currentPlayer = MathMagic.getCurrentPlayer();
        if (currentPlayer && currentPlayer.id === playerId) {
            localStorage.removeItem('currentPlayer');
        }

        console.log('プレイヤーを削除しました:', playerId);
        return true;
    },
    
    /**
     * プレイヤー情報を更新
     */
    updatePlayer: function(updates) {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            console.error('プレイヤーが見つかりません');
            return null;
        }

        // 更新
        const updatedPlayer = { ...player, ...updates };
        updatedPlayer.lastPlayedAt = new Date().toISOString();

        // 現在のプレイヤーを更新
        MathMagic.setItem('currentPlayer', updatedPlayer);

        // すべてのプレイヤーリストも更新
        const allPlayers = this.getAllPlayers();
        const index = allPlayers.findIndex(p => p.id === player.id);
        if (index !== -1) {
            allPlayers[index] = updatedPlayer;
            this.saveAllPlayers(allPlayers);
        }

        return updatedPlayer;
    },
    
    /**
     * 経験値を追加
     */
    addExp: function(exp) {
        const player = MathMagic.getCurrentPlayer();
        
        if (!player) {
            console.error('プレイヤーが見つかりません');
            return null;
        }
        
        const oldLevel = player.level;
        player.exp += exp;
        
        // レベルアップチェック
        let leveledUp = false;
        while (player.exp >= MathMagic.getExpForLevel(player.level + 1)) {
            player.exp -= MathMagic.getExpForLevel(player.level + 1);
            player.level++;
            leveledUp = true;
        }
        
        this.updatePlayer(player);
        
        return {
            leveledUp: leveledUp,
            oldLevel: oldLevel,
            newLevel: player.level,
            currentExp: player.exp
        };
    },
    
    /**
     * 回答を記録
     */
    recordAnswer: function(isCorrect) {
        const player = MathMagic.getCurrentPlayer();
        
        if (!player) {
            console.error('プレイヤーが見つかりません');
            return;
        }
        
        // 総問題数を増やす
        player.totalProblems++;
        
        if (isCorrect) {
            // 正解の場合
            player.correctProblems++;
            player.consecutiveCorrect++;
            player.consecutiveWrong = 0;
            
            // 難易度調整（3問連続正解で難易度アップ）
            if (player.consecutiveCorrect >= 3) {
                this.adjustDifficulty('up');
                player.consecutiveCorrect = 0;
            }
        } else {
            // 不正解の場合
            player.consecutiveCorrect = 0;
            player.consecutiveWrong++;
            
            // 難易度調整（2問連続不正解で難易度ダウン）
            if (player.consecutiveWrong >= 2) {
                this.adjustDifficulty('down');
                player.consecutiveWrong = 0;
            }
        }
        
        this.updatePlayer(player);
    },
    
    /**
     * 難易度を調整
     */
    adjustDifficulty: function(direction) {
        const player = MathMagic.getCurrentPlayer();
        
        if (!player) return;
        
        const difficulties = ['easy', 'normal', 'hard'];
        const currentIndex = difficulties.indexOf(player.currentDifficulty);
        
        if (direction === 'up' && currentIndex < difficulties.length - 1) {
            player.currentDifficulty = difficulties[currentIndex + 1];
            console.log('難易度をアップしました:', player.currentDifficulty);
        } else if (direction === 'down' && currentIndex > 0) {
            player.currentDifficulty = difficulties[currentIndex - 1];
            console.log('難易度をダウンしました:', player.currentDifficulty);
        }
        
        this.updatePlayer(player);
    },
    
    /**
     * 正答率を取得
     */
    getAccuracy: function() {
        const player = MathMagic.getCurrentPlayer();
        
        if (!player || player.totalProblems === 0) {
            return 0;
        }
        
        return Math.round((player.correctProblems / player.totalProblems) * 100);
    },
    
    /**
     * プレイヤー統計を取得
     */
    getStats: function() {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            return null;
        }

        return {
            level: player.level,
            exp: player.exp,
            expForNextLevel: MathMagic.getExpForLevel(player.level + 1),
            totalProblems: player.totalProblems,
            correctProblems: player.correctProblems,
            accuracy: this.getAccuracy(),
            consecutiveCorrect: player.consecutiveCorrect,
            difficulty: player.currentDifficulty
        };
    },

    /**
     * 学年を上げる（進級）
     */
    promoteGrade: function(reason = 'manual') {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            console.error('プレイヤーが見つかりません');
            return { success: false, error: 'プレイヤーが見つかりません' };
        }

        // 中学3年生が最大
        if (player.grade >= 9) {
            console.warn('既に最高学年です');
            return { success: false, error: '既に中学3年生です' };
        }

        const oldGrade = player.grade;
        player.grade++;

        // 学年履歴を追加
        if (!player.gradeHistory) {
            player.gradeHistory = [];
        }

        player.gradeHistory.push({
            grade: player.grade,
            promotedAt: new Date().toISOString(),
            reason: reason,
            levelAtPromotion: player.level,
            totalProblemsAtPromotion: player.totalProblems
        });

        this.updatePlayer(player);

        console.log(`学年を上げました: ${oldGrade}年生 → ${player.grade}年生`);

        return {
            success: true,
            oldGrade: oldGrade,
            newGrade: player.grade,
            message: `${oldGrade}年生から${player.grade}年生に進級しました！`
        };
    },

    /**
     * 学年を下げる（復習用）
     */
    demoteGrade: function(reason = 'manual') {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            console.error('プレイヤーが見つかりません');
            return { success: false, error: 'プレイヤーが見つかりません' };
        }

        // 小学1年生が最小
        if (player.grade <= 1) {
            console.warn('既に最低学年です');
            return { success: false, error: '既に小学1年生です' };
        }

        const oldGrade = player.grade;
        player.grade--;

        // 学年履歴を追加
        if (!player.gradeHistory) {
            player.gradeHistory = [];
        }

        player.gradeHistory.push({
            grade: player.grade,
            promotedAt: new Date().toISOString(),
            reason: reason,
            levelAtPromotion: player.level,
            totalProblemsAtPromotion: player.totalProblems
        });

        this.updatePlayer(player);

        console.log(`学年を下げました: ${oldGrade}年生 → ${player.grade}年生`);

        return {
            success: true,
            oldGrade: oldGrade,
            newGrade: player.grade,
            message: `${oldGrade}年生から${player.grade}年生に変更しました`
        };
    },

    /**
     * 学年履歴を取得
     */
    getGradeHistory: function() {
        const player = MathMagic.getCurrentPlayer();

        if (!player || !player.gradeHistory) {
            return [];
        }

        return player.gradeHistory;
    },

    /**
     * 学年名を取得（日本語表記）
     */
    getGradeName: function(grade) {
        const gradeNames = {
            1: '小学1年生',
            2: '小学2年生',
            3: '小学3年生',
            4: '小学4年生',
            5: '小学5年生',
            6: '小学6年生',
            7: '中学1年生',
            8: '中学2年生',
            9: '中学3年生'
        };

        return gradeNames[grade] || `${grade}年生`;
    },

    /**
     * 自動進級チェック（学年のワールドを一定以上クリアしたら提案）
     */
    checkAutoPromotion: function() {
        const player = MathMagic.getCurrentPlayer();

        if (!player || player.grade >= 9) {
            return { shouldPromote: false };
        }

        // 現在の学年のワールドを取得
        const gradeWorlds = getAvailableWorlds(player.grade);

        if (gradeWorlds.length === 0) {
            return { shouldPromote: false };
        }

        // クリア済みのワールド数をカウント
        const completedWorlds = player.completedWorlds || [];
        const completedCount = gradeWorlds.filter(world =>
            completedWorlds.some(cw => cw.id === world.id && cw.completed)
        ).length;

        // クリア率を計算
        const completionRate = completedCount / gradeWorlds.length;

        // 80%以上クリアしたら進級を提案
        if (completionRate >= 0.8) {
            return {
                shouldPromote: true,
                completionRate: Math.round(completionRate * 100),
                completedCount: completedCount,
                totalCount: gradeWorlds.length,
                message: `${this.getGradeName(player.grade)}のワールドを${Math.round(completionRate * 100)}%クリアしました！\n次の学年に進みますか？`
            };
        }

        return {
            shouldPromote: false,
            completionRate: Math.round(completionRate * 100),
            completedCount: completedCount,
            totalCount: gradeWorlds.length
        };
    }
};

// グローバルに公開
window.PlayerManager = PlayerManager;

console.log('✅ player.js ロード完了');
