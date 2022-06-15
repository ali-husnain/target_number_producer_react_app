import React, { useEffect, useState } from "react";
import UploadFile from './uploadFile';
import OutputBox from './outputBox';
import ProduceTarget from './produceTarget';
import numbers from './../../numbers.csv';

function TargetNumberProducer() {
    const [array, setArray] = useState([]);
    const [isGenerated, setIsGenerated] = useState('');

    useEffect(() => {
        setIsGenerated("");
    }, [array]);

    return (
        <div>
            <h2>Target Number Producer From Given Numbers List</h2>
            <p>Here you can download sample csv <a href={numbers} download>download</a></p>
            <div className='card'>
                <UploadFile setArray={setArray} />
                <OutputBox title="List of Numbers" displayText={array.toString(",")} />   
            </div>
            <div className='card'>
                <ProduceTarget numbers={array} setIsGenerated={setIsGenerated} />
                <OutputBox title="Output" displayText={isGenerated} />   
            </div>
        </div>
    );
}

export default TargetNumberProducer;