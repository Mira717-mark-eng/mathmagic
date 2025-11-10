/**
 * マスマジ！- マルチプレイヤー機能
 * ランキング、フレンドシステム、協力プレイ（将来実装）
 */

const Multiplayer = {
    /**
     * ローカルランキングを取得
     */
    getLocalRanking: function(metric = 'level') {
        const allPlayers = PlayerManager.getAllPlayers();

        if (allPlayers.length === 0) {
            return [];
        }

        // メトリックに応じてソート
        let sortedPlayers = [];

        switch (metric) {
            case 'level':
                sortedPlayers = allPlayers.sort((a, b) => b.level - a.level || b.exp - a.exp);
                break;
            case 'accuracy':
                sortedPlayers = allPlayers.sort((a, b) => {
                    const accuracyA = a.totalProblems > 0 ? (a.correctProblems / a.totalProblems) * 100 : 0;
                    const accuracyB = b.totalProblems > 0 ? (b.correctProblems / b.totalProblems) * 100 : 0;
                    return accuracyB - accuracyA;
                });
                break;
            case 'problems':
                sortedPlayers = allPlayers.sort((a, b) => (b.totalProblems || 0) - (a.totalProblems || 0));
                break;
            case 'quests':
                sortedPlayers = allPlayers.sort((a, b) => {
                    const questsA = Object.values(a.questProgress || {}).filter(p => p.completed).length;
                    const questsB = Object.values(b.questProgress || {}).filter(p => p.completed).length;
                    return questsB - questsA;
                });
                break;
            default:
                sortedPlayers = allPlayers.sort((a, b) => b.level - a.level);
        }

        // ランク付け
        return sortedPlayers.map((player, index) => ({
            rank: index + 1,
            playerId: player.id,
            name: player.name,
            level: player.level,
            exp: player.exp,
            totalProblems: player.totalProblems || 0,
            accuracy: player.totalProblems > 0
                ? Math.round((player.correctProblems / player.totalProblems) * 100)
                : 0,
            completedQuests: Object.values(player.questProgress || {}).filter(p => p.completed).length,
            avatar: player.avatar || {},
            title: player.currentTitle || player.titles?.[0] || '新米冒険者'
        }));
    },

    /**
     * プレイヤーの順位を取得
     */
    getPlayerRank: function(playerId, metric = 'level') {
        const ranking = this.getLocalRanking(metric);
        const playerRank = ranking.find(r => r.playerId === playerId);

        return playerRank || null;
    },

    /**
     * 全国ランキング（シミュレーション）
     */
    getGlobalRanking: function(limit = 100) {
        // 実際にはサーバーから取得するが、ここではダミーデータを生成
        const globalPlayers = [];

        for (let i = 1; i <= limit; i++) {
            globalPlayers.push({
                rank: i,
                name: this.generateRandomName(),
                level: Math.max(1, Math.floor(100 - i / 2 + Math.random() * 10)),
                completedQuests: Math.floor((100 - i) * 1.5 + Math.random() * 20),
                title: this.getRandomTitle(),
                isLocal: false
            });
        }

        return globalPlayers;
    },

    /**
     * ランダムな名前を生成
     */
    generateRandomName: function() {
        const prefixes = ['勇敢な', '賢い', '素早い', '優しい', '強い', '元気な'];
        const names = ['たろう', 'はなこ', 'ゆうき', 'さくら', 'そら', 'ひかり', 'りく', 'あおい'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        return `${prefix}${name}`;
    },

    /**
     * ランダムな称号を取得
     */
    getRandomTitle: function() {
        const titles = [
            '新米冒険者', '冒険者', 'ベテラン冒険者', '数学の達人',
            '天才数学者', '完璧主義者', 'マスター', '修練者'
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    },

    /**
     * フレンドリスト（将来実装用のプレースホルダー）
     */
    getFriends: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player) {
            return [];
        }

        // 現在は未実装
        return player.friends || [];
    },

    /**
     * フレンド申請（将来実装）
     */
    sendFriendRequest: function(targetPlayerId) {
        console.log('フレンド申請機能は将来実装予定です');
        return {
            success: false,
            message: 'この機能は現在開発中です'
        };
    },

    /**
     * 協力クエスト（将来実装）
     */
    startCoopQuest: function(questId, friendIds) {
        console.log('協力クエスト機能は将来実装予定です');
        return {
            success: false,
            message: 'この機能は現在開発中です'
        };
    },

    /**
     * 対戦モード（将来実装）
     */
    startBattle: function(opponentId, questId) {
        console.log('対戦モード機能は将来実装予定です');
        return {
            success: false,
            message: 'この機能は現在開発中です'
        };
    },

    /**
     * リーダーボード表示用のHTML生成
     */
    renderLeaderboard: function(ranking, currentPlayerId = null) {
        if (ranking.length === 0) {
            return '<div class="text-center text-gray-500 py-8">ランキングデータがありません</div>';
        }

        const rankIcons = {
            1: '🥇',
            2: '🥈',
            3: '🥉'
        };

        return ranking.map(player => {
            const isCurrentPlayer = player.playerId === currentPlayerId;
            const rankIcon = rankIcons[player.rank] || `#${player.rank}`;

            return `
                <div class="flex items-center justify-between p-4 rounded-xl mb-2 ${isCurrentPlayer ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-white'} hover:shadow-lg transition">
                    <div class="flex items-center space-x-4">
                        <div class="text-2xl font-bold ${player.rank <= 3 ? 'text-3xl' : 'text-gray-600'}">
                            ${rankIcon}
                        </div>
                        <div>
                            <div class="font-bold text-gray-800">
                                ${player.name}
                                ${isCurrentPlayer ? '<span class="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">あなた</span>' : ''}
                            </div>
                            <div class="text-sm text-gray-500">${player.title}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xl font-bold text-purple-600">Lv.${player.level}</div>
                        <div class="text-xs text-gray-500">${player.completedQuests}クエスト達成</div>
                    </div>
                </div>
            `;
        }).join('');
    }
};

// グローバルに公開
window.Multiplayer = Multiplayer;

console.log('✅ multiplayer.js ロード完了');
