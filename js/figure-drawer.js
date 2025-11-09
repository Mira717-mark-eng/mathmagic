/**
 * マスマジ！- 図形描画システム
 * Canvas/SVGを使用して図形・グラフを描画
 */

const FigureDrawer = {
    canvas: null,
    ctx: null,
    scale: 20, // 1単位 = 20px
    
    /**
     * 初期化
     */
    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return false;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // 高DPI対応
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // デフォルトスタイル
        this.ctx.font = '16px "Noto Sans JP", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        return true;
    },
    
    /**
     * キャンバスをクリア
     */
    clear: function() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    /**
     * 長方形を描画
     */
    drawRectangle: function(width, height, label = true) {
        this.clear();
        
        const padding = 60;
        const w = width * this.scale;
        const h = height * this.scale;
        const x = padding;
        const y = padding;
        
        // 長方形
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, w, h);
        
        // 塗りつぶし（薄く）
        this.ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        this.ctx.fillRect(x, y, w, h);
        
        if (label) {
            // 寸法線と数値
            this.ctx.strokeStyle = '#6366f1';
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = '#1f2937';
            
            // 横の寸法
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - 20);
            this.ctx.lineTo(x + w, y - 20);
            this.ctx.stroke();
            this.ctx.fillText(`${width}cm`, x + w/2, y - 30);
            
            // 縦の寸法
            this.ctx.beginPath();
            this.ctx.moveTo(x - 20, y);
            this.ctx.lineTo(x - 20, y + h);
            this.ctx.stroke();
            this.ctx.save();
            this.ctx.translate(x - 35, y + h/2);
            this.ctx.rotate(-Math.PI/2);
            this.ctx.fillText(`${height}cm`, 0, 0);
            this.ctx.restore();
        }
    },
    
    /**
     * 正方形を描画
     */
    drawSquare: function(side, label = true) {
        this.drawRectangle(side, side, label);
    },
    
    /**
     * 円を描画
     */
    drawCircle: function(radius, label = true) {
        this.clear();
        
        const padding = 80;
        const r = radius * this.scale;
        const cx = padding + r;
        const cy = padding + r;
        
        // 円
        this.ctx.strokeStyle = '#ec4899';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 塗りつぶし（薄く）
        this.ctx.fillStyle = 'rgba(236, 72, 153, 0.1)';
        this.ctx.fill();
        
        if (label) {
            // 中心点
            this.ctx.fillStyle = '#1f2937';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 半径の線
            this.ctx.strokeStyle = '#f43f5e';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(cx, cy);
            this.ctx.lineTo(cx + r, cy);
            this.ctx.stroke();
            
            // 半径の値
            this.ctx.fillText(`${radius}cm`, cx + r/2, cy - 15);
        }
    },
    
    /**
     * 三角形を描画
     */
    drawTriangle: function(base, height, label = true) {
        this.clear();
        
        const padding = 60;
        const b = base * this.scale;
        const h = height * this.scale;
        const x = padding;
        const y = padding + h;
        
        // 三角形
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y); // 左下
        this.ctx.lineTo(x + b, y); // 右下
        this.ctx.lineTo(x + b/2, y - h); // 頂点
        this.ctx.closePath();
        this.ctx.stroke();
        
        // 塗りつぶし（薄く）
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        this.ctx.fill();
        
        if (label) {
            this.ctx.fillStyle = '#1f2937';
            
            // 底辺
            this.ctx.fillText(`${base}cm`, x + b/2, y + 20);
            
            // 高さ（点線）
            this.ctx.strokeStyle = '#059669';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(x + b/2, y);
            this.ctx.lineTo(x + b/2, y - h);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            this.ctx.fillText(`${height}cm`, x + b/2 + 25, y - h/2);
        }
    },
    
    /**
     * 複合図形（L字型）を描画
     */
    drawLShape: function(w1, h1, w2, h2) {
        this.clear();
        
        const padding = 60;
        const x = padding;
        const y = padding;
        
        // L字型のパス
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + (w1 * this.scale), y);
        this.ctx.lineTo(x + (w1 * this.scale), y + (h2 * this.scale));
        this.ctx.lineTo(x + (w2 * this.scale), y + (h2 * this.scale));
        this.ctx.lineTo(x + (w2 * this.scale), y + (h1 * this.scale));
        this.ctx.lineTo(x, y + (h1 * this.scale));
        this.ctx.closePath();
        this.ctx.stroke();
        
        // 塗りつぶし
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
        this.ctx.fill();
        
        // 寸法表示（簡略版）
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '14px "Noto Sans JP"';
        this.ctx.fillText(`${w1}cm`, x + (w1 * this.scale)/2, y - 15);
        this.ctx.fillText(`${h1}cm`, x - 25, y + (h1 * this.scale)/2);
    },
    
    /**
     * 棒グラフを描画
     */
    drawBarChart: function(data) {
        this.clear();
        
        const padding = 50;
        const barWidth = 40;
        const barSpacing = 20;
        const maxValue = Math.max(...data.map(d => d.value));
        const chartHeight = 200;
        
        data.forEach((item, index) => {
            const x = padding + index * (barWidth + barSpacing);
            const barHeight = (item.value / maxValue) * chartHeight;
            const y = padding + chartHeight - barHeight;
            
            // 棒
            this.ctx.fillStyle = '#8b5cf6';
            this.ctx.fillRect(x, y, barWidth, barHeight);
            
            // ラベル
            this.ctx.fillStyle = '#1f2937';
            this.ctx.fillText(item.label, x + barWidth/2, padding + chartHeight + 20);
            
            // 値
            this.ctx.fillText(item.value, x + barWidth/2, y - 10);
        });
        
        // Y軸
        this.ctx.strokeStyle = '#6b7280';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding - 10, padding);
        this.ctx.lineTo(padding - 10, padding + chartHeight);
        this.ctx.stroke();
    },
    
    /**
     * 折れ線グラフを描画
     */
    drawLineChart: function(data) {
        this.clear();
        
        const padding = 50;
        const width = 300;
        const height = 200;
        const stepX = width / (data.length - 1);
        const maxValue = Math.max(...data.map(d => d.value));
        
        // 軸
        this.ctx.strokeStyle = '#6b7280';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, padding + height);
        this.ctx.lineTo(padding + width, padding + height);
        this.ctx.stroke();
        
        // 折れ線
        this.ctx.strokeStyle = '#ec4899';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        data.forEach((item, index) => {
            const x = padding + index * stepX;
            const y = padding + height - (item.value / maxValue) * height;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            // ポイント
            this.ctx.fillStyle = '#ec4899';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // ラベル
            this.ctx.fillStyle = '#1f2937';
            this.ctx.fillText(item.label, x, padding + height + 20);
            this.ctx.fillText(item.value, x, y - 15);
        });
        
        this.ctx.stroke();
    },

    /**
     * 時計を描画（Grade 2用）
     */
    drawClock: function(hours, minutes) {
        this.clear();

        const padding = 60;
        const radius = 80;
        const cx = padding + radius;
        const cy = padding + radius;

        // 時計の外枠
        this.ctx.strokeStyle = '#1f2937';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // 時計の文字盤
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 数字（12, 3, 6, 9）
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = 'bold 20px "Noto Sans JP"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const numbers = [12, 3, 6, 9];
        numbers.forEach((num, index) => {
            const angle = (index * Math.PI / 2) - Math.PI / 2;
            const x = cx + Math.cos(angle) * (radius - 20);
            const y = cy + Math.sin(angle) * (radius - 20);
            this.ctx.fillText(num, x, y);
        });

        // 時針
        const hourAngle = ((hours % 12) + minutes / 60) * (Math.PI * 2 / 12) - Math.PI / 2;
        this.ctx.strokeStyle = '#1f2937';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(
            cx + Math.cos(hourAngle) * (radius * 0.5),
            cy + Math.sin(hourAngle) * (radius * 0.5)
        );
        this.ctx.stroke();

        // 分針
        const minuteAngle = (minutes / 60) * (Math.PI * 2) - Math.PI / 2;
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(
            cx + Math.cos(minuteAngle) * (radius * 0.7),
            cy + Math.sin(minuteAngle) * (radius * 0.7)
        );
        this.ctx.stroke();

        // 中心点
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        this.ctx.fill();

        // 時刻表示
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = 'bold 18px "Noto Sans JP"';
        this.ctx.fillText(`${hours}:${minutes.toString().padStart(2, '0')}`, cx, cy + radius + 30);
    },

    /**
     * 座標平面を描画（Grade 7用）
     */
    drawCoordinatePlane: function(points = [], xRange = 10, yRange = 10) {
        this.clear();

        const padding = 50;
        const width = 300;
        const height = 300;
        const centerX = padding + width / 2;
        const centerY = padding + height / 2;
        const scaleX = width / (2 * xRange);
        const scaleY = height / (2 * yRange);

        // グリッド
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.lineWidth = 1;

        // 縦線
        for (let x = -xRange; x <= xRange; x++) {
            const px = centerX + x * scaleX;
            this.ctx.beginPath();
            this.ctx.moveTo(px, padding);
            this.ctx.lineTo(px, padding + height);
            this.ctx.stroke();
        }

        // 横線
        for (let y = -yRange; y <= yRange; y++) {
            const py = centerY - y * scaleY;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, py);
            this.ctx.lineTo(padding + width, py);
            this.ctx.stroke();
        }

        // X軸
        this.ctx.strokeStyle = '#1f2937';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, centerY);
        this.ctx.lineTo(padding + width, centerY);
        this.ctx.stroke();

        // Y軸
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, padding);
        this.ctx.lineTo(centerX, padding + height);
        this.ctx.stroke();

        // 原点
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '14px "Noto Sans JP"';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('O', centerX - 5, centerY + 5);

        // X軸ラベル
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('x', padding + width + 10, centerY - 5);

        // Y軸ラベル
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('y', centerX - 5, padding - 10);

        // 点を描画
        points.forEach(point => {
            const px = centerX + point.x * scaleX;
            const py = centerY - point.y * scaleY;

            // 点
            this.ctx.fillStyle = point.color || '#8b5cf6';
            this.ctx.beginPath();
            this.ctx.arc(px, py, 5, 0, Math.PI * 2);
            this.ctx.fill();

            // 座標表示
            this.ctx.fillStyle = '#1f2937';
            this.ctx.font = 'bold 12px "Noto Sans JP"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`(${point.x}, ${point.y})`, px + 8, py - 8);
        });
    },

    /**
     * 関数グラフを描画（Grade 8-9用）
     */
    drawFunctionGraph: function(func, xMin = -10, xMax = 10, yMin = -10, yMax = 10, label = '') {
        this.clear();

        const padding = 50;
        const width = 300;
        const height = 300;
        const centerX = padding + width / 2;
        const centerY = padding + height / 2;
        const scaleX = width / (xMax - xMin);
        const scaleY = height / (yMax - yMin);

        // 座標軸を描画
        this.drawCoordinatePlane([], (xMax - xMin) / 2, (yMax - yMin) / 2);

        // グラフを描画
        this.ctx.strokeStyle = '#ec4899';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        let firstPoint = true;
        for (let x = xMin; x <= xMax; x += 0.1) {
            try {
                const y = func(x);

                if (!isNaN(y) && isFinite(y) && y >= yMin && y <= yMax) {
                    const px = centerX + (x - (xMin + xMax) / 2) * scaleX;
                    const py = centerY - (y - (yMin + yMax) / 2) * scaleY;

                    if (firstPoint) {
                        this.ctx.moveTo(px, py);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(px, py);
                    }
                }
            } catch (e) {
                // エラーは無視
            }
        }

        this.ctx.stroke();

        // グラフのラベル
        if (label) {
            this.ctx.fillStyle = '#ec4899';
            this.ctx.font = 'bold 16px "Noto Sans JP"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(label, padding + 10, padding + 10);
        }
    },

    /**
     * 立体図形を描画（Grade 5-7用）
     */
    drawSolid: function(type, ...params) {
        this.clear();

        switch (type) {
            case 'cube':
                this.drawCube(params[0]);
                break;
            case 'rectangular_prism':
                this.drawRectangularPrism(params[0], params[1], params[2]);
                break;
            case 'cylinder':
                this.drawCylinder(params[0], params[1]);
                break;
            case 'cone':
                this.drawCone(params[0], params[1]);
                break;
            case 'sphere':
                this.drawSphere(params[0]);
                break;
            default:
                console.warn('Unknown solid type:', type);
        }
    },

    /**
     * 立方体を描画
     */
    drawCube: function(side) {
        const s = side * this.scale;
        const offsetX = 100;
        const offsetY = 100;
        const depth = s * 0.5; // 奥行きの視覚効果

        // 前面
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(offsetX, offsetY, s, s);

        // 奥面
        this.ctx.strokeRect(offsetX + depth, offsetY - depth, s, s);

        // 接続線
        this.ctx.beginPath();
        this.ctx.moveTo(offsetX, offsetY);
        this.ctx.lineTo(offsetX + depth, offsetY - depth);
        this.ctx.moveTo(offsetX + s, offsetY);
        this.ctx.lineTo(offsetX + s + depth, offsetY - depth);
        this.ctx.moveTo(offsetX, offsetY + s);
        this.ctx.lineTo(offsetX + depth, offsetY + s - depth);
        this.ctx.moveTo(offsetX + s, offsetY + s);
        this.ctx.lineTo(offsetX + s + depth, offsetY + s - depth);
        this.ctx.stroke();

        // ラベル
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '14px "Noto Sans JP"';
        this.ctx.fillText(`${side}cm`, offsetX + s / 2, offsetY + s + 20);
    },

    /**
     * 直方体を描画
     */
    drawRectangularPrism: function(width, height, depth) {
        const w = width * this.scale;
        const h = height * this.scale;
        const d = depth * this.scale * 0.5;
        const offsetX = 80;
        const offsetY = 80;

        // 前面
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(offsetX, offsetY, w, h);

        // 奥面
        this.ctx.strokeRect(offsetX + d, offsetY - d, w, h);

        // 接続線
        this.ctx.beginPath();
        this.ctx.moveTo(offsetX, offsetY);
        this.ctx.lineTo(offsetX + d, offsetY - d);
        this.ctx.moveTo(offsetX + w, offsetY);
        this.ctx.lineTo(offsetX + w + d, offsetY - d);
        this.ctx.moveTo(offsetX, offsetY + h);
        this.ctx.lineTo(offsetX + d, offsetY + h - d);
        this.ctx.moveTo(offsetX + w, offsetY + h);
        this.ctx.lineTo(offsetX + w + d, offsetY + h - d);
        this.ctx.stroke();

        // ラベル
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '12px "Noto Sans JP"';
        this.ctx.fillText(`${width}cm`, offsetX + w / 2, offsetY + h + 20);
        this.ctx.fillText(`${height}cm`, offsetX - 15, offsetY + h / 2);
        this.ctx.fillText(`${depth}cm`, offsetX + w + 15, offsetY - 10);
    },

    /**
     * 円柱を描画
     */
    drawCylinder: function(radius, height) {
        const r = radius * this.scale;
        const h = height * this.scale;
        const cx = 150;
        const cy = 100;

        // 上部の楕円
        this.ctx.strokeStyle = '#ec4899';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // 側面
        this.ctx.beginPath();
        this.ctx.moveTo(cx - r, cy);
        this.ctx.lineTo(cx - r, cy + h);
        this.ctx.moveTo(cx + r, cy);
        this.ctx.lineTo(cx + r, cy + h);
        this.ctx.stroke();

        // 下部の楕円
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy + h, r, r * 0.3, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // ラベル
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '14px "Noto Sans JP"';
        this.ctx.fillText(`r=${radius}cm`, cx, cy - 20);
        this.ctx.fillText(`h=${height}cm`, cx + r + 20, cy + h / 2);
    },

    /**
     * 円錐を描画
     */
    drawCone: function(radius, height) {
        const r = radius * this.scale;
        const h = height * this.scale;
        const cx = 150;
        const cy = 80;

        // 頂点から底面への線
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cx - r, cy + h);
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cx + r, cy + h);
        this.ctx.stroke();

        // 底面の楕円
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy + h, r, r * 0.3, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // 高さの線（点線）
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cx, cy + h);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // ラベル
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '14px "Noto Sans JP"';
        this.ctx.fillText(`r=${radius}cm`, cx, cy + h + 20);
        this.ctx.fillText(`h=${height}cm`, cx + 20, cy + h / 2);
    },

    /**
     * 球を描画
     */
    drawSphere: function(radius) {
        const r = radius * this.scale;
        const cx = 150;
        const cy = 150;

        // 球（正円）
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // 赤道（楕円）
        this.ctx.strokeStyle = '#d97706';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // 半径
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(cx + r, cy);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // ラベル
        this.ctx.fillStyle = '#1f2937';
        this.ctx.font = '14px "Noto Sans JP"';
        this.ctx.fillText(`r=${radius}cm`, cx + r / 2, cy - 10);
    }
};

// グローバルに公開
window.FigureDrawer = FigureDrawer;

console.log('✅ figure-drawer.js ロード完了');
