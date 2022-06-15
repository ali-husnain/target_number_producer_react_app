import React, { useState } from "react";
import EquationGenerator from "../../utils/EquationGenerator";

function ProduceTarget(props) {
    const [targetNumber, setTargetNumber] = useState();

    const changeHandler = (e) => {
        setTargetNumber(parseInt(e.target.value));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (props.numbers.length === 0) return alert("Please import file for numbers");
        if (targetNumber > 0) {
            const eqGenerator = new EquationGenerator(props.numbers, targetNumber);
            let displayText = eqGenerator.generateAndPrint();
            props.setIsGenerated(displayText);
        }
    };

    return (
        <div className='item'>
                <form onSubmit={submitHandler}>
                <div className="row">
                    <label>Target Number</label><br />
                    <input type="number" placeholder="Enter number"
                        onChange={changeHandler}
                    />
                </div>
                <div className='row'>
                    <input type='submit' className='button' value='Generate' />
                </div>      
            </form>
        </div> 
    );
}

export default ProduceTarget;