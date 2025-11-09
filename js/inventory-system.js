/**
 * マスマジ！- インベントリ/アイテムシステム
 * DQ風アイテム管理
 */

const InventorySystem = {
    // アイテム定義
    items: {
        // 武器
        'hero_sword': {
            name: '勇者の剣',
            type: 'weapon',
            icon: '⚔️',
            description: '伝説の勇者が使ったと言われる剣',
            effect: { expBonus: 0.1 },
            rarity: 'legendary'
        },
        'sage_staff': {
            name: '賢者の杖',
            type: 'weapon',
            icon: '🪄',
            description: '知恵を授ける魔法の杖',
            effect: { hintDiscount: 0.5 },
            rarity: 'epic'
        },

        // 防具
        'power_ring': {
            name: '力の指輪',
            type: 'accessory',
            icon: '💍',
            description: '装備者の力を引き出す指輪',
            effect: { expBonus: 0.05 },
            rarity: 'rare'
        },
        'lightning_ring': {
            name: '雷神の指輪',
            type: 'accessory',
            icon: '⚡',
            description: '素早さを上げる雷の指輪',
            effect: { timeBonus: 5 },
            rarity: 'epic'
        },
        'speed_boots': {
            name: '俊足のブーツ',
            type: 'armor',
            icon: '👢',
            description: '移動速度が上がるブーツ',
            effect: { timeBonus: 10 },
            rarity: 'rare'
        },

        // アクセサリー
        'hero_crown': {
            name: '勇者の王冠',
            type: 'accessory',
            icon: '👑',
            description: '世界を救った勇者の証',
            effect: { expBonus: 0.2, allBonus: true },
            rarity: 'legendary'
        },
        'perfect_gem': {
            name: '完璧の宝石',
            type: 'accessory',
            icon: '💎',
            description: '完璧を求める者の宝石',
            effect: { accuracyBonus: 0.1 },
            rarity: 'epic'
        },

        // 消費アイテム
        'wisdom_scroll': {
            name: '知恵の巻物',
            type: 'consumable',
            icon: '📜',
            description: 'ヒントが1回無料になる',
            effect: { freeHint: 1 },
            rarity: 'common',
            consumable: true,
            usableInBattle: false
        },
        'exp_potion': {
            name: '経験の薬',
            type: 'consumable',
            icon: '🧪',
            description: '経験値を100獲得する',
            effect: { exp: 100 },
            rarity: 'common',
            consumable: true,
            usableInBattle: false
        },
        'skill_book': {
            name: 'スキルブック',
            type: 'consumable',
            icon: '📕',
            description: 'ランダムなスキルを習得',
            effect: { skill: 'random' },
            rarity: 'rare',
            consumable: true,
            usableInBattle: false
        },

        // バトル用消費アイテム
        'hp_potion_small': {
            name: 'HP回復薬（小）',
            type: 'consumable',
            icon: '❤️',
            description: 'HPを30回復する',
            effect: { healHP: 30 },
            rarity: 'common',
            consumable: true,
            usableInBattle: true
        },
        'hp_potion_medium': {
            name: 'HP回復薬（中）',
            type: 'consumable',
            icon: '💖',
            description: 'HPを50回復する',
            effect: { healHP: 50 },
            rarity: 'rare',
            consumable: true,
            usableInBattle: true
        },
        'hp_potion_large': {
            name: 'HP回復薬（大）',
            type: 'consumable',
            icon: '💗',
            description: 'HPを全回復する',
            effect: { healHP: 100 },
            rarity: 'epic',
            consumable: true,
            usableInBattle: true
        },
        'hint_potion': {
            name: 'ヒントポーション',
            type: 'consumable',
            icon: '💡',
            description: 'ヒントを無料で見られる（1回）',
            effect: { freeHintNow: 1 },
            rarity: 'common',
            consumable: true,
            usableInBattle: true
        },
        'exp_booster': {
            name: '経験値ブースター',
            type: 'consumable',
            icon: '⭐',
            description: '次の問題の経験値が1.5倍（1問のみ）',
            effect: { expBoostNext: 1.5 },
            rarity: 'rare',
            consumable: true,
            usableInBattle: true
        },
        'combo_shield': {
            name: 'コンボシールド',
            type: 'consumable',
            icon: '🛡️',
            description: '1回不正解でもコンボが途切れない',
            effect: { comboProtect: 1 },
            rarity: 'epic',
            consumable: true,
            usableInBattle: true
        },
        'attack_up': {
            name: '攻撃力アップ',
            type: 'consumable',
            icon: '⚔️',
            description: '次の攻撃のダメージが2倍（1問のみ）',
            effect: { damageBoostNext: 2.0 },
            rarity: 'rare',
            consumable: true,
            usableInBattle: true
        }
    },

    /**
     * インベントリを取得
     */
    getInventory: function(player) {
        return player.inventory || [];
    },

    /**
     * アイテムを追加
     */
    addItem: function(player, itemId) {
        if (!player.inventory) {
            player.inventory = [];
        }

        player.inventory.push({
            id: itemId,
            acquiredAt: new Date().toISOString()
        });

        PlayerManager.updatePlayer(player);
        SoundSystem.playSound('coin');

        // 通知を表示
        this.showItemNotification(itemId);

        return true;
    },

    /**
     * アイテムを使用
     */
    useItem: function(player, itemId, index) {
        const item = this.items[itemId];
        if (!item) return false;

        // 消費アイテムでない場合は装備
        if (!item.consumable) {
            return this.equipItem(player, itemId, index);
        }

        // 効果を適用
        if (item.effect.exp) {
            player.exp += item.effect.exp;
            MathMagic.showMessage(`経験値を${item.effect.exp}獲得した！`, 'success');
        }

        if (item.effect.freeHint) {
            if (!player.freeHints) player.freeHints = 0;
            player.freeHints += item.effect.freeHint;
            MathMagic.showMessage('ヒント無料チケットを獲得！', 'success');
        }

        // アイテムを削除
        player.inventory.splice(index, 1);
        PlayerManager.updatePlayer(player);
        SoundSystem.playSound('correct');

        return true;
    },

    /**
     * アイテムを装備
     */
    equipItem: function(player, itemId, inventoryIndex) {
        const item = this.items[itemId];
        if (!item || item.consumable) return false;

        if (!player.equipment) {
            player.equipment = {};
        }

        // 同じタイプのアイテムが装備されていれば外す
        const oldItem = player.equipment[item.type];
        if (oldItem) {
            player.inventory.push({
                id: oldItem,
                acquiredAt: new Date().toISOString()
            });
        }

        // 新しいアイテムを装備
        player.equipment[item.type] = itemId;

        // インベントリから削除
        player.inventory.splice(inventoryIndex, 1);

        PlayerManager.updatePlayer(player);
        SoundSystem.playSound('open');
        MathMagic.showMessage(`${item.name}を装備した！`, 'success');

        return true;
    },

    /**
     * アイテムを装備解除
     */
    unequipItem: function(player, itemType) {
        if (!player.equipment || !player.equipment[itemType]) {
            return false;
        }

        const itemId = player.equipment[itemType];
        delete player.equipment[itemType];

        // インベントリに戻す
        if (!player.inventory) player.inventory = [];
        player.inventory.push({
            id: itemId,
            acquiredAt: new Date().toISOString()
        });

        PlayerManager.updatePlayer(player);
        SoundSystem.playSound('close');

        return true;
    },

    /**
     * 装備効果を計算
     */
    getEquipmentBonus: function(player) {
        const bonus = {
            expBonus: 0,
            timeBonus: 0,
            hintDiscount: 0,
            accuracyBonus: 0
        };

        if (!player.equipment) return bonus;

        Object.values(player.equipment).forEach(itemId => {
            const item = this.items[itemId];
            if (item && item.effect) {
                if (item.effect.expBonus) bonus.expBonus += item.effect.expBonus;
                if (item.effect.timeBonus) bonus.timeBonus += item.effect.timeBonus;
                if (item.effect.hintDiscount) bonus.hintDiscount += item.effect.hintDiscount;
                if (item.effect.accuracyBonus) bonus.accuracyBonus += item.effect.accuracyBonus;
            }
        });

        return bonus;
    },

    /**
     * アイテム獲得通知
     */
    showItemNotification: function(itemId) {
        const item = this.items[itemId];
        if (!item) return;

        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 z-50 animate-fade-in';
        notification.innerHTML = `
            <div class="dq-window p-4 max-w-sm">
                <div class="flex items-center space-x-3">
                    <div class="text-4xl">${item.icon}</div>
                    <div>
                        <div class="dq-gold-text text-sm">アイテム獲得！</div>
                        <div class="text-white font-bold">${item.name}</div>
                        <div class="text-blue-200 text-xs">${item.description}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    },

    /**
     * レアリティの色を取得
     */
    getRarityColor: function(rarity) {
        const colors = {
            'common': 'text-gray-400',
            'rare': 'text-blue-400',
            'epic': 'text-purple-400',
            'legendary': 'text-yellow-400'
        };
        return colors[rarity] || colors.common;
    },

    /**
     * レアリティの日本語名を取得
     */
    getRarityName: function(rarity) {
        const names = {
            'common': 'コモン',
            'rare': 'レア',
            'epic': 'エピック',
            'legendary': 'レジェンダリー'
        };
        return names[rarity] || names.common;
    }
};

// グローバルに公開
window.InventorySystem = InventorySystem;

console.log('✅ inventory-system.js ロード完了');
