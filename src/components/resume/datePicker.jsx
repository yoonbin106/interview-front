import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/resume/resumeForm.module.css';

function DatePickerInput({ placeholder }) {
  const [startDate, setStartDate] = useState(null);

  return (
    <div className={styles.datePickerContainer}>
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        className={styles.datePickerInput}
        
      />
      <FontAwesomeIcon icon={faCalendarDays} className={styles.calendarIcon} />
    </div>
  );
}

export default DatePickerInput;
