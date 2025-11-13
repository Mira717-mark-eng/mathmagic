/**
 * マスマジ！- 図形ビジュアライゼーションシステム
 * Canvas を使った図形の描画とインタラクティブ操作
 */

const GeometryVisualizer = {
    canvas: null,
    ctx: null,
    scale: 30, // 1cm = 30px

    /**
     * 初期化
     */
    init: function(canvasId = 'geometry-canvas') {
        console.log('🎨 GeometryVisualizer.init 開始, canvasId:', canvasId);
        this.canvas = document.getElementById(canvasId);
        console.log('Canvas要素取得:', this.canvas);

        if (!this.canvas) {
            console.error('❌ Canvas要素が見つかりません:', canvasId);
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        console.log('2Dコンテキスト取得:', this.ctx);

        this.canvas.width = 675;
        this.canvas.height = 450;
        console.log('Canvas サイズ設定:', this.canvas.width, 'x', this.canvas.height);

        console.log('✅ GeometryVisualizer 初期化完了');
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
     * 座標変換（中心を原点に）
     */
    toCanvasCoords: function(x, y) {
        return {
            x: this.canvas.width / 2 + x * this.scale,
            y: this.canvas.height / 2 - y * this.scale
        };
    },

    /**
     * 角度を描画（2本の線が交わる）
     */
    drawIntersectingLines: function(visualData) {
        this.clear();
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const lineLength = 150;

        // 背景
        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // グリッド線（薄く）
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < this.canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(this.canvas.width, i);
            ctx.stroke();
        }

        // 交わる2本の線
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;

        // 水平線
        ctx.beginPath();
        ctx.moveTo(centerX - lineLength, centerY);
        ctx.lineTo(centerX + lineLength, centerY);
        ctx.stroke();

        // 斜めの線（angle1の角度で）
        // Canvas座標系: 右がプラスX、下がプラスY
        // 角度: 水平右向きを0度とし、反時計回りに増加
        const angle1Rad = (visualData.angle1 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(centerX - Math.cos(angle1Rad) * lineLength, centerY + Math.sin(angle1Rad) * lineLength);
        ctx.lineTo(centerX + Math.cos(angle1Rad) * lineLength, centerY - Math.sin(angle1Rad) * lineLength);
        ctx.stroke();

        // 角度を色付きで表示
        const angles = [
            { value: visualData.angle1, startAngle: 0, color: '#ff6b6b', label: '①', position: 'right-top' },
            { value: visualData.angle2, startAngle: visualData.angle1, color: '#4ecdc4', label: '②', position: 'left-top' },
            { value: visualData.angle1, startAngle: 180, color: '#ffe66d', label: '③', position: 'left-bottom' },
            { value: visualData.angle2, startAngle: 180 + visualData.angle1, color: '#95e1d3', label: '④', position: 'right-bottom' }
        ];

        angles.forEach((angle, index) => {
            // 角度の扇形
            ctx.fillStyle = angle.color + '40'; // 透明度40%
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            const startRad = (angle.startAngle * Math.PI) / 180;
            const endRad = ((angle.startAngle + angle.value) * Math.PI) / 180;
            ctx.arc(centerX, centerY, 40, -startRad, -endRad, true);
            ctx.closePath();
            ctx.fill();

            // 角度のラベル
            if (visualData.showLabels !== false) {
                ctx.fillStyle = angle.color;
                ctx.font = 'bold 28px Arial';  // より大きく
                const labelAngle = ((angle.startAngle + angle.value / 2) * Math.PI) / 180;
                const labelX = centerX + Math.cos(labelAngle) * 70;  // 少し外側に
                const labelY = centerY - Math.sin(labelAngle) * 70;

                // 白い背景を追加（見やすくする）
                ctx.fillStyle = 'white';
                ctx.fillRect(labelX - 25, labelY - 25, 50, 60);

                // ラベル
                ctx.fillStyle = angle.color;
                ctx.fillText(angle.label, labelX - 15, labelY + 5);

                // 角度の値を表示するかチェック（showAnglesプロパティ）
                const showAngles = visualData.showAngles || [false, false, false, false];
                if (showAngles[index]) {
                    ctx.font = 'bold 20px Arial';  // より大きく
                    ctx.fillText(`${angle.value}°`, labelX - 20, labelY + 30);
                } else {
                    // 角度の値を隠す（？マークを表示）
                    ctx.font = 'bold 20px Arial';
                    ctx.fillStyle = '#999';
                    ctx.fillText('?°', labelX - 15, labelY + 30);
                }
            }
        });

        // タイトル
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('2本の直線が交わったとき', 20, 30);
    },

    /**
     * 補角を描画
     */
    drawSupplementaryAngles: function(visualData) {
        this.clear();
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 背景
        ctx.fillStyle = '#fff8e1';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 直線
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, centerY);
        ctx.lineTo(this.canvas.width - 50, centerY);
        ctx.stroke();

        // 角度A
        const angle1Rad = (visualData.angle1 * Math.PI) / 180;
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle1Rad) * 150, centerY - Math.sin(angle1Rad) * 150);
        ctx.stroke();

        // 角度Aの扇形
        ctx.fillStyle = '#e74c3c40';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, 60, 0, -angle1Rad, true);
        ctx.closePath();
        ctx.fill();

        // 角度Bの扇形
        ctx.fillStyle = '#3498db40';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, 60, -angle1Rad, -Math.PI, true);
        ctx.closePath();
        ctx.fill();

        // ラベル
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('角A', centerX + 70, centerY - 50);
        if (visualData.showAngleValues !== false) {
            ctx.font = '20px Arial';
            ctx.fillText(`${visualData.angle1}°`, centerX + 70, centerY - 25);
        }

        ctx.fillStyle = '#3498db';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('角B', centerX - 100, centerY - 50);
        if (visualData.showAngleValues !== false) {
            ctx.font = '20px Arial';
            ctx.fillText(`${visualData.angle2}°`, centerX - 100, centerY - 25);
        } else {
            ctx.font = '20px Arial';
            ctx.fillStyle = '#999';
            ctx.fillText('?°', centerX - 100, centerY - 25);
        }

        // 説明
        ctx.fillStyle = '#333';
        ctx.font = '18px Arial';
        ctx.fillText(`${visualData.location}の角度`, 20, 30);
        ctx.fillText('角A + 角B = 180°', 20, 380);
    },

    /**
     * 三角形を描画（角度表示付き）
     */
    drawTriangleAngles: function(visualData) {
        this.clear();
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 背景は透明（カードの背景が見える）
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 三角形の頂点を計算
        // A（左下）、B（右下）、C（上）の順
        const baseLength = 240;  // 底辺の長さ

        // 角A、B、Cの角度（ラジアン）
        const angleA = (visualData.angle1 * Math.PI) / 180;
        const angleB = (visualData.angle2 * Math.PI) / 180;
        const angleC = (visualData.angle3 * Math.PI) / 180;

        // 正弦定理を使って各辺の長さを計算
        // a/sin(A) = b/sin(B) = c/sin(C)
        // c（底辺AB）を基準に他の辺を計算
        const sideC = baseLength;  // 底辺（AB）
        const sideA = (sideC * Math.sin(angleA)) / Math.sin(angleC);  // BC
        const sideB = (sideC * Math.sin(angleB)) / Math.sin(angleC);  // AC

        // 頂点の座標を計算
        const points = [
            { x: centerX - baseLength / 2, y: centerY + 120 },  // A（左下）
            { x: centerX + baseLength / 2, y: centerY + 120 },  // B（右下）
            {
                // C（上）: Aから角Aの方向にsideB進んだ位置
                x: centerX - baseLength / 2 + sideB * Math.cos(angleA),
                y: centerY + 120 - sideB * Math.sin(angleA)
            }
        ];

        // 三角形を描画
        ctx.fillStyle = '#b3e5fc';  // はっきりした水色
        ctx.strokeStyle = '#0277bd';  // 濃い青の枠線
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 角度の扇形を描画
        const angleColors = ['#ff6b6b', '#4ecdc4', '#ff9800'];
        const angleLabels = ['A', 'B', 'C'];
        const angleValues = [visualData.angle1, visualData.angle2, visualData.angle3];
        const showAngles = visualData.showAngles || [true, true, true];

        // 角A（左下）- 点Aで辺ABと辺ACの間の角
        if (showAngles[0]) {
            ctx.fillStyle = angleColors[0] + 'cc';  // 透過率80%
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            // 辺AB方向（右向き：0度）から辺AC方向（上向き）へ反時計回りに角A分
            // Canvas座標系では上がマイナスY方向なので注意
            ctx.arc(points[0].x, points[0].y, 40, -angleA, 0, false);
            ctx.lineTo(points[0].x, points[0].y);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = angleColors[0];
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`∠${angleLabels[0]}`, points[0].x + 50, points[0].y - 25);
            ctx.font = '18px Arial';
            ctx.fillText(`${angleValues[0]}°`, points[0].x + 50, points[0].y - 5);
        }

        // 角B（右下）- 点Bで辺BAと辺BCの間の角
        if (showAngles[1]) {
            ctx.fillStyle = angleColors[1] + 'cc';  // 透過率80%
            ctx.beginPath();
            ctx.moveTo(points[1].x, points[1].y);
            // 辺BC方向から辺BA方向（左向き：π）へ反時計回りに角B分
            const angleBCtoBA = Math.PI - angleB;
            ctx.arc(points[1].x, points[1].y, 40, -angleBCtoBA, -Math.PI, true);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = angleColors[1];
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`∠${angleLabels[1]}`, points[1].x - 80, points[1].y - 25);
            ctx.font = '18px Arial';
            ctx.fillText(`${angleValues[1]}°`, points[1].x - 80, points[1].y - 5);
        }

        // 角C（上）- 点Cで辺CAと辺CBの間の角
        ctx.fillStyle = angleColors[2] + 'cc';  // 透過率80%
        ctx.beginPath();
        ctx.moveTo(points[2].x, points[2].y);
        // 辺CAの方向を計算（点Cから点Aへ）
        const dxCA = points[0].x - points[2].x;
        const dyCA = points[0].y - points[2].y;
        const angleCA = Math.atan2(dyCA, dxCA);
        // 辺CBの方向を計算（点Cから点Bへ）
        const dxCB = points[1].x - points[2].x;
        const dyCB = points[1].y - points[2].y;
        const angleCB = Math.atan2(dyCB, dxCB);
        // 辺CBから辺CAまで反時計回りに扇形を描画（内角を描くため順序を逆に）
        ctx.arc(points[2].x, points[2].y, 40, angleCB, angleCA, false);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = angleColors[2];
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`∠${angleLabels[2]}`, points[2].x - 20, points[2].y + 70);
        ctx.font = '18px Arial';
        // showAngles[2]がtrueなら角度を表示、falseなら?°を表示
        ctx.fillText(showAngles[2] ? `${angleValues[2]}°` : '?°', points[2].x - 15, points[2].y + 90);

        // タイトル
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('三角形の内角', 20, 30);
    },

    /**
     * 面積比較を描画
     */
    drawAreaComparison: function(visualData) {
        this.clear();
        const ctx = this.ctx;

        // 背景は透明（削除）

        // 中央揃えの計算
        const centerY = this.canvas.height / 2;
        const boxSpacing = 100;
        const totalWidth = (visualData.shape1.base * this.scale) + boxSpacing + (visualData.shape2.base * this.scale);
        const startX = (this.canvas.width - totalWidth) / 2;

        // 図形1
        const x1 = startX;
        const y1 = centerY + (visualData.shape1.height * this.scale / 2);
        const width1 = visualData.shape1.base * this.scale;
        const height1 = visualData.shape1.height * this.scale;

        ctx.fillStyle = '#ff6b6b80';
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.fillRect(x1, y1 - height1, width1, height1);
        ctx.strokeRect(x1, y1 - height1, width1, height1);

        // ラベル1
        ctx.fillStyle = '#c0392b';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(visualData.shape1.name, x1, y1 + 30);
        ctx.font = '16px Arial';
        ctx.fillText(`${visualData.shape1.base}cm × ${visualData.shape1.height}cm`, x1, y1 + 50);

        if (visualData.showAreas) {
            const area1 = visualData.shape1.base * visualData.shape1.height;
            ctx.fillText(`面積: ${area1}cm²`, x1, y1 + 70);
        }

        // 図形2
        const x2 = x1 + width1 + boxSpacing;
        const y2 = centerY + (visualData.shape2.height * this.scale / 2);
        const width2 = visualData.shape2.base * this.scale;
        const height2 = visualData.shape2.height * this.scale;

        ctx.fillStyle = '#4ecdc480';
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 3;
        ctx.fillRect(x2, y2 - height2, width2, height2);
        ctx.strokeRect(x2, y2 - height2, width2, height2);

        // ラベル2
        ctx.fillStyle = '#16a085';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(visualData.shape2.name, x2, y2 + 30);
        ctx.font = '16px Arial';
        ctx.fillText(`${visualData.shape2.base}cm × ${visualData.shape2.height}cm`, x2, y2 + 50);

        if (visualData.showAreas) {
            const area2 = visualData.shape2.base * visualData.shape2.height;
            ctx.fillText(`面積: ${area2}cm²`, x2, y2 + 70);
        }

        // タイトル（表示しない - 問題文で説明する）
        // ctx.fillStyle = '#333';
        // ctx.font = 'bold 20px Arial';
        // ctx.fillText('どっちが広い？', this.canvas.width / 2 - 80, 30);
    },

    /**
     * 三角形の面積を描画
     */
    drawTriangleArea: function(visualData) {
        this.clear();
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const baseY = 300;

        // 背景
        ctx.fillStyle = '#fff8e1';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const baseWidth = visualData.base * this.scale;
        const triangleHeight = visualData.height * this.scale;

        // まず長方形を描画（薄く）
        if (visualData.showFormula) {
            ctx.fillStyle = '#e0e0e040';
            ctx.strokeStyle = '#9e9e9e';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.fillRect(centerX - baseWidth / 2, baseY - triangleHeight, baseWidth, triangleHeight);
            ctx.strokeRect(centerX - baseWidth / 2, baseY - triangleHeight, baseWidth, triangleHeight);
            ctx.setLineDash([]);
        }

        // 三角形を描画
        ctx.fillStyle = '#ff9ff380';
        ctx.strokeStyle = '#f06292';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - baseWidth / 2, baseY);
        ctx.lineTo(centerX + baseWidth / 2, baseY);
        ctx.lineTo(centerX, baseY - triangleHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 底辺の寸法線
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - baseWidth / 2, baseY + 20);
        ctx.lineTo(centerX + baseWidth / 2, baseY + 20);
        ctx.stroke();

        // 矢印
        this.drawArrow(ctx, centerX - baseWidth / 2, baseY + 20, centerX - baseWidth / 2 + 10, baseY + 20);
        this.drawArrow(ctx, centerX + baseWidth / 2, baseY + 20, centerX + baseWidth / 2 - 10, baseY + 20);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`底辺 ${visualData.base}cm`, centerX - 50, baseY + 50);

        // 高さの寸法線
        ctx.beginPath();
        ctx.moveTo(centerX - baseWidth / 2 - 20, baseY);
        ctx.lineTo(centerX - baseWidth / 2 - 20, baseY - triangleHeight);
        ctx.stroke();

        this.drawArrow(ctx, centerX - baseWidth / 2 - 20, baseY, centerX - baseWidth / 2 - 20, baseY - 10);
        this.drawArrow(ctx, centerX - baseWidth / 2 - 20, baseY - triangleHeight, centerX - baseWidth / 2 - 20, baseY - triangleHeight + 10);

        ctx.save();
        ctx.translate(centerX - baseWidth / 2 - 50, baseY - triangleHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`高さ ${visualData.height}cm`, -50, 0);
        ctx.restore();

        // 公式の表示
        if (visualData.showFormula) {
            ctx.fillStyle = '#d32f2f';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(`面積 = ${visualData.base} × ${visualData.height} ÷ 2`, 20, 30);
            ctx.fillText(`    = ${(visualData.base * visualData.height) / 2}cm²`, 20, 60);
        }
    },

    /**
     * 矢印を描画
     */
    drawArrow: function(ctx, fromX, fromY, toX, toY) {
        const headLength = 8;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    },

    /**
     * 図形の分解を描画
     */
    drawShapeDecomposition: function(visualData) {
        this.clear();
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 背景
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const totalWidth = visualData.width * this.scale;
        const height = visualData.height * this.scale;
        const cutPos = visualData.cutPosition * this.scale;

        // 左側の長方形
        ctx.fillStyle = '#ff6b6b80';
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.fillRect(centerX - totalWidth / 2, centerY - height / 2, cutPos, height);
        ctx.strokeRect(centerX - totalWidth / 2, centerY - height / 2, cutPos, height);

        // 右側の長方形
        ctx.fillStyle = '#4ecdc480';
        ctx.strokeStyle = '#4ecdc4';
        ctx.fillRect(centerX - totalWidth / 2 + cutPos, centerY - height / 2, totalWidth - cutPos, height);
        ctx.strokeRect(centerX - totalWidth / 2 + cutPos, centerY - height / 2, totalWidth - cutPos, height);

        // 切断線
        if (visualData.showCut) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.moveTo(centerX - totalWidth / 2 + cutPos, centerY - height / 2 - 20);
            ctx.lineTo(centerX - totalWidth / 2 + cutPos, centerY + height / 2 + 20);
            ctx.stroke();
            ctx.setLineDash([]);

            // はさみマーク
            ctx.font = '24px Arial';
            ctx.fillText('✂️', centerX - totalWidth / 2 + cutPos - 15, centerY - height / 2 - 25);
        }

        // ラベル
        ctx.fillStyle = '#c0392b';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`${visualData.cutPosition}cm`, centerX - totalWidth / 2 + cutPos / 2 - 20, centerY);

        ctx.fillStyle = '#16a085';
        ctx.fillText(`${visualData.width - visualData.cutPosition}cm`, centerX - totalWidth / 2 + cutPos + (totalWidth - cutPos) / 2 - 20, centerY);

        // 全体の寸法
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText(`全体: ${visualData.width}cm × ${visualData.height}cm`, centerX - 80, centerY + height / 2 + 40);
    },

    /**
     * 長方形内の三角形を描画
     */
    drawTriangleInRectangle: function(visualData) {
        this.clear();
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 背景
        ctx.fillStyle = '#e8f5e9';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const width = visualData.width * this.scale;
        const height = visualData.height * this.scale;

        // 長方形
        ctx.fillStyle = '#c8e6c920';
        ctx.strokeStyle = '#4caf50';
        ctx.lineWidth = 3;
        ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);
        ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);

        // 対角線
        if (visualData.showDiagonal) {
            ctx.strokeStyle = '#f44336';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(centerX - width / 2, centerY - height / 2);
            ctx.lineTo(centerX + width / 2, centerY + height / 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // 三角形を強調
            ctx.fillStyle = '#ffeb3b80';
            ctx.beginPath();
            ctx.moveTo(centerX - width / 2, centerY - height / 2);
            ctx.lineTo(centerX + width / 2, centerY - height / 2);
            ctx.lineTo(centerX + width / 2, centerY + height / 2);
            ctx.closePath();
            ctx.fill();
        }

        // 寸法
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`${visualData.width}cm`, centerX - 20, centerY + height / 2 + 30);
        ctx.fillText(`${visualData.height}cm`, centerX - width / 2 - 60, centerY);

        // 説明
        ctx.fillStyle = '#d32f2f';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('長方形を対角線で切ると...', 20, 30);
        ctx.fillText('三角形が2つできる！', 20, 60);
    },

    /**
     * 問題に応じたビジュアライゼーションを表示
     */
    render: function(visualizationType, visualData) {
        console.log('🎨 GeometryVisualizer.render 開始');
        console.log('visualizationType:', visualizationType);
        console.log('visualData:', visualData);
        console.log('this.ctx:', this.ctx);
        console.log('this.canvas:', this.canvas);

        if (!this.ctx) {
            console.error('❌ GeometryVisualizer が初期化されていません');
            return;
        }

        switch (visualizationType) {
            case 'intersecting-lines':
                console.log('→ drawIntersectingLines 呼び出し');
                this.drawIntersectingLines(visualData);
                break;
            case 'supplementary-angles':
                console.log('→ drawSupplementaryAngles 呼び出し');
                this.drawSupplementaryAngles(visualData);
                break;
            case 'triangle-angles':
                console.log('→ drawTriangleAngles 呼び出し');
                this.drawTriangleAngles(visualData);
                break;
            case 'area-comparison':
                console.log('→ drawAreaComparison 呼び出し');
                this.drawAreaComparison(visualData);
                break;
            case 'triangle-area':
                console.log('→ drawTriangleArea 呼び出し');
                this.drawTriangleArea(visualData);
                break;
            case 'shape-decomposition':
                console.log('→ drawShapeDecomposition 呼び出し');
                this.drawShapeDecomposition(visualData);
                break;
            case 'triangle-in-rectangle':
                console.log('→ drawTriangleInRectangle 呼び出し');
                this.drawTriangleInRectangle(visualData);
                break;
            default:
                console.error('❌ 未対応のビジュアライゼーションタイプ:', visualizationType);
        }
        console.log('✅ GeometryVisualizer.render 完了');
    }
};

// グローバルスコープに追加
window.GeometryVisualizer = GeometryVisualizer;

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeometryVisualizer;
}

console.log('✅ geometry-visualizer.js ロード完了');
console.log('window.GeometryVisualizer:', window.GeometryVisualizer);
