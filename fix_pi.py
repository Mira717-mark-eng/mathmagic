import json
import re
import math

# ファイルを読み込み
with open('js/problems/jh1-quest06.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# π記号を含む答えを数値に変換
for problem in data['problems']:
    answer = str(problem['answer'])

    # π記号を含む場合、計算して数値に変換
    if 'π' in answer:
        # π を 3.14 に置き換えて計算
        try:
            # 数式を評価（πを3.14に置換）
            formula = answer.replace('π', '*3.14')
            result = eval(formula)
            problem['answer'] = round(result, 2) if result != int(result) else int(result)
            print(f"問題{problem['id']}: {answer} → {problem['answer']}")
        except:
            print(f"問題{problem['id']}: {answer} - 変換エラー")

# ファイルに書き出し
with open('js/problems/jh1-quest06.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n変換完了！")
