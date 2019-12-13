import React,{Component} from 'react';
import {connect} from 'react-redux';

class TokenExpireWaring extends Component  {

  constructor(prop){
    super(prop);
    this.state = {
      isTokenExpired:false
    };
  }

  componentDidMount(){
    if(this.props.isTokenExpired!==undefined){
      this.setState({
        isTokenExpired:this.props.isTokenExpired
      });
    }
  }


  componentWillReceiveProps(nprop){
    if(nprop.isTokenExpired!==undefined){
      this.setState({
        isTokenExpired:nprop.isTokenExpired
      });
    }
  }

  loginAgain(){
      localStorage.clear();
      window.location.href="/login";
  }

  render () {
    return (
        (this.state.isTokenExpired)
        ?(
          <div style={{backgroundColor:"rgba(0,0,0,0.5)",zIndex:"999999"}}  className="position-fixed w100 h100">
          <div className="red center padding-10px">
             <div className="fsz2rem font-wight -bolder white-text"> Token Expired </div>
             <div className="fsz1rem white-text mrgt10px">Your token is expired due to long idle state </div>
             <div onClick={this.loginAgain} className="ui button white mini red-text mrgt20px">Login again </div>
          </div>
        </div>
          )
        :null
      
    )
  }
}

const mapPropToState = state =>{
  return {
    isTokenExpired:state.tokenExpire.data.tokenExpire
  }
}

export default connect(mapPropToState,{})(TokenExpireWaring);
