import {
    LOADING
} from '../common/types';

const initialState = {
    data:{
        isLoading:false
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING:return {...state,data:action.payload};
        default: return state;
    }
}
