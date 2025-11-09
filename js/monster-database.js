/**
 * マスマジ！- モンスターデータベース
 * バトルシステム用モンスター定義
 */

// モンスターデータベース
const MONSTER_DATABASE = {
    // 初級モンスター (難易度1-2)
    slime: {
        id: 'slime',
        name: 'スライム',
        icon: '🟢',
        sprite: '🟢', // フォールバック絵文字
        spriteImage: 'assets/images/monsters/slime.png', // 画像パス
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 1,
        description: '森に住む弱いスライム',
        attackAnimation: 'bounce',
        defeatSound: 'pop',
        xpBonus: 50,
        rewards: {
            gold: 10,
            items: ['スライムゼリー']
        }
    },

    bat: {
        id: 'bat',
        name: 'こうもり',
        icon: '🦇',
        sprite: '🦇',
        spriteImage: 'assets/images/monsters/bat.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 1,
        description: '夜に飛び回るこうもり',
        attackAnimation: 'fly',
        defeatSound: 'flutter',
        xpBonus: 60,
        rewards: {
            gold: 12,
            items: ['こうもりの羽']
        }
    },

    // 中級モンスター (難易度3-4)
    goblin: {
        id: 'goblin',
        name: 'ゴブリン',
        icon: '👹',
        sprite: '👹',
        spriteImage: 'assets/images/monsters/goblin.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 3,
        description: '棍棒を持った悪いゴブリン',
        attackAnimation: 'swing',
        defeatSound: 'thud',
        xpBonus: 100,
        rewards: {
            gold: 25,
            items: ['ゴブリンの棍棒']
        }
    },

    skeleton: {
        id: 'skeleton',
        name: 'スケルトン',
        icon: '💀',
        sprite: '💀',
        spriteImage: 'assets/images/monsters/skeleton.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 3,
        description: '骨だけの戦士',
        attackAnimation: 'swing',
        defeatSound: 'rattle',
        xpBonus: 110,
        rewards: {
            gold: 30,
            items: ['古い骨']
        }
    },

    orc: {
        id: 'orc',
        name: 'オーク',
        icon: '🧌',
        sprite: '🧌',
        spriteImage: 'assets/images/monsters/orc.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 4,
        description: '力の強いオーク戦士',
        attackAnimation: 'smash',
        defeatSound: 'crash',
        xpBonus: 120,
        rewards: {
            gold: 35,
            items: ['オークの斧']
        }
    },

    // 上級モンスター (難易度5-6)
    dragon_baby: {
        id: 'dragon_baby',
        name: 'ベビードラゴン',
        icon: '🐲',
        sprite: '🐲',
        spriteImage: 'assets/images/monsters/dragon_baby.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 5,
        description: '小さなドラゴンの子供',
        attackAnimation: 'flame',
        defeatSound: 'roar',
        xpBonus: 150,
        rewards: {
            gold: 50,
            items: ['ドラゴンの鱗']
        }
    },

    demon: {
        id: 'demon',
        name: 'デーモン',
        icon: '😈',
        sprite: '😈',
        spriteImage: 'assets/images/monsters/demon.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 6,
        description: '闇の力を持つ魔物',
        attackAnimation: 'dark',
        defeatSound: 'howl',
        xpBonus: 180,
        rewards: {
            gold: 60,
            items: ['闇の結晶']
        }
    },

    dragon: {
        id: 'dragon',
        name: 'ドラゴン',
        icon: '🐉',
        sprite: '🐉',
        spriteImage: 'assets/images/monsters/dragon.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 7,
        description: '伝説の炎を吐くドラゴン',
        attackAnimation: 'megaflame',
        defeatSound: 'epicRoar',
        xpBonus: 250,
        rewards: {
            gold: 100,
            items: ['ドラゴンの牙', 'ドラゴンの心臓']
        }
    },

    // ワールド専用ボス
    forest_guardian: {
        id: 'forest_guardian',
        name: '森の守護者',
        icon: '🌳',
        sprite: '🌳',
        spriteImage: 'assets/images/monsters/forest-guardian.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 2,
        description: '森を守る守護者',
        attackAnimation: 'roar',
        defeatSound: 'victory',
        xpBonus: 200,
        rewards: {
            gold: 80,
            items: ['森の王冠']
        }
    },

    ice_beast: {
        id: 'ice_beast',
        name: 'アイスビースト',
        icon: '❄️',
        sprite: '❄️',
        spriteImage: 'assets/images/monsters/ice-beast.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 5,
        description: '氷の獣',
        attackAnimation: 'freeze',
        defeatSound: 'shatter',
        xpBonus: 220,
        rewards: {
            gold: 90,
            items: ['氷の結晶']
        }
    },

    fire_guardian: {
        id: 'fire_guardian',
        name: '炎の守護者',
        icon: '🔥',
        sprite: '🔥',
        spriteImage: 'assets/images/monsters/fire-guardian.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 6,
        description: '炎を操る守護者',
        attackAnimation: 'eruption',
        defeatSound: 'explosion',
        xpBonus: 280,
        rewards: {
            gold: 120,
            items: ['炎の宝珠']
        }
    },

    sea_monster: {
        id: 'sea_monster',
        name: '海の魔物',
        icon: '🌊',
        sprite: '🌊',
        spriteImage: 'assets/images/monsters/sea-monster.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 4,
        description: '深海から現れた魔物',
        attackAnimation: 'wave',
        defeatSound: 'splash',
        xpBonus: 150,
        rewards: {
            gold: 70,
            items: ['海の真珠']
        }
    },

    dark_lord: {
        id: 'dark_lord',
        name: '闇の王',
        icon: '👑',
        sprite: '👑',
        spriteImage: 'assets/images/monsters/dark-lord.png',
        useImage: true, // 画像を使用
        hp: 100,
        difficulty: 8,
        description: '闇を統べる最強の魔王',
        attackAnimation: 'dark',
        defeatSound: 'epicHowl',
        xpBonus: 300,
        rewards: {
            gold: 150,
            items: ['闇の王冠', '魔王の心臓']
        }
    }
};

/**
 * 難易度からモンスターを選択
 */
function getMonsterByDifficulty(difficulty) {
    const monsters = Object.values(MONSTER_DATABASE).filter(m => m.difficulty === difficulty);
    if (monsters.length === 0) {
        // フォールバック: 最も近い難易度のモンスター
        return MONSTER_DATABASE.slime;
    }
    return monsters[Math.floor(Math.random() * monsters.length)];
}

/**
 * ワールドIDから適切なモンスターを選択
 */
function getMonsterByWorld(worldId, difficulty) {
    // ワールド専用モンスターマッピング
    const worldMonsterMap = {
        'multiplication_forest': 'slime',
        'division_cave': 'goblin',
        'fraction_fountain': 'skeleton',
        'grade1_counting': 'bat',
        'grade1_addition': 'slime',
        'grade2_addition_2digit': 'goblin',
        'grade3_multiplication': 'orc',
        'grade4_decimals': 'dragon_baby',
        'grade5_fractions_mult_div': 'demon',
        'grade6_circle_area': 'dragon',
        'grade7_equations': 'demon',
        'grade8_simultaneous': 'dragon_baby',
        'grade9_quadratic_equations': 'dragon'
    };

    // ワールド専用モンスターがあれば使用
    if (worldMonsterMap[worldId]) {
        return MONSTER_DATABASE[worldMonsterMap[worldId]];
    }

    // それ以外は難易度で選択
    return getMonsterByDifficulty(difficulty);
}

/**
 * モンスターIDからモンスターを取得
 */
function getMonsterById(monsterId) {
    return MONSTER_DATABASE[monsterId] || MONSTER_DATABASE.slime;
}

/**
 * すべてのモンスターリストを取得
 */
function getAllMonsters() {
    return Object.values(MONSTER_DATABASE);
}

// グローバルに公開
window.MONSTER_DATABASE = MONSTER_DATABASE;
window.getMonsterByDifficulty = getMonsterByDifficulty;
window.getMonsterByWorld = getMonsterByWorld;
window.getMonsterById = getMonsterById;
window.getAllMonsters = getAllMonsters;

console.log('✅ monster-database.js ロード完了');
console.log(`👾 ${Object.keys(MONSTER_DATABASE).length}種類のモンスターを読み込みました`);
