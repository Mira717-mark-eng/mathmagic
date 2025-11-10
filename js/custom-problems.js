/**
 * マスマジ！- カスタム問題作成機能
 * 保護者・教師が独自の問題を作成・共有
 */

const CustomProblems = {
    /**
     * カスタム問題を作成
     */
    createProblem: function(problemData) {
        const customProblems = this.getAllCustomProblems();

        const newProblem = {
            id: 'custom-' + Date.now(),
            question: problemData.question,
            answer: problemData.answer,
            unit: problemData.unit || '',
            difficulty: problemData.difficulty || 'basic',
            type: problemData.type || 'calculation',
            hint: problemData.hint || '',
            explanation: problemData.explanation || '',
            tags: problemData.tags || [],
            createdBy: problemData.createdBy || 'unknown',
            createdAt: new Date().toISOString(),
            shared: problemData.shared || false
        };

        customProblems.push(newProblem);
        this.saveCustomProblems(customProblems);

        console.log('カスタム問題を作成しました:', newProblem.id);

        return newProblem;
    },

    /**
     * カスタム問題を更新
     */
    updateProblem: function(problemId, updates) {
        const customProblems = this.getAllCustomProblems();
        const index = customProblems.findIndex(p => p.id === problemId);

        if (index === -1) {
            console.error('問題が見つかりません:', problemId);
            return null;
        }

        customProblems[index] = {
            ...customProblems[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveCustomProblems(customProblems);

        return customProblems[index];
    },

    /**
     * カスタム問題を削除
     */
    deleteProblem: function(problemId) {
        let customProblems = this.getAllCustomProblems();
        const originalLength = customProblems.length;

        customProblems = customProblems.filter(p => p.id !== problemId);

        if (customProblems.length === originalLength) {
            console.error('問題が見つかりません:', problemId);
            return false;
        }

        this.saveCustomProblems(customProblems);
        console.log('カスタム問題を削除しました:', problemId);

        return true;
    },

    /**
     * すべてのカスタム問題を取得
     */
    getAllCustomProblems: function() {
        return MathMagic.getItem('customProblems') || [];
    },

    /**
     * カスタム問題を保存
     */
    saveCustomProblems: function(problems) {
        MathMagic.setItem('customProblems', problems);
    },

    /**
     * IDで問題を取得
     */
    getProblemById: function(problemId) {
        const customProblems = this.getAllCustomProblems();
        return customProblems.find(p => p.id === problemId) || null;
    },

    /**
     * 条件で問題を検索
     */
    searchProblems: function(filters = {}) {
        let customProblems = this.getAllCustomProblems();

        // 難易度でフィルタ
        if (filters.difficulty) {
            customProblems = customProblems.filter(p => p.difficulty === filters.difficulty);
        }

        // タイプでフィルタ
        if (filters.type) {
            customProblems = customProblems.filter(p => p.type === filters.type);
        }

        // タグでフィルタ
        if (filters.tags && filters.tags.length > 0) {
            customProblems = customProblems.filter(p =>
                filters.tags.some(tag => p.tags.includes(tag))
            );
        }

        // キーワード検索
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            customProblems = customProblems.filter(p =>
                p.question.toLowerCase().includes(keyword) ||
                (p.hint && p.hint.toLowerCase().includes(keyword)) ||
                (p.explanation && p.explanation.toLowerCase().includes(keyword))
            );
        }

        return customProblems;
    },

    /**
     * カスタムクエストを作成
     */
    createCustomQuest: function(questData) {
        const customQuests = this.getAllCustomQuests();

        const newQuest = {
            id: 'custom-quest-' + Date.now(),
            questName: questData.questName,
            description: questData.description || '',
            problemIds: questData.problemIds || [],
            difficulty: questData.difficulty || 'basic',
            createdBy: questData.createdBy || 'unknown',
            createdAt: new Date().toISOString(),
            shared: questData.shared || false
        };

        customQuests.push(newQuest);
        this.saveCustomQuests(customQuests);

        console.log('カスタムクエストを作成しました:', newQuest.id);

        return newQuest;
    },

    /**
     * カスタムクエストを更新
     */
    updateCustomQuest: function(questId, updates) {
        const customQuests = this.getAllCustomQuests();
        const index = customQuests.findIndex(q => q.id === questId);

        if (index === -1) {
            console.error('クエストが見つかりません:', questId);
            return null;
        }

        customQuests[index] = {
            ...customQuests[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveCustomQuests(customQuests);

        return customQuests[index];
    },

    /**
     * カスタムクエストを削除
     */
    deleteCustomQuest: function(questId) {
        let customQuests = this.getAllCustomQuests();
        const originalLength = customQuests.length;

        customQuests = customQuests.filter(q => q.id !== questId);

        if (customQuests.length === originalLength) {
            console.error('クエストが見つかりません:', questId);
            return false;
        }

        this.saveCustomQuests(customQuests);
        console.log('カスタムクエストを削除しました:', questId);

        return true;
    },

    /**
     * すべてのカスタムクエストを取得
     */
    getAllCustomQuests: function() {
        return MathMagic.getItem('customQuests') || [];
    },

    /**
     * カスタムクエストを保存
     */
    saveCustomQuests: function(quests) {
        MathMagic.setItem('customQuests', quests);
    },

    /**
     * クエストの問題を取得
     */
    getQuestProblems: function(questId) {
        const quest = this.getAllCustomQuests().find(q => q.id === questId);

        if (!quest) {
            return [];
        }

        const allProblems = this.getAllCustomProblems();
        return quest.problemIds.map(id => allProblems.find(p => p.id === id)).filter(p => p !== undefined);
    },

    /**
     * 問題をインポート（JSON形式）
     */
    importProblems: function(jsonData) {
        try {
            const imported = JSON.parse(jsonData);

            if (!Array.isArray(imported)) {
                throw new Error('配列形式のJSONが必要です');
            }

            const customProblems = this.getAllCustomProblems();
            let importedCount = 0;

            imported.forEach(problemData => {
                if (this.validateProblemData(problemData)) {
                    const newProblem = {
                        id: 'custom-' + Date.now() + '-' + importedCount,
                        ...problemData,
                        createdAt: new Date().toISOString()
                    };
                    customProblems.push(newProblem);
                    importedCount++;
                }
            });

            this.saveCustomProblems(customProblems);

            return {
                success: true,
                imported: importedCount,
                message: `${importedCount}個の問題をインポートしました`
            };

        } catch (error) {
            console.error('インポートエラー:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * 問題をエクスポート（JSON形式）
     */
    exportProblems: function(problemIds = null) {
        let problems = this.getAllCustomProblems();

        if (problemIds && Array.isArray(problemIds)) {
            problems = problems.filter(p => problemIds.includes(p.id));
        }

        // メタデータを除去
        const exportData = problems.map(p => ({
            question: p.question,
            answer: p.answer,
            unit: p.unit,
            difficulty: p.difficulty,
            type: p.type,
            hint: p.hint,
            explanation: p.explanation,
            tags: p.tags
        }));

        return JSON.stringify(exportData, null, 2);
    },

    /**
     * 問題データを検証
     */
    validateProblemData: function(problemData) {
        if (!problemData.question || typeof problemData.question !== 'string') {
            return false;
        }

        if (problemData.answer === undefined || problemData.answer === null) {
            return false;
        }

        return true;
    },

    /**
     * 問題作成フォームのHTML生成
     */
    renderProblemForm: function(problemId = null) {
        const problem = problemId ? this.getProblemById(problemId) : null;

        return `
            <div class="bg-white rounded-xl p-6 shadow-lg">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">
                    ${problem ? '問題を編集' : '新しい問題を作成'}
                </h3>

                <form id="problem-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700 font-bold mb-2">問題文 *</label>
                        <input type="text" id="problem-question" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200" value="${problem?.question || ''}" placeholder="例: 3 + 5" required>
                    </div>

                    <div>
                        <label class="block text-gray-700 font-bold mb-2">正解 *</label>
                        <input type="number" id="problem-answer" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200" value="${problem?.answer || ''}" placeholder="例: 8" required>
                    </div>

                    <div>
                        <label class="block text-gray-700 font-bold mb-2">単位</label>
                        <input type="text" id="problem-unit" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200" value="${problem?.unit || ''}" placeholder="例: 個、cm など">
                    </div>

                    <div>
                        <label class="block text-gray-700 font-bold mb-2">難易度</label>
                        <select id="problem-difficulty" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                            <option value="basic" ${problem?.difficulty === 'basic' ? 'selected' : ''}>基礎</option>
                            <option value="standard" ${problem?.difficulty === 'standard' ? 'selected' : ''}>標準</option>
                            <option value="advanced" ${problem?.difficulty === 'advanced' ? 'selected' : ''}>応用</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-gray-700 font-bold mb-2">問題タイプ</label>
                        <select id="problem-type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                            <option value="calculation" ${problem?.type === 'calculation' ? 'selected' : ''}>計算</option>
                            <option value="wordProblem" ${problem?.type === 'wordProblem' ? 'selected' : ''}>文章題</option>
                            <option value="puzzle" ${problem?.type === 'puzzle' ? 'selected' : ''}>パズル</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-gray-700 font-bold mb-2">ヒント</label>
                        <textarea id="problem-hint" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200" rows="2" placeholder="問題を解くヒント">${problem?.hint || ''}</textarea>
                    </div>

                    <div>
                        <label class="block text-gray-700 font-bold mb-2">解説</label>
                        <textarea id="problem-explanation" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200" rows="3" placeholder="正解の解説">${problem?.explanation || ''}</textarea>
                    </div>

                    <div class="flex space-x-4">
                        <button type="submit" class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition">
                            ${problem ? '更新' : '作成'}
                        </button>
                        <button type="button" onclick="window.history.back()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition">
                            キャンセル
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
};

// グローバルに公開
window.CustomProblems = CustomProblems;

console.log('✅ custom-problems.js ロード完了');
