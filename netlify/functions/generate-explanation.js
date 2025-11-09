/**
 * マスマジ！- AI解説生成 Netlify Function
 * 正解後に詳しい解説を生成
 */

const https = require('https');

function callOpenAI(messages, apiKey) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500
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
        const { problem, grade, userAnswer } = body;

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY not configured');
        }

        const systemPrompt = `あなたは小学${grade}年生の算数を教える優しい先生です。
問題の解説を、子供にわかりやすく、楽しく説明してください。

【解説の構成】
1. なぜこの答えになるのか（考え方）
2. 解き方の手順（ステップバイステップ）
3. 確かめ方や別の解き方（オプション）
4. 励ましの言葉

【注意点】
- 150-200文字程度
- 難しい言葉は使わない
- 絵文字を適度に使う
- 子供が理解できる例えを使う`;

        const userPrompt = `【問題】
${problem.story}
${problem.question}

【正解】
${problem.answer}${problem.unit}

${userAnswer !== undefined ? `【子供の答え】\n${userAnswer}${problem.unit}\n` : ''}

上記の問題について、わかりやすい解説を作成してください。`;

        const response = await callOpenAI([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ], apiKey);

        const explanation = response.choices[0].message.content.trim();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                explanation: explanation
            })
        };

    } catch (error) {
        console.error('Error generating explanation:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Failed to generate explanation'
            })
        };
    }
};
