import React, { useEffect,useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetJob, actionSetMajor, init } from '@/stores/surveyAction';
import Head from 'next/head';
import SurveyNowDate from '@/components/survey/surveyNowDate';
import SurveyResultCard from '@/components/survey/surveyResultCard';
import SurveyResultGraph from '@/components/survey/surveyResultGraph';
import axios from 'axios';
import styles from '@/styles/survey/surveyHome.module.css';

const SurveyResult = () => {
  const router = useRouter();
  const { userName, url } = router.query;
  const [validUrl, setValidUrl] = useState('');

  useEffect(() => {
    if (url) {
      const decodedUrl = decodeURIComponent(url);
      setValidUrl(decodedUrl);
    }
  }, [url]);

  if (!validUrl) {
    return <div>결과 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>직업가치관검사 - 결과표</title>
      </Head>
      <div className={styles.surveyFrame}>
        <div className={styles.surveyCenterFrameWidth}>
          <div className={styles.surveyCenterFrameHeightResult}>

            <div className={styles.surveyMainResult}>
              <section className={styles.surveyMainSection}>
                <div className={styles.surveyTitle}>{userName}님의 직업가치관 검사 결과표</div>
                <div className={styles.surveySubTitleLineThank}>{userName}님 수고하셨습니다.</div>
                <div className={styles.surveySubTitleResult}>
                    <div className={styles.surveySubTitleLine}>
                      검사결과는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를 알려주고, 중요 가치를 충족시킬 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.
                    </div>
                </div>
                
                <div className={styles.surveyStartButtonFrame}>
                <a href={`${validUrl}`} target="_blank" rel="noopener noreferrer" className={styles.surveyStartButtonResult}>
                  결과보기
                </a>

                </div>
                <div className={styles.surveyRecommendFrame}>
                <div className={styles.surveySubTitleLineThank}>추천 회사</div>
                <div className={styles.surveyRecommendGrid}>
                  <div className={styles.surveyRecommendCard}>
                    <img src={`/images/logo1.png`} alt="회사1" className={styles.surveyRecommendLogo} />
                  </div>
                  <div className={styles.surveyRecommendCard}>
                    <img src={`/images/logo2.png`} alt="회사2" className={styles.surveyRecommendLogo} />
                  </div>
                  <div className={styles.surveyRecommendCard}>
                    <img src={`/images/logo3.png`} alt="회사3" className={styles.surveyRecommendLogo} />
                  </div>
                  <div className={styles.surveyRecommendCard}>
                    <img src={`/images/logo4.png`} alt="회사4" className={styles.surveyRecommendLogo} />
                  </div>
                  <div className={styles.surveyRecommendCard}>
                    <img src={`/images/logo5.png`} alt="회사5" className={styles.surveyRecommendLogo} />
                  </div>
                </div>
              </div>

              </section>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyResult;