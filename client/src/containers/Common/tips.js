import React from 'react';

const Tips = (props)=>{
    const {keyid,item} = props;
    return (
        <div id={keyid} className=" fsz09rem">{item}</div>        
    );
}

export default Tips;