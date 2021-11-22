import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers";

const rootReducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
});


const userInfoFromLocal = localStorage.getItem("userInfo") 
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialState = {
    userLogin: { userInfo: userInfoFromLocal, error: null },
};

const middleWare = [thunk];

const store = createStore(
    rootReducer, 
    initialState, 
    compose(applyMiddleware(...middleWare))
);

export default store;