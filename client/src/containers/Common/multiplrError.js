import React from 'react';

const MultipleError = (prop) => {
    
    let errmsg = prop.errors;
    let err  = {} ;
    if(Array.isArray(errmsg)) {
        err = errmsg
    } else {
        err = Object.keys(errmsg);
    
    }
   
    return (
    <div className="col s12">
        <ul className="red white-text block radius-5px error-text padding-10px"> {err.map(e =>(<li className="mrgl20px"><b>{e} </b> {errmsg[e]}</li>))}</ul>
    </div>
    )
}

export default MultipleError;