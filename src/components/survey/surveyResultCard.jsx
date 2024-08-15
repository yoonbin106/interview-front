import React from 'react';
import SurveyResultLevelCard from '@/components/survey/surveyResultLevelCard';
import SurveyResultMajorCard from '@/components/survey/surveyResultMajorCard';

const SurveyResultCard = () => {
  return (
    <>
      <div className='resultcard-title'>
        <h2>가치관과 관련이 높은 직업</h2>
      </div>
      <SurveyResultLevelCard />
      <SurveyResultMajorCard />
    </>
  );
};

export default SurveyResultCard;
