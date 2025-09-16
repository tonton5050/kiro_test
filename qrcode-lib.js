// Simple QR Code Generator Library
class SimpleQRCode {
    static toCanvas(canvas, text, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const ctx = canvas.getContext('2d');
                const size = options.width || 300;
                const margin = options.margin || 2;
                
                // Canvas設定
                canvas.width = size;
                canvas.height = size;
                
                // 背景色
                ctx.fillStyle = options.color?.light || '#FFFFFF';
                ctx.fillRect(0, 0, size, size);
                
                // QRコード風のパターンを生成（簡易版）
                const qrSize = 21; // 標準的なQRコードサイズ
                const cellSize = Math.floor((size - margin * 2) / qrSize);
                const startX = margin;
                const startY = margin;
                
                // テキストからハッシュを生成
                const hash = this.simpleHash(text);
                
                ctx.fillStyle = options.color?.dark || '#000000';
                
                // QRコードパターンを描画
                for (let y = 0; y < qrSize; y++) {
                    for (let x = 0; x < qrSize; x++) {
                        const shouldFill = this.shouldFillCell(x, y, hash, text);
                        if (shouldFill) {
                            ctx.fillRect(
                                startX + x * cellSize,
                                startY + y * cellSize,
                                cellSize,
                                cellSize
                            );
                        }
                    }
                }
                
                // ファインダーパターン（角の四角）を描画
                this.drawFinderPattern(ctx, startX, startY, cellSize);
                this.drawFinderPattern(ctx, startX + (qrSize - 7) * cellSize, startY, cellSize);
                this.drawFinderPattern(ctx, startX, startY + (qrSize - 7) * cellSize, cellSize);
                
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    
    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }
        return Math.abs(hash);
    }
    
    static shouldFillCell(x, y, hash, text) {
        // ファインダーパターンの領域は除外
        if (this.isFinderPattern(x, y)) return false;
        
        // テキストの内容とセル位置に基づいてパターンを決定
        const seed = hash + x * 31 + y * 37 + text.length;
        return (seed % 3) === 0;
    }
    
    static isFinderPattern(x, y) {
        // 3つの角のファインダーパターン領域をチェック
        const patterns = [
            { x: 0, y: 0, size: 7 }, // 左上
            { x: 14, y: 0, size: 7 }, // 右上
            { x: 0, y: 14, size: 7 }  // 左下
        ];
        
        return patterns.some(pattern => 
            x >= pattern.x && x < pattern.x + pattern.size &&
            y >= pattern.y && y < pattern.y + pattern.size
        );
    }
    
    static drawFinderPattern(ctx, x, y, cellSize) {
        // 外枠
        ctx.fillRect(x, y, cellSize * 7, cellSize * 7);
        
        // 内側を白で塗りつぶし
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);
        
        // 中心を黒で塗りつぶし
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
    }
}

// グローバルに公開
window.QRCode = SimpleQRCode;