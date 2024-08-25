import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/survey/surveyHome.module.css';
import axios from 'axios';

const SurveyResult = () => {
  const router = useRouter();
  const { userName, url } = router.query;
  const [validUrl, setValidUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [fileName, setFileName] = useState('value2024082416.pdf');
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
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
        const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);

        // 서버에서 받아온 텍스트를 리스트로 분리
        const extractedList = response.data.split('\n').map(item => item.trim()).filter(item => item);

        // 정리된 텍스트를 한 줄로 표시
        setExtractedText(extractedList.join(', '));
      } catch (error) {
        console.error('Error uploading file:', error);
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
      <div className={styles.surveyFrame}>
        <div className={styles.surveyCenterFrameWidth}>
          <div className={styles.surveyCenterFrameHeightResult}>
            <div className={styles.surveyMainResult}>
              <section className={styles.surveyMainSection}>
                <div className={styles.surveyTitle}>{userName}님의 직업가치관 검사 결과표</div>
                <div className={styles.surveySubTitleLineThank}>{userName}님 수고하셨습니다.</div>
                <div className={styles.surveySubTitleResult}>
                  <div className={styles.surveySubTitleLine}>
                    검사 결과는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를 알려주고, 
                    중요 가치를 충족시킬 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.
                  </div>
                </div>

                <div className={styles.surveyStartButtonFrame}>
                  <button 
                    onClick={handleShowIframe}
                    className={styles.surveyStartButtonResult}
                  >
                    결과보기
                  </button>
                </div>

                <div className={styles.surveyNotice}>
                  <div className={styles.surveySubTitleLineThank}>파일 다운로드 및 업로드 안내</div>
                  <p>
                    저희 시스템에서는 검사 결과를 정확히 보관하기 위해, 사용자께서 직접 결과표를 다운로드하고 이를 서버에 업로드하는 절차를 거칩니다.
                    이 절차를 통해 저장된 파일이 제대로 보관되고, 이후 언제든지 재확인이 가능하도록 하고자 합니다.
                  </p>
                  <p className={styles.thankYouNote}>
                    이 과정을 이해해 주셔서 감사합니다.
                  </p>
                </div>

                {showIframe && (
                  <div className={styles.iframeContainer}>
                    <iframe 
                      src={validUrl}
                      allowFullScreen
                    ></iframe>
                    <button 
                      onClick={() => setShowIframe(false)} 
                    >
                      닫기
                    </button>
                  </div>
                )}

                <div className={styles.surveyRecommendFrame}>
                  <div className={styles.surveySubTitleLineThank}>다음 파일을 서버에 업로드하세요:</div>
                  <p>다운로드된 파일 이름 (예시): <strong>{fileName}</strong></p>
                  <p>다운로드한 파일을 선택한 후 서버에 업로드하세요.</p>
                  <button onClick={handleManualFileSelect} className={styles.uploadButton}>
                    파일선택
                  </button>
                  <input 
                    type="file" 
                    id="fileInput" 
                    accept=".pdf" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                  />
                  {file && (
                    <div>
                      <p>선택된 파일: {file.name}</p>
                      <button onClick={handleFileUpload} className={styles.uploadButton}>
                        서버 업로드
                      </button>
                    </div>
                  )}
                </div>

                {extractedText && (
                  <div className={styles.extractedTextContainer}>
                    <h3>추출된 정보:</h3>
                    <p>{extractedText}</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyResult;
