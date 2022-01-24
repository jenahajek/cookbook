import { createStore } from "redux";
import rootReducer from "../reducers/reducer";

const store = createStore(
  rootReducer
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

// import { configureStore } from '@reduxjs/toolkit'

// const store = configureStore({
//   reducer: {},
// })

// export default store;
