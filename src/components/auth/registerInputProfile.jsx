import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/login/registerInputProfile.module.css';
import { singUp } from '@/api/user';

const SignUpProfile = ({ goToNext, goBack, formObject }) => {
  const router = useRouter();
  // const { query } = router;
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        alert('사진파일(png, jpg 등)만 업로드 가능합니다.');
        setFileName('');
        setPreview(null);
        setProfileImage(null);
        return;
      }
      setFileName(file.name);
      setProfileImage(file);  // 프로필 이미지를 상태로 저장
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('');
      setPreview(null);
      setProfileImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('profileImage', profileImage);

    // formObject의 모든 키-값 쌍을 formData에 추가
    for (const [key, value] of Object.entries(formObject)) {
      formData.append(key, value);
    }

    try {
      const response = await singUp(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // 다음 단계로 이동 (router.push 대신)
        goToNext(formObject);
        // router.push('/auth/registerEnd');
      } else {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <div className={styles.signUpProfileBox}>
        <h2 className="mb-3">프로필 설정</h2>
        <hr />
        <form onSubmit={handleSubmit}>
        <div className={styles.profileImageContainer}>
            <div className={styles.placeholder}>
              {preview ? <img src={preview} alt="profile" className={styles.profileImage} /> : null}
            </div>
            <input
              type="file"
              id="profileUpload"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <label htmlFor="profileUpload" className={styles.fileLabel}>
              프로필 첨부
            </label>
            <p className={styles.fileName}>{fileName || '미첨부시 기본 이미지'}</p>
          </div>
          <div className="btn-group d-flex justify-content-between">
            <button type="button" className="btn btn-primary me-2 rounded" onClick={goBack}>
              이전
            </button>
            <button type="submit" className="btn btn-secondary rounded">
              회원가입 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpProfile;