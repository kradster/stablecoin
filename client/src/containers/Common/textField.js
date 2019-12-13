import React from 'react';
import Tips from './tips';

const InputField = (props)=>{
        const TipsList = props.tips?props.tips.map(item=> <Tips key={item.length+"id"} item={item}/> ):'';
        return(
        <div className="col s12 no-padding mrgb20px">
            <label className="loginpart" htmlFor="">{props.label}</label>
            <input 
                className={props.className} 
                name={props.name} type={props.type} 
                value={props.value} 
                onChange={props.handler}
                maxLength={props.maxLength}
            
            />
            {props.tips?TipsList:''}
        </div>);
    
}
export default InputField;