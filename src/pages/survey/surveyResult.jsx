import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/survey/surveyHome.module.css';
import axios from 'axios';

const SurveyResult = () => {
  const router = useRouter();
  const { userName, url } = router.query;
  const [validUrl, setValidUrl] = useState('');
  const [showIframe, setShowIframe] = useState(false);  // iFrame 표시 여부 상태
  const [fileName, setFileName] = useState('value20240824.pdf');  // 하드코딩된 파일 이름 상태
  const [file, setFile] = useState(null);  // 사용자가 선택한 파일 상태
  const [email, setEmail] = useState('');  // 로컬스토리지에서 불러온 이메일
  const [extractedText, setExtractedText] = useState(''); // 서버에서 받아온 추출된 텍스트

  useEffect(() => {
    // 로컬스토리지에서 이메일을 가져옴
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    if (url) {
      const decodedUrl = decodeURIComponent(url);
      setValidUrl(decodedUrl);
    }

    // 하드코딩된 파일 이름을 설정 (예시로 보여주는 파일 이름)
    setFileName('value20240824.pdf');
  }, [url]);

  const handleShowIframe = () => {
    setShowIframe(true);  // 버튼 클릭 시 iFrame을 표시하도록 설정
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (file && email) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);  // 이메일을 함께 전송

      try {
        const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);
        setExtractedText(response.data); // 서버에서 받아온 추출된 텍스트를 상태에 저장
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
                    onClick={handleShowIframe}  // 버튼 클릭 시 iFrame을 표시하도록 설정
                    className={styles.surveyStartButtonResult}
                  >
                    결과보기
                  </button>
                </div>

                {/* 사용자 안내 메시지 */}
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

                {/* iFrame을 동적으로 표시 */}
                {showIframe && (
                  <div 
                    className={styles.iframeContainer} 
                    style={{
                      position: 'fixed', 
                      top: '0', 
                      left: '0', 
                      width: '100%', 
                      height: '100%', 
                      zIndex: '1000', 
                      backgroundColor: 'white'
                    }}
                  >
                    <iframe 
                      src={validUrl}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                    ></iframe>
                    <button 
                      onClick={() => setShowIframe(false)} 
                      style={{
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        padding: '10px 20px', 
                        zIndex: '1001', 
                        backgroundColor: '#000', 
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                      }}
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
                    파일 선택하기
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
                        서버에 파일 업로드
                      </button>
                    </div>
                  )}
                </div>

                {/* 추출된 텍스트를 화면에 표시 */}
                {extractedText && (
                  <div className={styles.extractedTextContainer}>
                    <h3>추출된 정보:</h3>
                    <pre>{extractedText}</pre>
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
