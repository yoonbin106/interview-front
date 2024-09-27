import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { actionSetName, actionSetGender } from '@/stores/surveyAction';
import SurveyGenderChoice from '@/components/survey/surveyGenderChoice';
import TextField from '@mui/material/TextField';
import styles from '@/styles/survey/surveyHome.module.css';
import Head from 'next/head';
import { GetQuestionAPI } from '@/api/surveyApi';
import { actionGetQuestion } from '@/stores/surveyAction';

const SurveyHome = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('');
  const router = useRouter();

  const onChangeNameHandler = (e) => {
    setUserName(e.target.value);
  };

  const onChangeGenderHandler = (e) => {
    setGender(e.target.value);
  };

  const homeClickHandler = () => {
    dispatch(actionSetName(userName));
    dispatch(actionSetGender(gender));
    router.push('/survey/surveyExample');
  };

  const isButtonDisabled = userName === '' || gender === '';

  return (
    <>
      <Head>
        <title>직업가치관검사 - 메인홈</title>
      </Head>

      <div className={styles.surveyFrame}>
        <div className={styles.surveyCenterFrameWidth}>
          <div className={styles.surveyCenterFrameHeight}>
            <div className={styles.surveyMain}>
              <section className={styles.surveyMainSection}>
                <div className={styles.surveyTitle}>직업가치관검사</div>
                <div className={styles.surveySubTitle}>
                  <div className={styles.surveySubTitleLine}>커리어넷의 진로심리검사를 제공합니다.</div>
                  <div className={styles.surveySubTitleLine}>커리어넷 진로심리검사 API는 이용량에 따라 사용이 제한될 수 있습니다.</div>
                </div>

                <div className={styles.surveyNameTitle}>이름</div>

                <TextField
                  color="grey"
                  focused
                  placeholder="  이름을 입력하세요"
                  onChange={onChangeNameHandler}
                  value={userName}
                  sx={{
                    width: '540px',
                    height: '30px',
                    marginBottom: '40px'
                  }}
                />

                <SurveyGenderChoice onChangeHandler={onChangeGenderHandler} />
                <div className={styles.surveyStartButtonFrame}>
                  <button
                    className={styles.surveyStartButton}
                    disabled={isButtonDisabled}
                    onClick={homeClickHandler}>
                    시작하기
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyHome;