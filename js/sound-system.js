/**
 * マスマジ！- サウンドシステム
 * DQ風効果音とBGM管理
 */

const SoundSystem = {
    enabled: true,
    volume: 0.5,
    bgmVolume: 0.3,
    currentBGM: null,

    // Web Audio API用のコンテキスト
    audioContext: null,

    /**
     * 初期化
     */
    init: function() {
        // AudioContextは最初のユーザーインタラクション後に作成
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('🎵 サウンドシステム初期化完了');
            }
        }, { once: true });

        // ローカルストレージから設定を読み込み
        const savedSettings = MathMagic.getItem('soundSettings');
        if (savedSettings) {
            this.enabled = savedSettings.enabled !== false;
            this.volume = savedSettings.volume || 0.5;
            this.bgmVolume = savedSettings.bgmVolume || 0.3;
        }
    },

    /**
     * 効果音を再生（ビープ音で代用）
     */
    playSound: function(soundType) {
        if (!this.enabled || !this.audioContext) return;

        const sounds = {
            'correct': { freq: 880, duration: 0.15, type: 'sine' },
            'wrong': { freq: 220, duration: 0.3, type: 'square' },
            'click': { freq: 440, duration: 0.05, type: 'sine' },
            'levelup': { freq: [523, 659, 784, 1047], duration: 0.2, type: 'sine' },
            'coin': { freq: 1047, duration: 0.1, type: 'triangle' },
            'open': { freq: 659, duration: 0.1, type: 'sine' },
            'close': { freq: 523, duration: 0.1, type: 'sine' },
            'fanfare': { freq: [523, 659, 784, 1047, 1319], duration: 0.3, type: 'sine' }
        };

        const sound = sounds[soundType];
        if (!sound) return;

        if (Array.isArray(sound.freq)) {
            // 複数音を順番に再生
            sound.freq.forEach((freq, index) => {
                setTimeout(() => {
                    this.beep(freq, sound.duration, sound.type);
                }, index * sound.duration * 1000);
            });
        } else {
            this.beep(sound.freq, sound.duration, sound.type);
        }
    },

    /**
     * ビープ音を生成
     */
    beep: function(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    /**
     * BGMを再生（将来的に実装）
     */
    playBGM: function(bgmName) {
        // 実際の音楽ファイルを使用する場合はここに実装
        console.log(`🎵 BGM再生: ${bgmName}`);
    },

    /**
     * BGMを停止
     */
    stopBGM: function() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM = null;
        }
    },

    /**
     * サウンドの有効/無効を切り替え
     */
    toggle: function() {
        this.enabled = !this.enabled;
        this.saveSettings();
        return this.enabled;
    },

    /**
     * 音量を設定
     */
    setVolume: function(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    },

    /**
     * 設定を保存
     */
    saveSettings: function() {
        MathMagic.setItem('soundSettings', {
            enabled: this.enabled,
            volume: this.volume,
            bgmVolume: this.bgmVolume
        });
    }
};

// グローバルに公開
window.SoundSystem = SoundSystem;

console.log('✅ sound-system.js ロード完了');
