import React, { useState } from "react";

function UploadFile(props) {
    const [file, setFile] = useState();
    const fileReader = new FileReader();

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvFileToArray = string => {
        const stringToArray = string.trim().replace(/\s/g, ",").split(",");
        const array = stringToArray.map((item) => parseInt(item))
        props.setArray(array);
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text);
            };

            fileReader.readAsText(file);
        }
    };

    return (
        <div className='item'>
                <form onSubmit={handleOnSubmit}>
                <div className="row">
                    <label>Import CSV of given Numbers</label><br />
                    <input type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleOnChange}
                    />
                </div>
                <div className='row'>
                    <input type='submit' className='button' value='Upload' />
                </div>      
            </form>
        </div> 
    );
}

export default UploadFile;