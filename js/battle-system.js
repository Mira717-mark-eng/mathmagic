/**
 * マスマジ！- バトルシステム
 * モンスターとのバトル管理
 */

const BattleSystem = {
    // バトル状態
    currentMonster: null,
    playerMaxHP: 100,
    playerCurrentHP: 100,
    monsterMaxHP: 100,
    monsterCurrentHP: 100,
    comboCount: 0,
    damagePerQuestion: 10,
    playerDamageOnWrong: 15,
    initialized: false, // 初期化済みフラグ

    /**
     * バトルを初期化
     */
    init: function(worldId, difficulty) {
        console.log('⚔️ バトルシステムを初期化中...', {worldId, difficulty});

        // モンスターを選択
        this.currentMonster = getMonsterByWorld(worldId, difficulty);
        console.log('👾 選択されたモンスター:', this.currentMonster);

        // HP初期化（初回のみ）
        if (!this.initialized) {
            this.playerCurrentHP = this.playerMaxHP;
            this.monsterCurrentHP = this.monsterMaxHP;
            this.comboCount = 0;
            this.initialized = true;
            console.log('🆕 初回初期化：HPをリセット');
        } else {
            console.log('♻️ 既存のHP状態を保持: Player=' + this.playerCurrentHP + ', Monster=' + this.monsterCurrentHP);
        }

        // UI更新
        this.updateMonsterDisplay();
        this.updateHPBars();

        // プレイヤー名を表示
        const player = MathMagic.getCurrentPlayer();
        if (player) {
            const playerNameElement = document.getElementById('player-name-battle');
            if (playerNameElement) {
                playerNameElement.textContent = player.name;
            }
        }

        console.log('✅ バトルシステム初期化完了');
    },

    /**
     * バトルをリセット（新しいクエスト開始時）
     */
    reset: function() {
        this.initialized = false;
        this.playerCurrentHP = this.playerMaxHP;
        this.monsterCurrentHP = this.monsterMaxHP;
        this.comboCount = 0;
        console.log('🔄 バトルシステムをリセット');
    },

    /**
     * モンスター表示を更新
     */
    updateMonsterDisplay: function() {
        const monsterSprite = document.getElementById('monster-sprite');
        const monsterName = document.getElementById('monster-name');

        if (monsterSprite && this.currentMonster) {
            // 画像を使う場合
            if (this.currentMonster.useImage && this.currentMonster.spriteImage) {
                // imgタグに変換
                monsterSprite.innerHTML = `
                    <img src="${this.currentMonster.spriteImage}"
                         alt="${this.currentMonster.name}"
                         class="monster-image"
                         onerror="this.style.display='none'; this.parentElement.textContent='${this.currentMonster.sprite}';">
                `;
            } else {
                // 絵文字を使う
                monsterSprite.textContent = this.currentMonster.sprite;
            }
        }

        if (monsterName && this.currentMonster) {
            monsterName.textContent = this.currentMonster.name;
        }
    },

    /**
     * HPバーを更新
     */
    updateHPBars: function() {
        // プレイヤーHP
        const playerHPBar = document.getElementById('player-hp-bar');
        const playerHPValue = document.getElementById('player-hp-value');

        if (playerHPBar) {
            const playerHPPercent = (this.playerCurrentHP / this.playerMaxHP) * 100;
            playerHPBar.style.width = `${Math.max(0, playerHPPercent)}%`;

            // HPに応じて色を変更
            if (playerHPPercent > 50) {
                playerHPBar.className = 'bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500 ease-out';
            } else if (playerHPPercent > 25) {
                playerHPBar.className = 'bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all duration-500 ease-out';
            } else {
                playerHPBar.className = 'bg-gradient-to-r from-red-400 to-red-600 h-full transition-all duration-500 ease-out';
            }
        }

        if (playerHPValue) {
            playerHPValue.textContent = Math.max(0, Math.floor(this.playerCurrentHP));
        }

        // モンスターHP
        const monsterHPBar = document.getElementById('monster-hp-bar');
        const monsterHPValue = document.getElementById('monster-hp-value');

        if (monsterHPBar) {
            const monsterHPPercent = (this.monsterCurrentHP / this.monsterMaxHP) * 100;
            monsterHPBar.style.width = `${Math.max(0, monsterHPPercent)}%`;
        }

        if (monsterHPValue) {
            monsterHPValue.textContent = Math.max(0, Math.floor(this.monsterCurrentHP));
        }
    },

    /**
     * 正解時の処理（プレイヤーの攻撃）
     */
    onCorrectAnswer: function() {
        console.log('✅ 正解！プレイヤーの攻撃');

        // コンボカウント増加
        this.comboCount++;
        this.updateComboDisplay();

        // ダメージ計算（コンボでダメージ増加）
        let damage = this.damagePerQuestion;

        // コンボボーナス
        if (this.comboCount >= 3) {
            damage = Math.floor(damage * 1.5); // 1.5倍
            console.log('🔥 コンボボーナス！ダメージ1.5倍');
        }

        if (this.comboCount >= 5) {
            damage = Math.floor(damage * 2); // 2倍
            console.log('💥 超コンボ！ダメージ2倍');
        }

        // アイテムによるダメージブースト
        if (window.BattleItems) {
            const damageBoost = BattleItems.getDamageBoost();
            if (damageBoost > 1.0) {
                damage = Math.floor(damage * damageBoost);
                console.log(`⚔️ アイテム効果！ダメージ${damageBoost}倍`);
            }
        }

        // モンスターにダメージ
        this.damageMonster(damage);

        // 攻撃アニメーション
        this.playAttackAnimation('player');

        // ダメージ数値表示
        this.showDamageNumber(damage, 'player-attack');

        return this.monsterCurrentHP <= 0;
    },

    /**
     * 不正解時の処理（モンスターの攻撃）
     */
    onWrongAnswer: function() {
        console.log('❌ 不正解！モンスターの攻撃');

        // コンボシールドチェック
        if (window.BattleItems && BattleItems.useComboProtect()) {
            // コンボシールドが発動した場合、コンボは維持される
            console.log('🛡️ コンボシールド発動！コンボ維持');
        } else {
            // コンボリセット
            this.comboCount = 0;
            this.updateComboDisplay();
        }

        // プレイヤーにダメージ
        this.damagePlayer(this.playerDamageOnWrong);

        // 攻撃アニメーション
        this.playAttackAnimation('monster');

        // ダメージ数値表示
        this.showDamageNumber(this.playerDamageOnWrong, 'monster-attack');

        return this.playerCurrentHP <= 0;
    },

    /**
     * モンスターにダメージ
     */
    damageMonster: function(damage) {
        this.monsterCurrentHP = Math.max(0, this.monsterCurrentHP - damage);
        this.updateHPBars();

        // ダメージアニメーション
        const monsterSprite = document.getElementById('monster-sprite');
        if (monsterSprite) {
            monsterSprite.classList.add('monster-damage');
            setTimeout(() => {
                monsterSprite.classList.remove('monster-damage');
            }, 500);
        }

        console.log(`👾 モンスターに${damage}ダメージ！残りHP: ${this.monsterCurrentHP}`);
    },

    /**
     * プレイヤーにダメージ
     */
    damagePlayer: function(damage) {
        this.playerCurrentHP = Math.max(0, this.playerCurrentHP - damage);
        this.updateHPBars();

        // 画面シェイク
        this.shakeScreen();

        console.log(`⚔️ プレイヤーに${damage}ダメージ！残りHP: ${this.playerCurrentHP}`);
    },

    /**
     * コンボ表示更新
     */
    updateComboDisplay: function() {
        const comboCounter = document.getElementById('combo-counter');
        const comboCount = document.getElementById('combo-count');

        if (this.comboCount >= 2) {
            if (comboCounter) comboCounter.classList.remove('hidden');
            if (comboCount) comboCount.textContent = this.comboCount;
        } else {
            if (comboCounter) comboCounter.classList.add('hidden');
        }
    },

    /**
     * ダメージ数値を表示
     */
    showDamageNumber: function(damage, type) {
        const container = document.getElementById('damage-numbers-container');
        if (!container) return;

        const damageEl = document.createElement('div');
        damageEl.className = 'damage-number';

        if (type === 'player-attack') {
            damageEl.classList.add('player-damage');
            damageEl.style.color = '#ff4444';
            damageEl.style.left = '60%';
            damageEl.style.top = '40%';
        } else if (type === 'monster-attack') {
            damageEl.classList.add('monster-damage-number');
            damageEl.style.color = '#ffaa00';
            damageEl.style.left = '30%';
            damageEl.style.top = '20%';
        }

        damageEl.textContent = `-${damage}`;
        damageEl.style.position = 'absolute';
        damageEl.style.fontSize = '3rem';
        damageEl.style.fontWeight = '900';
        damageEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        damageEl.style.animation = 'damage-float 1s ease-out forwards';
        damageEl.style.zIndex = '100';
        damageEl.style.pointerEvents = 'none';

        container.appendChild(damageEl);

        // 1秒後に削除
        setTimeout(() => {
            damageEl.remove();
        }, 1000);
    },

    /**
     * 攻撃アニメーション
     */
    playAttackAnimation: function(attacker) {
        if (attacker === 'player') {
            // プレイヤーの攻撃エフェクト
            const arena = document.getElementById('battle-arena');
            if (arena) {
                arena.classList.add('player-attack-flash');
                setTimeout(() => {
                    arena.classList.remove('player-attack-flash');
                }, 300);
            }
        } else if (attacker === 'monster') {
            // モンスターの攻撃アニメーション
            const monsterSprite = document.getElementById('monster-sprite');
            if (monsterSprite) {
                monsterSprite.classList.add('monster-attack');
                setTimeout(() => {
                    monsterSprite.classList.remove('monster-attack');
                }, 600);
            }
        }
    },

    /**
     * 画面シェイク
     */
    shakeScreen: function() {
        const arena = document.getElementById('battle-arena');
        if (arena) {
            arena.classList.add('screen-shake');
            setTimeout(() => {
                arena.classList.remove('screen-shake');
            }, 500);
        }
    },

    /**
     * モンスター撃破
     */
    defeatMonster: function() {
        console.log('🎉 モンスター撃破！');

        const monsterSprite = document.getElementById('monster-sprite');
        if (monsterSprite) {
            // 撃破アニメーション
            monsterSprite.classList.add('monster-defeat');

            // 爆発エフェクト
            setTimeout(() => {
                this.showVictoryEffect();
            }, 500);
        }

        // 報酬を返す
        return this.currentMonster ? this.currentMonster.xpBonus : 0;
    },

    /**
     * 勝利エフェクト
     */
    showVictoryEffect: function() {
        const arena = document.getElementById('battle-arena');
        if (arena) {
            // キラキラエフェクト
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    this.createSparkle();
                }, i * 50);
            }
        }
    },

    /**
     * キラキラパーティクル生成
     */
    createSparkle: function() {
        const container = document.getElementById('damage-numbers-container');
        if (!container) return;

        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.fontSize = '2rem';
        sparkle.style.animation = 'sparkle-rise 1s ease-out forwards';
        sparkle.style.pointerEvents = 'none';

        container.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    },

    /**
     * プレイヤー敗北
     */
    playerDefeated: function() {
        console.log('💀 プレイヤー敗北...');

        // HPを1に戻す（完全にゲームオーバーにはしない）
        this.playerCurrentHP = 1;
        this.updateHPBars();

        MathMagic.showMessage('モンスターに やられてしまった...', 'warning');
    },

    /**
     * バトル状態を取得
     */
    getBattleState: function() {
        return {
            monster: this.currentMonster,
            playerHP: this.playerCurrentHP,
            monsterHP: this.monsterCurrentHP,
            combo: this.comboCount
        };
    }
};

// グローバルに公開
window.BattleSystem = BattleSystem;

console.log('✅ battle-system.js ロード完了');
