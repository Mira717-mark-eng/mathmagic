/**
 * マスマジ！- 共通処理・ユーティリティ
 */

// グローバル設定
const MathMagic = {
    // ゲームバランス設定
    config: {
        baseExp: 100,            // レベル1→2に必要な経験値
        expMultiplier: 1.5,      // レベルごとの経験値倍率
        problemXP: 50,           // 基本経験値
        consecutiveBonus: 10,    // 連続正解ボーナス
        difficultyThresholds: {
            easy: 0,
            normal: 3,
            hard: 7
        }
    },
    
    /**
     * LocalStorageから値を取得
     */
    getItem: function(key) {
        try {
            const item = localStorage.getItem(`mathmagic_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('LocalStorage読み込みエラー:', e);
            return null;
        }
    },
    
    /**
     * LocalStorageに値を保存
     */
    setItem: function(key, value) {
        try {
            localStorage.setItem(`mathmagic_${key}`, JSON.stringify(value));
        } catch (e) {
            console.error('LocalStorage保存エラー:', e);
        }
    },
    
    /**
     * LocalStorageから値を削除
     */
    removeItem: function(key) {
        try {
            localStorage.removeItem(`mathmagic_${key}`);
        } catch (e) {
            console.error('LocalStorage削除エラー:', e);
        }
    },
    
    /**
     * 現在のプレイヤーを取得
     */
    getCurrentPlayer: function() {
        return this.getItem('currentPlayer');
    },
    
    /**
     * 日時をフォーマット
     */
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    
    /**
     * レベルに必要な経験値を計算
     */
    getExpForLevel: function(level) {
        if (level <= 1) return 0;
        return Math.floor(this.config.baseExp * Math.pow(this.config.expMultiplier, level - 2));
    },
    
    /**
     * 経験値からレベルを計算
     */
    getLevelFromExp: function(exp) {
        let level = 1;
        let totalExp = 0;
        
        while (totalExp + this.getExpForLevel(level + 1) <= exp) {
            totalExp += this.getExpForLevel(level + 1);
            level++;
        }
        
        return { level, currentExp: exp - totalExp };
    },
    
    /**
     * メッセージを表示
     */
    showMessage: function(message, type = 'info') {
        // 既存のメッセージを削除
        const existing = document.getElementById('game-message');
        if (existing) {
            existing.remove();
        }
        
        // メッセージ要素を作成
        const messageDiv = document.createElement('div');
        messageDiv.id = 'game-message';
        messageDiv.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl animate-fade-in ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        messageDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-info-circle'
                } text-2xl"></i>
                <span class="font-bold">${message}</span>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // 3秒後に自動削除
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    },
    
    /**
     * ランダムな整数を生成
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * 配列からランダムな要素を選択
     */
    randomChoice: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * デバッグモードかチェック
     */
    isDebugMode: function() {
        return window.location.search.includes('debug=true');
    }
};

/**
 * テストプレイヤーを作成（デバッグ用）
 */
function createTestPlayer() {
    const testPlayer = {
        id: 'test-' + Date.now(),
        name: 'テストプレイヤー',
        grade: 3,
        characterType: 'wizard',
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
        createdAt: new Date().toISOString(),
        lastPlayedAt: new Date().toISOString()
    };
    
    MathMagic.setItem('currentPlayer', testPlayer);
    console.log('テストプレイヤーを作成しました:', testPlayer);
    return testPlayer;
}

/**
 * プレイヤーデータをリセット（デバッグ用）
 */
function resetPlayerData() {
    if (confirm('本当にプレイヤーデータをリセットしますか？')) {
        localStorage.clear();
        console.log('プレイヤーデータをリセットしました');
        window.location.href = 'index.html';
    }
}

/**
 * デバッグ情報を表示
 */
function showDebugInfo() {
    if (!MathMagic.isDebugMode()) {
        console.log('デバッグモードを有効にするには、URLに ?debug=true を追加してください');
        return;
    }
    
    const player = MathMagic.getCurrentPlayer();
    const questSession = MathMagic.getItem('questSession');
    
    console.group('🐛 デバッグ情報');
    console.log('プレイヤー:', player);
    console.log('クエストセッション:', questSession);
    console.log('LocalStorage キー:', Object.keys(localStorage).filter(k => k.startsWith('mathmagic_')));
    console.groupEnd();
}

// ページ読み込み時
document.addEventListener('DOMContentLoaded', () => {
    // デバッグモードの場合、情報を表示
    if (MathMagic.isDebugMode()) {
        console.log('🐛 デバッグモードが有効です');
        showDebugInfo();
        
        // グローバルに公開
        window.MathMagic = MathMagic;
        window.createTestPlayer = createTestPlayer;
        window.resetPlayerData = resetPlayerData;
        window.showDebugInfo = showDebugInfo;
    }
});

console.log('✅ main.js ロード完了');
