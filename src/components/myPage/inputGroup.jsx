import React from "react";
import styles from '@/styles/myPage/passwordChange.module.css';
import LockIcon from '@mui/icons-material/Lock';

const InputGroup = ({ label, placeholder }) => {
    return (
        <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
                <LockIcon/>
                <span>{label}</span>
            </label>
            <div className={styles.inputWrapper}>
                <input type="password" className={styles.input} placeholder={placeholder} aria-label={label} />
            </div>
        </div>
    );
};

export default InputGroup;