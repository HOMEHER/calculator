class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.firstValue = undefined;  // 新增：儲存第一個輸入值
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
                    case 'combination':
                    case 'sigma':
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
                    case 'factorial':
                        this.factorial();
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
        
        if (operation === 'combination' || operation === 'sigma') {
            // 儲存第一個值並清空顯示
            this.firstValue = parseFloat(this.currentOperand);
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = ''; // 清空顯示區域
            this.updateDisplay(); // 更新顯示
        } else {
            if (this.previousOperand !== '') {
                this.calculate();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
            this.updateDisplay();
        }
    }

    calculate() {
        let computation;
        let current = parseFloat(this.currentOperand);
        
        if (this.operation === 'combination' || this.operation === 'sigma') {
            if (this.firstValue === undefined || isNaN(current)) return;
            
            if (this.operation === 'combination') {
                computation = this.computeCombination(this.firstValue, current);
            } else if (this.operation === 'sigma') {
                computation = this.computeSigma(this.firstValue, current);
            }
            
            // 計算完成後清除暫存的第一個值
            this.firstValue = undefined;
        } else {
            let prev = parseFloat(this.previousOperand);
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
        }

        if (computation !== undefined) {
            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        }
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
        this.firstValue = undefined;  // 清除暫存的第一個值
        this.updateDisplay();
    }

    factorial() {
        if (this.currentOperand === '') return;
        const number = parseInt(this.currentOperand);
        if (number < 0) {
            alert('負數沒有階乘！');
            return;
        }
        if (number > 170) {
            alert('數字太大，無法計算！');
            return;
        }
        let result = 1;
        for (let i = 2; i <= number; i++) {
            result *= i;
        }
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    computeCombination(n, r) {
        if (n < r) {
            alert('n必須大於或等於r！');
            return undefined;
        }
        if (n < 0 || r < 0) {
            alert('不能使用負數！');
            return undefined;
        }
        
        // 計算組合數 C(n,r) = n!/(r!(n-r)!)
        const calculateFactorial = (num) => {
            let result = 1;
            for (let i = 2; i <= num; i++) {
                result *= i;
            }
            return result;
        };
        
        return calculateFactorial(n) / (calculateFactorial(r) * calculateFactorial(n - r));
    }

    computeSigma(start, end) {
        if (end < start) {
            alert('結束值必須大於或等於起始值！');
            return undefined;
        }
        if (end - start > 10000) {
            alert('計算範圍太大！');
            return undefined;
        }
        
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += i;
        }
        return sum;
    }

    getDisplayNumber(number) {
        // 新增：最大顯示長度與小數精度
        const MAX_LENGTH = 20;
        const PRECISION = 10;
        if (number === undefined || number === null) return '';
        let stringNumber = number.toString();
        if (stringNumber.length > MAX_LENGTH) {
            // 超過最大長度時，使用科學記號顯示
            return Number(number).toExponential(PRECISION);
        }
        const [integerPart, decimalPart] = stringNumber.split('.');
        let integerDisplay = isNaN(parseFloat(integerPart)) ? '' : parseInt(integerPart).toLocaleString('zh-TW');
        if (decimalPart != null) {
            // 限制小數精度
            let trimmedDecimal = decimalPart.slice(0, PRECISION);
            return `${integerDisplay}.${trimmedDecimal}`;
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
                divide: '÷',
                combination: 'C',
                sigma: 'Σ'
            }[this.operation];
            
            if (this.operation === 'combination' || this.operation === 'sigma') {
                // 顯示第一個值和運算符
                this.previousOperandElement.textContent = 
                    `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
            } else {
                this.previousOperandElement.textContent = 
                    `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
            }
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
