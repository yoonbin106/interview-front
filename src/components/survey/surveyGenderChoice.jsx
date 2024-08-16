// SurveyGenderChoice.jsx
import React from 'react';
import styles from '@/styles/survey/surveyHome.module.css';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

const SurveyGenderChoice = ({ onChangeHandler }) => {
  return (
    <div>

<div>성별</div>
      <label>

      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={onChangeHandler}
      >
         <FormControlLabel value="male" control={<Radio />} label="남성" />
         <FormControlLabel value="female" control={<Radio />} label="여성" />
        
      </RadioGroup>

        {/* <input
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
        여성 */}
      </label>
    </div>
  );
};

export default SurveyGenderChoice;