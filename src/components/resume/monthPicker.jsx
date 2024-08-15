import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { ko } from 'date-fns/locale';
import styles from '@/styles/resume/resumeForm.module.css';

registerLocale('ko', ko);

function MonthPickerInput({ placeholder }) {
  const [startDate, setStartDate] = useState(null);

  return (
    <div className={styles.monthPickerContainer}>
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        placeholderText={placeholder}
        dateFormat="yyyy-MM"
        showMonthYearPicker
        locale="ko"
        className={styles.monthPickerInput}
      />
      <FontAwesomeIcon icon={faCalendarDays} className={styles.calendarIcon} />
    </div>
  );
}

export default MonthPickerInput;
