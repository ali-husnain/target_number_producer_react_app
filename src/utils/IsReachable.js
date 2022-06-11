const IsReachable = (list, target) => {
    if (list.length === 0)
        return false;

    let i = 0;
    let j = list.length - 1;

    const possibleNumbers = getPossibleNumbers(list, i, j);
    for (let num in possibleNumbers) {
        if (parseInt(num) === target) {
            return true;
        }
    }

    return false;
}

const getPossibleNumbers = (list, left, right) => {
    let result = [];

    if (left > right) {
        return result;
    } else if (left === right) {
        result.push(list[left]);
        return result;
    }

    for (let i = left; i < right; i++) {

        const result1 = getPossibleNumbers(list, left, i);
        const result2 = getPossibleNumbers(list, i + 1, right);

        for (let x in result1) {
            for (let y in result2) {
                result.push(x + y);
                result.push(x - y);
                result.push(x * y);
                if (y !== 0)
                    result.push(x / y);
            }
        }
    }

    return result;
}

export default IsReachable