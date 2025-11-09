/**
 * マスマジ！- チュートリアルシステム
 * 初回起動時のガイド表示
 */

const TutorialSystem = {
    /**
     * チュートリアルを表示すべきかチェック
     */
    shouldShowTutorial: function() {
        const tutorialCompleted = localStorage.getItem('tutorialCompleted');
        return !tutorialCompleted;
    },

    /**
     * チュートリアルを表示
     */
    showTutorial: function() {
        const steps = [
            {
                title: 'マスマジ！へようこそ！',
                content: 'ファンタジーRPG風の世界で、楽しく算数・数学を学びましょう！',
                icon: '🎮'
            },
            {
                title: 'ワールドマップ',
                content: 'ワールドマップから好きなクエストを選んでチャレンジしよう！',
                icon: '🗺️'
            },
            {
                title: 'バトルシステム',
                content: '問題に正解してモンスターを攻撃！不正解だとダメージを受けるよ。',
                icon: '⚔️'
            },
            {
                title: 'アイテム',
                content: 'バトル中にアイテムを使って有利に戦おう！HP回復やヒント無料など便利なアイテムがあるよ。',
                icon: '🎒'
            },
            {
                title: 'レベルアップ',
                content: '経験値を貯めてレベルアップ！称号やアイテムをゲットしよう！',
                icon: '⭐'
            },
            {
                title: 'さあ、冒険に出発！',
                content: '準備はOK！ワールドマップから最初のクエストに挑戦しよう！',
                icon: '🚀'
            }
        ];

        this.createTutorialModal(steps);
    },

    /**
     * チュートリアルモーダルを作成
     */
    createTutorialModal: function(steps) {
        let currentStep = 0;

        const modal = document.createElement('div');
        modal.id = 'tutorial-modal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 border-4 border-purple-300 transform animate-bounce-in">
                <div class="text-center">
                    <div class="text-8xl mb-4" id="tutorial-icon">🎮</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4" id="tutorial-title">チュートリアル</h2>
                    <p class="text-gray-700 text-lg mb-6" id="tutorial-content">内容</p>

                    <div class="flex items-center justify-center space-x-2 mb-6">
                        ${steps.map((_, i) => `<div class="step-dot w-3 h-3 rounded-full ${i === 0 ? 'bg-purple-500' : 'bg-gray-300'}"></div>`).join('')}
                    </div>

                    <div class="flex space-x-3">
                        <button id="tutorial-skip" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-full transition">
                            スキップ
                        </button>
                        <button id="tutorial-next" class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition">
                            次へ
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const updateStep = () => {
            const step = steps[currentStep];
            document.getElementById('tutorial-icon').textContent = step.icon;
            document.getElementById('tutorial-title').textContent = step.title;
            document.getElementById('tutorial-content').textContent = step.content;

            // ドットを更新
            const dots = modal.querySelectorAll('.step-dot');
            dots.forEach((dot, i) => {
                if (i === currentStep) {
                    dot.className = 'step-dot w-3 h-3 rounded-full bg-purple-500';
                } else if (i < currentStep) {
                    dot.className = 'step-dot w-3 h-3 rounded-full bg-green-500';
                } else {
                    dot.className = 'step-dot w-3 h-3 rounded-full bg-gray-300';
                }
            });

            // 最後のステップではボタンを変更
            const nextBtn = document.getElementById('tutorial-next');
            if (currentStep === steps.length - 1) {
                nextBtn.textContent = '始める！';
            }
        };

        // 次へボタン
        document.getElementById('tutorial-next').addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep();
                SoundSystem.playSound('click');
            } else {
                this.completeTutorial();
                modal.remove();
                SoundSystem.playSound('fanfare');
            }
        });

        // スキップボタン
        document.getElementById('tutorial-skip').addEventListener('click', () => {
            if (confirm('チュートリアルをスキップしますか？\n後から設定画面で再表示できます。')) {
                this.completeTutorial();
                modal.remove();
                SoundSystem.playSound('close');
            }
        });

        updateStep();
    },

    /**
     * チュートリアル完了
     */
    completeTutorial: function() {
        localStorage.setItem('tutorialCompleted', 'true');
    },

    /**
     * チュートリアルをリセット
     */
    resetTutorial: function() {
        localStorage.removeItem('tutorialCompleted');
        MathMagic.showMessage('チュートリアルをリセットしました。次回起動時に表示されます。', 'success');
    }
};

// ワールドマップで自動的にチュートリアルを表示
if (window.location.pathname.includes('world-map.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (TutorialSystem.shouldShowTutorial()) {
                TutorialSystem.showTutorial();
            }
        }, 1000); // 1秒後に表示
    });
}

// グローバルに公開
window.TutorialSystem = TutorialSystem;

console.log('✅ tutorial-system.js ロード完了');
