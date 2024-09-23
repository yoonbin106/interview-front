import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SurveyMyProgressBar from '@/components/survey/surveyMyProgressBar';
import { toast, ToastContainer } from 'react-toastify';
import { GetQuestionAPI } from '@/api/surveyApi'; // 필요한 API만 가져옵니다.
import Box from '@mui/joy/Box';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import Sheet from '@mui/joy/Sheet';
import FormHelperText from '@mui/joy/FormHelperText';
import styles from '@/styles/survey/surveyExample.module.css';

const SurveyExample = () => {
  const router = useRouter();
  const { name, gender } = router.query;
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await GetQuestionAPI();
        setQuestions(result);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };
  

  const handleNextPage = () => {
    router.push({
      pathname: '/survey/play/1',
      query: { name, gender }
    });
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const startIndex = currentPage * 1; // 예시 문항은 한 개만 보여줍니다.
  const currentQuestion = questions[startIndex];

  return (
    <>
      <Head>
        <title>검사예시 - 직업가치관검사</title>
      </Head>

      <div className={styles.surveyFrame}>
        <div className={styles.surveyCenterFrameWidth}>
          <div className={styles.surveyCenterFrameHeight}>
            <div className={styles.surveyMain}>
              <section className={styles.surveyMainSection}>
                <div className="example-container">
                <div className={styles.surveyTitle}>직업가치관검사</div>
                <div className={styles.surveySubTitle}>
                  <div className={styles.surveySubTitleLine}>커리어넷의 진로심리검사를 제공합니다.</div>
                  <div className={styles.surveySubTitleLine}>커리어넷 진로심리검사 API는 이용량에 따라 사용이 제한될 수 있습니다.</div>
                </div>
                  <div className={styles.surveyTitle}>검사예시</div>
                  <div className={styles.surveySubTitle}>
                    <div className={styles.surveySubTitleLine}>
                      직업과 관련된 두개의 가치 중에서 자기에게 더 중요한 가치에 표시하세요.
                    </div>
                    <div className={styles.surveySubTitleLine}>
                      가치의 뜻을 잘 모르겠다면 문항 아래에 있는 가치의 설명을 확인해보세요.
                    </div>
                  </div>

                  {currentQuestion && (
                    <div key={currentQuestion.qitemNo} className={styles.surveyQuestionCard}>
                      <div className={styles.surveyQuestion}>{currentQuestion.question}</div>

                      <div className={styles.surveyAnswers}>
                        <div>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              width: 460,
                              '& > div': { p: 2, borderRadius: 'md', display: 'flex' },
                            }}
                          >
                            <Sheet
                              variant="outlined"
                              sx={{
                                flexDirection: 'column',
                                borderColor:
                                  selectedAnswers[startIndex] === currentQuestion.answer01
                                    ? '#5A8AF2'
                                    : '#E6E6E6',
                              }}
                            >
                              <Checkbox
                                overlay
                                label={currentQuestion.answer01}
                                name={`question-${currentQuestion.qitemNo}`}
                                value={currentQuestion.answer01}
                                checked={selectedAnswers[startIndex] === currentQuestion.answer01}
                                onChange={(e) => handleAnswerSelect(startIndex, currentQuestion.answer01)}
                                slotProps={{
                                  action: {
                                    className: selectedAnswers[startIndex] === currentQuestion.answer01
                                      ? `${checkboxClasses.checked} custom-checked`
                                      : 'custom-unchecked',
                                  },
                                }}
                                sx={{
                                  '&.custom-checked': {
                                    color: 'primary.main',
                                    '&:hover': {
                                      color: 'primary.dark',
                                    },
                                  },
                                  '&.custom-unchecked': {
                                    color: 'gray',
                                  },
                                }}
                              />
                              <FormHelperText>{currentQuestion.answer03}</FormHelperText>
                            </Sheet>
                          </Box>
                        </div>

                        <div>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              width: 460,
                              '& > div': { p: 2, borderRadius: 'md', display: 'flex' },
                            }}
                          >
                            <Sheet
                              variant="outlined"
                              sx={{
                                flexDirection: 'column',
                                borderColor:
                                  selectedAnswers[startIndex] === currentQuestion.answer02
                                    ? '#5A8AF2'
                                    : '#E6E6E6',
                              }}
                            >
                              <Checkbox
                                overlay
                                label={currentQuestion.answer02}
                                name={`question-${currentQuestion.qitemNo}`}
                                value={currentQuestion.answer02}
                                checked={selectedAnswers[startIndex] === currentQuestion.answer02}
                                onChange={() => handleAnswerSelect(startIndex, currentQuestion.answer02)}
                                slotProps={{
                                  action: {
                                    className: selectedAnswers[startIndex] === currentQuestion.answer02
                                      ? `${checkboxClasses.checked} custom-checked`
                                      : 'custom-unchecked',
                                  },
                                }}
                                sx={{
                                  '&.custom-checked': {
                                    color: 'primary.main',
                                    '&:hover': {
                                      color: 'primary.dark',
                                    },
                                  },
                                  '&.custom-unchecked': {
                                    color: 'gray',
                                  },
                                }}
                              />
                              <FormHelperText>{currentQuestion.answer04}</FormHelperText>
                            </Sheet>
                          </Box>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.surveyStartButtonFrame}>
                 
                  <ToastContainer autoClose={5000} />
                  <button className={styles.surveyNextButton} onClick={handleNextPage}>
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

export default SurveyExample;