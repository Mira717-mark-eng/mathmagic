/**
 * マスマジ！- バックアップ・復元システム
 * LocalStorageデータのバックアップと復元
 */

const BackupSystem = {
    /**
     * すべてのデータをバックアップ
     */
    backupAllData: function() {
        try {
            // LocalStorageから全データを取得
            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                data: {}
            };

            // すべてのLocalStorageキーを取得
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);

                // JSONとして保存
                try {
                    backupData.data[key] = JSON.parse(value);
                } catch (e) {
                    // JSON以外の場合は文字列として保存
                    backupData.data[key] = value;
                }
            }

            // JSONファイルとしてダウンロード
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `mathmagic-backup-${this.getDateString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // プレイヤー数を取得
            const players = PlayerManager.getAllPlayers();

            MathMagic.showMessage(
                `バックアップが完了しました！（${players.length}人のプレイヤーデータ）`,
                'success'
            );

            console.log('✅ バックアップ完了:', backupData);

            return true;
        } catch (error) {
            console.error('❌ バックアップエラー:', error);
            MathMagic.showMessage('バックアップに失敗しました', 'error');
            return false;
        }
    },

    /**
     * バックアップから復元
     */
    restoreFromBackup: function(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);

                // バージョンチェック
                if (!backupData.version) {
                    throw new Error('無効なバックアップファイルです');
                }

                // 確認ダイアログ
                const confirmed = confirm(
                    `バックアップファイルから復元しますか？\n\n` +
                    `バックアップ日時: ${new Date(backupData.timestamp).toLocaleString('ja-JP')}\n` +
                    `現在のデータは上書きされます。\n\n` +
                    `よろしいですか？`
                );

                if (!confirmed) {
                    MathMagic.showMessage('復元をキャンセルしました', 'info');
                    return;
                }

                // データを復元
                let restoredCount = 0;
                for (const key in backupData.data) {
                    const value = backupData.data[key];
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                    restoredCount++;
                }

                console.log('✅ 復元完了:', restoredCount + '件のデータを復元');

                MathMagic.showMessage(
                    `復元が完了しました！（${restoredCount}件のデータ）\n\nページを再読み込みします...`,
                    'success'
                );

                // ページをリロード
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (error) {
                console.error('❌ 復元エラー:', error);
                MathMagic.showMessage(
                    `復元に失敗しました\n${error.message}`,
                    'error'
                );
            }
        };

        reader.onerror = () => {
            console.error('❌ ファイル読み込みエラー');
            MathMagic.showMessage('ファイルの読み込みに失敗しました', 'error');
        };

        reader.readAsText(file);
    },

    /**
     * 日付文字列を取得
     */
    getDateString: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}${month}${day}-${hours}${minutes}`;
    },

    /**
     * テスト用アイテムを全プレイヤーに付与
     */
    giveTestItems: function() {
        try {
            const players = PlayerManager.getAllPlayers();

            if (players.length === 0) {
                MathMagic.showMessage('プレイヤーが存在しません', 'error');
                return;
            }

            // 付与するアイテムリスト
            const testItems = [
                'hp_potion_small',
                'hp_potion_medium',
                'hp_potion_large',
                'hint_potion',
                'exp_booster',
                'combo_shield',
                'attack_up',
                'wisdom_scroll',
                'exp_potion'
            ];

            let totalGiven = 0;

            players.forEach(player => {
                if (!player.inventory) {
                    player.inventory = [];
                }

                // 各アイテムを3個ずつ付与
                testItems.forEach(itemId => {
                    for (let i = 0; i < 3; i++) {
                        player.inventory.push({
                            id: itemId,
                            acquiredAt: new Date().toISOString()
                        });
                        totalGiven++;
                    }
                });

                PlayerManager.updatePlayer(player);
            });

            MathMagic.showMessage(
                `${players.length}人のプレイヤーに${totalGiven}個のアイテムを付与しました！`,
                'success'
            );

            console.log(`✅ テスト用アイテム付与完了: ${totalGiven}個`);

            // ページをリロード
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('❌ アイテム付与エラー:', error);
            MathMagic.showMessage('アイテム付与に失敗しました', 'error');
        }
    },

    /**
     * 自動バックアップ（定期実行用）
     */
    autoBackup: function() {
        const lastBackup = localStorage.getItem('lastAutoBackup');
        const now = Date.now();

        // 最後のバックアップから7日以上経過していたら通知
        if (!lastBackup || (now - parseInt(lastBackup)) > 7 * 24 * 60 * 60 * 1000) {
            console.log('💡 7日以上バックアップされていません');

            // 通知を表示（保護者ダッシュボードでのみ）
            if (window.location.pathname.includes('parent-dashboard.html')) {
                const notification = document.createElement('div');
                notification.className = 'fixed top-20 right-4 z-50 animate-fade-in';
                notification.innerHTML = `
                    <div class="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 shadow-xl max-w-sm">
                        <div class="flex items-center space-x-3">
                            <div class="text-3xl">⚠️</div>
                            <div>
                                <div class="font-bold text-gray-800">バックアップ推奨</div>
                                <div class="text-sm text-gray-600">7日以上バックアップされていません</div>
                                <button id="auto-backup-btn" class="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded-full text-xs transition">
                                    今すぐバックアップ
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(notification);

                // バックアップボタン
                const autoBackupBtn = notification.querySelector('#auto-backup-btn');
                autoBackupBtn.addEventListener('click', () => {
                    BackupSystem.backupAllData();
                    localStorage.setItem('lastAutoBackup', Date.now().toString());
                    notification.remove();
                });

                // 10秒後に自動で消す
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => notification.remove(), 500);
                }, 10000);
            }
        }
    }
};

// ページロード時にイベントリスナーを設定
document.addEventListener('DOMContentLoaded', function() {
    // テスト用アイテム付与ボタン
    const giveItemsBtn = document.getElementById('give-items-btn');
    if (giveItemsBtn) {
        giveItemsBtn.addEventListener('click', () => {
            BackupSystem.giveTestItems();
        });
    }

    // バックアップボタン
    const backupBtn = document.getElementById('backup-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => {
            BackupSystem.backupAllData();
            localStorage.setItem('lastAutoBackup', Date.now().toString());
        });
    }

    // 復元ボタン
    const restoreBtn = document.getElementById('restore-btn');
    const restoreFileInput = document.getElementById('restore-file-input');

    if (restoreBtn && restoreFileInput) {
        restoreBtn.addEventListener('click', () => {
            restoreFileInput.click();
        });

        restoreFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                BackupSystem.restoreFromBackup(file);
            }
            // inputをリセット
            e.target.value = '';
        });
    }

    // 自動バックアップチェック
    BackupSystem.autoBackup();
});

// グローバルに公開
window.BackupSystem = BackupSystem;

console.log('✅ backup-system.js ロード完了');
