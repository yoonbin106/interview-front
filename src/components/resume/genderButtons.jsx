import React from 'react';
import styles from '@/styles/resume/resumeForm.module.css';

function GenderButtons({ selectedGender, setSelectedGender }) {
  return (
    <div className={styles.genderButtons}>
      <div
        className={`${styles.genderButton} ${selectedGender === '남자' ? styles.selected : ''}`}
        onClick={() => setSelectedGender('남자')}
      >
        남자
      </div>
      <div
        className={`${styles.genderButton} ${selectedGender === '여자' ? styles.selected : ''}`}
        onClick={() => setSelectedGender('여자')}
      >
        여자
      </div>
    </div>
  );
}

export default GenderButtons;
