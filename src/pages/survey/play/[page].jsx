import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SurveyMyProgressBar from '@/components/survey/surveyMyProgressBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetQuestionAPI, PostResultAPI, Q_NUM, API_KEY } from '@/api/surveyApi';
import Box from '@mui/joy/Box';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import Sheet from '@mui/joy/Sheet';
import FormHelperText from '@mui/joy/FormHelperText';
import styles from '@/styles/survey/surveyExample.module.css';
import Head from 'next/head';
import SurveyHome from '..';


const SurveyPlay = () => {
  const router = useRouter();
  const { page } = router.query;
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(page) - 1 || 0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userName, setUserName] = useState(''); // 초기 상태 빈 문자열
  const [gender, setGender] = useState(''); // 초기 상태 빈 문자열
  const isLastPage = currentPage === Math.ceil(questions.length / QUESTIONS_PER_PAGE) - 1;

  const QUESTIONS_PER_PAGE = 7;

  useEffect(() => {
    const storedUserName = localStorage.getItem('username');
    const storedGender = localStorage.getItem('gender');
  
    if (storedUserName) setUserName(storedUserName);
    if (storedGender) setGender(storedGender);
  }, []);

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

  useEffect(() => {
    setCurrentPage(Number(page) - 1 || 0);
  }, [page]);

  const handleAnswerSelect = (index, answer) => {
    const answerValue = questions[index].answer01 === answer ? 1 : 2;
  
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: answerValue,  // 1 또는 2를 그대로 저장
    }));
  };

  const handleNextPage = () => {
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;

    const allAnswered = questions.slice(startIndex, endIndex).every(
      (_, index) => selectedAnswers[startIndex + index] !== undefined
    );

    if (!allAnswered) {
      return toast('모든 질문에 답변해주세요.', {
        className: 'custom-toast',
        draggable: true,
        position: 'bottom-center',
      });
    }

    if (currentPage < Math.ceil(questions.length / QUESTIONS_PER_PAGE) - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      router.push(`/survey/play/${nextPage + 1}`);
    } else {
      submitSurvey();
    }
  };

  const handlePrevPage = () => {
    if (currentPage === 0) {
      router.push('/survey/surveyExample'); // 첫 페이지일 때 /SurveyExample으로 이동
    } else {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      router.push(`/survey/play/${prevPage + 1}`);
    }
  };

  const submitSurvey = async () => {
    const formattedAnswers = Object.entries(selectedAnswers)
      .map(([key, value]) => {
        // key는 질문의 인덱스 (0부터 시작)
        const baseValue = Number(key) * 2 + 1;
        const adjustedValue = baseValue + (value - 1); // value가 1이면 baseValue, 2면 baseValue + 1
        return `B${Number(key) + 1}=${adjustedValue}`;
      })
      .join(' ');

    const postData = {
      apikey: API_KEY,
      qestrnSeq: Q_NUM,
      trgetSe: '100209',
      name: userName,
      gender: gender === 'men' ? '100323' : '100324',
      school: '',
      grade: '',
      email: '',
      startDtm: Date.now(),
      answers: formattedAnswers,
    };
    try {
      const response = await PostResultAPI(postData);
      const resultData = response.data.RESULT;
      const url = resultData.url;
      const encodedUrl = encodeURIComponent(url);
     // 쿼리 파라미터를 객체로 전달
      router.push({
        pathname: '/survey/surveyResult',
        query: { userName, url: encodedUrl },
      });



    } catch (error) {
      console.error('Error submitting survey:', error);
      toast.error('설문 제출 중 오류가 발생했습니다.');
    }
  };

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, endIndex);

  return (
    <>
      <Head>
        <title>검사 - 직업가치관검사</title>
      </Head>

      <div className={styles.surveyFramePlay}>
        <div className={styles.surveyCenterFrameWidth}>
          <div className={styles.surveyCenterFrameHeightPlay}>

            <div className={styles.SurveyMyProgressBar}>
              <SurveyMyProgressBar Percentage={progressPercentage} />
            </div>

            <div className={styles.surveyMainPlay}>
              <section className={styles.surveyMainSection}>

                <div className="example-container">
                  <div className={styles.surveyTitle}>검사</div>
                  <div className={styles.surveySubTitle}>
                    <div className={styles.surveySubTitleLine}>
                      직업과 관련된 두개의 가치 중에서 자기에게 더 중요한 가치에 표시하세요.
                    </div>
                    <div className={styles.surveySubTitleLine}>
                      가치의 뜻을 잘 모르겠다면 문항 아래에 있는 가치의 설명을 확인해보세요.
                    </div>
                  </div>

                  {currentQuestions.map((question, index) => (
                    <div key={question.qitemNo} className={styles.surveyQuestionCard}>
                      <div className={styles.surveyQuestion}>{question.question}</div>

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
                                  selectedAnswers[startIndex + index] === 1
                                    ? '#5A8AF2'
                                    : '#E6E6E6',
                              }}
                            >
                              <Checkbox
                                overlay
                                label={question.answer01}
                                name={`question-${question.qitemNo}`}
                                value={question.answer01}
                                checked={selectedAnswers[startIndex + index] === 1}
                                onChange={() => handleAnswerSelect(startIndex + index, question.answer01)}
                                slotProps={{
                                  action: {
                                    className: selectedAnswers[startIndex + index] === 1
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
                              <FormHelperText>{question.answer03}</FormHelperText>
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
                                  selectedAnswers[startIndex + index] === 2
                                    ? '#5A8AF2'
                                    : '#E6E6E6',
                              }}
                            >
                              <Checkbox
                                overlay
                                label={question.answer02}
                                name={`question-${question.qitemNo}`}
                                value={question.answer02}
                                checked={selectedAnswers[startIndex + index] === 2}
                                onChange={() => handleAnswerSelect(startIndex + index, question.answer02)}
                                slotProps={{
                                  action: {
                                    className: selectedAnswers[startIndex + index] === 2
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
                              <FormHelperText>{question.answer04}</FormHelperText>
                            </Sheet>
                          </Box>
    
                        </div>
                      </div>
    
                    </div>
                  ))}
                </div>
    
  
              <div className={styles.surveyStartButtonFrame}>
              <button 
                className={styles.surveyPrevButton}
                onClick={handlePrevPage}
              >
                이전
              </button>

              <div>{currentPage + 1} / 4</div>

              {!isLastPage && (
                <button
                  className={styles.surveyNextButton}
                  style={{
                    backgroundColor: Object.keys(selectedAnswers).length >= endIndex ? '#5A8AF2' : '#eaeaea',
                    border: Object.keys(selectedAnswers).length >= endIndex ? '3px solid #5A8AF2' : '3px solid #eaeaea',
                  }}
                  onClick={handleNextPage}
                >
                  다음
                </button>
              )}

              {isLastPage && (
                <button
                  className={styles.surveySubmitButton}
                  style={{
                    backgroundColor: Object.keys(selectedAnswers).length >= totalQuestions ? '#5A8AF2' : '#eaeaea',
                    border: Object.keys(selectedAnswers).length >= totalQuestions ? '3px solid #5A8AF2' : '3px solid #eaeaea',
                  }}
                  onClick={submitSurvey}
                >
                  제출
                </button>
              )}
            </div>

            <ToastContainer autoClose={5000} />
            {currentPage < Math.ceil(questions.length / QUESTIONS_PER_PAGE) - 1 ? '다음' : '제출'}
          </section>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default SurveyPlay;