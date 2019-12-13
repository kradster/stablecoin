import React from 'react';

const SelectField = (props)=>{
        
        return(
        <div className="col s12">
           <label htmlFor="email">Select Option</label>
            <select value={props.value} className="display-block admin_view field-style field-split" name={props.name} onChange={props.handler}>
                <option disabled value="EmployeeCategory">Employee Category</option> 
                <option value="viewer">Viewer</option> 
                <option value="owner">Owner</option> 
                <option value="other">Other</option> 
            </select>
        </div>);
    
}
export default SelectField ;