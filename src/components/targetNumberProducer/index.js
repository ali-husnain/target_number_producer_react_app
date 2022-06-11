import React, { useState } from "react";
import UploadFile from './uploadFile';
import OutputBox from './outputBox';
import ProduceTarget from './produceTarget';

function TargetNumberProducer() {
    const [array, setArray] = useState([]);
    const [isReachable, setIsReachable] = useState('');

    return (
        <div>
             <h2>Target Number Producer From Given Numbers List</h2>
            <div className='card'>
                <UploadFile setArray={setArray} />
                <OutputBox title="List of Numbers" displayText={array.toString(",")} />   
            </div>
            <div className='card'>
                <ProduceTarget numbers={array} setIsReachable={setIsReachable} />
                <OutputBox title="Output" displayText={isReachable} />   
            </div>
        </div>
    );
}

export default TargetNumberProducer;