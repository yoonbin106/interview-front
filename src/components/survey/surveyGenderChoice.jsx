// SurveyGenderChoice.jsx
import React from 'react';

const SurveyGenderChoice = ({ onChangeHandler }) => {
  return (
    <div>
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