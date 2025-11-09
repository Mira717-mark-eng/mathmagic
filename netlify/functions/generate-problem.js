/**
 * マスマジ！- AI問題生成 Netlify Function
 * OpenAI GPT-4o-miniを使用して問題を生成
 */

const https = require('https');

// OpenAI APIを呼び出す関数
function callOpenAI(messages, apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 400  // トークン数を半分に削減して高速化
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (response.error) {
                        reject(new Error(response.error.message));
                    } else {
                        resolve(response);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// メインハンドラー
exports.handler = async (event, context) => {
    // CORSヘッダー
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // OPTIONSリクエスト（プリフライト）
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // POSTのみ許可
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // リクエストボディをパース
        const body = JSON.parse(event.body);
        const { grade, worldId, difficulty } = body;

        // APIキーを環境変数から取得
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY not configured');
        }

        // ワールド別のプロンプト設定
        const worldPrompts = {
            multiplication_forest: {
                unit: '掛け算（2桁×1桁）',
                example: '3 × 4',
                description: '魔法の森での掛け算の冒険'
            },
            division_cave: {
                unit: '割り算の基礎',
                example: '12 ÷ 3',
                description: '暗い洞窟で宝物を分け合う'
            },
            fraction_tower: {
                unit: '分数の基礎',
                example: '1/2 + 1/4',
                description: '魔法の塔で分数の秘密を学ぶ'
            },
            decimal_sea: {
                unit: '小数の加減',
                example: '1.2 + 2.3',
                description: '広大な海で小数の計算'
            },
            area_square: {
                unit: '面積の計算',
                example: '長方形 3cm × 4cm',
                description: '広場で面積の秘密を学ぶ',
                hasFigure: true
            }
        };

        const worldInfo = worldPrompts[worldId] || worldPrompts.multiplication_forest;

        // プロンプト作成（簡潔化して高速化）
        const systemPrompt = `小学${grade}年「${worldInfo.unit}」の問題をJSON形式で作成:
{
  "story": "ファンタジー風ストーリー（80文字以内）",
  "question": "計算式",
  "answer": 数値,
  "unit": "単位",
  "difficulty": "${difficulty}",
  "hints": ["ヒント1", "ヒント2", "ヒント3"]
}`;

        const userPrompt = `${worldInfo.unit}の問題を作成（例: ${worldInfo.example}）`;

        // OpenAI APIを呼び出し
        const response = await callOpenAI([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ], apiKey);

        // レスポンスからJSONを抽出
        const content = response.choices[0].message.content;
        
        // JSON部分を抽出（```json```で囲まれている場合に対応）
        let problemData;
        if (content.includes('```json')) {
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
            problemData = JSON.parse(jsonMatch ? jsonMatch[1] : content);
        } else if (content.includes('```')) {
            const jsonMatch = content.match(/```\n([\s\S]*?)\n```/);
            problemData = JSON.parse(jsonMatch ? jsonMatch[1] : content);
        } else {
            problemData = JSON.parse(content);
        }

        // バリデーション
        if (!problemData.answer || typeof problemData.answer !== 'number') {
            throw new Error('Invalid problem format: answer must be a number');
        }

        // 問題IDを追加
        problemData.id = Date.now();
        problemData.xp = difficulty === 'easy' ? 50 : difficulty === 'normal' ? 60 : 80;
        problemData.generatedAt = new Date().toISOString();

        // 成功レスポンス
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                problem: problemData
            })
        };

    } catch (error) {
        console.error('Error generating problem:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to generate problem'
            })
        };
    }
};
