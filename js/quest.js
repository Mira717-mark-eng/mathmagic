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
let currentStory = null; // ストーリーデータ
let storyIntroShown = false; // ストーリーイントロ表示済みフラグ

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

    // results配列が存在しない場合は初期化
    if (!questSession.results) {
        questSession.results = [];
    }

    if (session.startTime) {
        startTime = new Date(session.startTime);
    } else {
        startTime = new Date();
    }

    // 問題ファイルを読み込み
    try {
        problemsData = await loadProblemsForQuest(session.questId);

        // GeometryGeneratorが利用可能な場合、図形問題を自動生成して追加
        if (window.GeometryGenerator && problemsData.useGeometryGenerator) {
            console.log('🎨 図形問題を動的生成中...');
            problemsData.problems = enrichProblemsWithGeometry(problemsData.problems);
            console.log('✅ 図形問題生成完了');
        }

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

    // ストーリーシステムを初期化
    await initStorySystem(session.questId);
}

/**
 * ストーリーシステムを初期化
 */
async function initStorySystem(questId) {
    if (!window.StorySystem) {
        console.log('⚠️ ストーリーシステムが読み込まれていません');
        return;
    }

    try {
        // questIdから学年を抽出 (例: grade1-quest01 -> grade1, jh1-quest01 -> jh1)
        const gradeId = questId.split('-')[0];

        console.log(`📖 ストーリーを読み込み中: ${gradeId}`);
        currentStory = await StorySystem.loadStoryForGrade(gradeId);

        if (currentStory) {
            console.log('✅ ストーリー読み込み完了:', currentStory.storyTitle);
        }
    } catch (error) {
        console.log('ℹ️ ストーリーファイルが見つかりません:', error.message);
        // ストーリーがない場合は通常通り進行
        currentStory = null;
    }
}

/**
 * ストーリーイントロを表示
 */
function showStoryIntro() {
    if (!currentStory || !window.StorySystem) {
        return false;
    }

    const questId = questSession.questId;
    const storyData = StorySystem.getQuestStory(questId);

    if (!storyData || !storyData.before) {
        return false;
    }

    // ストーリーコンテナを作成
    const storyContainer = document.createElement('div');
    storyContainer.id = 'story-intro-overlay';
    storyContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
    `;

    // ストーリー内容を表示
    StorySystem.showQuestIntro(questId, storyContainer);

    // ページに追加
    document.body.appendChild(storyContainer);

    // 「クエスト開始」ボタンにイベントを設定
    setTimeout(() => {
        const startBtn = storyContainer.querySelector('.story-start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                storyContainer.remove();
                storyIntroShown = true;
                displayProblem(); // 問題表示を開始
            });
        }
    }, 100);

    return true;
}

/**
 * ストーリーアウトロを表示
 */
function showStoryOutro(clearStatus) {
    if (!currentStory || !window.StorySystem) {
        return false;
    }

    const questId = questSession.questId;
    const storyData = StorySystem.getQuestStory(questId);

    if (!storyData || !storyData.after) {
        return false;
    }

    // ストーリーコンテナを作成
    const storyContainer = document.createElement('div');
    storyContainer.id = 'story-outro-overlay';
    storyContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
    `;

    // ストーリー内容を表示
    StorySystem.showQuestOutro(questId, storyContainer, clearStatus);

    // ページに追加
    document.body.appendChild(storyContainer);

    // 「次へ」ボタンにイベントを設定
    setTimeout(() => {
        const nextBtn = storyContainer.querySelector('.story-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                storyContainer.remove();
                // ワールドマップに戻る
                window.location.href = 'world-map.html';
            });
        }
    }, 100);

    return true;
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

    // 最初の問題でストーリーイントロを表示
    if (currentProblemIndex === 0 && !storyIntroShown) {
        const storyShown = showStoryIntro();
        if (storyShown) {
            // ストーリーイントロを表示した場合は、ここで中断
            // ストーリーの「クエスト開始」ボタンから displayProblem() が再度呼ばれる
            return;
        }
        storyIntroShown = true;
    }

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

    // ストーリーテキストを表示（図形問題用）
    const storyElement = document.getElementById('story-text');
    if (storyElement && problem.story) {
        storyElement.textContent = problem.story;
    }

    // 単位を表示
    const unitElement = document.getElementById('unit-text');
    if (unitElement) {
        unitElement.textContent = problem.unit || '';
    }

    // 図形ビジュアライゼーションを表示
    if (problem.visualizationType && problem.visualData) {
        displayGeometryVisualization(problem);
    } else {
        // 図形がない場合は非表示
        const figureContainer = document.getElementById('figure-container');
        if (figureContainer) {
            figureContainer.classList.add('hidden');
        }
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
/**
 * 回答を正規化（全角→半角、カタカナ→ひらがな）
 */
function normalizeAnswer(answer) {
    if (typeof answer !== 'string') {
        return answer;
    }

    // 全角数字・記号を半角に変換
    let normalized = answer.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    normalized = normalized.replace(/[Ａ-Ｚａ-ｚ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));

    // 全角記号を半角に
    normalized = normalized.replace(/π/g, 'π'); // 既に半角
    normalized = normalized.replace(/[×・]/g, '*');
    normalized = normalized.replace(/[÷]/g, '/');

    // カタカナをひらがなに変換
    normalized = normalized.replace(/[\u30A1-\u30F6]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60));

    // 空白を削除
    normalized = normalized.replace(/\s+/g, '');

    return normalized;
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

    let userAnswer = answerInput.value.trim();

    if (!userAnswer) {
        MathMagic.showMessage('答えを入力してください', 'warning');
        return;
    }

    attemptCount++;

    const problem = currentProblem;

    // 回答を正規化
    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const normalizedCorrectAnswer = normalizeAnswer(String(problem.answer));

    // 数値として比較できる場合は数値比較
    const userNum = parseFloat(normalizedUserAnswer);
    const correctNum = parseFloat(normalizedCorrectAnswer);

    let isCorrect = false;

    if (!isNaN(userNum) && !isNaN(correctNum)) {
        // 数値比較（小数点の誤差を考慮）
        isCorrect = Math.abs(userNum - correctNum) < 0.001;
    } else {
        // 文字列比較（大文字小文字を区別しない）
        isCorrect = normalizedUserAnswer.toLowerCase() === normalizedCorrectAnswer.toLowerCase();
    }

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

    // 結果メッセージを表示
    if (isCorrect) {
        MathMagic.showMessage('正解！ +' + result.xpGained + ' XP', 'success');
    } else {
        MathMagic.showMessage(`不正解... 正解は ${problem.answer} です`, 'error');
    }

    // バトルシステムの処理
    if (window.BattleSystem) {
        if (isCorrect) {
            BattleSystem.onCorrectAnswer();
        } else {
            BattleSystem.onWrongAnswer();
        }
    }

    // 効果音
    if (window.SoundSystem) {
        SoundSystem.playSound(isCorrect ? 'correct' : 'wrong');
    }

    // 回答欄をクリア
    answerInput.value = '';
    answerInput.disabled = true;

    // 次の問題へ進むか終了
    setTimeout(() => {
        answerInput.disabled = false;
        answerInput.focus();

        if (currentProblemIndex + 1 >= (questSession.totalProblems || problemsData.problems.length)) {
            // 全問題完了
            finishQuest();
        } else {
            // 次の問題へ
            currentProblemIndex++;
            attemptCount = 0;

            // ヒントシステムをリセット
            if (window.HintSystem) {
                HintSystem.init(null);
            }

            displayProblem();
        }
    }, 1500);
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

    // クリアステータスを判定
    const clearStatus = accuracy >= 80 ? 'perfect' : accuracy >= 50 ? 'clear' : 'failed';

    // ストーリーアウトロを表示
    const storyShown = showStoryOutro(clearStatus);

    // セッションをクリア
    MathMagic.removeItem('questSession');
    MathMagic.removeItem('lastResult');

    // ストーリーが表示されない場合は、通常の完了フロー
    if (!storyShown) {
        // 完了メッセージ
        MathMagic.showMessage(`クエスト完了！\n正解率: ${accuracy}%`, 'success');

        // ワールドマップに戻る
        setTimeout(() => {
            window.location.href = 'world-map.html';
        }, 2000);
    }
    // ストーリーが表示される場合は、ストーリーの「次へ」ボタンからワールドマップに戻る
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
 * 図形ビジュアライゼーションを表示
 */
function displayGeometryVisualization(problem) {
    console.log('🎨 displayGeometryVisualization 開始');
    console.log('問題データ:', problem);
    console.log('visualizationType:', problem.visualizationType);
    console.log('visualData:', problem.visualData);

    const figureContainer = document.getElementById('figure-container');
    if (!figureContainer) {
        console.error('❌ figure-container が見つかりません');
        return;
    }

    // コンテナを表示
    figureContainer.classList.remove('hidden');
    console.log('✓ figure-container を表示しました');

    // Canvas要素を確認
    const canvas = document.getElementById('geometry-canvas');
    console.log('Canvas要素:', canvas);
    if (canvas) {
        console.log('Canvas サイズ:', canvas.width, 'x', canvas.height);
    }

    // GeometryVisualizerを初期化
    if (window.GeometryVisualizer) {
        console.log('✓ GeometryVisualizer が存在します');
        const initialized = GeometryVisualizer.init('geometry-canvas');
        console.log('初期化結果:', initialized);

        if (initialized) {
            // ビジュアライゼーションを描画
            console.log('描画開始:', problem.visualizationType, problem.visualData);
            GeometryVisualizer.render(problem.visualizationType, problem.visualData);
            console.log('✅ 図形を表示:', problem.visualizationType);
        } else {
            console.error('❌ GeometryVisualizer の初期化に失敗');
        }
    } else {
        console.error('❌ GeometryVisualizer が読み込まれていません');
        console.log('window.GeometryVisualizer:', window.GeometryVisualizer);
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
        const submitBtn = document.getElementById('submit-btn');
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

/**
 * 問題に図形ビジュアライゼーションを追加
 */
function enrichProblemsWithGeometry(problems) {
    return problems.map((problem, index) => {
        // 既に visualizationType が設定されている場合はスキップ
        if (problem.visualizationType) {
            return problem;
        }

        // 問題タイプに基づいて図形を生成
        if (problem.geometryType) {
            try {
                let generatedProblem = null;

                // GeometryGeneratorのメソッドを呼び出し
                switch (problem.geometryType) {
                    case 'vertical-angles':
                        if (GeometryGenerator.angleUnderstanding) {
                            generatedProblem = GeometryGenerator.angleUnderstanding.verticalAngles();
                        }
                        break;
                    case 'supplementary-angles':
                        if (GeometryGenerator.angleUnderstanding) {
                            generatedProblem = GeometryGenerator.angleUnderstanding.supplementaryAngles();
                        }
                        break;
                    case 'triangle-angles':
                        if (GeometryGenerator.triangleAngles) {
                            generatedProblem = GeometryGenerator.triangleAngles.generate();
                        }
                        break;
                    case 'area-comparison':
                        if (GeometryGenerator.areaProblems) {
                            generatedProblem = GeometryGenerator.areaProblems.comparison();
                        }
                        break;
                }

                // 生成された問題データを元の問題にマージ
                if (generatedProblem) {
                    problem.visualizationType = generatedProblem.visualizationType;
                    problem.visualData = generatedProblem.visualData;

                    // 問題文が空の場合は生成された問題文を使用
                    if (!problem.question && generatedProblem.questions && generatedProblem.questions[0]) {
                        problem.question = generatedProblem.questions[0].text;
                        problem.answer = generatedProblem.questions[0].answer;
                    }

                    console.log(`✨ 図形追加: 問題${index + 1} - ${problem.geometryType}`);
                }
            } catch (error) {
                console.error(`⚠️ 図形生成エラー (問題${index + 1}):`, error);
            }
        }

        return problem;
    });
}

console.log('✅ quest.js ロード完了');
