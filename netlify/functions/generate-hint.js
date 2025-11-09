/**
 * マスマジ！- AIヒント生成 Netlify Function
 * 既存の問題に対してヒントを動的生成
 */

const https = require('https');

function callOpenAI(messages, apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 300
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': data.length
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

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { problem, hintLevel, grade } = body;

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY not configured');
        }

        // ヒントレベル別のプロンプト
        const hintPrompts = {
            1: '問題を解くための考え方の方向性を、優しく示してください。答えは言わないでください。',
            2: '具体的な解法の手順を、ステップバイステップで説明してください。ただし、最後の計算だけは残してください。',
            3: '答えにとても近いヒントを出してください。ほぼ答えがわかるレベルで構いません。'
        };

        const systemPrompt = `あなたは小学${grade}年生の算数を教える優しい先生です。
子供が自分で考える力を育てるため、適切なヒントを出してください。

【ヒントのレベル】
レベル1: 考え方の方向性（答えは言わない）
レベル2: 具体的な手順（最後の計算は残す）
レベル3: 答えに近いヒント（ほぼわかるレベル）

【出力】
- 50-80文字程度
- 子供にわかりやすい言葉
- 励ましの言葉を含める`;

        const userPrompt = `【問題】
${problem.story}
${problem.question}

【答え】
${problem.answer}${problem.unit}

【ヒントレベル】
${hintLevel}: ${hintPrompts[hintLevel]}

上記の問題に対して、レベル${hintLevel}のヒントを作成してください。`;

        const response = await callOpenAI([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ], apiKey);

        const hint = response.choices[0].message.content.trim();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                hint: hint,
                hintLevel: hintLevel
            })
        };

    } catch (error) {
        console.error('Error generating hint:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to generate hint'
            })
        };
    }
};
