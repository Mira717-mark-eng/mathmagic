/**
 * Service Worker を無効化（開発用）
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('✅ Service Worker をアンインストールしました');
        }
    });
}

// すべてのキャッシュを削除
if ('caches' in window) {
    caches.keys().then(function(names) {
        for (let name of names) {
            caches.delete(name);
            console.log('✅ キャッシュを削除しました:', name);
        }
    });
}

console.log('🔧 開発モード: Service Worker とキャッシュを無効化しました');
console.log('💡 本番環境では disable-sw.js の読み込みを削除してください');
