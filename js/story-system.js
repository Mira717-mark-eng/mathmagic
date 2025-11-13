/**
 * マスマジ！- ストーリーシステム
 * クエストにストーリー要素を追加
 */

const StorySystem = {
    currentStory: null,
    currentChapter: null,

    /**
     * 学年のストーリーを読み込み
     */
    loadStoryForGrade: async function(gradeId) {
        try {
            console.log(`📖 ストーリー読み込み中: ${gradeId}`);
            const response = await fetch(`js/stories/${gradeId}-story.json`);

            if (!response.ok) {
                console.warn(`ストーリーファイルが見つかりません: ${gradeId}-story.json`);
                return null;
            }

            const storyData = await response.json();
            this.currentStory = storyData;
            console.log(`✅ ストーリー読み込み完了: ${storyData.storyTitle}`);
            return storyData;
        } catch (error) {
            console.error('ストーリー読み込みエラー:', error);
            return null;
        }
    },

    /**
     * クエストのストーリーを取得
     */
    getQuestStory: function(questId) {
        if (!this.currentStory) {
            return null;
        }

        for (const chapter of this.currentStory.chapters) {
            if (chapter.questStories && chapter.questStories[questId]) {
                this.currentChapter = chapter;
                return chapter.questStories[questId];
            }
        }

        return null;
    },

    /**
     * 章情報を取得
     */
    getChapterForQuest: function(questId) {
        if (!this.currentStory) {
            return null;
        }

        for (const chapter of this.currentStory.chapters) {
            if (chapter.questIds.includes(questId)) {
                return chapter;
            }
        }

        return null;
    },

    /**
     * クエスト開始前のストーリーを表示
     */
    showQuestIntro: function(questId, containerElement) {
        const questStory = this.getQuestStory(questId);

        if (!questStory || !questStory.before) {
            return false;
        }

        const player = MathMagic.getCurrentPlayer();
        const characterName = player?.name || '勇者';
        const characterIcon = player?.avatar?.characterIcon || '🧙‍♂️';

        const html = `
            <div class="story-intro animate-fade-in">
                <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="text-5xl mr-3">${characterIcon}</div>
                        <div>
                            <div class="text-sm text-gray-600">勇者</div>
                            <div class="text-xl font-bold text-gray-800">${characterName}</div>
                        </div>
                    </div>

                    ${this.currentChapter && this.currentChapter.title ? `
                        <div class="bg-white/60 rounded-lg p-3 mb-4">
                            <div class="text-xs text-purple-600 font-bold">📖 ${this.currentChapter.title}</div>
                        </div>
                    ` : ''}

                    <div class="bg-white rounded-lg p-4 mb-4">
                        <p class="text-gray-700 leading-relaxed">${questStory.before}</p>
                    </div>

                    ${questStory.npcDialogue ? `
                        <div class="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                            <p class="text-gray-700 italic">${questStory.npcDialogue}</p>
                        </div>
                    ` : ''}

                    <button id="start-quest-btn" class="story-start-btn w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition">
                        冒険を始める ⚔️
                    </button>
                </div>
            </div>
        `;

        containerElement.innerHTML = html;
        return true;
    },

    /**
     * クエスト完了後のストーリーを表示
     */
    showQuestOutro: function(questId, containerElement, clearStatus = 'success') {
        const questStory = this.getQuestStory(questId);

        if (!questStory) {
            return false;
        }

        const message = clearStatus === 'success' ? questStory.after : questStory.failure;

        if (!message) {
            return false;
        }

        const player = MathMagic.getCurrentPlayer();
        const characterName = player?.name || '勇者';
        const characterIcon = player?.avatar?.characterIcon || '🧙‍♂️';

        // 章の最後のクエストかチェック
        const isChapterEnd = this.currentChapter &&
            this.currentChapter.questIds[this.currentChapter.questIds.length - 1] === questId;

        const html = `
            <div class="story-outro animate-fade-in">
                <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="text-5xl mr-3">${characterIcon}</div>
                        <div>
                            <div class="text-sm text-gray-600">勇者</div>
                            <div class="text-xl font-bold text-gray-800">${characterName}</div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg p-4 mb-4">
                        <p class="text-gray-700 leading-relaxed">${message}</p>
                    </div>

                    ${questStory.npcDialogue ? `
                        <div class="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4 mb-4">
                            <p class="text-gray-700 italic">${questStory.npcDialogue}</p>
                        </div>
                    ` : ''}

                    ${isChapterEnd && this.currentChapter.chapterEnd ? `
                        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                            <div class="text-sm font-bold text-yellow-800 mb-2">🎭 ${this.currentChapter.title} - 完</div>
                            <p class="text-gray-700">${this.currentChapter.chapterEnd}</p>
                        </div>
                    ` : ''}

                    <button id="continue-btn" class="story-next-btn w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition">
                        次へ進む →
                    </button>
                </div>
            </div>
        `;

        containerElement.innerHTML = html;
        return true;
    },

    /**
     * 章のイントロを表示（ワールドマップ用）
     */
    showChapterIntro: function(chapterId, containerElement) {
        if (!this.currentStory) {
            return false;
        }

        const chapter = this.currentStory.chapters.find(ch => ch.chapterId === chapterId);

        if (!chapter || !chapter.intro) {
            return false;
        }

        const html = `
            <div class="chapter-intro animate-fade-in">
                <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg">
                    <div class="text-center mb-4">
                        <div class="text-3xl font-bold text-gray-800 mb-2">
                            ${chapter.title}
                        </div>
                        <div class="text-sm text-purple-600">
                            ${this.currentStory.storyTitle}
                        </div>
                    </div>

                    <div class="bg-white rounded-lg p-4 mb-4">
                        <p class="text-gray-700 leading-relaxed">${chapter.intro}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>📍 クエスト数: ${chapter.questIds.length}</div>
                        <div>⭐ 推奨レベル: ${chapter.recommendedLevel || '制限なし'}</div>
                    </div>
                </div>
            </div>
        `;

        containerElement.innerHTML = html;
        return true;
    },

    /**
     * 進捗保存
     */
    saveStoryProgress: function(gradeId, chapterId, questId) {
        const player = MathMagic.getCurrentPlayer();

        if (!player) {
            return;
        }

        if (!player.storyProgress) {
            player.storyProgress = {};
        }

        if (!player.storyProgress[gradeId]) {
            player.storyProgress[gradeId] = {
                currentChapter: chapterId,
                completedQuests: []
            };
        }

        const gradeProgress = player.storyProgress[gradeId];

        if (!gradeProgress.completedQuests.includes(questId)) {
            gradeProgress.completedQuests.push(questId);
        }

        gradeProgress.currentChapter = chapterId;

        PlayerManager.updatePlayer(player);
        console.log(`💾 ストーリー進捗保存: ${gradeId} - ${questId}`);
    },

    /**
     * 進捗取得
     */
    getStoryProgress: function(gradeId) {
        const player = MathMagic.getCurrentPlayer();

        if (!player || !player.storyProgress || !player.storyProgress[gradeId]) {
            return {
                currentChapter: 1,
                completedQuests: []
            };
        }

        return player.storyProgress[gradeId];
    }
};

// グローバルに公開
window.StorySystem = StorySystem;

console.log('✅ story-system.js ロード完了');
