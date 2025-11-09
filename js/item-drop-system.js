/**
 * マスマジ！- アイテムドロップシステム
 * モンスター撃破時のアイテムドロップ
 */

const ItemDropSystem = {
    /**
     * ドロップテーブル（レアリティごとのドロップ率）
     */
    dropRates: {
        common: 0.5,      // 50%
        rare: 0.25,       // 25%
        epic: 0.15,       // 15%
        legendary: 0.05   // 5%
    },

    /**
     * レアリティごとのアイテムリスト
     */
    itemsByRarity: {
        common: [
            'hp_potion_small',
            'hint_potion',
            'wisdom_scroll',
            'exp_potion'
        ],
        rare: [
            'hp_potion_medium',
            'exp_booster',
            'attack_up',
            'power_ring',
            'speed_boots'
        ],
        epic: [
            'hp_potion_large',
            'combo_shield',
            'lightning_ring',
            'sage_staff',
            'perfect_gem'
        ],
        legendary: [
            'hero_sword',
            'hero_crown'
        ]
    },

    /**
     * アイテムをドロップ
     */
    dropItem: function(player) {
        // ドロップ判定（70%の確率でドロップ）
        if (Math.random() > 0.7) {
            console.log('💨 アイテムドロップなし');
            return null;
        }

        // レアリティを決定
        const rarity = this.decideRarity();
        console.log(`🎲 レアリティ決定: ${rarity}`);

        // レアリティに応じたアイテムをランダム選択
        const items = this.itemsByRarity[rarity];
        const itemId = items[Math.floor(Math.random() * items.length)];

        // アイテムを付与
        InventorySystem.addItem(player, itemId);

        console.log(`✨ アイテムドロップ: ${itemId} (${rarity})`);

        return {
            itemId: itemId,
            rarity: rarity
        };
    },

    /**
     * レアリティを決定
     */
    decideRarity: function() {
        const rand = Math.random();
        let cumulative = 0;

        // レア度の低い順にチェック（legendary → epic → rare → common）
        const rarities = ['legendary', 'epic', 'rare', 'common'];

        for (const rarity of rarities) {
            cumulative += this.dropRates[rarity];
            if (rand < cumulative) {
                return rarity;
            }
        }

        return 'common'; // フォールバック
    },

    /**
     * ドロップアニメーションを表示
     */
    showDropAnimation: function(itemId, rarity) {
        const item = InventorySystem.items[itemId];
        if (!item) return;

        const dropNotification = document.createElement('div');
        dropNotification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in';

        const rarityColor = InventorySystem.getRarityColor(rarity);
        const rarityBg = {
            'common': 'from-gray-400 to-gray-600',
            'rare': 'from-blue-400 to-blue-600',
            'epic': 'from-purple-400 to-purple-600',
            'legendary': 'from-yellow-400 to-yellow-600'
        }[rarity];

        dropNotification.innerHTML = `
            <div class="bg-gradient-to-br ${rarityBg} rounded-2xl p-8 shadow-2xl border-4 border-white transform scale-0 animate-scale-in">
                <div class="text-center">
                    <div class="text-8xl mb-4 animate-bounce">${item.icon}</div>
                    <div class="text-white font-bold text-2xl mb-2">アイテムゲット！</div>
                    <div class="text-white text-xl mb-1">${item.name}</div>
                    <div class="${rarityColor} text-sm font-bold">${InventorySystem.getRarityName(rarity)}</div>
                </div>
            </div>
        `;

        document.body.appendChild(dropNotification);

        // キラキラエフェクト
        this.createSparkles(dropNotification);

        // 3秒後に削除
        setTimeout(() => {
            dropNotification.style.opacity = '0';
            dropNotification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => dropNotification.remove(), 500);
        }, 3000);
    },

    /**
     * キラキラエフェクトを生成
     */
    createSparkles: function(container) {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = '✨';
                sparkle.style.position = 'fixed';
                sparkle.style.left = `calc(50% + ${(Math.random() - 0.5) * 300}px)`;
                sparkle.style.top = `calc(50% + ${(Math.random() - 0.5) * 300}px)`;
                sparkle.style.fontSize = '2rem';
                sparkle.style.zIndex = '49';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.animation = 'sparkle-rise 2s ease-out forwards';

                document.body.appendChild(sparkle);

                setTimeout(() => {
                    sparkle.remove();
                }, 2000);
            }, i * 50);
        }
    }
};

// CSS アニメーション追加
const style = document.createElement('style');
style.textContent = `
@keyframes scale-in {
    from {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
    }
    to {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

@keyframes sparkle-rise {
    from {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    to {
        transform: translateY(-100px) scale(0);
        opacity: 0;
    }
}

.animate-scale-in {
    animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
`;
document.head.appendChild(style);

// グローバルに公開
window.ItemDropSystem = ItemDropSystem;

console.log('✅ item-drop-system.js ロード完了');
