import {
    INITIALIZE,
    REQUEST_LOAN,
    REJECT_LOAN,
    LOAN_TRANSFER,
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
} from "../common/types";

const initialState = {
}



export default function (state = initialState, action) {
    switch (action.type) {
        case INITIALIZE: return { ...state, initializeData: action.payload }
        case REQUEST_LOAN: return { ...state, requestLoanData: action.payload }
        case LOAN_TRANSFER: return { ...state, loanTransferData: action.payload }
        case REJECT_LOAN: return { ...state, rejectLoanData: action.payload }
        case SETTLE_LOAN: return { ...state, settleLoanData: action.payload }
        case LOANDATA: return { ...state, _getLoanData: action.payload }
        case APPROVEDLOANDATA: return { ...state, _getApprovedLoanData: action.payload }
        case PENDINGLOANDATA: return { ...state, _getPendingLoanData: action.payload }
        case REJECTEDLOANDATA: return { ...state, _getRejectLoanData: action.payload }
        case SETTLEDLOANDATA: return { ...state, _getSettleLoanData: action.payload }
        case SINGLESTATE: return { ...state, _getSingleStateData: action.payload }
        case GETINFO: return { ...state, _getInfoData: action.payload }
        case GETPEERS: return { ...state, _getPeersData: action.payload }
        case GET_ME: return { ...state, _getMeData: action.payload }
        case GET_PENDING_COUNT: return { ...state, _getPendingCountData: action.payload }
        case GET_APPROVED_COUNT: return { ...state, _getApprovedCountData: action.payload }
        case GET_REJECTED_COUNT: return { ...state, _getRejectedCountData: action.payload }
        case GET_SETTLED_COUNT: return { ...state, _getSettledCountData: action.payload }

        default: return state;
    }
}
