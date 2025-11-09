/**
 * マスマジ！- ワールドデータベース
 * 文部科学省カリキュラムに準拠した全学年対応ワールド
 */

// ワールドデータベース
const WORLD_DATABASE = [
    // ===========================================
    // 小学1年生（4ワールド）
    // ===========================================
    {
        id: 'grade1_counting',
        name: '数の村',
        icon: '🏘️',
        targetGrade: 1,
        minGrade: 1,
        maxGrade: 1,
        difficulty: 1,
        requiredLevel: 1,
        unitName: '数の数え方（1～10）',
        description: '数を数える基礎を学ぼう',
        story: '魔法の村へようこそ！まずは1から10までの数を数える冒険に出よう。',
        totalProblems: 10,
        xpRange: [30, 50],
        phase: 1,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '小学1年生向けの数の数え方問題を生成してください。1～10の範囲で、「りんごが何個？」のような具体物を数える問題にしてください。',
            examples: ['りんごが 5 こあります。いくつ？', 'えんぴつは 3 ぼんです。いくつ？']
        },
        hasFigure: true,
        figureType: 'counting'
    },
    {
        id: 'grade1_addition',
        name: 'たし算の道',
        icon: '➕',
        targetGrade: 1,
        minGrade: 1,
        maxGrade: 1,
        difficulty: 1,
        requiredLevel: 1,
        unitName: 'たし算（答えが10まで）',
        description: '数を合わせる魔法を学ぼう',
        story: '魔法の道を進むには、たし算の力が必要だ。数を合わせる魔法を覚えよう！',
        totalProblems: 10,
        xpRange: [30, 50],
        phase: 1,
        status: 'available',
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '小学1年生向けのたし算問題（答えが10まで）を生成してください。',
            examples: ['2 + 3', '4 + 5', '1 + 6', '3 + 4']
        },
        hasFigure: false
    },
    {
        id: 'grade1_subtraction',
        name: 'ひき算の橋',
        icon: '➖',
        targetGrade: 1,
        minGrade: 1,
        maxGrade: 1,
        difficulty: 1,
        requiredLevel: 2,
        unitName: 'ひき算（10まで）',
        description: '数を引く魔法を学ぼう',
        story: '橋を渡るには、ひき算の力が必要だ。数を減らす魔法を覚えよう！',
        totalProblems: 10,
        xpRange: [30, 50],
        phase: 1,
        status: 'available',
        prerequisite: 'grade1_addition',
        aiGeneration: {
            enabled: true,
            prompt: '小学1年生向けのひき算問題（10まで）を生成してください。',
            examples: ['5 - 2', '8 - 3', '10 - 4', '7 - 5']
        },
        hasFigure: false
    },
    {
        id: 'grade1_large_numbers',
        name: '大きな数の丘',
        icon: '🏔️',
        targetGrade: 1,
        minGrade: 1,
        maxGrade: 1,
        difficulty: 2,
        requiredLevel: 3,
        unitName: '大きな数（20まで）',
        description: '20までの数を学ぼう',
        story: '丘の上には、もっと大きな数の世界が広がっている。20までの数をマスターしよう！',
        totalProblems: 10,
        xpRange: [40, 60],
        phase: 1,
        status: 'available',
        prerequisite: 'grade1_subtraction',
        aiGeneration: {
            enabled: true,
            prompt: '小学1年生向けの20までの数の問題を生成してください。たし算、ひき算を含めてください。',
            examples: ['12 + 5', '18 - 6', '11 + 8', '20 - 9']
        },
        hasFigure: false
    },

    // ===========================================
    // 小学2年生（5ワールド）
    // ===========================================
    {
        id: 'grade2_addition_2digit',
        name: '2けたのたし算城',
        icon: '🏰',
        targetGrade: 2,
        minGrade: 2,
        maxGrade: 2,
        difficulty: 2,
        requiredLevel: 1,
        unitName: '2けたのたし算',
        description: '2けたの数を足す力を学ぼう',
        story: 'お城に入るには、2けたのたし算をマスターする必要がある。勇者よ、力を示せ！',
        totalProblems: 10,
        xpRange: [40, 60],
        phase: 1,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '小学2年生向けの2けたのたし算問題を生成してください。繰り上がりありとなしを混ぜてください。',
            examples: ['23 + 14', '36 + 27', '45 + 32', '18 + 56']
        },
        hasFigure: false
    },
    {
        id: 'grade2_subtraction_2digit',
        name: '2けたのひき算谷',
        icon: '🏜️',
        targetGrade: 2,
        minGrade: 2,
        maxGrade: 2,
        difficulty: 2,
        requiredLevel: 2,
        unitName: '2けたのひき算',
        description: '2けたの数を引く力を学ぼう',
        story: '谷を越えるには、2けたのひき算をマスターする必要がある。慎重に計算しよう！',
        totalProblems: 10,
        xpRange: [40, 60],
        phase: 1,
        status: 'available',
        prerequisite: 'grade2_addition_2digit',
        aiGeneration: {
            enabled: true,
            prompt: '小学2年生向けの2けたのひき算問題を生成してください。繰り下がりありとなしを混ぜてください。',
            examples: ['47 - 23', '64 - 38', '82 - 15', '50 - 27']
        },
        hasFigure: false
    },
    {
        id: 'grade2_multiplication_intro',
        name: 'かけ算の入口',
        icon: '✖️',
        targetGrade: 2,
        minGrade: 2,
        maxGrade: 2,
        difficulty: 2,
        requiredLevel: 3,
        unitName: 'かけ算の始まり（2の段～5の段）',
        description: 'かけ算の基礎を学ぼう',
        story: '魔法の入口に立つと、かけ算の魔法が使えるようになる。まずは簡単な段から始めよう！',
        totalProblems: 10,
        xpRange: [50, 70],
        phase: 1,
        status: 'available',
        prerequisite: 'grade2_subtraction_2digit',
        aiGeneration: {
            enabled: true,
            prompt: '小学2年生向けのかけ算問題（2の段、3の段、4の段、5の段）を生成してください。',
            examples: ['2 × 3', '3 × 4', '4 × 5', '5 × 6']
        },
        hasFigure: false
    },
    {
        id: 'grade2_length',
        name: '長さの川',
        icon: '📏',
        targetGrade: 2,
        minGrade: 2,
        maxGrade: 2,
        difficulty: 2,
        requiredLevel: 4,
        unitName: '長さ（cm、m）',
        description: '長さを測る魔法を学ぼう',
        story: '川の幅を測るには、長さの単位を知る必要がある。cmとmを使いこなそう！',
        totalProblems: 10,
        xpRange: [40, 60],
        phase: 1,
        status: 'available',
        prerequisite: 'grade2_multiplication_intro',
        aiGeneration: {
            enabled: true,
            prompt: '小学2年生向けの長さの問題（cm、m）を生成してください。単位換算や長さの比較を含めてください。',
            examples: ['50cm + 30cm', '1m = □cm', '80cm は 1m より 長い？短い？']
        },
        hasFigure: false
    },
    {
        id: 'grade2_time',
        name: '時こくの時計塔',
        icon: '🕐',
        targetGrade: 2,
        minGrade: 2,
        maxGrade: 2,
        difficulty: 2,
        requiredLevel: 5,
        unitName: '時こくと時間',
        description: '時計を読む魔法を学ぼう',
        story: '時計塔に登るには、時計を正しく読めなければならない。時こくと時間をマスターしよう！',
        totalProblems: 10,
        xpRange: [40, 60],
        phase: 1,
        status: 'available',
        prerequisite: 'grade2_length',
        aiGeneration: {
            enabled: true,
            prompt: '小学2年生向けの時こくと時間の問題を生成してください。時計の読み方、時間の計算を含めてください。',
            examples: ['3時30分の30分後は？', '午前9時から午後2時まで何時間？']
        },
        hasFigure: true,
        figureType: 'clock'
    },

    // ===========================================
    // 小学3年生（5ワールド）
    // ===========================================
    {
        id: 'grade3_multiplication',
        name: 'かけ算の森',
        icon: '🌲',
        targetGrade: 3,
        minGrade: 3,
        maxGrade: 3,
        difficulty: 2,
        requiredLevel: 1,
        unitName: 'かけ算（九九完成）',
        description: '九九をマスターしよう',
        story: '魔法の森には、九九の秘密が隠されている。すべての段を覚えて、真の勇者になろう！',
        totalProblems: 10,
        xpRange: [50, 80],
        phase: 1,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '小学3年生向けのかけ算問題（6の段～9の段、1の段を含む九九全体）を生成してください。',
            examples: ['6 × 7', '8 × 9', '7 × 8', '9 × 6']
        },
        hasFigure: false
    },
    {
        id: 'grade3_division',
        name: 'わり算の洞窟',
        icon: '⛰️',
        targetGrade: 3,
        minGrade: 3,
        maxGrade: 3,
        difficulty: 3,
        requiredLevel: 2,
        unitName: 'わり算（あまりなし・あり）',
        description: 'わり算の力を学ぼう',
        story: '暗い洞窟で宝物を見つけた！仲間と等しく分けるには、わり算が必要だ。',
        totalProblems: 10,
        xpRange: [50, 80],
        phase: 1,
        status: 'available',
        prerequisite: 'grade3_multiplication',
        aiGeneration: {
            enabled: true,
            prompt: '小学3年生向けのわり算問題（あまりなし、あまりあり）を生成してください。',
            examples: ['12 ÷ 3', '20 ÷ 4', '15 ÷ 4', '23 ÷ 5']
        },
        hasFigure: false
    },
    {
        id: 'grade3_large_numbers',
        name: '大きな数の塔',
        icon: '🗼',
        targetGrade: 3,
        minGrade: 3,
        maxGrade: 3,
        difficulty: 2,
        requiredLevel: 3,
        unitName: '大きな数（万の位）',
        description: '万の位までの数を学ぼう',
        story: '高い塔には、もっと大きな数の世界が待っている。万の位までマスターしよう！',
        totalProblems: 10,
        xpRange: [50, 80],
        phase: 1,
        status: 'available',
        prerequisite: 'grade3_division',
        aiGeneration: {
            enabled: true,
            prompt: '小学3年生向けの大きな数の問題（千、万の位）を生成してください。位取り、大小比較を含めてください。',
            examples: ['3000 + 2000', '5000は何千？', '9999 の次の数は？']
        },
        hasFigure: false
    },
    {
        id: 'grade3_fractions',
        name: '分数の泉',
        icon: '⛲',
        targetGrade: 3,
        minGrade: 3,
        maxGrade: 3,
        difficulty: 3,
        requiredLevel: 4,
        unitName: '分数（1/2、1/3、1/4）',
        description: '分数の基礎を学ぼう',
        story: '魔法の泉で分数の力を得よう。1つを等しく分ける魔法を覚えよう！',
        totalProblems: 10,
        xpRange: [60, 90],
        phase: 1,
        status: 'available',
        prerequisite: 'grade3_large_numbers',
        aiGeneration: {
            enabled: true,
            prompt: '小学3年生向けの分数の基礎問題（1/2、1/3、1/4などの簡単な分数）を生成してください。分数の意味、大小比較を含めてください。',
            examples: ['1/2 と 1/4 どちらが大きい？', '1を3等分すると？', '2/4 = 1/□']
        },
        hasFigure: true,
        figureType: 'fraction'
    },
    {
        id: 'grade3_circles',
        name: '円の神殿',
        icon: '⭕',
        targetGrade: 3,
        minGrade: 3,
        maxGrade: 3,
        difficulty: 2,
        requiredLevel: 5,
        unitName: '円と球',
        description: '円の性質を学ぼう',
        story: '円形の神殿には、円の秘密が隠されている。中心、半径、直径をマスターしよう！',
        totalProblems: 10,
        xpRange: [50, 80],
        phase: 1,
        status: 'available',
        prerequisite: 'grade3_fractions',
        aiGeneration: {
            enabled: true,
            prompt: '小学3年生向けの円の問題を生成してください。半径、直径、中心の概念を含めてください。',
            examples: ['半径が3cmの円の直径は？', '直径が10cmの円の半径は？']
        },
        hasFigure: true,
        figureType: 'circle'
    },

    // ===========================================
    // 小学4年生（6ワールド）
    // ===========================================
    {
        id: 'grade4_large_numbers',
        name: '億兆の宮殿',
        icon: '🏛️',
        targetGrade: 4,
        minGrade: 4,
        maxGrade: 4,
        difficulty: 3,
        requiredLevel: 1,
        unitName: '大きな数（億、兆）',
        description: '億と兆の数を学ぼう',
        story: '壮大な宮殿には、億や兆の世界が広がっている。超巨大な数をマスターしよう！',
        totalProblems: 10,
        xpRange: [60, 90],
        phase: 2,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '小学4年生向けの大きな数の問題（億、兆）を生成してください。位取り、大小比較、簡単な計算を含めてください。',
            examples: ['1億 = □万', '5億 + 3億', '10億は何億？']
        },
        hasFigure: false
    },
    {
        id: 'grade4_division_2digit',
        name: '2けたわり算の谷',
        icon: '🏔️',
        targetGrade: 4,
        minGrade: 4,
        maxGrade: 4,
        difficulty: 3,
        requiredLevel: 2,
        unitName: '2けたでわるわり算',
        description: '2けたのわり算を学ぼう',
        story: '険しい谷を越えるには、2けたでわるわり算をマスターする必要がある。',
        totalProblems: 10,
        xpRange: [60, 90],
        phase: 2,
        status: 'available',
        prerequisite: 'grade4_large_numbers',
        aiGeneration: {
            enabled: true,
            prompt: '小学4年生向けの2けたでわるわり算問題を生成してください。',
            examples: ['72 ÷ 12', '96 ÷ 16', '84 ÷ 21', '65 ÷ 13']
        },
        hasFigure: false
    },
    {
        id: 'grade4_decimals',
        name: '小数の海',
        icon: '🌊',
        targetGrade: 4,
        minGrade: 4,
        maxGrade: 4,
        difficulty: 3,
        requiredLevel: 3,
        unitName: '小数のたし算・ひき算',
        description: '小数の計算を学ぼう',
        story: '広大な海には小数の波が押し寄せる。0.1、0.01...小さな数をマスターしよう！',
        totalProblems: 10,
        xpRange: [60, 90],
        phase: 2,
        status: 'available',
        prerequisite: 'grade4_division_2digit',
        aiGeneration: {
            enabled: true,
            prompt: '小学4年生向けの小数のたし算・ひき算問題（小数第2位まで）を生成してください。',
            examples: ['1.2 + 2.3', '4.5 - 1.8', '2.35 + 1.42', '5.6 - 2.37']
        },
        hasFigure: false
    },
    {
        id: 'grade4_fractions_calc',
        name: '分数計算の島',
        icon: '🏝️',
        targetGrade: 4,
        minGrade: 4,
        maxGrade: 4,
        difficulty: 4,
        requiredLevel: 4,
        unitName: '分数のたし算・ひき算',
        description: '分数の計算を学ぼう',
        story: '孤島に眠る分数計算の秘宝。同じ分母の分数のたし算・ひき算を覚えよう！',
        totalProblems: 10,
        xpRange: [70, 100],
        phase: 2,
        status: 'available',
        prerequisite: 'grade4_decimals',
        aiGeneration: {
            enabled: true,
            prompt: '小学4年生向けの分数のたし算・ひき算問題（同じ分母）を生成してください。',
            examples: ['1/4 + 2/4', '3/5 - 1/5', '2/8 + 3/8', '5/6 - 2/6']
        },
        hasFigure: true,
        figureType: 'fraction'
    },
    {
        id: 'grade4_area',
        name: '面積の広場',
        icon: '📐',
        targetGrade: 4,
        minGrade: 4,
        maxGrade: 4,
        difficulty: 3,
        requiredLevel: 5,
        unitName: '面積（長方形、正方形）',
        description: '面積の計算を学ぼう',
        story: '広い広場に描かれた図形。縦×横で面積を求める魔法を習得しよう！',
        totalProblems: 10,
        xpRange: [60, 90],
        phase: 2,
        status: 'available',
        prerequisite: 'grade4_fractions_calc',
        aiGeneration: {
            enabled: true,
            prompt: '小学4年生向けの面積問題（長方形、正方形）を生成してください。',
            examples: ['長方形 縦3cm × 横5cm', '正方形 一辺7cm', '縦4m × 横6m']
        },
        hasFigure: true,
        figureType: 'area'
    },
    {
        id: 'grade4_angles',
        name: '角度の塔',
        icon: '📊',
        targetGrade: 4,
        minGrade: 4,
        maxGrade: 4,
        difficulty: 3,
        requiredLevel: 6,
        unitName: '角度（度）',
        description: '角度の測り方を学ぼう',
        story: '高い塔で角度を学ぼう。直角、鋭角、鈍角を見分ける力を身につけよう！',
        totalProblems: 10,
        xpRange: [60, 90],
        phase: 2,
        status: 'available',
        prerequisite: 'grade4_area',
        aiGeneration: {
            enabled: true,
            prompt: '小学4年生向けの角度の問題を生成してください。直角、鋭角、鈍角の判別、角度の大小比較を含めてください。',
            examples: ['直角は何度？', '90度より大きい角は？', '180度は何という？']
        },
        hasFigure: true,
        figureType: 'angle'
    },

    // ===========================================
    // 小学5年生（6ワールド）
    // ===========================================
    {
        id: 'grade5_decimal_mult',
        name: '小数かけ算の洞窟',
        icon: '🕳️',
        targetGrade: 5,
        minGrade: 5,
        maxGrade: 5,
        difficulty: 4,
        requiredLevel: 1,
        unitName: '小数のかけ算',
        description: '小数のかけ算を学ぼう',
        story: '洞窟の奥で小数のかけ算の秘密を解き明かそう。位を揃えて計算だ！',
        totalProblems: 10,
        xpRange: [70, 100],
        phase: 2,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '小学5年生向けの小数のかけ算問題を生成してください。',
            examples: ['2.3 × 4', '1.5 × 6', '0.8 × 5', '3.2 × 7']
        },
        hasFigure: false
    },
    {
        id: 'grade5_decimal_div',
        name: '小数わり算の川',
        icon: '🏞️',
        targetGrade: 5,
        minGrade: 5,
        maxGrade: 5,
        difficulty: 4,
        requiredLevel: 2,
        unitName: '小数のわり算',
        description: '小数のわり算を学ぼう',
        story: '川を渡るには小数のわり算が必要だ。小数点の位置に気をつけよう！',
        totalProblems: 10,
        xpRange: [70, 100],
        phase: 2,
        status: 'available',
        prerequisite: 'grade5_decimal_mult',
        aiGeneration: {
            enabled: true,
            prompt: '小学5年生向けの小数のわり算問題を生成してください。',
            examples: ['4.8 ÷ 2', '7.2 ÷ 3', '6.4 ÷ 4', '9.6 ÷ 8']
        },
        hasFigure: false
    },
    {
        id: 'grade5_fractions_mult_div',
        name: '分数かけわりの森',
        icon: '🌳',
        targetGrade: 5,
        minGrade: 5,
        maxGrade: 5,
        difficulty: 5,
        requiredLevel: 3,
        unitName: '分数のかけ算・わり算',
        description: '分数のかけ算・わり算を学ぼう',
        story: '深い森で分数のかけ算とわり算をマスター。分母×分母、分子×分子だ！',
        totalProblems: 10,
        xpRange: [80, 110],
        phase: 2,
        status: 'available',
        prerequisite: 'grade5_decimal_div',
        aiGeneration: {
            enabled: true,
            prompt: '小学5年生向けの分数のかけ算・わり算問題を生成してください。約分も含めてください。',
            examples: ['1/2 × 2/3', '3/4 ÷ 1/2', '2/5 × 3/4', '5/6 ÷ 2/3']
        },
        hasFigure: true,
        figureType: 'fraction'
    },
    {
        id: 'grade5_volume',
        name: '体積の宝箱',
        icon: '📦',
        targetGrade: 5,
        minGrade: 5,
        maxGrade: 5,
        difficulty: 4,
        requiredLevel: 4,
        unitName: '体積（立方体、直方体）',
        description: '体積の計算を学ぼう',
        story: '宝箱に入る宝の量は？縦×横×高さで体積を求めよう！',
        totalProblems: 10,
        xpRange: [70, 100],
        phase: 2,
        status: 'available',
        prerequisite: 'grade5_fractions_mult_div',
        aiGeneration: {
            enabled: true,
            prompt: '小学5年生向けの体積問題（立方体、直方体）を生成してください。cm³やm³の単位を使ってください。',
            examples: ['立方体 一辺5cm', '直方体 縦3cm×横4cm×高さ5cm', '縦2m×横3m×高さ4m']
        },
        hasFigure: true,
        figureType: 'solid'
    },
    {
        id: 'grade5_ratio',
        name: '比の湖',
        icon: '🎯',
        targetGrade: 5,
        minGrade: 5,
        maxGrade: 5,
        difficulty: 4,
        requiredLevel: 5,
        unitName: '割合と比',
        description: '割合と比を学ぼう',
        story: '湖に映る2つの影。比と割合の関係を理解しよう！',
        totalProblems: 10,
        xpRange: [70, 100],
        phase: 2,
        status: 'available',
        prerequisite: 'grade5_volume',
        aiGeneration: {
            enabled: true,
            prompt: '小学5年生向けの割合と比の問題を生成してください。百分率も含めてください。',
            examples: ['20の30%は？', '100の15%は？', '比 2:3 で60を分けると？']
        },
        hasFigure: false
    },
    {
        id: 'grade5_average',
        name: '平均の天文台',
        icon: '🔭',
        targetGrade: 5,
        minGrade: 5,
        maxGrade: 5,
        difficulty: 4,
        requiredLevel: 6,
        unitName: '平均',
        description: '平均の求め方を学ぼう',
        story: '天文台で星の観測。合計÷個数で平均を求めよう！',
        totalProblems: 10,
        xpRange: [70, 100],
        phase: 2,
        status: 'available',
        prerequisite: 'grade5_ratio',
        aiGeneration: {
            enabled: true,
            prompt: '小学5年生向けの平均の問題を生成してください。',
            examples: ['10、20、30の平均は？', '5人のテストの点数 80、75、90、85、70 の平均は？']
        },
        hasFigure: false
    },

    // ===========================================
    // 小学6年生（6ワールド）
    // ===========================================
    {
        id: 'grade6_fractions_complex',
        name: '分数の迷宮',
        icon: '🌀',
        targetGrade: 6,
        minGrade: 6,
        maxGrade: 6,
        difficulty: 5,
        requiredLevel: 1,
        unitName: '分数の計算（応用）',
        description: '複雑な分数計算を学ぼう',
        story: '迷宮を抜けるには、複雑な分数計算が必要だ。分数マスターになろう！',
        totalProblems: 10,
        xpRange: [80, 110],
        phase: 3,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '小学6年生向けの分数の複雑な計算問題（3つ以上の分数、帯分数を含む）を生成してください。',
            examples: ['1/2 + 1/3 + 1/4', '2 1/3 - 1 1/2', '3/4 × 2/5 + 1/3']
        },
        hasFigure: true,
        figureType: 'fraction'
    },
    {
        id: 'grade6_circle_area',
        name: '円の面積の神殿',
        icon: '⭕',
        targetGrade: 6,
        minGrade: 6,
        maxGrade: 6,
        difficulty: 5,
        requiredLevel: 2,
        unitName: '円の面積',
        description: '円の面積を求めよう',
        story: '神殿に隠された円の秘密。半径×半径×3.14で面積を求めよう！',
        totalProblems: 10,
        xpRange: [80, 110],
        phase: 3,
        status: 'available',
        prerequisite: 'grade6_fractions_complex',
        aiGeneration: {
            enabled: true,
            prompt: '小学6年生向けの円の面積問題を生成してください。円周率は3.14を使ってください。',
            examples: ['半径5cmの円の面積', '直径8cmの円の面積', '半径10cmの円の面積']
        },
        hasFigure: true,
        figureType: 'circle'
    },
    {
        id: 'grade6_ratio_proportion',
        name: '比例反比例の塔',
        icon: '📈',
        targetGrade: 6,
        minGrade: 6,
        maxGrade: 6,
        difficulty: 5,
        requiredLevel: 3,
        unitName: '比例と反比例',
        description: '比例と反比例を学ぼう',
        story: '高い塔で比例と反比例の関係を学ぼう。yはxに比例する...？',
        totalProblems: 10,
        xpRange: [80, 110],
        phase: 3,
        status: 'available',
        prerequisite: 'grade6_circle_area',
        aiGeneration: {
            enabled: true,
            prompt: '小学6年生向けの比例と反比例の問題を生成してください。',
            examples: ['yがxに比例し、x=2のときy=6。x=5のときyは？', 'xy=12のとき、x=3ならyは？']
        },
        hasFigure: false
    },
    {
        id: 'grade6_speed',
        name: '速さの道',
        icon: '🏃',
        targetGrade: 6,
        minGrade: 6,
        maxGrade: 6,
        difficulty: 5,
        requiredLevel: 4,
        unitName: '速さ',
        description: '速さの計算を学ぼう',
        story: '道を走る旅人。速さ＝道のり÷時間の公式をマスターしよう！',
        totalProblems: 10,
        xpRange: [80, 110],
        phase: 3,
        status: 'available',
        prerequisite: 'grade6_ratio_proportion',
        aiGeneration: {
            enabled: true,
            prompt: '小学6年生向けの速さの問題を生成してください。速さ、道のり、時間の関係を含めてください。',
            examples: ['時速60kmで2時間走った道のりは？', '120kmを3時間で走った速さは？', '時速80kmで240km走るには何時間？']
        },
        hasFigure: false
    },
    {
        id: 'grade6_data',
        name: 'データの図書館',
        icon: '📊',
        targetGrade: 6,
        minGrade: 6,
        maxGrade: 6,
        difficulty: 4,
        requiredLevel: 5,
        unitName: 'データの調べ方',
        description: 'データの整理を学ぼう',
        story: '図書館に並ぶデータたち。平均、中央値、最頻値をマスターしよう！',
        totalProblems: 10,
        xpRange: [80, 110],
        phase: 3,
        status: 'available',
        prerequisite: 'grade6_speed',
        aiGeneration: {
            enabled: true,
            prompt: '小学6年生向けのデータの整理問題を生成してください。平均、中央値、最頻値を含めてください。',
            examples: ['データ 3, 5, 7, 9, 11 の中央値は？', '2, 2, 3, 5, 5, 5, 8 の最頻値は？']
        },
        hasFigure: false
    },
    {
        id: 'grade6_solid_figures',
        name: '立体の城',
        icon: '🏰',
        targetGrade: 6,
        minGrade: 6,
        maxGrade: 6,
        difficulty: 5,
        requiredLevel: 6,
        unitName: '立体図形',
        description: '立体図形の体積を学ぼう',
        story: '城の建築には立体の知識が必要だ。角柱や円柱の体積を求めよう！',
        totalProblems: 10,
        xpRange: [80, 110],
        phase: 3,
        status: 'available',
        prerequisite: 'grade6_data',
        aiGeneration: {
            enabled: true,
            prompt: '小学6年生向けの立体図形の体積問題（角柱、円柱）を生成してください。',
            examples: ['底面積20cm²、高さ10cmの角柱の体積', '底面の半径3cm、高さ10cmの円柱の体積']
        },
        hasFigure: true,
        figureType: 'solid'
    },

    // ===========================================
    // 中学1年生（6ワールド）
    // ===========================================
    {
        id: 'grade7_positive_negative',
        name: '正負の数の世界',
        icon: '➕➖',
        targetGrade: 7,
        minGrade: 7,
        maxGrade: 7,
        difficulty: 5,
        requiredLevel: 1,
        unitName: '正の数・負の数',
        description: '負の数を学ぼう',
        story: '新しい世界への扉が開く。負の数の概念と計算をマスターしよう！',
        totalProblems: 10,
        xpRange: [90, 120],
        phase: 3,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '中学1年生向けの正の数・負の数の計算問題を生成してください。加減乗除を含めてください。',
            examples: ['(-3) + 5', '7 - (-2)', '(-4) × (-3)', '(-12) ÷ 3']
        },
        hasFigure: false
    },
    {
        id: 'grade7_equations',
        name: '方程式の迷宮',
        icon: '🧮',
        targetGrade: 7,
        minGrade: 7,
        maxGrade: 7,
        difficulty: 6,
        requiredLevel: 2,
        unitName: '1次方程式',
        description: '方程式を解こう',
        story: '迷宮を抜けるには方程式を解く力が必要だ。xの値を求めよう！',
        totalProblems: 10,
        xpRange: [90, 120],
        phase: 3,
        status: 'available',
        prerequisite: 'grade7_positive_negative',
        aiGeneration: {
            enabled: true,
            prompt: '中学1年生向けの1次方程式問題を生成してください。',
            examples: ['x + 5 = 12', '2x - 3 = 7', '3x + 4 = 19', '5x - 8 = 17']
        },
        hasFigure: false
    },
    {
        id: 'grade7_coordinates',
        name: '座標平面の地図',
        icon: '📍',
        targetGrade: 7,
        minGrade: 7,
        maxGrade: 7,
        difficulty: 5,
        requiredLevel: 3,
        unitName: '座標',
        description: '座標平面を学ぼう',
        story: '魔法の地図には座標が描かれている。(x, y)で位置を表そう！',
        totalProblems: 10,
        xpRange: [90, 120],
        phase: 3,
        status: 'available',
        prerequisite: 'grade7_equations',
        aiGeneration: {
            enabled: true,
            prompt: '中学1年生向けの座標の問題を生成してください。点の座標、象限の判別を含めてください。',
            examples: ['点(3, 5)はどの象限？', 'x軸上の点はy座標が何？', '点(-2, 4)から原点までの距離は？']
        },
        hasFigure: true,
        figureType: 'coordinate'
    },
    {
        id: 'grade7_proportional',
        name: '比例の谷',
        icon: '📈',
        targetGrade: 7,
        minGrade: 7,
        maxGrade: 7,
        difficulty: 5,
        requiredLevel: 4,
        unitName: '比例と反比例',
        description: '比例・反比例を深く学ぼう',
        story: '谷に響く比例の声。y = ax、xy = k の関係を理解しよう！',
        totalProblems: 10,
        xpRange: [90, 120],
        phase: 3,
        status: 'available',
        prerequisite: 'grade7_coordinates',
        aiGeneration: {
            enabled: true,
            prompt: '中学1年生向けの比例・反比例の問題（関数の式、グラフ）を生成してください。',
            examples: ['yがxに比例し、x=2のときy=6。yをxの式で表せ', 'y = 3x のグラフは原点を通る？']
        },
        hasFigure: true,
        figureType: 'graph'
    },
    {
        id: 'grade7_plane_figures',
        name: '平面図形の神殿',
        icon: '△',
        targetGrade: 7,
        minGrade: 7,
        maxGrade: 7,
        difficulty: 5,
        requiredLevel: 5,
        unitName: '平面図形',
        description: '作図と図形の性質を学ぼう',
        story: '神殿に刻まれた幾何学の秘密。コンパスと定規で図形を描こう！',
        totalProblems: 10,
        xpRange: [90, 120],
        phase: 3,
        status: 'available',
        prerequisite: 'grade7_proportional',
        aiGeneration: {
            enabled: true,
            prompt: '中学1年生向けの平面図形の問題（作図、角度、対称性）を生成してください。',
            examples: ['垂直二等分線の作図', '二等辺三角形の底角は等しい', '円の中心角と円周角']
        },
        hasFigure: true,
        figureType: 'geometry'
    },
    {
        id: 'grade7_solid_figures',
        name: '空間図形の塔',
        icon: '🔷',
        targetGrade: 7,
        minGrade: 7,
        maxGrade: 7,
        difficulty: 5,
        requiredLevel: 6,
        unitName: '空間図形',
        description: '立体の体積と表面積を学ぼう',
        story: '塔に隠された空間図形の秘密。角錐、円錐、球の体積を求めよう！',
        totalProblems: 10,
        xpRange: [90, 120],
        phase: 3,
        status: 'available',
        prerequisite: 'grade7_plane_figures',
        aiGeneration: {
            enabled: true,
            prompt: '中学1年生向けの空間図形の体積・表面積問題を生成してください。',
            examples: ['底面の半径3cm、高さ4cmの円錐の体積', '半径5cmの球の体積（4/3πr³）']
        },
        hasFigure: true,
        figureType: 'solid'
    },

    // ===========================================
    // 中学2年生（5ワールド）
    // ===========================================
    {
        id: 'grade8_formulas',
        name: '式の計算の研究所',
        icon: '🧪',
        targetGrade: 8,
        minGrade: 8,
        maxGrade: 8,
        difficulty: 6,
        requiredLevel: 1,
        unitName: '式の計算',
        description: '多項式の計算を学ぼう',
        story: '研究所で式の計算を極めよう。展開と因数分解をマスターだ！',
        totalProblems: 10,
        xpRange: [100, 130],
        phase: 3,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '中学2年生向けの式の計算問題（展開、因数分解）を生成してください。',
            examples: ['(x + 3)(x + 5)', 'x² + 7x + 12', '(2x + 1)²', 'x² - 9']
        },
        hasFigure: false
    },
    {
        id: 'grade8_linear_functions',
        name: '1次関数の世界',
        icon: '📉',
        targetGrade: 8,
        minGrade: 8,
        maxGrade: 8,
        difficulty: 6,
        requiredLevel: 2,
        unitName: '1次関数',
        description: '1次関数を学ぼう',
        story: '世界を支配する1次関数。y = ax + b の秘密を解き明かせ！',
        totalProblems: 10,
        xpRange: [100, 130],
        phase: 3,
        status: 'available',
        prerequisite: 'grade8_formulas',
        aiGeneration: {
            enabled: true,
            prompt: '中学2年生向けの1次関数の問題（式、グラフ、変化の割合）を生成してください。',
            examples: ['y = 2x + 3 のグラフの傾きは？', '点(1, 5)と(3, 9)を通る直線の式', '変化の割合を求めよ']
        },
        hasFigure: true,
        figureType: 'graph'
    },
    {
        id: 'grade8_simultaneous',
        name: '連立方程式の迷宮',
        icon: '🔢',
        targetGrade: 8,
        minGrade: 8,
        maxGrade: 8,
        difficulty: 7,
        requiredLevel: 3,
        unitName: '連立方程式',
        description: '連立方程式を解こう',
        story: '2つの式が絡み合う迷宮。加減法、代入法で解き明かせ！',
        totalProblems: 10,
        xpRange: [100, 130],
        phase: 3,
        status: 'available',
        prerequisite: 'grade8_linear_functions',
        aiGeneration: {
            enabled: true,
            prompt: '中学2年生向けの連立方程式問題を生成してください。',
            examples: ['x + y = 5, x - y = 1', '2x + 3y = 13, x + y = 5', '3x - 2y = 4, x + 4y = 10']
        },
        hasFigure: false
    },
    {
        id: 'grade8_triangles',
        name: '三角形の神殿',
        icon: '🔺',
        targetGrade: 8,
        minGrade: 8,
        maxGrade: 8,
        difficulty: 6,
        requiredLevel: 4,
        unitName: '三角形と四角形',
        description: '図形の証明を学ぼう',
        story: '神殿に眠る幾何学の真理。合同、相似、証明をマスターしよう！',
        totalProblems: 10,
        xpRange: [100, 130],
        phase: 3,
        status: 'available',
        prerequisite: 'grade8_simultaneous',
        aiGeneration: {
            enabled: true,
            prompt: '中学2年生向けの三角形と四角形の問題（合同条件、証明、角度）を生成してください。',
            examples: ['二等辺三角形の底角は等しい証明', '平行四辺形の対角は等しい', '三角形の内角の和']
        },
        hasFigure: true,
        figureType: 'geometry'
    },
    {
        id: 'grade8_probability',
        name: '確率の魔法陣',
        icon: '🎲',
        targetGrade: 8,
        minGrade: 8,
        maxGrade: 8,
        difficulty: 6,
        requiredLevel: 5,
        unitName: '確率',
        description: '確率の基礎を学ぼう',
        story: '魔法陣に隠された確率の秘密。起こりやすさを数で表そう！',
        totalProblems: 10,
        xpRange: [100, 130],
        phase: 3,
        status: 'available',
        prerequisite: 'grade8_triangles',
        aiGeneration: {
            enabled: true,
            prompt: '中学2年生向けの確率の問題を生成してください。',
            examples: ['サイコロで偶数が出る確率', 'コイン2枚投げて両方表の確率', 'カード1枚引いてハートの確率']
        },
        hasFigure: false
    },

    // ===========================================
    // 中学3年生（6ワールド）
    // ===========================================
    {
        id: 'grade9_quadratic_equations',
        name: '2次方程式の塔',
        icon: '🗼',
        targetGrade: 9,
        minGrade: 9,
        maxGrade: 9,
        difficulty: 7,
        requiredLevel: 1,
        unitName: '2次方程式',
        description: '2次方程式を解こう',
        story: '高い塔で2次方程式に挑戦。因数分解、解の公式で解き明かせ！',
        totalProblems: 10,
        xpRange: [110, 140],
        phase: 3,
        status: 'available',
        unlocked: true,
        prerequisite: null,
        aiGeneration: {
            enabled: true,
            prompt: '中学3年生向けの2次方程式問題（因数分解、解の公式）を生成してください。',
            examples: ['x² - 5x + 6 = 0', 'x² + 4x - 5 = 0', '2x² - 8x + 6 = 0', 'x² - 7x + 10 = 0']
        },
        hasFigure: false
    },
    {
        id: 'grade9_quadratic_functions',
        name: '2次関数の世界',
        icon: '📊',
        targetGrade: 9,
        minGrade: 9,
        maxGrade: 9,
        difficulty: 7,
        requiredLevel: 2,
        unitName: '2次関数',
        description: '2次関数を学ぼう',
        story: '放物線が描く美しい世界。y = ax² のグラフをマスターしよう！',
        totalProblems: 10,
        xpRange: [110, 140],
        phase: 3,
        status: 'available',
        prerequisite: 'grade9_quadratic_equations',
        aiGeneration: {
            enabled: true,
            prompt: '中学3年生向けの2次関数の問題（グラフ、変域、最大最小）を生成してください。',
            examples: ['y = x² のグラフの頂点は？', 'y = 2x² のグラフの軸は？', 'y = -x² + 4 の最大値は？']
        },
        hasFigure: true,
        figureType: 'graph'
    },
    {
        id: 'grade9_similar_figures',
        name: '相似図形の神殿',
        icon: '🔷',
        targetGrade: 9,
        minGrade: 9,
        maxGrade: 9,
        difficulty: 7,
        requiredLevel: 3,
        unitName: '相似な図形',
        description: '相似の性質を学ぼう',
        story: '神殿に眠る相似の秘密。相似比、面積比、体積比を理解しよう！',
        totalProblems: 10,
        xpRange: [110, 140],
        phase: 3,
        status: 'available',
        prerequisite: 'grade9_quadratic_functions',
        aiGeneration: {
            enabled: true,
            prompt: '中学3年生向けの相似な図形の問題（相似比、証明、計量）を生成してください。',
            examples: ['相似比が2:3のとき面積比は？', '相似条件を使った証明', '三角形の中点連結定理']
        },
        hasFigure: true,
        figureType: 'geometry'
    },
    {
        id: 'grade9_circles',
        name: '円の定理の聖域',
        icon: '⭕',
        targetGrade: 9,
        minGrade: 9,
        maxGrade: 9,
        difficulty: 7,
        requiredLevel: 4,
        unitName: '円',
        description: '円の性質を極めよう',
        story: '聖域に眠る円の定理。円周角、接線、方べきの定理をマスターせよ！',
        totalProblems: 10,
        xpRange: [110, 140],
        phase: 3,
        status: 'available',
        prerequisite: 'grade9_similar_figures',
        aiGeneration: {
            enabled: true,
            prompt: '中学3年生向けの円の問題（円周角、接線の長さ、方べきの定理）を生成してください。',
            examples: ['円周角は中心角の半分', '接線の長さは等しい', '円周角の定理を使った角度計算']
        },
        hasFigure: true,
        figureType: 'circle'
    },
    {
        id: 'grade9_pythagorean',
        name: '三平方の定理の山',
        icon: '⛰️',
        targetGrade: 9,
        minGrade: 9,
        maxGrade: 9,
        difficulty: 7,
        requiredLevel: 5,
        unitName: '三平方の定理',
        description: 'ピタゴラスの定理を学ぼう',
        story: '山に刻まれた古代の定理。a² + b² = c² の力を解き放て！',
        totalProblems: 10,
        xpRange: [110, 140],
        phase: 3,
        status: 'available',
        prerequisite: 'grade9_circles',
        aiGeneration: {
            enabled: true,
            prompt: '中学3年生向けの三平方の定理の問題を生成してください。',
            examples: ['直角三角形で a=3, b=4 のとき c は？', '対角線の長さを求めよ', '座標平面上の2点間の距離']
        },
        hasFigure: true,
        figureType: 'geometry'
    },
    {
        id: 'grade9_statistics',
        name: '標本調査の研究所',
        icon: '📈',
        targetGrade: 9,
        minGrade: 9,
        maxGrade: 9,
        difficulty: 6,
        requiredLevel: 6,
        unitName: '標本調査',
        description: 'データの分析を学ぼう',
        story: '研究所で統計学をマスター。標本から母集団を推定しよう！',
        totalProblems: 10,
        xpRange: [110, 140],
        phase: 3,
        status: 'available',
        prerequisite: 'grade9_pythagorean',
        aiGeneration: {
            enabled: true,
            prompt: '中学3年生向けの標本調査の問題を生成してください。',
            examples: ['標本平均から母集団を推定', '無作為抽出の方法', '標本の大きさと精度']
        },
        hasFigure: false
    }
];

/**
 * ワールドをIDで取得
 */
function getWorldById(worldId) {
    return WORLD_DATABASE.find(w => w.id === worldId);
}

/**
 * 学年に応じた利用可能なワールドを取得
 * 各学年は自分の学年のワールドのみ表示
 */
function getAvailableWorlds(playerGrade) {
    return WORLD_DATABASE.filter(world => {
        // ステータスチェック
        if (world.status !== 'available') return false;

        // 学年が完全一致するワールドのみ表示（各学年専用）
        if (world.targetGrade !== playerGrade) {
            return false;
        }

        return true;
    }).sort((a, b) => {
        // 必要レベル順、難易度順にソート
        if (a.requiredLevel !== b.requiredLevel) {
            return a.requiredLevel - b.requiredLevel;
        }
        return a.difficulty - b.difficulty;
    });
}

/**
 * ワールドがアンロックされているかチェック
 */
function isWorldUnlocked(world, player) {
    // レベル制限チェック
    if (player.level < world.requiredLevel) {
        return false;
    }

    // 前提ワールドがある場合
    if (world.prerequisite) {
        const completedWorlds = player.completedWorlds || [];
        const hasPrerequisite = completedWorlds.some(
            cw => cw.id === world.prerequisite && cw.completed
        );

        if (!hasPrerequisite) {
            return false;
        }
    }

    // 学年制限
    if (player.grade !== world.targetGrade) {
        return false;
    }

    return true;
}

/**
 * ワールドの進捗を取得
 */
function getWorldProgress(worldId, player) {
    const completedWorlds = player.completedWorlds || [];
    const worldProgress = completedWorlds.find(cw => cw.id === worldId);

    if (worldProgress) {
        return {
            completed: worldProgress.problemsSolved || 0,
            total: worldProgress.totalProblems || 10,
            bestScore: worldProgress.bestScore || 0
        };
    }

    return {
        completed: 0,
        total: 10,
        bestScore: 0
    };
}

/**
 * AI問題生成が有効かチェック
 */
function isAIGenerationEnabled(worldId) {
    const world = getWorldById(worldId);
    return world && world.aiGeneration && world.aiGeneration.enabled;
}

/**
 * AI問題を生成
 */
async function generateAIProblem(worldId, difficulty = 'normal') {
    const world = getWorldById(worldId);

    if (!world || !world.aiGeneration || !world.aiGeneration.enabled) {
        throw new Error('AI generation not available for this world');
    }

    const player = MathMagic.getCurrentPlayer();

    try {
        const response = await fetch('/.netlify/functions/generate-problem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grade: player.grade,
                worldId: worldId,
                difficulty: difficulty
            })
        });

        const data = await response.json();

        if (data.success) {
            return data.problem;
        } else {
            throw new Error(data.error || 'Problem generation failed');
        }
    } catch (error) {
        console.error('AI問題生成エラー:', error);
        throw error;
    }
}

// グローバルに公開
window.WORLD_DATABASE = WORLD_DATABASE;
window.getWorldById = getWorldById;
window.getAvailableWorlds = getAvailableWorlds;
window.isWorldUnlocked = isWorldUnlocked;
window.getWorldProgress = getWorldProgress;
window.isAIGenerationEnabled = isAIGenerationEnabled;
window.generateAIProblem = generateAIProblem;

console.log('✅ worlds.js ロード完了');
console.log(`📚 ${WORLD_DATABASE.length}個のワールドを読み込みました`);
console.log('🎓 対応学年: 小学1年生～中学3年生（全9学年）');
