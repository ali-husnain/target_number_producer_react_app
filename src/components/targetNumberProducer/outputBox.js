import React from "react";

function OutputBox(props) {
    return (
        <div className='item'>
                <div className='row'>
                <div className='output'>
                    <h3>
                        {props.title}
                        <p>
                            {/* {props.array.toString(",")} */}
                            {props.displayText}
                        </p>  
                    </h3>
                </div>
                </div>
        </div>
    );
}

export default OutputBox;