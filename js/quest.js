/**
 * マスマジ！- クエスト・問題管理
 * quest.html用のJavaScript
 * v2: questIdベース・問題ファイル読み込み対応
 */

// グローバル変数
let currentProblemIndex = 0;
let startTime = null;
let timerInterval = null;
let questSession = null;
let currentProblem = null;
let problemsData = null; // 読み込んだ問題データ
let attemptCount = 0; // 試行回数

/**
 * 問題ファイルを読み込み
 */
async function loadProblemsForQuest(questId) {
    try {
        console.log(`📥 問題ファイルを読み込み中: ${questId}.json`);
        const response = await fetch(`js/problems/${questId}.json`);

        if (!response.ok) {
            throw new Error(`問題ファイルが見つかりません: ${questId}.json (HTTP ${response.status})`);
        }

        const data = await response.json();

        // 互換性: problemCount と totalProblems の両方をサポート
        if (data.problemCount && !data.totalProblems) {
            data.totalProblems = data.problemCount;
        }
        if (!data.totalProblems && !data.problemCount) {
            data.totalProblems = data.problems ? data.problems.length : 0;
        }

        // questNameが存在しない場合（quest_name対応含む）
        if (!data.questName) {
            data.questName = data.quest_name || data.questId || questId;
        }

        console.log(`✅ 問題ファイル読み込み完了:`, data.problems.length, '問');
        return data;
    } catch (error) {
        console.error('❌ 問題ファイル読み込みエラー:', error);
        throw error;
    }
}

/**
 * クエストセッションを初期化
 */
async function initQuestSession() {
    console.log('📋 クエストセッション初期化を開始');

    // セッションデータを取得
    const session = MathMagic.getItem('questSession');
    console.log('セッションデータ:', session);

    if (!session || !session.questId) {
        console.error('❌ セッションデータが不正です');
        alert('クエストセッションが見つかりません。\nワールドマップに戻ります。');
        window.location.href = 'world-map.html';
        return;
    }

    questSession = session;
    currentProblemIndex = session.currentIndex || 0;

    if (session.startTime) {
        startTime = new Date(session.startTime);
    } else {
        startTime = new Date();
    }

    // 問題ファイルを読み込み
    try {
        problemsData = await loadProblemsForQuest(session.questId);

        // 問題数をセッションの totalProblems と照合
        if (problemsData.problems.length < session.totalProblems) {
            console.warn(`⚠️ 問題数が不足: 期待${session.totalProblems}問、実際${problemsData.problems.length}問`);
        }

        console.log('✓ クエストセッション初期化完了');
    } catch (error) {
        console.error('❌ 問題ファイル読み込み失敗:', error);

        // フォールバック: デフォルト問題を使用
        if (confirm('問題ファイルの読み込みに失敗しました。\nデフォルト問題で続行しますか？')) {
            problemsData = generateFallbackProblems(session);
        } else {
            window.location.href = 'world-map.html';
            return;
        }
    }

    // バトルシステムを初期化
    if (window.BattleSystem) {
        const difficulty = getDifficultyLevel(session.difficulty);
        BattleSystem.init(session.questId, difficulty);
        console.log('⚔️ バトルシステム初期化完了');
    }
}

/**
 * 難易度レベルを数値に変換
 */
function getDifficultyLevel(difficulty) {
    const difficultyMap = {
        'basic': 1,
        'standard': 2,
        'advanced': 3
    };
    return difficultyMap[difficulty] || 1;
}

/**
 * フォールバック問題を生成
 */
function generateFallbackProblems(session) {
    console.log('⚠️ フォールバック問題を生成します');

    const problems = [];
    const totalProblems = session.totalProblems || 10;

    for (let i = 0; i < totalProblems; i++) {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;

        problems.push({
            id: i + 1,
            question: `${a} + ${b}`,
            answer: a + b,
            unit: "",
            difficulty: session.difficulty || "basic",
            type: "calculation",
            hint: `${a}に${b}を足すと${a + b}になるよ`
        });
    }

    return {
        questId: session.questId,
        questName: session.questName,
        problems: problems
    };
}

/**
 * 現在の問題を取得
 */
async function getCurrentProblem() {
    if (!problemsData || !problemsData.problems) {
        console.error('❌ 問題データが読み込まれていません');
        return null;
    }

    if (currentProblemIndex >= problemsData.problems.length) {
        console.warn('⚠️ 問題インデックスが範囲外です');
        return null;
    }

    currentProblem = problemsData.problems[currentProblemIndex];
    return currentProblem;
}

/**
 * 問題を表示
 */
async function displayProblem() {
    console.log('🎯 問題を表示中...');

    const problem = await getCurrentProblem();

    if (!problem) {
        console.error('❌ 問題を取得できませんでした');
        finishQuest();
        return;
    }

    console.log('問題:', problem);

    // 問題番号と進捗を更新
    updateProgress();

    // 問題文を表示
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
        questionElement.textContent = problem.question;
    }

    // 単位を表示
    const unitElement = document.getElementById('answer-unit');
    if (unitElement) {
        unitElement.textContent = problem.unit || '';
    }

    // 回答欄をクリア
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.value = '';
        answerInput.focus();
    }

    // タイマーを開始
    startTimer();

    // 試行回数をリセット
    attemptCount = 0;

    console.log('✓ 問題表示完了');
}

/**
 * 進捗を更新
 */
function updateProgress() {
    const currentNum = document.getElementById('current-problem-num');
    const totalNum = document.getElementById('total-problems-num');
    const progressBar = document.getElementById('progress-bar');

    if (currentNum) {
        currentNum.textContent = currentProblemIndex + 1;
    }

    if (totalNum) {
        totalNum.textContent = questSession.totalProblems || problemsData.problems.length;
    }

    if (progressBar) {
        const progress = ((currentProblemIndex) / (questSession.totalProblems || problemsData.problems.length)) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * タイマーを開始
 */
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const problemStartTime = Date.now();

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - problemStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;

        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);
}

/**
 * タイマーを停止
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * 回答を送信
 */
function submitAnswer() {
    console.log('📝 回答送信');

    const answerInput = document.getElementById('answer-input');
    if (!answerInput) {
        console.error('❌ 回答欄が見つかりません');
        return;
    }

    const userAnswer = parseInt(answerInput.value.trim());

    if (isNaN(userAnswer)) {
        MathMagic.showMessage('数字を入力してください', 'warning');
        return;
    }

    attemptCount++;

    const problem = currentProblem;
    const isCorrect = userAnswer === problem.answer;

    console.log('ユーザーの回答:', userAnswer, '正解:', problem.answer, '結果:', isCorrect ? '正解' : '不正解');

    // タイマーを停止
    stopTimer();

    // 経過時間を計算
    const elapsedTime = Math.floor((Date.now() - new Date(questSession.startTime).getTime()) / 1000);

    // 結果を記録
    const result = {
        problemId: problem.id,
        question: problem.question,
        answer: problem.answer,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        attemptCount: attemptCount,
        elapsedTime: elapsedTime,
        xpGained: isCorrect ? calculateXP(problem, attemptCount) : 0,
        monsterDefeated: isCorrect
    };

    questSession.results.push(result);
    questSession.currentIndex = currentProblemIndex + 1;
    MathMagic.setItem('questSession', questSession);

    // 結果画面へ
    MathMagic.setItem('lastResult', {
        ...result,
        problem: problem,
        currentIndex: currentProblemIndex,
        totalProblems: questSession.totalProblems || problemsData.problems.length,
        correctAnswer: problem.answer
    });

    // バトルシステムの処理
    if (window.BattleSystem) {
        if (isCorrect) {
            BattleSystem.playerAttack();
        } else {
            BattleSystem.monsterAttack();
        }
    }

    // 効果音
    if (window.SoundSystem) {
        SoundSystem.playSound(isCorrect ? 'correct' : 'wrong');
    }

    // 結果画面へ遷移
    setTimeout(() => {
        window.location.href = 'result.html';
    }, 500);
}

/**
 * 経験値を計算
 */
function calculateXP(problem, attemptCount) {
    let baseXP = 50;

    // 難易度による倍率
    const difficultyMultiplier = {
        'basic': 1.0,
        'standard': 1.5,
        'advanced': 2.0
    };

    baseXP *= difficultyMultiplier[problem.difficulty] || 1.0;

    // 試行回数によるペナルティ
    if (attemptCount > 1) {
        baseXP *= Math.pow(0.8, attemptCount - 1);
    }

    // 経験値ブースターの効果
    const player = MathMagic.getCurrentPlayer();
    if (player && player.activeEffects && player.activeEffects.expBooster) {
        baseXP *= 1.5;
        // 使用済みフラグを削除
        delete player.activeEffects.expBooster;
        PlayerManager.updatePlayer(player);
    }

    return Math.floor(baseXP);
}

/**
 * ヒントを表示
 */
function showHint() {
    if (!currentProblem || !currentProblem.hint) {
        MathMagic.showMessage('ヒントがありません', 'info');
        return;
    }

    // ヒントシステムを使用
    if (window.HintSystem) {
        const player = MathMagic.getCurrentPlayer();
        HintSystem.showHint(currentProblem, player);
    } else {
        // フォールバック: シンプルなアラート
        alert(`💡 ヒント\n\n${currentProblem.hint}`);
    }
}

/**
 * クエストを終了
 */
function finishQuest() {
    console.log('🏁 クエスト終了');

    stopTimer();

    // 統計情報を表示
    const results = questSession.results;
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    console.log(`正解数: ${correctCount}/${totalCount} (${accuracy}%)`);

    // セッションをクリア
    MathMagic.removeItem('questSession');
    MathMagic.removeItem('lastResult');

    // 完了メッセージ
    MathMagic.showMessage(`クエスト完了！\n正解率: ${accuracy}%`, 'success');

    // ワールドマップに戻る
    setTimeout(() => {
        window.location.href = 'world-map.html';
    }, 2000);
}

/**
 * ワールドマップに戻る
 */
function backToWorldMap() {
    if (confirm('クエストを中断してワールドマップに戻りますか？\n進行状況は保存されます。')) {
        stopTimer();
        window.location.href = 'world-map.html';
    }
}

/**
 * 初期化
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('==================');
    console.log('📋 クエスト画面を初期化中...');
    console.log('==================');

    try {
        // セッションを初期化
        await initQuestSession();

        // 最初の問題を表示
        await displayProblem();

        // イベントリスナーを設定
        const submitBtn = document.getElementById('submit-answer-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitAnswer);
        }

        const answerInput = document.getElementById('answer-input');
        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitAnswer();
                }
            });
        }

        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', showHint);
        }

        const backBtn = document.getElementById('back-to-map-btn');
        if (backBtn) {
            backBtn.addEventListener('click', backToWorldMap);
        }

        console.log('==================');
        console.log('✅ クエスト画面の初期化完了');
        console.log('==================');

    } catch (error) {
        console.error('==================');
        console.error('❌ 初期化エラー:', error);
        console.error('==================');
        alert(`エラーが発生しました:\n${error.message}\n\nワールドマップに戻ります。`);
        window.location.href = 'world-map.html';
    }
});

console.log('✅ quest.js ロード完了');
