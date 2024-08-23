import React from "react";
import styles from '@/styles/myPage/passwordChange.module.css';
import LockIcon from '@mui/icons-material/Lock';

const InputGroup = ({ label, placeholder, value, onChange }) => {
    return (
        <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
                <LockIcon />
                <span>{label}</span>
            </label>
            <div className={styles.inputWrapper}>
                <input
                    type="password"
                    className={styles.input}
                    placeholder={placeholder}
                    value={value} // 추가된 부분
                    onChange={onChange} // 추가된 부분
                    aria-label={label}
                />
            </div>
        </div>
    );
};

export default InputGroup;