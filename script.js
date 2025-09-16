class QRCodeGenerator {
    constructor() {
        this.textInput = document.getElementById('text-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.qrCanvas = document.getElementById('qr-canvas');
        this.qrContainer = document.getElementById('qr-container');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        this.textInput.addEventListener('input', () => this.clearError());
        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateQRCode();
            }
        });
    }

    validateInput(text) {
        if (!text || typeof text !== 'string' || text.trim() === '') {
            return 'テキストを入力してください';
        }
        
        if (text.length > 1000) {
            return 'テキストが長すぎます（1000文字以内）';
        }
        
        return null;
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
    }

    clearError() {
        this.errorMessage.classList.add('hidden');
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.qrContainer.classList.add('hidden');
        this.generateBtn.disabled = true;
        this.generateBtn.textContent = '生成中...';
    }

    hideLoading() {
        this.loading.classList.add('hidden');
        this.generateBtn.disabled = false;
        this.generateBtn.textContent = 'QRコード生成';
    }

    async generateQRCode() {
        try {
            const text = this.textInput?.value?.trim() || '';
            
            this.clearError();
            
            const validationError = this.validateInput(text);
            if (validationError) {
                this.showError(validationError);
                return;
            }

            // QRCodeライブラリの確認
            if (typeof QRCode === 'undefined') {
                this.showError('QRコードライブラリが読み込まれていません。ページを再読み込みしてください。');
                return;
            }

            this.showLoading();

            console.log('QRコード生成開始:', text);
            
            // 少し待機してからQRコード生成
            await new Promise(resolve => setTimeout(resolve, 500));

            // キャンバスの初期化
            if (this.qrCanvas) {
                this.qrCanvas.width = 300;
                this.qrCanvas.height = 300;
                
                // コンテキストをクリア
                const ctx = this.qrCanvas.getContext('2d');
                ctx.clearRect(0, 0, 300, 300);
            }

            // QRコード生成
            await QRCode.toCanvas(this.qrCanvas, text, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'M'
            });

            console.log('QRコード生成成功');
            this.hideLoading();
            this.qrContainer.classList.remove('hidden');
            
        } catch (error) {
            console.error('QRコード生成エラー詳細:', error);
            this.hideLoading();
            
            let errorMessage = 'QRコードの生成に失敗しました。';
            if (error && error.message) {
                console.log('エラーメッセージ:', error.message);
                errorMessage += ' もう一度お試しください。';
            }
            
            this.showError(errorMessage);
        }
    }

    downloadQRCode() {
        try {
            const canvas = this.qrCanvas;
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            this.showError('ダウンロードに失敗しました。ブラウザがファイルのダウンロードをブロックしている可能性があります。');
            console.error('ダウンロードエラー:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('QRCodeライブラリ読み込み確認完了');
    new QRCodeGenerator();
});