import { combineReducers } from '@reduxjs/toolkit';
import interviewReducer from './slices/interviewSlice';
import questionReducer from './slices/questionSlice';

const rootReducer = combineReducers({
  interview: interviewReducer,
  questions: questionReducer,
});

export default rootReducer;