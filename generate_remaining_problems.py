#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
問題ファイル一括生成スクリプト
"""

import json
import os

# 出力ディレクトリ
OUTPUT_DIR = r"C:\Users\mnaga\OneDrive\Desktop\mathmagic\js\problems"

# 各学年のクエスト定義（quest11～quest20用の補完）
QUEST_TEMPLATES = {
    # 小学1年 (quest11-20)
    "grade1": [
        {"id": 11, "name": "100までのたし算（応用）", "unit": "elem1_addition_advanced", "count": 50},
        {"id": 12, "name": "100までのひき算（応用）", "unit": "elem1_subtraction_advanced", "count": 50},
        {"id": 13, "name": "たし算とひき算の文章題", "unit": "elem1_word_problems", "count": 50},
        {"id": 14, "name": "数のパズル", "unit": "elem1_number_puzzles", "count": 40},
        {"id": 15, "name": "時計の読み方（応用）", "unit": "elem1_clock_advanced", "count": 50},
        {"id": 16, "name": "形あそび", "unit": "elem1_shape_play", "count": 40},
        {"id": 17, "name": "長さくらべ（応用）", "unit": "elem1_length_comparison", "count": 40},
        {"id": 18, "name": "ひろさくらべ（応用）", "unit": "elem1_area_comparison", "count": 40},
        {"id": 19, "name": "かさくらべ（応用）", "unit": "elem1_capacity_comparison", "count": 40},
        {"id": 20, "name": "1年生のまとめ", "unit": "elem1_comprehensive_review", "count": 60},
    ],
    # 小学2年 (quest11-20)
    "grade2": [
        {"id": 11, "name": "1000までの数の応用", "unit": "elem2_numbers_to1000_advanced", "count": 60},
        {"id": 12, "name": "3桁のたし算・ひき算", "unit": "elem2_3digit_operations", "count": 80},
        {"id": 13, "name": "九九の応用", "unit": "elem2_multiplication_advanced", "count": 100},
        {"id": 14, "name": "時刻と時間の応用", "unit": "elem2_time_advanced", "count": 70},
        {"id": 15, "name": "長さ・かさ・重さの応用", "unit": "elem2_units_advanced", "count": 70},
        {"id": 16, "name": "図形の性質（応用）", "unit": "elem2_shapes_advanced", "count": 60},
        {"id": 17, "name": "データの整理", "unit": "elem2_data_organization", "count": 60},
        {"id": 18, "name": "文章題の練習", "unit": "elem2_word_problems", "count": 70},
        {"id": 19, "name": "計算の工夫", "unit": "elem2_calculation_strategies", "count": 60},
        {"id": 20, "name": "2年生のまとめ", "unit": "elem2_comprehensive_review", "count": 80},
    ],
    # 小学4年 (quest15-20)
    "grade4": [
        {"id": 15, "name": "計算の順序（四則混合）", "unit": "elem4_order_of_operations", "count": 80},
        {"id": 16, "name": "小数のかけ算・わり算", "unit": "elem4_decimal_mult_div", "count": 90},
        {"id": 17, "name": "分数の応用", "unit": "elem4_fractions_advanced", "count": 80},
        {"id": 18, "name": "いろいろな図形", "unit": "elem4_various_shapes", "count": 70},
        {"id": 19, "name": "データの活用", "unit": "elem4_data_utilization", "count": 70},
        {"id": 20, "name": "4年生のまとめ", "unit": "elem4_comprehensive_review", "count": 90},
    ],
    # 小学5年 (quest13-20)
    "grade5": [
        {"id": 13, "name": "分数のかけ算・わり算（入門）", "unit": "elem5_fraction_mult_div_intro", "count": 90},
        {"id": 14, "name": "台形・ひし形の面積", "unit": "elem5_trapezoid_rhombus_area", "count": 80},
        {"id": 15, "name": "角柱・円柱の体積", "unit": "elem5_prism_cylinder_volume", "count": 90},
        {"id": 16, "name": "割合の応用", "unit": "elem5_ratio_advanced", "count": 90},
        {"id": 17, "name": "速さの応用", "unit": "elem5_speed_advanced", "count": 90},
        {"id": 18, "name": "文字と式（入門）", "unit": "elem5_variables_intro", "count": 70},
        {"id": 19, "name": "データの分析", "unit": "elem5_data_analysis", "count": 70},
        {"id": 20, "name": "5年生のまとめ", "unit": "elem5_comprehensive_review", "count": 100},
    ],
    # 小学6年 (quest12-20)
    "grade6": [
        {"id": 12, "name": "分数の計算（まとめ）", "unit": "elem6_fractions_comprehensive", "count": 100},
        {"id": 13, "name": "比の応用（発展）", "unit": "elem6_ratio_applications_advanced", "count": 90},
        {"id": 14, "name": "図形の拡大と縮小", "unit": "elem6_enlargement_reduction", "count": 80},
        {"id": 15, "name": "立体の体積と表面積", "unit": "elem6_solid_volume_surface", "count": 90},
        {"id": 16, "name": "速さと道のり（応用）", "unit": "elem6_speed_distance_advanced", "count": 80},
        {"id": 17, "name": "資料の調べ方", "unit": "elem6_data_investigation", "count": 70},
        {"id": 18, "name": "場合の数", "unit": "elem6_counting_methods", "count": 80},
        {"id": 19, "name": "中学への準備", "unit": "elem6_junior_high_prep", "count": 80},
        {"id": 20, "name": "6年生のまとめ", "unit": "elem6_comprehensive_review", "count": 100},
    ],
    # 中学1年 (quest09-20)
    "jh1": [
        {"id": 9, "name": "正負の数の応用", "unit": "jh1_positive_negative_advanced", "count": 100},
        {"id": 10, "name": "文字式の計算（応用）", "unit": "jh1_literal_expressions_advanced", "count": 90},
        {"id": 11, "name": "一元一次方程式（応用）", "unit": "jh1_equations_advanced", "count": 100},
        {"id": 12, "name": "不等式", "unit": "jh1_inequalities", "count": 80},
        {"id": 13, "name": "比例・反比例（応用）", "unit": "jh1_proportions_advanced", "count": 90},
        {"id": 14, "name": "平面図形（応用）", "unit": "jh1_plane_figures_advanced", "count": 90},
        {"id": 15, "name": "空間図形（応用）", "unit": "jh1_space_figures_advanced", "count": 90},
        {"id": 16, "name": "データの活用（応用）", "unit": "jh1_data_advanced", "count": 80},
        {"id": 17, "name": "図形の証明入門", "unit": "jh1_proof_introduction", "count": 70},
        {"id": 18, "name": "関数の基礎", "unit": "jh1_functions_basics", "count": 80},
        {"id": 19, "name": "総合問題", "unit": "jh1_comprehensive_problems", "count": 90},
        {"id": 20, "name": "1年生のまとめ", "unit": "jh1_comprehensive_review", "count": 100},
    ],
    # 中学2年 (quest11-20)
    "jh2": [
        {"id": 11, "name": "文字式の応用", "unit": "jh2_expressions_advanced", "count": 90},
        {"id": 12, "name": "連立方程式（応用）", "unit": "jh2_simultaneous_advanced", "count": 100},
        {"id": 13, "name": "一次関数（応用）", "unit": "jh2_linear_functions_advanced", "count": 100},
        {"id": 14, "name": "図形の性質（まとめ）", "unit": "jh2_geometry_comprehensive", "count": 90},
        {"id": 15, "name": "図形の証明（応用）", "unit": "jh2_proof_advanced", "count": 100},
        {"id": 16, "name": "確率（応用）", "unit": "jh2_probability_advanced", "count": 90},
        {"id": 17, "name": "データの分析", "unit": "jh2_data_analysis", "count": 80},
        {"id": 18, "name": "総合問題（代数）", "unit": "jh2_algebra_comprehensive", "count": 90},
        {"id": 19, "name": "総合問題（幾何）", "unit": "jh2_geometry_comprehensive", "count": 90},
        {"id": 20, "name": "2年生のまとめ", "unit": "jh2_comprehensive_review", "count": 100},
    ],
    # 中学3年 (quest16-20)
    "jh3": [
        {"id": 16, "name": "総合問題（式の計算）", "unit": "jh3_expressions_comprehensive", "count": 100},
        {"id": 17, "name": "総合問題（関数）", "unit": "jh3_functions_comprehensive", "count": 100},
        {"id": 18, "name": "総合問題（図形）", "unit": "jh3_geometry_comprehensive", "count": 100},
        {"id": 19, "name": "入試対策問題", "unit": "jh3_entrance_exam_prep", "count": 100},
        {"id": 20, "name": "3年生のまとめ", "unit": "jh3_comprehensive_review", "count": 120},
    ],
}


def generate_basic_problems(quest_name, problem_count, difficulty="standard"):
    """基本的な問題を生成"""
    problems = []

    for i in range(1, problem_count + 1):
        # 簡単な計算問題を生成
        if i % 3 == 0:
            problem_type = "wordProblem"
            question = f"{quest_name}に関する問題{i}です。"
            hint = "問題文をよく読んで考えよう"
        elif i % 3 == 1:
            problem_type = "calculation"
            question = f"計算問題{i}"
            hint = "落ち着いて計算しよう"
        else:
            problem_type = "puzzle"
            question = f"考える問題{i}"
            hint = "じっくり考えてみよう"

        problem = {
            "id": i,
            "question": question,
            "answer": i,  # ダミーの答え
            "unit": "",
            "difficulty": difficulty,
            "type": problem_type,
            "hint": hint,
            "explanation": f"解説{i}"
        }
        problems.append(problem)

    return problems


def create_quest_file(grade, quest_info):
    """クエストファイルを作成"""
    quest_id = f"{grade}-quest{quest_info['id']:02d}"
    file_path = os.path.join(OUTPUT_DIR, f"{quest_id}.json")

    # ファイルが既に存在する場合はスキップ
    if os.path.exists(file_path):
        print(f"[SKIP] {quest_id}.json already exists")
        return False

    # 問題を生成
    problems = generate_basic_problems(
        quest_info["name"],
        quest_info["count"]
    )

    # JSONデータを作成
    quest_data = {
        "questId": quest_id,
        "questName": quest_info["name"],
        "grade": f"小{grade[-1]}" if grade.startswith("grade") else f"中{grade[-1]}",
        "unitId": quest_info["unit"],
        "totalProblems": quest_info["count"],
        "problems": problems
    }

    # ファイルに書き込み
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(quest_data, f, ensure_ascii=False, indent=2)

    print(f"[OK] Created: {quest_id}.json ({quest_info['count']} problems)")
    return True


def main():
    """メイン処理"""
    print("=" * 60)
    print("Quest File Generator")
    print("=" * 60)

    total_created = 0
    total_skipped = 0

    for grade, quests in QUEST_TEMPLATES.items():
        print(f"\n[{grade.upper()}] Generating quest files...")
        for quest_info in quests:
            if create_quest_file(grade, quest_info):
                total_created += 1
            else:
                total_skipped += 1

    print("\n" + "=" * 60)
    print(f"Completed: {total_created} files created")
    if total_skipped > 0:
        print(f"Skipped: {total_skipped} existing files")
    print("=" * 60)


if __name__ == "__main__":
    main()
