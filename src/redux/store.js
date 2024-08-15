import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './slices/interviewSlice';
import questionReducer from './slices/questionSlice';

const store = configureStore({
  reducer: {
    interview: interviewReducer,
    questions: questionReducer,
  },
});

export default store;