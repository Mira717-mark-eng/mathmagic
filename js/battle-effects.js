/**
 * マスマジ！- バトルエフェクトシステム
 * 攻撃、ダメージ、パーティクルなどの視覚効果
 */

const BattleEffects = {
    /**
     * 攻撃エフェクトを表示
     */
    showAttackEffect: function(characterType, targetElement) {
        const effectContainer = document.createElement('div');
        effectContainer.className = 'attack-effect-container';
        effectContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1000;
        `;

        let effectHTML = '';

        switch (characterType) {
            case 'wizard':
                effectHTML = this.createMagicEffect();
                break;
            case 'knight':
                effectHTML = this.createSlashEffect();
                break;
            case 'archer':
                effectHTML = this.createArrowEffect();
                break;
            case 'healer':
                effectHTML = this.createHealEffect();
                break;
            default:
                effectHTML = this.createDefaultEffect();
        }

        effectContainer.innerHTML = effectHTML;

        if (targetElement) {
            targetElement.appendChild(effectContainer);
        } else {
            document.body.appendChild(effectContainer);
        }

        // アニメーション後に削除
        setTimeout(() => {
            effectContainer.remove();
        }, 1000);
    },

    /**
     * 魔法攻撃エフェクト
     */
    createMagicEffect: function() {
        return `
            <div class="magic-effect" style="animation: magic-blast 0.6s ease-out;">
                <div style="font-size: 4rem; filter: drop-shadow(0 0 20px #a855f7);">
                    ✨💫⚡
                </div>
            </div>
        `;
    },

    /**
     * 斬撃エフェクト
     */
    createSlashEffect: function() {
        return `
            <div class="slash-effect" style="animation: slash-attack 0.5s ease-out;">
                <div style="font-size: 5rem; color: #ef4444; filter: drop-shadow(0 0 10px #dc2626);">
                    ⚔️
                </div>
            </div>
        `;
    },

    /**
     * 矢攻撃エフェクト
     */
    createArrowEffect: function() {
        return `
            <div class="arrow-effect" style="animation: arrow-shot 0.4s ease-out;">
                <div style="font-size: 3rem; filter: drop-shadow(0 0 10px #10b981);">
                    🏹➡️
                </div>
            </div>
        `;
    },

    /**
     * 回復エフェクト
     */
    createHealEffect: function() {
        return `
            <div class="heal-effect" style="animation: heal-pulse 0.8s ease-out;">
                <div style="font-size: 4rem; filter: drop-shadow(0 0 20px #22c55e);">
                    ✨💚✨
                </div>
            </div>
        `;
    },

    /**
     * デフォルトエフェクト
     */
    createDefaultEffect: function() {
        return `
            <div class="default-effect" style="animation: impact 0.5s ease-out;">
                <div style="font-size: 4rem;">💥</div>
            </div>
        `;
    },

    /**
     * ダメージ数値を表示
     */
    showDamage: function(damage, targetElement, isCritical = false) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-number';
        damageText.textContent = `-${damage}`;
        damageText.style.cssText = `
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            font-size: ${isCritical ? '4rem' : '3rem'};
            font-weight: bold;
            color: ${isCritical ? '#ef4444' : '#f59e0b'};
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5), 0 0 10px ${isCritical ? '#dc2626' : '#f59e0b'};
            pointer-events: none;
            z-index: 1001;
            animation: damage-float 1s ease-out forwards;
        `;

        if (targetElement) {
            targetElement.appendChild(damageText);
        } else {
            document.body.appendChild(damageText);
        }

        setTimeout(() => {
            damageText.remove();
        }, 1000);
    },

    /**
     * 回復数値を表示
     */
    showHealing: function(healing, targetElement) {
        const healText = document.createElement('div');
        healText.className = 'heal-number';
        healText.textContent = `+${healing}`;
        healText.style.cssText = `
            position: absolute;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 3rem;
            font-weight: bold;
            color: #22c55e;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5), 0 0 10px #22c55e;
            pointer-events: none;
            z-index: 1001;
            animation: heal-float 1s ease-out forwards;
        `;

        if (targetElement) {
            targetElement.appendChild(healText);
        } else {
            document.body.appendChild(healText);
        }

        setTimeout(() => {
            healText.remove();
        }, 1000);
    },

    /**
     * パーティクルエフェクト（キラキラ）
     */
    showParticles: function(targetElement, color = '#fbbf24', count = 20) {
        const container = document.createElement('div');
        container.className = 'particle-container';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.textContent = '✨';
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                font-size: ${Math.random() * 1.5 + 0.5}rem;
                color: ${color};
                filter: drop-shadow(0 0 5px ${color});
                pointer-events: none;
                animation: particle-burst ${Math.random() * 0.5 + 0.5}s ease-out forwards;
                transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
                --tx: ${(Math.random() - 0.5) * 200}px;
                --ty: ${(Math.random() - 0.5) * 200}px;
            `;

            container.appendChild(particle);
        }

        if (targetElement) {
            targetElement.appendChild(container);
        } else {
            document.body.appendChild(container);
        }

        setTimeout(() => {
            container.remove();
        }, 1000);
    },

    /**
     * 画面シェイク
     */
    shakeScreen: function(intensity = 'medium') {
        const intensityMap = {
            light: 'shake-light',
            medium: 'shake-medium',
            heavy: 'shake-heavy'
        };

        const className = intensityMap[intensity] || 'shake-medium';
        document.body.classList.add(className);

        setTimeout(() => {
            document.body.classList.remove(className);
        }, 500);
    },

    /**
     * コンボ表示
     */
    showCombo: function(comboCount) {
        // 既存のコンボ表示を削除
        const existingCombo = document.getElementById('combo-display');
        if (existingCombo) {
            existingCombo.remove();
        }

        if (comboCount < 2) return;

        const comboDisplay = document.createElement('div');
        comboDisplay.id = 'combo-display';
        comboDisplay.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 4rem;
            font-weight: bold;
            color: #f59e0b;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.5), 0 0 20px #f59e0b;
            pointer-events: none;
            z-index: 2000;
            animation: combo-pop 0.6s ease-out;
        `;

        comboDisplay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 5rem;">🔥</div>
                <div>${comboCount} COMBO!</div>
                ${comboCount >= 5 ? '<div style="font-size: 2rem;">AMAZING!</div>' : ''}
                ${comboCount >= 10 ? '<div style="font-size: 2rem;">🌟 PERFECT! 🌟</div>' : ''}
            </div>
        `;

        document.body.appendChild(comboDisplay);

        // パーティクルも表示
        this.showParticles(document.body, '#f59e0b', 30);

        setTimeout(() => {
            comboDisplay.remove();
        }, 1500);
    },

    /**
     * クリティカルヒット表示
     */
    showCritical: function() {
        const criticalDisplay = document.createElement('div');
        criticalDisplay.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 5rem;
            font-weight: bold;
            color: #ef4444;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.5), 0 0 30px #dc2626;
            pointer-events: none;
            z-index: 2000;
            animation: critical-flash 0.8s ease-out;
        `;

        criticalDisplay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 6rem;">⚡</div>
                <div>CRITICAL!</div>
            </div>
        `;

        document.body.appendChild(criticalDisplay);

        // 画面を激しくシェイク
        this.shakeScreen('heavy');

        // パーティクル爆発
        this.showParticles(document.body, '#ef4444', 50);

        setTimeout(() => {
            criticalDisplay.remove();
        }, 1000);
    },

    /**
     * 勝利エフェクト
     */
    showVictory: function() {
        const victoryDisplay = document.createElement('div');
        victoryDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 6rem;
            font-weight: bold;
            color: #fbbf24;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.5), 0 0 40px #fbbf24;
            pointer-events: none;
            z-index: 3000;
            animation: victory-zoom 1.5s ease-out;
        `;

        victoryDisplay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 8rem;">🎉</div>
                <div>VICTORY!</div>
                <div style="font-size: 8rem;">🎊</div>
            </div>
        `;

        document.body.appendChild(victoryDisplay);

        // 豪華なパーティクル
        setTimeout(() => this.showParticles(document.body, '#fbbf24', 100), 0);
        setTimeout(() => this.showParticles(document.body, '#a855f7', 100), 200);
        setTimeout(() => this.showParticles(document.body, '#ef4444', 100), 400);

        setTimeout(() => {
            victoryDisplay.remove();
        }, 2000);
    },

    /**
     * 敗北エフェクト
     */
    showDefeat: function() {
        const defeatDisplay = document.createElement('div');
        defeatDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 5rem;
            font-weight: bold;
            color: #6b7280;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
            pointer-events: none;
            z-index: 3000;
            animation: defeat-fade 1.5s ease-out;
        `;

        defeatDisplay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 6rem;">💫</div>
                <div>DEFEAT...</div>
                <div style="font-size: 2rem; margin-top: 1rem;">もう一度挑戦しよう！</div>
            </div>
        `;

        document.body.appendChild(defeatDisplay);

        setTimeout(() => {
            defeatDisplay.remove();
        }, 2000);
    },

    /**
     * レベルアップエフェクト
     */
    showLevelUp: function(newLevel) {
        const levelUpDisplay = document.createElement('div');
        levelUpDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 5rem;
            font-weight: bold;
            color: #fbbf24;
            text-shadow: 4px 4px 8px rgba(0,0,0,0.5), 0 0 40px #fbbf24;
            pointer-events: none;
            z-index: 3000;
            animation: level-up-bounce 1.5s ease-out;
        `;

        levelUpDisplay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 7rem;">⭐</div>
                <div>LEVEL UP!</div>
                <div style="font-size: 4rem; margin-top: 1rem;">Lv.${newLevel}</div>
            </div>
        `;

        document.body.appendChild(levelUpDisplay);

        // キラキラエフェクト
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.showParticles(document.body, '#fbbf24', 30);
            }, i * 200);
        }

        setTimeout(() => {
            levelUpDisplay.remove();
        }, 2000);
    },

    /**
     * CSSアニメーションをドキュメントに追加
     */
    injectAnimationStyles: function() {
        if (document.getElementById('battle-effects-styles')) {
            return; // 既に追加済み
        }

        const style = document.createElement('style');
        style.id = 'battle-effects-styles';
        style.textContent = `
            @keyframes magic-blast {
                0% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
                100% { transform: scale(1.5) rotate(360deg); opacity: 0; }
            }

            @keyframes slash-attack {
                0% { transform: translateX(-100px) rotate(-45deg); opacity: 0; }
                50% { transform: translateX(0) rotate(0deg); opacity: 1; }
                100% { transform: translateX(100px) rotate(45deg); opacity: 0; }
            }

            @keyframes arrow-shot {
                0% { transform: translateX(-200px); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(200px); opacity: 0; }
            }

            @keyframes heal-pulse {
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.3); opacity: 1; }
                100% { transform: scale(1); opacity: 0; }
            }

            @keyframes impact {
                0% { transform: scale(0); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.8; }
                100% { transform: scale(2); opacity: 0; }
            }

            @keyframes damage-float {
                0% { transform: translateX(-50%) translateY(0); opacity: 1; }
                100% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
            }

            @keyframes heal-float {
                0% { transform: translateX(-50%) translateY(0); opacity: 1; }
                100% { transform: translateX(-50%) translateY(-80px); opacity: 0; }
            }

            @keyframes particle-burst {
                0% {
                    transform: translate(-50%, -50%) translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0);
                    opacity: 0;
                }
            }

            @keyframes shake-light {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-3px); }
                75% { transform: translateX(3px); }
            }

            @keyframes shake-medium {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-8px); }
                75% { transform: translateX(8px); }
            }

            @keyframes shake-heavy {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-15px, -10px); }
                20% { transform: translate(15px, 10px); }
                30% { transform: translate(-15px, 10px); }
                40% { transform: translate(15px, -10px); }
                50% { transform: translate(-15px, -10px); }
                60% { transform: translate(15px, 10px); }
                70% { transform: translate(-15px, 10px); }
                80% { transform: translate(15px, -10px); }
                90% { transform: translate(-5px, -5px); }
            }

            @keyframes combo-pop {
                0% { transform: translateX(-50%) scale(0); opacity: 0; }
                50% { transform: translateX(-50%) scale(1.3); opacity: 1; }
                100% { transform: translateX(-50%) scale(1); opacity: 1; }
            }

            @keyframes critical-flash {
                0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
                25% { transform: translateX(-50%) scale(1.3); opacity: 1; }
                50% { transform: translateX(-50%) scale(0.9); opacity: 1; }
                75% { transform: translateX(-50%) scale(1.1); opacity: 1; }
                100% { transform: translateX(-50%) scale(1); opacity: 0; }
            }

            @keyframes victory-zoom {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }

            @keyframes defeat-fade {
                0% { opacity: 0; transform: translate(-50%, -50%) translateY(50px); }
                50% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
                100% { opacity: 0.5; transform: translate(-50%, -50%) translateY(0); }
            }

            @keyframes level-up-bounce {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
                70% { transform: translate(-50%, -50%) scale(0.9); }
                85% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }

            /* モンスターが揺れるアニメーション */
            @keyframes monster-hit {
                0% { transform: translateX(0); filter: brightness(1); }
                25% { transform: translateX(-10px); filter: brightness(1.5); }
                50% { transform: translateX(10px); filter: brightness(1); }
                75% { transform: translateX(-5px); filter: brightness(1.5); }
                100% { transform: translateX(0); filter: brightness(1); }
            }

            .monster-hit-animation {
                animation: monster-hit 0.4s ease-out;
            }
        `;

        document.head.appendChild(style);
    }
};

// ページ読み込み時にスタイルを注入
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            BattleEffects.injectAnimationStyles();
        });
    } else {
        BattleEffects.injectAnimationStyles();
    }
}

// グローバルに公開
window.BattleEffects = BattleEffects;

console.log('✅ battle-effects.js ロード完了');
