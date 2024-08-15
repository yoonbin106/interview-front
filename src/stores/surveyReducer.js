import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  gender: '',
  question: [],
  answers: Array.from({ length: 29 }, () => 'Null'),
  job: [],
  major: [],
  result: {
    bestAbility: '',
    worstAbility: '',
    bestSecondAbility: '',
    worstSecondAbility: '',
    bestWonScoreIndex: '',
    bestSecondWonScoreIndex: '',
    wonScore: '',
  },
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    getQuestion: (state, action) => {
      state.question = action.payload;
    },
    setAnswer: (state, action) => {
      state.answers[action.payload.index] = action.payload.answer;
    },
    setJob: (state, action) => {
      state.job = action.payload;
    },
    setMajor: (state, action) => {
      state.major = action.payload;
    },
    setResult: (state, action) => {
      state.result = {
        bestAbility: action.payload.bestAbility,
        worstAbility: action.payload.worstAbility,
        bestSecondAbility: action.payload.bestSecondAbility,
        worstSecondAbility: action.payload.worstSecondAbility,
        bestWonScoreIndex: action.payload.bestWonScoreIndex,
        bestSecondWonScoreIndex: action.payload.bestSecondWonScoreIndex,
        wonScore: action.payload.wonScore,
      };
    },
    init: (state) => {
      return initialState;
    },
  },
});

export const { setName, setGender, getQuestion, setAnswer, setJob, setMajor, setResult, init } = surveySlice.actions;

export default surveySlice.reducer;
