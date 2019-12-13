import {combineReducers} from 'redux';
import cordaReducer from '../reducers/cordaReducer';

import tokenExpireReducer from '../reducers/tokenExpireReducer.js';
import loadingReducer from '../reducers/loadingReducer.js';

const rootReducres = combineReducers({
    corda:cordaReducer,
    tokenExpire:tokenExpireReducer,
    loading:loadingReducer
});

export default rootReducres ;
