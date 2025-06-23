export class CountdownTimer {
    constructor(elementId = 'id-send-again') {
        this.elementId = elementId;
        this.interval = null;
        this.remainingSeconds = 0;
        this.onFinishCallback = null;
    }

    start(seconds = 60, onFinish = null) {
        this.stop();
        this.remainingSeconds = seconds;
        this.onFinishCallback = onFinish;
        
        this.updateDisplay();
        
        this.interval = setInterval(() => {
            this.remainingSeconds--;
            this.updateDisplay();
            
            if (this.remainingSeconds <= 0) {
                this.stop();
                if (this.onFinishCallback) this.onFinishCallback();
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    updateDisplay() {
        const element = document.getElementById(this.elementId);
        if (!element) return;

        if (this.remainingSeconds > 0) {
            element.textContent = `Reenviar en ${this.remainingSeconds} segundos`;
            element.style.color = '#5e5e5e';
            element.style.cursor = 'not-allowed';
            element.style.textDecoration = 'none';
            element.onclick = null;
        } else {
            element.textContent = 'Reenviar código';
            element.style.color = '#FF6B6B';
            element.style.cursor = 'pointer';
            element.style.textDecoration = 'underline';
        }
    }

    setClickHandler(handler) {
        const element = document.getElementById(this.elementId);
        if (element && this.remainingSeconds <= 0) {
            element.onclick = handler;
        }
    }
}