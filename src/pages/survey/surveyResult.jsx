import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/survey/surveyHome.module.css';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingSpinner from '@/components/search/LoadingSpinner'; // Import your spinner component

const SurveyResult = () => {
  const router = useRouter();
  const { url } = router.query;
  const [validUrl, setValidUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [fileName, setFileName] = useState('value2024082416.pdf');
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');  
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedUserName = localStorage.getItem('username'); 

    if (storedEmail) {
      setEmail(storedEmail);
    }

    if (storedUserName) {
      setUserName(storedUserName);  
    }

    if (url) {
      const decodedUrl = decodeURIComponent(url);
      setValidUrl(decodedUrl);
    }

    setFileName('value2024082416.pdf');
  }, [url]);

  const handleShowIframe = () => {
    setShowIframe(true);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file && email) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      try {
        setLoading(true); // Start loading
        const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);

        const jobList = response.data.split('\n').map(item => item.trim()).filter(item => item);

        const gptResponse = await axios.post('http://localhost:8080/api/survey/chatgpt', {
          jobList: jobList,
          userName: userName  
        });

        setExtractedText(gptResponse.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false); // End loading
      }
    } else {
      alert('Please select a file to upload and ensure user is logged in.');
    }
  };

  const handleManualFileSelect = () => {
    document.getElementById('fileInput').click();
  };

  if (!validUrl) {
    return <div>결과 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <>
      <Head>
        <title>직업가치관검사 - 결과표</title>
      </Head>
      <div className={styles.surveyFrame1}>
        <div className={styles.surveyCenterFrameWidth}>
          <div className={styles.surveyCenterFrameHeightResult1}>
            <div className={styles.surveyMainResult1}>
              <section className={styles.surveyMainSection1}>
                <div className={styles.surveyTitle}>{userName}님의 직업가치관 검사 결과표</div>
                <div className={styles.surveySubTitleLineThank}>{userName}님 수고하셨습니다.</div>
                <div className={styles.surveySubTitleResult}>
                  <div className={styles.surveySubTitleLine}>
                    검사 결과는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를 알려주고, 
                    중요 가치를 충족시킬 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.
                  </div>
                </div>

                <div className={styles.surveyStartButtonFrame}>
                  <Button 
                    onClick={handleShowIframe}
                    variant="contained"
                    color="primary"
                    className={styles.surveyStartButtonResult}
                  >
                    결과보기
                  </Button>
                </div>

                <div className={styles.surveyNotice}>
                  <div className={styles.surveySubTitleLineThank}>파일 다운로드 및 업로드 안내</div>
                  <div className={styles.surveySubTitleResultx}>
                    저희 시스템에서는 검사 결과를 정확히 보관하기 위해, 사용자께서 직접 결과표를 다운로드하고 이를 서버에 업로드하는 절차를 거칩니다.
                    이 절차를 통해 저장된 파일이 제대로 보관되고, 이후 언제든지 재확인이 가능하도록 하고자 합니다.
                  </div>
                  <p className={styles.surveySubTitleResultx}>
                    이 과정을 이해해 주셔서 감사합니다.
                  </p>
                </div>

                {showIframe && (
                  <div className={styles.iframeContainer}>
                    <iframe 
                      src={validUrl}
                      allowFullScreen
                    ></iframe>
                    <Button 
                      onClick={() => setShowIframe(false)} 
                      variant="contained"
                      
                    >
                      닫기
                    </Button>
                  </div>
                )}

                <div className={styles.surveyRecommendFrame}>
                  <div className={styles.surveySubTitleLineThank}>다음 파일을 서버에 업로드하세요:</div>
                  <p>다운로드된 파일 이름 (예시): <strong>{fileName}</strong></p>
                  <div className={styles.surveySubTitleResultx} style={{ marginBottom: '16px' }}>
                    다운로드한 파일을 선택한 후 서버에 업로드하세요.
                  </div>

                  <Button 
                    onClick={handleManualFileSelect} 
                    variant="outlined"
                    className={styles.uploadButton}
                  >
                    파일선택
                  </Button>
                  <input 
                    type="file" 
                    id="fileInput" 
                    accept=".pdf" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                  />
                  {file && (
                    <div>
                    <p style={{ marginTop: '16px', marginBottom: '16px' }}>
                      선택된 파일: <strong>{file.name}</strong>
                    </p>

                      <Button 
                        onClick={handleFileUpload} 
                        variant="contained"
                        color="primary"
                        className={styles.uploadButton}
                      >
                        서버업로드
                      </Button>
                    </div>
                  )}
                </div>

                {loading && <LoadingSpinner />} {/* Show spinner while loading */}

                {extractedText && (
                 <Card sx={{ 
                  marginTop: 3, 
                  border: '1px solid #ddd',  // 카드 테두리 색상 및 두께 설정
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // 부드러운 그림자 효과
                  borderRadius: '8px'  // 모서리를 둥글게 설정하여 부드러운 느낌
                }}>
                 <CardContent>
  <Typography 
    variant="h6" 
    gutterBottom 
    className={styles.surveySubTitleLineThank}
  >
    {userName}님의 회사 추천 결과입니다:
  </Typography>

  {extractedText.split('\n').map((line, index) => {
    // 특정 텍스트에만 색상 적용
    const isHighlighted = line.includes("직업 이름 6개") || line.includes("각 직업에 대한 회사 추천 목록");
    
    return (
      <Typography 
        key={index} 
        variant="body1" 
        paragraph 
        sx={{ 
          color: isHighlighted ? '#5A8AF2' : '#868686',  // 특정 텍스트만 색상 적용
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.3'
        }}
      >
        {line}
      </Typography>
    );
  })}
</CardContent>

                </Card>
                
                )}

                {extractedText && (
                <>
                  <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ textAlign: 'center', marginTop: '24px' }} 
                  className={styles.surveySubTitleLineThank}
                >
                  AI 면접 및 이력서 첨삭 서비스로 한 발 더 나아가세요!
                </Typography>

                  <Typography variant="body2" paragraph className={styles.surveySubTitleResultx}>
                    저희는 단순한 직업 추천을 넘어, 여러분이 취업 준비 과정에서 최고의 성과를 낼 수 있도록 돕고자 합니다.
                    AI 면접 시뮬레이션과 전문적인 이력서 첨삭 서비스를 통해 지원하는 회사에서 돋보일 수 있도록 도와드립니다.
                    지금 바로 아래 버튼을 클릭하여, 취업 성공의 길로 한 걸음 더 나아가세요.
                  </Typography>

                                <Button 
                onClick={() => router.push('/resume')} 
                variant="contained"
                color="primary"
                className={styles.directButton}
                sx={{ marginBottom: '16px' }}  // margin-bottom 추가
              >
                AI 면접 및 이력서 첨삭 서비스로 이동하기
              </Button>

                </>
              )}
              {/* 추가된 AI 서비스 섹션 끝 */}

              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyResult;
