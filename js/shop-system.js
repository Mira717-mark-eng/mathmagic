/**
 * マスマジ！- ショップシステム
 * アイテム購入機能
 */

const ShopSystem = {
    /**
     * 商品ラインナップ
     */
    shopItems: [
        { itemId: 'hp_potion_small', price: 50, stock: -1 }, // -1 = 無限
        { itemId: 'hp_potion_medium', price: 150, stock: -1 },
        { itemId: 'hp_potion_large', price: 300, stock: -1 },
        { itemId: 'hint_potion', price: 100, stock: -1 },
        { itemId: 'exp_booster', price: 200, stock: -1 },
        { itemId: 'combo_shield', price: 500, stock: -1 },
        { itemId: 'attack_up', price: 250, stock: -1 },
        { itemId: 'wisdom_scroll', price: 80, stock: -1 },
        { itemId: 'exp_potion', price: 120, stock: -1 },
        { itemId: 'power_ring', price: 800, stock: 1 },
        { itemId: 'lightning_ring', price: 1200, stock: 1 },
        { itemId: 'speed_boots', price: 1000, stock: 1 }
    ],

    /**
     * ゴールドを取得
     */
    getGold: function(player) {
        return player.gold || 0;
    },

    /**
     * ゴールドを追加
     */
    addGold: function(player, amount) {
        if (!player.gold) player.gold = 0;
        player.gold += amount;
        PlayerManager.updatePlayer(player);
    },

    /**
     * アイテムを購入
     */
    buyItem: function(player, itemId, price) {
        const gold = this.getGold(player);

        if (gold < price) {
            MathMagic.showMessage('ゴールドが足りません！', 'error');
            SoundSystem.playSound('wrong');
            return false;
        }

        // ゴールドを消費
        player.gold -= price;

        // アイテムを追加
        InventorySystem.addItem(player, itemId);

        PlayerManager.updatePlayer(player);

        const item = InventorySystem.items[itemId];
        MathMagic.showMessage(`${item.name}を購入しました！`, 'success');
        SoundSystem.playSound('coin');

        return true;
    }
};

// ページロード時の処理
document.addEventListener('DOMContentLoaded', function() {
    const player = MathMagic.getCurrentPlayer();

    if (!player) {
        alert('プレイヤーデータが見つかりません');
        window.location.href = 'index.html';
        return;
    }

    // ゴールド表示
    displayGold(player);

    // ショップアイテムを表示
    displayShopItems(player);

    // 戻るボタン
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'world-map.html';
    });
});

function displayGold(player) {
    const gold = ShopSystem.getGold(player);
    const goldElement = document.getElementById('player-gold');
    if (goldElement) {
        goldElement.textContent = gold.toLocaleString();
    }
}

function displayShopItems(player) {
    const container = document.getElementById('shop-items');
    container.innerHTML = '';

    ShopSystem.shopItems.forEach(shopItem => {
        const item = InventorySystem.items[shopItem.itemId];
        if (!item) return;

        const card = document.createElement('div');
        const rarityColor = InventorySystem.getRarityColor(item.rarity);
        const canAfford = ShopSystem.getGold(player) >= shopItem.price;

        card.className = 'bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition border-2 border-gray-200';
        card.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-3">${item.icon}</div>
                <h3 class="font-bold text-lg text-gray-800 mb-1">${item.name}</h3>
                <div class="text-xs ${rarityColor} font-bold mb-2">${InventorySystem.getRarityName(item.rarity)}</div>
                <p class="text-sm text-gray-600 mb-4">${item.description}</p>

                <div class="bg-yellow-100 rounded-lg py-2 px-4 mb-4 border-2 border-yellow-300">
                    <div class="flex items-center justify-center space-x-2">
                        <i class="fas fa-coins text-yellow-600"></i>
                        <span class="font-bold text-xl text-gray-800">${shopItem.price.toLocaleString()} G</span>
                    </div>
                </div>

                ${shopItem.stock > 0 ? `<div class="text-xs text-gray-500 mb-2">残り ${shopItem.stock}個</div>` : ''}

                <button class="buy-btn ${canAfford ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold py-3 px-6 rounded-full transition w-full" data-item-id="${shopItem.itemId}" data-price="${shopItem.price}" ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? '購入する' : 'ゴールド不足'}
                </button>
            </div>
        `;

        if (canAfford) {
            const buyBtn = card.querySelector('.buy-btn');
            buyBtn.addEventListener('click', () => {
                if (confirm(`${item.name}を${shopItem.price}Gで購入しますか？`)) {
                    if (ShopSystem.buyItem(player, shopItem.itemId, shopItem.price)) {
                        displayGold(player);
                        displayShopItems(player); // 再描画
                    }
                }
            });
        }

        container.appendChild(card);
    });
}

// グローバルに公開
window.ShopSystem = ShopSystem;

console.log('✅ shop-system.js ロード完了');
