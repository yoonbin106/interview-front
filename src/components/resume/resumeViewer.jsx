import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResumeViewer() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const resumeId = 11; // 이력서 ID를 하드코딩 (이후 동적으로 변경 가능)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // 서버로부터 PDF를 가져옵니다.
        const response = await axios.get(`http://localhost:8080/api/resume/download/${resumeId}`, {
          responseType: 'blob',
        });

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error('이력서 불러오기 오류:', error);
      }
    };

    fetchResume();

    // 컴포넌트 언마운트 시 PDF URL 해제
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [resumeId]);

  return (
    <div>
      {pdfUrl ? (
        <embed src={pdfUrl} width="600" height="800" type="application/pdf" />
      ) : (
        <p>이력서를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default ResumeViewer;
