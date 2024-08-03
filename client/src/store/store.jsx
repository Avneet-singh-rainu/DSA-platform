import { configureStore } from "@reduxjs/toolkit";
import { codeExecutionReducer } from "./codeExecutionSlice";
import { userReducer } from "./userSlice";

const store = configureStore({
  reducer: {
    codeExecution: codeExecutionReducer,
    userSlice: userReducer,
  },
});


export default store;
