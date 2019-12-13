import React from 'react'
import { Alert } from 'reactstrap';

export const succussMessage = (msg) =>  <div className="message green white-text padding-10px mrgb10px"><i class="fa fa-thumbs-up left fsz2-1rem white-text" aria-hidden="true"></i>  <Alert className='alertFont' >{msg}</Alert></div>

export const errorMessage = (msg) =>  <div className="message red white-text padding-10px mrgb10px"><i class="material-icons left fsz2-1rem white-text">sentiment_very_dissatisfied</i> <Alert className='alertFont' color='danger' >{msg}</Alert></div>

/** Direction to user
 * import * as MessagePop from '../Common/messagePop' 
 * {this.state.flashMessageSuccess !== '' ? MessagePop.succussMessage(this.state.flashMessageSuccess) : ""}
    {this.state.flashMessageError !== '' ? MessagePop.errorMessage(this.state.flashMessageError) : ""}
*/