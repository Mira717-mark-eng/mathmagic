/**
 * マスマジ！- Service Worker
 * PWA対応のためのService Worker
 */

const CACHE_NAME = 'mathmagic-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/player-create.html',
    '/world-map.html',
    '/quest.html',
    '/result.html',
    '/parent-dashboard.html',
    '/css/style.css',
    '/js/main.js',
    '/js/player.js',
    '/js/world-map.js',
    '/js/quest.js',
    '/js/result.js',
    '/js/worlds.js',
    '/js/figure-drawer.js',
    '/js/hint-system.js',
    '/js/parent-stats.js',
    '/manifest.json'
];

/**
 * Service Workerインストール時
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] インストール中...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] キャッシュを開きました');
                // キャッシュ失敗を許容（CDNリソースはキャッシュしない）
                return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                    console.warn('[Service Worker] 一部のリソースのキャッシュに失敗しました', err);
                });
            })
            .then(() => {
                console.log('[Service Worker] インストール完了');
                return self.skipWaiting();
            })
    );
});

/**
 * Service Workerアクティベーション時
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] アクティベーション中...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] 古いキャッシュを削除:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] アクティベーション完了');
                return self.clients.claim();
            })
    );
});

/**
 * リクエスト処理
 * Network First戦略（API呼び出し）とCache First戦略（静的リソース）
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // API呼び出しの場合はNetwork First
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/functions/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // APIレスポンスはキャッシュしない
                    return response;
                })
                .catch(error => {
                    console.error('[Service Worker] API呼び出し失敗:', error);
                    // オフライン時のエラーレスポンス
                    return new Response(
                        JSON.stringify({ 
                            error: 'オフラインです。インターネット接続を確認してください。',
                            offline: true 
                        }),
                        {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                })
        );
        return;
    }
    
    // CDNリソースの場合はNetwork First
    if (url.origin !== location.origin) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    console.warn('[Service Worker] CDNリソースの取得に失敗しました:', url.href);
                    return caches.match(request);
                })
        );
        return;
    }
    
    // 静的リソースの場合はCache First
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[Service Worker] キャッシュから返却:', request.url);
                    return cachedResponse;
                }
                
                return fetch(request)
                    .then((response) => {
                        // レスポンスが有効な場合のみキャッシュ
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.error('[Service Worker] ネットワークエラー:', error);
                        
                        // HTMLページのリクエストの場合はindex.htmlを返す
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        return new Response('オフラインです', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

/**
 * メッセージ受信
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Service Worker] ロード完了');
