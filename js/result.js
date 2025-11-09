/**
 * マスマジ！- 結果処理
 * result.html用のJavaScript
 */

let lastResult = null;
let player = null;

/**
 * 結果を表示
 */
function displayResult() {
    console.log('==================');
    console.log('📊 結果画面を表示開始');
    console.log('==================');

    lastResult = MathMagic.getItem('lastResult');
    console.log('lastResultデータ:', lastResult);

    if (!lastResult) {
        console.error('==================');
        console.error('❌ 結果データが見つかりません！');
        console.error('==================');
        alert('結果データが見つかりません。\nワールドマップに戻ります。');
        window.location.href = 'world-map.html';
        return;
    }

    player = MathMagic.getCurrentPlayer();
    console.log('プレイヤーデータ:', player);

    if (!player) {
        console.error('==================');
        console.error('❌ プレイヤーデータが見つかりません！');
        console.error('==================');
        alert('プレイヤーデータが見つかりません。\nトップ画面に戻ります。');
        window.location.href = 'index.html';
        return;
    }

    console.log('正解:', lastResult.isCorrect);
    console.log('獲得XP:', lastResult.xpGained);

    // 正解・不正解の表示を切り替え
    if (lastResult.isCorrect) {
        console.log('✅ 正解の表示を行います');
        showCorrectResult();
    } else {
        console.log('❌ 不正解の表示を行います');
        showIncorrectResult();
    }

    // 統計情報を更新
    console.log('📈 統計情報を更新します');
    updateStatistics();

    // ナビゲーションボタンを設定
    console.log('🔘 ナビゲーションボタンを設定します');
    setupNavigation();

    console.log('==================');
    console.log('✅ 結果画面の表示完了');
    console.log('==================');
}

/**
 * 正解時の表示
 */
function showCorrectResult() {
    console.log('🎉 正解結果を表示');

    const correctResult = document.getElementById('correct-result');
    const incorrectResult = document.getElementById('incorrect-result');

    if (!correctResult || !incorrectResult) {
        console.error('⚠️ 結果表示要素が見つかりません');
        return;
    }

    correctResult.classList.remove('hidden');
    incorrectResult.classList.add('hidden');

    // 経験値を表示
    const expGainedElement = document.getElementById('exp-gained');
    if (expGainedElement) {
        expGainedElement.textContent = lastResult.xpGained;
        console.log('💫 獲得XP表示:', lastResult.xpGained);
    }

    // 経験値を追加
    console.log('📈 経験値を追加します');
    addExperience(lastResult.xpGained);

    // ゴールドを追加（経験値の10%）
    if (window.ShopSystem) {
        const goldGained = Math.floor(lastResult.xpGained * 0.1);
        ShopSystem.addGold(player, goldGained);
        console.log(`💰 ゴールド獲得: ${goldGained}G`);
    }

    // アイテムドロップ判定
    if (window.ItemDropSystem && lastResult.monsterDefeated) {
        console.log('🎁 アイテムドロップ判定を実行');
        setTimeout(() => {
            const droppedItem = ItemDropSystem.dropItem(player);
            if (droppedItem) {
                ItemDropSystem.showDropAnimation(droppedItem.itemId, droppedItem.rarity);
            }
        }, 1000); // 1秒後にドロップアニメーション
    }

    // AI解説を表示（正解時のみ）
    if (lastResult.problem) {
        console.log('📝 解説を表示します');
        displayExplanation();
    }
}

/**
 * 不正解時の表示
 */
function showIncorrectResult() {
    document.getElementById('correct-result').classList.add('hidden');
    document.getElementById('incorrect-result').classList.remove('hidden');
    
    // 正しい答えを表示
    document.getElementById('correct-answer').textContent = lastResult.correctAnswer;
    document.getElementById('correct-unit').textContent = lastResult.problem.unit;
}

/**
 * 経験値を追加
 */
function addExperience(xp) {
    const oldLevel = player.level;
    const oldExp = player.exp;
    
    // 経験値を加算
    player.exp += xp;
    
    // レベルアップチェック
    const expForNextLevel = MathMagic.getExpForLevel(player.level + 1);
    
    if (player.exp >= expForNextLevel) {
        player.level++;
        player.exp -= expForNextLevel;
        
        // レベルアップ演出
        showLevelUpAnimation(oldLevel, player.level);
    }
    
    // プレイヤーデータを更新
    PlayerManager.updatePlayer(player);
}

/**
 * レベルアップ演出
 */
function showLevelUpAnimation(oldLevel, newLevel) {
    const levelupDisplay = document.getElementById('levelup-display');
    
    document.getElementById('old-level').textContent = oldLevel;
    document.getElementById('new-level').textContent = newLevel;
    
    levelupDisplay.classList.remove('hidden');
    
    // 効果音（将来実装）
    // playSound('levelup');
}

/**
 * 統計情報を更新
 */
function updateStatistics() {
    // プレイヤーの統計を更新
    PlayerManager.recordAnswer(lastResult.isCorrect);
    
    // 表示を更新
    player = MathMagic.getCurrentPlayer();
    
    document.getElementById('current-level').textContent = `Lv.${player.level}`;
    
    // 正答率を計算
    const accuracyRate = player.totalProblems > 0 
        ? Math.round((player.correctProblems / player.totalProblems) * 100)
        : 0;
    document.getElementById('accuracy-rate').textContent = accuracyRate;
    
    // 解いた問題数
    document.getElementById('total-problems').textContent = player.totalProblems;
    
    // 所要時間
    const minutes = Math.floor(lastResult.elapsedTime / 60);
    const seconds = lastResult.elapsedTime % 60;
    document.getElementById('elapsed-time').textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * ナビゲーションを設定
 */
function setupNavigation() {
    const currentIndex = lastResult.currentIndex;
    const totalProblems = lastResult.totalProblems;
    const isLastProblem = (currentIndex + 1) >= totalProblems;
    
    // ボタンの表示を切り替え
    if (isLastProblem) {
        // 最後の問題
        document.getElementById('next-problem-btn').classList.add('hidden');
        document.getElementById('finish-btn').classList.remove('hidden');
    } else {
        // まだ問題が残っている
        document.getElementById('next-problem-btn').classList.remove('hidden');
        document.getElementById('finish-btn').classList.add('hidden');
    }
}

/**
 * 次の問題へ
 */
function goToNextProblem() {
    // 結果データをクリア
    MathMagic.removeItem('lastResult');
    
    // 次の問題へ
    window.location.href = 'quest.html';
}

/**
 * クエスト完了
 */
function finishQuest() {
    // 結果データをクリア
    MathMagic.removeItem('lastResult');
    MathMagic.removeItem('questSession');
    
    // 完了メッセージ
    MathMagic.showMessage('クエスト完了！おめでとう！🎉', 'success');
    
    // ワールドマップに戻る
    setTimeout(() => {
        window.location.href = 'world-map.html';
    }, 1500);
}

/**
 * ワールドマップに戻る
 */
function backToMap() {
    if (confirm('本当にワールドマップに戻りますか？\n進行状況は保存されます。')) {
        // 結果データをクリア
        MathMagic.removeItem('lastResult');
        
        window.location.href = 'world-map.html';
    }
}

/**
 * AI生成の解説を表示
 */
async function displayExplanation() {
    const explanationContainer = document.getElementById('explanation-container');
    
    if (!explanationContainer) {
        console.warn('解説表示エリアが見つかりません');
        return;
    }
    
    // ローディング表示
    explanationContainer.innerHTML = `
        <div class="flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            <span class="ml-3 text-purple-700">解説を作成中...</span>
        </div>
    `;
    
    try {
        const explanation = await generateExplanation(
            lastResult.problem.question,
            lastResult.problem.answer,
            lastResult.problem.unit || ''
        );
        
        // 解説を表示
        explanationContainer.innerHTML = `
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-blue-200">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                        💡
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-blue-900 mb-2">解説</h3>
                        <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">${explanation}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('解説生成エラー:', error);
        
        // フォールバック: シンプルな解説
        const simpleExplanation = generateSimpleExplanation();
        
        explanationContainer.innerHTML = `
            <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                        ✓
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-green-900 mb-2">解説</h3>
                        <p class="text-gray-800 leading-relaxed">${simpleExplanation}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * AIに解説を生成させる
 */
async function generateExplanation(question, answer, unit) {
    try {
        const response = await fetch('/api/generate-explanation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                answer: answer,
                unit: unit
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.explanation;
    } catch (error) {
        console.error('AI解説生成エラー:', error);
        throw error;
    }
}

/**
 * シンプルな解説を生成（フォールバック）
 */
function generateSimpleExplanation() {
    if (!lastResult.problem) {
        return '正解です！よくできました！';
    }
    
    const { question, answer, unit } = lastResult.problem;
    
    return `問題: ${question}\n\n答え: ${answer}${unit}\n\nよくできました！この調子で頑張りましょう！`;
}

/**
 * 初期化
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('==================');
    console.log('🎬 result.js初期化開始');
    console.log('==================');

    try {
        // 結果を表示
        displayResult();

        // イベントリスナー
        const nextBtn = document.getElementById('next-problem-btn');
        const finishBtn = document.getElementById('finish-btn');
        const backBtn = document.getElementById('back-to-map-btn');

        if (nextBtn) {
            nextBtn.addEventListener('click', goToNextProblem);
            console.log('✓ 次の問題ボタン: イベントリスナー設定完了');
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', finishQuest);
            console.log('✓ 完了ボタン: イベントリスナー設定完了');
        }

        if (backBtn) {
            backBtn.addEventListener('click', backToMap);
            console.log('✓ 戻るボタン: イベントリスナー設定完了');
        } else {
            console.warn('⚠️ 戻るボタンが見つかりません');
        }

        console.log('==================');
        console.log('✅ result.js初期化完了');
        console.log('==================');

    } catch (error) {
        console.error('==================');
        console.error('❌ result.js初期化エラー');
        console.error('エラー内容:', error);
        console.error('エラーメッセージ:', error.message);
        console.error('スタックトレース:', error.stack);
        console.error('==================');

        alert(`エラーが発生しました:\n${error.message}\n\nワールドマップに戻ります。`);
        window.location.href = 'world-map.html';
    }
});
