import { configureStore } from '@reduxjs/toolkit';
import reducer from '@/stores/surveyReducer';

const surveystore = configureStore({
  reducer
});

export default surveystore;
