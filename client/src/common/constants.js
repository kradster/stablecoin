export var SERVER = ''

// const isPartyA = false;

SERVER = test_env.partyUrl;


console.log('ENVIRONMENT++++++++++++++++',test_env);

export const partyName =  test_env.partyName;
// ==='partyA'?'O=PartyA, L=London , C=GB':'O=PartyB, L=New York, C=US';

/**FOR API'S */
export const BASE_URL = SERVER;
export const BASE = "http://"
export const METHOD_GET = "GET";
export const METHOD_POST = "POST";
export const METHOD_PUT = "PUT";
export const METHOD_DELETE = "DELETE";
export const METHOD_PATCH = "PATCH";
export const HEADERS = {
   "Content-Type": "application/json",
   "email": localStorage.getItem("USER_EMAIL"),
   "authorization": localStorage.getItem("JWT_TOKEN"),
}

export const API_INITIALIZE = BASE_URL+"initialize";
export const API_REQUEST_LOAN = BASE_URL+"requestloan";
export const API_LOAN_TRANSFER = BASE_URL+"loantransfer";
export const API_REJECT_LOAN = BASE_URL+"rejectloan";
export const API_SETTLE_LOAN = BASE_URL+"settleloan";

export const API_GETLOANDATA = BASE_URL+"getloandata";
export const API_GETPENDINGLOANDATA = BASE_URL+"getpendingloandata";
export const API_GETAPPROVEDLOANDATA = BASE_URL+"getapprovedloandata";
export const API_GETREJECTEDLOANDATA = BASE_URL+"getrejectedloandata";
export const API_GETSETTLEDLOANDATA = BASE_URL+"getsettledloandata";
export const API_GETSINGLESTATE = BASE_URL+"getsinglestate";

export const API_GETINFO = BASE_URL+"getinfo";
export const API_GETPEERS = BASE_URL+"getpeers";

export const API_GETME = BASE_URL+"me";

export const API_GET_PENDING_COUNT = BASE_URL+"getpendingcount";
export const API_GET_REJECTED_COUNT = BASE_URL+"getrejectedcount";
export const API_GET_APPROVED_COUNT = BASE_URL+"getapprovedcount";
export const API_GET_SETTLED_COUNT = BASE_URL+"getsettledcount";







/**API URL's */
