import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers";
import { joinRoomReducer } from "./reducers/roomReducers";

// create the root reducer to handle all state changes (redux)
const rootReducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    participantJoin: joinRoomReducer,
});

// get initial state from client browser (localStorage) if saved from previous visit
const userInfoFromLocal = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const participantInfoFromLocal = localStorage.getItem("participantInfo")
    ? JSON.parse(localStorage.getItem("participantInfo"))
    : null;

// create initial state (redux)
const initialState = {
    userLogin: { userInfo: userInfoFromLocal, error: null },
    participantJoin: { participantInfo: participantInfoFromLocal, error: null },
};

const middleWare = [thunk];

// create the store (redux)
const store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleWare)));

export default store;
