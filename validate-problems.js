/**
 * マスマジ！- 問題ファイル検証スクリプト
 * 全103問題ファイルのJSON形式と構造を検証
 */

const fs = require('fs');
const path = require('path');

const PROBLEMS_DIR = path.join(__dirname, 'js', 'problems');

// 期待されるファイルリスト
const expectedFiles = [
    // 小学1年（10ファイル）
    ...Array.from({length: 10}, (_, i) => `grade1-quest${String(i + 1).padStart(2, '0')}.json`),
    // 小学2年（10ファイル）
    ...Array.from({length: 10}, (_, i) => `grade2-quest${String(i + 1).padStart(2, '0')}.json`),
    // 小学3年（13ファイル）
    ...Array.from({length: 13}, (_, i) => `grade3-quest${String(i + 1).padStart(2, '0')}.json`),
    // 小学4年（14ファイル）
    ...Array.from({length: 14}, (_, i) => `grade4-quest${String(i + 1).padStart(2, '0')}.json`),
    // 小学5年（12ファイル）
    ...Array.from({length: 12}, (_, i) => `grade5-quest${String(i + 1).padStart(2, '0')}.json`),
    // 小学6年（11ファイル）
    ...Array.from({length: 11}, (_, i) => `grade6-quest${String(i + 1).padStart(2, '0')}.json`),
    // 中学1年（8ファイル）
    ...Array.from({length: 8}, (_, i) => `jh1-quest${String(i + 1).padStart(2, '0')}.json`),
    // 中学2年（10ファイル）
    ...Array.from({length: 10}, (_, i) => `jh2-quest${String(i + 1).padStart(2, '0')}.json`),
    // 中学3年（15ファイル）
    ...Array.from({length: 15}, (_, i) => `jh3-quest${String(i + 1).padStart(2, '0')}.json`)
];

console.log('📚 マスマジ！問題ファイル検証開始\n');
console.log(`期待ファイル数: ${expectedFiles.length}ファイル\n`);

let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;
let missingFiles = [];
let errors = [];

expectedFiles.forEach(filename => {
    const filepath = path.join(PROBLEMS_DIR, filename);
    totalFiles++;

    try {
        // ファイル存在チェック
        if (!fs.existsSync(filepath)) {
            missingFiles.push(filename);
            console.log(`❌ ${filename} - ファイルが見つかりません`);
            return;
        }

        // JSON読み込み
        const content = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(content);

        // 必須フィールドチェック（互換性対応）
        const requiredFields = ['questId', 'problems'];
        const missingFields = requiredFields.filter(field => !(field in data));

        // questNameは必須だが、quest_name or questIdから生成可能
        if (!data.questName && !data.quest_name && !data.questId) {
            missingFields.push('questName');
        }

        // totalProblems/problemCount/problems.lengthのいずれかがあればOK
        if (!data.totalProblems && !data.problemCount && (!data.problems || !Array.isArray(data.problems))) {
            missingFields.push('totalProblems/problemCount');
        }

        if (missingFields.length > 0) {
            errors.push({
                file: filename,
                error: `必須フィールド不足: ${missingFields.join(', ')}`
            });
            console.log(`⚠️  ${filename} - 必須フィールド不足: ${missingFields.join(', ')}`);
            invalidFiles++;
            return;
        }

        // 問題数チェック
        if (!Array.isArray(data.problems)) {
            errors.push({
                file: filename,
                error: 'problems が配列ではありません'
            });
            console.log(`⚠️  ${filename} - problems が配列ではありません`);
            invalidFiles++;
            return;
        }

        const actualProblems = data.problems.length;
        const expectedProblems = data.totalProblems || data.problemCount;

        if (actualProblems !== expectedProblems) {
            errors.push({
                file: filename,
                error: `問題数不一致: 期待${expectedProblems}、実際${actualProblems}`
            });
            console.log(`⚠️  ${filename} - 問題数不一致: 期待${expectedProblems}、実際${actualProblems}`);
        }

        // 各問題の構造チェック
        let problemErrors = 0;
        data.problems.forEach((problem, index) => {
            const problemRequiredFields = ['id', 'question', 'answer', 'difficulty', 'type'];
            const problemMissingFields = problemRequiredFields.filter(field => !(field in problem));

            if (problemMissingFields.length > 0) {
                problemErrors++;
                if (problemErrors <= 3) { // 最初の3件だけ表示
                    console.log(`  ⚠️  問題${index + 1}: 必須フィールド不足 - ${problemMissingFields.join(', ')}`);
                }
            }
        });

        if (problemErrors > 0) {
            errors.push({
                file: filename,
                error: `${problemErrors}個の問題に構造エラーあり`
            });
            invalidFiles++;
        } else {
            validFiles++;
            console.log(`✅ ${filename} - OK (${actualProblems}問)`);
        }

    } catch (error) {
        errors.push({
            file: filename,
            error: error.message
        });
        console.log(`❌ ${filename} - JSONパースエラー: ${error.message}`);
        invalidFiles++;
    }
});

// 結果サマリー
console.log('\n' + '='.repeat(60));
console.log('📊 検証結果サマリー');
console.log('='.repeat(60));
console.log(`✅ 正常: ${validFiles}ファイル`);
console.log(`⚠️  エラー: ${invalidFiles}ファイル`);
console.log(`❌ 不足: ${missingFiles.length}ファイル`);
console.log(`📝 合計: ${totalFiles}ファイル中 ${validFiles}ファイルが正常\n`);

if (missingFiles.length > 0) {
    console.log('📋 不足ファイル一覧:');
    missingFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');
}

if (errors.length > 0 && errors.length <= 10) {
    console.log('⚠️  エラー詳細:');
    errors.forEach(err => console.log(`  - ${err.file}: ${err.error}`));
    console.log('');
}

// 終了コード
if (missingFiles.length === 0 && invalidFiles === 0) {
    console.log('🎉 すべての問題ファイルが正常です！');
    process.exit(0);
} else {
    console.log('⚠️  いくつかの問題ファイルにエラーがあります。');
    process.exit(1);
}
