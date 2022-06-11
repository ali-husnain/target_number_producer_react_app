import React, { useState } from "react";
import IsReachable from "../../utils/IsReachable";

function ProduceTarget(props) {
    const [targetNumber, setTargetNumber] = useState();

    const handleOnChange = (e) => {
        setTargetNumber(parseInt(e.target.value));
    };


    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (props.numbers.length === 0) return alert("Please import file for numbers");
        if (targetNumber > 0) {
            const isReachable = IsReachable(props.numbers, targetNumber);
            if (isReachable) {
                props.setIsReachable("Number Produced.");
            } else {
                props.setIsReachable("Not Possible!");
            }
        }
    };

    return (
        <div className='item'>
                <form onSubmit={handleOnSubmit}>
                <div className="row">
                    <label>Target Number</label><br />
                    <input type="number" placeholder="Enter number"
                        onChange={handleOnChange}
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