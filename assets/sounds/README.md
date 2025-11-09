# サウンドファイルの追加方法

このフォルダには効果音やBGMファイルを配置します。

## 🎵 無料サウンド素材サイト

以下のサイトから無料で商用利用可能な効果音をダウンロードできます：

### 効果音サイト

1. **効果音ラボ** - https://soundeffect-lab.info/
   - 日本の定番サイト
   - クレジット不要、商用利用可
   - ゲーム向け効果音が豊富

2. **魔王魂** - https://maou.audio/
   - BGM・効果音が豊富
   - クレジット不要、商用利用可
   - RPG風の音楽が充実

3. **DOVA-SYNDROME** - https://dova-s.jp/
   - 高品質なBGM
   - クレジット表記推奨だが任意

4. **Freesound** - https://freesound.org/
   - 世界最大級の効果音ライブラリ
   - CC0ライセンスのファイル多数

### 推奨ファイル

以下の効果音を用意することをおすすめします：

```
assets/sounds/
├── correct.mp3          # 正解音（ピンポン、ベル音など）
├── wrong.mp3            # 不正解音（ブー、バツ音など）
├── levelup.mp3          # レベルアップ音（ファンファーレ）
├── coin.mp3             # コイン取得音
├── click.mp3            # クリック音
├── open.mp3             # 開く音（メニューなど）
├── close.mp3            # 閉じる音
├── fanfare.mp3          # ファンファーレ（クエスト完了）
├── attack.mp3           # 攻撃音
├── damage.mp3           # ダメージ音
├── heal.mp3             # 回復音
├── combo.mp3            # コンボ音
├── bgm-map.mp3          # ワールドマップBGM
├── bgm-battle.mp3       # バトルBGM
└── bgm-result.mp3       # リザルト画面BGM
```

## ⚙️ サウンドファイルの設定方法

### js/sound-system.js に以下を追加：

```javascript
// 音声ファイルのパスを設定
soundFiles: {
    'correct': 'assets/sounds/correct.mp3',
    'wrong': 'assets/sounds/wrong.mp3',
    'click': 'assets/sounds/click.mp3',
    'levelup': 'assets/sounds/levelup.mp3',
    'coin': 'assets/sounds/coin.mp3',
    'open': 'assets/sounds/open.mp3',
    'close': 'assets/sounds/close.mp3',
    'fanfare': 'assets/sounds/fanfare.mp3',
    'attack': 'assets/sounds/attack.mp3',
    'damage': 'assets/sounds/damage.mp3',
    'heal': 'assets/sounds/heal.mp3',
    'combo': 'assets/sounds/combo.mp3'
}
```

## 📝 注意事項

1. **ファイル形式**
   - MP3またはOGGを推奨
   - ブラウザの互換性のため複数形式を用意すると安心

2. **ファイルサイズ**
   - 効果音は短く（1秒以内）
   - 100KB以下が理想
   - BGMは3MB以下が推奨

3. **音量調整**
   - すべての音声ファイルを同じ音量に調整
   - Audacityなどの無料ソフトで調整可能

4. **ライセンス**
   - 必ず利用規約を確認
   - クレジット表記が必要な場合はREADME.mdに記載

## 🔊 現在の状態

音声ファイルが設定されていない場合、Web Audio APIによるビープ音が自動的に再生されます。
音声ファイルを追加すると、自動的にそちらが使用されます。

## 📚 参考：効果音ラボでの入手方法

1. https://soundeffect-lab.info/ にアクセス
2. 「クイズ・パズル」カテゴリで正解音・不正解音を検索
3. 「ゲーム・アプリ」カテゴリでその他の効果音を検索
4. ダウンロードしてこのフォルダに配置
5. `js/sound-system.js` のパスを設定

## 🎮 効果音なしで動作

効果音ファイルを追加しなくても、ゲームは問題なく動作します。
ビープ音が自動的に使用されるため、追加は任意です。
