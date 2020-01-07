import React from 'react'

export default function Notification(props) {
    let notificationClass =  props.msg!==''?'notificationIn':'notificationOut';
   
        return (
            <div className={`notification-box`}>
            <div className={`notification ${notificationClass}`}>
                <div onClick={props.close} className="notification-close"><i class="fa fa-times" aria-hidden="true"></i></div>
                <div className="notification-msg">{props.msg}</div>
            </div>
        </div>
    )
    
        
}
