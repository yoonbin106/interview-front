//adminRegisterButton.jsx

import React from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

const RegisterButton = ({ to }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(to);
    };
    return (
        <Button variant="contained" 
        sx={{
            backgroundcolor: '#007bff',
            '&hover':{
                backgroundColor: '#0056b3',
            }
        }}
        onClick={handleClick}>
            글 등록
        </Button>
    );
};
export default RegisterButton;