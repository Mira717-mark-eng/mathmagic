/**
 * マスマジ！- 図形問題生成システム
 * 中1図形向けの体験型問題を動的生成
 */

const GeometryGenerator = {
    /**
     * ランダムな整数を生成
     */
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    /**
     * 配列からランダムに選択
     */
    randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],

    /**
     * 問題タイプ1: 理解型（角度の理解）
     */
    angleUnderstanding: {
        // パターン1: 対頂角の発見（案2: 補角から推理する）
        verticalAngles: function() {
            const angle1 = GeometryGenerator.random(30, 80);  // 角①
            const angle2 = 180 - angle1;  // 角②
            // 角③ = angle1（対頂角）
            // 角④ = angle2（対頂角）

            return {
                type: 'geometry-understanding',
                category: 'angles',
                title: '📐 角度の不思議を発見しよう',
                story: '2本の直線が交わったとき、角①②③④ができるよ。図を見てみよう！',
                visualizationType: 'intersecting-lines',
                visualData: {
                    angle1: angle1,
                    angle2: angle2,
                    showLabels: true,
                    showAngles: [false, true, false, true],  // 角②と角④だけ表示
                    interactive: true
                },
                questions: [
                    {
                        text: `角②は${angle2}度だね。角①と角②を足すと180度になるよ（直線だから）。じゃあ、角①は何度？`,
                        answer: angle1,
                        type: 'number',
                        hint: `180度 - ${angle2}度 を計算してみよう`
                    },
                    {
                        text: `次は下の角を考えよう。角③と角④を足すと何度になる？`,
                        answer: 180,
                        type: 'number',
                        hint: 'これも直線だから...'
                    },
                    {
                        text: `角④は${angle2}度だね。じゃあ、角③は何度？`,
                        answer: angle1,
                        type: 'number',
                        hint: `180度 - ${angle2}度 だよ`
                    },
                    {
                        text: `気づいた？角①と角③を比べてみて。どう思う？`,
                        answer: 'same',
                        type: 'choice',
                        choices: ['同じ', '違う'],
                        explanation: `そう！角①=${angle1}度、角③=${angle1}度。向かい合っている角（対頂角）はいつも等しいんだ！`
                    }
                ],
                learningPoint: '対頂角は補角の関係から考えるといつも等しくなる！'
            };
        },

        // パターン2: 補角の理解
        supplementaryAngles: function() {
            const angle1 = GeometryGenerator.random(30, 150);
            const angle2 = 180 - angle1;
            const location = GeometryGenerator.randomChoice(['教室', '図書室', 'ドアの角', '窓の角']);

            return {
                type: 'geometry-understanding',
                category: 'angles',
                title: '🚪 補角の秘密',
                story: `${location}の角度を調べてみよう！`,
                visualizationType: 'supplementary-angles',
                visualData: {
                    angle1: angle1,
                    angle2: angle2,
                    location: location,
                    showAngleValues: false  // 角度の値は隠す
                },
                questions: [
                    {
                        text: `角Aは${angle1}度です。角Aと合わせて180度になる角Bは何度？`,
                        answer: angle2,
                        type: 'number',
                        hint: '180度から引いてみよう'
                    },
                    {
                        text: '足して180度になる2つの角を何という？',
                        answer: '補角',
                        type: 'text',
                        alternativeAnswers: ['ほかく', 'ホカク'],
                        explanation: 'その通り！「補角」だね。お互いを補い合って180度になるから「補角」なんだ'
                    }
                ],
                learningPoint: '補角は2つの角を足すと180度！'
            };
        }
    },

    /**
     * 問題タイプ2: 生活応用型（三角形の実用）
     */
    triangleRealLife: {
        // パターン1: 三角形の内角の和
        triangleAngles: function() {
            const angle1 = GeometryGenerator.random(30, 80);
            const angle2 = GeometryGenerator.random(30, 100);
            const angle3 = 180 - angle1 - angle2;

            const scenarios = [
                { name: '三角形の屋根', item: '屋根', emoji: '🏠' },
                { name: '三角サンドイッチ', item: 'サンドイッチ', emoji: '🥪' },
                { name: '三角の旗', item: '旗', emoji: '🚩' },
                { name: 'ピラミッド', item: 'ピラミッド', emoji: '🔺' }
            ];

            const scenario = GeometryGenerator.randomChoice(scenarios);

            return {
                type: 'geometry-real-life',
                category: 'triangles',
                title: `${scenario.emoji} ${scenario.name}の角度`,
                story: `${scenario.item}の角度を測ってみよう！`,
                visualizationType: 'triangle-angles',
                visualData: {
                    angle1: angle1,
                    angle2: angle2,
                    angle3: angle3,
                    scenario: scenario.name,
                    showAngles: [true, true, false]
                },
                questions: [
                    {
                        text: `角Aは${angle1}度、角Bは${angle2}度です。角Cは何度？`,
                        answer: angle3,
                        type: 'number',
                        hint: '三角形の3つの角を全部足すと180度になるよ'
                    },
                    {
                        text: '確かめてみよう。3つの角を足すといくつ？',
                        answer: 180,
                        type: 'number',
                        calculation: `${angle1} + ${angle2} + ${angle3}`,
                        explanation: 'そう！三角形の内角の和は必ず180度なんだ！'
                    },
                    {
                        text: 'どんな三角形でも3つの角を足すと180度になるかな？',
                        answer: 'yes',
                        type: 'yes-no',
                        explanation: 'その通り！これが「三角形の内角の和」だよ！'
                    }
                ],
                learningPoint: '三角形の内角の和は必ず180度！'
            };
        },

        // パターン2: 三角形の種類
        triangleTypes: function() {
            const types = [
                {
                    name: '正三角形',
                    angles: [60, 60, 60],
                    property: '3つの辺と3つの角がすべて等しい',
                    realExample: '道路標識'
                },
                {
                    name: '直角三角形',
                    angles: [90, 45, 45],
                    property: '90度の角が1つある',
                    realExample: '三角定規'
                },
                {
                    name: '二等辺三角形',
                    angles: [80, 50, 50],
                    property: '2つの辺と2つの角が等しい',
                    realExample: '三角の屋根'
                }
            ];

            const triangle = GeometryGenerator.randomChoice(types);

            return {
                type: 'geometry-real-life',
                category: 'triangle-types',
                title: '🔍 三角形探偵',
                story: '三角形の種類を見抜こう！',
                visualizationType: 'triangle-identification',
                visualData: {
                    angles: triangle.angles,
                    showType: false
                },
                questions: [
                    {
                        text: `この三角形の角度は${triangle.angles[0]}度、${triangle.angles[1]}度、${triangle.angles[2]}度です。`,
                        type: 'info'
                    },
                    {
                        text: 'この三角形は何という名前？',
                        answer: triangle.name,
                        type: 'text',
                        choices: ['正三角形', '直角三角形', '二等辺三角形'],
                        hint: triangle.property
                    },
                    {
                        text: `身の回りで${triangle.name}を見つけられる？例えば？`,
                        answer: 'open',
                        type: 'open',
                        example: triangle.realExample
                    }
                ],
                learningPoint: `${triangle.name}の特徴: ${triangle.property}`
            };
        }
    },

    /**
     * 問題タイプ3: 比較・推理型（面積の比較）
     */
    areaLogic: {
        // パターン1: 面積の比較
        compareAreas: function() {
            const base1 = GeometryGenerator.random(4, 10);
            const height1 = GeometryGenerator.random(4, 10);
            const area1 = base1 * height1;

            const base2 = GeometryGenerator.random(4, 10);
            const height2 = GeometryGenerator.random(4, 10);
            const area2 = base2 * height2;

            const shapes = [
                { name: 'お菓子箱A', emoji: '📦' },
                { name: '花壇A', emoji: '🌸' },
                { name: 'カーペットA', emoji: '🟦' }
            ];

            const shape = GeometryGenerator.randomChoice(shapes);
            const shapeB = shape.name.replace('A', 'B');

            return {
                type: 'geometry-logic',
                category: 'area',
                title: '🎯 面積バトル',
                story: '2つの長方形があります。面積を計算して比べてみよう！',
                visualizationType: 'area-comparison',
                visualData: {
                    shape1: { base: base1, height: height1, name: shape.name },
                    shape2: { base: base2, height: height2, name: shapeB },
                    showAreas: false
                },
                questions: [
                    {
                        text: `${shape.name}は底辺${base1}cm×高さ${height1}cm。面積は何cm²？`,
                        answer: area1,
                        type: 'number',
                        hint: '長方形の面積は 底辺×高さ だよ'
                    },
                    {
                        text: `${shapeB}は底辺${base2}cm×高さ${height2}cm。面積は何cm²？`,
                        answer: area2,
                        type: 'number'
                    },
                    {
                        text: 'どっちが広い？（AかBで答えてね）',
                        answer: area1 > area2 ? 'A' : 'B',
                        type: 'text',
                        choices: ['A', 'B', '同じ'],
                        explanation: `${shape.name}は${area1}cm²、${shapeB}は${area2}cm²。だから${area1 > area2 ? 'A' : 'B'}の方が広いね！`
                    },
                    {
                        text: '何cm²の差がある？',
                        answer: Math.abs(area1 - area2),
                        type: 'number',
                        explanation: `${area1}cm² と ${area2}cm² の差は ${Math.abs(area1 - area2)}cm² だね！`
                    }
                ],
                learningPoint: '面積を計算して比べよう！'
            };
        },

        // パターン2: 三角形の面積
        triangleArea: function() {
            const base = GeometryGenerator.random(6, 12);
            const height = GeometryGenerator.random(4, 10);
            const area = (base * height) / 2;

            const scenarios = [
                { name: '三角形の花壇', emoji: '🌻', context: '花を植えるスペース' },
                { name: '三角の土地', emoji: '🏡', context: '家を建てる場所' },
                { name: '三角のケーキ', emoji: '🍰', context: 'ケーキの大きさ' }
            ];

            const scenario = GeometryGenerator.randomChoice(scenarios);

            return {
                type: 'geometry-logic',
                category: 'triangle-area',
                title: `${scenario.emoji} ${scenario.name}`,
                story: `${scenario.context}を計算しよう！`,
                visualizationType: 'triangle-area',
                visualData: {
                    base: base,
                    height: height,
                    scenario: scenario.name,
                    showFormula: false
                },
                questions: [
                    {
                        text: `底辺${base}cm、高さ${height}cmの三角形だよ。`,
                        type: 'info'
                    },
                    {
                        text: '長方形だったら面積はいくつ？',
                        answer: base * height,
                        type: 'number',
                        hint: '底辺×高さ だよ'
                    },
                    {
                        text: '三角形は長方形の半分だよね。だから面積は？',
                        answer: area,
                        type: 'number',
                        hint: `${base * height} ÷ 2 を計算してみよう`,
                        explanation: `三角形の面積 = 底辺×高さ÷2 = ${base}×${height}÷2 = ${area}cm²`
                    }
                ],
                learningPoint: '三角形の面積 = 底辺×高さ÷2'
            };
        }
    },

    /**
     * 問題タイプ4: 間違い探し型
     */
    geometryErrors: {
        findMistake: function() {
            const mistakes = [
                {
                    problem: '三角形の角',
                    wrong: '90° + 60° + 40° = 190°',
                    correct: 180,
                    reason: '三角形の内角の和は180度だよ',
                    wrongCalc: 190
                },
                {
                    problem: '対頂角',
                    wrong: '角Aが50度なら、対頂角は130度',
                    correct: 50,
                    reason: '対頂角は等しいから、50度だよ',
                    wrongCalc: 130
                },
                {
                    problem: '三角形の面積',
                    wrong: '底辺6cm×高さ4cm = 24cm²',
                    correct: 12,
                    reason: '三角形は÷2を忘れずに！6×4÷2 = 12cm²',
                    wrongCalc: 24
                }
            ];

            const mistake = GeometryGenerator.randomChoice(mistakes);

            return {
                type: 'geometry-error',
                category: 'error-finding',
                title: '🔍 間違い探し探偵',
                story: '友達のノートに間違いがあるよ！',
                visualizationType: 'student-work',
                visualData: {
                    studentAnswer: mistake.wrong,
                    problem: mistake.problem
                },
                questions: [
                    {
                        text: `友達が「${mistake.wrong}」と書いてたよ。`,
                        type: 'info'
                    },
                    {
                        text: 'これ、合ってる？間違ってる？',
                        answer: 'wrong',
                        type: 'choice',
                        choices: ['合ってる', '間違ってる']
                    },
                    {
                        text: '正しい答えは何？',
                        answer: mistake.correct,
                        type: 'number'
                    },
                    {
                        text: 'どうして間違えたと思う？',
                        answer: 'open',
                        type: 'open',
                        hint: mistake.reason
                    }
                ],
                learningPoint: mistake.reason
            };
        }
    },

    /**
     * 問題タイプ5: 創造型（自分で図形を作る）
     */
    geometryCreative: {
        createShape: function() {
            const targetAngle = GeometryGenerator.random(30, 150);

            return {
                type: 'geometry-creative',
                category: 'angle-creation',
                title: '✏️ 角度を作ってみよう',
                story: '指定された角度を作れるかな？',
                visualizationType: 'angle-creator',
                visualData: {
                    targetAngle: targetAngle,
                    interactive: true,
                    tools: ['protractor', 'ruler']
                },
                questions: [
                    {
                        text: `${targetAngle}度の角を作ってみよう！`,
                        answer: targetAngle,
                        type: 'interactive',
                        tolerance: 5,
                        hint: '分度器を使って測りながら描いてみよう'
                    },
                    {
                        text: `できた角の補角は何度？`,
                        answer: 180 - targetAngle,
                        type: 'number',
                        explanation: `180° - ${targetAngle}° = ${180 - targetAngle}° だね！`
                    }
                ],
                learningPoint: '角度を自分で作ると理解が深まる！'
            };
        },

        designTriangle: function() {
            const angle1 = GeometryGenerator.random(40, 80);
            const angle2 = GeometryGenerator.random(40, 100);
            const angle3 = 180 - angle1 - angle2;

            return {
                type: 'geometry-creative',
                category: 'triangle-design',
                title: '🎨 三角形デザイナー',
                story: '条件に合う三角形を描いてみよう！',
                visualizationType: 'triangle-designer',
                visualData: {
                    constraints: {
                        angle1: angle1,
                        angle2: angle2
                    },
                    interactive: true
                },
                questions: [
                    {
                        text: `角Aが${angle1}度、角Bが${angle2}度の三角形を描こう。`,
                        type: 'info'
                    },
                    {
                        text: '残りの角Cは何度になる？',
                        answer: angle3,
                        type: 'number',
                        hint: '三角形の内角の和は180度だよ'
                    },
                    {
                        text: 'この三角形は何という種類？',
                        answer: 'open',
                        type: 'open',
                        hint: angle3 === 90 ? '直角三角形' : angle1 === angle2 || angle2 === angle3 || angle1 === angle3 ? '二等辺三角形' : '普通の三角形（不等辺三角形）'
                    }
                ],
                learningPoint: '角度から三角形の種類がわかる！'
            };
        }
    },

    /**
     * 問題タイプ6: 分解・構造型（図形の分解）
     */
    geometryStructure: {
        decomposeShape: function() {
            const width = GeometryGenerator.random(6, 12);
            const height = GeometryGenerator.random(4, 10);
            const cutPosition = GeometryGenerator.random(2, width - 2);

            return {
                type: 'geometry-structure',
                category: 'decomposition',
                title: '✂️ 図形を分けてみよう',
                story: '長方形を2つの図形に分けるよ！',
                visualizationType: 'shape-decomposition',
                visualData: {
                    shape: 'rectangle',
                    width: width,
                    height: height,
                    cutPosition: cutPosition,
                    showCut: true
                },
                questions: [
                    {
                        text: `長方形（${width}cm × ${height}cm）を縦に切るよ。`,
                        type: 'info'
                    },
                    {
                        text: '左側の長方形の幅は何cm？',
                        answer: cutPosition,
                        type: 'number'
                    },
                    {
                        text: '左側の面積は？',
                        answer: cutPosition * height,
                        type: 'number',
                        hint: `${cutPosition}cm × ${height}cm`
                    },
                    {
                        text: '右側の面積は？',
                        answer: (width - cutPosition) * height,
                        type: 'number'
                    },
                    {
                        text: '2つの面積を足すと、元の長方形の面積と同じ？',
                        answer: 'yes',
                        type: 'yes-no',
                        explanation: `そう！${cutPosition * height} + ${(width - cutPosition) * height} = ${width * height}cm² だね！`
                    }
                ],
                learningPoint: '図形を分けても、面積の合計は変わらない！'
            };
        },

        triangleInRectangle: function() {
            const width = GeometryGenerator.random(6, 12);
            const height = GeometryGenerator.random(4, 10);

            return {
                type: 'geometry-structure',
                category: 'structure',
                title: '🔺 長方形の中の三角形',
                story: '長方形を対角線で切ると...？',
                visualizationType: 'triangle-in-rectangle',
                visualData: {
                    width: width,
                    height: height,
                    showDiagonal: true
                },
                questions: [
                    {
                        text: `長方形（${width}cm × ${height}cm）があるよ。`,
                        type: 'info'
                    },
                    {
                        text: '長方形の面積は？',
                        answer: width * height,
                        type: 'number'
                    },
                    {
                        text: '対角線で切ると、三角形が2つできるね。1つの三角形の面積は？',
                        answer: (width * height) / 2,
                        type: 'number',
                        hint: '長方形の半分だよ'
                    },
                    {
                        text: 'なるほど！三角形の面積の公式「底辺×高さ÷2」と同じになった？',
                        answer: 'yes',
                        type: 'yes-no',
                        explanation: `そう！底辺${width}cm × 高さ${height}cm ÷ 2 = ${(width * height) / 2}cm²`
                    }
                ],
                learningPoint: '三角形は長方形の半分！だから÷2するんだ！'
            };
        }
    },

    /**
     * バランスの取れた問題セットを生成
     */
    generateBalancedSet: function(count = 15) {
        const problems = [];

        // 6つのタイプから均等に生成
        const typeDistribution = {
            angleUnderstanding: 3,
            triangleRealLife: 3,
            areaLogic: 3,
            geometryErrors: 2,
            geometryCreative: 2,
            geometryStructure: 2
        };

        // 各タイプから問題を生成
        for (const [typeName, typeCount] of Object.entries(typeDistribution)) {
            const typeObj = this[typeName];
            const methods = Object.keys(typeObj).filter(key => typeof typeObj[key] === 'function');

            for (let i = 0; i < typeCount; i++) {
                const method = this.randomChoice(methods);
                const problem = typeObj[method]();
                problems.push(problem);
            }
        }

        // シャッフル
        return this.shuffleArray(problems);
    },

    /**
     * 配列をシャッフル
     */
    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * 特定のカテゴリの問題を生成
     */
    generateByCategory: function(category, count = 10) {
        const problems = [];
        const allTypes = [
            this.angleUnderstanding,
            this.triangleRealLife,
            this.areaLogic,
            this.geometryErrors,
            this.geometryCreative,
            this.geometryStructure
        ];

        for (let i = 0; i < count; i++) {
            const typeObj = this.randomChoice(allTypes);
            const methods = Object.keys(typeObj).filter(key => typeof typeObj[key] === 'function');
            const method = this.randomChoice(methods);
            const problem = typeObj[method]();

            if (!category || problem.category === category) {
                problems.push(problem);
            }
        }

        return problems;
    }
};

// グローバルスコープに追加
window.GeometryGenerator = GeometryGenerator;

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeometryGenerator;
}

console.log('✅ geometry-generator.js ロード完了');
console.log('window.GeometryGenerator:', window.GeometryGenerator);
