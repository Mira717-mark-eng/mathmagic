/**
 * マスマジ！- ヒントシステム
 * 3段階のヒント表示と経験値調整
 */

const HintSystem = {
    maxHints: 3,
    currentHintLevel: 0,
    hintsUsed: [],
    currentProblem: null,
    
    /**
     * 初期化
     */
    init: function(problem) {
        this.currentProblem = problem;
        this.currentHintLevel = 0;
        this.hintsUsed = [];
        this.updateUI();
    },
    
    /**
     * ヒントを表示
     */
    showHint: async function() {
        if (this.currentHintLevel >= this.maxHints) {
            MathMagic.showMessage('これ以上ヒントはありません', 'info');
            return;
        }

        // ヒントポーションをチェック
        let isFree = false;
        if (window.BattleItems && BattleItems.useFreeHint()) {
            isFree = true;
            MathMagic.showMessage('ヒントポーションの効果で無料！', 'success');
        } else {
            // 確認ダイアログ
            const confirmed = confirm(
                `ヒント${this.currentHintLevel + 1}を見ますか？\n` +
                `（ヒントを使うと、もらえる経験値が少し減ります）`
            );

            if (!confirmed) {
                return;
            }
        }

        // ローディング表示
        this.showLoading();

        try {
            // ヒントを取得（AIから生成 or 事前定義）
            const hint = await this.getHint(this.currentHintLevel + 1);

            this.currentHintLevel++;

            // 無料の場合はカウントしない
            if (!isFree) {
                this.hintsUsed.push(hint);
            }

            // ヒント表示
            this.displayHint(hint);

            // UI更新
            this.updateUI();

        } catch (error) {
            console.error('ヒント取得エラー:', error);
            MathMagic.showMessage('ヒントの取得に失敗しました', 'error');
        } finally {
            this.hideLoading();
        }
    },
    
    /**
     * ヒントを取得
     */
    getHint: async function(hintLevel) {
        // ヒント1は常に式を表示
        if (hintLevel === 1 && this.currentProblem.formulaForHint) {
            return `計算式：${this.currentProblem.formulaForHint}`;
        }

        // 問題に事前定義のヒントがある場合
        if (this.currentProblem.hints &&
            this.currentProblem.hints[hintLevel - 1]) {
            return this.currentProblem.hints[hintLevel - 1];
        }
        
        // AI生成を試みる
        try {
            const player = MathMagic.getCurrentPlayer();
            const response = await fetch('/.netlify/functions/generate-hint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: this.currentProblem,
                    hintLevel: hintLevel,
                    grade: player.grade
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                return data.hint;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            // AI生成失敗時のフォールバック
            console.warn('AI生成失敗、デフォルトヒントを使用:', error);
            return this.getDefaultHint(hintLevel);
        }
    },
    
    /**
     * デフォルトヒント（AI失敗時）
     */
    getDefaultHint: function(hintLevel) {
        // ヒント1は式を表示
        if (hintLevel === 1 && this.currentProblem.formulaForHint) {
            return `計算式：${this.currentProblem.formulaForHint}`;
        }

        const hints = {
            1: this.currentProblem.formulaForHint ?
                `計算式：${this.currentProblem.formulaForHint}` :
                'この問題の答えを求めるには、どんな計算が必要か考えてみよう！',
            2: '問題文をよく読んで、わかっている数字を整理してみよう。',
            3: '計算式を作って、1つずつ計算してみよう。きっと解けるよ！'
        };

        return hints[hintLevel] || 'もう少し考えてみよう！';
    },
    
    /**
     * ヒント表示
     */
    displayHint: function(hint) {
        const hintContainer = document.getElementById('hint-container');
        if (!hintContainer) return;

        // コンテナを表示
        hintContainer.classList.remove('hidden');

        const hintCard = document.createElement('div');
        hintCard.className = 'hint-card animate-fade-in mb-4';
        hintCard.innerHTML = `
            <div class="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
                <div class="flex items-center mb-2">
                    <i class="fas fa-lightbulb text-yellow-600 text-xl mr-2"></i>
                    <span class="font-bold text-yellow-900">
                        ヒント ${this.currentHintLevel}
                    </span>
                </div>
                <p class="text-gray-800 leading-relaxed">${hint}</p>
            </div>
        `;

        hintContainer.appendChild(hintCard);

        // スクロール
        hintCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    
    /**
     * UI更新
     */
    updateUI: function() {
        const hintBtn = document.getElementById('hint-btn');
        if (!hintBtn) return;
        
        if (this.currentHintLevel >= this.maxHints) {
            hintBtn.disabled = true;
            hintBtn.innerHTML = `
                <i class="fas fa-lightbulb mr-2"></i>
                ヒント終了（${this.currentHintLevel}/${this.maxHints}）
            `;
            hintBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            hintBtn.disabled = false;
            hintBtn.innerHTML = `
                <i class="fas fa-lightbulb mr-2"></i>
                💡 ヒントを見る（${this.currentHintLevel}/${this.maxHints}）
            `;
        }
    },
    
    /**
     * ローディング表示
     */
    showLoading: function() {
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.disabled = true;
            hintBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin mr-2"></i>
                ヒントを考え中...
            `;
        }
    },
    
    /**
     * ローディング非表示
     */
    hideLoading: function() {
        this.updateUI();
    },
    
    /**
     * 経験値調整率を取得
     */
    getExpModifier: function() {
        const modifiers = [1.0, 0.8, 0.6, 0.4];
        return modifiers[this.currentHintLevel] || 0.4;
    },
    
    /**
     * ヒント使用数を取得
     */
    getHintsUsedCount: function() {
        return this.currentHintLevel;
    },
    
    /**
     * リセット
     */
    reset: function() {
        this.currentHintLevel = 0;
        this.hintsUsed = [];
        this.currentProblem = null;

        const hintContainer = document.getElementById('hint-container');
        if (hintContainer) {
            hintContainer.innerHTML = '';
            hintContainer.classList.add('hidden');
        }

        this.updateUI();
    }
};

// グローバルに公開
window.HintSystem = HintSystem;

console.log('✅ hint-system.js ロード完了');
