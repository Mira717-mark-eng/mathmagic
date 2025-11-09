/**
 * マスマジ！- 中学1年生向け問題データベース
 * 正負の数、文字式、方程式（100問）
 */

const JUNIOR_HIGH_1_PROBLEMS = [
    // ===== 正負の数：加法（1-15） =====
    {
        id: 1,
        type: 'calculation',
        story: '魔法使いの塔の地下3階から5階上がると何階になる？',
        question: '(-3) + 5',
        answer: 2,
        unit: '階',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '数直線を思い浮かべて、-3から右に5進むよ',
            '答えは2階だよ！'
        ]
    },
    {
        id: 2,
        type: 'calculation',
        story: 'ドラゴンが7個の宝石を持っていたが、8個失った。',
        question: '7 + (-8)',
        answer: -1,
        unit: '個',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '7 - 8 と同じ意味だよ',
            '答えは-1個（1個足りない）だよ！'
        ]
    },
    {
        id: 3,
        type: 'calculation',
        story: '氷の洞窟で温度が-12度だった。魔法で18度上がった。',
        question: '(-12) + 18',
        answer: 6,
        unit: '度',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '-12から18進むと、6になるよ',
            '答えは6度だよ！'
        ]
    },
    {
        id: 4,
        type: 'calculation',
        story: '勇者が地下5階にいて、3階下に降りた。',
        question: '(-5) + (-3)',
        answer: -8,
        unit: '階',
        difficulty: 'easy',
        xp: 80,
        hints: [
            'マイナス同士を足すと、もっとマイナスになるよ',
            '答えは-8階だよ！'
        ]
    },
    {
        id: 5,
        type: 'calculation',
        story: 'スライムが-6の位置から9進んだ。',
        question: '(-6) + 9',
        answer: 3,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '数直線で-6から右に9マス進むよ',
            '答えは3だよ！'
        ]
    },
    {
        id: 6,
        type: 'calculation',
        story: '魔法のポイントが15あったが、20消費した。',
        question: '15 + (-20)',
        answer: -5,
        unit: 'ポイント',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '15 - 20 と同じだよ',
            '答えは-5ポイントだよ！'
        ]
    },
    {
        id: 7,
        type: 'calculation',
        story: 'ゴブリンの位置が-10で、4移動した。',
        question: '(-10) + 4',
        answer: -6,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '-10から右に4マス進むよ',
            '答えは-6だよ！'
        ]
    },
    {
        id: 8,
        type: 'calculation',
        story: '宝箱から25ゴールド手に入れたが、30ゴールド使った。',
        question: '25 + (-30)',
        answer: -5,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '25 - 30 を計算するよ',
            '答えは-5ゴールド（5ゴールド足りない）だよ！'
        ]
    },
    {
        id: 9,
        type: 'calculation',
        story: '魔王城の地下7階から12階上がった。',
        question: '(-7) + 12',
        answer: 5,
        unit: '階',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '-7から12進むと5になるよ',
            '答えは5階だよ！'
        ]
    },
    {
        id: 10,
        type: 'calculation',
        story: 'HPが-3の状態から、さらに2減った。',
        question: '(-3) + (-2)',
        answer: -5,
        unit: 'HP',
        difficulty: 'easy',
        xp: 80,
        hints: [
            'マイナス同士を足すと、絶対値を足してマイナスをつけるよ',
            '答えは-5HPだよ！'
        ]
    },
    {
        id: 11,
        type: 'calculation',
        story: 'エルフの村の標高が-50mで、80m登った。',
        question: '(-50) + 80',
        answer: 30,
        unit: 'm',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '-50から80進むよ',
            '答えは30mだよ！'
        ]
    },
    {
        id: 12,
        type: 'calculation',
        story: 'ドワーフが-15の借金をして、さらに10借りた。',
        question: '(-15) + (-10)',
        answer: -25,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '借金が増えるから、マイナスが大きくなるよ',
            '答えは-25ゴールドだよ！'
        ]
    },
    {
        id: 13,
        type: 'calculation',
        story: '魔法の温度計が-8度を示していて、5度上がった。',
        question: '(-8) + 5',
        answer: -3,
        unit: '度',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '-8から右に5進むよ',
            '答えは-3度だよ！'
        ]
    },
    {
        id: 14,
        type: 'calculation',
        story: 'スケルトンが20ダメージ受けて、15回復した。',
        question: '(-20) + 15',
        answer: -5,
        unit: 'HP',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '-20から15回復するよ',
            '答えは-5HP（まだ5足りない）だよ！'
        ]
    },
    {
        id: 15,
        type: 'calculation',
        story: '魔法陣の座標が-4で、11移動した。',
        question: '(-4) + 11',
        answer: 7,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '-4から右に11マス進むよ',
            '答えは7だよ！'
        ]
    },

    // ===== 正負の数：減法（16-30） =====
    {
        id: 16,
        type: 'calculation',
        story: '勇者の位置が5で、-3を引くと？',
        question: '5 - (-3)',
        answer: 8,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            'マイナスを引くとプラスになるよ。5 + 3 と同じだよ',
            '答えは8だよ！'
        ]
    },
    {
        id: 17,
        type: 'calculation',
        story: 'モンスターのHPが-7から-10を引いた。',
        question: '(-7) - (-10)',
        answer: 3,
        unit: 'HP',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-7) + 10 に変換できるよ',
            '答えは3HPだよ！'
        ]
    },
    {
        id: 18,
        type: 'calculation',
        story: 'ゴールドが12あって、6引いた。',
        question: '12 - 6',
        answer: 6,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '普通の引き算だよ',
            '答えは6ゴールドだよ！'
        ]
    },
    {
        id: 19,
        type: 'calculation',
        story: '魔法ポイントが-9で、5を引いた。',
        question: '(-9) - 5',
        answer: -14,
        unit: 'ポイント',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-9) + (-5) と同じだよ',
            '答えは-14ポイントだよ！'
        ]
    },
    {
        id: 20,
        type: 'calculation',
        story: 'ドラゴンの位置が8で、-2を引いた。',
        question: '8 - (-2)',
        answer: 10,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '8 + 2 と同じだよ',
            '答えは10だよ！'
        ]
    },
    {
        id: 21,
        type: 'calculation',
        story: '魔王の体力が-15で、-8を引いた。',
        question: '(-15) - (-8)',
        answer: -7,
        unit: 'HP',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-15) + 8 に変換するよ',
            '答えは-7HPだよ！'
        ]
    },
    {
        id: 22,
        type: 'calculation',
        story: 'エルフの魔力が20で、15を引いた。',
        question: '20 - 15',
        answer: 5,
        unit: 'MP',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '普通の引き算だよ',
            '答えは5MPだよ！'
        ]
    },
    {
        id: 23,
        type: 'calculation',
        story: 'スライムの位置が-6で、9を引いた。',
        question: '(-6) - 9',
        answer: -15,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-6) + (-9) と同じだよ',
            '答えは-15だよ！'
        ]
    },
    {
        id: 24,
        type: 'calculation',
        story: '宝箱の価値が3で、-7を引いた。',
        question: '3 - (-7)',
        answer: 10,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '3 + 7 と同じだよ',
            '答えは10ゴールドだよ！'
        ]
    },
    {
        id: 25,
        type: 'calculation',
        story: 'ゴブリンの攻撃力が-12で、-5を引いた。',
        question: '(-12) - (-5)',
        answer: -7,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-12) + 5 に変換するよ',
            '答えは-7だよ！'
        ]
    },
    {
        id: 26,
        type: 'calculation',
        story: '魔法の杖の価格が30ゴールドで、25ゴールド値引きした。',
        question: '30 - 25',
        answer: 5,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '普通の引き算だよ',
            '答えは5ゴールドだよ！'
        ]
    },
    {
        id: 27,
        type: 'calculation',
        story: 'ドワーフの借金が-20で、10を引いた。',
        question: '(-20) - 10',
        answer: -30,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-20) + (-10) と同じだよ',
            '答えは-30ゴールドだよ！'
        ]
    },
    {
        id: 28,
        type: 'calculation',
        story: 'モンスターの座標が7で、-4を引いた。',
        question: '7 - (-4)',
        answer: 11,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '7 + 4 と同じだよ',
            '答えは11だよ！'
        ]
    },
    {
        id: 29,
        type: 'calculation',
        story: '魔法陣の温度が-18度で、-12度を引いた。',
        question: '(-18) - (-12)',
        answer: -6,
        unit: '度',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-18) + 12 に変換するよ',
            '答えは-6度だよ！'
        ]
    },
    {
        id: 30,
        type: 'calculation',
        story: 'スケルトンの防御力が-5で、8を引いた。',
        question: '(-5) - 8',
        answer: -13,
        unit: '',
        difficulty: 'easy',
        xp: 80,
        hints: [
            '(-5) + (-8) と同じだよ',
            '答えは-13だよ！'
        ]
    },

    // ===== 正負の数：乗法（31-45） =====
    {
        id: 31,
        type: 'calculation',
        story: 'スライムが毎日3ゴールド失う。4日後は？',
        question: '(-3) × 4',
        answer: -12,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'マイナス × プラス = マイナス だよ',
            '答えは-12ゴールドだよ！'
        ]
    },
    {
        id: 32,
        type: 'calculation',
        story: 'ドラゴンが1匹で-5ポイント。6匹いると？',
        question: '(-5) × 6',
        answer: -30,
        unit: 'ポイント',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '(-5) を 6回足すよ',
            '答えは-30ポイントだよ！'
        ]
    },
    {
        id: 33,
        type: 'calculation',
        story: '魔法で毎秒-2度下がる。7秒後は？',
        question: '(-2) × 7',
        answer: -14,
        unit: '度',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '(-2) × 7 = -14 だよ',
            '答えは-14度だよ！'
        ]
    },
    {
        id: 34,
        type: 'calculation',
        story: 'ゴブリンが1匹で8ゴールド奪う。-3は何を意味する？（8 × -3を計算）',
        question: '8 × (-3)',
        answer: -24,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'プラス × マイナス = マイナス だよ',
            '答えは-24ゴールドだよ！'
        ]
    },
    {
        id: 35,
        type: 'calculation',
        story: '魔法で-4ダメージを5回受ける。',
        question: '(-4) × 5',
        answer: -20,
        unit: 'HP',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '(-4) を 5回足すよ',
            '答えは-20HPだよ！'
        ]
    },
    {
        id: 36,
        type: 'calculation',
        story: 'エルフが毎日-6ゴールド使う。9日間では？',
        question: '(-6) × 9',
        answer: -54,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '6 × 9 = 54 で、マイナスをつけるよ',
            '答えは-54ゴールドだよ！'
        ]
    },
    {
        id: 37,
        type: 'calculation',
        story: 'モンスターが毎回-7HP減る。3回戦うと？',
        question: '(-7) × 3',
        answer: -21,
        unit: 'HP',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '(-7) を 3回足すよ',
            '答えは-21HPだよ！'
        ]
    },
    {
        id: 38,
        type: 'calculation',
        story: '魔王が毎時-10ポイント失う。8時間後は？',
        question: '(-10) × 8',
        answer: -80,
        unit: 'ポイント',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '10 × 8 = 80 で、マイナスをつけるよ',
            '答えは-80ポイントだよ！'
        ]
    },
    {
        id: 39,
        type: 'calculation',
        story: 'スケルトンが1体で12ゴールド。-2は何？（12 × -2を計算）',
        question: '12 × (-2)',
        answer: -24,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'プラス × マイナス = マイナス だよ',
            '答えは-24ゴールドだよ！'
        ]
    },
    {
        id: 40,
        type: 'calculation',
        story: 'ドワーフが毎日-15ゴールド借りる。4日間では？',
        question: '(-15) × 4',
        answer: -60,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '15 × 4 = 60 で、マイナスをつけるよ',
            '答えは-60ゴールドだよ！'
        ]
    },
    {
        id: 41,
        type: 'calculation',
        story: '魔法の効果で-3ポイント × -5回（マイナスの回数は逆の意味）',
        question: '(-3) × (-5)',
        answer: 15,
        unit: 'ポイント',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'マイナス × マイナス = プラス だよ！',
            '答えは15ポイントだよ！'
        ]
    },
    {
        id: 42,
        type: 'calculation',
        story: '借金-8ゴールドを-3回（借金が減る意味）',
        question: '(-8) × (-3)',
        answer: 24,
        unit: 'ゴールド',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'マイナス × マイナス = プラス だよ',
            '答えは24ゴールドだよ！'
        ]
    },
    {
        id: 43,
        type: 'calculation',
        story: '魔法で-6ダメージを-4回（回復の意味）',
        question: '(-6) × (-4)',
        answer: 24,
        unit: 'HP',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'マイナス × マイナス = プラス になるよ',
            '答えは24HPだよ！'
        ]
    },
    {
        id: 44,
        type: 'calculation',
        story: 'ゴブリンが-10ゴールド × -7回',
        question: '(-10) × (-7)',
        answer: 70,
        unit: 'ゴールド',
        difficulty: 'medium',
        xp: 100,
        hints: [
            '10 × 7 = 70 で、マイナス×マイナス=プラスだよ',
            '答えは70ゴールドだよ！'
        ]
    },
    {
        id: 45,
        type: 'calculation',
        story: 'エルフの魔力が-12 × -3',
        question: '(-12) × (-3)',
        answer: 36,
        unit: 'MP',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'マイナス × マイナス = プラス だよ',
            '答えは36MPだよ！'
        ]
    },

    // ===== 正負の数：除法（46-55） =====
    {
        id: 46,
        type: 'calculation',
        story: '-20ゴールドを4人で分けると1人何ゴールド？',
        question: '(-20) ÷ 4',
        answer: -5,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'マイナス ÷ プラス = マイナス だよ',
            '答えは-5ゴールドだよ！'
        ]
    },
    {
        id: 47,
        type: 'calculation',
        story: '-36ポイントを6つに分けると？',
        question: '(-36) ÷ 6',
        answer: -6,
        unit: 'ポイント',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '36 ÷ 6 = 6 で、マイナスをつけるよ',
            '答えは-6ポイントだよ！'
        ]
    },
    {
        id: 48,
        type: 'calculation',
        story: '48ゴールドを-8で割ると？',
        question: '48 ÷ (-8)',
        answer: -6,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'プラス ÷ マイナス = マイナス だよ',
            '答えは-6ゴールドだよ！'
        ]
    },
    {
        id: 49,
        type: 'calculation',
        story: '-56HPを7で割ると？',
        question: '(-56) ÷ 7',
        answer: -8,
        unit: 'HP',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '56 ÷ 7 = 8 で、マイナスをつけるよ',
            '答えは-8HPだよ！'
        ]
    },
    {
        id: 50,
        type: 'calculation',
        story: '72ゴールドを-9で割ると？',
        question: '72 ÷ (-9)',
        answer: -8,
        unit: 'ゴールド',
        difficulty: 'easy',
        xp: 90,
        hints: [
            '72 ÷ 9 = 8 で、マイナスをつけるよ',
            '答えは-8ゴールドだよ！'
        ]
    },
    {
        id: 51,
        type: 'calculation',
        story: '-40を-5で割ると？',
        question: '(-40) ÷ (-5)',
        answer: 8,
        unit: '',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'マイナス ÷ マイナス = プラス だよ',
            '答えは8だよ！'
        ]
    },
    {
        id: 52,
        type: 'calculation',
        story: '-63を-7で割ると？',
        question: '(-63) ÷ (-7)',
        answer: 9,
        unit: '',
        difficulty: 'medium',
        xp: 100,
        hints: [
            '63 ÷ 7 = 9 で、マイナス÷マイナス=プラスだよ',
            '答えは9だよ！'
        ]
    },
    {
        id: 53,
        type: 'calculation',
        story: '-100ゴールドを-10で割ると？',
        question: '(-100) ÷ (-10)',
        answer: 10,
        unit: 'ゴールド',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'マイナス ÷ マイナス = プラス だよ',
            '答えは10ゴールドだよ！'
        ]
    },
    {
        id: 54,
        type: 'calculation',
        story: '-45を-9で割ると？',
        question: '(-45) ÷ (-9)',
        answer: 5,
        unit: '',
        difficulty: 'medium',
        xp: 100,
        hints: [
            '45 ÷ 9 = 5 で、マイナス÷マイナス=プラスだよ',
            '答えは5だよ！'
        ]
    },
    {
        id: 55,
        type: 'calculation',
        story: '-81を-9で割ると？',
        question: '(-81) ÷ (-9)',
        answer: 9,
        unit: '',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'マイナス ÷ マイナス = プラス だよ',
            '答えは9だよ！'
        ]
    },

    // ===== 文字式：式の値（56-70） =====
    {
        id: 56,
        type: 'calculation',
        story: 'x = 3 のとき、2x の値は？',
        question: '2 × 3',
        answer: 6,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに3を代入して計算するよ',
            '答えは6だよ！'
        ]
    },
    {
        id: 57,
        type: 'calculation',
        story: 'x = 5 のとき、x + 7 の値は？',
        question: '5 + 7',
        answer: 12,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに5を代入するよ',
            '答えは12だよ！'
        ]
    },
    {
        id: 58,
        type: 'calculation',
        story: 'x = 4 のとき、3x - 5 の値は？',
        question: '3 × 4 - 5',
        answer: 7,
        unit: '',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'まず 3×4=12 を計算して、そこから5を引くよ',
            '答えは7だよ！'
        ]
    },
    {
        id: 59,
        type: 'calculation',
        story: 'x = -2 のとき、x + 10 の値は？',
        question: '(-2) + 10',
        answer: 8,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに-2を代入するよ',
            '答えは8だよ！'
        ]
    },
    {
        id: 60,
        type: 'calculation',
        story: 'x = 6 のとき、4x の値は？',
        question: '4 × 6',
        answer: 24,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに6を代入して掛け算するよ',
            '答えは24だよ！'
        ]
    },
    {
        id: 61,
        type: 'calculation',
        story: 'x = -3 のとき、2x の値は？',
        question: '2 × (-3)',
        answer: -6,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに-3を代入するよ',
            '答えは-6だよ！'
        ]
    },
    {
        id: 62,
        type: 'calculation',
        story: 'x = 8 のとき、x - 12 の値は？',
        question: '8 - 12',
        answer: -4,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに8を代入して引き算するよ',
            '答えは-4だよ！'
        ]
    },
    {
        id: 63,
        type: 'calculation',
        story: 'x = 5 のとき、2x + 3 の値は？',
        question: '2 × 5 + 3',
        answer: 13,
        unit: '',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'まず 2×5=10 を計算して、3を足すよ',
            '答えは13だよ！'
        ]
    },
    {
        id: 64,
        type: 'calculation',
        story: 'x = -4 のとき、x + 15 の値は？',
        question: '(-4) + 15',
        answer: 11,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに-4を代入するよ',
            '答えは11だよ！'
        ]
    },
    {
        id: 65,
        type: 'calculation',
        story: 'x = 7 のとき、5x の値は？',
        question: '5 × 7',
        answer: 35,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに7を代入して掛け算するよ',
            '答えは35だよ！'
        ]
    },
    {
        id: 66,
        type: 'calculation',
        story: 'x = 10 のとき、x ÷ 2 の値は？',
        question: '10 ÷ 2',
        answer: 5,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに10を代入して割り算するよ',
            '答えは5だよ！'
        ]
    },
    {
        id: 67,
        type: 'calculation',
        story: 'x = -5 のとき、3x の値は？',
        question: '3 × (-5)',
        answer: -15,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに-5を代入するよ',
            '答えは-15だよ！'
        ]
    },
    {
        id: 68,
        type: 'calculation',
        story: 'x = 6 のとき、x + x の値は？',
        question: '6 + 6',
        answer: 12,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに6を代入して、6+6を計算するよ',
            '答えは12だよ！'
        ]
    },
    {
        id: 69,
        type: 'calculation',
        story: 'x = 9 のとき、20 - x の値は？',
        question: '20 - 9',
        answer: 11,
        unit: '',
        difficulty: 'easy',
        xp: 90,
        hints: [
            'xに9を代入するよ',
            '答えは11だよ！'
        ]
    },
    {
        id: 70,
        type: 'calculation',
        story: 'x = 4 のとき、6x - 10 の値は？',
        question: '6 × 4 - 10',
        answer: 14,
        unit: '',
        difficulty: 'medium',
        xp: 100,
        hints: [
            'まず 6×4=24 を計算して、10を引くよ',
            '答えは14だよ！'
        ]
    },

    // ===== 方程式：一次方程式（71-100） =====
    {
        id: 71,
        type: 'calculation',
        story: 'x + 5 = 12 を解こう。xはいくつ？',
        question: '12 - 5',
        answer: 7,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺から5を引くと x = 12 - 5 になるよ',
            '答えは7だよ！'
        ]
    },
    {
        id: 72,
        type: 'calculation',
        story: 'x - 3 = 10 を解こう。xはいくつ？',
        question: '10 + 3',
        answer: 13,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺に3を足すと x = 10 + 3 になるよ',
            '答えは13だよ！'
        ]
    },
    {
        id: 73,
        type: 'calculation',
        story: '2x = 18 を解こう。xはいくつ？',
        question: '18 ÷ 2',
        answer: 9,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺を2で割ると x = 18 ÷ 2 になるよ',
            '答えは9だよ！'
        ]
    },
    {
        id: 74,
        type: 'calculation',
        story: 'x + 8 = 15 を解こう。xはいくつ？',
        question: '15 - 8',
        answer: 7,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺から8を引くよ',
            '答えは7だよ！'
        ]
    },
    {
        id: 75,
        type: 'calculation',
        story: '3x = 21 を解こう。xはいくつ？',
        question: '21 ÷ 3',
        answer: 7,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺を3で割るよ',
            '答えは7だよ！'
        ]
    },
    {
        id: 76,
        type: 'calculation',
        story: 'x - 7 = 5 を解こう。xはいくつ？',
        question: '5 + 7',
        answer: 12,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺に7を足すよ',
            '答えは12だよ！'
        ]
    },
    {
        id: 77,
        type: 'calculation',
        story: '5x = 35 を解こう。xはいくつ？',
        question: '35 ÷ 5',
        answer: 7,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺を5で割るよ',
            '答えは7だよ！'
        ]
    },
    {
        id: 78,
        type: 'calculation',
        story: 'x + 12 = 20 を解こう。xはいくつ？',
        question: '20 - 12',
        answer: 8,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺から12を引くよ',
            '答えは8だよ！'
        ]
    },
    {
        id: 79,
        type: 'calculation',
        story: '4x = 28 を解こう。xはいくつ？',
        question: '28 ÷ 4',
        answer: 7,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺を4で割るよ',
            '答えは7だよ！'
        ]
    },
    {
        id: 80,
        type: 'calculation',
        story: 'x - 9 = 6 を解こう。xはいくつ？',
        question: '6 + 9',
        answer: 15,
        unit: '',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺に9を足すよ',
            '答えは15だよ！'
        ]
    },
    {
        id: 81,
        type: 'calculation',
        story: '2x + 3 = 11 を解こう。まず 2x = ? を計算',
        question: '11 - 3',
        answer: 8,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から3を引いて 2x = 11 - 3 にするよ',
            '答えは8だよ。次に8÷2=4がxの値だよ！'
        ]
    },
    {
        id: 82,
        type: 'calculation',
        story: '3x - 5 = 10 を解こう。まず 3x = ? を計算',
        question: '10 + 5',
        answer: 15,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺に5を足して 3x = 10 + 5 にするよ',
            '答えは15だよ。次に15÷3=5がxの値だよ！'
        ]
    },
    {
        id: 83,
        type: 'calculation',
        story: '2x + 7 = 15 を解こう。まず 2x = ? を計算',
        question: '15 - 7',
        answer: 8,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から7を引くよ',
            '答えは8だよ。次に8÷2=4がxの値だよ！'
        ]
    },
    {
        id: 84,
        type: 'calculation',
        story: '5x - 10 = 20 を解こう。まず 5x = ? を計算',
        question: '20 + 10',
        answer: 30,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺に10を足すよ',
            '答えは30だよ。次に30÷5=6がxの値だよ！'
        ]
    },
    {
        id: 85,
        type: 'calculation',
        story: '4x + 6 = 22 を解こう。まず 4x = ? を計算',
        question: '22 - 6',
        answer: 16,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から6を引くよ',
            '答えは16だよ。次に16÷4=4がxの値だよ！'
        ]
    },
    {
        id: 86,
        type: 'calculation',
        story: '3x + 9 = 24 を解こう。まず 3x = ? を計算',
        question: '24 - 9',
        answer: 15,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から9を引くよ',
            '答えは15だよ。次に15÷3=5がxの値だよ！'
        ]
    },
    {
        id: 87,
        type: 'calculation',
        story: '6x - 12 = 18 を解こう。まず 6x = ? を計算',
        question: '18 + 12',
        answer: 30,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺に12を足すよ',
            '答えは30だよ。次に30÷6=5がxの値だよ！'
        ]
    },
    {
        id: 88,
        type: 'calculation',
        story: '7x + 4 = 25 を解こう。まず 7x = ? を計算',
        question: '25 - 4',
        answer: 21,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から4を引くよ',
            '答えは21だよ。次に21÷7=3がxの値だよ！'
        ]
    },
    {
        id: 89,
        type: 'calculation',
        story: '2x - 8 = 6 を解こう。まず 2x = ? を計算',
        question: '6 + 8',
        answer: 14,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺に8を足すよ',
            '答えは14だよ。次に14÷2=7がxの値だよ！'
        ]
    },
    {
        id: 90,
        type: 'calculation',
        story: '5x + 15 = 40 を解こう。まず 5x = ? を計算',
        question: '40 - 15',
        answer: 25,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から15を引くよ',
            '答えは25だよ。次に25÷5=5がxの値だよ！'
        ]
    },
    {
        id: 91,
        type: 'calculation',
        story: '魔法使いが持っているリンゴの数をxとする。x + 8 = 20 のとき、xは？',
        question: '20 - 8',
        answer: 12,
        unit: '個',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺から8を引くよ',
            '答えは12個だよ！'
        ]
    },
    {
        id: 92,
        type: 'calculation',
        story: 'ドラゴンの体重をxとする。3x = 45 のとき、xは？',
        question: '45 ÷ 3',
        answer: 15,
        unit: 'kg',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺を3で割るよ',
            '答えは15kgだよ！'
        ]
    },
    {
        id: 93,
        type: 'calculation',
        story: 'エルフの年齢をxとする。x - 10 = 25 のとき、xは？',
        question: '25 + 10',
        answer: 35,
        unit: '歳',
        difficulty: 'easy',
        xp: 100,
        hints: [
            '両辺に10を足すよ',
            '答えは35歳だよ！'
        ]
    },
    {
        id: 94,
        type: 'calculation',
        story: 'スライムの数をxとする。2x + 5 = 17 のとき、まず 2x = ? を計算',
        question: '17 - 5',
        answer: 12,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から5を引くよ',
            '答えは12だよ。次に12÷2=6匹がxの値だよ！'
        ]
    },
    {
        id: 95,
        type: 'calculation',
        story: 'ゴブリンの持つ金貨をxとする。4x - 7 = 21 のとき、まず 4x = ? を計算',
        question: '21 + 7',
        answer: 28,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺に7を足すよ',
            '答えは28だよ。次に28÷4=7枚がxの値だよ！'
        ]
    },
    {
        id: 96,
        type: 'calculation',
        story: 'ドワーフの作った剣の数をxとする。3x + 12 = 30 のとき、まず 3x = ? を計算',
        question: '30 - 12',
        answer: 18,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から12を引くよ',
            '答えは18だよ。次に18÷3=6本がxの値だよ！'
        ]
    },
    {
        id: 97,
        type: 'calculation',
        story: '魔王の魔力をxとする。5x - 20 = 30 のとき、まず 5x = ? を計算',
        question: '30 + 20',
        answer: 50,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺に20を足すよ',
            '答えは50だよ。次に50÷5=10がxの値だよ！'
        ]
    },
    {
        id: 98,
        type: 'calculation',
        story: 'モンスターの数をxとする。6x + 9 = 33 のとき、まず 6x = ? を計算',
        question: '33 - 9',
        answer: 24,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から9を引くよ',
            '答えは24だよ。次に24÷6=4体がxの値だよ！'
        ]
    },
    {
        id: 99,
        type: 'calculation',
        story: 'スケルトンの骨の数をxとする。7x - 14 = 35 のとき、まず 7x = ? を計算',
        question: '35 + 14',
        answer: 49,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺に14を足すよ',
            '答えは49だよ。次に49÷7=7本がxの値だよ！'
        ]
    },
    {
        id: 100,
        type: 'calculation',
        story: '伝説の魔法書のページ数をxとする。8x + 16 = 64 のとき、まず 8x = ? を計算',
        question: '64 - 16',
        answer: 48,
        unit: '',
        difficulty: 'medium',
        xp: 120,
        hints: [
            '両辺から16を引くよ',
            '答えは48だよ。次に48÷8=6ページがxの値だよ！'
        ]
    }
];

// グローバルに公開
window.JUNIOR_HIGH_1_PROBLEMS = JUNIOR_HIGH_1_PROBLEMS;

console.log('✅ junior-high-1.js ロード完了');
console.log(`📚 中学1年生向け問題 ${JUNIOR_HIGH_1_PROBLEMS.length}問を読み込みました`);
