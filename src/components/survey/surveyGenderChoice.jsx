// SurveyGenderChoice.jsx
import React from 'react';
import styles from '@/styles/survey/surveyHome.module.css';

const SurveyGenderChoice = ({ onChangeHandler }) => {
  return (
    <div>

<div>성별</div>
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          onChange={onChangeHandler}
        />
        남성
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          onChange={onChangeHandler}
        />
        여성
      </label>
    </div>
  );
};

export default SurveyGenderChoice;