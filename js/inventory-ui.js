/**
 * マスマジ！- インベントリUI
 * inventory.html用のJavaScript
 */

let currentPlayer = null;
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    currentPlayer = MathMagic.getCurrentPlayer();

    if (!currentPlayer) {
        alert('プレイヤーデータが見つかりません');
        window.location.href = 'index.html';
        return;
    }

    // プレイヤー情報を表示
    displayPlayerInfo();

    // 装備中アイテムを表示
    displayEquippedItems();

    // アイテムリストを表示
    displayItems(currentTab);

    // タブ切り替え
    setupTabs();

    // 戻るボタン
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'world-map.html';
    });
}

function displayPlayerInfo() {
    document.getElementById('player-character').textContent = currentPlayer.character || '🧙';
    document.getElementById('player-name').textContent = currentPlayer.name;
    document.getElementById('player-grade').textContent = currentPlayer.grade;
    document.getElementById('player-level').textContent = currentPlayer.level || 1;

    const totalItems = currentPlayer.inventory ? currentPlayer.inventory.length : 0;
    document.getElementById('total-items').textContent = totalItems;
}

function displayEquippedItems() {
    const equippedContainer = document.getElementById('equipped-items');
    equippedContainer.innerHTML = '';

    const equipment = currentPlayer.equipment || {};
    const types = ['weapon', 'armor', 'accessory'];

    types.forEach(type => {
        const itemId = equipment[type];
        const item = itemId ? InventorySystem.items[itemId] : null;

        const slot = document.createElement('div');
        slot.className = 'border-2 border-dashed border-gray-300 rounded-xl p-4 text-center';

        if (item) {
            const rarityColor = InventorySystem.getRarityColor(item.rarity);
            slot.className = 'border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-lg';
            slot.innerHTML = `
                <div class="text-5xl mb-2">${item.icon}</div>
                <div class="font-bold text-gray-800">${item.name}</div>
                <div class="text-xs ${rarityColor} font-bold">${InventorySystem.getRarityName(item.rarity)}</div>
                <div class="text-xs text-gray-600 mt-2">${item.description}</div>
                <button class="unequip-btn mt-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition" data-type="${type}">
                    外す
                </button>
            `;

            const unequipBtn = slot.querySelector('.unequip-btn');
            unequipBtn.addEventListener('click', () => unequipItem(type));
        } else {
            const typeName = { weapon: '武器', armor: '防具', accessory: 'アクセサリー' }[type];
            slot.innerHTML = `
                <div class="text-4xl mb-2 text-gray-300">
                    ${type === 'weapon' ? '⚔️' : type === 'armor' ? '🛡️' : '💍'}
                </div>
                <div class="text-gray-400 text-sm">${typeName}</div>
                <div class="text-gray-300 text-xs">未装備</div>
            `;
        }

        equippedContainer.appendChild(slot);
    });
}

function displayItems(filter) {
    const itemList = document.getElementById('item-list');
    const noItems = document.getElementById('no-items');
    itemList.innerHTML = '';

    const inventory = currentPlayer.inventory || [];

    // フィルタリング
    let items = inventory.map((invItem, index) => {
        const item = InventorySystem.items[invItem.id];
        return item ? { ...item, itemId: invItem.id, index: index } : null;
    }).filter(item => item !== null);

    if (filter === 'equipment') {
        items = items.filter(item => !item.consumable);
    } else if (filter === 'consumables') {
        items = items.filter(item => item.consumable);
    }

    if (items.length === 0) {
        noItems.classList.remove('hidden');
        return;
    }

    noItems.classList.add('hidden');

    items.forEach(item => {
        const card = createItemCard(item);
        itemList.appendChild(card);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    const rarityColor = InventorySystem.getRarityColor(item.rarity);

    card.className = 'bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition border-2 border-gray-200';
    card.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="text-5xl">${item.icon}</div>
            <div class="flex-1">
                <div class="font-bold text-gray-800">${item.name}</div>
                <div class="text-xs ${rarityColor} font-bold">${InventorySystem.getRarityName(item.rarity)}</div>
                <div class="text-xs text-gray-600 mt-1">${item.description}</div>
                <div class="mt-2 space-x-2">
                    ${item.consumable ?
                        `<button class="use-item-btn bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-full transition" data-index="${item.index}" data-id="${item.itemId}">使う</button>` :
                        `<button class="equip-item-btn bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition" data-index="${item.index}" data-id="${item.itemId}">装備する</button>`
                    }
                </div>
            </div>
        </div>
    `;

    // 使用/装備ボタン
    const useBtn = card.querySelector('.use-item-btn');
    const equipBtn = card.querySelector('.equip-item-btn');

    if (useBtn) {
        useBtn.addEventListener('click', () => useItem(item.itemId, item.index));
    }

    if (equipBtn) {
        equipBtn.addEventListener('click', () => equipItem(item.itemId, item.index));
    }

    return card;
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // アクティブクラスの切り替え
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-purple-500', 'text-white');
                t.classList.add('text-gray-600');
            });
            tab.classList.add('active', 'bg-purple-500', 'text-white');
            tab.classList.remove('text-gray-600');

            // タブ切り替え
            currentTab = tab.dataset.tab;
            displayItems(currentTab);

            // タイトル更新
            const titles = {
                equipment: '装備品',
                consumables: '消費アイテム',
                all: 'すべてのアイテム'
            };
            document.getElementById('tab-title').textContent = titles[currentTab];

            SoundSystem.playSound('click');
        });
    });
}

function useItem(itemId, index) {
    if (InventorySystem.useItem(currentPlayer, itemId, index)) {
        SoundSystem.playSound('correct');
        setTimeout(() => {
            displayPlayerInfo();
            displayItems(currentTab);
        }, 500);
    }
}

function equipItem(itemId, index) {
    if (InventorySystem.equipItem(currentPlayer, itemId, index)) {
        SoundSystem.playSound('open');
        setTimeout(() => {
            displayPlayerInfo();
            displayEquippedItems();
            displayItems(currentTab);
        }, 300);
    }
}

function unequipItem(type) {
    if (InventorySystem.unequipItem(currentPlayer, type)) {
        SoundSystem.playSound('close');
        setTimeout(() => {
            displayPlayerInfo();
            displayEquippedItems();
            displayItems(currentTab);
        }, 300);
    }
}

// CSSスタイルを追加
const style = document.createElement('style');
style.textContent = `
.tab-btn {
    background: transparent;
    color: #6b7280;
}

.tab-btn.active {
    background: linear-gradient(to right, #a855f7, #ec4899);
    color: white;
}

.tab-btn:hover:not(.active) {
    background: rgba(168, 85, 247, 0.1);
}
`;
document.head.appendChild(style);

console.log('✅ inventory-ui.js ロード完了');
