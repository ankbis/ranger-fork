class CalculatorTest {
  testAddition() {
    const calculator = new Calculator();
    calculator.handleButtonClick('2');
    calculator.handleButtonClick('+');
    calculator.handleButtonClick('3');
    calculator.handleButtonClick('=');
    if (calculator.currentValue !== '5') {
      throw new Error('Addition test failed');
    }
  }

  testSubtraction() {
    const calculator = new Calculator();
    calculator.handleButtonClick('5');
    calculator.handleButtonClick('-');
    calculator.handleButtonClick('3');
    calculator.handleButtonClick('=');
    if (calculator.currentValue !== '2') {
      throw new Error('Subtraction test failed');
    }
  }

  testMultiplication() {
    const calculator = new Calculator();
    calculator.handleButtonClick('4');
    calculator.handleButtonClick('*');
    calculator.handleButtonClick('6');
    calculator.handleButtonClick('=');
    if (calculator.currentValue !== '24') {
      throw new Error('Multiplication test failed');
    }
  }

  testDivision() {
    const calculator = new Calculator();
    calculator.handleButtonClick('1');
    calculator.handleButtonClick('0');
    calculator.handleButtonClick('/');
    calculator.handleButtonClick('2');
    calculator.handleButtonClick('=');
    if (calculator.currentValue !== '5') {
      throw new Error('Division test failed');
    }
  }
}

const calculatorTest = new CalculatorTest();
calculatorTest.testAddition();
calculatorTest.testSubtraction();
calculatorTest.testMultiplication();
calculatorTest.testDivision();
