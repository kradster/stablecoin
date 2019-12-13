import {
    LOADING,
    INVALID_TOKEN,
    INITIALIZE,
    REQUEST_LOAN,
    LOAN_TRANSFER,
    REJECT_LOAN,
    SETTLE_LOAN,

    LOANDATA,
    APPROVEDLOANDATA,
    PENDINGLOANDATA,
    REJECTEDLOANDATA,
    SETTLEDLOANDATA,
    SINGLESTATE,
    GETINFO,
    GETPEERS,

    GET_ME,
    GET_PENDING_COUNT,
    GET_APPROVED_COUNT,
    GET_REJECTED_COUNT,
    GET_SETTLED_COUNT
    
  } from '../common/types';
  import * as constants from '../common/constants';
  import axios from 'axios';
  
  export const initializeAccount = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_INITIALIZE+"?panNo="+data.panNo+"&acctNo="+data.acctNo,
      method: constants.METHOD_POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: INITIALIZE, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const requestLoan = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_REQUEST_LOAN+"?lender="+data.lender+"&amount="+data.amount,
      method: constants.METHOD_POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: REQUEST_LOAN, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const loanTransfer = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_LOAN_TRANSFER+"?borrower="+data.borrower+"&loanId="+data.loanId,
      method: constants.METHOD_POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: LOAN_TRANSFER, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const rejectLoan = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_REJECT_LOAN+"?borrower="+data.borrower+"&loanId="+data.loanId,
      method: constants.METHOD_POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: REJECT_LOAN, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const settleLoan = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_SETTLE_LOAN+"?lender="+data.lender+"&loanId="+data.loanId,
      method: constants.METHOD_POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: SETTLE_LOAN, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const getLoanData = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETLOANDATA,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: LOANDATA, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const getApprovedLoanData = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETAPPROVEDLOANDATA,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: APPROVEDLOANDATA, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const getPendingLoanData = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETPENDINGLOANDATA,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: PENDINGLOANDATA, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const getRejectedLoanData = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETREJECTEDLOANDATA,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: REJECTEDLOANDATA, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const getSettledLoanData = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETSETTLEDLOANDATA,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: SETTLEDLOANDATA, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };
  export const getSingleState = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETSINGLESTATE,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: SINGLESTATE, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });
  };




  export const getInfo = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETINFO+"?peer="+data.peer,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: GETINFO, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: GETINFO, payload:undefined});
        dispatch({ type: LOADING, payload: { isLoading: false } });
      });;
  };
  export const getPeers = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETPEERS,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: GETPEERS, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      })
  };



  export const getMe = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GETME,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: GET_ME, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      })
  };

  export const getPendingCount = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GET_PENDING_COUNT,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: GET_PENDING_COUNT, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      })
  };


  export const getRejectedCount= data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GET_REJECTED_COUNT,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: GET_REJECTED_COUNT, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      })
  };


  export const getApprovedCount = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GET_APPROVED_COUNT,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: GET_APPROVED_COUNT, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      })
  };



  export const getSettledCount = data => dispatch => {
    var REQ_OPTIONS = {
      url:constants.API_GET_SETTLED_COUNT,
      method: constants.METHOD_GET,
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    dispatch({ type: LOADING, payload: { isLoading: true } });
    axios(REQ_OPTIONS)
      .then(data => data.data)
      .then(Response => {
        if (Response.message === "Invalid Signature") {
          dispatch({ type: INVALID_TOKEN, payload: { tokenExpire: true } });
          dispatch({ type: LOADING, payload: { isLoading: false } });
        } else {
          dispatch({ type: GET_SETTLED_COUNT, payload: Response });
          dispatch({ type: LOADING, payload: { isLoading: false } });
  
        }
      }).catch(err=>{
        console.log('SERVER ERROR',err);
        dispatch({ type: LOADING, payload: { isLoading: false } });
      })
  };
  
  