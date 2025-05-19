class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.init();
    }

    init() {
        this.displayElement = document.querySelector('.current-operand');
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.textContent));
        });

        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                switch(action) {
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                        this.chooseOperation(action);
                        break;
                    case 'equals':
                        this.calculate();
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'delete':
                        this.delete();
                        break;
                    case 'percent':
                        this.percent();
                        break;
                }
            });
        });
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert('無法除以零！');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    percent() {
        if (this.currentOperand === '') return;
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('zh-TW', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.displayElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            const operationSymbol = {
                add: '+',
                subtract: '-',
                multiply: '×',
                divide: '÷'
            }[this.operation];
            
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
