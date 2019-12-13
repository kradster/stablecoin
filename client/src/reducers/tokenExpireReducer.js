import {LOADING,INVALID_TOKEN} from '../common/types';

const initialState = {
    data:{
        tokenExpire:false
    }
}

export default function (state = initialState,action){
    // console.log(action.payload);
    switch (action.type){
        case INVALID_TOKEN:return{...state,data:action.payload};
        case LOADING:return{...state,data:{isLoading:false}};
        default:return state;
    }
}
