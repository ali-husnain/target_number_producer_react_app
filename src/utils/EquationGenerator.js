class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    clearQueue() {
        this.elements = {};
    }

    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }
    peek() {
        return this.elements[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}

class EquationGenerator {
    constructor(numbers, targetValue) {
        this.numbers = numbers
        this.targetValue = targetValue
        
        this.solvedKeys = [];
        // Each number in the list indicates that corresponding value + mask
        // has been reached using arithmetical operations.

        this.keyToLeftParent = {};
        // For each solved key (value + mask), there is an entry indicating
        // result of the expression on the left side of the arithmetic
        // operator. Missing value indicates that key represents the
        // raw number (taken from the input list), rather than
        // the result of a calculation.

        this.keyToRightParent = {};
        // Same as keyToLeftParent, only indicating the right parent
        // used to build the expression.

        this.keyToOperator = {};
        // Indicates arithmetic operator used to build this node
        // from left and right parent nodes. Missing value for a given key
        // indicates that key is a raw value taken from input array,
        // rather than result of an arithmetic operation.

        this.queue = new Queue();

        this.solutionString = "";
        this.isSolved = false;
    }

    initialStates() {
        //resetting generation values
        this.isSolved = false;
        this.solvedKeys = [];
        this.keyToLeftParent = {};
        this.keyToRightParent = {};
        this.keyToOperator = {};
        this.queue.clearQueue();
        this.solutionString = "";
    }

    generateAndPrint() {
        this.generate();
        this.printSolution();
        return this.solutionString;
    }

    generate() {
        this.initialStates();

        let targetKey = (this.targetValue << this.numbers.length) + (1 << this.numbers.length) - 1;
        // (value << numbers.Length) represents expression value
        // (1 << numbers.Length) - 1 represents mask with all bits set to 1,
        // i.e. mask in which each input number has been used exactly once
        // to build the expression.

        // Keys (value + mask pairs) that have not been processed yet

        // First step is to initialize the structures:
        // Add all input values into corresponding array entries and
        // add them to the queue so that the operation can begin

        for (let i = 0; i < this.numbers.length; i++) {

            let key = (this.numbers[i] << this.numbers.length) + (1 << i);

            this.solvedKeys.push(key);
            this.queue.enqueue(key);
        }

        // Now expand entries one at the time until queue is empty,
        // i.e. until there are no new entries populated.
        // Additional stopping condition is that target key has been generated,
        // which indicates that problem has been solved and there is no need to
        // expand nodes any further.

        while (!this.queue.isEmpty && !this.solvedKeys.includes(targetKey)) {

            let curKey = this.queue.dequeue();

            let curMask = curKey & ((1 << this.numbers.length) - 1);
            let curValue = curKey >> this.numbers.length;
            // Now first take a snapshot of all keys that
            // have been reached because this collection is going to
            // change during the following operation


            let keys = JSON.parse(JSON.stringify(this.solvedKeys));
            for (let i = 0; i < keys.length; i++) {

                let mask = keys[i] & ((1 << this.numbers.length) - 1);
                let value = keys[i] >> this.numbers.length;
                if ((mask & curMask) === 0) { // Masks are disjoint, i.e. two entries do not use
                    // the same input number twice.
                    // This is sufficient condition to combine the two entries

                    for (let op = 0; op < 6; op++) {

                        //perform current arithmetic operation
                        let { newValue, opSign } = this.performOperations(value, curValue, op)

                        //validate value and push in dictionaries
                        this.validateAndPushValueWithSign(newValue, opSign, op, curMask, curKey, mask, keys[i])
                    }
                }
            }
        }
        if (this.solvedKeys.includes(targetKey)) {
            this.isSolved = true;
        }
    }

    printSolution() {
        if (!this.isSolved) {
            this.solutionString = "Solution not possible.";
            return false;
        }

        //success case if found the expression
        let targetKey = (this.targetValue << this.numbers.length) + (1 << this.numbers.length) - 1;
        this.solutionString = "";
        this.printExpression(targetKey, this.numbers.length);
        return this.solutionString;
    }

    printExpression(key, numbersCount) {

        if (typeof this.keyToOperator[key] == 'undefined') {
            this.solutionString += (key >> numbersCount);
        }
        else {
            this.solutionString += "(";
            // Recursively print the left operand
            this.printExpression(
                this.keyToLeftParent[key], this.numbers.length);

            // Then print the operation sign
            this.solutionString += this.keyToOperator[key];

            // Finally, print the right operand
            this.printExpression(
                this.keyToRightParent[key], this.numbers.length);

            this.solutionString += ")";

        }
    }

    performOperations(value, curValue, op) {
        let opSign = '\0';
        let newValue = 0;

        switch (op) {
            case 0: // Addition
                newValue = curValue + value;
                opSign = '+';
                break;
            case 1: // Subtraction - another value subtracted from current
                newValue = curValue - value;
                opSign = '-';
                break;
            case 2: // Subtraction - current value subtracted from another
                newValue = value - curValue;
                opSign = '-';
                break;
            case 3: // Multiplication
                newValue = curValue * value;
                opSign = '*';
                break;
            case 4: // Division - current divided by another
                newValue = -1;  // Indicates failure to divide
                if (value !== 0 && curValue % value === 0)
                    newValue = curValue / value;
                opSign = '';
                break;
            case 5: // Division - other value divided by current
                newValue = -1;  // Indicates failure to divide
                if (curValue !== 0 && value % curValue === 0)
                    newValue = value / curValue;
                opSign = '';
                break;
            default:
                opSign = '\0';
                newValue = 0;
        }

        return { newValue, opSign };
    }

    validateAndPushValueWithSign(newValue, opSign, opIndex, curMask, curKey, mask, current_key_value) {

        if (newValue >= 0) {
            // Ignore negative values - they can always be created
            // the other way around, by subtracting them
            // from a larger value so that positive value is reached.

            let newMask = (curMask | mask);
            // Combine the masks to indicate that all input numbers
            // from both operands have been used to produce
            // the resulting expression

            let newKey = (newValue << this.numbers.length) + newMask;
            if (!this.solvedKeys.includes(newKey)) {
                // We have reached a new entry.
                // This expression should now be added
                // to data structures and processed further
                // in the following steps.

                // Populate entries that describe newly created expression
                this.solvedKeys.push(newKey);

                if (opIndex === 2 || opIndex === 5) {
                    // Special cases - antireflexive operations
                    // with interchanged operands
                    this.keyToLeftParent[newKey] = current_key_value;
                    this.keyToRightParent[newKey] = curKey;
                }
                else {
                    this.keyToLeftParent[newKey] = curKey;
                    this.keyToRightParent[newKey] = current_key_value;
                }

                this.keyToOperator[newKey] = opSign;

                // Add expression to list of reachable expressions
                this.solvedKeys.push(newKey);

                // Add expression to the queue for further expansion
                this.queue.enqueue(newKey);

            }

        }
    }
}

// const eqGenerator = new EquationGenerator([3, 4, 7, 8, 12], 532);
// console.log(eqGenerator.generateAndPrint());

export default EquationGenerator;