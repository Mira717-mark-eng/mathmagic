/**
 * マスマジ！- クエスト・問題管理（AI統合版）
 * quest.html用のJavaScript
 */

// グローバル変数
let currentProblemIndex = 0;
let startTime = null;
let timerInterval = null;
let questSession = null;
let currentProblem = null;
let attemptCount = 0; // 試行回数

/**
 * クエストセッションを初期化
 */
async function initQuestSession() {
    console.log('📋 クエストセッション初期化を開始');

    // questSessionから取得する方が確実
    const session = MathMagic.getItem('questSession');
    console.log('セッションデータ:', session);

    let worldId;
    if (session && session.worldId) {
        worldId = session.worldId;
        console.log('✓ セッションからワールドID取得:', worldId);
    } else {
        worldId = MathMagic.getItem('currentWorldId') || 'multiplication_forest';
        console.log('⚠️ フォールバック: currentWorldIdから取得:', worldId);
    }

    console.log('🔍 ワールドIDでワールドを検索中:', worldId);
    const world = getWorldById(worldId);
    console.log('検索結果:', world);

    // バトルシステムを初期化
    if (window.BattleSystem) {
        const difficulty = world ? world.difficulty : 1;
        BattleSystem.init(worldId, difficulty);
        console.log('⚔️ バトルシステム初期化完了');
    }

    if (!world) {
        console.error('==================');
        console.error('❌ ワールドが見つかりません！');
        console.error('検索したワールドID:', worldId);
        console.error('利用可能なワールドID一覧:', WORLD_DATABASE.map(w => w.id));
        console.error('==================');

        alert(`ワールドが見つかりません！\nワールドID: ${worldId}\n\nワールドマップに戻ります。`);
        window.location.href = 'world-map.html';
        return;
    }

    console.log('✓ ワールド見つかりました:', world.name);

    if (session && session.worldId === worldId) {
        // 既存セッションを継続
        console.log('📝 既存セッションを継続');
        questSession = session;
        currentProblemIndex = session.currentIndex || 0;

        if (session.startTime) {
            startTime = new Date(session.startTime);
        }
    } else {
        // 新しいセッション
        console.log('🆕 新しいセッションを作成');
        questSession = {
            worldId: worldId,
            worldName: world.name,
            startTime: new Date().toISOString(),
            currentIndex: 0,
            results: [],
            useAI: isAIGenerationEnabled(worldId)
        };
        startTime = new Date();
        MathMagic.setItem('questSession', questSession);
    }

    console.log('✓ クエストセッション初期化完了:', questSession);
}

/**
 * 現在の問題を取得（AI生成 or 固定問題）
 */
async function getCurrentProblem() {
    if (currentProblem) {
        return currentProblem;
    }
    
    // AI生成を無効化して、常に固定問題を使用（完全無料運用）
    console.log('💡 固定問題を使用します（AI生成は無効化されています）');
    return getFallbackProblem();
}

/**
 * 難易度を決定
 */
function determineDifficulty(player) {
    const accuracy = player.totalProblems > 0 
        ? player.correctProblems / player.totalProblems 
        : 0.5;
    
    if (accuracy >= 0.8) return 'hard';
    if (accuracy >= 0.5) return 'normal';
    return 'easy';
}

/**
 * フォールバック問題（AI失敗時）
 */
function getFallbackProblem() {
    console.log('⚠️ フォールバック問題を使用します（問題番号:', currentProblemIndex, ')');

    // 基本的な掛け算の固定問題（学年・ワールドに関わらず使用可能）
    const FALLBACK_PROBLEMS = [
        {
            id: 1,
            story: "森の魔法使いが言った：「3匹のドラゴンがいて、それぞれ4つの宝石を持っている。全部で何個の宝石があるかな？」",
            question: "3 × 4 = ?",
            answer: 12,
            unit: "個",
            difficulty: "easy",
            xp: 50,
            hints: [
                "掛け算は「いくつ分」を求める計算だよ",
                "3が4回あるから、3 + 3 + 3 + 3 と同じだよ",
                "3 × 4 = 12 だよ！"
            ]
        },
        {
            id: 2,
            story: "勇者が宝箱を見つけた：「1つの宝箱に5枚の金貨が入っている。3つの宝箱があったら、金貨は全部で何枚？」",
            question: "5 × 3 = ?",
            answer: 15,
            unit: "枚",
            difficulty: "easy",
            xp: 50,
            hints: [
                "5枚が3つ分だね",
                "5 + 5 + 5 と同じだよ",
                "5 × 3 = 15 だよ！"
            ]
        },
        {
            id: 3,
            story: "魔女が薬草を集めている：「1日に2本の薬草を集める。4日間で何本集められる？」",
            question: "2 × 4 = ?",
            answer: 8,
            unit: "本",
            difficulty: "easy",
            xp: 50,
            hints: [
                "2本ずつ4日分だね",
                "2 + 2 + 2 + 2 と同じだよ",
                "2 × 4 = 8 だよ！"
            ]
        },
        {
            id: 4,
            story: "騎士が盾を磨いている：「1時間に3枚の盾を磨ける。5時間で何枚磨ける？」",
            question: "3 × 5 = ?",
            answer: 15,
            unit: "枚",
            difficulty: "easy",
            xp: 50,
            hints: [
                "3枚ずつ5時間分だね",
                "3 + 3 + 3 + 3 + 3 と同じだよ",
                "3 × 5 = 15 だよ！"
            ]
        },
        {
            id: 5,
            story: "妖精が花を植えている：「1列に4本ずつ花を植える。6列あったら何本？」",
            question: "4 × 6 = ?",
            answer: 24,
            unit: "本",
            difficulty: "normal",
            xp: 60,
            hints: [
                "4本が6列分だね",
                "4を6回足すと同じだよ",
                "4 × 6 = 24 だよ！"
            ]
        },
        {
            id: 6,
            story: "商人が商品を並べている：「1つの棚に7個ずつ商品を置く。3つの棚があったら何個？」",
            question: "7 × 3 = ?",
            answer: 21,
            unit: "個",
            difficulty: "normal",
            xp: 60,
            hints: [
                "7個が3棚分だね",
                "7 + 7 + 7 と同じだよ",
                "7 × 3 = 21 だよ！"
            ]
        },
        {
            id: 7,
            story: "狩人が矢を作っている：「1日に6本の矢を作る。5日間で何本作れる？」",
            question: "6 × 5 = ?",
            answer: 30,
            unit: "本",
            difficulty: "normal",
            xp: 60,
            hints: [
                "6本ずつ5日分だね",
                "6を5回足すと同じだよ",
                "6 × 5 = 30 だよ！"
            ]
        },
        {
            id: 8,
            story: "鍛冶屋が剣を作っている：「1週間で8本の剣を作る。2週間で何本作れる？」",
            question: "8 × 2 = ?",
            answer: 16,
            unit: "本",
            difficulty: "normal",
            xp: 60,
            hints: [
                "8本が2週分だね",
                "8 + 8 と同じだよ",
                "8 × 2 = 16 だよ！"
            ]
        },
        {
            id: 9,
            story: "魔法使いが呪文書を読んでいる：「1冊に9個の呪文が書いてある。4冊あったら呪文は何個？」",
            question: "9 × 4 = ?",
            answer: 36,
            unit: "個",
            difficulty: "hard",
            xp: 70,
            hints: [
                "9個が4冊分だね",
                "9を4回足すと同じだよ",
                "9 × 4 = 36 だよ！"
            ]
        },
        {
            id: 10,
            story: "勇者が仲間を集めている：「1つの村に7人の勇者がいる。5つの村があったら勇者は何人？」",
            question: "7 × 5 = ?",
            answer: 35,
            unit: "人",
            difficulty: "hard",
            xp: 70,
            hints: [
                "7人が5村分だね",
                "7を5回足すと同じだよ",
                "7 × 5 = 35 だよ！"
            ]
        }
    ];

    const problem = FALLBACK_PROBLEMS[currentProblemIndex % FALLBACK_PROBLEMS.length];
    console.log('選択されたフォールバック問題:', problem);
    return problem;
}

/**
 * 問題を表示
 */
async function displayProblem() {
    try {
        console.log('📝 問題表示を開始');
        currentProblem = await getCurrentProblem();

        if (!currentProblem) {
            console.error('問題が取得できません');
            return;
        }

        console.log('取得した問題:', currentProblem);

        // DOM要素の存在チェック
        const storyText = document.getElementById('story-text');
        const questionText = document.getElementById('question-text');
        const unitText = document.getElementById('unit-text');

        if (!storyText || !questionText || !unitText) {
            console.error('==================');
            console.error('❌ 問題表示用のDOM要素が見つかりません！');
            console.error('story-text:', storyText);
            console.error('question-text:', questionText);
            console.error('unit-text:', unitText);
            console.error('==================');
            return;
        }

        // ストーリーと問題を表示（式は非表示）
        storyText.textContent = currentProblem.story;
        questionText.textContent = '?'; // 式を隠して「?」のみ表示
        unitText.textContent = currentProblem.unit;

        // 問題の式を保存（ヒント1で使用）
        currentProblem.formulaForHint = currentProblem.question;

        console.log('✓ 問題テキスト表示完了');
        
        // 図形がある場合は描画
        if (currentProblem.figure) {
            displayFigure(currentProblem.figure);
        }
        
        // 進捗を更新
        updateProgress();
        
        // 入力フィールドをクリア
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
        
        // ヒントシステムを初期化
        if (window.HintSystem) {
            HintSystem.init(currentProblem);
        }
        
        // 試行回数をリセット
        attemptCount = 0;
        
    } catch (error) {
        console.error('問題表示エラー:', error);
        MathMagic.showMessage('問題の読み込みに失敗しました', 'error');
    }
}

/**
 * 図形を表示
 */
function displayFigure(figure) {
    const figureContainer = document.getElementById('figure-container');
    if (!figureContainer) return;
    
    figureContainer.classList.remove('hidden');
    
    const canvas = document.getElementById('figure-canvas');
    if (!canvas) return;
    
    // 図形描画
    if (window.FigureDrawer) {
        FigureDrawer.init('figure-canvas');
        
        switch (figure.type) {
            case 'rectangle':
                FigureDrawer.drawRectangle(figure.width, figure.height);
                break;
            case 'square':
                FigureDrawer.drawSquare(figure.side);
                break;
            case 'circle':
                FigureDrawer.drawCircle(figure.radius);
                break;
            case 'triangle':
                FigureDrawer.drawTriangle(figure.base, figure.height);
                break;
        }
    }
}

/**
 * 問題ローディング表示
 */
function showProblemLoading() {
    console.log('🔄 問題ローディング表示');
    const aiLoading = document.getElementById('ai-loading');
    if (aiLoading) {
        aiLoading.classList.remove('hidden');
    }
}

/**
 * 問題ローディング非表示
 */
function hideProblemLoading() {
    console.log('✓ 問題ローディング非表示');
    const aiLoading = document.getElementById('ai-loading');
    if (aiLoading) {
        aiLoading.classList.add('hidden');
    }
}

/**
 * 進捗を更新
 */
function updateProgress() {
    const progressText = `${currentProblemIndex + 1}/10`;
    document.getElementById('progress').textContent = progressText;
}

/**
 * タイマーを開始
 */
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

/**
 * 経過時間を取得（秒）
 */
function getElapsedTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

/**
 * 回答をチェック
 */
function checkAnswer(userAnswer) {
    attemptCount++;
    
    const answer = parseFloat(userAnswer);
    const correctAnswer = parseFloat(currentProblem.answer);
    const isCorrect = Math.abs(answer - correctAnswer) < 0.01; // 小数対応
    
    if (isCorrect) {
        // 正解
        handleCorrectAnswer(userAnswer);
    } else {
        // 不正解
        handleIncorrectAnswer(userAnswer);
    }
}

/**
 * 正解時の処理
 */
function handleCorrectAnswer(userAnswer) {
    // バトルシステム: プレイヤーの攻撃
    let monsterDefeated = false;
    let damage = 10;
    if (window.BattleSystem) {
        monsterDefeated = BattleSystem.onCorrectAnswer();
        damage = BattleSystem.damagePerQuestion;
        // コンボボーナスを反映
        if (BattleSystem.comboCount >= 3) {
            damage = Math.floor(damage * 1.5);
        }
        if (BattleSystem.comboCount >= 5) {
            damage = Math.floor(damage * 2);
        }
    }

    // 正解通知を表示
    showResultNotification(true, damage, monsterDefeated);

    // モンスターを倒した場合のみリザルト画面へ
    if (monsterDefeated) {
        // ヒント使用による経験値調整
        const hintsUsed = window.HintSystem ? HintSystem.getHintsUsedCount() : 0;
        const expModifier = window.HintSystem ? HintSystem.getExpModifier() : 1.0;
        let xpGained = Math.floor(currentProblem.xp * expModifier);

        // モンスター撃破ボーナス
        if (window.BattleSystem) {
            const monsterBonus = BattleSystem.defeatMonster();
            xpGained += monsterBonus;
            console.log('🎉 モンスター撃破！ボーナスEXP:', monsterBonus);
        }

        // 結果を記録
        const result = {
            problemId: currentProblem.id,
            userAnswer: parseFloat(userAnswer),
            correctAnswer: currentProblem.answer,
            isCorrect: true,
            elapsedTime: getElapsedTime(),
            xpGained: xpGained,
            hintsUsed: hintsUsed,
            attempts: attemptCount,
            monsterDefeated: monsterDefeated,
            battleState: window.BattleSystem ? BattleSystem.getBattleState() : null
        };

        questSession.results.push(result);
        questSession.currentIndex = currentProblemIndex;
        MathMagic.setItem('questSession', questSession);

        // 結果画面に渡すデータ
        MathMagic.setItem('lastResult', {
            ...result,
            problem: currentProblem,
            currentIndex: currentProblemIndex,
            totalProblems: 10
        });

        // タイマーを停止
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        // 結果画面へ（アニメーションを見せる）
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 2000);
    } else {
        // モンスターがまだ生きている場合は次の問題へ
        attemptCount = 0; // 試行回数リセット
        setTimeout(() => {
            nextProblem();
        }, 1500);
    }
}

/**
 * 結果通知を表示
 */
function showResultNotification(isCorrect, damage, monsterDefeated) {
    const notification = document.getElementById('result-notification');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const notificationCard = notification.querySelector('div');

    if (isCorrect) {
        notificationCard.className = 'bg-gradient-to-r from-green-400/90 to-emerald-500/90 rounded-lg p-3 shadow-xl backdrop-blur-md border-2 border-green-300/50 animate-bounce-in';
        title.textContent = '正解！';
        if (monsterDefeated) {
            message.textContent = `モンスターを倒した！`;
        } else {
            message.textContent = `モンスターに${damage}ダメージ！`;
        }
        notificationCard.querySelector('i').className = 'fas fa-check-circle text-white text-2xl mr-2';
    } else {
        notificationCard.className = 'bg-gradient-to-r from-red-400/90 to-pink-500/90 rounded-lg p-3 shadow-xl backdrop-blur-md border-2 border-red-300/50 animate-bounce-in';
        title.textContent = '不正解！';
        message.textContent = `${damage}ダメージを受けた！`;
        notificationCard.querySelector('i').className = 'fas fa-times-circle text-white text-2xl mr-2';
    }

    notification.classList.remove('hidden');

    // 3秒後に非表示
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

/**
 * 不正解時の処理（再チャレンジ）
 */
function handleIncorrectAnswer(userAnswer) {
    // バトルシステム: モンスターの攻撃
    let playerDefeated = false;
    let damage = 15;
    if (window.BattleSystem) {
        playerDefeated = BattleSystem.onWrongAnswer();
        damage = BattleSystem.playerDamageOnWrong;

        if (playerDefeated) {
            // プレイヤー敗北処理
            BattleSystem.playerDefeated();
            return; // 敗北処理で画面遷移するのでここで終了
        }
    }

    // 不正解通知を表示
    showResultNotification(false, damage, false);

    // 不正解メッセージ
    const answerCard = document.querySelector('.answer-card');

    // 既存のエラーメッセージを削除
    const existingError = document.getElementById('error-message');
    if (existingError) {
        existingError.remove();
    }

    // エラーメッセージを表示
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'mt-4 p-3 bg-orange-100/80 border-2 border-orange-400 rounded-xl animate-bounce-in backdrop-blur-sm';
    errorDiv.innerHTML = `
        <div class="text-center">
            <div class="text-3xl mb-1">💡</div>
            <p class="text-orange-900 font-bold text-base">
                惜しい！もう一度考えてみよう
            </p>
            <p class="text-orange-700 text-xs mt-1">
                ${attemptCount >= 3 ? 'ヒントを見てみる？' : '落ち着いて、もう一度計算してみよう'}
            </p>
        </div>
    `;

    answerCard.appendChild(errorDiv);

    // 入力フィールドをクリア
    const answerInput = document.getElementById('answer-input');
    answerInput.value = '';
    answerInput.focus();

    // 3回目の失敗で自動的にヒント表示を促す
    if (attemptCount >= 3 && window.HintSystem) {
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.classList.add('animate-pulse');
            hintBtn.classList.remove('opacity-50');
        }
    }
}

/**
 * 回答を送信
 */
function submitAnswer() {
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value.trim();
    
    // 入力チェック
    if (!userAnswer) {
        MathMagic.showMessage('答えを入力してください', 'error');
        answerInput.focus();
        return;
    }
    
    // 数値チェック
    if (isNaN(userAnswer)) {
        MathMagic.showMessage('数字を入力してください', 'error');
        answerInput.focus();
        return;
    }
    
    // 回答チェック
    checkAnswer(userAnswer);
}

/**
 * クエストを中断
 */
function quitQuest() {
    if (confirm('本当にクエストを中断しますか？\n進行状況は保存されます。')) {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        window.location.href = 'world-map.html';
    }
}

/**
 * 次の問題へ
 */
function nextProblem() {
    currentProblemIndex++;
    currentProblem = null; // リセット
    
    questSession.currentIndex = currentProblemIndex;
    MathMagic.setItem('questSession', questSession);
    
    if (currentProblemIndex < 10) {
        // 次の問題を表示
        displayProblem();
    } else {
        // 全問完了
        completeQuest();
    }
}

/**
 * クエスト完了処理
 */
function completeQuest() {
    // セッションをクリア
    MathMagic.removeItem('questSession');
    
    // ワールドマップに戻る
    window.location.href = 'world-map.html';
}

/**
 * プレイヤー情報を表示
 */
function displayPlayerInfo() {
    console.log('👤 プレイヤー情報を表示開始');
    const player = MathMagic.getCurrentPlayer();
    console.log('プレイヤーデータ:', player);

    if (!player) {
        console.error('==================');
        console.error('❌ プレイヤーデータが見つかりません！');
        console.error('index.htmlにリダイレクトします');
        console.error('==================');

        alert('プレイヤーデータが見つかりません！\nトップ画面に戻ります。');
        window.location.href = 'index.html';
        return;
    }

    console.log('✓ プレイヤー名:', player.name, 'レベル:', player.level);

    const nameElement = document.getElementById('player-name');
    const levelElement = document.getElementById('player-level');

    if (!nameElement || !levelElement) {
        console.error('⚠️ プレイヤー情報表示要素が見つかりません');
    } else {
        nameElement.textContent = player.name;
        levelElement.textContent = player.level;
        console.log('✓ プレイヤー情報表示完了');
    }
}

/**
 * 初期化
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('==================');
    console.log('🎮 クエスト画面を初期化中...');
    console.log('==================');

    try {
        // プレイヤー情報を表示
        console.log('ステップ1: プレイヤー情報を表示');
        displayPlayerInfo();
        console.log('✓ プレイヤー情報表示完了');

        // クエストセッションを初期化
        console.log('ステップ2: クエストセッションを初期化');
        await initQuestSession();
        console.log('✓ クエストセッション初期化完了');

        // 問題を表示
        console.log('ステップ3: 問題を表示');
        await displayProblem();
        console.log('✓ 問題表示完了');

        // タイマーを開始
        console.log('ステップ4: タイマーを開始');
        startTimer();
        console.log('✓ タイマー開始完了');

        // イベントリスナー
        console.log('ステップ5: イベントリスナーを設定');
        document.getElementById('submit-btn').addEventListener('click', submitAnswer);
        document.getElementById('quit-btn').addEventListener('click', quitQuest);

        // ヒントボタン
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn && window.HintSystem) {
            hintBtn.addEventListener('click', () => {
                HintSystem.showHint();
            });
        }

        // Enterキーで送信
        document.getElementById('answer-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });
        console.log('✓ イベントリスナー設定完了');

        console.log('==================');
        console.log('✅ クエスト画面の初期化完了');
        console.log('==================');

    } catch (error) {
        console.error('==================');
        console.error('❌ クエスト画面の初期化中にエラーが発生しました');
        console.error('エラー内容:', error);
        console.error('エラーメッセージ:', error.message);
        console.error('スタックトレース:', error.stack);
        console.error('==================');

        // エラーメッセージを表示
        document.body.innerHTML = `
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:40px;border:3px solid red;z-index:9999;max-width:80%;text-align:center;">
                <h1 style="color:red;margin:0 0 20px 0;">❌ エラーが発生しました</h1>
                <p style="margin:10px 0;"><strong>メッセージ:</strong> ${error.message}</p>
                <p style="margin:10px 0;">コンソール(F12)を確認してください</p>
                <button onclick="window.location.href='world-map.html'" style="background:blue;color:white;padding:15px 30px;border:none;cursor:pointer;margin-top:20px;font-size:16px;">ワールドマップに戻る</button>
            </div>
        `;

        throw error; // エラーを再スロー
    }
});
