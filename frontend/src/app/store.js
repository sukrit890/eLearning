import { configureStore } from "@reduxjs/toolkit";
import eLearningReducer from "../features/eLearningSlice";

export const store = configureStore({
  reducer: {
    eLearning: eLearningReducer
  }
});
