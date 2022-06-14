import React, { useState } from "react";

function UploadFile(props) {
    const [file, setFile] = useState();
    const fileReader = new FileReader();

    const changeHandler = (e) => {
        setFile(e.target.files[0]);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                props.setArray(csvFileToArray(event.target.result));
            };

            fileReader.readAsText(file);
        }
    };

    const csvFileToArray = string => {
        const stringToArray = string.trim().replace(/\s/g, ",").split(",");
        return stringToArray.map((item) => parseInt(item))
    };

    return (
        <div className='item'>
                <form onSubmit={submitHandler}>
                <div className="row">
                    <label>Import CSV of given Numbers</label><br />
                    <input type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={changeHandler}
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