/**
 * マスマジ！- バトルアイテムシステム
 * バトル中のアイテム使用機能
 */

const BattleItems = {
    // バトル中のアクティブエフェクト
    activeEffects: {
        expBoostNext: 1.0,      // 経験値ブースト
        damageBoostNext: 1.0,   // ダメージブースト
        comboProtect: 0,        // コンボシールド
        freeHintNow: 0          // 無料ヒント
    },

    /**
     * アイテムメニューを開く
     */
    openItemMenu: function() {
        const player = MathMagic.getCurrentPlayer();
        if (!player) return;

        const modal = document.getElementById('item-modal');
        const itemList = document.getElementById('item-list');
        const noItemsMessage = document.getElementById('no-items-message');

        // バトルで使用可能なアイテムを取得
        const battleItems = this.getBattleItems(player);

        if (battleItems.length === 0) {
            itemList.classList.add('hidden');
            noItemsMessage.classList.remove('hidden');
        } else {
            itemList.classList.remove('hidden');
            noItemsMessage.classList.add('hidden');
            this.renderItemList(battleItems, player);
        }

        modal.classList.remove('hidden');
        if (window.SoundSystem) {
            SoundSystem.playSound('open');
        }
    },

    /**
     * アイテムメニューを閉じる
     */
    closeItemMenu: function() {
        const modal = document.getElementById('item-modal');
        modal.classList.add('hidden');
        if (window.SoundSystem) {
            SoundSystem.playSound('close');
        }
    },

    /**
     * バトルで使用可能なアイテムを取得
     */
    getBattleItems: function(player) {
        if (!player.inventory || player.inventory.length === 0) {
            return [];
        }

        return player.inventory.map((invItem, index) => {
            const item = InventorySystem.items[invItem.id];
            if (item && item.usableInBattle) {
                return { ...item, itemId: invItem.id, index: index };
            }
            return null;
        }).filter(item => item !== null);
    },

    /**
     * アイテムリストをレンダリング
     */
    renderItemList: function(items, player) {
        const itemList = document.getElementById('item-list');
        itemList.innerHTML = '';

        items.forEach(item => {
            const itemCard = document.createElement('div');
            const rarityColor = InventorySystem.getRarityColor(item.rarity);

            itemCard.className = 'bg-white rounded-lg p-3 shadow-md hover:shadow-xl transition cursor-pointer border-2 border-purple-200 hover:border-purple-400';
            itemCard.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="text-4xl">${item.icon}</div>
                    <div class="flex-1">
                        <div class="font-bold text-gray-800">${item.name}</div>
                        <div class="text-xs text-gray-600">${item.description}</div>
                        <div class="text-xs ${rarityColor} font-bold mt-1">${InventorySystem.getRarityName(item.rarity)}</div>
                    </div>
                    <button class="use-item-btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-4 py-2 rounded-full transition transform hover:scale-105">
                        使う
                    </button>
                </div>
            `;

            const useBtn = itemCard.querySelector('.use-item-btn');
            useBtn.addEventListener('click', () => {
                this.useItem(player, item.itemId, item.index);
            });

            itemList.appendChild(itemCard);
        });
    },

    /**
     * アイテムを使用
     */
    useItem: function(player, itemId, index) {
        const item = InventorySystem.items[itemId];
        if (!item || !item.usableInBattle) {
            MathMagic.showMessage('このアイテムはバトル中に使用できません', 'error');
            return;
        }

        // アイテム効果を適用
        this.applyItemEffect(item, player);

        // インベントリから削除
        player.inventory.splice(index, 1);
        PlayerManager.updatePlayer(player);

        // メニューを閉じる
        this.closeItemMenu();

        // 効果音
        if (window.SoundSystem) {
            SoundSystem.playSound('correct');
        }
    },

    /**
     * アイテム効果を適用
     */
    applyItemEffect: function(item, player) {
        const effect = item.effect;

        // HP回復
        if (effect.healHP) {
            const healAmount = effect.healHP === 100 ?
                BattleSystem.playerMaxHP :
                Math.min(effect.healHP, BattleSystem.playerMaxHP - BattleSystem.playerCurrentHP);

            BattleSystem.playerCurrentHP = Math.min(
                BattleSystem.playerMaxHP,
                BattleSystem.playerCurrentHP + healAmount
            );
            BattleSystem.updateHPBars();

            MathMagic.showMessage(`${item.name}を使った！HPが${healAmount}回復した！`, 'success');
            this.showHealEffect();
        }

        // 無料ヒント（即時）
        if (effect.freeHintNow) {
            this.activeEffects.freeHintNow += effect.freeHintNow;
            MathMagic.showMessage(`${item.name}を使った！次のヒントが無料になる！`, 'success');
        }

        // 経験値ブースター（次の問題）
        if (effect.expBoostNext) {
            this.activeEffects.expBoostNext = effect.expBoostNext;
            MathMagic.showMessage(`${item.name}を使った！次の問題の経験値が${effect.expBoostNext}倍！`, 'success');
        }

        // コンボシールド
        if (effect.comboProtect) {
            this.activeEffects.comboProtect += effect.comboProtect;
            MathMagic.showMessage(`${item.name}を使った！1回コンボが守られる！`, 'success');
        }

        // 攻撃力アップ（次の攻撃）
        if (effect.damageBoostNext) {
            this.activeEffects.damageBoostNext = effect.damageBoostNext;
            MathMagic.showMessage(`${item.name}を使った！次の攻撃のダメージが${effect.damageBoostNext}倍！`, 'success');
        }
    },

    /**
     * 回復エフェクト表示
     */
    showHealEffect: function() {
        const container = document.getElementById('damage-numbers-container');
        if (!container) return;

        const healEl = document.createElement('div');
        healEl.textContent = '+HP';
        healEl.style.position = 'absolute';
        healEl.style.left = '30%';
        healEl.style.top = '20%';
        healEl.style.fontSize = '3rem';
        healEl.style.fontWeight = '900';
        healEl.style.color = '#00ff00';
        healEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        healEl.style.animation = 'damage-float 1s ease-out forwards';
        healEl.style.zIndex = '100';
        healEl.style.pointerEvents = 'none';

        container.appendChild(healEl);

        setTimeout(() => {
            healEl.remove();
        }, 1000);
    },

    /**
     * 経験値ブーストを取得して消費
     */
    getExpBoost: function() {
        const boost = this.activeEffects.expBoostNext;
        this.activeEffects.expBoostNext = 1.0; // リセット
        return boost;
    },

    /**
     * ダメージブーストを取得して消費
     */
    getDamageBoost: function() {
        const boost = this.activeEffects.damageBoostNext;
        this.activeEffects.damageBoostNext = 1.0; // リセット
        return boost;
    },

    /**
     * コンボシールドを消費
     */
    useComboProtect: function() {
        if (this.activeEffects.comboProtect > 0) {
            this.activeEffects.comboProtect--;
            MathMagic.showMessage('コンボシールドが発動！コンボが守られた！', 'success');
            return true;
        }
        return false;
    },

    /**
     * 無料ヒントを使用
     */
    useFreeHint: function() {
        if (this.activeEffects.freeHintNow > 0) {
            this.activeEffects.freeHintNow--;
            return true;
        }
        return false;
    },

    /**
     * アクティブエフェクトをリセット
     */
    resetEffects: function() {
        this.activeEffects = {
            expBoostNext: 1.0,
            damageBoostNext: 1.0,
            comboProtect: 0,
            freeHintNow: 0
        };
    }
};

// ページロード時にイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
    // アイテムメニューボタン
    const itemMenuBtn = document.getElementById('item-menu-btn');
    if (itemMenuBtn) {
        itemMenuBtn.addEventListener('click', () => {
            BattleItems.openItemMenu();
        });
    }

    // モーダルを閉じるボタン
    const itemModalClose = document.getElementById('item-modal-close');
    if (itemModalClose) {
        itemModalClose.addEventListener('click', () => {
            BattleItems.closeItemMenu();
        });
    }

    // モーダルの背景をクリックして閉じる
    const itemModal = document.getElementById('item-modal');
    if (itemModal) {
        itemModal.addEventListener('click', (e) => {
            if (e.target === itemModal) {
                BattleItems.closeItemMenu();
            }
        });
    }
});

// グローバルに公開
window.BattleItems = BattleItems;

console.log('✅ battle-items.js ロード完了');
